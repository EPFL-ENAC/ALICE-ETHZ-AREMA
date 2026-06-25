from pydantic import BaseModel
from typing import Dict, List, Optional


class ValueRange(BaseModel):
    """A named, optionally bounded numeric interval.

    None min/max means unbounded (e.g. min=None, max=50 → <50).
    Bounds are inclusive by default; set *_inclusive=False for strict inequalities.
    """
    id: str
    min: Optional[float] = None    # None → no lower bound
    max: Optional[float] = None    # None → no upper bound


class TaxonomyNode(BaseModel):
    id: str
    names: Dict[str, str]
    descriptions: Optional[Dict[str, str]] = None
    attributes: Optional[Dict[str, str]] = None
    enum: Optional[List[str]] = None
    ranges: Optional[List[ValueRange]] = None
    # Recursive type for nesting
    children: Optional[List["TaxonomyNode"]] = None


# Enable recursive types
TaxonomyNode.model_rebuild()


class Taxonomy(BaseModel):
    taxonomy: List[TaxonomyNode]


class Term(BaseModel):
    urn: str
    locale: str
    name: str
    description: Optional[str]
