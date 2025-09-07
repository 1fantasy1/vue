/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 转发操作响应模型
 */
export type ForwardOperationResponse = {
    success: boolean;
    message: string;
    /**
     * 总消息数
     */
    total_messages?: number;
    /**
     * 总聊天室数
     */
    total_rooms?: number;
    /**
     * 成功转发数
     */
    successful_forwards?: number;
    /**
     * 失败转发数
     */
    failed_forwards?: number;
    /**
     * 详细结果列表
     */
    results?: Array<Record<string, any>>;
};

