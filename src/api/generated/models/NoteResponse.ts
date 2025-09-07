/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 笔记响应模型
 */
export type NoteResponse = {
    owner_id: number;
    created_at: string;
    updated_at?: (string | null);
    title?: (string | null);
    content?: (string | null);
    note_type?: (string | null);
    /**
     * 关联的课程ID
     */
    course_id?: (number | null);
    tags?: (string | null);
    /**
     * 课程章节信息，例如：第一章 - AI概述
     */
    chapter?: (string | null);
    /**
     * 笔记中嵌入的图片、视频或文件的OSS URL
     */
    media_url?: (string | null);
    /**
     * 媒体类型
     */
    media_type?: ('image' | 'video' | 'file' | null);
    /**
     * 原始上传文件名
     */
    original_filename?: (string | null);
    /**
     * 媒体文件大小（字节）
     */
    media_size_bytes?: (number | null);
    /**
     * 关联的用户自定义文件夹ID
     */
    folder_id?: (number | null);
    id: number;
    combined_text?: (string | null);
};

