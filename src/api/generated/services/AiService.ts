/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AIConversationMessageResponse } from '../models/AIConversationMessageResponse';
import type { AIConversationResponse } from '../models/AIConversationResponse';
import type { ChatResponse } from '../models/ChatResponse';
import type { ModelSwitchRequest } from '../models/ModelSwitchRequest';
import type { ProviderConfigUpdate } from '../models/ProviderConfigUpdate';
import type { ProviderInfo } from '../models/ProviderInfo';
import type { ProviderPerformance } from '../models/ProviderPerformance';
import type { ProviderStats } from '../models/ProviderStats';
import type { RealTimeMetrics } from '../models/RealTimeMetrics';
import type { SystemAlert } from '../models/SystemAlert';
import type { SystemMetrics } from '../models/SystemMetrics';
import type { SystemStatus } from '../models/SystemStatus';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AiService {
    /**
     * AI智能对话
     * @param func
     * @returns ChatResponse Successful Response
     * @throws ApiError
     */
    public static decoratorAiChatPost(
        func: any,
    ): CancelablePromise<ChatResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ai/chat',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 流式AI对话
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorAiChatStreamPost(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ai/chat/stream',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取对话列表
     * @param func
     * @returns AIConversationResponse Successful Response
     * @throws ApiError
     */
    public static decoratorAiConversationsGet(
        func: any,
    ): CancelablePromise<Array<AIConversationResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ai/conversations',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 创建新对话
     * @param func
     * @returns AIConversationResponse Successful Response
     * @throws ApiError
     */
    public static decoratorAiConversationsPost(
        func: any,
    ): CancelablePromise<AIConversationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ai/conversations',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取对话详情
     * @param func
     * @returns AIConversationResponse Successful Response
     * @throws ApiError
     */
    public static decoratorAiConversationsConversationIdGet(
        func: any,
    ): CancelablePromise<AIConversationResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ai/conversations/{conversation_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新对话
     * @param func
     * @returns AIConversationResponse Successful Response
     * @throws ApiError
     */
    public static decoratorAiConversationsConversationIdPut(
        func: any,
    ): CancelablePromise<AIConversationResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/ai/conversations/{conversation_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除对话
     * @param func
     * @returns void
     * @throws ApiError
     */
    public static decoratorAiConversationsConversationIdDelete(
        func: any,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/ai/conversations/{conversation_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取对话消息
     * @param func
     * @returns AIConversationMessageResponse Successful Response
     * @throws ApiError
     */
    public static decoratorAiConversationsConversationIdMessagesGet(
        func: any,
    ): CancelablePromise<Array<AIConversationMessageResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ai/conversations/{conversation_id}/messages',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除消息
     * @param func
     * @returns void
     * @throws ApiError
     */
    public static decoratorAiMessagesMessageIdDelete(
        func: any,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/ai/messages/{message_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 语义搜索
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorAiSemanticSearchPost(
        func: any,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ai/semantic-search',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取AI配置
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorAiConfigGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ai/config',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取AI使用统计
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorAiStatsGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ai/stats',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * AI服务健康检查
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorAiHealthGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ai/health',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 批量删除对话
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorAiConversationsBatchDeletePost(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ai/conversations/batch-delete',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 智能摘要
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorAiSummarizePost(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ai/summarize',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取系统状态
     * 获取系统整体状态
     * @returns SystemStatus Successful Response
     * @throws ApiError
     */
    public static getSystemStatusAiAdminSystemStatusGet(): CancelablePromise<SystemStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ai/admin/system/status',
            errors: {
                403: `禁止访问 - 需要管理员权限`,
                404: `资源未找到`,
            },
        });
    }
    /**
     * 获取系统指标
     * 获取详细系统指标
     * @returns SystemMetrics Successful Response
     * @throws ApiError
     */
    public static getSystemMetricsAiAdminSystemMetricsGet(): CancelablePromise<SystemMetrics> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ai/admin/system/metrics',
            errors: {
                403: `禁止访问 - 需要管理员权限`,
                404: `资源未找到`,
            },
        });
    }
    /**
     * 获取AI提供者列表
     * 列出所有AI提供者及其状态
     * @returns ProviderInfo Successful Response
     * @throws ApiError
     */
    public static listProvidersAiAdminProvidersGet(): CancelablePromise<Array<ProviderInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ai/admin/providers',
            errors: {
                403: `禁止访问 - 需要管理员权限`,
                404: `资源未找到`,
            },
        });
    }
    /**
     * 更新提供者配置
     * 更新提供者配置
     * @param providerName
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateProviderConfigAiAdminProvidersProviderNameConfigPost(
        providerName: string,
        requestBody: ProviderConfigUpdate,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ai/admin/providers/{provider_name}/config',
            path: {
                'provider_name': providerName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `禁止访问 - 需要管理员权限`,
                404: `资源未找到`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 重启AI提供者
     * 重启指定提供者
     * @param providerName
     * @returns any Successful Response
     * @throws ApiError
     */
    public static restartProviderAiAdminProvidersProviderNameRestartPost(
        providerName: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ai/admin/providers/{provider_name}/restart',
            path: {
                'provider_name': providerName,
            },
            errors: {
                403: `禁止访问 - 需要管理员权限`,
                404: `资源未找到`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 切换AI模型
     * 切换模型
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static switchModelAiAdminModelsSwitchPost(
        requestBody: ModelSwitchRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ai/admin/models/switch',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `禁止访问 - 需要管理员权限`,
                404: `资源未找到`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取提供者统计
     * 获取指定提供者的详细统计信息
     * @param providerName
     * @param hours
     * @returns ProviderStats Successful Response
     * @throws ApiError
     */
    public static getProviderStatsAiAdminProvidersProviderNameStatsGet(
        providerName: string,
        hours: number = 24,
    ): CancelablePromise<ProviderStats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ai/admin/providers/{provider_name}/stats',
            path: {
                'provider_name': providerName,
            },
            query: {
                'hours': hours,
            },
            errors: {
                403: `禁止访问 - 需要管理员权限`,
                404: `资源未找到`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 清空缓存
     * 清空缓存
     * @param providerName 仅清空指定提供者的缓存
     * @returns any Successful Response
     * @throws ApiError
     */
    public static clearCacheAiAdminCacheDelete(
        providerName?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/ai/admin/cache',
            query: {
                'provider_name': providerName,
            },
            errors: {
                403: `禁止访问 - 需要管理员权限`,
                404: `资源未找到`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取系统日志
     * 获取系统日志
     * @param level
     * @param hours
     * @param limit
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getSystemLogsAiAdminLogsGet(
        level: string = 'INFO',
        hours: number = 24,
        limit: number = 100,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ai/admin/logs',
            query: {
                'level': level,
                'hours': hours,
                'limit': limit,
            },
            errors: {
                403: `禁止访问 - 需要管理员权限`,
                404: `资源未找到`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取实时指标
     * 获取实时系统指标
     * @returns RealTimeMetrics Successful Response
     * @throws ApiError
     */
    public static getRealtimeMetricsAiMonitoringMetricsRealtimeGet(): CancelablePromise<RealTimeMetrics> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ai/monitoring/metrics/realtime',
        });
    }
    /**
     * 获取AI提供者性能指标
     * 获取AI提供者性能指标
     * @returns ProviderPerformance Successful Response
     * @throws ApiError
     */
    public static getProviderPerformanceAiMonitoringProvidersPerformanceGet(): CancelablePromise<Array<ProviderPerformance>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ai/monitoring/providers/performance',
        });
    }
    /**
     * 获取系统健康状态
     * 获取系统健康状态
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getSystemHealthAiMonitoringSystemHealthGet(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ai/monitoring/system/health',
        });
    }
    /**
     * 获取活跃告警
     * 获取当前活跃的告警
     * @returns SystemAlert Successful Response
     * @throws ApiError
     */
    public static getActiveAlertsAiMonitoringAlertsActiveGet(): CancelablePromise<Array<SystemAlert>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ai/monitoring/alerts/active',
        });
    }
    /**
     * 获取历史指标
     * 获取历史指标数据
     * @param hours 历史数据小时数
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getMetricsHistoryAiMonitoringMetricsHistoryGet(
        hours: number = 24,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ai/monitoring/metrics/history',
            query: {
                'hours': hours,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 创建告警规则
     * 创建新的告警规则
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createAlertRuleAiMonitoringAlertsRulesPost(
        requestBody: Record<string, any>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ai/monitoring/alerts/rules',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取错误统计
     * 获取错误统计信息
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getErrorStatsAiMonitoringStatsErrorsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ai/monitoring/stats/errors',
        });
    }
    /**
     * 记录请求指标
     * 记录请求指标（供内部调用）
     * @param responseTime
     * @param success
     * @returns any Successful Response
     * @throws ApiError
     */
    public static recordRequestMetricsAiMonitoringMetricsRecordPost(
        responseTime: number,
        success: boolean = true,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ai/monitoring/metrics/record',
            query: {
                'response_time': responseTime,
                'success': success,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
