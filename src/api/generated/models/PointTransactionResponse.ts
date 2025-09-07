/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 积分交易响应模型
 */
export type PointTransactionResponse = {
    created_at: string;
    updated_at?: (string | null);
    id: number;
    user_id: number;
    amount: number;
    /**
     * 积分变动理由描述
     */
    reason?: (string | null);
    /**
     * 积分交易类型
     */
    transaction_type: string;
    /**
     * 关联的实体类型
     */
    related_entity_type?: (string | null);
    /**
     * 关联实体的ID
     */
    related_entity_id?: (number | null);
};

