/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 返回文件夹信息的响应模型
 */
export type FolderResponse = {
    owner_id: number;
    created_at: string;
    updated_at?: (string | null);
    /**
     * 文件夹名称
     */
    name: string;
    /**
     * 文件夹描述
     */
    description?: (string | null);
    /**
     * 文件夹颜色（十六进制）
     */
    color?: (string | null);
    /**
     * 文件夹图标名称
     */
    icon?: (string | null);
    /**
     * 父文件夹ID
     */
    parent_id?: (number | null);
    /**
     * 排序顺序
     */
    order?: (number | null);
    /**
     * 是否公开文件夹
     */
    is_public?: (boolean | null);
    /**
     * 文件夹标签
     */
    tags?: (Array<string> | null);
    id: number;
    /**
     * 包含的项目数量
     */
    item_count?: (number | null);
    /**
     * 直接收藏内容数量
     */
    content_count?: (number | null);
    /**
     * 子文件夹数量
     */
    subfolder_count?: (number | null);
    /**
     * 总文件大小（字节）
     */
    total_size?: (number | null);
    /**
     * 最后访问时间
     */
    last_accessed?: (string | null);
    /**
     * 文件夹路径
     */
    path?: null;
    /**
     * 文件夹深度
     */
    depth?: (number | null);
    /**
     * 统计信息
     */
    stats?: (Record<string, any> | null);
    /**
     * 子文件夹
     */
    children?: (Array<FolderResponse> | null);
};

