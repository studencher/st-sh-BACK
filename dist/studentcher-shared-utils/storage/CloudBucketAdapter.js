"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudBucketAdapter = exports.ChonkyIconName = void 0;
const AWS = __importStar(require("aws-sdk"));
const crypto = __importStar(require("crypto"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const Constants_1 = require("../helpers/Constants");
const ApiResponse_1 = require("../models/ApiResponse");
const stream_1 = require("stream");
const iv = Buffer.alloc(16, 0);
const process = __importStar(require("process"));
var ChonkyIconName;
(function (ChonkyIconName) {
    // Misc
    ChonkyIconName["loading"] = "loading";
    ChonkyIconName["dropdown"] = "dropdown";
    ChonkyIconName["placeholder"] = "placeholder";
    // File Actions: Drag & drop
    ChonkyIconName["dndDragging"] = "dndDragging";
    ChonkyIconName["dndCanDrop"] = "dndCanDrop";
    ChonkyIconName["dndCannotDrop"] = "dndCannotDrop";
    // File Actions: File operations
    ChonkyIconName["openFiles"] = "openFiles";
    ChonkyIconName["openParentFolder"] = "openParentFolder";
    ChonkyIconName["copy"] = "copy";
    ChonkyIconName["paste"] = "paste";
    ChonkyIconName["share"] = "share";
    ChonkyIconName["search"] = "search";
    ChonkyIconName["selectAllFiles"] = "selectAllFiles";
    ChonkyIconName["clearSelection"] = "clearSelection";
    // File Actions: Sorting & options
    ChonkyIconName["sortAsc"] = "sortAsc";
    ChonkyIconName["sortDesc"] = "sortDesc";
    ChonkyIconName["toggleOn"] = "toggleOn";
    ChonkyIconName["toggleOff"] = "toggleOff";
    // File Actions: File Views
    ChonkyIconName["list"] = "list";
    ChonkyIconName["compact"] = "compact";
    ChonkyIconName["smallThumbnail"] = "smallThumbnail";
    ChonkyIconName["largeThumbnail"] = "largeThumbnail";
    // File Actions: Unsorted
    ChonkyIconName["folder"] = "folder";
    ChonkyIconName["folderCreate"] = "folderCreate";
    ChonkyIconName["folderOpen"] = "folderOpen";
    ChonkyIconName["folderChainSeparator"] = "folderChainSeparator";
    ChonkyIconName["download"] = "download";
    ChonkyIconName["upload"] = "upload";
    ChonkyIconName["trash"] = "trash";
    ChonkyIconName["fallbackIcon"] = "fallbackIcon";
    // File modifiers
    ChonkyIconName["symlink"] = "symlink";
    ChonkyIconName["hidden"] = "hidden";
    // Generic file types
    ChonkyIconName["file"] = "file";
    ChonkyIconName["license"] = "license";
    ChonkyIconName["code"] = "code";
    ChonkyIconName["config"] = "config";
    ChonkyIconName["model"] = "model";
    ChonkyIconName["database"] = "database";
    ChonkyIconName["text"] = "text";
    ChonkyIconName["archive"] = "archive";
    ChonkyIconName["image"] = "image";
    ChonkyIconName["video"] = "video";
    ChonkyIconName["info"] = "info";
    ChonkyIconName["key"] = "key";
    ChonkyIconName["lock"] = "lock";
    ChonkyIconName["music"] = "music";
    ChonkyIconName["terminal"] = "terminal";
    ChonkyIconName["users"] = "users";
    // OS file types
    ChonkyIconName["linux"] = "linux";
    ChonkyIconName["ubuntu"] = "ubuntu";
    ChonkyIconName["windows"] = "windows";
    // Programming language file types
    ChonkyIconName["rust"] = "rust";
    ChonkyIconName["python"] = "python";
    ChonkyIconName["nodejs"] = "nodejs";
    ChonkyIconName["php"] = "php";
    // Development tools file types
    ChonkyIconName["git"] = "git";
    // Brands file types
    ChonkyIconName["adobe"] = "adobe";
    // Other program file types
    ChonkyIconName["pdf"] = "pdf";
    ChonkyIconName["excel"] = "excel";
    ChonkyIconName["word"] = "word";
    ChonkyIconName["flash"] = "flash";
})(ChonkyIconName = exports.ChonkyIconName || (exports.ChonkyIconName = {}));
const getEncryptionKey = () => {
    const encryptionKey = process.env.ENCRYPTION_KEY_SECRET;
    if (encryptionKey == null)
        throw new Error('ENCRYPTION_KEY_SECRET is not provided');
    let result = Buffer.from(encryptionKey, 'base64');
    if (result.length !== 32) {
        const padding = Buffer.alloc(32 - result.length, 0);
        result = Buffer.concat([result, padding]);
    }
    return result;
};
function getCipher() {
    const encryptionKey = getEncryptionKey();
    const algorithm = 'aes-256-cbc';
    const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
    return cipher;
}
const bucketName = process.env.CLOUD_BUCKET_NAME || '';
const accessKeyId = process.env.CLOUD_BUCKET_ACCESS_KEY || '';
const secretAccessKey = process.env.CLOUD_BUCKET_ACCESS_SECRET || '';
const region = process.env.CLOUD_BUCKET_REGION;
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    region,
});
const s3v2 = new AWS.S3({
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});
class CloudBucketAdapter {
    constructor() {
        this.s3Client = s3;
        this.s3ClientV2 = s3v2;
    }
    async generateUploadId(fileObj) {
        const createUploadResponse = await this.s3Client.send(new client_s3_1.CreateMultipartUploadCommand({
            Key: fileObj.filename,
            Bucket: bucketName,
            ContentType: fileObj.contentType,
        }));
        return createUploadResponse.UploadId;
    }
    async uploadPartialFile(fileObj, retry = 1) {
        try {
            const params = {
                Key: fileObj.filename,
                Bucket: bucketName,
                Body: fileObj.body,
                UploadId: fileObj.uploadId,
                PartNumber: fileObj.uploadIndex,
            };
            const command = new client_s3_1.UploadPartCommand(params);
            return await this.s3Client.send(command);
        }
        catch (err) {
            if (retry < 5)
                return await this.uploadPartialFile(fileObj, ++retry);
            throw err;
        }
    }
    async getSignedUrl(fileName, action = 'READ') {
        const VALID_DURATION_IN_SEC = 600;
        if (action === Constants_1.Constants.CLOUD_STORAGE_PRE_SIGNED_URL_READ_ACTION)
            return await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, new client_s3_1.GetObjectCommand({
                Bucket: bucketName,
                Key: fileName,
            }), { expiresIn: VALID_DURATION_IN_SEC });
        if (action === Constants_1.Constants.CLOUD_STORAGE_PRE_SIGNED_URL_WRITE_ACTION)
            return await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, new client_s3_1.PutObjectCommand({
                Bucket: bucketName,
                Key: fileName,
            }), { expiresIn: VALID_DURATION_IN_SEC });
        throw new Error('Invalid action provided.');
    }
    // TODO - test it. due to lack of network connections I was not able to test it propperly.
    async uploadFile(req) {
        const passThrough = new stream_1.PassThrough();
        const params = {
            Bucket: bucketName,
            Key: 'test200MB.zip',
            Body: passThrough,
            ContentEncoding: 'base64',
        };
        req.pipe(CloudBucketAdapter.cipher).pipe(passThrough);
        const upload = this.s3ClientV2.upload(params);
        upload.on('httpUploadProgress', (progress) => {
            // Log progress events
            console.log(`Upload progress: ${progress.loaded}/${progress.total}`);
        });
        try {
            const data = await new Promise((resolve, reject) => {
                upload.send((err, data) => {
                    if (err)
                        reject(err);
                    else
                        resolve(data);
                });
            });
            // Upload succeeded
            console.log(`File successfully uploaded to ${data.Location}`);
            return { response: new ApiResponse_1.ApiResponse(true, {}) };
        }
        catch (err) {
            return { err };
        }
    }
    async checkIfFileExists(fileName) {
        const params = {
            Bucket: bucketName,
            Key: `${fileName}`,
        };
        try {
            const res = await this.s3ClientV2.headObject(params).promise();
            return res != null;
        }
        catch (error) {
            if (['Forbidden', 'NotFound'].includes(error.code)) {
                return false;
            }
            throw error;
        }
    }
    // async  checkIfFilesExist(fileNamesList: string[]): Promise<void> {
    //     const params: AWS.S3.Types.HeadObjectRequest[] = fileNamesList.map((fileName) => ({
    //         Bucket: bucketName,
    //         Key: fileName,
    //     }));
    //     const responses = await Promise.all(
    //         params.map((param) => s3v2.headObject(param).promise())
    //     );
    //
    //     const allFilesExist = responses.every((res) => res != null);
    //
    //     if (!allFilesExist) {
    //         const missingFiles = fileNamesList.filter((fileName, index) => responses[index] == null);
    //         throw new CustomError(`The following files do not exist in S3: ${missingFiles.join(', ')}`);
    //     }
    // }
    static getBucketBillingParams(startDate, endDate) {
        return {
            Granularity: 'MONTHLY',
            Metrics: ['UnblendedCost'],
            TimePeriod: {
                Start: startDate.toISOString().slice(0, 10),
                End: endDate.toISOString().slice(0, 10),
            },
            Filter: {
                And: [
                    {
                        Dimensions: {
                            Key: 'USAGE_TYPE',
                            Values: ['S3 Object Transition-Infrequent Access'],
                        },
                    },
                    {
                        Dimensions: {
                            Key: 'SERVICE',
                            Values: ['Amazon Simple Storage Service'],
                        },
                    },
                    {
                        Dimensions: {
                            Key: 'LINKED_ACCOUNT',
                            Values: [process.env.CLOUD_AWS_ACCOUNT_ID],
                        },
                    },
                ],
            },
            GroupBy: [
                {
                    Type: 'DIMENSION',
                    Key: 'USAGE_TYPE',
                },
            ],
        };
    }
    async getBucketBilling(regionName) {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const params = CloudBucketAdapter.getBucketBillingParams(start, end);
        const costExplorer = new AWS.CostExplorer({
            region: regionName,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
        const response = await costExplorer.getCostAndUsage(params).promise();
        const cost = response.ResultsByTime[0].Total.UnblendedCost.Amount;
        return Number(cost);
    }
    async getFileNamesFromBucketByPrefix(prefix) {
        const objects = await this.s3ClientV2
            .listObjectsV2({
            Bucket: bucketName,
            Prefix: prefix + '/',
        })
            .promise();
        return objects.Contents.map(({ Key }) => Key);
    }
    //   async getFileNamesFromBucket(): Promise<ServiceResponse> {
    //     try {
    //       const objects = await this.s3ClientV2
    //         .listObjectsV2({
    //           Bucket: bucketName,
    //         })
    //         .promise();
    //       return {
    //         response: new ApiResponse(
    //           true,
    //           objects.Contents.map(({ Key }) => Key)
    //         ),
    //       };
    //     } catch (err) {
    //       return { err };
    //     }
    //   }
    async getFileNamesFromBucket(prefix) {
        //FileArray
        console.log('prefix', prefix);
        const objects = await this.s3ClientV2
            .listObjectsV2({
            Bucket: bucketName,
            Prefix: prefix,
        })
            .promise();
        const objArr = objects.Contents.map(({ Key }) => 'bucket/' + Key);
        // objArr.push('/');
        console.log('objArr: ', objArr);
        return objArr;
        // return await this.s3ClientV2
        //   .listObjectsV2({
        //     Bucket: bucketName,
        //     Delimiter: '/',
        //     Prefix: prefix !== '/' ? prefix : '',
        //   })
        //   .promise()
        //   .then((response) => {
        //     const chonkyFiles: FileArray = [];
        //     const s3Objects = response.Contents;
        //     const s3Prefixes = response.CommonPrefixes;
        //     if (s3Objects) {
        //       chonkyFiles.push(
        //         ...s3Objects.map(
        //           (object): FileData => ({
        //             id: object.Key!,
        //             name: path.basename(object.Key!),
        //             modDate: object.LastModified,
        //             size: object.Size,
        //           })
        //         )
        //       );
        //     }
        //     if (s3Prefixes) {
        //       chonkyFiles.push(
        //         ...s3Prefixes.map(
        //           (prefix): FileData => ({
        //             id: prefix.Prefix!,
        //             name: path.basename(prefix.Prefix!),
        //             isDir: true,
        //           })
        //         )
        //       );
        //     }
        //     return chonkyFiles;
        //   });
    }
    async addFolderToBucket(folderName) {
        const params = {
            Bucket: bucketName,
            Key: `${folderName}/`,
            Body: '',
        };
        try {
            await this.s3ClientV2.upload(params).promise();
            console.log(`Folder "${folderName}" created successfully in bucket "${bucketName}".`);
            return { response: new ApiResponse_1.ApiResponse(true, {}) };
        }
        catch (err) {
            console.error('Error creating folder:', err.message);
            return { err };
        }
    }
}
exports.CloudBucketAdapter = CloudBucketAdapter;
CloudBucketAdapter.cipher = getCipher();
// async getFileNamesFromBucket(): Promise<string[]> {
//     const folderNames = new Set();
//     const objects = await this.s3ClientV2
//       .listObjectsV2({
//         Bucket: bucketName,
//       })
//       .promise();
//     for (const object of objects.Contents) {
//       const key = object.Key;
//       const folderName = key.split('/')[0]; // Assuming folders are separated by '/'
//       if (folderName) {
//         folderNames.add(folderName);
//       }
//     }
//     return folderNames;
//   }
//# sourceMappingURL=CloudBucketAdapter.js.map