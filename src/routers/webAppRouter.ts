// import proxy from 'express-http-proxy';
// import url from "url";
// import express from "express";
// import {Constants} from "../studentcher-shared-utils";
// import {AuthenticationService} from "../services/AuthenticationService";
// import {addCommittedUserId} from "../middlewares/addCommittedUserId";
// import authorizationService from "../services/AuthorizationService";
//
//
// const router = express.Router();
//
// router.use("/", AuthenticationService.verify,
//     authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
//     addCommittedUserId,   proxy(process.env.WEB_APP_API_ADDRESS, {
//         proxyReqPathResolver: function(req, _res) {
//             return '/api/v1' + url.parse(req.url).path;
//         }}));
//
// export default router;
