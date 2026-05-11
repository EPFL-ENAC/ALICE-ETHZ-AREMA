from typing import Dict

from fastapi import APIRouter, Body, Query
from fastapi.responses import PlainTextResponse
from api.models.taxonomy import Term
from api.services.matcher import Matcher, MarkdownTransformer
from api.services.taxonomy import TaxonomyService

router = APIRouter()


@router.get("/{type}/_map", response_model=Dict[str, Term], response_model_exclude_none=True)
async def get_terms_map(type: str, locale: str = Query("en")) -> Dict[str, Term]:
    """Get a taxonomy by type and return its terms map

    Args:
      type (str): the taxonomy type to retrieve
      locale (str): the locale to use for retrieving term names and descriptions (default: "en")
    Returns:
      Dict[str, Term]: a mapping from term names to Term objects for the specified taxonomy and locale
    """
    service = TaxonomyService()
    taxonomy = service.get(type)
    terms = service.as_labels_map(taxonomy, locale)
    return terms


@router.post("/{types}/_match", response_class=PlainTextResponse)
async def match_terms(types: str, body: str = Body(..., media_type="text/plain"), locale: str = Query("en")) -> PlainTextResponse:
    """Match terms in the input text against the taxonomy of the given type and return the transformed text with markdown links.

    Args:
      types (str): the comma-separated taxonomy types to use for matching
      body (str): the input text to match, sent as raw text/plain in the request body
      locale (str): the locale to use for matching terms (default: "en")
    Returns:
      PlainTextResponse: the transformed text with matched terms replaced by markdown links
    """
    text = body.strip()
    service = TaxonomyService()
    taxonomy_types = types.split(",")
    taxonomies = [service.get(taxonomy_type)
                  for taxonomy_type in taxonomy_types]
    terms = {}
    for taxonomy in taxonomies:
        terms.update(service.as_labels_map(taxonomy, locale))
    matcher = Matcher(terms, allow_multiword_fuzzy=True, locale=locale)
    transformer = MarkdownTransformer(matcher)
    transformed = transformer.transform(text)
    return PlainTextResponse(transformed)
