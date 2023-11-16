import {UsersRepository} from "../studentcher-shared-utils/repositories/UsersRepository";
import pgClient from "../storage/postgresAdapter";

export default new UsersRepository(pgClient);
