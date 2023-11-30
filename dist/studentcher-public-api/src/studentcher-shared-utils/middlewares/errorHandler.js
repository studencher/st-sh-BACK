"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsHandler = void 0;
const CustomError_1 = require("../models/CustomError");
function errorsHandler(logger) {
    return (error, req, res, _next) => {
        logger.error(error.message);
        const err = error.constructor.name === "CustomError" ? error : new CustomError_1.CustomError("Error");
        return res.status(err.status).json(err.serialize());
    };
}
exports.errorsHandler = errorsHandler;
//# sourceMappingURL=errorHandler.js.map