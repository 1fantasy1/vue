/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 项目申请响应模型
 */
export type ProjectApplicationResponse = {
    created_at: string;
    updated_at?: (string | null);
    /**
     * 申请留言，例如为什么想加入
     */
    message?: (string | null);
    id: number;
    project_id: number;
    student_id: number;
    status: ProjectApplicationResponse.status;
    applied_at: string;
    processed_at?: (string | null);
    processed_by_id?: (number | null);
    /**
     * 申请者姓名
     */
    applicant_name?: (string | null);
    /**
     * 申请者邮箱
     */
    applicant_email?: (string | null);
    /**
     * 审批者姓名
     */
    processor_name?: (string | null);
};
export namespace ProjectApplicationResponse {
    export enum status {
        PENDING = 'pending',
        APPROVED = 'approved',
        REJECTED = 'rejected',
    }
}

