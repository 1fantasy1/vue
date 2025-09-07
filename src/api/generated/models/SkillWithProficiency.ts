/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 技能熟练度模型，包含古文优雅的描述
 */
export type SkillWithProficiency = {
    /**
     * 技能名称
     */
    name: string;
    /**
     * 熟练度等级：初窥门径, 登堂入室, 融会贯通, 炉火纯青
     */
    level: SkillWithProficiency.level;
};
export namespace SkillWithProficiency {
    /**
     * 熟练度等级：初窥门径, 登堂入室, 融会贯通, 炉火纯青
     */
    export type level =
        | '初窥门径'
        | '登堂入室'
        | '融会贯通'
        | '炉火纯青';
}

