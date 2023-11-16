import pgClient from "../storage/postgresAdapter";
import logger from "../helpers/Logger";
import {AuthenticationService} from "../studentcher-shared-utils/services/AuthenticationService";



export default new AuthenticationService(pgClient, logger, process.env.JWT_SECRET);
