import logging
import re
from typing import Dict, Optional, Tuple
from rapidfuzz import process, fuzz

from ..models.taxonomy import Term

logger = logging.getLogger("matcher")

DEFAULT_STOPWORDS = {
    "en": {
        "the", "of", "on", "a", "an", "is", "in", "and", "for", "to", "with", "as"
    },
    "de": {
        "der", "die", "das", "und", "in", "zu", "mit", "auf", "für", "ist", "ein", "eine"
    },
    "fr": {
        "le", "la", "les", "et", "en", "à", "avec", "pour", "est", "un", "une"
    },
    "it": {
        "il", "la", "i", "e", "in", "a", "con", "per", "è", "un", "una"
    }
}


class Matcher:
    """
    Matcher for mapping tokens / n-grams to ontology uris using fuzzy matching.

    Behavior highlights:
    - Normalizes tokens by removing internal punctuation and collapsing spaces.
    - Skips tokens that are stopwords, purely numeric, or obviously junk.
    - Exact label matches win immediately.
    - Multi-word tokens are matched only via exact match (no fuzzy multi-word matching).
    - Uses a dynamic fuzzy score cutoff based on token length to reduce false positives.
    """

    def __init__(
        self,
        label_map: Dict[str, Term],
        log_matches: bool = False,
        stopwords: Optional[set] = None,
        allow_multiword_fuzzy: bool = False,
        locale: str = "en",
    ) -> None:
        """
        Args:
          label_map (Dict[str, Term]): mapping from label (human text) -> taxonomy term (with urn, name, etc.)
          log_matches (bool): whether to emit debug logs for match decisions
          stopwords (Optional[set]): optional set of stopwords to override default
          allow_multiword_fuzzy (bool): if True, allow fuzzy matching of multi-word tokens;
                                         defaults to False (safer).
          locale (str): the locale for the stopwords
        """
        self.stopwords = stopwords if stopwords is not None else DEFAULT_STOPWORDS.get(
            locale, set())
        self.log_matches = log_matches
        self.allow_multiword_fuzzy = allow_multiword_fuzzy

        # Normalize labels consistently and use the normalized label as the key.
        # We intentionally normalize here so comparisons are apples-to-apples.
        self.label_map: Dict[str, Term] = {
            self._normalize(label): term for label, term in label_map.items()
        }
        self.labels: list[str] = list(self.label_map.keys())

    # --------------------
    # Public API
    # --------------------

    def match(self, text: str, base_score_cutoff: int = 95) -> Optional[Term]:
        """
        Try to match `text` to a label. Returns the matched uri or None.

        Args:
          text (str): the input text to match
          base_score_cutoff (int): the base fuzzy score cutoff for matches (default: 95)
        Returns:
          Optional[Term]: the matched Term if a match is found, else None
        """
        token = self._normalize(text)

        # trivial rejects
        if not token:
            self._log_no_match(text, "empty_after_normalize")
            return None
        if self._should_skip(token):
            self._log_no_match(text, "should_skip")
            return None

        # exact match has priority
        term = self.label_map.get(token)
        if term:
            self._log_match(text, token, 100, term.urn, exact=True)
            return term

        # if token is multi-word, only allow exact match unless allow_multiword_fuzzy
        if " " in token and not self.allow_multiword_fuzzy:
            self._log_no_match(text, "multiword_without_fuzzy")
            return None

        # dynamic cutoff based on token length
        score_cutoff = self._get_score_cutoff(token, base_score_cutoff)

        result = self._find_best_match(token, score_cutoff)
        if result:
            matched_label, score, term = result
            self._log_match(text, matched_label, score, term.urn, exact=False)
            return term

        self._log_no_match(text, "no_fuzzy_match")
        return None

    # --------------------
    # Helpers
    # --------------------

    def _normalize(self, text: str) -> str:
        """
        Normalize text by:
         - lowercasing
         - removing punctuation (including internal commas/periods/etc)
         - collapsing whitespace
        """
        if text is None:
            return ""
        s = str(text).lower()
        # Remove anything that's not word chars, whitespace or hyphen
        s = re.sub(r"[^\w\s-]", "", s)
        # Collapse whitespace
        s = re.sub(r"\s+", " ", s).strip()
        return s

    def _should_skip(self, token: str) -> bool:
        """
        Decide whether a normalized token should be skipped:
         - pure numbers or containing any digit
         - single-character tokens
         - stopwords (like 'the', 'of', etc.)
        Args:
          token (str): the normalized token to evaluate
        Returns:
          bool: True if the token should be skipped, False otherwise
        """
        if not token:
            return True
        if any(ch.isdigit() for ch in token):
            return True
        if len(token) <= 1:
            return True
        # token may be multiple words; if every token is a stopword then skip
        parts = token.split()
        if all(part in self.stopwords for part in parts):
            return True
        return False

    def _get_score_cutoff(self, token: str, base_cutoff: int) -> int:
        """
        Return a numeric score cutoff for fuzzy matching based on token length.
        Short tokens get stricter cutoffs to avoid false positives.
        Args:
          token (str): the normalized token to be matched
          base_cutoff (int): the base cutoff to use for longer tokens (e.g. 90-95)
        Returns:
          int: the score cutoff to use for this token
        """
        length = len(token)
        if length < 5:
            # require perfect match for tiny tokens
            return max(base_cutoff, 100)
        if length < 8:
            return max(base_cutoff, 97)
        # for longer tokens allow base cutoff (caller can pick 90..95)
        return base_cutoff

    def _find_best_match(self, token: str, score_cutoff: int) -> Optional[Tuple[str, int, Term]]:
        """
        Use rapidfuzz to find the best label match above score_cutoff.

        Args:
          token (str): the normalized token to match
          score_cutoff (int): the minimum score for a match to be considered valid
        Returns:
          Optional[Tuple[str, int, Term]]: (matched_label, score, term) if a match is found, else None
        """
        # Explicitly set scorer and processor for consistent behavior
        result = process.extractOne(
            token,
            self.labels,
            scorer=fuzz.ratio,
            processor=None,
            score_cutoff=score_cutoff,
        )
        if result:
            matched_label, score, _ = result
            term = self.label_map[matched_label]
            return matched_label, score, term
        return None

    # --------------------
    # Logging
    # --------------------

    def _log_match(self, original: str, matched_label: str, score: int, uri: str, exact: bool) -> None:
        if not self.log_matches:
            return
        tag = "EXACT" if exact else "FUZZY"
        logger.debug(
            f"[{tag} MATCH] '{original}' -> '{matched_label}' ({score}%) -> {uri}")

    def _log_no_match(self, original: str, reason: str) -> None:
        if not self.log_matches:
            return
        logger.debug(f"[NO MATCH] '{original}' ({reason})")


class MarkdownTransformer:
    # Matches :term[some text]{urn}
    _TERM_RE = re.compile(r":term\[([^\]]+)\]\{[^}]+\}")

    def __init__(self, matcher: Matcher, max_ngram: int = 5):
        """Transformer that uses a Matcher to find terms in text and replace them with markdown links.
        Args:
          matcher (Matcher): the Matcher instance to use for finding terms
          max_ngram (int): the maximum n-gram length to consider for matching (default: 5)
        """
        self.matcher = matcher
        self.max_ngram = max_ngram

    @classmethod
    def clear(cls, text: str) -> str:
        """Strip all :term[...]{...} markers from previously transformed text, returning plain text.
        This is idempotent and safe to call on text that was never transformed.
        Args:
          text (str): text that may contain :term[...]{...} markers
        Returns:
          str: plain text with all markers replaced by their display label
        """
        return cls._TERM_RE.sub(lambda m: m.group(1), text)

    def transform(self, text: str) -> str:
        """Transform input text by matching n-grams and replacing them with markdown links to terms.
        Already-transformed text is cleared first so re-transforming is safe and idempotent.
        Original whitespace (newlines, indentation, multiple spaces) is preserved exactly.
        N-grams are never matched across line boundaries.
        Args:
          text (str): the input text to transform (may already be transformed)
        Returns:
          str: the transformed text with matched terms replaced by markdown links
        """
        # Clear any prior transformation so re-runs are safe
        text = self.clear(text)
        if not text:
            return text

        # Split into alternating [word, sep, word, sep, ...] preserving all whitespace.
        # Even indices (0, 2, 4, …) are word tokens; odd indices are whitespace separators.
        # When text starts/ends with whitespace, the edge word slots are empty strings.
        parts = re.split(r'(\s+)', text)

        # Build a pre-computed index of non-empty word tokens: (parts_index, word_string)
        word_indices = [(idx, parts[idx])
                        for idx in range(0, len(parts), 2) if parts[idx]]

        i = 0  # position in word_indices
        while i < len(word_indices):
            matched = False
            for n in range(min(self.max_ngram, len(word_indices) - i), 0, -1):
                ng_wis = word_indices[i:i + n]

                # Do not match n-grams that span line boundaries
                if any('\n' in parts[ng_wis[k][0] + 1] for k in range(n - 1)):
                    continue

                ngram = " ".join(w for _, w in ng_wis)
                # From the ngram, split the trailing punctuation chars (if any)
                # so that "steel," can match "steel" in the taxonomy. We only strip trailing punctuation to avoid breaking up valid multi-word terms like "glass wool".
                # keep the stripped punctuation in the original text so that it remains after transformation (e.g. "steel," -> ":term[steel]{urn},")
                punctuation = re.search(r"[.,;:!?]+$", ngram)
                if punctuation:
                    ngram = ngram[:-len(punctuation.group())]
                term = self.matcher.match(ngram)
                if term:
                    logger.debug(f"Matched n-gram: '{ngram}' -> {term}")
                    # Write marker into the first word's slot
                    parts[ng_wis[0][0]
                          ] = f":term[{ngram}]{{{term.urn}}}{punctuation.group() if punctuation else ''}"
                    # Erase intermediate separators and word slots
                    for k in range(1, n):
                        # separator between word k-1 and k
                        parts[ng_wis[k - 1][0] + 1] = ""
                        parts[ng_wis[k][0]] = ""           # word k itself
                    i += n
                    matched = True
                    break  # break n-gram loop, advance to next position

            if not matched:
                i += 1

        return "".join(parts)
