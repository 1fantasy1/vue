/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 项目成员响应模型
 */
export type ProjectMemberResponse = {
    created_at: string;
    updated_at?: (string | null);
    /**
     * 项目成员角色: admin (管理员) 或 member (普通成员)
     */
    role?: ProjectMemberResponse.role;
    id: number;
    project_id: number;
    student_id: number;
    joined_at: string;
    /**
     * 成员姓名
     */
    member_name?: (string | null);
    /**
     * 成员邮箱
     */
    member_email?: (string | null);
};
export namespace ProjectMemberResponse {
    /**
     * 项目成员角色: admin (管理员) 或 member (普通成员)
     */
    export enum role {
        ADMIN = 'admin',
        MEMBER = 'member',
    }
}

