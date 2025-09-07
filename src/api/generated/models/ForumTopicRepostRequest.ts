/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 论坛话题转发请求模型
 */
export type ForumTopicRepostRequest = {
    /**
     * 要转发的话题ID
     */
    topic_id: number;
    /**
     * 转发时的附加说明
     */
    additional_content?: (string | null);
    /**
     * 转发类型
     */
    share_type: ForumTopicRepostRequest.share_type;
    /**
     * 转发到聊天室时的聊天室ID列表
     */
    chatroom_ids?: (Array<number> | null);
};
export namespace ForumTopicRepostRequest {
    /**
     * 转发类型
     */
    export enum share_type {
        FORUM = 'forum',
        CHATROOM = 'chatroom',
    }
}

