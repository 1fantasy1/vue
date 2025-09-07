/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 文档响应模型
 */
export type KnowledgeDocumentSimpleResponse = {
    /**
     * 文件名
     */
    file_name: string;
    /**
     * 文件类型
     */
    file_type?: (string | null);
    /**
     * 内容类型: file, image, video, url, website
     */
    content_type?: string;
    /**
     * 网址URL（用于url和website类型）
     */
    url?: (string | null);
    /**
     * 网站标题
     */
    website_title?: (string | null);
    /**
     * 网站描述
     */
    website_description?: (string | null);
    /**
     * 文件大小（字节）
     */
    file_size?: (number | null);
    /**
     * MIME类型
     */
    mime_type?: (string | null);
    /**
     * 缩略图路径
     */
    thumbnail_path?: (string | null);
    /**
     * 处理状态
     */
    status?: (string | null);
    /**
     * 处理消息
     */
    processing_message?: (string | null);
    /**
     * 文档块数量
     */
    total_chunks?: (number | null);
    /**
     * 所属文件夹ID
     */
    kb_folder_id?: (number | null);
    id: number;
    kb_id: number;
    owner_id: number;
    file_path?: (string | null);
    created_at: string;
    updated_at?: (string | null);
};

