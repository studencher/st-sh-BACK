"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoLengthtoDb = exports.fixIsVideoFinished = exports.combineDataWithAuxillaryData = void 0;
const pg_1 = __importDefault(require("pg"));
function combineDataWithAuxillaryData(allVideos, privateZoneDataAuxillary) {
    const updatedVideos = [];
    for (const video of allVideos) {
        const matchingVideo = privateZoneDataAuxillary.find((privateVideo) => privateVideo.title === video.title);
        if (matchingVideo) {
            updatedVideos.push(Object.assign(Object.assign({}, video), { fileName: matchingVideo.src_url }));
        }
        else {
            updatedVideos.push(video);
        }
    }
    return updatedVideos;
}
exports.combineDataWithAuxillaryData = combineDataWithAuxillaryData;
function fixIsVideoFinished(updatedVideos, isVideoCompleted, privateZoneData) {
    let numOfFinishedVideosInCurrentActivity = parseInt(isVideoCompleted[0].count);
    let numOfVideosInCurrentActivity = privateZoneData.currentActivity.videos.length;
    if (numOfFinishedVideosInCurrentActivity >= numOfVideosInCurrentActivity) {
        updatedVideos.map((video) => video.isCompleted = true);
    }
    return updatedVideos;
}
exports.fixIsVideoFinished = fixIsVideoFinished;
async function videoLengthtoDb(CloudService, fileName, duration) {
    const config = {
        user: 'postgres',
        password: '31415',
        database: 'postgres',
        host: 'localhost',
        port: 5432, // Default PostgreSQL port
    };
    const pgclient = new pg_1.default.Client(config);
    pgclient.connect();
    let query = 'insert into eachVideoParameters(id,name,duration)  values($1,$2,$3 ) on conflict (name) do nothing';
    let videoid = CloudService.idGenerator();
    let values = [videoid, fileName, duration];
    let result = await pgclient.query(query, values);
    pgclient.end();
}
exports.videoLengthtoDb = videoLengthtoDb;
//# sourceMappingURL=UsersFunctions.js.map