import { VNode } from 'preact';
import { render as renderToString, shallowRender as shallowRenderToString } from 'preact-render-to-string';
import * as pretty from 'pretty';
import { QueryFunction } from '../src/abstract-select';
import { countries } from './countries';

export function shallow(component: VNode): string {
    return pretty(shallowRenderToString(component), { ocd: true });
}
export function deep(component: VNode): string {
    return pretty(renderToString(component), { ocd: true });
}

export const query: QueryFunction = (search, page, token) =>
    new Promise((resolve, reject) => {
        const results: any[] = [];
        let count = 0;
        const limit = 10;
        const offset = page * limit;
        for (const country of countries) {
            if (country.text.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
                if (count >= offset) {
                    results.push(country);
                }
                count++;
                if (count >= offset + limit) {
                    break;
                }
            }
        }
        resolve({
            more: results.length >= limit,
            token,
            values: results
        });
    });
