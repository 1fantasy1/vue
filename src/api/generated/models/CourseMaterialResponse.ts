/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 课程材料响应模型
 */
export type CourseMaterialResponse = {
    created_at: string;
    updated_at?: (string | null);
    /**
     * 课程材料标题
     */
    title: string;
    /**
     * 材料类型
     */
    type: CourseMaterialResponse.type;
    /**
     * 外部链接URL或文件URL
     */
    url?: (string | null);
    /**
     * 文本内容或补充描述
     */
    content?: (string | null);
    /**
     * 原始上传文件名
     */
    original_filename?: (string | null);
    /**
     * 文件MIME类型
     */
    file_type?: (string | null);
    /**
     * 文件大小（字节）
     */
    size_bytes?: (number | null);
    id: number;
    course_id: number;
    combined_text?: (string | null);
};
export namespace CourseMaterialResponse {
    /**
     * 材料类型
     */
    export enum type {
        FILE = 'file',
        LINK = 'link',
        TEXT = 'text',
        VIDEO = 'video',
        IMAGE = 'image',
    }
}

