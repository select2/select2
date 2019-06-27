import { QueryFunction, QueryResult } from '../../control/src/abstract-select';

export interface DataParam {
    term: string;
    page: number;
    selected: any[];
}

export interface DataResult {
    values: any[];
    more: boolean;
}

export type DataFunction = (param: DataParam) => QueryResult;

export function createQueryFromData(callback: DataFunction): QueryFunction {
    return (term: string, page: number, token: string) => {
        return new Promise((resolve, reject) => {
            const data = callback({ term, page, selected: [] });
            resolve({ values: data.values, more: data.more, token });
        });
    };
}
