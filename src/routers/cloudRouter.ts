import express from "express";
import cloudController from "../controllers/CloudController";
import authorizationService from "../services/AuthorizationService";
import {Constants} from "../studentcher-shared-utils/helpers/Constants";
import authenticationService from "../services/AuthenticationService";


const router = express.Router();

router.post("/presigned-url", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.activityManagementEnabled), cloudController.postPreSignedUrl);

router.post('/upload', authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.activityManagementEnabled), cloudController.postUploadFile);

router.get(
  '/bucket-folders',
  authenticationService.verify,
  authorizationService.verifyUserPermission(
    Constants.permissions.activityManagementEnabled
  ),
  cloudController.getBucketFolders
);

router.post(
  '/bucket-folder',
  authenticationService.verify,
  authorizationService.verifyUserPermission(
    Constants.permissions.activityManagementEnabled
  ),
  cloudController.postBucketFolder
);


export default router;
