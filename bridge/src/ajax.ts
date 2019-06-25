import { QueryFunction, QueryResult } from '../../control/src/search-controller';
import { extend } from '../../control/src/util';
export interface Ajax {
    url: string;
    params: (term: string, page: number) => object;
    process: (data: string) => QueryResult;
}

export function createQueryFromAjax(ajax: Ajax): QueryFunction {
    ajax = extend({}, ajax, {
        params(term: string, page: number) {
            return { term, page };
        },
        process(data: string) {
            const json = JSON.parse(data);
            return {
                more: json.more,
                values: json.values
            };
        }
    });

    return (term: string, page: number, token: string) => {
        return new Promise((resolve, reject) => {
            let url = ajax.url;
            const params = ajax.params(term, page);
            if (params) {
                let separator = url.indexOf('?') >= 0 ? '&' : '?';
                Object.entries(params).forEach(([key, value]) => {
                    url += separator;
                    separator = '&';
                    url += encodeURIComponent(key) + '=' + encodeURIComponent(value);
                });
            }

            const request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.onload = () => {
                if (request.status >= 200 && request.status < 400) {
                    const data = ajax.process(request.responseText);
                    resolve({ values: data.values, more: data.more, token });
                } else {
                    reject();
                }
            };
            request.onerror = reject;
            request.send();
        });
    };
}
