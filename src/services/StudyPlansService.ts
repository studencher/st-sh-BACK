import * as uuid from "uuid";

import {
    Plan,
    IUserDTO,
    Activity,
    ServiceResponse,
    IClientRequestData,
    Validations,
    UsersRepository,
    CustomError,
    ApiResponse,
    IPlan
} from "../studentcher-shared-utils";

import studyPlansRepository, {StudyPlansRepository} from "../repositories/StudyPlansRepository";
import {ActivitiesRepository} from "../studentcher-shared-utils/repositories/ActivitiesRepository";
import usersRepository from "../repositories/UsersRepository";
import activitiesRepository from "../repositories/ActivitiesRepository";

export interface IStudyPlansService {
    getStudyPlans(data: IClientRequestData): Promise<ServiceResponse<ApiResponse<{ users: IUserDTO[]; plans: IPlan[], activities: Activity[]}>>>;
    addStudyPlan(data: IClientRequestData): Promise<ServiceResponse<ApiResponse<{ plan: IPlan }>>>;
    editStudyPlan(data: IClientRequestData): Promise<ServiceResponse<ApiResponse<{  plan: IPlan }>>>;
    deleteStudyPlans(data: IClientRequestData): Promise<ServiceResponse<ApiResponse<{ plans: IPlan[] }>>>;
    setUsers(data: IClientRequestData): Promise<ServiceResponse<ApiResponse<{ addedUserIds: string[] }>>>;

}
export class StudyPlansService implements IStudyPlansService{
    static idGenerator = uuid.v1;

    studyPlansRepository: StudyPlansRepository;
    usersRepository: UsersRepository;
    activitiesRepository: ActivitiesRepository;

    constructor(studyPlansRepository, usersRepository, activitiesRepository) {
        this.studyPlansRepository = studyPlansRepository;
        this.usersRepository = usersRepository;
        this.activitiesRepository = activitiesRepository;
    }
    async addStudyPlan(data: IClientRequestData) :Promise<ServiceResponse>{
        try {
            const {result, message} = Validations.areFieldsProvided(["name"], data);
            if(!result)
                return {err: new CustomError(message)}

            data.planId = StudyPlansService.idGenerator();
            const plan = await this.studyPlansRepository.addOne(data)
            return {response: new ApiResponse(true, {plan})};
        } catch (err) {
            switch (err.constraint) {
                case "plans_name_key":
                    return {err: new CustomError("Name already taken and must be unique")}
                case "plan_activities_plan_id_fk":
                    return {err: new CustomError("At least one activity is invalid.")}
                default:
                    return {err};
            }
        }
    }

    async editStudyPlan(data: IClientRequestData) :Promise<ServiceResponse>{
        try{
            if(data.planId == null)
                return {err: new CustomError("Study Plan id must be provided.")};
            const plan = await this.studyPlansRepository.editOne(data)
            return {response: new ApiResponse(true, {plan})};
        }catch(err){
            switch (err.constraint) {
                case "plans_name_key":
                    return {err: new CustomError("Name already taken and must be unique")}
                case "plan_activities_plan_id_fk":
                    return {err: new CustomError("At least one activity is invalid.")}
                default:
                    return {err};
            }
        }
    }

    async deleteStudyPlans(data: IClientRequestData) :Promise<ServiceResponse>{
        try{
            if(data.planIds.length === 0)
                return {err: new CustomError("Study plans ids must be provided.")};
            const plans = await this.studyPlansRepository.deleteMany(data);
            return {response: new ApiResponse(true, {plans})};
        }catch(err){
            return {err}
        }
    }

    async getStudyPlans(data: IClientRequestData) :Promise<ServiceResponse>{
        try{
            const plans: Plan[] = await this.studyPlansRepository.findMany({});
            const users: IUserDTO[] = await this.usersRepository.findMany(data);
            const activities: Activity[] = await this.activitiesRepository.findMany({});
            return {response: new ApiResponse(true, {plans, users, activities})};
        }catch(err){
            return {err}
        }
    }

    async setUsers(data: IClientRequestData) :Promise<ServiceResponse>{
        try {
            const addedUserIds = await this.studyPlansRepository.setUsers(data)
            return {response: new ApiResponse(true, {addedUserIds})};
        } catch (err) {
            switch (err.constraint) {
                case "plans_name_key":
                    return {err: new CustomError("Name already taken and must be unique")}
                case "plan_activities_plan_id_fk":
                    return {err: new CustomError("At least one activity is invalid.")}
                case "user_plans_user_id_fkey":
                    return {err: new CustomError("At least one user's id is invalid.")}
                case "user_plans_plan_id_fkey":
                    return {err: new CustomError("Plan's id is invalid.")}
                default:
                    return {err};
            }
        }
    }
}


export default new StudyPlansService(studyPlansRepository, usersRepository, activitiesRepository);
