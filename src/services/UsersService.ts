import {UsersService} from "../studentcher-shared-utils/services/UsersService";
import usersRepository from "../repositories/UsersRepository";
import rolesRepository from "../repositories/RolesRepository";
import cloudService from "./CloudService";

export default new UsersService(usersRepository, rolesRepository, cloudService);
