/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Body_upload_files_chatrooms__room_id__upload__post = {
    /**
     * 文件类型: audio, image, document, video
     */
    file_type: string;
    files: Array<Blob>;
    reply_to_id?: number;
};

