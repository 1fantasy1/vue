/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedResponse } from '../models/PaginatedResponse';
import type { Response } from '../models/Response';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TtsService {
    /**
     * Decorator
     * @param func
     * @returns PaginatedResponse Successful Response
     * @throws ApiError
     */
    public static decoratorApiTtsConfigsGet(
        func: any,
    ): CancelablePromise<PaginatedResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tts/configs',
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
    public static decoratorApiTtsConfigsPost(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tts/configs',
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
    public static decoratorApiTtsConfigsConfigIdGet(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tts/configs/{config_id}',
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
    public static decoratorApiTtsConfigsConfigIdPut(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/tts/configs/{config_id}',
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
    public static decoratorApiTtsConfigsConfigIdDelete(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/tts/configs/{config_id}',
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
    public static decoratorApiTtsSynthesizePost(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tts/synthesize',
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
    public static decoratorApiTtsProvidersGet(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tts/providers',
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
    public static decoratorApiTtsHealthGet(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tts/health',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
