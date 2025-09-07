/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 文件夹统计信息响应模型
 */
export type FolderStatsResponse = {
    total_folders: number;
    total_contents: number;
    content_by_type: Record<string, number>;
    storage_used: number;
    recent_activity: Array<Record<string, any>>;
};

