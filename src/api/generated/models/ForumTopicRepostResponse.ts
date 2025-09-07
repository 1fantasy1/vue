/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 论坛话题转发响应模型
 */
export type ForumTopicRepostResponse = {
    share_type: string;
    success: boolean;
    message: string;
    new_topic_id?: (number | null);
    topic_url?: (string | null);
    chatroom_results?: null;
    success_count?: (number | null);
    failed_count?: (number | null);
};

