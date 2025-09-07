/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 分享链接响应模型
 */
export type ShareLinkResponse = {
    share_id: number;
    share_url: string;
    share_text: string;
    qr_code_url?: (string | null);
    expires_at?: (string | null);
    wechat_share?: (Record<string, any> | null);
    qq_share?: (Record<string, any> | null);
};

