# Special characters found in SSKJ: ÁÉÍÓÚàáèéêìíîòóôùúŔŕ | čšŽž çñ äöü

ACCENTS = {
    "À": "A",
    "Á": "A",
    "̯Á": "A",
    "É": "E",
    "̯È": "E",
    "Ê": "E",
    "Ì": "I",
    "Í": "I",
    "Ò": "O",
    "Ó": "O",
    "Ô": "O",
    "Ù": "U",
    "Ú": "U",
    "Ŕ": "R",
    # ----- #
    "à": "a",
    "á": "a",
    "è": "e",
    "é": "e",
    "ê": "e",
    "ì": "i",
    "í": "i",
    "î": "i",
    "ò": "o",
    "ó": "o",
    "ô": "o",
    "ù": "u",
    "ú": "u",
    "ŕ": "r"
}

SPECIAL = {
    "U̯̯": "U",
    "̯Ä": "A",
    "Ç": "C",
    "Ñ": "n",
    "Ö": "O",
    "Ü": "U",
    "Ć": "C",
    "Č": "C",
    "Đ": "D",
    "Š": "S",
    "Ž": "Z",
    "Ə": "E",
    # ----- #
    "ä": "a",
    "ç": "c",
    "ñ": "n",
    "ö": "o",
    "ü": "u",
    "ć": "c",
    "č": "c",
    "đ": "d",
    "š": "s",
    "ž": "z",
    "ə": "e",
}

EXTRA = {**ACCENTS, **SPECIAL}

ACCENTS_KEYS = ACCENTS.keys()
SPECIAL_KEYS = SPECIAL.keys()
EXTRA_KEYS = EXTRA.keys()


def _plainchar(character: str):
    if character in ACCENTS_KEYS:
        return ACCENTS[character]
    return character


def _asciichar(character: str):
    if character in EXTRA_KEYS:
        return EXTRA[character]
    return character


def _toplain(string: str):
    return "".join([_plainchar(c) for c in string])


def _toascii(string: str):
    return "".join([_asciichar(c) for c in string])


def simplify(string: str, to_ascii=False, to_lowercase=False):
    if to_lowercase:
        string = string.lower()

    if to_ascii:
        return _toascii(string)

    return _toplain(string)
