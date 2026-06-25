import datetime
import os
import shutil
import csv
import logging

from api.services.search import SearchService
from api.services.taxonomy import TaxonomyService, TAXONOMY_NAMES
from api.services.s3 import s3_client


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
        local_files_folder = f"{local_folder}/files"
        os.makedirs(local_files_folder, exist_ok=True)

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
                    exclude_fields = [
                        "state", "created_at", "created_by", "updated_at", "updated_by", "published_by"]
                    fieldnames = [
                        f for f in fieldnames if f not in exclude_fields]
                    fieldnames = list(set(fieldnames))
                    # ensure field 'id' is first column
                    if "id" in fieldnames:
                        fieldnames.remove("id")
                        fieldnames.insert(0, "id")
                    writer = csv.DictWriter(f, fieldnames=fieldnames)
                    writer.writeheader()
                    # Write only the fields in fieldnames, and lists as empty strings if they are empty
                    rows = []
                    for e in entities:
                        row = {}
                        for f in fieldnames:
                            value = e.get(f, "")
                            if isinstance(value, list) and len(value) == 0:
                                value = ""
                            if f == "files" and isinstance(value, list):
                                # When file object, download file from s3 into local temp folder, and replace value with local url
                                for i, file in enumerate(value):
                                    if isinstance(file, dict) and "ref" in file:
                                        file_ref = file["ref"]
                                        filename = file_ref.get('name', '')
                                        local_file_path = f"{local_files_folder}/{filename}"
                                        await self._download_file(file_ref.get('path', ''), local_file_path)
                                        value[i] = {"file": filename}

                            row[f] = value
                        rows.append(row)
                    writer.writerows(rows)

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

    async def _download_file(self, s3_path: str, dest_path: str):
        """Download a file from S3 to a local destination path."""
        if not s3_path:
            return
        (body, content_type) = await s3_client.get_file(s3_path)
        # Check body is a byte-like object
        if not isinstance(body, (bytes, bytearray)):
            logging.error(
                f"Expected bytes-like object for file content {s3_path}, got {type(body)}")
            return
        # Write the file to the destination path
        with open(dest_path, "wb") as f:
            f.write(body)
