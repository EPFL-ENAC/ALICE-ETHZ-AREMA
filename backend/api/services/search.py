from datetime import datetime
from elasticsearch import Elasticsearch
from api.config import config
from api.models.query import SearchResult


class IndexService:
    def __init__(self, index_name: str = "arema"):
        self.client = Elasticsearch(config.ES_URL)
        self.index_name = index_name

    def addEntity(self, entity_type: str, entity, tags: list[str]):
        doc_id = f"{entity_type}:{entity.id}"
        doc = entity.model_dump()
        doc["__type"] = entity_type
        doc["__tags"] = tags
        self.addDocument(doc_id, doc)

    def deleteEntities(self, entity_type: str):
        query = {"query": {"term": {"__type.keyword": entity_type}}}
        try:
            self.deleteDocuments(query)
        except Exception as e:
            print(str(e))

    def addDocument(self, doc_id, doc):
        self.client.index(index=self.index_name, id=doc_id, body=doc)

    def updateDocument(self, doc_id, doc):
        self.deleteDocument(doc_id)
        self.addDocument(doc_id, doc)

    def deleteDocument(self, doc_id):
        self.client.delete(index=self.index_name, id=doc_id)

    def deleteDocuments(self, query: dict):
        self.client.delete_by_query(index=self.index_name, body=query)

    def refreshIndex(self):
        self.client.indices.refresh(index=self.index_name)

    def deleteIndex(self):
        self.client.indices.delete(index=self.index_name)

    def search(self, query: dict, skip: int = 0, limit: int = 10):
        res = self.client.search(
            index=self.index_name, body=query, from_=skip, size=limit)
        total = res["hits"]["total"]["value"]
        hits = [hit["_source"] for hit in res["hits"]["hits"]]
        return SearchResult(total=total, skip=skip, limit=limit, data=hits)
