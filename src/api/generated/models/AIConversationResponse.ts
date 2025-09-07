/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * AI对话响应模型
 */
export type AIConversationResponse = {
    created_at: string;
    updated_at?: (string | null);
    /**
     * 对话标题
     */
    title?: (string | null);
    id: number;
    user_id: number;
    last_updated: string;
    /**
     * 对话中的总消息数量
     */
    total_messages_count?: (number | null);
};

