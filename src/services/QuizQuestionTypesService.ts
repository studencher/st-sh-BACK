import {QuizQuestionTypesService} from "../studentcher-shared-utils/services/QuizQuestionTypesService";
import authorizationService from "./AuthorizationService";
import quizQuestionTypesRepository from "../repositories/QuizQuestionTypesRepository";

export default new QuizQuestionTypesService(authorizationService, quizQuestionTypesRepository);
