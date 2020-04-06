import { ComponentChild } from 'preact';

export function extend(...params: object[]) {
    for (let i = 1; i < arguments.length; i++) {
        for (const key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                if (typeof arguments[0][key] === 'object' && typeof arguments[i][key] === 'object') {
                    extend(arguments[0][key], arguments[i][key]);
                } else {
                    arguments[0][key] = arguments[i][key];
                }
            }
        }
    }
    return arguments[0];
}

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
        ? Array<DeepPartial<U>>
        : T[P] extends ReadonlyArray<infer V>
        ? ReadonlyArray<DeepPartial<V>>
        : DeepPartial<T[P]>
};

export const merge = <T>(target: T, sources: Array<DeepPartial<T>>): T => {
    if (!sources.length) {
        return target;
    }
    const source = sources.shift();
    if (source === undefined) {
        return merge(target, sources);
    }

    if (isMergebleObject(target) && isMergebleObject(source)) {
        Object.keys(source).forEach((key: string) => {
            if (isMergebleObject(source[key])) {
                if (!target[key]) {
                    target[key] = {};
                }
                merge(target[key], [source[key]]);
            } else {
                target[key] = source[key];
            }
        });
    }

    return merge(target, sources);
};

const isObject = (item: any): boolean => {
    return item !== null && typeof item === 'object';
};

const isMergebleObject = (item): boolean => {
    return isObject(item) && !Array.isArray(item);
};

export function cn(...values: any) {
    const classes: string[] = [];
    const hasOwnProperty = {}.hasOwnProperty;

    for (const value of values) {
        if (typeof value === 'string' && value.length > 0) {
            classes.push(value);
        } else if (typeof value === 'object') {
            for (const key in value as object) {
                if (hasOwnProperty.call(value, key) && value[key]) {
                    classes.push(key);
                }
            }
        }
    }

    return classes.join(' ');
}

export enum Key {
    // https://www.w3.org/TR/uievents-key/#named-key-attribute-values
    ArrowDown = 'ArrowDown',
    ArrowUp = 'ArrowUp',
    ArrowLeft = 'ArrowLeft',
    ArrowRight = 'ArrowRight',
    Space = ' ',
    Enter = 'Enter',
    Tab = 'Tab',
    Home = 'Home',
    End = 'End',
    PageUp = 'PageUp',
    PageDown = 'PageDown',
    Backspace = 'Backspace',
    Delete = 'Delete',
    Clear = 'Clear',
    Escape = 'Escape',
    // IE 11
    Down = 'Down',
    Up = 'Up',
    Spacebar = 'Spacebar',
    Left = 'Left',
    Right = 'Right'
}

export const uuid = (() => {
    let counter = 0;
    return () => 's25-' + counter++;
})();

export function throttle(delay: number, callback: () => void): () => void {
    let timeout: number | undefined;
    return () => {
        if (timeout !== undefined) {
            window.clearTimeout(timeout);
            timeout = undefined;
        } else {
            timeout = window.setTimeout(() => {
                callback();
                timeout = undefined;
            }, delay);
        }
    };
}

// @ts-ignore
export function debounce(quiet: number, delegate: (...args: any[]) => void, that: object) {
    const args = Array.from(arguments);
    if (quiet <= 0) {
        return () => {
            delegate.apply(that, args);
        };
    } else {
        let timeout: number | undefined;
        return () => {
            if (timeout) {
                window.clearTimeout(timeout);
            }
            timeout = window.setTimeout(() => {
                timeout = undefined;
                delegate.apply(that, args);
            }, quiet);
        };
    }
}

export function getScrollParents(el: HTMLElement): EventTarget[] {
    const style = window.getComputedStyle(el);
    const elementPosition = style.position;
    if (elementPosition === 'fixed') {
        return [el];
    }

    const parents: Array<HTMLElement | Window> = [];
    let parent = el.parentElement;

    while (parent && parent.nodeType === 1) {
        const css = window.getComputedStyle(parent);
        if (/(overlay|scroll|auto)/.test(css.overflow + ' ' + css.overflowX + ' ' + css.overflowY)) {
            if (elementPosition !== 'absolute' || ['relative', 'fixed', 'absolute'].indexOf(css.position || '') >= 0) {
                parents.push(parent);
            }
        }
        parent = parent.parentElement;
    }

    if (el.ownerDocument) {
        parents.push(el.ownerDocument.body);
    }

    // iframe
    if (el.ownerDocument !== document && el.ownerDocument && el.ownerDocument.defaultView) {
        parents.push(el.ownerDocument.defaultView);
    }

    parents.push(window);
    return parents;
}

export function calculateVerticalVisibility(
    container: HTMLElement,
    element: HTMLElement
): 'hidden' | 'partial-top' | 'partial-bottom' | 'visible' {
    const c = container.getBoundingClientRect();
    const e = element.getBoundingClientRect();

    if (e.bottom < c.top) {
        // above the fold
        return 'hidden';
    }

    if (e.top > c.bottom) {
        // below the fold
        return 'hidden';
    }

    if (e.top < c.top && e.bottom <= c.bottom) {
        return 'partial-top';
    }

    if (e.top >= c.top && e.bottom > c.bottom) {
        return 'partial-bottom';
    }

    return 'visible';
}

export type MouseEventListener = (event: MouseEvent) => void;
export type KeyboardEventListener = (event: KeyboardEvent) => void;
export type EventListener = (event: Event) => void;
export type FocusEventListener = (event: FocusEvent) => void;

/** helper that makes it easier to declare a scope inside a jsx block */
export function scope(delegate: () => ComponentChild) {
    return delegate();
}
