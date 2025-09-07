/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 聊天室响应模型
 */
export type ChatRoomResponse = {
    created_at: string;
    updated_at?: (string | null);
    name: string;
    /**
     * 聊天室类型
     */
    type?: ChatRoomResponse.type;
    /**
     * 如果为项目群组，关联的项目ID
     */
    project_id?: (number | null);
    /**
     * 如果为课程群组，关联的课程ID
     */
    course_id?: (number | null);
    color?: (string | null);
    id: number;
    creator_id: number;
    members_count?: (number | null);
    last_message?: (Record<string, any> | null);
    unread_messages_count?: (number | null);
    online_members_count?: (number | null);
};
export namespace ChatRoomResponse {
    /**
     * 聊天室类型
     */
    export enum type {
        PROJECT_GROUP = 'project_group',
        COURSE_GROUP = 'course_group',
        PRIVATE = 'private',
        GENERAL = 'general',
    }
}

