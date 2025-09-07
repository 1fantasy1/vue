/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 复制链接请求模型
 */
export type CopyLinkRequest = {
    content_type: CopyLinkRequest.content_type;
    content_id: number;
    /**
     * 是否包含二维码
     */
    include_qr?: (boolean | null);
};
export namespace CopyLinkRequest {
    export enum content_type {
        PROJECT = 'project',
        COURSE = 'course',
        KNOWLEDGE_BASE = 'knowledge_base',
        NOTE_FOLDER = 'note_folder',
        FORUM_TOPIC = 'forum_topic',
    }
}

