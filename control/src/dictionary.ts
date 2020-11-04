// TODO make it so keys can be strings in addition to functions
export interface Dictionary {
    valueAdded(itemLabel: string): string;
    noSearchResults(): string;
    searchResultsLoading(): string;
    removeButtonTitle(): string;
    clearButtonTitle(): string;
    minimumCharactersMessage(len: number, min: number): string;
    multiSelectInstructions(): string;
    expandButtonTitle(): string;
    maximumValuesSelectedMessage(): string;
}

const EN_US: Dictionary = {
    noSearchResults() {
        return 'No results available';
    },

    searchResultsLoading() {
        return 'Loading...';
    },

    removeButtonTitle() {
        return 'Remove selected values';
    },

    clearButtonTitle() {
        return 'Clear selection';
    },

    valueAdded(itemLabel: string) {
        return itemLabel + ' added';
    },

    minimumCharactersMessage(len: number, min: number) {
        const delta = min - len;
        return 'Please enter ' + delta + ' more character' + (delta > 1 ? 's' : '');
    },

    multiSelectInstructions(): string {
        return "Items can be removed from this list box by selecting them and activating 'Remove selected values' button. Items can be added by selecting them in the adjacent combobox.";
    },

    expandButtonTitle(): string {
        return 'Expand';
    },
    maximumValuesSelectedMessage(): string {
        return 'Maximum number of values already selected';
    }
};

const dictionaries = new Map<string, Dictionary>();
dictionaries.set('en_us', EN_US);

export function getDictionary(dict?: string | undefined): Dictionary {
    const fallback: Dictionary = dictionaries.get('en_us') as Dictionary;

    if (!dict) {
        return fallback;
    }

    if (typeof dict === 'string') {
        const instance = dictionaries.get(dict);
        return instance ? instance : fallback;
    } else {
        return dict;
    }
}
