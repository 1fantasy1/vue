/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedResponse } from '../models/PaginatedResponse';
import type { Response } from '../models/Response';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LlmService {
    /**
     * Decorator
     * @param func
     * @returns PaginatedResponse Successful Response
     * @throws ApiError
     */
    public static decoratorApiLlmProvidersGet(
        func: any,
    ): CancelablePromise<PaginatedResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/llm/providers',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decorator
     * @param func
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static decoratorApiLlmProvidersPost(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/llm/providers',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decorator
     * @param func
     * @returns PaginatedResponse Successful Response
     * @throws ApiError
     */
    public static decoratorApiLlmConfigsGet(
        func: any,
    ): CancelablePromise<PaginatedResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/llm/configs',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decorator
     * @param func
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static decoratorApiLlmConfigsPost(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/llm/configs',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decorator
     * @param func
     * @returns PaginatedResponse Successful Response
     * @throws ApiError
     */
    public static decoratorApiLlmConversationsGet(
        func: any,
    ): CancelablePromise<PaginatedResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/llm/conversations',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decorator
     * @param func
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static decoratorApiLlmConversationsPost(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/llm/conversations',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decorator
     * @param func
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static decoratorApiLlmChatPost(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/llm/chat',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decorator
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorApiLlmChatStreamPost(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/llm/chat/stream',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decorator
     * @param func
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static decoratorApiLlmStatisticsGet(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/llm/statistics',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decorator
     * @param func
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static decoratorApiLlmHealthGet(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/llm/health',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
