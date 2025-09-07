/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SkillWithProficiency } from './SkillWithProficiency';
/**
 * 返回学生信息时的模型 (不包含密码哈希)
 */
export type StudentResponse = {
    created_at: string;
    updated_at?: (string | null);
    /**
     * 用户在平台内唯一的用户名/昵称
     */
    username?: (string | null);
    /**
     * 用户手机号，用于登录和重置密码
     */
    phone_number?: (string | null);
    /**
     * 用户所属学校名称
     */
    school?: (string | null);
    /**
     * 用户真实姓名
     */
    name?: (string | null);
    major?: (string | null);
    /**
     * 用户技能列表及熟练度
     */
    skills?: (Array<SkillWithProficiency> | null);
    interests?: (string | null);
    bio?: (string | null);
    awards_competitions?: (string | null);
    academic_achievements?: (string | null);
    soft_skills?: (string | null);
    portfolio_link?: (string | null);
    preferred_role?: (string | null);
    availability?: (string | null);
    /**
     * 学生所在地理位置，例如：广州大学城，珠海横琴
     */
    location?: (string | null);
    id: number;
    email?: (string | null);
    combined_text?: (string | null);
    embedding?: (Array<number> | null);
    llm_api_type?: ('openai' | 'zhipu' | 'siliconflow' | 'huoshanengine' | 'kimi' | 'deepseek' | 'custom_openai' | null);
    llm_api_base_url?: (string | null);
    llm_model_id?: (string | null);
    llm_model_ids?: (Record<string, Array<string>> | null);
    llm_api_key_encrypted?: (string | null);
    is_admin: boolean;
    total_points: number;
    last_login_at?: (string | null);
    login_count: number;
    /**
     * 用户创建并已完成的项目总数
     */
    completed_projects_count?: (number | null);
    /**
     * 用户完成的课程总数
     */
    completed_courses_count?: (number | null);
};

