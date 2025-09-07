/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 系统状态响应模型
 */
export type SystemStatus = {
    timestamp: string;
    status: string;
    enterprise_features: boolean;
    uptime_seconds: number;
    version?: string;
};

