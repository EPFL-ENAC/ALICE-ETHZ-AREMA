from importlib import resources
import yaml
from api.models.taxonomy import Taxonomy


class TaxonomyService:

    def __init__(self):
        pass

    def get(self, type: str) -> Taxonomy:
        """Get a taxonomy by entity type"""
        package_name = "api.data"
        resource_name = f"{type}.yml"
        with resources.open_text(package_name, resource_name) as yaml_file:
            yaml_data = yaml.safe_load(yaml_file)
        taxonomy = Taxonomy(**yaml_data)
        return taxonomy
