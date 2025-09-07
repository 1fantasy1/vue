/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumService {
    /**
     * 发布话题
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorForumTopicsPost(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forum/topics',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取话题列表
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorForumTopicsGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/forum/topics',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取话题详情
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorForumTopicsTopicIdGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/forum/topics/{topic_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新话题
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorForumTopicsTopicIdPut(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/forum/topics/{topic_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除话题
     * @param func
     * @returns void
     * @throws ApiError
     */
    public static decoratorForumTopicsTopicIdDelete(
        func: any,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/forum/topics/{topic_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取话题评论
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorForumTopicsTopicIdCommentsGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/forum/topics/{topic_id}/comments',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 发布评论
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorForumTopicsTopicIdCommentsPost(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forum/topics/{topic_id}/comments',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新评论
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorForumCommentsCommentIdPut(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/forum/comments/{comment_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除评论
     * @param func
     * @returns void
     * @throws ApiError
     */
    public static decoratorForumCommentsCommentIdDelete(
        func: any,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/forum/comments/{comment_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 点赞/取消点赞
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorForumLikePost(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forum/like',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 关注/取消关注用户
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorForumFollowPost(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forum/follow',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 智能搜索
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorForumSearchGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/forum/search',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取趋势话题
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorForumTrendingGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/forum/trending',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 单文件上传
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorForumUploadSinglePost(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forum/upload/single',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
