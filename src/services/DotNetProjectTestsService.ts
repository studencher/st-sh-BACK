import {exec} from "child_process";
import {Logger} from "../studentcher-shared-utils/helpers/Logger";

export class DotNetProjectTestsService {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }
    public async runDotNetProject(projectPath) {
        return new Promise((resolve, reject) => {
            exec(`dotnet build ${projectPath}`, (error, stdout, stderr) => {
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
                exec(`dotnet run --project ${projectPath} > /dev/null`, { cwd: projectPath }, (error, stdout, stderr) => {
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
                    this.logger.debug(`runDotNetProject ended, stdout: ${stdout}`)
                    resolve(stdout);
                });
            });
        });
    }
}

export default new DotNetProjectTestsService(new Logger("DotNetProjectTestsService"));
