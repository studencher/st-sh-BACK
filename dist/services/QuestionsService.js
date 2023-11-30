"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsService = void 0;
const studentcher_shared_utils_1 = require("../studentcher-shared-utils");
const QuestionsRepository_1 = __importDefault(require("../repositories/QuestionsRepository"));
const AuthorizationService_1 = __importDefault(require("./AuthorizationService"));
const CloudService_1 = __importDefault(require("./CloudService"));
class QuestionsService {
    constructor(authorizationService, questionsRepository, cloudService) {
        this.questionsRepository = questionsRepository;
        this.authorizationService = authorizationService;
        this.cloudService = cloudService;
    }
    async getQuestions(data) {
        try {
            const questions = await this.questionsRepository.find(data);
            if (questions.length === 0)
                return { err: new studentcher_shared_utils_1.CustomError("Questions not found", 404) };
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { questions }) };
        }
        catch (err) {
            return { err };
        }
    }
    async getQuestionFullData(data) {
        try {
            if (data.id == null)
                return { err: new studentcher_shared_utils_1.CustomError("Question's id must be provided") };
            if (typeof data.id !== "string")
                return { err: new studentcher_shared_utils_1.CustomError("Invalid value for question's provided") };
            const question = await this.questionsRepository.findFullDataById(data.id);
            if (question == null)
                return { err: new studentcher_shared_utils_1.CustomError("Question not found", 404) };
            if (question.videoFileName != null) {
                const generationResponse = await this.cloudService.generatePreSignUrl({ fileName: question.videoFileName, action: studentcher_shared_utils_1.Constants.CLOUD_STORAGE_PRE_SIGNED_URL_READ_ACTION });
                if (generationResponse.err != null)
                    return { err: generationResponse.err };
                question.videoSrcUrl = generationResponse.response.data.preSignedUrl;
            }
            for (let i = 0; i < question.answers.length; i++) {
                const answer = question.answers[i];
                if (answer.videoFileName == null)
                    continue;
                const generationResponse = await this.cloudService.generatePreSignUrl({ fileName: answer.videoFileName, action: studentcher_shared_utils_1.Constants.CLOUD_STORAGE_PRE_SIGNED_URL_READ_ACTION });
                if (generationResponse.err != null)
                    return { err: generationResponse.err };
                answer.videoSrcUrl = generationResponse.response.data.preSignedUrl;
            }
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { question }) };
        }
        catch (err) {
            return { err };
        }
    }
    async verifyAccessToVideo(videoFileName) {
        if (videoFileName == null)
            return;
        await this.authorizationService.verifyAccessToFileOnCloud(videoFileName);
    }
    async addQuestion(data) {
        try {
            const { result, message } = studentcher_shared_utils_1.Validations.areFieldsProvided(["title", "content", "createdBy"], data);
            if (!result)
                return { err: new studentcher_shared_utils_1.CustomError(message) };
            await this.verifyAccessToVideo(data.videoFileName);
            const question = await this.questionsRepository.insertOne(data);
            if (question.videoFileName != null) {
                const generationResponse = await this.cloudService.generatePreSignUrl({ fileName: question.videoFileName, action: studentcher_shared_utils_1.Constants.CLOUD_STORAGE_PRE_SIGNED_URL_READ_ACTION });
                if (generationResponse.err != null)
                    return { err: generationResponse.err };
                question.videoSrcUrl = generationResponse.response.data.preSignedUrl;
            }
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { question }) };
        }
        catch (err) {
            if (err.constraint === "questions_title_key")
                return { err: new studentcher_shared_utils_1.CustomError("There is already a question with this title registered in the system.") };
            return { err };
        }
    }
    async editQuestion(data) {
        try {
            const { result, message } = studentcher_shared_utils_1.Validations.areFieldsProvided(["id", "committedByUserId"], data);
            if (!result)
                return { err: new studentcher_shared_utils_1.CustomError(message) };
            if (data.votesSumDelta != null && !studentcher_shared_utils_1.Constants.votesSumDeltaAllowValues.includes(data.votesSumDelta))
                return { err: new studentcher_shared_utils_1.CustomError("Invalid value for votesSumDelta.") };
            if (data.content != null)
                await this.authorizationService.verifyAccessToQuestions([data.id], data.committedByUserId);
            const question = await this.questionsRepository.editOne(data);
            if (question == null)
                return { err: new studentcher_shared_utils_1.CustomError("Question not found", 404) };
            if (question.videoFileName != null) {
                const generationResponse = await this.cloudService.generatePreSignUrl({ fileName: question.videoFileName, action: studentcher_shared_utils_1.Constants.CLOUD_STORAGE_PRE_SIGNED_URL_READ_ACTION });
                if (generationResponse.err != null)
                    return { err: generationResponse.err };
                question.videoSrcUrl = generationResponse.response.data.preSignedUrl;
            }
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { question }) };
        }
        catch (err) {
            return { err };
        }
    }
    async deleteQuestions(data) {
        try {
            if (data.ids == null || (!Array.isArray(data.ids)))
                return { err: new studentcher_shared_utils_1.CustomError("Questions' ids list must be provided.") };
            await this.authorizationService.verifyAccessToQuestions(data.ids, data.committedByUserId);
            const questions = await this.questionsRepository.deleteMany(data);
            if (questions == null || questions.length === 0)
                return { err: new studentcher_shared_utils_1.CustomError("Questions not found", 404) };
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { questions }) };
        }
        catch (err) {
            return { err };
        }
    }
    async addQuestionComment(data) {
        try {
            const { result, message } = studentcher_shared_utils_1.Validations.areFieldsProvided(["questionId", "content", "createdBy"], data);
            if (!result)
                return { err: new studentcher_shared_utils_1.CustomError(message) };
            const comment = await this.questionsRepository.insertOneComment(data);
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { comment }) };
        }
        catch (err) {
            return { err };
        }
    }
    async editQuestionComment(data) {
        try {
            const { result, message } = studentcher_shared_utils_1.Validations.areFieldsProvided(["id", "committedByUserId"], data);
            if (!result)
                return { err: new studentcher_shared_utils_1.CustomError(message) };
            if (data.votesSumDelta != null && !studentcher_shared_utils_1.Constants.votesSumDeltaAllowValues.includes(data.votesSumDelta))
                return { err: new studentcher_shared_utils_1.CustomError("Invalid value for votesSumDelta.") };
            if (data.content != null)
                await this.authorizationService.verifyAccessToQuestionComment([data.id], data.committedByUserId);
            const comment = await this.questionsRepository.editQuestionComment(data);
            if (comment == null)
                return { err: new studentcher_shared_utils_1.CustomError("Comment not found", 404) };
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { comment }) };
        }
        catch (err) {
            return { err };
        }
    }
    async deleteQuestionComments(data) {
        try {
            if (data.ids == null || (!Array.isArray(data.ids)))
                return { err: new studentcher_shared_utils_1.CustomError("Questions' comments' ids list must be provided.") };
            await this.authorizationService.verifyAccessToQuestionComment(data.ids, data.committedByUserId);
            const comments = await this.questionsRepository.deleteQuestionComments(data);
            if (comments == null || comments.length === 0)
                return { err: new studentcher_shared_utils_1.CustomError("Comments not found", 404) };
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { comments }) };
        }
        catch (err) {
            return { err };
        }
    }
    async addAnswer(data) {
        try {
            const { result, message } = studentcher_shared_utils_1.Validations.areFieldsProvided(["questionId", "content", "createdBy"], data);
            if (!result)
                return { err: new studentcher_shared_utils_1.CustomError(message) };
            await this.verifyAccessToVideo(data.videoFileName);
            const answer = await this.questionsRepository.insertOneAnswer(data);
            if (answer.videoFileName != null) {
                const generationResponse = await this.cloudService.generatePreSignUrl({ fileName: answer.videoFileName, action: studentcher_shared_utils_1.Constants.CLOUD_STORAGE_PRE_SIGNED_URL_READ_ACTION });
                if (generationResponse.err != null)
                    return { err: generationResponse.err };
                answer.videoSrcUrl = generationResponse.response.data.preSignedUrl;
            }
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { answer }) };
        }
        catch (err) {
            return { err };
        }
    }
    async editAnswer(data) {
        try {
            const { result, message } = studentcher_shared_utils_1.Validations.areFieldsProvided(["id", "committedByUserId"], data);
            if (!result)
                return { err: new studentcher_shared_utils_1.CustomError(message) };
            if (data.votesSumDelta != null && !studentcher_shared_utils_1.Constants.votesSumDeltaAllowValues.includes(data.votesSumDelta))
                return { err: new studentcher_shared_utils_1.CustomError("Invalid value for votesSumDelta.") };
            if (data.content != null)
                await this.authorizationService.verifyAccessToQuestionComment([data.id], data.committedByUserId);
            const answer = await this.questionsRepository.editAnswer(data);
            if (answer == null)
                return { err: new studentcher_shared_utils_1.CustomError("Answer not found", 404) };
            if (answer.videoFileName != null) {
                const generationResponse = await this.cloudService.generatePreSignUrl({ fileName: answer.videoFileName, action: studentcher_shared_utils_1.Constants.CLOUD_STORAGE_PRE_SIGNED_URL_READ_ACTION });
                if (generationResponse.err != null)
                    return { err: generationResponse.err };
                answer.videoSrcUrl = generationResponse.response.data.preSignedUrl;
            }
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { answer }) };
        }
        catch (err) {
            return { err };
        }
    }
    async deleteAnswers(data) {
        try {
            if (data.ids == null || (!Array.isArray(data.ids)))
                return { err: new studentcher_shared_utils_1.CustomError("Questions' comments' ids list must be provided.") };
            await this.authorizationService.verifyAccessToQuestionComment(data.ids, data.committedByUserId);
            const answers = await this.questionsRepository.deleteAnswers(data);
            if (answers == null || answers.length === 0)
                return { err: new studentcher_shared_utils_1.CustomError("Answers not found", 404) };
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { answers }) };
        }
        catch (err) {
            return { err };
        }
    }
    async addAnswerComment(data) {
        try {
            const { result, message } = studentcher_shared_utils_1.Validations.areFieldsProvided(["answerId", "content", "createdBy"], data);
            if (!result)
                return { err: new studentcher_shared_utils_1.CustomError(message) };
            const comment = await this.questionsRepository.insertAnswerComment(data);
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { comment }) };
        }
        catch (err) {
            return { err };
        }
    }
    async editAnswerComment(data) {
        try {
            const { result, message } = studentcher_shared_utils_1.Validations.areFieldsProvided(["id", "committedByUserId"], data);
            if (!result)
                return { err: new studentcher_shared_utils_1.CustomError(message) };
            if (data.votesSumDelta != null && !studentcher_shared_utils_1.Constants.votesSumDeltaAllowValues.includes(data.votesSumDelta))
                return { err: new studentcher_shared_utils_1.CustomError("Invalid value for votesSumDelta.") };
            if (data.content != null)
                await this.authorizationService.verifyAccessToQuestionComment([data.id], data.committedByUserId);
            const comment = await this.questionsRepository.editAnswerComment(data);
            if (comment == null)
                return { err: new studentcher_shared_utils_1.CustomError("Answer comment not found", 404) };
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { comment }) };
        }
        catch (err) {
            return { err };
        }
    }
    async deleteAnswerComments(data) {
        try {
            if (data.ids == null || (!Array.isArray(data.ids)))
                return { err: new studentcher_shared_utils_1.CustomError("Questions' answers' comments' ids list must be provided.") };
            await this.authorizationService.verifyAccessToQuestionComment(data.ids, data.committedByUserId);
            const comments = await this.questionsRepository.deleteAnswersComments(data);
            if (comments == null || comments.length === 0)
                return { err: new studentcher_shared_utils_1.CustomError("Answers comments not found", 404) };
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { comments }) };
        }
        catch (err) {
            return { err };
        }
    }
}
exports.QuestionsService = QuestionsService;
exports.default = new QuestionsService(AuthorizationService_1.default, QuestionsRepository_1.default, CloudService_1.default);
//# sourceMappingURL=QuestionsService.js.map