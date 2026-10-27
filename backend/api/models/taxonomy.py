from pydantic import BaseModel


class ValueRange(BaseModel):
    """A named, optionally bounded numeric interval.

    None min/max means unbounded (e.g. min=None, max=50 → <50).
    Bounds are inclusive by default; set *_inclusive=False for strict inequalities.
    """

    id: str
    min: float | None = None  # None → no lower bound
    max: float | None = None  # None → no upper bound


class TaxonomyNode(BaseModel):
    id: str
    names: dict[str, str]
    descriptions: dict[str, str] | None = None
    attributes: dict[str, str] | None = None
    enum: list[str] | None = None
    ranges: list[ValueRange] | None = None
    # Recursive type for nesting
    children: list["TaxonomyNode"] | None = None


# Enable recursive types
TaxonomyNode.model_rebuild()


class Taxonomy(BaseModel):
    taxonomy: list[TaxonomyNode]


class Term(BaseModel):
    urn: str
    locale: str
    name: str
    description: str | None
