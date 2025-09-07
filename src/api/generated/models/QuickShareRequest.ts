/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 快速分享请求模型
 */
export type QuickShareRequest = {
    content_type: QuickShareRequest.content_type;
    content_id: number;
    /**
     * 分享平台列表
     */
    platforms: Array<'forum' | 'chatroom' | 'wechat' | 'qq' | 'link'>;
    /**
     * 自定义分享消息
     */
    custom_message?: (string | null);
};
export namespace QuickShareRequest {
    export enum content_type {
        PROJECT = 'project',
        COURSE = 'course',
        KNOWLEDGE_BASE = 'knowledge_base',
        NOTE_FOLDER = 'note_folder',
        FORUM_TOPIC = 'forum_topic',
    }
}

