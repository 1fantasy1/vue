/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * AI对话消息响应模型
 */
export type AIConversationMessageResponse = {
    created_at: string;
    updated_at?: (string | null);
    /**
     * 消息角色
     */
    role: AIConversationMessageResponse.role;
    /**
     * 消息内容（文本）
     */
    content: string;
    /**
     * 工具调用的JSON数据
     */
    tool_calls_json?: null;
    /**
     * 工具输出的JSON数据
     */
    tool_output_json?: (Record<string, any> | null);
    /**
     * 本次消息使用的LLM类型
     */
    llm_type_used?: (string | null);
    /**
     * 本次消息使用的LLM模型ID
     */
    llm_model_used?: (string | null);
    id: number;
    conversation_id: number;
    sent_at: string;
};
export namespace AIConversationMessageResponse {
    /**
     * 消息角色
     */
    export enum role {
        USER = 'user',
        ASSISTANT = 'assistant',
        TOOL_CALL = 'tool_call',
        TOOL_OUTPUT = 'tool_output',
    }
}

