/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 实时指标模型
 */
export type RealTimeMetrics = {
    timestamp: string;
    requests_per_second: number;
    average_response_time: number;
    error_rate: number;
    active_connections: number;
    memory_usage_mb: number;
    cpu_usage_percent: number;
    cache_hit_rate: number;
};

