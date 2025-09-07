/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 用户课程关系响应模型
 */
export type UserCourseResponse = {
    created_at: string;
    updated_at?: (string | null);
    student_id: number;
    course_id: number;
    progress?: (number | null);
    status?: (string | null);
    last_accessed: string;
};

