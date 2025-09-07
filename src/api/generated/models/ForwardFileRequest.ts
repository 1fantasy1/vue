/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 文件转发请求模型
 */
export type ForwardFileRequest = {
    /**
     * 包含文件的消息ID
     */
    file_message_id: number;
    /**
     * 目标聊天室ID列表
     */
    to_room_ids: Array<number>;
    /**
     * 转发时的附加消息
     */
    message?: (string | null);
};

