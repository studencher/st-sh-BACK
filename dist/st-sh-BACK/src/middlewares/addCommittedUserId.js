"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommittedUserId = void 0;
const studentcher_shared_utils_1 = require("../studentcher-shared-utils");
function addCommittedUserId(req, res, next) {
    if (res.locals.userId == null)
        return next(new studentcher_shared_utils_1.CustomError("Request not passed authorization"));
    req.body.committedUserId = res.locals.userId;
    req.headers[studentcher_shared_utils_1.Constants.PROXY_AUTHORIZED_HEADER] = res.locals.userId;
    return next();
}
exports.addCommittedUserId = addCommittedUserId;
//# sourceMappingURL=addCommittedUserId.js.map