import {ApiResponse, ServiceResponse, CustomError, RolesRepository, UsersRepository} from "../studentcher-shared-utils";
import authenticationService from "./AuthenticationService";
import rolesRepository from "../repositories/RolesRepository";
import usersRepository from "../repositories/UsersRepository";
import {AuthenticationService} from "../studentcher-shared-utils/services/AuthenticationService";

export class RegistrationService {
    private authenticationService: AuthenticationService;
    private rolesRepository: RolesRepository;
    private userRepository: UsersRepository;

    constructor(rolesRepository, usersRepository, authenticationService) {
    this.rolesRepository = rolesRepository;
    this.userRepository = usersRepository;
    this.authenticationService = authenticationService;
    }

    async loginHandler(userId: string | undefined) :Promise<ServiceResponse>{
        try{
            if(userId == null)
                return {err: new CustomError("Login Failed")}
            const token: string = this.authenticationService.generateControlPanelToken(userId);
            const user = await this.userRepository.findOne({userId});
            const userPermissions = await this.rolesRepository.findUserPermissions({userId});

            return {response: new ApiResponse(true, {token, user, userPermissions})};
        }catch (err){
            return {err}
        }
    }

}

export default new RegistrationService(rolesRepository, usersRepository, authenticationService);
