/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 优化的聊天响应模型
 */
export type ChatResponse = {
    conversation_id: number;
    user_message_id: number;
    ai_message_id: number;
    content: string;
    model_used: string;
    tokens_used: number;
    response_time_ms: number;
    tools_used?: Array<string>;
    cached?: boolean;
};

