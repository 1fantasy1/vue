/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 项目统计响应模型
 */
export type ProjectStatsResponse = {
    /**
     * 项目总数
     */
    total_projects?: number;
    /**
     * 我的项目数
     */
    my_projects?: number;
    /**
     * 参与的项目数
     */
    joined_projects?: number;
    /**
     * 待处理申请数
     */
    pending_applications?: number;
    /**
     * 已通过申请数
     */
    approved_applications?: number;
    /**
     * 已拒绝申请数
     */
    rejected_applications?: number;
};

