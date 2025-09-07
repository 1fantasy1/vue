/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 分享内容响应模型
 */
export type ShareContentResponse = {
    id: number;
    content_type: string;
    content_id: number;
    content_title: (string | null);
    content_description: (string | null);
    share_type: string;
    target_id: (number | null);
    is_public: boolean;
    allow_comments: boolean;
    expires_at: (string | null);
    view_count: number;
    click_count: number;
    share_count: number;
    owner_id: number;
    status: string;
    created_at: string;
    updated_at: (string | null);
    owner_name?: (string | null);
    target_name?: (string | null);
    share_url?: (string | null);
};

