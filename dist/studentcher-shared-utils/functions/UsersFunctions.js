"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoLengthtoDb = exports.fixIsVideoFinished = exports.combineDataWithAuxillaryData = void 0;
const { Pool } = require('pg');
// Create a connection pool with the specified configuration
const pool = new Pool({
    user: 'postgres',
    password: '31415',
    database: 'postgres',
    host: 'localhost',
    port: 5432,
});
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
    else {
        updatedVideos.map((video) => video.isCompleted = false);
    }
    return updatedVideos;
}
exports.fixIsVideoFinished = fixIsVideoFinished;
async function videoLengthtoDb(CloudService, fileName, duration) {
    const pgclient = await pool.connect();
    try {
        let query = 'insert into eachVideoParameters(id,name,duration)  values($1,$2,$3 ) on conflict (name) do nothing';
        let videoid = CloudService.idGenerator();
        let values = [videoid, fileName, duration];
        let result = await pgclient.query(query, values);
    }
    catch (error) {
        console.log(error);
    }
    finally {
        pgclient.release();
    }
}
exports.videoLengthtoDb = videoLengthtoDb;
//# sourceMappingURL=UsersFunctions.js.map