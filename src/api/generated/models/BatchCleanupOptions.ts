/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 批量清理选项模型
 */
export type BatchCleanupOptions = {
    /**
     * 清理已删除的聊天室
     */
    cleanup_deleted_rooms?: boolean;
    /**
     * 清理过期消息
     */
    cleanup_old_messages?: boolean;
    /**
     * 清理无效成员
     */
    cleanup_invalid_members?: boolean;
    /**
     * 清理过期文件
     */
    cleanup_expired_files?: boolean;
    /**
     * 清理天数阈值
     */
    days_threshold?: number;
};

