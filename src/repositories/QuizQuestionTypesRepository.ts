import {QuizQuestionTypesRepository} from "../studentcher-shared-utils/repositories/QuizQuestionTypesRepository";
import pgClient from "../storage/postgresAdapter";

export default new QuizQuestionTypesRepository(pgClient);
