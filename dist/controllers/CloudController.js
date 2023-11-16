"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CloudService_1 = __importDefault(require("../services/CloudService"));
const CloudStorageAdapter_1 = __importDefault(require("../storage/CloudStorageAdapter"));
class CloudController {
    constructor(cloudService, cloudBucketAdapter) {
        this.postPreSignedUrl = async (req, res, next) => {
            try {
                const data = {
                    directory: req.body.directory,
                    fileName: req.body.fileName,
                    action: req.body.action,
                };
                const { err, response } = await this.cloudService.generatePreSignUrl(data);
                if (err != null)
                    return next(err);
                return res.status(200).send({ data: response });
            }
            catch (err) {
                next(err);
            }
        };
        this.postUploadFile = async (req, res, next) => {
            const { response, err } = await this.cloudBucketAdapter.uploadFile(req);
            if (err)
                return next(err);
            return res.status(200).send(response);
        };
        this.getBucketFolders = async (req, res, next) => {
            // const { response, err } =
            //   await this.cloudBucketAdapter.getFileNamesFromBucket();
            // if (err) return next(err);
            const response = await this.cloudBucketAdapter.getFileNamesFromBucket(req.query.prefix);
            // if (response.length === 0) return next('err');
            if (response.length === 0)
                return next('err');
            return res.status(200).send(response);
        };
        this.postBucketFolder = async (req, res, next) => {
            const { response, err } = await this.cloudBucketAdapter.addFolderToBucket(req.body.folderName);
            if (err)
                return next(err);
            return res.status(200).send(response);
        };
        this.cloudService = cloudService;
        this.cloudBucketAdapter = cloudBucketAdapter;
    }
}
exports.default = new CloudController(CloudService_1.default, CloudStorageAdapter_1.default);
//# sourceMappingURL=CloudController.js.map