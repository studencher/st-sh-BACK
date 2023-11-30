"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const studentcher_shared_utils_1 = require("./studentcher-shared-utils");
const routers_1 = __importDefault(require("./routers"));
const Logger_1 = __importDefault(require("./helpers/Logger"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", (0, studentcher_shared_utils_1.logFinishMiddleware)(Logger_1.default), (0, studentcher_shared_utils_1.logReceivingMiddleware)(Logger_1.default));
app.use("/api/v1", routers_1.default);
app.use("/", studentcher_shared_utils_1.healthCheckMiddleware);
app.use((0, studentcher_shared_utils_1.errorsHandler)(Logger_1.default));
exports.default = app;
//# sourceMappingURL=app.js.map