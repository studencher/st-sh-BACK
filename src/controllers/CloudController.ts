import { NextFunction, Request, Response } from 'express';
import { ICloudService } from '../studentcher-shared-utils/services/CloudService';
import cloudService from '../services/CloudService';
import { CloudBucketAdapter } from '../studentcher-shared-utils/storage/CloudBucketAdapter';
import cloudStorageAdapter from '../storage/CloudStorageAdapter';

class CloudController {
  cloudService: ICloudService;
  cloudBucketAdapter: CloudBucketAdapter;
  constructor(cloudService, cloudBucketAdapter) {
    this.cloudService = cloudService;
    this.cloudBucketAdapter = cloudBucketAdapter;
  }
   
  postPreSignedUrl = async (req: Request, res: Response, next: Function) => {
    try {
      const data = {
        directory: req.body.directory,
        fileName: req.body.fileName,
        action: req.body.action,
        duration: req.body.duration,
      };
      const { err, response } = await this.cloudService.generatePreSignUrl(
        data
      );
      if (err != null) return next(err);
      return res.status(200).send({ data: response });
    } catch (err) {
      next(err);
    }
  };

  postUploadFile = async (req: Request, res: Response, next: NextFunction) => {
    const { response, err } = await this.cloudBucketAdapter.uploadFile(req);
    if (err) return next(err);
    return res.status(200).send(response);
  };
  getBucketFolders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // const { response, err } =
    //   await this.cloudBucketAdapter.getFileNamesFromBucket();
    // if (err) return next(err);
    const response = await this.cloudBucketAdapter.getFileNamesFromBucket(
      req.query.prefix
    );
    // if (response.length === 0) return next('err');
    if (response.length === 0) return next('err');

    return res.status(200).send(response);
  };

  postBucketFolder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { response, err } = await this.cloudBucketAdapter.addFolderToBucket(
      req.body.folderName
    );
    if (err) return next(err);
    return res.status(200).send(response);
  };
}

export default new CloudController(cloudService, cloudStorageAdapter);
