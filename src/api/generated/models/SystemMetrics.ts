/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 系统指标响应
 */
export type SystemMetrics = {
    timestamp: string;
    uptime_seconds: number;
    total_requests: number;
    success_rate: number;
    average_response_time: number;
    error_count: number;
    cache_hit_rate: number;
    active_providers: number;
    memory_usage_mb?: (number | null);
    cpu_usage_percent?: (number | null);
};

