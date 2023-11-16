"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotNetProjectTestsService = void 0;
const child_process_1 = require("child_process");
const Logger_1 = require("../studentcher-shared-utils/helpers/Logger");
class DotNetProjectTestsService {
    constructor(logger) {
        this.logger = logger;
    }
    async runDotNetProject(projectPath) {
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)(`dotnet build ${projectPath}`, (error, stdout, stderr) => {
                if (error) {
                    this.logger.error(error.message);
                    reject(error);
                    return;
                }
                if (stderr) {
                    this.logger.error(stderr);
                    reject(new Error(stderr));
                    return;
                }
                (0, child_process_1.exec)(`dotnet run --project ${projectPath} > /dev/null`, { cwd: projectPath }, (error, stdout, stderr) => {
                    if (error) {
                        this.logger.error(error.message);
                        reject(error);
                        return;
                    }
                    if (stderr) {
                        this.logger.error(stderr);
                        reject(new Error(stderr));
                        return;
                    }
                    this.logger.debug(`runDotNetProject ended, stdout: ${stdout}`);
                    resolve(stdout);
                });
            });
        });
    }
}
exports.DotNetProjectTestsService = DotNetProjectTestsService;
exports.default = new DotNetProjectTestsService(new Logger_1.Logger("DotNetProjectTestsService"));
//# sourceMappingURL=DotNetProjectTestsService.js.map