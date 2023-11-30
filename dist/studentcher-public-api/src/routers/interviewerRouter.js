// import proxy from 'express-http-proxy';
// import url from "url";
// import express from "express";
// import {Constants} from "../studentcher-shared-utils";
// import {AuthenticationService} from "../services/AuthenticationService";
// import {addCommittedUserId} from "../middlewares/addCommittedUserId";
//
//
//
// const router = express.Router();
// import authorizationService from "../services/AuthorizationService";
//
// router.use("/", AuthenticationService.verify,
//     authorizationService.verifyUserPermission(Constants.permissions.liveSubscription),
//     addCommittedUserId,   proxy(process.env.INTERVIEWER_API_ADDRESS, {
//         proxyReqPathResolver: function(req, _res) {
//             return '/api' + url.parse(req.url).path;
//         }}));
//
// export default router;
//# sourceMappingURL=interviewerRouter.js.map