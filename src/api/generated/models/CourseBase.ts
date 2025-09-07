/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SkillWithProficiency } from './SkillWithProficiency';
/**
 * 课程基础模型
 */
export type CourseBase = {
    /**
     * 课程标题
     */
    title: string;
    /**
     * 课程描述
     */
    description?: (string | null);
    /**
     * 讲师姓名
     */
    instructor?: (string | null);
    /**
     * 课程分类
     */
    category?: (string | null);
    /**
     * 总课时数
     */
    total_lessons?: (number | null);
    /**
     * 平均评分
     */
    avg_rating?: (number | null);
    /**
     * 课程封面图片的URL链接
     */
    cover_image_url?: (string | null);
    /**
     * 课程所需基础技能列表
     */
    required_skills?: (Array<SkillWithProficiency> | null);
};

