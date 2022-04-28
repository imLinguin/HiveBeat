import { SearchType } from './models';
export declare function handleMultiTypeSearch(query: string): Promise<any[]>;
export declare function search(query: string, type?: SearchType): Promise<any[]>;
