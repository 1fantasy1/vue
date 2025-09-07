/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 分享到聊天室请求模型
 */
export type ShareToChatroomRequest = {
    content_type: ShareToChatroomRequest.content_type;
    content_id: number;
    /**
     * 目标聊天室ID列表
     */
    chatroom_ids: Array<number>;
    /**
     * 分享消息
     */
    message?: (string | null);
};
export namespace ShareToChatroomRequest {
    export enum content_type {
        PROJECT = 'project',
        COURSE = 'course',
        KNOWLEDGE_BASE = 'knowledge_base',
        NOTE_FOLDER = 'note_folder',
        FORUM_TOPIC = 'forum_topic',
    }
}

