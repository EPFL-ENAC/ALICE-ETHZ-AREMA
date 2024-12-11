from datetime import datetime
from elasticsearch import Elasticsearch
from api.config import config
from api.models.query import SearchResult

ANALYZED_FIELDS = ["name", "description", "article_top",
                   "article_bottom", "side_note", "address"]


class IndexService:
    def __init__(self, index_name: str = "arema"):
        self.client = Elasticsearch(config.ES_URL)
        self.index_name = index_name

    def addEntity(self, entity_type: str, entity, tags: list[str]):
        doc_id = f"{entity_type}:{entity.id}"
        doc = entity.model_dump()
        doc["entity_type"] = entity_type
        doc["tags"] = tags
        self.addDocument(doc_id, doc)

    def deleteEntities(self, entity_type: str):
        query = {"query": {"term": {"entity_type": entity_type}}}
        self.deleteDocuments(query)

    def addDocument(self, doc_id, doc):
        self.ensureIndex()
        self.client.index(index=self.index_name, id=doc_id, body=doc)

    def updateDocument(self, doc_id, doc):
        self.deleteDocument(doc_id)
        self.addDocument(doc_id, doc)

    def deleteDocument(self, doc_id):
        self.ensureIndex()
        self.client.delete(index=self.index_name, id=doc_id)

    def deleteDocuments(self, query: dict):
        self.ensureIndex()
        self.client.delete_by_query(
            index=self.index_name, body=query, ignore_unavailable=True)

    def refreshIndex(self):
        self.ensureIndex()
        self.client.indices.refresh(index=self.index_name)

    def deleteIndex(self):
        self.client.indices.delete(
            index=self.index_name, ignore_unavailable=True)

    def search(self, query: dict, skip: int = 0, limit: int = 10):
        self.ensureIndex()
        res = self.client.search(
            index=self.index_name, body=query, from_=skip, size=limit)
        total = res["hits"]["total"]["value"]
        hits = [hit["_source"] for hit in res["hits"]["hits"]]
        return SearchResult(total=total, skip=skip, limit=limit, data=hits)

    def ensureIndex(self):
        if not self.client.indices.exists(index=self.index_name):
            mapping = mapping = {
                "mappings": {
                    "properties": {
                        "tags": {
                            "type": "keyword"
                        },
                        "entity_type": {
                            "type": "keyword"
                        }
                    }
                }
            }
            for field in ANALYZED_FIELDS:
                mapping["mappings"]["properties"][field] = {
                    "type": "text",
                    "analyzer": "standard"
                }
            self.client.indices.create(index=self.index_name, body=mapping)
            self.client.indices.refresh(index=self.index_name)
            self.client.cluster.health(wait_for_status="yellow")
