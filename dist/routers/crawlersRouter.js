"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthorizationService_1 = __importDefault(require("../services/AuthorizationService"));
const Constants_1 = require("../studentcher-shared-utils/helpers/Constants");
const AuthenticationService_1 = __importDefault(require("../services/AuthenticationService"));
const CrawlersController_1 = __importDefault(require("../controllers/CrawlersController"));
const router = express_1.default.Router();
router.get("/comments", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), CrawlersController_1.default.getComments);
router.post('/comments', AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), CrawlersController_1.default.addComment);
router.delete('/comments', AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), CrawlersController_1.default.deleteComments);
router.get("/user-accounts", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), CrawlersController_1.default.getUserAccounts);
router.post("/user-accounts", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), CrawlersController_1.default.addUserAccount);
router.delete("/user-accounts", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), CrawlersController_1.default.deleteUserAccounts);
router.get("/searches", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), CrawlersController_1.default.getSearches);
router.post("/searches", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), CrawlersController_1.default.addSearch);
router.delete("/searches", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), CrawlersController_1.default.deleteSearches);
router.get("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), CrawlersController_1.default.getCrawlers);
router.post("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), CrawlersController_1.default.addCrawler);
router.delete("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), CrawlersController_1.default.deleteCrawlers);
router.post("/status", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), CrawlersController_1.default.addCrawlerStatus);
exports.default = router;
//# sourceMappingURL=crawlersRouter.js.map