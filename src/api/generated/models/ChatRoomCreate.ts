/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 创建聊天室模型
 */
export type ChatRoomCreate = {
    name: string;
    /**
     * 聊天室类型
     */
    type?: ChatRoomCreate.type;
    /**
     * 如果为项目群组，关联的项目ID
     */
    project_id?: (number | null);
    /**
     * 如果为课程群组，关联的课程ID
     */
    course_id?: (number | null);
    color?: (string | null);
};
export namespace ChatRoomCreate {
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

