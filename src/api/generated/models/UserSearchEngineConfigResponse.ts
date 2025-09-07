/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 用户搜索引擎配置响应模型
 */
export type UserSearchEngineConfigResponse = {
    created_at: string;
    updated_at?: (string | null);
    name?: (string | null);
    engine_type?: ('bing' | 'tavily' | 'baidu' | 'google_cse' | 'custom' | null);
    api_key?: (string | null);
    is_active?: (boolean | null);
    description?: (string | null);
    /**
     * 搜索引擎API的基础URL
     */
    base_url?: (string | null);
    id: number;
    owner_id: number;
};

