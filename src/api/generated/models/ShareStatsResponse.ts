/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ShareContentResponse } from './ShareContentResponse';
/**
 * 分享统计响应模型
 */
export type ShareStatsResponse = {
    /**
     * 总分享数
     */
    total_shares: number;
    /**
     * 按类型统计
     */
    shares_by_type: Record<string, number>;
    /**
     * 按平台统计
     */
    shares_by_platform: Record<string, number>;
    /**
     * 最近分享
     */
    recent_shares: Array<ShareContentResponse>;
    /**
     * 热门分享内容
     */
    top_shared_content: Array<Record<string, any>>;
};

