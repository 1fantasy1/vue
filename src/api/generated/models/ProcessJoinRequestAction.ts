/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 处理加入申请的动作模型
 */
export type ProcessJoinRequestAction = {
    /**
     * 处理动作：批准或拒绝
     */
    action: ProcessJoinRequestAction.action;
    /**
     * 管理员留言
     */
    message?: (string | null);
};
export namespace ProcessJoinRequestAction {
    /**
     * 处理动作：批准或拒绝
     */
    export enum action {
        APPROVED = 'approved',
        REJECTED = 'rejected',
    }
}

