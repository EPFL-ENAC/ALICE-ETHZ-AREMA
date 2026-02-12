from abc import ABC, abstractmethod
import copy
import re
from markdown_it import MarkdownIt
from elasticsearch import Elasticsearch
from api.config import config
from api.models.query import SearchResult

ENTITY_ANALYZED_FIELDS = ["name", "description", "article_top",
                          "article_bottom", "side_note", "address"]

VIDEO_ANALYZED_FIELDS = ["name", "legend"]


class IndexService(ABC):
    def __init__(self, index_name: str):
        self.client = Elasticsearch(config.ES_URL)
        self.index_name = index_name

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
        if self.client.exists(index=self.index_name, id=doc_id):
            self.client.delete(index=self.index_name, id=doc_id)

    def _deleteDocuments(self, query: dict):
        self._ensureIndex()
        self.client.delete_by_query(
            index=self.index_name, body=query, ignore_unavailable=True)

    @abstractmethod
    def _ensureIndex(self):
        """Ensure the index exists and has the correct mapping
        """
        pass


class EntityIndexService(IndexService):
    def __init__(self):
        super().__init__("entities")

    async def addEntity(self, entity_type: str, entity, tags: list[str], relates_to: list[str] = []):
        """Add a new entity to the index

        Args:
            entity_type (str): The class of the entity
            entity (_type_): The entity object to add
            tags (list[str]): The associated tags
        """
        doc_id = f"{entity_type}:{entity.id}"
        doc = await self.dumpModel(entity)
        doc["entity_type"] = entity_type
        doc["tags"] = tags
        doc["relates_to"] = relates_to
        self._addDocument(doc_id, doc)

    async def updateEntity(self, entity_type: str, entity, tags: list[str], relates_to: list[str] = []):
        """Update an entity of the index

        Args:
            entity_type (str): The class of the entity
            entity (_type_): The entity object to add
            tags (list[str]): The associated tags
        """
        doc_id = f"{entity_type}:{entity.id}"
        doc = await self.dumpModel(entity)
        doc["entity_type"] = entity_type
        doc["tags"] = tags
        doc["relates_to"] = relates_to
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

    async def dumpModel(self, entity):
        """Dump an entity model to a dict, including building elements if they exist

        Args:
            entity (_type_): The entity object to dump
        Returns:
            dict: The dumped entity
        """
        doc = entity.model_dump()
        if "long" in doc and "lat" in doc:
            doc["location"] = {"lat": doc["lat"], "lon": doc["long"]}
        return doc

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
                            },
                            "fuzzy_analyzer": {
                                "type": "custom",
                                "tokenizer": "standard",
                                "filter": ["lowercase"]
                            }
                        },
                        "filter": {
                            "ngram_filter": {
                                "type": "ngram",
                                "min_gram": 4,  # minimum n-gram length
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
                        "relates_to": {
                            "type": "keyword"
                        },
                        "entity_type": {
                            "type": "keyword"
                        },
                        "location": {
                            "type": "geo_point"
                        }
                    }
                }
            }
            for field in ENTITY_ANALYZED_FIELDS:
                configuration["mappings"]["properties"][field] = {
                    "type": "text",
                    "fields": {
                        "ngram": {
                            "type": "text",
                            "analyzer": "ngram_analyzer"
                        },
                        "fuzzy": {
                            "type": "text",
                            "analyzer": "fuzzy_analyzer"
                        },
                        "keyword": {
                            "type": "keyword"
                        }
                    }
                }
            self.client.indices.create(
                index=self.index_name, body=configuration)
            self.client.indices.refresh(index=self.index_name)
            self.client.cluster.health(wait_for_status="yellow")


class VideoIndexService(IndexService):
    def __init__(self):
        super().__init__("videos")

    def isVideoUrl(self, url: str):
        """Check if a given url is a video

        Args:
            url (str): The url to check

        Returns:
            bool: True if the url is a video
        """
        return url is not None and ("youtube.com" in url or "youtu.be" in url or "vimeo.com" in url or "srf.ch/play/tv" in url or "rts.ch/play/tv" in url)

    def addVideos(self, entity_type: str, entity, tags: list[str]):
        """Add videos of a new entity to the index

        Args:
            entity_type (str): The class of the entity
            entity (_type_): The entity object to add
        """
        for doc in self._getVideos(entity_type, entity, tags):
            self._addDocument(doc["id"], doc)

    def updateVideos(self, entity_type: str, entity, tags: list[str]):
        """Update videos of an entity of the index

        Args:
            entity_type (str): The class of the entity
            entity (_type_): The entity object to add
            tags (list[str]): The associated tags
        """
        for doc in self._getVideos(entity_type, entity, tags):
            self._updateDocument(doc["id"], doc)

    def deleteVideos(self, entity_type: str, entity_id: int = None):
        """Delete videos of an entity from the index

        Args:
            entity_type (str): The class of the entity
            entity_id (int): The id of the entity, optional
        """
        if entity_id:
            parent_id = f"{entity_type}:{entity_id}"
            query = {"query": {"term": {"parent_id": parent_id}}}
            self._deleteDocuments(query)
        else:
            query = {"query": {"term": {"entity_type": entity_type}}}
            self._deleteDocuments(query)

    def _getVideos(self, entity_type: str, entity, tags: list[str]):
        """Get videos of an entity

        Args:
            entity_type (str): The class of the entity
            entity (_type_): The entity object to add
            tags (list[str]): The associated tags

        Returns:
            list[dict]: The list of video documents 
        """
        docs = []
        docs += self._getVideosFromFiles(entity_type, entity, tags)
        for field in ["article_top", "article_bottom"]:
            if hasattr(entity, field):
                docs += self._getVideosFromField(field,
                                                 entity_type, entity, tags)
        return docs

    def _getVideosFromFiles(self, entity_type: str, entity, tags: list[str]):
        """Get videos of an entity from the files attribute

        Args:
            entity_type (str): The class of the entity
            entity (_type_): The entity object to add
            tags (list[str]): The associated tags

        Returns:
            list[dict]: The list of video documents 
        """
        if not hasattr(entity, "files") or not entity.files:
            return []
        docs = []
        parent_id = f"{entity_type}:{entity.id}"
        for idx, file in enumerate(entity.files):
            doc_id = f"{entity_type}:{entity.id}:file:{idx}"
            if "url" in file and self.isVideoUrl(file["url"]):
                doc = copy.deepcopy(file)
                doc["id"] = doc_id
                doc["name"] = entity.name
                doc["entity_type"] = entity_type
                doc["parent_id"] = parent_id
                doc["tags"] = tags
                docs.append(doc)
        return docs

    def _getVideosFromField(self, field, entity_type: str, entity, tags: list[str]):
        """Get videos of an entity from the files attribute

        Args:
            field (str): The field to search for videos
            entity_type (str): The class of the entity
            entity (_type_): The entity object to add
            tags (list[str]): The associated tags

        Returns:
            list[dict]: The list of video documents 
        """
        text = getattr(entity, field)
        if not text:
            return []
        docs = []
        parent_id = f"{entity_type}:{entity.id}"
        links = self.extract_all_links_with_text(text)
        for idx, link in enumerate(links):
            doc_id = f"{entity_type}:{entity.id}:{field}:{idx}"
            if "url" in link and self.isVideoUrl(link["url"]):
                doc = link
                doc["id"] = doc_id
                doc["name"] = entity.name
                doc["entity_type"] = entity_type
                doc["parent_id"] = parent_id
                doc["tags"] = tags
                docs.append(doc)
        return docs

    def extract_all_links_with_text(self, markdown_text):
        md = MarkdownIt()
        tokens = md.parse(markdown_text)
        links = []

        # Extract Markdown links
        for i, token in enumerate(tokens):
            if token.type == "link_open":
                href = [attr[1]
                        for attr in token.attrs if attr[0] == "href"][0]
                if i + 1 < len(tokens) and tokens[i + 1].type == "text":
                    legend = tokens[i + 1].content
                    links.append({"legend": legend, "url": href})

        # Extract plain URLs
        plain_url_pattern = r'(https?://[^\s]+)'
        plain_urls = re.findall(plain_url_pattern, markdown_text)

        for url in plain_urls:
            # Ensure plain URLs are not duplicates of Markdown links
            if not any(link["url"] == url for link in links):
                links.append({"legend": None, "url": url})

        return links

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
                            },
                            "fuzzy_analyzer": {
                                "type": "custom",
                                "tokenizer": "standard",
                                "filter": ["lowercase"]
                            }
                        },
                        "filter": {
                            "ngram_filter": {
                                "type": "ngram",
                                "min_gram": 4,  # minimum n-gram length
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
                        "parent_id": {
                            "type": "keyword"
                        },
                        "entity_type": {
                            "type": "keyword"
                        }
                    }
                }
            }
            for field in VIDEO_ANALYZED_FIELDS:
                configuration["mappings"]["properties"][field] = {
                    "type": "text",
                    "fields": {
                        "ngram": {
                            "type": "text",
                            "analyzer": "ngram_analyzer"
                        },
                        "fuzzy": {
                            "type": "text",
                            "analyzer": "fuzzy_analyzer"
                        },
                        "keyword": {
                            "type": "keyword"
                        }
                    }
                }
            self.client.indices.create(
                index=self.index_name, body=configuration)
            self.client.indices.refresh(index=self.index_name)
            self.client.cluster.health(wait_for_status="yellow")


class EntityIndexer:
    def __init__(self, entity_index_service: EntityIndexService = None, video_index_service: VideoIndexService = None):
        self.entityIndexService = entity_index_service or EntityIndexService()
        self.videoIndexService = video_index_service or VideoIndexService()

    async def addEntity(self, entity_type: str, entity, tags: list[str], relates_to: list[str] = []):
        """Add a new entity to the index

        Args:
            entity_type (str): The class of the entity
            entity (_type_): The entity object to add
            tags (list[str]): The associated tags
        """
        await self.entityIndexService.addEntity(
            entity_type, entity, tags, relates_to)
        self.videoIndexService.addVideos(entity_type, entity, tags)

    async def updateEntity(self, entity_type: str, entity, tags: list[str], relates_to: list[str] = []):
        """Update an entity of the index

        Args:
            entity_type (str): The class of the entity
            entity (_type_): The entity object to add
            tags (list[str]): The associated tags
        """
        await self.entityIndexService.updateEntity(
            entity_type, entity, tags, relates_to)
        self.videoIndexService.updateVideos(entity_type, entity, tags)

    def deleteEntity(self, entity_type: str, entity_id: int):
        """Delete an entity from the index

        Args:
            entity_type (str): The class of the entity
            entity_id (int): The id of the entity
        """
        self.entityIndexService.deleteEntity(entity_type, entity_id)
        self.videoIndexService.deleteVideos(entity_type, entity_id)

    def deleteEntities(self, entity_type: str):
        """Delete all entities of a given type

        Args:
            entity_type (str): The class of the entities
        """
        self.entityIndexService.deleteEntities(entity_type)
        self.videoIndexService.deleteVideos(entity_type)

    def deleteIndex(self):
        """Drop the index, its mapping definitions and all its data
        """
        self.entityIndexService.deleteIndex()
        self.videoIndexService.deleteIndex()


class SearchService:

    @classmethod
    def fromIndex(cls, index: str):
        if index == "entities":
            return EntityIndexService()
        if index == "videos":
            return VideoIndexService()
        raise ValueError(f"Unknown index: {index}")
