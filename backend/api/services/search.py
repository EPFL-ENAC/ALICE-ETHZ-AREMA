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
        """Add a new entity to the index

        Args:
            entity_type (str): The class of the entity
            entity (_type_): The entity object to add
            tags (list[str]): The associated tags
        """
        doc_id = f"{entity_type}:{entity.id}"
        doc = entity.model_dump()
        doc["entity_type"] = entity_type
        doc["tags"] = tags
        self._addDocument(doc_id, doc)

    def updateEntity(self, entity_type: str, entity, tags: list[str]):
        """Update an entity of the index

        Args:
            entity_type (str): The class of the entity
            entity (_type_): The entity object to add
            tags (list[str]): The associated tags
        """
        doc_id = f"{entity_type}:{entity.id}"
        doc = entity.model_dump()
        doc["entity_type"] = entity_type
        doc["tags"] = tags
        self._updateDocument(doc_id, doc)

    def deleteEntity(self, entity_type: str, entity_id: int):
        """Delete an entity from the index

        Args:
            entity_type (str): The class of the entity
            entity_id (int): The id of the entity
        """
        doc_id = f"{entity_type}:{entity_id}"
        self._deleteDocument(doc_id)

    def deleteEntities(self, entity_type: str):
        """Delete all entities of a given type

        Args:
            entity_type (str): The class of the entities
        """
        query = {"query": {"term": {"entity_type": entity_type}}}
        self._deleteDocuments(query)

    def refreshIndex(self):
        """Refresh the index to make changes visible
        """
        self._ensureIndex()
        self.client.indices.refresh(index=self.index_name)

    def deleteIndex(self):
        """Drop the index, its mapping definitions and all its data
        """
        self.client.indices.delete(
            index=self.index_name, ignore_unavailable=True)

    def search(self, query: dict, skip: int = 0, limit: int = 10):
        """Search documents in the index

        Args:
            query (dict): The Elasticsearch query object
            skip (int, optional): Documents to skip. Defaults to 0.
            limit (int, optional): Maximum count of documents to return. Defaults to 10.

        Returns:
            SearchResult: The result object
        """
        self._ensureIndex()
        res = self.client.search(
            index=self.index_name, body=query, from_=skip, size=limit)
        total = res["hits"]["total"]["value"]
        hits = [hit["_source"] for hit in res["hits"]["hits"]]
        return SearchResult(total=total, skip=skip, limit=limit, data=hits)

    # Internals

    def _addDocument(self, doc_id, doc):
        self._ensureIndex()
        self.client.index(index=self.index_name, id=doc_id, body=doc)

    def _updateDocument(self, doc_id, doc):
        self._deleteDocument(doc_id)
        self._addDocument(doc_id, doc)

    def _deleteDocument(self, doc_id):
        self._ensureIndex()
        self.client.delete(index=self.index_name, id=doc_id)

    def _deleteDocuments(self, query: dict):
        self._ensureIndex()
        self.client.delete_by_query(
            index=self.index_name, body=query, ignore_unavailable=True)

    def _ensureIndex(self):
        if not self.client.indices.exists(index=self.index_name):
            configuration = {
                "settings": {
                    "analysis": {
                        "analyzer": {
                            "ngram_analyzer": {
                                "type": "custom",
                                "tokenizer": "standard",
                                "filter": ["lowercase", "ngram_filter"]
                            }
                        },
                        "filter": {
                            "ngram_filter": {
                                "type": "ngram",
                                "min_gram": 3,  # minimum n-gram length
                                "max_gram": 4   # maximum n-gram length
                            }
                        }
                    }
                },
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
                configuration["mappings"]["properties"][field] = {
                    "type": "text",
                    "analyzer": "ngram_analyzer"
                }
            self.client.indices.create(
                index=self.index_name, body=configuration)
            self.client.indices.refresh(index=self.index_name)
            self.client.cluster.health(wait_for_status="yellow")
