import pytest
from api.models.taxonomy import Term
from api.services.matcher import DEFAULT_STOPWORDS, Matcher, MarkdownTransformer


def make_term(urn: str, name: str, description: str = None) -> Term:
    return Term(urn=urn, locale="en", name=name, description=description)


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def simple_label_map():
    return {
        "concrete": make_term("urn:concrete", "Concrete"),
        "steel": make_term("urn:steel", "Steel"),
        "timber": make_term("urn:timber", "Timber"),
        "recycled brick": make_term("urn:recycled-brick", "Recycled Brick"),
        "glass wool": make_term("urn:glass-wool", "Glass Wool", description="Thermal insulation"),
    }


@pytest.fixture
def matcher(simple_label_map):
    return Matcher(simple_label_map)


@pytest.fixture
def matcher_with_logging(simple_label_map):
    return Matcher(simple_label_map, log_matches=True)


@pytest.fixture
def matcher_multiword_fuzzy(simple_label_map):
    return Matcher(simple_label_map, allow_multiword_fuzzy=True)


# ---------------------------------------------------------------------------
# _normalize
# ---------------------------------------------------------------------------

class TestNormalize:
    def test_lowercases(self, matcher):
        assert matcher._normalize("CONCRETE") == "concrete"

    def test_strips_punctuation(self, matcher):
        assert matcher._normalize("timber!") == "timber"
        assert matcher._normalize("steel, grade") == "steel grade"

    def test_collapses_whitespace(self, matcher):
        assert matcher._normalize("glass  wool") == "glass wool"
        assert matcher._normalize("  timber  ") == "timber"

    def test_preserves_hyphens(self, matcher):
        assert matcher._normalize("ultra-high") == "ultra-high"

    def test_none_returns_empty(self, matcher):
        assert matcher._normalize(None) == ""

    def test_empty_string(self, matcher):
        assert matcher._normalize("") == ""


# ---------------------------------------------------------------------------
# _should_skip
# ---------------------------------------------------------------------------

class TestShouldSkip:
    def test_empty_token(self, matcher):
        assert matcher._should_skip("") is True

    def test_single_char(self, matcher):
        assert matcher._should_skip("a") is True

    def test_numeric_token(self, matcher):
        assert matcher._should_skip("42") is True
        assert matcher._should_skip("3d") is True

    def test_stopword(self, matcher):
        for word in ["the", "of", "and"]:
            assert matcher._should_skip(word) is True

    def test_all_stopwords_multiword(self, matcher):
        # every part is a stopword
        assert matcher._should_skip("the and") is True

    def test_mixed_stopword_real_word(self, matcher):
        # one part is NOT a stopword
        assert matcher._should_skip("the concrete") is False

    def test_valid_token(self, matcher):
        assert matcher._should_skip("timber") is False


# ---------------------------------------------------------------------------
# _get_score_cutoff
# ---------------------------------------------------------------------------

class TestGetScoreCutoff:
    def test_very_short_token_requires_perfect(self, matcher):
        # len < 5 → max(base, 100) → 100
        assert matcher._get_score_cutoff("ab", 90) == 100

    def test_short_token(self, matcher):
        # len 5-7 → max(base, 97)
        assert matcher._get_score_cutoff("steel", 90) == 97  # len=5
        assert matcher._get_score_cutoff("timber", 90) == 97  # len=6

    def test_longer_token_uses_base(self, matcher):
        # len >= 8 → base_cutoff
        assert matcher._get_score_cutoff("concrete", 90) == 90  # len=8
        assert matcher._get_score_cutoff("recycled brick", 90) == 90


# ---------------------------------------------------------------------------
# match — exact
# ---------------------------------------------------------------------------

class TestMatchExact:
    def test_exact_match(self, matcher):
        term = matcher.match("concrete")
        assert term is not None
        assert term.urn == "urn:concrete"

    def test_exact_match_case_insensitive(self, matcher):
        term = matcher.match("STEEL")
        assert term is not None
        assert term.urn == "urn:steel"

    def test_exact_match_extra_spaces(self, matcher):
        term = matcher.match("  timber  ")
        assert term is not None
        assert term.urn == "urn:timber"

    def test_exact_match_extra_punctuation(self, matcher):
        term = matcher.match("  timber,  ")
        assert term is not None
        assert term.urn == "urn:timber"

    def test_exact_multiword_match(self, matcher):
        term = matcher.match("recycled brick")
        assert term is not None
        assert term.urn == "urn:recycled-brick"

    def test_term_with_description(self, matcher):
        term = matcher.match("glass wool")
        assert term is not None
        assert term.description == "Thermal insulation"


# ---------------------------------------------------------------------------
# match — trivial rejects
# ---------------------------------------------------------------------------

class TestMatchRejects:
    def test_empty_string(self, matcher):
        assert matcher.match("") is None

    def test_stopword(self, matcher):
        assert matcher.match("the") is None

    def test_numeric(self, matcher):
        assert matcher.match("123") is None

    def test_unknown_token(self, matcher):
        assert matcher.match("unobtanium") is None


# ---------------------------------------------------------------------------
# match — multiword fuzzy
# ---------------------------------------------------------------------------

class TestMatchMultiwordFuzzy:
    def test_multiword_no_fuzzy_by_default(self, matcher):
        # "recycled brik" is a near-miss of "recycled brick"; fuzzy disabled for multi-word
        result = matcher.match("recycled brik")
        assert result is None

    def test_multiword_fuzzy_enabled(self, matcher_multiword_fuzzy):
        # With fuzzy enabled, "recycled brik" should match "recycled brick"
        result = matcher_multiword_fuzzy.match(
            "recycled brik", base_score_cutoff=85)
        assert result is not None
        assert result.urn == "urn:recycled-brick"


# ---------------------------------------------------------------------------
# match — fuzzy single-word
# ---------------------------------------------------------------------------

class TestMatchFuzzy:
    def test_close_misspelling_matches(self, matcher):
        # "concretee" (9 chars, >= 8) uses the base cutoff, not the stricter length-based one
        result = matcher.match("concretee", base_score_cutoff=85)
        assert result is not None
        assert result.urn == "urn:concrete"

    def test_distant_string_does_not_match(self, matcher):
        result = matcher.match("xylophone", base_score_cutoff=95)
        assert result is None


# ---------------------------------------------------------------------------
# label normalization during __init__
# ---------------------------------------------------------------------------

class TestLabelNormalization:
    def test_label_with_punctuation_is_normalized(self):
        label_map = {"Iron, Cast": make_term("urn:iron-cast", "Iron, Cast")}
        m = Matcher(label_map)
        # Normalized label "iron cast" should be retrievable
        term = m.match("iron cast")
        assert term is not None
        assert term.urn == "urn:iron-cast"

    def test_duplicate_labels_after_normalization(self):
        # If two labels normalize to the same key, last one wins (dict behavior)
        label_map = {
            "Iron": make_term("urn:iron-1", "Iron"),
            "IRON": make_term("urn:iron-2", "IRON"),
        }
        m = Matcher(label_map)
        term = m.match("iron")
        assert term is not None
        assert term.urn == "urn:iron-2"


# ---------------------------------------------------------------------------
# Custom stopwords and locale
# ---------------------------------------------------------------------------

class TestLocaleAndStopwords:
    def test_german_stopwords(self):
        label_map = {"beton": make_term("urn:beton", "Beton")}
        m = Matcher(label_map, locale="de")
        assert m.match("der") is None
        assert m.match("die") is None

    def test_custom_stopwords_override(self):
        label_map = {"hello": make_term("urn:hello", "Hello")}
        m = Matcher(label_map, stopwords={"hello"})
        assert m.match("hello") is None

    def test_default_stopwords_en(self):
        assert DEFAULT_STOPWORDS["en"] == Matcher({}, locale="en").stopwords


# ---------------------------------------------------------------------------
# MarkdownTransformer
# ---------------------------------------------------------------------------

class TestMarkdownTransformer:
    @pytest.fixture
    def transformer(self, simple_label_map):
        m = Matcher(simple_label_map)
        return MarkdownTransformer(m)

    def test_single_word_match(self, transformer):
        result = transformer.transform("Use concrete here")
        assert ":term[concrete]{urn:concrete}" in result

    def test_multiword_ngram_match(self, transformer):
        result = transformer.transform("Use glass wool here")
        assert ":term[glass wool]{urn:glass-wool}" in result

    def test_no_match_word_unchanged(self, transformer):
        result = transformer.transform("Use unobtanium here")
        assert result == "Use unobtanium here"

    def test_term_without_description(self, transformer):
        result = transformer.transform("Use steel here")
        assert ":term[steel]{urn:steel}" in result

    def test_term_with_extra_punctuation(self, transformer):
        result = transformer.transform("Use steel, here")
        assert ":term[steel]{urn:steel}," in result

    def test_greedy_longest_ngram_first(self, transformer):
        # "glass wool" should be matched as a 2-gram, not as two separate 1-grams
        result = transformer.transform("glass wool")
        assert ":term[glass wool]" in result
        assert ":term[glass]" not in result

    def test_empty_input(self, transformer):
        assert transformer.transform("") == ""

    def test_custom_max_ngram(self, simple_label_map):
        m = Matcher(simple_label_map)
        t = MarkdownTransformer(m, max_ngram=1)
        # With max_ngram=1, "recycled brick" can't be matched as a 2-gram
        result = t.transform("recycled brick")
        assert ":term[recycled brick]" not in result

    # -----------------------------------------------------------------------
    # clear
    # -----------------------------------------------------------------------

    def test_clear_single_term(self, transformer):
        transformed = ":term[concrete]{urn:concrete}"
        assert MarkdownTransformer.clear(transformed) == "concrete"

    def test_clear_term_with_description(self, transformer):
        transformed = ":term[glass wool]{Thermal insulation|urn:glass-wool}"
        assert MarkdownTransformer.clear(transformed) == "glass wool"

    def test_clear_mixed_text(self, transformer):
        transformed = "Use :term[concrete]{urn:concrete} and :term[steel]{urn:steel} here"
        assert MarkdownTransformer.clear(
            transformed) == "Use concrete and steel here"

    def test_clear_untransformed_text_unchanged(self, transformer):
        plain = "Use concrete and steel here"
        assert MarkdownTransformer.clear(plain) == plain

    def test_clear_empty_string(self, transformer):
        assert MarkdownTransformer.clear("") == ""

    # -----------------------------------------------------------------------
    # idempotency
    # -----------------------------------------------------------------------

    def test_transform_twice_is_idempotent(self, transformer):
        once = transformer.transform("Use concrete and glass wool here")
        twice = transformer.transform(once)
        assert once == twice

    def test_transform_three_times_is_idempotent(self, transformer):
        once = transformer.transform("Use steel and timber here")
        twice = transformer.transform(once)
        thrice = transformer.transform(twice)
        assert once == thrice

    def test_clear_then_transform_equals_transform(self, transformer):
        text = "Use concrete here"
        transformed = transformer.transform(text)
        cleared = MarkdownTransformer.clear(transformed)
        retransformed = transformer.transform(cleared)
        assert transformed == retransformed


# ---------------------------------------------------------------------------
# MarkdownTransformer — whitespace preservation
# ---------------------------------------------------------------------------

class TestMarkdownTransformerWhitespace:
    @pytest.fixture
    def transformer(self, simple_label_map):
        m = Matcher(simple_label_map)
        return MarkdownTransformer(m)

    def test_preserves_newline_before_term(self, transformer):
        # Newline between words must survive in the output
        result = transformer.transform("Use\nconcrete here")
        assert "Use\n" in result
        assert ":term[concrete]{urn:concrete}" in result

    def test_preserves_newline_after_term(self, transformer):
        result = transformer.transform("concrete\nhere")
        assert ":term[concrete]{urn:concrete}\n" in result

    def test_preserves_leading_indentation(self, transformer):
        result = transformer.transform("  concrete")
        assert result == "  :term[concrete]{urn:concrete}"

    def test_preserves_tab_indentation(self, transformer):
        result = transformer.transform("\tconcrete")
        assert result == "\t:term[concrete]{urn:concrete}"

    def test_preserves_blank_line_between_terms(self, transformer):
        # Two paragraphs separated by a blank line must keep that blank line
        result = transformer.transform("concrete\n\nsteel")
        assert result == ":term[concrete]{urn:concrete}\n\n:term[steel]{urn:steel}"

    def test_preserves_markdown_list_formatting(self, transformer):
        text = "- concrete\n- steel"
        result = transformer.transform(text)
        assert result == "- :term[concrete]{urn:concrete}\n- :term[steel]{urn:steel}"

    def test_no_cross_line_ngram_match(self, transformer):
        # "glass" and "wool" on separate lines must NOT be joined into a 2-gram
        text = "glass\nwool"
        result = transformer.transform(text)
        assert ":term[glass wool]" not in result
        assert "\n" in result

    def test_inline_multispace_still_matches_ngram(self, transformer):
        # Multiple spaces between words on the same line: 2-gram match still works,
        # collapsed spaces within the matched span are absorbed into the marker
        result = transformer.transform("glass  wool")
        assert ":term[glass wool]{urn:glass-wool}" in result

    def test_multiline_text_each_line_transformed_independently(self, transformer):
        text = "Use concrete here\nUse steel there"
        result = transformer.transform(text)
        assert ":term[concrete]{urn:concrete}" in result
        assert ":term[steel]{urn:steel}" in result
        assert "\n" in result

    def test_transform_preserves_surrounding_newlines(self, transformer):
        # Text that starts and ends with newlines keeps them
        result = transformer.transform("\nconcrete\n")
        assert result == "\n:term[concrete]{urn:concrete}\n"

    def test_idempotent_on_multiline_text(self, transformer):
        text = "- concrete\n- steel\n\nglass wool"
        once = transformer.transform(text)
        twice = transformer.transform(once)
        assert once == twice
