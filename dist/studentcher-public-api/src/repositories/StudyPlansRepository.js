"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyPlansRepository = void 0;
const queries = __importStar(require("../helpers/postgresQueriesHelper/studyPlanManagement"));
const studentcher_shared_utils_1 = require("../studentcher-shared-utils");
const postgresAdapter_1 = __importDefault(require("../storage/postgresAdapter"));
class StudyPlansRepository extends studentcher_shared_utils_1.EntityRepository {
    constructor(pgClient) {
        super();
        this.pgClient = pgClient;
    }
    async addOne(data) {
        const insertStudyPlanQuery = StudyPlansRepository.queries.getInsertStudyPlanQuery();
        const insertStudyPlanValues = [data.planId, data.name];
        const insertStudyPlanActivityQuery = StudyPlansRepository.queries.getInsertStudyPlanActivityQuery();
        const insertPlanActivitiesQueriesBucket = [];
        const insertPlanActivitiesValuesBucket = [];
        data.activityIds.forEach((activityId, index) => {
            insertPlanActivitiesQueriesBucket.push(insertStudyPlanActivityQuery);
            insertPlanActivitiesValuesBucket.push([data.planId, activityId, index + 1]);
        });
        const sqlQueries = [insertStudyPlanQuery, ...insertPlanActivitiesQueriesBucket];
        const sqlValues = [insertStudyPlanValues, ...insertPlanActivitiesValuesBucket];
        const response = await this.pgClient.callDbTransaction(sqlQueries, sqlValues);
        const planActivitiesStartingIndex = 1;
        const plan = response[0].rows[0];
        for (let i = planActivitiesStartingIndex; i < insertPlanActivitiesQueriesBucket.length + planActivitiesStartingIndex; i++)
            plan.activities.push(response[i].rows[0].activityId);
        return plan;
    }
    async editOne(data) {
        const updatePlanQuery = StudyPlansRepository.queries.getUpdateStudyPlanQuery();
        const updatePlanValues = [data.planId, data.name];
        const deletePlanActivitiesQuery = StudyPlansRepository.queries.getDeleteStudyPlanActivitiesQuery();
        const deletePlanActivitiesValues = [data.planId];
        const insertStudyPlanActivityQuery = StudyPlansRepository.queries.getInsertStudyPlanActivityQuery();
        const insertPlanActivitiesQueriesBucket = [];
        const insertPlanActivitiesValuesBucket = [];
        data.activityIds.forEach((activityId, index) => {
            insertPlanActivitiesQueriesBucket.push(insertStudyPlanActivityQuery);
            insertPlanActivitiesValuesBucket.push([data.planId, activityId, index + 1]);
        });
        const sqlQueries = [updatePlanQuery, deletePlanActivitiesQuery, ...insertPlanActivitiesQueriesBucket];
        const sqlValues = [updatePlanValues, deletePlanActivitiesValues, ...insertPlanActivitiesValuesBucket];
        const response = await this.pgClient.callDbTransaction(sqlQueries, sqlValues);
        if (response[0].rowCount === 0)
            throw new studentcher_shared_utils_1.CustomError("Study Plan not found.", 404);
        const planActivitiesStartingIndex = 2;
        const plan = response[0].rows[0];
        for (let i = planActivitiesStartingIndex; i < insertPlanActivitiesQueriesBucket.length + planActivitiesStartingIndex; i++)
            plan.activities.push(response[i].rows[0].activityId);
        return plan;
    }
    async deleteMany(data) {
        const deleteStudyPlansQuery = StudyPlansRepository.queries.getDeleteStudyPlansQuery();
        const deleteStudyPlansValues = [data.planIds];
        const response = await this.pgClient.callDbCmd(deleteStudyPlansQuery, deleteStudyPlansValues);
        if (response.rowCount === 0)
            throw new studentcher_shared_utils_1.CustomError("Study plans not found.", 404);
        return response.rows;
    }
    async findMany(_data) {
        const selectStudyPlansQuery = StudyPlansRepository.queries.getSelectStudyPlansQuery();
        const selectStudyPlansValues = [];
        const response = await this.pgClient.callDbCmd(selectStudyPlansQuery, selectStudyPlansValues);
        return response.rows;
    }
    async setUsers(data) {
        const deleteUserPlansQuery = StudyPlansRepository.queries.getDeleteUserPlansQuery();
        const insertUserPlansQuery = StudyPlansRepository.queries.getInsertUserPlansQuery();
        const values = [data.id, data.userIds];
        const sqlQueries = [deleteUserPlansQuery, insertUserPlansQuery];
        const sqlValues = [values, values];
        const response = await this.pgClient.callDbTransaction(sqlQueries, sqlValues);
        const addedUserIds = response[1].rows.reduce((accumulator, { userId }) => accumulator.concat(userId), []);
        return addedUserIds;
    }
}
exports.StudyPlansRepository = StudyPlansRepository;
StudyPlansRepository.queries = queries;
exports.default = new StudyPlansRepository(postgresAdapter_1.default);
//# sourceMappingURL=StudyPlansRepository.js.map