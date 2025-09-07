/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WebSearchResult } from './WebSearchResult';
/**
 * 网络搜索响应模型
 */
export type WebSearchResponse = {
    query: string;
    engine_used: string;
    results: Array<WebSearchResult>;
    total_results?: (number | null);
    search_time?: (number | null);
    message?: (string | null);
};

