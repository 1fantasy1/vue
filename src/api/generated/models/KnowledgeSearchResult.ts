/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 搜索结果项
 */
export type KnowledgeSearchResult = {
    /**
     * 结果类型
     */
    type: KnowledgeSearchResult.type;
    /**
     * 项目ID
     */
    id: number;
    /**
     * 标题
     */
    title: string;
    /**
     * 内容预览
     */
    content?: (string | null);
    /**
     * 文件类型
     */
    file_type?: (string | null);
    /**
     * 状态
     */
    status?: (string | null);
    /**
     * 内容类型
     */
    content_type?: (string | null);
    /**
     * URL地址
     */
    url?: (string | null);
    /**
     * 缩略图路径
     */
    thumbnail_path?: (string | null);
    /**
     * 文件大小
     */
    file_size?: (number | null);
    created_at: string;
    updated_at?: (string | null);
};
export namespace KnowledgeSearchResult {
    /**
     * 结果类型
     */
    export enum type {
        DOCUMENT = 'document',
    }
}

