from pydantic import BaseModel
from typing import Dict, List, Optional


class TaxonomyNode(BaseModel):
    id: str
    names: Dict[str, str]
    descriptions: Optional[Dict[str, str]] = None
    # Recursive type for nesting
    children: Optional[List["TaxonomyNode"]] = None


# Enable recursive types
TaxonomyNode.model_rebuild()


class Taxonomy(BaseModel):
    taxonomy: List[TaxonomyNode]
