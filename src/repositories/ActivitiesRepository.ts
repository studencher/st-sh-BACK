import {ActivitiesRepository} from "../studentcher-shared-utils/repositories/ActivitiesRepository";
import pgClient from "../storage/postgresAdapter";

export default new ActivitiesRepository(pgClient);
