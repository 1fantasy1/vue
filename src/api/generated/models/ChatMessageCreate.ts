/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 创建聊天消息模型
 */
export type ChatMessageCreate = {
    content_text?: (string | null);
    message_type?: ChatMessageCreate.message_type;
    /**
     * 媒体文件OSS URL或外部链接
     */
    media_url?: (string | null);
    /**
     * 回复的消息ID
     */
    reply_to_message_id?: (number | null);
    /**
     * 文件大小（字节）
     */
    file_size?: (number | null);
    /**
     * 原始文件名
     */
    original_filename?: (string | null);
    /**
     * 音频时长（秒）
     */
    audio_duration?: (number | null);
    /**
     * 是否置顶消息
     */
    is_pinned?: (boolean | null);
};
export namespace ChatMessageCreate {
    export enum message_type {
        TEXT = 'text',
        IMAGE = 'image',
        FILE = 'file',
        VIDEO = 'video',
        AUDIO = 'audio',
        SYSTEM_NOTIFICATION = 'system_notification',
    }
}

