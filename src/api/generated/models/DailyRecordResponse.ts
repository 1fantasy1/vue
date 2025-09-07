/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 随手记录响应模型
 */
export type DailyRecordResponse = {
    owner_id: number;
    created_at: string;
    updated_at?: (string | null);
    content: string;
    mood?: (string | null);
    tags?: (string | null);
    id: number;
    combined_text?: (string | null);
};

