/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 提供者性能指标
 */
export type ProviderPerformance = {
    provider_name: string;
    model: string;
    total_requests: number;
    successful_requests: number;
    failed_requests: number;
    average_response_time: number;
    p95_response_time: number;
    p99_response_time: number;
    tokens_per_second: number;
    cost_estimate: number;
};

