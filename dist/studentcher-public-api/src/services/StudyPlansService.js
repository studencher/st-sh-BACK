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
exports.StudyPlansService = void 0;
const uuid = __importStar(require("uuid"));
const studentcher_shared_utils_1 = require("../studentcher-shared-utils");
const StudyPlansRepository_1 = __importDefault(require("../repositories/StudyPlansRepository"));
const UsersRepository_1 = __importDefault(require("../repositories/UsersRepository"));
const ActivitiesRepository_1 = __importDefault(require("../repositories/ActivitiesRepository"));
class StudyPlansService {
    constructor(studyPlansRepository, usersRepository, activitiesRepository) {
        this.studyPlansRepository = studyPlansRepository;
        this.usersRepository = usersRepository;
        this.activitiesRepository = activitiesRepository;
    }
    async addStudyPlan(data) {
        try {
            const { result, message } = studentcher_shared_utils_1.Validations.areFieldsProvided(["name"], data);
            if (!result)
                return { err: new studentcher_shared_utils_1.CustomError(message) };
            data.planId = StudyPlansService.idGenerator();
            const plan = await this.studyPlansRepository.addOne(data);
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { plan }) };
        }
        catch (err) {
            switch (err.constraint) {
                case "plans_name_key":
                    return { err: new studentcher_shared_utils_1.CustomError("Name already taken and must be unique") };
                case "plan_activities_plan_id_fk":
                    return { err: new studentcher_shared_utils_1.CustomError("At least one activity is invalid.") };
                default:
                    return { err };
            }
        }
    }
    async editStudyPlan(data) {
        try {
            if (data.planId == null)
                return { err: new studentcher_shared_utils_1.CustomError("Study Plan id must be provided.") };
            const plan = await this.studyPlansRepository.editOne(data);
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { plan }) };
        }
        catch (err) {
            switch (err.constraint) {
                case "plans_name_key":
                    return { err: new studentcher_shared_utils_1.CustomError("Name already taken and must be unique") };
                case "plan_activities_plan_id_fk":
                    return { err: new studentcher_shared_utils_1.CustomError("At least one activity is invalid.") };
                default:
                    return { err };
            }
        }
    }
    async deleteStudyPlans(data) {
        try {
            if (data.planIds.length === 0)
                return { err: new studentcher_shared_utils_1.CustomError("Study plans ids must be provided.") };
            const plans = await this.studyPlansRepository.deleteMany(data);
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { plans }) };
        }
        catch (err) {
            return { err };
        }
    }
    async getStudyPlans(data) {
        try {
            const plans = await this.studyPlansRepository.findMany({});
            const users = await this.usersRepository.findMany(data);
            const activities = await this.activitiesRepository.findMany({});
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { plans, users, activities }) };
        }
        catch (err) {
            return { err };
        }
    }
    async setUsers(data) {
        try {
            const addedUserIds = await this.studyPlansRepository.setUsers(data);
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { addedUserIds }) };
        }
        catch (err) {
            switch (err.constraint) {
                case "plans_name_key":
                    return { err: new studentcher_shared_utils_1.CustomError("Name already taken and must be unique") };
                case "plan_activities_plan_id_fk":
                    return { err: new studentcher_shared_utils_1.CustomError("At least one activity is invalid.") };
                case "user_plans_user_id_fkey":
                    return { err: new studentcher_shared_utils_1.CustomError("At least one user's id is invalid.") };
                case "user_plans_plan_id_fkey":
                    return { err: new studentcher_shared_utils_1.CustomError("Plan's id is invalid.") };
                default:
                    return { err };
            }
        }
    }
}
exports.StudyPlansService = StudyPlansService;
StudyPlansService.idGenerator = uuid.v1;
exports.default = new StudyPlansService(StudyPlansRepository_1.default, UsersRepository_1.default, ActivitiesRepository_1.default);
//# sourceMappingURL=StudyPlansService.js.map