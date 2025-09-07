/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 系统告警
 */
export type SystemAlert = {
    id: string;
    rule_id: string;
    level: string;
    message: string;
    metric_value: number;
    threshold: number;
    triggered_at: string;
    resolved_at?: (string | null);
};

