/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 分享内容请求模型
 */
export type ShareContentRequest = {
    /**
     * 分享内容类型
     */
    content_type: ShareContentRequest.content_type;
    /**
     * 分享内容ID
     */
    content_id: number;
    /**
     * 分享类型
     */
    share_type: ShareContentRequest.share_type;
    /**
     * 分享目标ID（聊天室ID等）
     */
    target_id?: (number | null);
    /**
     * 自定义标题
     */
    title?: (string | null);
    /**
     * 分享描述
     */
    description?: (string | null);
    /**
     * 是否公开分享
     */
    is_public?: (boolean | null);
    /**
     * 是否允许评论
     */
    allow_comments?: (boolean | null);
    /**
     * 分享过期时间
     */
    expires_at?: (string | null);
};
export namespace ShareContentRequest {
    /**
     * 分享内容类型
     */
    export enum content_type {
        PROJECT = 'project',
        COURSE = 'course',
        KNOWLEDGE_BASE = 'knowledge_base',
        NOTE_FOLDER = 'note_folder',
        FORUM_TOPIC = 'forum_topic',
    }
    /**
     * 分享类型
     */
    export enum share_type {
        FORUM_TOPIC = 'forum_topic',
        CHATROOM = 'chatroom',
        LINK = 'link',
        WECHAT = 'wechat',
        QQ = 'qq',
    }
}

