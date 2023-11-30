import {QuizzesRepository} from "../studentcher-shared-utils/repositories/QuizzesRepository";
import pgClient from "../storage/postgresAdapter";

export default new QuizzesRepository(pgClient);
