/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 快速分享响应模型
 */
export type QuickShareResponse = {
    /**
     * 各平台分享结果
     */
    share_results: Array<Record<string, any>>;
    /**
     * 成功分享数量
     */
    success_count: number;
    /**
     * 失败分享数量
     */
    failed_count: number;
};

