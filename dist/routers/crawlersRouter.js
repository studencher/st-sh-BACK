/*import express from "express";
import authorizationService from "../services/AuthorizationService";
import {Constants} from "../studentcher-shared-utils/helpers/Constants";
import authenticationService from "../services/AuthenticationService";
import crawlersController from "../controllers/CrawlersController";


const router = express.Router();

router.get("/comments", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    crawlersController.getComments );

router.post('/comments', authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    crawlersController.addComment) ;

router.delete('/comments', authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    crawlersController.deleteComments) ;

router.get("/user-accounts", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    crawlersController.getUserAccounts );

router.post("/user-accounts", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    crawlersController.addUserAccount );

router.delete("/user-accounts", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    crawlersController.deleteUserAccounts );

router.get("/searches", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    crawlersController.getSearches );

router.post("/searches", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    crawlersController.addSearch );

router.delete("/searches", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    crawlersController.deleteSearches );


router.get("/", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    crawlersController.getCrawlers );

router.post("/", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    crawlersController.addCrawler );

router.delete("/", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    crawlersController.deleteCrawlers );


router.post("/status", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    crawlersController.addCrawlerStatus );


export default router;
*/ 
//# sourceMappingURL=crawlersRouter.js.map