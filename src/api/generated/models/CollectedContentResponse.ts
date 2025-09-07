/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 返回收藏内容的响应模型
 */
export type CollectedContentResponse = {
    owner_id: number;
    created_at: string;
    updated_at?: (string | null);
    /**
     * 标题
     */
    title?: (string | null);
    /**
     * 内容类型
     */
    type?: ('document' | 'video' | 'audio' | 'note' | 'link' | 'file' | 'image' | 'forum_topic' | 'forum_comment' | 'forum_topic_attachment' | 'course' | 'project' | 'chat_message' | 'code' | 'bookmark' | 'contact' | 'location' | 'text' | null);
    /**
     * URL地址
     */
    url?: (string | null);
    /**
     * 内容描述
     */
    content?: (string | null);
    /**
     * 内容摘要
     */
    excerpt?: (string | null);
    /**
     * 标签列表
     */
    tags?: (Array<string> | null);
    /**
     * 所属文件夹ID
     */
    folder_id?: (number | null);
    /**
     * 优先级（1-5）
     */
    priority?: (number | null);
    /**
     * 个人备注
     */
    notes?: (string | null);
    /**
     * 是否加星标
     */
    is_starred?: (boolean | null);
    /**
     * 是否公开
     */
    is_public?: (boolean | null);
    /**
     * 缩略图URL
     */
    thumbnail?: (string | null);
    /**
     * 作者
     */
    author?: (string | null);
    /**
     * 时长
     */
    duration?: (string | null);
    /**
     * 文件大小（字节）
     */
    file_size?: (number | null);
    /**
     * 状态
     */
    status?: ('active' | 'archived' | 'deleted' | 'draft' | null);
    /**
     * 来源
     */
    source?: (string | null);
    /**
     * 分类
     */
    category?: (string | null);
    /**
     * 关联的平台资源类型
     */
    shared_item_type?: (string | null);
    /**
     * 关联的平台资源ID
     */
    shared_item_id?: (number | null);
    /**
     * 内容发布时间
     */
    published_at?: (string | null);
    /**
     * 计划处理时间
     */
    scheduled_at?: (string | null);
    id: number;
    /**
     * 访问次数
     */
    access_count?: (number | null);
    /**
     * 最后访问时间
     */
    last_accessed?: (string | null);
    /**
     * 所属文件夹名称
     */
    folder_name?: (string | null);
    /**
     * 文件夹路径
     */
    folder_path?: (Array<string> | null);
    /**
     * 提取的内容信息
     */
    extracted_info?: (Record<string, any> | null);
    /**
     * 情感分析得分
     */
    sentiment_score?: (number | null);
    /**
     * 相关内容ID列表
     */
    related_items?: (Array<number> | null);
};

