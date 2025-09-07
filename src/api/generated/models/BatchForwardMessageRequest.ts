/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 批量转发消息请求模型
 */
export type BatchForwardMessageRequest = {
    /**
     * 要转发的消息ID列表
     */
    message_ids: Array<number>;
    /**
     * 目标聊天室ID列表
     */
    to_room_ids: Array<number>;
    /**
     * 转发时的附加消息
     */
    message?: (string | null);
};

