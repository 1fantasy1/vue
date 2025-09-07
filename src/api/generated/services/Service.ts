/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AchievementResponse } from '../models/AchievementResponse';
import type { BatchCleanupOptions } from '../models/BatchCleanupOptions';
import type { BatchForwardMessageRequest } from '../models/BatchForwardMessageRequest';
import type { Body_create_course_material_courses__course_id__materials__post } from '../models/Body_create_course_material_courses__course_id__materials__post';
import type { Body_update_course_material_courses__course_id__materials__material_id__put } from '../models/Body_update_course_material_courses__course_id__materials__material_id__put';
import type { Body_upload_audio_file_legacy_chatrooms__room_id__upload_audio__post } from '../models/Body_upload_audio_file_legacy_chatrooms__room_id__upload_audio__post';
import type { Body_upload_document_files_legacy_chatrooms__room_id__upload_documents__post } from '../models/Body_upload_document_files_legacy_chatrooms__room_id__upload_documents__post';
import type { Body_upload_files_chatrooms__room_id__upload__post } from '../models/Body_upload_files_chatrooms__room_id__upload__post';
import type { Body_upload_gallery_files_legacy_chatrooms__room_id__upload_gallery__post } from '../models/Body_upload_gallery_files_legacy_chatrooms__room_id__upload_gallery__post';
import type { Body_upload_video_file_legacy_chatrooms__room_id__upload_video__post } from '../models/Body_upload_video_file_legacy_chatrooms__room_id__upload_video__post';
import type { ChatMessageCreate } from '../models/ChatMessageCreate';
import type { ChatMessageResponse } from '../models/ChatMessageResponse';
import type { ChatRoomCreate } from '../models/ChatRoomCreate';
import type { ChatRoomJoinRequestCreate } from '../models/ChatRoomJoinRequestCreate';
import type { ChatRoomJoinRequestResponse } from '../models/ChatRoomJoinRequestResponse';
import type { ChatRoomMemberResponse } from '../models/ChatRoomMemberResponse';
import type { ChatRoomMemberRoleUpdate } from '../models/ChatRoomMemberRoleUpdate';
import type { ChatRoomResponse } from '../models/ChatRoomResponse';
import type { ChatRoomUpdate } from '../models/ChatRoomUpdate';
import type { CollectedContentResponse } from '../models/CollectedContentResponse';
import type { CopyLinkRequest } from '../models/CopyLinkRequest';
import type { CopyLinkResponse } from '../models/CopyLinkResponse';
import type { CourseBase } from '../models/CourseBase';
import type { CourseLikeResponse } from '../models/CourseLikeResponse';
import type { CourseMaterialResponse } from '../models/CourseMaterialResponse';
import type { CourseResponse } from '../models/CourseResponse';
import type { CourseUpdate } from '../models/CourseUpdate';
import type { DailyRecordResponse } from '../models/DailyRecordResponse';
import type { DashboardCourseCard } from '../models/DashboardCourseCard';
import type { DashboardProjectCard } from '../models/DashboardProjectCard';
import type { DashboardSummaryResponse } from '../models/DashboardSummaryResponse';
import type { FolderResponse } from '../models/FolderResponse';
import type { FolderStatsResponse } from '../models/FolderStatsResponse';
import type { ForumTopicRepostRequest } from '../models/ForumTopicRepostRequest';
import type { ForumTopicRepostResponse } from '../models/ForumTopicRepostResponse';
import type { ForwardFileRequest } from '../models/ForwardFileRequest';
import type { ForwardMessageRequest } from '../models/ForwardMessageRequest';
import type { ForwardOperationResponse } from '../models/ForwardOperationResponse';
import type { KnowledgeBaseSimpleResponse } from '../models/KnowledgeBaseSimpleResponse';
import type { KnowledgeDocumentSimpleResponse } from '../models/KnowledgeDocumentSimpleResponse';
import type { KnowledgeSearchResponse } from '../models/KnowledgeSearchResponse';
import type { NoteResponse } from '../models/NoteResponse';
import type { PointTransactionResponse } from '../models/PointTransactionResponse';
import type { ProcessJoinRequestAction } from '../models/ProcessJoinRequestAction';
import type { ProjectApplicationResponse } from '../models/ProjectApplicationResponse';
import type { ProjectFileResponse } from '../models/ProjectFileResponse';
import type { ProjectLikeResponse } from '../models/ProjectLikeResponse';
import type { ProjectMemberResponse } from '../models/ProjectMemberResponse';
import type { ProjectResponse } from '../models/ProjectResponse';
import type { ProjectStatsResponse } from '../models/ProjectStatsResponse';
import type { QuickShareRequest } from '../models/QuickShareRequest';
import type { QuickShareResponse } from '../models/QuickShareResponse';
import type { Response } from '../models/Response';
import type { ShareableContentPreview } from '../models/ShareableContentPreview';
import type { ShareContentRequest } from '../models/ShareContentRequest';
import type { ShareContentResponse } from '../models/ShareContentResponse';
import type { ShareLinkResponse } from '../models/ShareLinkResponse';
import type { ShareStatsResponse } from '../models/ShareStatsResponse';
import type { ShareToChatroomRequest } from '../models/ShareToChatroomRequest';
import type { ShareToChatroomResponse } from '../models/ShareToChatroomResponse';
import type { ShareToForumRequest } from '../models/ShareToForumRequest';
import type { ShareToForumResponse } from '../models/ShareToForumResponse';
import type { SocialShareRequest } from '../models/SocialShareRequest';
import type { SocialShareResponse } from '../models/SocialShareResponse';
import type { StudentResponse } from '../models/StudentResponse';
import type { Token } from '../models/Token';
import type { UserCourseResponse } from '../models/UserCourseResponse';
import type { UserSearchEngineConfigResponse } from '../models/UserSearchEngineConfigResponse';
import type { WebSearchResponse } from '../models/WebSearchResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Service {
    /**
     * 健康检查
     * 检查API服务是否正常运行 - 优化版本
     * @returns any Successful Response
     * @throws ApiError
     */
    public static healthCheckHealthGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
        });
    }
    /**
     * 用户注册
     * @param func
     * @returns StudentResponse Successful Response
     * @throws ApiError
     */
    public static decoratorRegisterPost(
        func: any,
    ): CancelablePromise<StudentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/register',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 用户登录
     * @param func
     * @returns Token Successful Response
     * @throws ApiError
     */
    public static decoratorTokenPost(
        func: any,
    ): CancelablePromise<Token> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/token',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取当前用户信息
     * @param func
     * @returns StudentResponse Successful Response
     * @throws ApiError
     */
    public static decoratorUsersMeGet(
        func: any,
    ): CancelablePromise<StudentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新当前用户信息
     * @param func
     * @returns StudentResponse Successful Response
     * @throws ApiError
     */
    public static decoratorUsersMePut(
        func: any,
    ): CancelablePromise<StudentResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/me',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 修改密码
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorChangePasswordPost(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/change-password',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 停用账户
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorDeactivatePost(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deactivate',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取用户统计信息
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorUsersMeStatsGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me/stats',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取用户列表
     * @param func
     * @returns StudentResponse Successful Response
     * @throws ApiError
     */
    public static decoratorAdminUsersGet(
        func: any,
    ): CancelablePromise<Array<StudentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/users',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取用户详情
     * @param func
     * @returns StudentResponse Successful Response
     * @throws ApiError
     */
    public static decoratorAdminUsersUserIdGet(
        func: any,
    ): CancelablePromise<StudentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/users/{user_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 设置管理员权限
     * @param func
     * @returns StudentResponse Successful Response
     * @throws ApiError
     */
    public static decoratorAdminUsersUserIdSetAdminPut(
        func: any,
    ): CancelablePromise<StudentResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/users/{user_id}/set-admin',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 暂停用户账户
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorAdminUsersUserIdSuspendPost(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/users/{user_id}/suspend',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取成就列表
     * @param func
     * @returns AchievementResponse Successful Response
     * @throws ApiError
     */
    public static decoratorAdminAchievementsGet(
        func: any,
    ): CancelablePromise<Array<AchievementResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/achievements',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 创建成就
     * @param func
     * @returns AchievementResponse Successful Response
     * @throws ApiError
     */
    public static decoratorAdminAchievementsPost(
        func: any,
    ): CancelablePromise<AchievementResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/achievements',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新成就
     * @param func
     * @returns AchievementResponse Successful Response
     * @throws ApiError
     */
    public static decoratorAdminAchievementsAchievementIdPut(
        func: any,
    ): CancelablePromise<AchievementResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/achievements/{achievement_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除成就
     * @param func
     * @returns void
     * @throws ApiError
     */
    public static decoratorAdminAchievementsAchievementIdDelete(
        func: any,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/achievements/{achievement_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 调整用户积分
     * @param func
     * @returns PointTransactionResponse Successful Response
     * @throws ApiError
     */
    public static decoratorAdminPointsRewardPost(
        func: any,
    ): CancelablePromise<PointTransactionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/points/reward',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取积分交易记录
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorAdminPointsTransactionsGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/points/transactions',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 系统状态监控
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorAdminSystemStatusGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/system/status',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * RAG功能状态检查
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorAdminRagStatusGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/rag/status',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 创建数据备份
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorAdminDataBackupPost(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/data/backup',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取系统日志
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorAdminLogsGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/logs',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取所有项目
     * @param func
     * @returns ProjectResponse Successful Response
     * @throws ApiError
     */
    public static decoratorProjectsGet(
        func: any,
    ): CancelablePromise<Array<ProjectResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 创建新项目
     * @param func
     * @returns ProjectResponse Successful Response
     * @throws ApiError
     */
    public static decoratorProjectsPost(
        func: any,
    ): CancelablePromise<ProjectResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/projects',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取项目详情
     * @param func
     * @returns ProjectResponse Successful Response
     * @throws ApiError
     */
    public static decoratorProjectsProjectIdGet(
        func: any,
    ): CancelablePromise<ProjectResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/{project_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新项目信息
     * @param func
     * @returns ProjectResponse Successful Response
     * @throws ApiError
     */
    public static decoratorProjectsProjectIdPut(
        func: any,
    ): CancelablePromise<ProjectResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/projects/{project_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除项目
     * @param func
     * @returns void
     * @throws ApiError
     */
    public static decoratorProjectsProjectIdDelete(
        func: any,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/projects/{project_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 申请加入项目
     * @param func
     * @returns ProjectApplicationResponse Successful Response
     * @throws ApiError
     */
    public static decoratorProjectsProjectIdApplyPost(
        func: any,
    ): CancelablePromise<ProjectApplicationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/projects/{project_id}/apply',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取项目申请列表
     * @param func
     * @returns ProjectApplicationResponse Successful Response
     * @throws ApiError
     */
    public static decoratorProjectsProjectIdApplicationsGet(
        func: any,
    ): CancelablePromise<Array<ProjectApplicationResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/{project_id}/applications',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 处理项目申请
     * @param func
     * @returns ProjectApplicationResponse Successful Response
     * @throws ApiError
     */
    public static decoratorProjectsApplicationsApplicationIdActionPut(
        func: any,
    ): CancelablePromise<ProjectApplicationResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/projects/applications/{application_id}/{action}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取项目成员列表
     * @param func
     * @returns ProjectMemberResponse Successful Response
     * @throws ApiError
     */
    public static decoratorProjectsProjectIdMembersGet(
        func: any,
    ): CancelablePromise<Array<ProjectMemberResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/{project_id}/members',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 移除项目成员
     * @param func
     * @returns void
     * @throws ApiError
     */
    public static decoratorProjectsProjectIdMembersMemberIdDelete(
        func: any,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/projects/{project_id}/members/{member_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 上传项目文件
     * @param func
     * @returns ProjectFileResponse Successful Response
     * @throws ApiError
     */
    public static decoratorProjectsProjectIdFilesPost(
        func: any,
    ): CancelablePromise<ProjectFileResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/projects/{project_id}/files',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除项目文件
     * @param func
     * @returns void
     * @throws ApiError
     */
    public static decoratorProjectsFilesFileIdDelete(
        func: any,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/projects/files/{file_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 点赞项目
     * @param func
     * @returns ProjectLikeResponse Successful Response
     * @throws ApiError
     */
    public static decoratorProjectsProjectIdLikePost(
        func: any,
    ): CancelablePromise<ProjectLikeResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/projects/{project_id}/like',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 取消点赞项目
     * @param func
     * @returns void
     * @throws ApiError
     */
    public static decoratorProjectsProjectIdUnlikeDelete(
        func: any,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/projects/{project_id}/unlike',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 搜索项目
     * @param func
     * @returns ProjectResponse Successful Response
     * @throws ApiError
     */
    public static decoratorProjectsSearchGet(
        func: any,
    ): CancelablePromise<Array<ProjectResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/search',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取项目统计信息
     * @param func
     * @returns ProjectStatsResponse Successful Response
     * @throws ApiError
     */
    public static decoratorProjectsStatsGet(
        func: any,
    ): CancelablePromise<ProjectStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/stats',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 创建文件夹
     * @param func
     * @returns FolderResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCourseNotesPost(
        func: any,
    ): CancelablePromise<FolderResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/course-notes/',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取用户的文件夹树
     * @param func
     * @returns FolderResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCourseNotesGet(
        func: any,
    ): CancelablePromise<Array<FolderResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/course-notes/',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取文件夹详情
     * @param func
     * @returns FolderResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCourseNotesFolderIdGet(
        func: any,
    ): CancelablePromise<FolderResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/course-notes/{folder_id}',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新文件夹
     * @param func
     * @returns FolderResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCourseNotesFolderIdPut(
        func: any,
    ): CancelablePromise<FolderResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/course-notes/{folder_id}',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除文件夹
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorCourseNotesFolderIdDelete(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/course-notes/{folder_id}',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 在指定文件夹中创建笔记
     * @param func
     * @returns NoteResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCourseNotesFolderIdNotesPost(
        func: any,
    ): CancelablePromise<NoteResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/course-notes/{folder_id}/notes',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取文件夹中的笔记
     * @param func
     * @returns NoteResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCourseNotesFolderIdNotesGet(
        func: any,
    ): CancelablePromise<Array<NoteResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/course-notes/{folder_id}/notes',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取指定笔记详情
     * @param func
     * @returns NoteResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCourseNotesNotesNoteIdGet(
        func: any,
    ): CancelablePromise<NoteResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/course-notes/notes/{note_id}',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新笔记
     * @param func
     * @returns NoteResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCourseNotesNotesNoteIdPut(
        func: any,
    ): CancelablePromise<NoteResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/course-notes/notes/{note_id}',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除笔记
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorCourseNotesNotesNoteIdDelete(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/course-notes/notes/{note_id}',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取用户所有笔记
     * @param func
     * @returns NoteResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCourseNotesNotesGet(
        func: any,
    ): CancelablePromise<Array<NoteResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/course-notes/notes',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 移动笔记到其他文件夹
     * @param func
     * @returns NoteResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCourseNotesNotesNoteIdMovePost(
        func: any,
    ): CancelablePromise<NoteResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/course-notes/notes/{note_id}/move',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 批量移动笔记
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorCourseNotesNotesBatchMovePost(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/course-notes/notes/batch-move',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 批量删除笔记
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorCourseNotesNotesBatchDeleteDelete(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/course-notes/notes/batch-delete',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 搜索笔记
     * @param func
     * @returns NoteResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCourseNotesSearchGet(
        func: any,
    ): CancelablePromise<Array<NoteResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/course-notes/search',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取统计信息
     * @param func
     * @returns FolderStatsResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCourseNotesStatsGet(
        func: any,
    ): CancelablePromise<FolderStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/course-notes/stats',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 导出笔记
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorCourseNotesExportGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/course-notes/export',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 切换文件夹公开状态
     * @param func
     * @returns FolderResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCourseNotesFolderIdVisibilityPatch(
        func: any,
    ): CancelablePromise<FolderResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/course-notes/{folder_id}/visibility',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取仪表板概览
     * @param func
     * @returns DashboardSummaryResponse Successful Response
     * @throws ApiError
     */
    public static decoratorDashboardSummaryGet(
        func: any,
    ): CancelablePromise<DashboardSummaryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/dashboard/summary',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取用户分析数据
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorDashboardAnalyticsGet(
        func: any,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/dashboard/analytics',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取生产力指标
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorDashboardProductivityGet(
        func: any,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/dashboard/productivity',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取项目仪表板
     * @param func
     * @returns DashboardProjectCard Successful Response
     * @throws ApiError
     */
    public static decoratorDashboardProjectsGet(
        func: any,
    ): CancelablePromise<Array<DashboardProjectCard>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/dashboard/projects',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取项目统计信息
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorDashboardProjectsStatsGet(
        func: any,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/dashboard/projects/stats',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取课程仪表板
     * @param func
     * @returns DashboardCourseCard Successful Response
     * @throws ApiError
     */
    public static decoratorDashboardCoursesGet(
        func: any,
    ): CancelablePromise<Array<DashboardCourseCard>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/dashboard/courses',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取课程统计信息
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorDashboardCoursesStatsGet(
        func: any,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/dashboard/courses/stats',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取实时数据
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorDashboardRealTimeGet(
        func: any,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/dashboard/real-time',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取个性化推荐
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorDashboardRecommendationsGet(
        func: any,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/dashboard/recommendations',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 导出仪表板数据
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorDashboardExportGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/dashboard/export',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 创建新随手记录
     * @param func
     * @returns DailyRecordResponse Successful Response
     * @throws ApiError
     */
    public static decoratorDailyRecordsPost(
        func: any,
    ): CancelablePromise<DailyRecordResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/daily-records/',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取当前用户所有随手记录
     * @param func
     * @returns DailyRecordResponse Successful Response
     * @throws ApiError
     */
    public static decoratorDailyRecordsGet(
        func: any,
    ): CancelablePromise<Array<DailyRecordResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/daily-records/',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取指定随手记录详情
     * @param func
     * @returns DailyRecordResponse Successful Response
     * @throws ApiError
     */
    public static decoratorDailyRecordsRecordIdGet(
        func: any,
    ): CancelablePromise<DailyRecordResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/daily-records/{record_id}',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新指定随手记录
     * @param func
     * @returns DailyRecordResponse Successful Response
     * @throws ApiError
     */
    public static decoratorDailyRecordsRecordIdPut(
        func: any,
    ): CancelablePromise<DailyRecordResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/daily-records/{record_id}',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除指定随手记录
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorDailyRecordsRecordIdDelete(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/daily-records/{record_id}',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取随手记录分析摘要
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorDailyRecordsAnalyticsSummaryGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/daily-records/analytics/summary',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 搜索随手记录
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorDailyRecordsSearchPost(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/daily-records/search',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 导出随手记录
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorDailyRecordsExportGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/daily-records/export',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 创建搜索引擎配置
     * @param func
     * @returns UserSearchEngineConfigResponse Successful Response
     * @throws ApiError
     */
    public static decoratorSearchEngineConfigPost(
        func: any,
    ): CancelablePromise<UserSearchEngineConfigResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/search-engine/config',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取当前搜索配置
     * @param func
     * @returns UserSearchEngineConfigResponse Successful Response
     * @throws ApiError
     */
    public static decoratorSearchEngineConfigGet(
        func: any,
    ): CancelablePromise<UserSearchEngineConfigResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search-engine/config',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 执行网络搜索
     * @param func
     * @returns WebSearchResponse Successful Response
     * @throws ApiError
     */
    public static decoratorSearchEngineWebSearchPost(
        func: any,
    ): CancelablePromise<WebSearchResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/search-engine/web-search',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 内部内容搜索
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorSearchEngineInternalSearchGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search-engine/internal-search',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取所有学生列表
     * 获取学生列表，支持分页
     * @param page 页码
     * @param pageSize 每页大小
     * @returns StudentResponse Successful Response
     * @throws ApiError
     */
    public static getAllStudentsCoursesStudentsGet(
        page: number = 1,
        pageSize: number = 20,
    ): CancelablePromise<Array<StudentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/courses/students/',
            query: {
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取指定学生详情
     * 获取学生详情
     * @param studentId
     * @returns StudentResponse Successful Response
     * @throws ApiError
     */
    public static getStudentByIdCoursesStudentsStudentIdGet(
        studentId: number,
    ): CancelablePromise<StudentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/courses/students/{student_id}',
            path: {
                'student_id': studentId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 创建新课程
     * 创建新课程 - 优化版本
     * @param requestBody
     * @returns CourseResponse Successful Response
     * @throws ApiError
     */
    public static createCourseCoursesPost(
        requestBody: CourseBase,
    ): CancelablePromise<CourseResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/courses/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取所有课程列表
     * 获取课程列表 - 优化查询性能，修复N+1查询问题
     * @param page 页码
     * @param pageSize 每页大小
     * @param category 分类过滤
     * @returns CourseResponse Successful Response
     * @throws ApiError
     */
    public static getAllCoursesCoursesGet(
        page: number = 1,
        pageSize: number = 20,
        category?: (string | null),
    ): CancelablePromise<Array<CourseResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/courses/',
            query: {
                'page': page,
                'page_size': pageSize,
                'category': category,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取指定课程详情
     * 获取课程详情 - 优化查询，修复N+1查询问题
     * @param courseId
     * @returns CourseResponse Successful Response
     * @throws ApiError
     */
    public static getCourseByIdCoursesCourseIdGet(
        courseId: number,
    ): CancelablePromise<CourseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/courses/{course_id}',
            path: {
                'course_id': courseId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新指定课程
     * 更新课程 - 优化版本
     * @param courseId
     * @param requestBody
     * @returns CourseResponse Successful Response
     * @throws ApiError
     */
    public static updateCourseCoursesCourseIdPut(
        courseId: number,
        requestBody: CourseUpdate,
    ): CancelablePromise<CourseResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/courses/{course_id}',
            path: {
                'course_id': courseId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 用户报名课程
     * 课程报名 - 优化版本
     * @param courseId
     * @returns UserCourseResponse Successful Response
     * @throws ApiError
     */
    public static enrollCourseCoursesCourseIdEnrollPost(
        courseId: number,
    ): CancelablePromise<UserCourseResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/courses/{course_id}/enroll',
            path: {
                'course_id': courseId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 为指定课程上传新材料
     * 创建课程材料 - 重构版本
     * @param courseId
     * @param title
     * @param type
     * @param url
     * @param content
     * @param originalFilename
     * @param fileType
     * @param sizeBytes
     * @param formData
     * @returns CourseMaterialResponse Successful Response
     * @throws ApiError
     */
    public static createCourseMaterialCoursesCourseIdMaterialsPost(
        courseId: number,
        title: string,
        type: 'file' | 'link' | 'text' | 'video' | 'image',
        url?: (string | null),
        content?: (string | null),
        originalFilename?: (string | null),
        fileType?: (string | null),
        sizeBytes?: (number | null),
        formData?: Body_create_course_material_courses__course_id__materials__post,
    ): CancelablePromise<CourseMaterialResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/courses/{course_id}/materials/',
            path: {
                'course_id': courseId,
            },
            query: {
                'title': title,
                'type': type,
                'url': url,
                'content': content,
                'original_filename': originalFilename,
                'file_type': fileType,
                'size_bytes': sizeBytes,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取指定课程的所有材料列表
     * 获取课程材料列表 - 优化查询
     * @param courseId
     * @param typeFilter
     * @param page 页码
     * @param pageSize 每页大小
     * @returns CourseMaterialResponse Successful Response
     * @throws ApiError
     */
    public static getCourseMaterialsCoursesCourseIdMaterialsGet(
        courseId: number,
        typeFilter?: ('file' | 'link' | 'text' | null),
        page: number = 1,
        pageSize: number = 20,
    ): CancelablePromise<Array<CourseMaterialResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/courses/{course_id}/materials/',
            path: {
                'course_id': courseId,
            },
            query: {
                'type_filter': typeFilter,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取指定课程材料详情
     * 获取课程材料详情 - 优化版本
     * @param courseId
     * @param materialId
     * @returns CourseMaterialResponse Successful Response
     * @throws ApiError
     */
    public static getCourseMaterialDetailCoursesCourseIdMaterialsMaterialIdGet(
        courseId: number,
        materialId: number,
    ): CancelablePromise<CourseMaterialResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/courses/{course_id}/materials/{material_id}',
            path: {
                'course_id': courseId,
                'material_id': materialId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新指定课程材料
     * 更新课程材料 - 重构版本
     * @param courseId
     * @param materialId
     * @param title
     * @param type
     * @param url
     * @param content
     * @param originalFilename
     * @param fileType
     * @param sizeBytes
     * @param formData
     * @returns CourseMaterialResponse Successful Response
     * @throws ApiError
     */
    public static updateCourseMaterialCoursesCourseIdMaterialsMaterialIdPut(
        courseId: number,
        materialId: number,
        title?: (string | null),
        type?: ('file' | 'link' | 'text' | 'video' | 'image' | null),
        url?: (string | null),
        content?: (string | null),
        originalFilename?: (string | null),
        fileType?: (string | null),
        sizeBytes?: (number | null),
        formData?: Body_update_course_material_courses__course_id__materials__material_id__put,
    ): CancelablePromise<CourseMaterialResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/courses/{course_id}/materials/{material_id}',
            path: {
                'course_id': courseId,
                'material_id': materialId,
            },
            query: {
                'title': title,
                'type': type,
                'url': url,
                'content': content,
                'original_filename': originalFilename,
                'file_type': fileType,
                'size_bytes': sizeBytes,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除指定课程材料
     * 删除课程材料 - 优化版本
     * @param courseId
     * @param materialId
     * @returns void
     * @throws ApiError
     */
    public static deleteCourseMaterialCoursesCourseIdMaterialsMaterialIdDelete(
        courseId: number,
        materialId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/courses/{course_id}/materials/{material_id}',
            path: {
                'course_id': courseId,
                'material_id': materialId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 点赞指定课程
     * 点赞课程 - 优化版本
     * @param courseId
     * @returns CourseLikeResponse Successful Response
     * @throws ApiError
     */
    public static likeCourseItemCoursesCourseIdLikePost(
        courseId: number,
    ): CancelablePromise<CourseLikeResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/courses/{course_id}/like',
            path: {
                'course_id': courseId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 取消点赞课程
     * 取消点赞课程 - 优化版本
     * @param courseId
     * @returns void
     * @throws ApiError
     */
    public static unlikeCourseItemCoursesCourseIdUnlikeDelete(
        courseId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/courses/{course_id}/unlike',
            path: {
                'course_id': courseId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新当前用户课程学习进度和状态
     * 更新课程进度 - 优化版本
     * @param courseId
     * @param requestBody
     * @returns UserCourseResponse Successful Response
     * @throws ApiError
     */
    public static updateUserCourseProgressCoursesCourseIdProgressPut(
        courseId: number,
        requestBody: Record<string, any>,
    ): CancelablePromise<UserCourseResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/courses/{course_id}/progress',
            path: {
                'course_id': courseId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 创建知识库
     * @param func
     * @returns KnowledgeBaseSimpleResponse Successful Response
     * @throws ApiError
     */
    public static decoratorKnowledgeKbPost(
        func: any,
    ): CancelablePromise<KnowledgeBaseSimpleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/knowledge/kb',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取知识库列表
     * @param func
     * @returns KnowledgeBaseSimpleResponse Successful Response
     * @throws ApiError
     */
    public static decoratorKnowledgeKbGet(
        func: any,
    ): CancelablePromise<Array<KnowledgeBaseSimpleResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/knowledge/kb',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取知识库详情
     * @param func
     * @returns KnowledgeBaseSimpleResponse Successful Response
     * @throws ApiError
     */
    public static decoratorKnowledgeKbKbIdGet(
        func: any,
    ): CancelablePromise<KnowledgeBaseSimpleResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/knowledge/kb/{kb_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新知识库
     * @param func
     * @returns KnowledgeBaseSimpleResponse Successful Response
     * @throws ApiError
     */
    public static decoratorKnowledgeKbKbIdPut(
        func: any,
    ): CancelablePromise<KnowledgeBaseSimpleResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/knowledge/kb/{kb_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除知识库
     * @param func
     * @returns void
     * @throws ApiError
     */
    public static decoratorKnowledgeKbKbIdDelete(
        func: any,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/knowledge/kb/{kb_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取知识库统计信息
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorKnowledgeKbKbIdStatsGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/knowledge/kb/{kb_id}/stats',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 智能文档上传
     * @param func
     * @returns KnowledgeDocumentSimpleResponse Successful Response
     * @throws ApiError
     */
    public static decoratorKnowledgeKbKbIdDocumentsUploadPost(
        func: any,
    ): CancelablePromise<KnowledgeDocumentSimpleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/knowledge/kb/{kb_id}/documents/upload',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 添加网址内容
     * @param func
     * @returns KnowledgeDocumentSimpleResponse Successful Response
     * @throws ApiError
     */
    public static decoratorKnowledgeKbKbIdDocumentsAddUrlPost(
        func: any,
    ): CancelablePromise<KnowledgeDocumentSimpleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/knowledge/kb/{kb_id}/documents/add-url',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取文档列表
     * @param func
     * @returns KnowledgeDocumentSimpleResponse Successful Response
     * @throws ApiError
     */
    public static decoratorKnowledgeKbKbIdDocumentsGet(
        func: any,
    ): CancelablePromise<Array<KnowledgeDocumentSimpleResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/knowledge/kb/{kb_id}/documents',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取文档详情
     * @param func
     * @returns KnowledgeDocumentSimpleResponse Successful Response
     * @throws ApiError
     */
    public static decoratorKnowledgeKbKbIdDocumentsDocumentIdGet(
        func: any,
    ): CancelablePromise<KnowledgeDocumentSimpleResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/knowledge/kb/{kb_id}/documents/{document_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新文档信息
     * @param func
     * @returns KnowledgeDocumentSimpleResponse Successful Response
     * @throws ApiError
     */
    public static decoratorKnowledgeKbKbIdDocumentsDocumentIdPut(
        func: any,
    ): CancelablePromise<KnowledgeDocumentSimpleResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/knowledge/kb/{kb_id}/documents/{document_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除文档
     * @param func
     * @returns void
     * @throws ApiError
     */
    public static decoratorKnowledgeKbKbIdDocumentsDocumentIdDelete(
        func: any,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/knowledge/kb/{kb_id}/documents/{document_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 智能搜索
     * @param func
     * @returns KnowledgeSearchResponse Successful Response
     * @throws ApiError
     */
    public static decoratorKnowledgeKbKbIdSearchGet(
        func: any,
    ): CancelablePromise<KnowledgeSearchResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/knowledge/kb/{kb_id}/search',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 知识库分析统计
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorKnowledgeKbKbIdAnalyticsGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/knowledge/kb/{kb_id}/analytics',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取系统性能指标
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorKnowledgeMonitoringPerformanceGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/knowledge/monitoring/performance',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取任务状态
     * 获取任务状态 - 优化版本
     * @param taskId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getTaskStatusKnowledgeTasksTaskIdStatusGet(
        taskId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/knowledge/tasks/{task_id}/status',
            path: {
                'task_id': taskId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 浏览公开知识库
     * @param func
     * @returns KnowledgeBaseSimpleResponse Successful Response
     * @throws ApiError
     */
    public static decoratorKnowledgePublicGet(
        func: any,
    ): CancelablePromise<Array<KnowledgeBaseSimpleResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/knowledge/public',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 搜索公开的知识库
     * @param func
     * @returns KnowledgeBaseSimpleResponse Successful Response
     * @throws ApiError
     */
    public static decoratorKnowledgePublicSearchGet(
        func: any,
    ): CancelablePromise<Array<KnowledgeBaseSimpleResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/knowledge/public/search',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取公开知识库详情
     * @param func
     * @returns KnowledgeBaseSimpleResponse Successful Response
     * @throws ApiError
     */
    public static decoratorKnowledgePublicKbIdGet(
        func: any,
    ): CancelablePromise<KnowledgeBaseSimpleResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/knowledge/public/{kb_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 切换知识库公开状态
     * @param func
     * @returns KnowledgeBaseSimpleResponse Successful Response
     * @throws ApiError
     */
    public static decoratorKnowledgeKbKbIdVisibilityPatch(
        func: any,
    ): CancelablePromise<KnowledgeBaseSimpleResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/knowledge/kb/{kb_id}/visibility',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 创建新的聊天室
     * 创建新的聊天室
     * @param requestBody
     * @returns ChatRoomResponse Successful Response
     * @throws ApiError
     */
    public static createChatRoomChatRoomsPost(
        requestBody: ChatRoomCreate,
    ): CancelablePromise<ChatRoomResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chat-rooms/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取用户可访问的聊天室列表
     * 获取用户可访问的聊天室列表（用于转发选择）
     * @param page 页码
     * @param size 每页数量
     * @param search 搜索关键词
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getUserAccessibleChatroomsChatroomsAccessibleGet(
        page: number = 1,
        size: number = 50,
        search?: (string | null),
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chatrooms/accessible',
            query: {
                'page': page,
                'size': size,
                'search': search,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取指定聊天室详情
     * 获取指定聊天室详情（增强版）
     * @param roomId
     * @returns ChatRoomResponse Successful Response
     * @throws ApiError
     */
    public static getChatRoomByIdEnhancedChatroomsRoomIdGet(
        roomId: number,
    ): CancelablePromise<ChatRoomResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chatrooms/{room_id}',
            path: {
                'room_id': roomId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除指定聊天室
     * 删除指定聊天室
     * @param roomId
     * @returns void
     * @throws ApiError
     */
    public static deleteChatRoomChatroomsRoomIdDelete(
        roomId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/chatrooms/{room_id}',
            path: {
                'room_id': roomId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新指定聊天室
     * 更新指定聊天室（增强版）
     * @param roomId
     * @param requestBody
     * @returns ChatRoomResponse Successful Response
     * @throws ApiError
     */
    public static updateChatRoomEnhancedChatroomsRoomIdPut(
        roomId: number,
        requestBody: ChatRoomUpdate,
    ): CancelablePromise<ChatRoomResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/chatrooms/{room_id}/',
            path: {
                'room_id': roomId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取聊天室统计信息
     * 获取聊天室统计信息
     * @param roomId
     * @param days 统计天数
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getChatRoomStatsChatroomsRoomIdStatsGet(
        roomId: number,
        days: number = 7,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chatrooms/{room_id}/stats',
            path: {
                'room_id': roomId,
            },
            query: {
                'days': days,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取聊天室成员列表
     * 获取聊天室成员列表
     * @param roomId
     * @param page 页码
     * @param size 每页数量
     * @returns ChatRoomMemberResponse Successful Response
     * @throws ApiError
     */
    public static getChatRoomMembersChatroomsRoomIdMembersGet(
        roomId: number,
        page: number = 1,
        size: number = 50,
    ): CancelablePromise<Array<ChatRoomMemberResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chatrooms/{room_id}/members',
            path: {
                'room_id': roomId,
            },
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 设置聊天室成员角色
     * 设置聊天室成员角色
     * @param roomId
     * @param memberId
     * @param requestBody
     * @returns ChatRoomMemberResponse Successful Response
     * @throws ApiError
     */
    public static setChatRoomMemberRoleChatRoomsRoomIdMembersMemberIdSetRolePut(
        roomId: number,
        memberId: number,
        requestBody: ChatRoomMemberRoleUpdate,
    ): CancelablePromise<ChatRoomMemberResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/chat-rooms/{room_id}/members/{member_id}/set-role',
            path: {
                'room_id': roomId,
                'member_id': memberId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 移除聊天室成员
     * 移除聊天室成员
     * @param roomId
     * @param memberId
     * @returns void
     * @throws ApiError
     */
    public static removeChatRoomMemberChatRoomsRoomIdMembersMemberIdDelete(
        roomId: number,
        memberId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/chat-rooms/{room_id}/members/{member_id}',
            path: {
                'room_id': roomId,
                'member_id': memberId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 申请加入聊天室
     * 申请加入聊天室
     * @param roomId
     * @param requestBody
     * @returns ChatRoomJoinRequestResponse Successful Response
     * @throws ApiError
     */
    public static createJoinRequestChatRoomsRoomIdJoinRequestPost(
        roomId: number,
        requestBody: ChatRoomJoinRequestCreate,
    ): CancelablePromise<ChatRoomJoinRequestResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chat-rooms/{room_id}/join-request',
            path: {
                'room_id': roomId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取聊天室加入申请列表
     * 获取聊天室加入申请列表
     * @param roomId
     * @param statusFilter 状态过滤 (pending/approved/rejected)
     * @param page 页码
     * @param size 每页数量
     * @returns ChatRoomJoinRequestResponse Successful Response
     * @throws ApiError
     */
    public static getJoinRequestsChatRoomsRoomIdJoinRequestsGet(
        roomId: number,
        statusFilter?: (string | null),
        page: number = 1,
        size: number = 20,
    ): CancelablePromise<Array<ChatRoomJoinRequestResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chat-rooms/{room_id}/join-requests',
            path: {
                'room_id': roomId,
            },
            query: {
                'status_filter': statusFilter,
                'page': page,
                'size': size,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 处理加入申请
     * 处理加入申请
     * @param requestId
     * @param requestBody
     * @returns ChatRoomJoinRequestResponse Successful Response
     * @throws ApiError
     */
    public static processJoinRequestChatRoomsJoinRequestsRequestIdProcessPost(
        requestId: number,
        requestBody: ProcessJoinRequestAction,
    ): CancelablePromise<ChatRoomJoinRequestResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chat-rooms/join-requests/{request_id}/process',
            path: {
                'request_id': requestId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 发送文本消息
     * 发送文本消息
     * @param roomId
     * @param requestBody
     * @param room
     * @param member
     * @returns ChatMessageResponse Successful Response
     * @throws ApiError
     */
    public static createMessageChatroomsRoomIdMessagesPost(
        roomId: number,
        requestBody: ChatMessageCreate,
        room?: any,
        member?: any,
    ): CancelablePromise<ChatMessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chatrooms/{room_id}/messages/',
            path: {
                'room_id': roomId,
            },
            query: {
                'room': room,
                'member': member,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取聊天室消息
     * 获取聊天室消息
     * @param roomId
     * @param page 页码
     * @param size 每页数量
     * @param messageType 消息类型过滤
     * @param userId 用户过滤
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param room
     * @param member
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getChatMessagesChatroomsRoomIdMessagesGet(
        roomId: number,
        page: number = 1,
        size: number = 50,
        messageType?: (string | null),
        userId?: (number | null),
        startDate?: (string | null),
        endDate?: (string | null),
        room?: any,
        member?: any,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chatrooms/{room_id}/messages/',
            path: {
                'room_id': roomId,
            },
            query: {
                'page': page,
                'size': size,
                'message_type': messageType,
                'user_id': userId,
                'start_date': startDate,
                'end_date': endDate,
                'room': room,
                'member': member,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 撤回消息
     * 撤回消息
     * @param roomId
     * @param messageId
     * @param room
     * @param member
     * @returns any Successful Response
     * @throws ApiError
     */
    public static recallMessageChatroomsRoomIdMessagesMessageIdRecallPut(
        roomId: number,
        messageId: number,
        room?: any,
        member?: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/chatrooms/{room_id}/messages/{message_id}/recall',
            path: {
                'room_id': roomId,
                'message_id': messageId,
            },
            query: {
                'room': room,
                'member': member,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 置顶消息
     * 置顶消息
     * @param roomId
     * @param messageId
     * @param room
     * @param member
     * @returns any Successful Response
     * @throws ApiError
     */
    public static pinMessageChatroomsRoomIdMessagesMessageIdPinPut(
        roomId: number,
        messageId: number,
        room?: any,
        member?: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/chatrooms/{room_id}/messages/{message_id}/pin',
            path: {
                'room_id': roomId,
                'message_id': messageId,
            },
            query: {
                'room': room,
                'member': member,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 转发消息
     * 转发消息到其他聊天室
     * @param roomId
     * @param messageId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static forwardMessageChatroomsRoomIdMessagesMessageIdForwardPost(
        roomId: number,
        messageId: number,
        requestBody: ForwardMessageRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chatrooms/{room_id}/messages/{message_id}/forward',
            path: {
                'room_id': roomId,
                'message_id': messageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 批量转发消息
     * 批量转发选中的消息到多个聊天室
     * @param roomId
     * @param requestBody
     * @returns ForwardOperationResponse Successful Response
     * @throws ApiError
     */
    public static batchForwardMessagesChatroomsRoomIdMessagesBatchForwardPost(
        roomId: number,
        requestBody: BatchForwardMessageRequest,
    ): CancelablePromise<ForwardOperationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chatrooms/{room_id}/messages/batch-forward',
            path: {
                'room_id': roomId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 转发文件到多个聊天室
     * 转发文件到多个聊天室
     * @param roomId
     * @param requestBody
     * @returns ForwardOperationResponse Successful Response
     * @throws ApiError
     */
    public static forwardFileToRoomsChatroomsRoomIdFilesForwardPost(
        roomId: number,
        requestBody: ForwardFileRequest,
    ): CancelablePromise<ForwardOperationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chatrooms/{room_id}/files/forward',
            path: {
                'room_id': roomId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取可选择转发的消息
     * 获取可选择转发的消息列表
     * @param roomId
     * @param startMessageId 起始消息ID
     * @param endMessageId 结束消息ID
     * @param includeMedia 是否包含媒体文件
     * @param maxMessages 最大消息数量
     * @returns ChatMessageResponse Successful Response
     * @throws ApiError
     */
    public static getSelectableMessagesChatroomsRoomIdMessagesSelectableGet(
        roomId: number,
        startMessageId?: (number | null),
        endMessageId?: (number | null),
        includeMedia: boolean = true,
        maxMessages: number = 50,
    ): CancelablePromise<Array<ChatMessageResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chatrooms/{room_id}/messages/selectable',
            path: {
                'room_id': roomId,
            },
            query: {
                'start_message_id': startMessageId,
                'end_message_id': endMessageId,
                'include_media': includeMedia,
                'max_messages': maxMessages,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取聊天室媒体文件
     * 获取聊天室媒体文件
     * @param roomId
     * @param mediaType 媒体类型 (all/image/video/audio/document)
     * @param page 页码
     * @param size 每页数量
     * @returns ChatMessageResponse Successful Response
     * @throws ApiError
     */
    public static getChatRoomMediaChatroomsRoomIdMediaGet(
        roomId: number,
        mediaType: string = 'all',
        page: number = 1,
        size: number = 20,
    ): CancelablePromise<Array<ChatMessageResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chatrooms/{room_id}/media',
            path: {
                'room_id': roomId,
            },
            query: {
                'media_type': mediaType,
                'page': page,
                'size': size,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除消息
     * 删除消息
     * @param roomId
     * @param messageId
     * @returns void
     * @throws ApiError
     */
    public static deleteMessageChatroomsRoomIdMessagesMessageIdDelete(
        roomId: number,
        messageId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/chatrooms/{room_id}/messages/{message_id}',
            path: {
                'room_id': roomId,
                'message_id': messageId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 搜索聊天室消息
     * 搜索聊天室消息
     * @param roomId
     * @param query 搜索关键词
     * @param page 页码
     * @param size 每页数量
     * @returns any Successful Response
     * @throws ApiError
     */
    public static searchMessagesChatroomsRoomIdMessagesSearchGet(
        roomId: number,
        query: string,
        page: number = 1,
        size: number = 20,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chatrooms/{room_id}/messages/search',
            path: {
                'room_id': roomId,
            },
            query: {
                'query': query,
                'page': page,
                'size': size,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 统一文件上传接口
     * 统一的文件上传接口
     * @param roomId
     * @param formData
     * @param room
     * @param member
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadFilesChatroomsRoomIdUploadPost(
        roomId: number,
        formData: Body_upload_files_chatrooms__room_id__upload__post,
        room?: any,
        member?: any,
    ): CancelablePromise<(ChatMessageResponse | Record<string, any>)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chatrooms/{room_id}/upload/',
            path: {
                'room_id': roomId,
            },
            query: {
                'room': room,
                'member': member,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 上传音频文件（兼容接口）
     * 上传音频文件到聊天室（兼容接口）
     * @param roomId
     * @param formData
     * @returns ChatMessageResponse Successful Response
     * @throws ApiError
     */
    public static uploadAudioFileLegacyChatroomsRoomIdUploadAudioPost(
        roomId: number,
        formData: Body_upload_audio_file_legacy_chatrooms__room_id__upload_audio__post,
    ): CancelablePromise<ChatMessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chatrooms/{room_id}/upload-audio/',
            path: {
                'room_id': roomId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 批量上传图片（兼容接口）
     * 批量上传图片到聊天室（兼容接口）
     * @param roomId
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadGalleryFilesLegacyChatroomsRoomIdUploadGalleryPost(
        roomId: number,
        formData: Body_upload_gallery_files_legacy_chatrooms__room_id__upload_gallery__post,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chatrooms/{room_id}/upload-gallery/',
            path: {
                'room_id': roomId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 批量上传文档（兼容接口）
     * 批量上传文档到聊天室（兼容接口）
     * @param roomId
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadDocumentFilesLegacyChatroomsRoomIdUploadDocumentsPost(
        roomId: number,
        formData: Body_upload_document_files_legacy_chatrooms__room_id__upload_documents__post,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chatrooms/{room_id}/upload-documents/',
            path: {
                'room_id': roomId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 上传视频文件（兼容接口）
     * 上传视频文件到聊天室（兼容接口）
     * @param roomId
     * @param formData
     * @returns ChatMessageResponse Successful Response
     * @throws ApiError
     */
    public static uploadVideoFileLegacyChatroomsRoomIdUploadVideoPost(
        roomId: number,
        formData: Body_upload_video_file_legacy_chatrooms__room_id__upload_video__post,
    ): CancelablePromise<ChatMessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chatrooms/{room_id}/upload-video/',
            path: {
                'room_id': roomId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 验证文件访问权限
     * 验证用户对文件的访问权限
     * @param fileId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static verifyFileAccessFilesFileIdAccessGet(
        fileId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/files/{file_id}/access',
            path: {
                'file_id': fileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取用户存储配额
     * 获取用户在特定聊天室的存储配额使用情况
     * @param roomId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getUserStorageQuotaChatroomsRoomIdStorageQuotaGet(
        roomId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chatrooms/{room_id}/storage-quota',
            path: {
                'room_id': roomId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 优化存储（管理员）
     * 优化存储空间（管理员功能）
     * @param days 清理多少天前的文件
     * @returns any Successful Response
     * @throws ApiError
     */
    public static optimizeStorageAdminOptimizeStoragePost(
        days: number = 30,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/optimize-storage',
            query: {
                'days': days,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 清理过期WebSocket连接（管理员）
     * 清理过期的WebSocket连接
     * @returns any Successful Response
     * @throws ApiError
     */
    public static cleanupConnectionsAdminCleanupConnectionsPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cleanup-connections',
        });
    }
    /**
     * 系统健康检查（管理员）
     * 系统健康检查
     * @returns any Successful Response
     * @throws ApiError
     */
    public static systemHealthCheckAdminSystemHealthGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/system-health',
        });
    }
    /**
     * 安全扫描（管理员）
     * 执行安全扫描
     * @param scanType 扫描类型 (basic/full)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static securityScanAdminSecurityScanPost(
        scanType: string = 'basic',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/security-scan',
            query: {
                'scan_type': scanType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 批量清理操作（管理员）
     * 批量清理操作
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static batchCleanupAdminBatchCleanupPost(
        requestBody: BatchCleanupOptions,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/batch-cleanup',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 实时统计数据（管理员）
     * 获取实时统计数据
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getRealTimeStatsAdminRealTimeStatsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/real-time-stats',
        });
    }
    /**
     * 获取聊天室统计信息（管理员）
     * 获取聊天室统计信息
     * @param days 统计天数
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getChatroomStatsAdminChatroomStatsGet(
        days: number = 7,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/chatroom-stats',
            query: {
                'days': days,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 创建分享
     * 创建分享
     * @param requestBody
     * @returns ShareContentResponse Successful Response
     * @throws ApiError
     */
    public static createShareSharingCreatePost(
        requestBody: ShareContentRequest,
    ): CancelablePromise<ShareContentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sharing/create',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 分享到论坛
     * 分享到论坛
     * @param requestBody
     * @returns ShareToForumResponse Successful Response
     * @throws ApiError
     */
    public static shareToForumSharingForumPost(
        requestBody: ShareToForumRequest,
    ): CancelablePromise<ShareToForumResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sharing/forum',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 分享到聊天室
     * 分享到聊天室
     * @param requestBody
     * @returns ShareToChatroomResponse Successful Response
     * @throws ApiError
     */
    public static shareToChatroomSharingChatroomPost(
        requestBody: ShareToChatroomRequest,
    ): CancelablePromise<ShareToChatroomResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sharing/chatroom',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 生成分享链接
     * 生成分享链接（支持微信、QQ等平台）
     * @param contentType 内容类型
     * @param contentId 内容ID
     * @returns ShareLinkResponse Successful Response
     * @throws ApiError
     */
    public static generateShareLinkSharingLinkPost(
        contentType: string,
        contentId: number,
    ): CancelablePromise<ShareLinkResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sharing/link',
            query: {
                'content_type': contentType,
                'content_id': contentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 快速分享到多个平台
     * 快速分享到多个平台
     * @param requestBody
     * @returns QuickShareResponse Successful Response
     * @throws ApiError
     */
    public static quickShareSharingQuickPost(
        requestBody: QuickShareRequest,
    ): CancelablePromise<QuickShareResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sharing/quick',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取我的分享列表
     * 获取当前用户的分享列表
     * @param skip 跳过条数
     * @param limit 返回条数
     * @param contentType 内容类型筛选
     * @returns ShareContentResponse Successful Response
     * @throws ApiError
     */
    public static getMySharesSharingMySharesGet(
        skip?: number,
        limit: number = 20,
        contentType?: (string | null),
    ): CancelablePromise<Array<ShareContentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sharing/my-shares',
            query: {
                'skip': skip,
                'limit': limit,
                'content_type': contentType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取分享统计
     * 获取当前用户的分享统计
     * @returns ShareStatsResponse Successful Response
     * @throws ApiError
     */
    public static getShareStatsSharingStatsGet(): CancelablePromise<ShareStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sharing/stats',
        });
    }
    /**
     * 获取分享详情
     * 获取分享详情
     * @param shareId
     * @returns ShareContentResponse Successful Response
     * @throws ApiError
     */
    public static getShareDetailSharingShareIdGet(
        shareId: number,
    ): CancelablePromise<ShareContentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sharing/{share_id}',
            path: {
                'share_id': shareId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除分享
     * 删除分享
     * @param shareId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteShareSharingShareIdDelete(
        shareId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/sharing/{share_id}',
            path: {
                'share_id': shareId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取内容分享预览
     * 获取内容的分享预览信息
     * @param contentType
     * @param contentId
     * @returns ShareableContentPreview Successful Response
     * @throws ApiError
     */
    public static getSharePreviewSharingPreviewContentTypeContentIdGet(
        contentType: string,
        contentId: number,
    ): CancelablePromise<ShareableContentPreview> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sharing/preview/{content_type}/{content_id}',
            path: {
                'content_type': contentType,
                'content_id': contentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 记录分享点击
     * 记录分享链接点击
     * @param shareId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static recordShareClickSharingShareIdClickPost(
        shareId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sharing/{share_id}/click',
            path: {
                'share_id': shareId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 管理员获取所有分享
     * 管理员获取所有分享（需要管理员权限）
     * @param skip 跳过条数
     * @param limit 返回条数
     * @param statusFilter 状态筛选
     * @returns ShareContentResponse Successful Response
     * @throws ApiError
     */
    public static adminGetAllSharesSharingAdminAllGet(
        skip?: number,
        limit: number = 20,
        statusFilter?: (string | null),
    ): CancelablePromise<Array<ShareContentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sharing/admin/all',
            query: {
                'skip': skip,
                'limit': limit,
                'status_filter': statusFilter,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 管理员更新分享状态
     * 管理员更新分享状态
     * @param shareId
     * @param status 新状态
     * @returns any Successful Response
     * @throws ApiError
     */
    public static adminUpdateShareStatusSharingAdminShareIdStatusPut(
        shareId: number,
        status: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/sharing/admin/{share_id}/status',
            path: {
                'share_id': shareId,
            },
            query: {
                'status': status,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 论坛话题转发
     * 转发论坛话题到论坛或聊天室
     * @param requestBody
     * @returns ForumTopicRepostResponse Successful Response
     * @throws ApiError
     */
    public static repostForumTopicSharingForumTopicRepostPost(
        requestBody: ForumTopicRepostRequest,
    ): CancelablePromise<ForumTopicRepostResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sharing/forum-topic/repost',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 社交平台分享
     * 创建微信/QQ分享
     * @param requestBody
     * @returns SocialShareResponse Successful Response
     * @throws ApiError
     */
    public static createSocialShareSharingSocialPost(
        requestBody: SocialShareRequest,
    ): CancelablePromise<SocialShareResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sharing/social',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 复制链接分享
     * 生成复制链接分享
     * @param requestBody
     * @returns CopyLinkResponse Successful Response
     * @throws ApiError
     */
    public static createCopyLinkShareSharingCopyLinkPost(
        requestBody: CopyLinkRequest,
    ): CancelablePromise<CopyLinkResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sharing/copy-link',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取用户的文件夹树结构
     * @param func
     * @returns FolderResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCollectionsFoldersGet(
        func: any,
    ): CancelablePromise<Array<FolderResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/collections/folders',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 创建新文件夹
     * @param func
     * @returns FolderResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCollectionsFoldersPost(
        func: any,
    ): CancelablePromise<FolderResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/collections/folders',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取文件夹详情
     * @param func
     * @returns FolderResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCollectionsFoldersFolderIdGet(
        func: any,
    ): CancelablePromise<FolderResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/collections/folders/{folder_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新文件夹信息
     * @param func
     * @returns FolderResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCollectionsFoldersFolderIdPut(
        func: any,
    ): CancelablePromise<FolderResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/collections/folders/{folder_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除文件夹
     * @param func
     * @returns void
     * @throws ApiError
     */
    public static decoratorCollectionsFoldersFolderIdDelete(
        func: any,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/collections/folders/{folder_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取文件夹内容
     * @param func
     * @returns CollectedContentResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCollectionsFoldersFolderIdContentsGet(
        func: any,
    ): CancelablePromise<Array<CollectedContentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/collections/folders/{folder_id}/contents',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 向文件夹添加收藏
     * @param func
     * @returns CollectedContentResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCollectionsFoldersFolderIdCollectPost(
        func: any,
    ): CancelablePromise<CollectedContentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/collections/folders/{folder_id}/collect',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 快速收藏
     * @param func
     * @returns CollectedContentResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCollectionsQuickCollectPost(
        func: any,
    ): CancelablePromise<CollectedContentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/collections/quick-collect',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取收藏内容详情
     * @param func
     * @returns CollectedContentResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCollectionsContentsContentIdGet(
        func: any,
    ): CancelablePromise<CollectedContentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/collections/contents/{content_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新收藏内容
     * @param func
     * @returns CollectedContentResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCollectionsContentsContentIdPut(
        func: any,
    ): CancelablePromise<CollectedContentResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/collections/contents/{content_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除收藏内容
     * @param func
     * @returns void
     * @throws ApiError
     */
    public static decoratorCollectionsContentsContentIdDelete(
        func: any,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/collections/contents/{content_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 搜索收藏内容
     * @param func
     * @returns CollectedContentResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCollectionsSearchGet(
        func: any,
    ): CancelablePromise<Array<CollectedContentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/collections/search',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取收藏统计信息
     * @param func
     * @returns FolderStatsResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCollectionsStatsGet(
        func: any,
    ): CancelablePromise<FolderStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/collections/stats',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 批量移动收藏内容
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorCollectionsBatchMovePost(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/collections/batch-move',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 收藏聊天消息
     * @param func
     * @returns CollectedContentResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCollectionsCollectChatMessageMessageIdPost(
        func: any,
    ): CancelablePromise<CollectedContentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/collections/collect-chat-message/{message_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 收藏论坛话题
     * @param func
     * @returns CollectedContentResponse Successful Response
     * @throws ApiError
     */
    public static decoratorCollectionsCollectForumTopicTopicIdPost(
        func: any,
    ): CancelablePromise<CollectedContentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/collections/collect-forum-topic/{topic_id}',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 收藏项目、课程、知识库或笔记文件夹
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorProgramCollectionsItemTypeItemIdStarPost(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/program-collections/{item_type}/{item_id}/star',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 取消收藏项目、课程、知识库或笔记文件夹
     * @param func
     * @returns void
     * @throws ApiError
     */
    public static decoratorProgramCollectionsItemTypeItemIdUnstarDelete(
        func: any,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/program-collections/{item_type}/{item_id}/unstar',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 检查项目、课程、知识库或笔记文件夹收藏状态
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorProgramCollectionsItemTypeItemIdStarStatusGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/program-collections/{item_type}/{item_id}/star-status',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取我收藏的项目、课程、知识库或笔记文件夹列表
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorProgramCollectionsMyStarredItemTypeGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/program-collections/my-starred/{item_type}',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取收藏统计信息
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorProgramCollectionsStatisticsGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/program-collections/statistics',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取热门收藏项目、课程、知识库或笔记文件夹
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorProgramCollectionsPopularItemTypeGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/program-collections/popular/{item_type}',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 批量收藏项目、课程、知识库和笔记文件夹
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorProgramCollectionsBatchStarPost(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/program-collections/batch-star',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 批量取消收藏
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorProgramCollectionsBatchUnstarDelete(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/program-collections/batch-unstar',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 发现公开的知识库
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorProgramCollectionsDiscoverKnowledgeBasesGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/program-collections/discover/knowledge-bases',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * 发现公开的课程笔记文件夹
     * @param func
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decoratorProgramCollectionsDiscoverNoteFoldersGet(
        func: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/program-collections/discover/note-folders',
            query: {
                'func': func,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decorator
     * @param func
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static decoratorApiRecommendGet(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/recommend/',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decorator
     * @param func
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static decoratorApiRecommendCoursesGet(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/recommend/courses',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decorator
     * @param func
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static decoratorApiRecommendProjectsGet(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/recommend/projects',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decorator
     * @param func
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static decoratorApiRecommendKnowledgeGet(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/recommend/knowledge',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decorator
     * @param func
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static decoratorApiRecommendForumGet(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/recommend/forum',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decorator
     * @param func
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static decoratorApiRecommendProfileGet(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/recommend/profile',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decorator
     * @param func
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static decoratorApiRecommendFeedbackPost(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/recommend/feedback',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decorator
     * @param func
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static decoratorApiRecommendStatsGet(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/recommend/stats',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decorator
     * @param func
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static decoratorApiRecommendRefreshPost(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/recommend/refresh',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decorator
     * @param func
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static decoratorApiRecommendHealthGet(
        func: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/recommend/health',
            query: {
                'func': func,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
