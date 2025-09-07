/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 分页响应模型
 */
export type PaginatedResponse = {
    /**
     * 数据项列表
     */
    items: Array<Record<string, any>>;
    /**
     * 总记录数
     */
    total: number;
    /**
     * 当前页数
     */
    page?: number;
    /**
     * 每页大小
     */
    size?: number;
    /**
     * 总页数
     */
    pages: number;
};

