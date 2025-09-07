/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 社交平台分享请求模型
 */
export type SocialShareRequest = {
    content_type: SocialShareRequest.content_type;
    content_id: number;
    /**
     * 分享平台
     */
    platform: SocialShareRequest.platform;
    /**
     * 自定义分享消息
     */
    custom_message?: (string | null);
};
export namespace SocialShareRequest {
    export enum content_type {
        PROJECT = 'project',
        COURSE = 'course',
        KNOWLEDGE_BASE = 'knowledge_base',
        NOTE_FOLDER = 'note_folder',
        FORUM_TOPIC = 'forum_topic',
    }
    /**
     * 分享平台
     */
    export enum platform {
        WECHAT = 'wechat',
        QQ = 'qq',
    }
}

