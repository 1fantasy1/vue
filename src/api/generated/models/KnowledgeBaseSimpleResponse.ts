/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 知识库响应模型
 */
export type KnowledgeBaseSimpleResponse = {
    /**
     * 知识库名称
     */
    name: string;
    /**
     * 知识库描述
     */
    description?: (string | null);
    /**
     * 访问类型
     */
    access_type?: (string | null);
    /**
     * 是否公开知识库
     */
    is_public?: (boolean | null);
    id: number;
    owner_id: number;
    created_at: string;
    updated_at?: (string | null);
};

