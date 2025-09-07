/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 分享到论坛请求模型
 */
export type ShareToForumRequest = {
    content_type: ShareToForumRequest.content_type;
    content_id: number;
    /**
     * 自定义话题标题
     */
    title?: (string | null);
    /**
     * 附加说明内容
     */
    additional_content?: (string | null);
    /**
     * 话题标签
     */
    tags?: (string | null);
};
export namespace ShareToForumRequest {
    export enum content_type {
        PROJECT = 'project',
        COURSE = 'course',
        KNOWLEDGE_BASE = 'knowledge_base',
        NOTE_FOLDER = 'note_folder',
        FORUM_TOPIC = 'forum_topic',
    }
}

