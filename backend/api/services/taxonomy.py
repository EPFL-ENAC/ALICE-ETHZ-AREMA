from importlib import resources
import yaml
from typing import Dict
from api.models.taxonomy import Taxonomy, TaxonomyNode, Term


class TaxonomyService:

    def __init__(self):
        pass

    def getAll(self) -> Taxonomy:
        """Get all taxonomies"""
        all = [self.get("natural-resource"), self.get("building-material"), self.get(
            "technical-construction"), self.get("building"), self.get("professional")]
        all.reverse()
        return Taxonomy(taxonomy=[taxo.taxonomy[0] for taxo in all])

    def get(self, type: str) -> Taxonomy:
        """Get a taxonomy by entity type"""
        package_name = "api.data"
        resource_name = f"{type}.yml"
        with resources.open_text(package_name, resource_name) as yaml_file:
            yaml_data = yaml.safe_load(yaml_file)
        taxonomy = Taxonomy(**yaml_data)
        return taxonomy

    def as_labels_map(self, taxonomy: Taxonomy, locale: str = "en") -> Dict[str, Term]:
        """"""
        labels_map = {}
        urn_prefix = "urn:arema:"
        for node in taxonomy.taxonomy:
            labels_map.update(self._as_labels_map(urn_prefix, node, locale))
        return labels_map

    def _as_labels_map(self, urn_prefix: str, node: TaxonomyNode, locale: str = "en") -> Dict[str, Term]:
        """From the taxonomy node, make a term per locale"""
        labels_map = {}
        urn = f"{urn_prefix}{node.id}" if urn_prefix.endswith(
            ":") else f"{urn_prefix}.{node.id}"
        for locale_key, name in node.names.items():
            if locale_key == locale:
                labels_map[name] = Term(urn=urn, locale=locale, name=name, description=node.descriptions.get(
                    locale) if node.descriptions else None)
        if node.children:
            for child in node.children:
                labels_map.update(self._as_labels_map(urn, child, locale))
        return labels_map
