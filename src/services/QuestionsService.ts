import {
    IClientRequestData,
    ServiceResponse,
    ApiResponse,
    CustomError, Validations, AuthorizationService, Constants
} from "../studentcher-shared-utils";
import questionsRepository, {QuestionsRepository} from "../repositories/QuestionsRepository";
import {CloudService} from "../studentcher-shared-utils/services/CloudService";
import {
    IAnswer,
    IAnswerComment,
    IQuestion,
    IQuestionComment,
    IQuestionFullData
} from "../studentcher-shared-utils/entities/question";
import authorizationService from "./AuthorizationService";
import cloudService from "./CloudService";

export interface IQuestionsService {
    getQuestions(data: IClientRequestData): Promise<ServiceResponse<{questions: IQuestion[]}>>;
    getQuestionFullData(data: IClientRequestData): Promise<ServiceResponse<{question: IQuestionFullData}>>;
    addQuestion(data: IClientRequestData): Promise<ServiceResponse<{question: IQuestion}>>;
    editQuestion(data: IClientRequestData): Promise<ServiceResponse<{ question: IQuestion }>>;
    deleteQuestions(data: IClientRequestData): Promise<ServiceResponse<{questions: IQuestion[]}>>;
    addQuestionComment(data: IClientRequestData): Promise<ServiceResponse<{comment: IQuestionComment}>>;
    editQuestionComment(data: IClientRequestData): Promise<ServiceResponse<{comment: IQuestionComment}>>;
    deleteQuestionComments(data: IClientRequestData): Promise<ServiceResponse<{comments: IQuestionComment[]}>>;
    addAnswer(data: IClientRequestData): Promise<ServiceResponse<{answer: IAnswer}>>;
    editAnswer(data: IClientRequestData): Promise<ServiceResponse<{answer: IAnswer}>>;
    deleteAnswers(data: IClientRequestData): Promise<ServiceResponse<{answers: IAnswer[]}>>;
    addAnswerComment(data: IClientRequestData): Promise<ServiceResponse<{comment: IAnswerComment}>>;
    editAnswerComment(data: IClientRequestData): Promise<ServiceResponse<{comment: IAnswerComment}>>;
    deleteAnswerComments(data: IClientRequestData): Promise<ServiceResponse<{comments: IAnswerComment[]}>>;
}

export class QuestionsService implements IQuestionsService{

    private questionsRepository: QuestionsRepository
    private authorizationService : AuthorizationService;
    private cloudService: CloudService;
    constructor(authorizationService, questionsRepository, cloudService) {
        this.questionsRepository = questionsRepository;
        this.authorizationService = authorizationService;
        this.cloudService = cloudService;
    }

    async getQuestions(data: IClientRequestData): Promise<ServiceResponse>{
        try {
            const questions = await this.questionsRepository.find(data);
            if(questions.length === 0)
                return {err: new CustomError("Questions not found", 404)};
            return {response: new ApiResponse(true, {questions})};
        }catch (err){
            return {err}
        }
    }

    async getQuestionFullData(data: IClientRequestData): Promise<ServiceResponse>{
        try {
            if(data.id == null)
                return {err: new CustomError("Question's id must be provided")};
            if(typeof data.id !== "string")
                return {err: new CustomError("Invalid value for question's provided")};

            const question = await this.questionsRepository.findFullDataById(data.id);
            if(question == null)
                return {err: new CustomError("Question not found", 404)};
            if(question.videoFileName != null){
                const generationResponse = await this.cloudService.generatePreSignUrl({fileName: question.videoFileName, action: Constants.CLOUD_STORAGE_PRE_SIGNED_URL_READ_ACTION});
                if(generationResponse.err != null)
                    return {err: generationResponse.err}
                question.videoSrcUrl = generationResponse.response.data.preSignedUrl;
            }
            for(let i = 0; i < question.answers.length ; i++ ){
                const answer = question.answers[i];
                if(answer.videoFileName == null)
                    continue;
                const generationResponse = await this.cloudService.generatePreSignUrl({fileName: answer.videoFileName, action: Constants.CLOUD_STORAGE_PRE_SIGNED_URL_READ_ACTION});
                if(generationResponse.err != null)
                    return {err: generationResponse.err}
                answer.videoSrcUrl = generationResponse.response.data.preSignedUrl;
            }
            return {response: new ApiResponse(true, {question})};
        }catch (err){
            return {err}
        }
    }
    async verifyAccessToVideo(videoFileName): Promise<void>{
        if(videoFileName == null)
            return;
        await this.authorizationService.verifyAccessToFileOnCloud(videoFileName);
    }

    async addQuestion(data: IClientRequestData): Promise<ServiceResponse>{
        try{
            const {result, message} = Validations.areFieldsProvided(["title", "content", "createdBy"], data);
            if(!result)
                return {err: new CustomError(message)};
            await this.verifyAccessToVideo(data.videoFileName);
            const question = await this.questionsRepository.insertOne(data);
            if(question.videoFileName != null){
                const generationResponse = await this.cloudService.generatePreSignUrl({fileName: question.videoFileName, action: Constants.CLOUD_STORAGE_PRE_SIGNED_URL_READ_ACTION});
                if(generationResponse.err != null)
                    return {err: generationResponse.err}
                question.videoSrcUrl = generationResponse.response.data.preSignedUrl;
            }
            return {response: new ApiResponse(true, {question})};
        }catch (err){
            if(err.constraint === "questions_title_key")
                return {err: new CustomError("There is already a question with this title registered in the system.")};
            return {err};
        }
    }

    async editQuestion(data: IClientRequestData): Promise<ServiceResponse>{
        try{
            const {result, message} = Validations.areFieldsProvided(["id", "committedByUserId"], data);
            if(!result)
                return {err: new CustomError(message)};
            if(data.votesSumDelta != null && !Constants.votesSumDeltaAllowValues.includes(data.votesSumDelta))
                return {err: new CustomError("Invalid value for votesSumDelta.")};

            if(data.content != null)
                    await this.authorizationService.verifyAccessToQuestions([data.id], data.committedByUserId);
            const question = await this.questionsRepository.editOne(data);
            if(question == null)
                return {err: new CustomError("Question not found", 404)};
            if(question.videoFileName != null){
                const generationResponse = await this.cloudService.generatePreSignUrl({fileName: question.videoFileName, action: Constants.CLOUD_STORAGE_PRE_SIGNED_URL_READ_ACTION});
                if(generationResponse.err != null)
                    return {err: generationResponse.err}
                question.videoSrcUrl = generationResponse.response.data.preSignedUrl;
            }
            return {response: new ApiResponse(true, {question})};
        }catch (err){
            return {err}
        }
    }

    async deleteQuestions(data: IClientRequestData): Promise<ServiceResponse>{
        try{
            if(data.ids == null ||  (!Array.isArray(data.ids)))
                return {err: new CustomError("Questions' ids list must be provided.")}

            await this.authorizationService.verifyAccessToQuestions(data.ids, data.committedByUserId)
            const questions = await this.questionsRepository.deleteMany(data);
            if(questions == null || questions.length === 0)
                return {err: new CustomError("Questions not found", 404)};
            return {response: new ApiResponse(true, {questions})};
        }catch (err){
            return {err}
        }
    }

    async addQuestionComment(data: IClientRequestData): Promise<ServiceResponse>{
        try{
            const {result, message} = Validations.areFieldsProvided(["questionId", "content", "createdBy"], data);
            if(!result)
                return {err: new CustomError(message)};
            const comment: IQuestionComment = await this.questionsRepository.insertOneComment(data);
            return {response: new ApiResponse(true, {comment})};
        }catch (err){
            return {err}
        }
    }

    async editQuestionComment(data: IClientRequestData): Promise<ServiceResponse>{
        try{
            const {result, message} = Validations.areFieldsProvided(["id", "committedByUserId"], data);
            if(!result)
                return {err: new CustomError(message)};
            if(data.votesSumDelta != null && !Constants.votesSumDeltaAllowValues.includes(data.votesSumDelta))
                return {err: new CustomError("Invalid value for votesSumDelta.")};
            if(data.content != null)
                    await this.authorizationService.verifyAccessToQuestionComment([data.id], data.committedByUserId)
            const comment: IQuestionComment = await this.questionsRepository.editQuestionComment(data);
            if(comment == null)
                return {err: new CustomError("Comment not found", 404)};
            return {response: new ApiResponse(true, {comment})};
        }catch (err){
            return {err}
        }
    }

    async deleteQuestionComments(data: IClientRequestData): Promise<ServiceResponse>{
        try{
            if(data.ids == null || (!Array.isArray(data.ids)))
                return {err: new CustomError("Questions' comments' ids list must be provided.")}

            await this.authorizationService.verifyAccessToQuestionComment(data.ids, data.committedByUserId)
            const comments: IQuestionComment[] = await this.questionsRepository.deleteQuestionComments(data);
            if(comments == null || comments.length === 0)
                return {err: new CustomError("Comments not found", 404)};
            return {response: new ApiResponse(true, {comments})};
        }catch (err){
            return {err}
        }
    }

    async addAnswer(data: IClientRequestData): Promise<ServiceResponse>{
        try{
            const {result, message} = Validations.areFieldsProvided(["questionId", "content", "createdBy"], data);
            if(!result)
                return {err: new CustomError(message)};
            await this.verifyAccessToVideo(data.videoFileName);
            const answer = await this.questionsRepository.insertOneAnswer(data);
            if(answer.videoFileName != null){
                const generationResponse = await this.cloudService.generatePreSignUrl({fileName: answer.videoFileName, action: Constants.CLOUD_STORAGE_PRE_SIGNED_URL_READ_ACTION});
                if(generationResponse.err != null)
                    return {err: generationResponse.err}
                answer.videoSrcUrl = generationResponse.response.data.preSignedUrl;
            }
            return {response: new ApiResponse(true, {answer})};
        }catch (err){
            return {err}
        }
    }

    async editAnswer(data: IClientRequestData): Promise<ServiceResponse>{
        try{
            const {result, message} = Validations.areFieldsProvided(["id", "committedByUserId"], data);
            if(!result)
                return {err: new CustomError(message)};
            if(data.votesSumDelta != null && !Constants.votesSumDeltaAllowValues.includes(data.votesSumDelta))
                return {err: new CustomError("Invalid value for votesSumDelta.")};
            if(data.content != null)
                await this.authorizationService.verifyAccessToQuestionComment([data.id], data.committedByUserId)
            const answer = await this.questionsRepository.editAnswer(data);
            if(answer == null)
                return {err: new CustomError("Answer not found", 404)};
            if(answer.videoFileName != null){
                const generationResponse = await this.cloudService.generatePreSignUrl({fileName: answer.videoFileName, action: Constants.CLOUD_STORAGE_PRE_SIGNED_URL_READ_ACTION});
                if(generationResponse.err != null)
                    return {err: generationResponse.err}
                answer.videoSrcUrl = generationResponse.response.data.preSignedUrl;
            }
            return {response: new ApiResponse(true, {answer})};
        }catch (err){
            return {err}
        }
    }

    async deleteAnswers(data: IClientRequestData): Promise<ServiceResponse>{
        try{
            if(data.ids == null || (!Array.isArray(data.ids)) )
                return {err: new CustomError("Questions' comments' ids list must be provided.")}

            await this.authorizationService.verifyAccessToQuestionComment(data.ids, data.committedByUserId)
            const answers = await this.questionsRepository.deleteAnswers(data);
            if(answers == null || answers.length === 0)
                return {err: new CustomError("Answers not found", 404)};
            return {response: new ApiResponse(true, {answers})};
        }catch (err){
            return {err}
        }
    }

    async addAnswerComment(data: IClientRequestData): Promise<ServiceResponse>{
        try{
            const {result, message} = Validations.areFieldsProvided(["answerId", "content", "createdBy"], data);
            if(!result)
                return {err: new CustomError(message)};
            const comment = await this.questionsRepository.insertAnswerComment(data);
            return {response: new ApiResponse(true, {comment})};
        }catch (err){
            return {err}
        }
    }

    async editAnswerComment(data: IClientRequestData): Promise<ServiceResponse>{
        try{
            const {result, message} = Validations.areFieldsProvided(["id", "committedByUserId"], data);
            if(!result)
                return {err: new CustomError(message)};
            if(data.votesSumDelta != null && !Constants.votesSumDeltaAllowValues.includes(data.votesSumDelta))
                return {err: new CustomError("Invalid value for votesSumDelta.")};
            if(data.content != null)
                await this.authorizationService.verifyAccessToQuestionComment([data.id], data.committedByUserId)
            const comment = await this.questionsRepository.editAnswerComment(data);
            if(comment == null)
                return {err: new CustomError("Answer comment not found", 404)};
            return {response: new ApiResponse(true, {comment})};
        }catch (err){
            return {err}
        }
    }

    async deleteAnswerComments(data: IClientRequestData): Promise<ServiceResponse>{
        try{
            if(data.ids == null || (!Array.isArray(data.ids)) )
                return {err: new CustomError("Questions' answers' comments' ids list must be provided.")}

            await this.authorizationService.verifyAccessToQuestionComment(data.ids, data.committedByUserId)
            const comments = await this.questionsRepository.deleteAnswersComments(data);
            if(comments == null || comments.length === 0)
                return {err: new CustomError("Answers comments not found", 404)};
            return {response: new ApiResponse(true, {comments})};
        }catch (err){
            return {err}
        }
    }

}


export default new QuestionsService(authorizationService, questionsRepository, cloudService);
