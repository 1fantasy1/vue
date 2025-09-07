/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 聊天室成员响应模型
 */
export type ChatRoomMemberResponse = {
    created_at: string;
    updated_at?: (string | null);
    room_id: number;
    member_id: number;
    /**
     * 成员角色
     */
    role?: ChatRoomMemberResponse.role;
    /**
     * 成员状态
     */
    status?: ChatRoomMemberResponse.status;
    last_read_at?: (string | null);
    id: number;
    joined_at: string;
    /**
     * 成员的姓名
     */
    member_name?: (string | null);
};
export namespace ChatRoomMemberResponse {
    /**
     * 成员角色
     */
    export enum role {
        KING = 'king',
        ADMIN = 'admin',
        MEMBER = 'member',
    }
    /**
     * 成员状态
     */
    export enum status {
        ACTIVE = 'active',
        BANNED = 'banned',
        LEFT = 'left',
    }
}

