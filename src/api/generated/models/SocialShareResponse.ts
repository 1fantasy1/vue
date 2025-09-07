/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 社交平台分享响应模型
 */
export type SocialShareResponse = {
    share_id: number;
    platform: string;
    share_url: string;
    share_text: string;
    qr_code_url?: (string | null);
    wechat_config?: (Record<string, any> | null);
    qq_config?: (Record<string, any> | null);
    /**
     * 分享操作指导
     */
    share_instructions: string;
};

