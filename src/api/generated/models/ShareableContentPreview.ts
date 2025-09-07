/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 可分享内容预览模型
 */
export type ShareableContentPreview = {
    id: number;
    type: string;
    title: string;
    description: (string | null);
    author: string;
    created_at: string;
    is_public: boolean;
    thumbnail?: (string | null);
    metadata?: (Record<string, any> | null);
};

