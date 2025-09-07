/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectFileResponse } from './ProjectFileResponse';
import type { SkillWithProficiency } from './SkillWithProficiency';
/**
 * 返回项目信息时的模型
 */
export type ProjectResponse = {
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
    title: string;
    description?: (string | null);
    /**
     * 项目所需技能列表及熟练度
     */
    required_skills?: (Array<SkillWithProficiency> | null);
    /**
     * 项目所需角色列表
     */
    required_roles?: (Array<string> | null);
    keywords?: (string | null);
    project_type?: (string | null);
    expected_deliverables?: (string | null);
    contact_person_info?: (string | null);
    learning_outcomes?: (string | null);
    team_size_preference?: (string | null);
    project_status?: (string | null);
    /**
     * 项目开始日期
     */
    start_date?: (string | null);
    /**
     * 项目结束日期
     */
    end_date?: (string | null);
    /**
     * 项目估计每周所需投入小时数
     */
    estimated_weekly_hours?: (number | null);
    /**
     * 项目所在地理位置，例如：广州大学城，珠海横琴新区，琶洲
     */
    location?: (string | null);
    /**
     * 项目封面图片的OSS URL
     */
    cover_image_url?: (string | null);
    /**
     * 原始上传的封面图片文件名
     */
    cover_image_original_filename?: (string | null);
    /**
     * 封面图片MIME类型，例如 'image/jpeg'
     */
    cover_image_type?: (string | null);
    /**
     * 封面图片文件大小（字节）
     */
    cover_image_size_bytes?: (number | null);
    id: number;
    combined_text?: (string | null);
    /**
     * 项目关联的文件列表
     */
    project_files?: (Array<ProjectFileResponse> | null);
};

