from importlib import resources
import yaml
from typing import Dict
from api.models.taxonomy import Taxonomy, TaxonomyNode, Term


class TaxonomyService:

    def __init__(self):
        pass

    def getAll(self) -> Taxonomy:
        """Get all taxonomies"""
        all = [
            self.get("natural-resource"),
            self.get("building-material"),
            self.get("technical-construction"),
            self.get("building"),
            self.get("professional"),
            self.get("physical-characteristics")]
        all.reverse()
        return Taxonomy(taxonomy=[taxo.taxonomy[0] for taxo in all])

    def get(self, type: str) -> Taxonomy:
        """Get a taxonomy by entity type"""
        package_name = "api.data"
        resource_name = f"{type}.yml"
        try:
            with resources.open_text(package_name, resource_name) as yaml_file:
                yaml_data = yaml.safe_load(yaml_file)
            return Taxonomy(**yaml_data)
        except FileNotFoundError:
            return Taxonomy(taxonomy=[])

    def as_labels_map(self, taxonomy: Taxonomy, locale: str = "en") -> Dict[str, Term]:
        """Return a map of localized label strings to Term objects for the given locale.

         The dictionary keys are taxonomy node names in the requested locale, and the
         values are `Term` instances containing the corresponding URN, localized name,
         locale, and description. Only labels for the requested locale are included.
         """
        labels_map = {}
        urn_prefix = "urn:arema:"
        for node in taxonomy.taxonomy:
            urn = f"{urn_prefix}{node.id}:"
            for child in node.children:
                labels_map.update(self._as_labels_map(urn, child, locale))
        return labels_map

    def _as_labels_map(self, urn_prefix: str, node: TaxonomyNode, locale: str = "en") -> Dict[str, Term]:
        """From the taxonomy node, make a term per locale"""
        labels_map = {}
        urn = f"{urn_prefix}{node.id}" if urn_prefix.endswith(
            ":") else f"{urn_prefix}.{node.id}"
        if node.children:
            for child in node.children:
                labels_map.update(self._as_labels_map(urn, child, locale))
        elif node.id == "other":
            return labels_map  # skip "other" nodes as they are too generic to be useful for matching
        elif node.names and locale in node.names:
            # Add the term for the current node
            labels_map[node.names.get(locale, node.id)] = Term(
                urn=urn,
                locale=locale,
                name=node.names.get(locale, node.id),
                description=node.descriptions.get(
                    locale) if node.descriptions else None,
                unit=node.unit
            )
        return labels_map
