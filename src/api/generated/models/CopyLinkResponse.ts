/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 复制链接响应模型
 */
export type CopyLinkResponse = {
    share_id: number;
    share_url: string;
    share_text: string;
    qr_code_url?: (string | null);
    /**
     * 复制成功提示信息
     */
    copy_success_message: string;
    /**
     * 分享使用提示
     */
    sharing_tips: Array<string>;
};

