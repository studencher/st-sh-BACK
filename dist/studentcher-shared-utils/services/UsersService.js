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
exports.UsersService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const UsersFunctions_1 = require("../functions/UsersFunctions");
const CustomError_1 = require("../models/CustomError");
const ApiResponse_1 = require("../models/ApiResponse");
const Validations_1 = require("../helpers/Validations");
const Constants_1 = require("../helpers/Constants");
class UsersService {
    constructor(userRepository, rolesRepository, cloudService) {
        this.userRepository = userRepository;
        this.rolesRepository = rolesRepository;
        this.cloudService = cloudService;
    }
    static validateUserFields(data) {
        if (data.id == null)
            throw new CustomError_1.CustomError("User's id must be provided.");
        if (data.password != null) {
            const { result, message } = Validations_1.Validations.isPasswordValid(data.password);
            if (!result)
                throw new CustomError_1.CustomError(message);
        }
        if (data.phoneNumber != null) {
            const { result, message } = Validations_1.Validations.isPhoneNumberValid(data.phoneNumber);
            if (!result)
                throw new CustomError_1.CustomError(message);
        }
    }
    async getUsers(data) {
        try {
            const users = await this.userRepository.findMany(data);
            const roles = await this.rolesRepository.findMany(data);
            return { response: new ApiResponse_1.ApiResponse(true, { users, roles }) };
        }
        catch (err) {
            return { err };
        }
    }
    async getUser(data) {
        try {
            const user = await this.userRepository.findOne(data);
            return { response: new ApiResponse_1.ApiResponse(true, Object.assign({}, user)) };
        }
        catch (err) {
            return { err };
        }
    }
    async addUser(data) {
        try {
            const { result, message } = Validations_1.Validations.areFieldsProvided(['password', 'name', 'roleId', 'discordUserId'], data);
            if (!result)
                return { err: new CustomError_1.CustomError(message) };
            UsersService.validateUserFields(data);
            data.hashedPassword = await UsersService.encryptionHandler.hash(data.password, 12);
            const user = await this.userRepository.addOne(data);
            return { response: new ApiResponse_1.ApiResponse(true, { user }) };
        }
        catch (err) {
            if (err.constraint === 'users_pkey')
                return {
                    err: new CustomError_1.CustomError('Email already registered in the system.'),
                };
            return { err };
        }
    }
    async editUser(data) {
        try {
            if (data.id == null)
                return { err: new CustomError_1.CustomError("User's id must be provided.") };
            UsersService.validateUserFields(data);
            if (data.password != null)
                data.hashedPassword = await UsersService.encryptionHandler.hash(data.password, 12);
            const user = await this.userRepository.editOne(data);
            return { response: new ApiResponse_1.ApiResponse(true, { user }) };
        }
        catch (err) {
            return { err };
        }
    }
    async deleteUsers(data) {
        try {
            if (data.userIds.length === 0)
                return { err: new CustomError_1.CustomError("Users' ids must be provided") };
            if (data.userIds.includes(data.id))
                return { err: new CustomError_1.CustomError('User cannot delete itself') };
            const users = await this.userRepository.deleteMany(data);
            return { response: new ApiResponse_1.ApiResponse(true, { users }) };
        }
        catch (err) {
            return { err };
        }
    }
    async getPersonalZone(data) {
        var _a;
        try {
            let privateZoneData = await this.userRepository.getPrivateZone(data); // get all the data
            privateZoneData.allActivities.sort((a, b) => a.index - b.index); // order the activities 1,2,3...
            // privateZoneData = await this.userRepository.fixTheCurrentActivity(privateZoneData)     // get the real current activity
            let currentActivityIndex = privateZoneData.currentActivity.index - 1;
            let _ = privateZoneData.allActivities.find((activity) => activity.index == privateZoneData.currentActivity.index);
            const allVideos = _.videos;
            const privateZoneDataAuxillary = await this.userRepository.getPrivateZoneAuxillary(privateZoneData.currentActivity.activityId); // get the the src_url of each video
            let updatedVideos = (0, UsersFunctions_1.combineDataWithAuxillaryData)(allVideos, privateZoneDataAuxillary); // update the src url in the videos
            let currentActivityId = privateZoneData.currentActivity.activityId;
            let userId = privateZoneData.userId;
            let isVideoCompleted = await this.userRepository.getIsVideoCompleted(currentActivityId, userId); // get the isVideoCompleted
            updatedVideos = (0, UsersFunctions_1.fixIsVideoFinished)(updatedVideos, isVideoCompleted, privateZoneData); // update all videos in current activity iscompleted true
            updatedVideos = await this.userRepository.getVideoLength(updatedVideos);
            updatedVideos = updatedVideos.sort((a, b) => a.title - b.title); // to order the videos accordingly to the name (1,2,3,4....12,13,14...)
            privateZoneData.allActivities[currentActivityIndex].videos = updatedVideos;
            privateZoneData.currentActivity.videos = updatedVideos;
            const totalActivities = ((_a = privateZoneData === null || privateZoneData === void 0 ? void 0 : privateZoneData.allActivities) === null || _a === void 0 ? void 0 : _a.length) || 0;
            for (let activityIndex = 0; activityIndex < totalActivities; activityIndex++) {
                const totalVideos = (privateZoneData === null || privateZoneData === void 0 ? void 0 : privateZoneData.allActivities[activityIndex].videos.length) || 0;
                const signedVideos = [];
                for (let i = 0; i < totalVideos; i++) {
                    const videoData = privateZoneData.allActivities[activityIndex].videos[i];
                    const { response, err } = await this.cloudService.generatePreSignUrl({
                        fileName: videoData.fileName,
                        action: Constants_1.Constants.CLOUD_STORAGE_PRE_SIGNED_URL_READ_ACTION,
                    });
                    if (err != null)
                        return { err };
                    delete videoData.fileName;
                    signedVideos.push(Object.assign(Object.assign({}, videoData), { srcUrl: response.data.preSignedUrl }));
                }
                privateZoneData.allActivities[activityIndex] = Object.assign(Object.assign({}, privateZoneData.allActivities[activityIndex]), { videos: signedVideos });
            }
            return {
                response: new ApiResponse_1.ApiResponse(true, { privateZone: privateZoneData }),
            };
        }
        catch (err) {
            return { err };
        }
    }
    async addUserActivity(data) {
        try {
            const { result, message } = Validations_1.Validations.areFieldsProvided(['userId', 'planId', 'activityId'], data);
            if (!result)
                return { err: new CustomError_1.CustomError(message) };
            await this.userRepository.addUserActivity(data);
            return { response: new ApiResponse_1.ApiResponse(true, {}) };
        }
        catch (err) {
            if (err.constraint === 'user_activity_history_pkey')
                return {
                    err: new CustomError_1.CustomError('(user_id, plan_id, activity_id) already monitored in the system'),
                };
            return { err };
        }
    }
    async addUserActivityVideoStatus(data) {
        try {
            const { result, message } = Validations_1.Validations.areFieldsProvided(['userId', 'planId', 'activityId', 'videoIndex'], data);
            if (!result)
                return { err: new CustomError_1.CustomError(message) };
            const userActivityVideoStatus = await this.userRepository.addUserActivityVideo(data);
            return { response: new ApiResponse_1.ApiResponse(true, { userActivityVideoStatus }) };
        }
        catch (err) {
            if (err.constraint === 'user_activity_history_pkey')
                return {
                    err: new CustomError_1.CustomError('(user_id, plan_id, activity_id) already monitored in the system'),
                };
            return { err };
        }
    }
    getUsersEventsByUsersMetaDataList(userActivityMetaDataList) {
        const eventsByUserActivity = {};
        for (const activityMetaData of userActivityMetaDataList) {
            const { userId, planId, activityId, metaData, timestamp, videoIndex } = activityMetaData;
            if (metaData.type === 'play' || metaData.type === 'pause') {
                const key = `${userId}-${planId}-${activityId}-${videoIndex}`;
                if (!eventsByUserActivity[key]) {
                    eventsByUserActivity[key] = [];
                }
                eventsByUserActivity[key].push({
                    type: metaData.type,
                    timestamp,
                });
            }
        }
        return eventsByUserActivity;
    }
    analyzeAndExtractUsersEvents(usersEventsIndex) {
        const usersUsageIndex = {};
        let allUsersTotalDuration = 0;
        let allUsersEventsCounter = 0;
        for (const key of Object.keys(usersEventsIndex)) {
            const events = usersEventsIndex[key];
            const [userId, _planId, _activityId, _videoIndex] = key.split('-');
            let userEventsCounter = 0;
            let userPlayDuration = 0;
            for (let i = 0; i < events.length - 1; i++) {
                userEventsCounter++;
                if (events[i].type === 'play' && events[i + 1].type === 'pause') {
                    const duration = events[i + 1].timestamp - events[i].timestamp;
                    userPlayDuration += duration;
                }
            }
            if (usersUsageIndex[userId] == null)
                usersUsageIndex[userId] = {
                    userPlayDuration: 0,
                    userEventsNum: 0,
                };
            usersUsageIndex[userId].userPlayDuration += userPlayDuration;
            usersUsageIndex[userId].userEventsNum += userEventsCounter;
            allUsersTotalDuration += userPlayDuration;
            allUsersEventsCounter += userEventsCounter;
        }
        return { usersUsageIndex, allUsersTotalDuration, allUsersEventsCounter };
    }
    getCalculatedUsersUsage(usersEventsIndex) {
        const userUsages = [];
        const { usersUsageIndex, allUsersTotalDuration, allUsersEventsCounter } = this.analyzeAndExtractUsersEvents(usersEventsIndex);
        for (const userId in usersUsageIndex) {
            const { userPlayDuration, userEventsNum } = usersUsageIndex[userId];
            const playPercentage = allUsersTotalDuration
                ? userPlayDuration / allUsersTotalDuration
                : 0;
            const userUsage = {
                userId,
                playPercentage,
                eventsPercentage: userEventsNum / allUsersEventsCounter,
            };
            userUsages.push(userUsage);
        }
        return userUsages;
    }
    async getUsersCloudUsage() {
        try {
            const userActivityMetaDataList = await this.userRepository.finDUsersMetaData();
            const usersEventsIndex = this.getUsersEventsByUsersMetaDataList(userActivityMetaDataList);
            const userCloudUsages = this.getCalculatedUsersUsage(usersEventsIndex);
            const billing = await this.cloudService.getBucketBilling();
            return { response: new ApiResponse_1.ApiResponse(true, { userCloudUsages, billing }) };
        }
        catch (err) {
            return { err };
        }
    }
}
exports.UsersService = UsersService;
UsersService.encryptionHandler = bcrypt;
//# sourceMappingURL=UsersService.js.map