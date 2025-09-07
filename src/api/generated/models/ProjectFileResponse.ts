/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 项目文件响应模型
 */
export type ProjectFileResponse = {
    created_at: string;
    updated_at?: (string | null);
    /**
     * 原始文件名
     */
    file_name: string;
    /**
     * 文件描述
     */
    description?: (string | null);
    /**
     * 文件访问权限
     */
    access_type?: ProjectFileResponse.access_type;
    id: number;
    project_id: number;
    upload_by_id: number;
    /**
     * 文件在OSS中的对象名称
     */
    oss_object_name: string;
    /**
     * 文件在OSS上的完整URL
     */
    file_path: string;
    /**
     * 文件的MIME类型
     */
    file_type?: (string | null);
    /**
     * 文件大小（字节）
     */
    size_bytes?: (number | null);
};
export namespace ProjectFileResponse {
    /**
     * 文件访问权限
     */
    export enum access_type {
        PUBLIC = 'public',
        MEMBER_ONLY = 'member_only',
    }
}

