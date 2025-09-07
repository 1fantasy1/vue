/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SkillWithProficiency } from './SkillWithProficiency';
/**
 * 课程响应模型
 */
export type CourseResponse = {
    /**
     * 点赞数量
     */
    likes_count?: (number | null);
    /**
     * 当前用户是否已点赞
     */
    is_liked_by_current_user?: (boolean | null);
    created_at: string;
    updated_at?: (string | null);
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
    id: number;
    combined_text?: (string | null);
};

