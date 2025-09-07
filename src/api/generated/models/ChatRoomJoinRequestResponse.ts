/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 聊天室加入请求响应模型
 */
export type ChatRoomJoinRequestResponse = {
    created_at: string;
    updated_at?: (string | null);
    id: number;
    room_id: number;
    requester_id: number;
    reason?: (string | null);
    status: string;
    requested_at: string;
    processed_by_id?: (number | null);
    processed_at?: (string | null);
};

