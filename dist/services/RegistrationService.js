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
            const userPermissions = await this.rolesRepository.findUserPermissions({ userId });
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { token, user, userPermissions }) };
        }
        catch (err) {
            return { err };
        }
    }
}
exports.RegistrationService = RegistrationService;
exports.default = new RegistrationService(RolesRepository_1.default, UsersRepository_1.default, AuthenticationService_1.default);
//# sourceMappingURL=RegistrationService.js.map