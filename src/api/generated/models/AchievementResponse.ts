/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 成就响应模型
 */
export type AchievementResponse = {
    created_at: string;
    updated_at?: (string | null);
    /**
     * 成就名称
     */
    name: string;
    /**
     * 成就描述
     */
    description: string;
    /**
     * 达成成就的条件类型
     */
    criteria_type: AchievementResponse.criteria_type;
    /**
     * 达成成就所需的数值门槛
     */
    criteria_value: number;
    /**
     * 勋章图片或图标URL
     */
    badge_url?: (string | null);
    /**
     * 达成此成就额外奖励的积分
     */
    reward_points?: number;
    /**
     * 该成就是否启用
     */
    is_active?: boolean;
    id: number;
};
export namespace AchievementResponse {
    /**
     * 达成成就的条件类型
     */
    export enum criteria_type {
        PROJECT_COMPLETED_COUNT = 'PROJECT_COMPLETED_COUNT',
        COURSE_COMPLETED_COUNT = 'COURSE_COMPLETED_COUNT',
        FORUM_LIKES_RECEIVED = 'FORUM_LIKES_RECEIVED',
        DAILY_LOGIN_STREAK = 'DAILY_LOGIN_STREAK',
        FORUM_POSTS_COUNT = 'FORUM_POSTS_COUNT',
        CHAT_MESSAGES_SENT_COUNT = 'CHAT_MESSAGES_SENT_COUNT',
        LOGIN_COUNT = 'LOGIN_COUNT',
    }
}

