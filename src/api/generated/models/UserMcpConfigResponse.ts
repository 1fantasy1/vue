/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 用户MCP配置响应模型
 */
export type UserMcpConfigResponse = {
    created_at: string;
    updated_at?: (string | null);
    name?: (string | null);
    mcp_type?: ('modelscope_community' | 'custom_mcp' | null);
    base_url?: (string | null);
    protocol_type?: ('sse' | 'http_rest' | 'websocket' | null);
    api_key?: (string | null);
    is_active?: (boolean | null);
    description?: (string | null);
    id: number;
    owner_id: number;
};

