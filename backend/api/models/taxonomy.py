from pydantic import BaseModel
from typing import List, Optional


class TaxonomyLabel(BaseModel):
    locale: str
    label: str


class TaxonomyNode(BaseModel):
    id: str
    name: List[TaxonomyLabel]
    description: Optional[List[TaxonomyLabel]] = None
    # Recursive type for nesting
    children: Optional[List["TaxonomyNode"]] = None


# Enable recursive types
TaxonomyNode.model_rebuild()


class Taxonomy(BaseModel):
    taxonomy: List[TaxonomyNode]
