/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 提供者统计响应模型
 */
export type ProviderStats = {
    provider_name: string;
    total_requests: number;
    success_rate: number;
    average_response_time: number;
    error_count: number;
    cache_hit_rate?: (number | null);
};

