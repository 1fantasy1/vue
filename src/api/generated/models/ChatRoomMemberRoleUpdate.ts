/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 聊天室成员角色更新模型
 */
export type ChatRoomMemberRoleUpdate = {
    /**
     * 要设置的新角色
     */
    role: ChatRoomMemberRoleUpdate.role;
};
export namespace ChatRoomMemberRoleUpdate {
    /**
     * 要设置的新角色
     */
    export enum role {
        KING = 'king',
        ADMIN = 'admin',
        MEMBER = 'member',
    }
}

