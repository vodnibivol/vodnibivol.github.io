from simplify import simplify
import json


def main():
    with open("SSKJ_freqs_leposlovje.json", "r") as f:
        SSKJ_FREQS = json.load(f)
    with open("sskj_blacklist_v1.txt") as f:
        BLACKLIST = f.read().splitlines()

    target_words = set()  # besede ki jih dobiš za uganit
    valid_words = set()  # besede ki jih sprejme

    for word, freq in SSKJ_FREQS:
        if len(word) != 5:
            continue

        sim_w = simplify(word, to_lowercase=True)
        valid_words.add(sim_w)

        if word in BLACKLIST:
            print(word)

        if freq >= 200 and word not in BLACKLIST:
            target_words.add(sim_w)

    # print(filtered_words)
    print(len(target_words))

    with open("WORDLE_valid.json", "w") as f:
        json.dump(sorted(list(valid_words)), f, ensure_ascii=False)

    with open("WORDLE_targets.json", "w") as f:
        json.dump(sorted(list(target_words)), f, ensure_ascii=False)


if __name__ == "__main__":
    main()
