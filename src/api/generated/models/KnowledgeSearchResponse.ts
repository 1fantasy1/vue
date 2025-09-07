/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KnowledgeSearchResult } from './KnowledgeSearchResult';
/**
 * 搜索响应
 */
export type KnowledgeSearchResponse = {
    /**
     * 搜索查询
     */
    query: string;
    /**
     * 结果总数
     */
    total: number;
    /**
     * 搜索结果列表
     */
    results: Array<KnowledgeSearchResult>;
    /**
     * 当前页码
     */
    page?: (number | null);
    /**
     * 每页数量
     */
    size?: (number | null);
    /**
     * 搜索模式
     */
    search_mode?: (string | null);
    /**
     * 内容类型筛选
     */
    content_type_filter?: (string | null);
    /**
     * 状态筛选
     */
    status_filter?: (string | null);
};

