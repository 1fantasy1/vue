/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { McpStatusResponse } from '../models/McpStatusResponse';
import type { McpToolDefinition } from '../models/McpToolDefinition';
import type { UserMcpConfigResponse } from '../models/UserMcpConfigResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class McpService {
    /**
     * 获取MCP配置列表
     * @param func
     * @returns UserMcpConfigResponse Successful Response
     * @throws ApiError
     */
    public static decoratorMcpConfigsGet(
        func: any,
    ): CancelablePromise<Array<UserMcpConfigResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mcp/configs',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 创建MCP配置
     * @param func
     * @returns UserMcpConfigResponse Successful Response
     * @throws ApiError
     */
    public static decoratorMcpConfigsPost(
        func: any,
    ): CancelablePromise<UserMcpConfigResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/mcp/configs',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取MCP配置详情
     * @param func
     * @returns UserMcpConfigResponse Successful Response
     * @throws ApiError
     */
    public static decoratorMcpConfigsConfigIdGet(
        func: any,
    ): CancelablePromise<UserMcpConfigResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mcp/configs/{config_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新MCP配置
     * @param func
     * @returns UserMcpConfigResponse Successful Response
     * @throws ApiError
     */
    public static decoratorMcpConfigsConfigIdPut(
        func: any,
    ): CancelablePromise<UserMcpConfigResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/mcp/configs/{config_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除MCP配置
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorMcpConfigsConfigIdDelete(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/mcp/configs/{config_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 测试MCP连接
     * @param func
     * @returns McpStatusResponse Successful Response
     * @throws ApiError
     */
    public static decoratorMcpConfigsConfigIdTestPost(
        func: any,
    ): CancelablePromise<McpStatusResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/mcp/configs/{config_id}/test',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取MCP连接状态
     * @param func
     * @returns McpStatusResponse Successful Response
     * @throws ApiError
     */
    public static decoratorMcpConfigsConfigIdStatusGet(
        func: any,
    ): CancelablePromise<McpStatusResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mcp/configs/{config_id}/status',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取MCP工具列表
     * @param func
     * @returns McpToolDefinition Successful Response
     * @throws ApiError
     */
    public static decoratorMcpConfigsConfigIdToolsGet(
        func: any,
    ): CancelablePromise<Array<McpToolDefinition>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mcp/configs/{config_id}/tools',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 批量测试MCP连接
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorMcpConfigsBatchTestPost(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/mcp/configs/batch-test',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取MCP统计信息
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorMcpStatsGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mcp/stats',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * MCP模块健康检查
     * MCP模块健康检查 - 优化版本
     * @returns any Successful Response
     * @throws ApiError
     */
    public static mcpHealthCheckMcpHealthGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mcp/health',
        });
    }
}
