import datetime
import os
import shutil
import csv
from api.services.search import SearchService
from api.services.taxonomy import TaxonomyService, TAXONOMY_NAMES


class SnapshotService:
    """ Service to make a snapshot of the published content
        in a zip archive, containing csv files of each entity type,
        associated taxonomies as yaml files.
    """

    def __init__(self):
        pass

    async def create_snapshot(self):
        # Generate unique name for the files' base folder
        current_time = datetime.datetime.now()
        folder_name = str(current_time.timestamp()).replace('.', '')

        # Prepare local temp folder for csv files
        local_folder = f"/tmp/{folder_name}"
        os.makedirs(local_folder, exist_ok=True)
        local_entities_folder = f"{local_folder}/entities"
        os.makedirs(local_entities_folder, exist_ok=True)
        local_taxonomies_folder = f"{local_folder}/taxonomies"
        os.makedirs(local_taxonomies_folder, exist_ok=True)

        indexService = SearchService.fromIndex("entities")
        entity_types = [
            "natural-resource",
            "building-material",
            "technical-construction",
            "building",
            "professional",
            "physical-characteristics",
            "author"
        ]

        # Entities as csv files
        for entity in entity_types:
            query = {
                "query": {"bool": {"must": {"terms": {"entity_type": [entity]}}}}}
            result = indexService.search(query=query, skip=0, limit=1000)
            if result.total > 0:
                entities = result.data
                # Flatten list of dict into csv file
                csv_path = f"{local_entities_folder}/{entity}.csv"
                with open(csv_path, "w", newline="", encoding="utf-8") as f:
                    fieldnames = []
                    for e in entities:
                        fieldnames.extend(e.keys())
                    fieldnames = list(set(fieldnames))
                    writer = csv.DictWriter(f, fieldnames=fieldnames)
                    writer.writeheader()
                    writer.writerows(entities)

        # Taxonomies as yaml files
        taxoService = TaxonomyService()
        for type in TAXONOMY_NAMES:
            taxo_path = f"{local_taxonomies_folder}/{type}.yml"
            taxoService.copy_file(type, taxo_path)

        # Make a zip archive of the local folder
        shutil.make_archive(local_folder, 'zip', local_folder)

        # Clean up local temp folder
        shutil.rmtree(local_folder)

        # Return local path of the zip file
        return f"{local_folder}.zip"
