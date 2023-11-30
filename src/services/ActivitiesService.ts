import {ActivitiesService} from "../studentcher-shared-utils/services/ActivitiesService";
import activitiesRepository from "../repositories/ActivitiesRepository";
import usersRepository from "../repositories/UsersRepository";
import rolesRepository from "../repositories/RolesRepository";
import authorizationService from "./AuthorizationService";


export default new ActivitiesService(authorizationService,activitiesRepository, usersRepository, rolesRepository);
