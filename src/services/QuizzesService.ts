import {QuizzesService} from "../studentcher-shared-utils/services/QuizzesService";
import authorizationService from "./AuthorizationService";
import quizzesRepository from "../repositories/QuizzesRepository";

export default new QuizzesService(authorizationService, quizzesRepository);
