/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AchievementPointsService {
    /**
     * 获取成就定义列表
     * 获取成就定义列表
     * @param page 页码
     * @param pageSize 每页大小
     * @param activeOnly 是否只获取激活的成就
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAchievementDefinitionsAchievementPointsAchievementsGet(
        page: number = 1,
        pageSize: number = 20,
        activeOnly: boolean = true,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/achievement-points/achievements',
            query: {
                'page': page,
                'page_size': pageSize,
                'active_only': activeOnly,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取用户积分信息
     * 获取用户积分信息
     * @param userId
     * @param includeHistory 是否包含积分历史
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getUserPointsAchievementPointsUsersUserIdPointsGet(
        userId: number,
        includeHistory: boolean = false,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/achievement-points/users/{user_id}/points',
            path: {
                'user_id': userId,
            },
            query: {
                'include_history': includeHistory,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取用户积分历史
     * 获取用户积分历史记录
     * @param userId
     * @param page 页码
     * @param pageSize 每页大小
     * @param action 操作类型过滤
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getUserPointsHistoryAchievementPointsUsersUserIdPointsHistoryGet(
        userId: number,
        page: number = 1,
        pageSize: number = 20,
        action?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/achievement-points/users/{user_id}/points/history',
            path: {
                'user_id': userId,
            },
            query: {
                'page': page,
                'page_size': pageSize,
                'action': action,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取用户成就
     * 获取用户成就信息
     * @param userId
     * @param includeLocked 是否包含未解锁的成就
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getUserAchievementsAchievementPointsUsersUserIdAchievementsGet(
        userId: number,
        includeLocked: boolean = false,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/achievement-points/users/{user_id}/achievements',
            path: {
                'user_id': userId,
            },
            query: {
                'include_locked': includeLocked,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 初始化默认成就
     * 初始化默认成就到数据库
     * @returns any Successful Response
     * @throws ApiError
     */
    public static initializeAchievementsAchievementPointsAchievementsInitPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/achievement-points/achievements/init',
        });
    }
    /**
     * 检查用户成就
     * 手动触发用户成就检查
     * @param userId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static checkUserAchievementsAchievementPointsUsersUserIdCheckAchievementsPost(
        userId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/achievement-points/users/{user_id}/check-achievements',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取积分排行榜
     * 获取积分排行榜
     * @param limit 排行榜数量
     * @param period 时间段 (all_time, monthly, weekly)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getPointsLeaderboardAchievementPointsLeaderboardGet(
        limit: number = 10,
        period: string = 'all_time',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/achievement-points/leaderboard',
            query: {
                'limit': limit,
                'period': period,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
