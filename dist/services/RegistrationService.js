"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationService = void 0;
const studentcher_shared_utils_1 = require("../studentcher-shared-utils");
const AuthenticationService_1 = __importDefault(require("./AuthenticationService"));
const RolesRepository_1 = __importDefault(require("../repositories/RolesRepository"));
const UsersRepository_1 = __importDefault(require("../repositories/UsersRepository"));
class RegistrationService {
    constructor(rolesRepository, usersRepository, authenticationService) {
        this.rolesRepository = rolesRepository;
        this.userRepository = usersRepository;
        this.authenticationService = authenticationService;
    }
    async loginHandler(userId) {
        try {
            if (userId == null)
                return { err: new studentcher_shared_utils_1.CustomError("Login Failed") };
            const token = this.authenticationService.generateControlPanelToken(userId);
            const user = await this.userRepository.findOne({ userId });
            if (user.isonline != true) { // still not online, so can be logged in
                let isonline = user.isonline;
                await this.userRepository.setOnline({ userId });
                const userPermissions = await this.rolesRepository.findUserPermissions({ userId });
                return { response: new studentcher_shared_utils_1.ApiResponse(true, { token, user, userPermissions, isonline }) };
            }
            else if (user.isonline == true) { // already online
                let isonline = user.isonline;
                return { response: new studentcher_shared_utils_1.ApiResponse(false, { isonline }) };
            }
        }
        catch (err) {
            return { err };
        }
    }
    async logoutHandler(userId) {
        try {
            if (userId == null)
                return { err: new studentcher_shared_utils_1.CustomError("Logout Failed") };
            await this.userRepository.setOffline({ userId });
        }
        catch (err) {
            return { err };
        }
    }
}
exports.RegistrationService = RegistrationService;
exports.default = new RegistrationService(RolesRepository_1.default, UsersRepository_1.default, AuthenticationService_1.default);
//# sourceMappingURL=RegistrationService.js.map