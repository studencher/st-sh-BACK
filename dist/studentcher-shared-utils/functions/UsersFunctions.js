"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixIsVideoFinished = exports.combineDataWithAuxillaryData = void 0;
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
//# sourceMappingURL=UsersFunctions.js.map