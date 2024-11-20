from pydantic import BaseModel
from typing import List, Optional


class TaxonomyNode(BaseModel):
    id: str
    name: str
    description: Optional[str]
    # Recursive type for nesting
    children: Optional[List["TaxonomyNode"]] = None


# Enable recursive types
TaxonomyNode.model_rebuild()


class Taxonomy(BaseModel):
    taxonomy: List[TaxonomyNode]
