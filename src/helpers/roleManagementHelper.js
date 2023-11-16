"use strict";
// const roleManagementQueries = require("./postgresQueriesHelper/roleManagement");
// const pgAdapter = require("../db/postgresAdapter");
// const ApiResponse = require("../models/ApiResponse");
// import {CustomError} from "../models/CustomError";
// const userManagementQueries = require("./postgresQueriesHelper/userManagement");
//
//
// module.exports.getRoles = async(userId)=>{
//     try{
//         const selectUsersQuery = userManagementQueries.getSelectRolesDataQuery();
//         const selectUsersValues = [userId];
//         const response = await pgAdapter.callDbCmdPromise(selectUsersQuery, selectUsersValues);
//         const roles = response.rows;
//         return { response: new ApiResponse(true, {roles}) }
//
//     }catch(err){
//         return {err};
//     }
// }
//
// module.exports.setRoles = async(data)=>{
//     try{
//         const insertActivityValues = [data.roleId, data.name];
//
//         const upsertRoleQuery = roleManagementQueries.getUpsertRoleQuery();
//         const upsertRoleQueriesBucket = [];
//         const upsertRoleValuesBucket = [];
//         const insertVideoValuesBucket = [];
//         data.roles.forEach((video, index)=>{
//             upsertRoleQueriesBucket.push(upsertRoleQuery);
//             upsertRoleValuesBucket.push([activityId, index + 1, video.title, video.srcUrl]);
//         })
//         const sqlQueries = [insertActivityQuery, ...insertVideoQueriesBucket];
//         const sqlValues = [insertActivityValues, ...insertVideoValuesBucket];
//
//         const response = await pgAdapter.callDbTransactionCmd(sqlQueries, sqlValues);
//         const activity = response[0].rows[0];
//         for(let i = 1; i < sqlQueries.length; i++)
//             activity.videos.push(response[i].rows[0]);
//         return { response: new ApiResponse(true, {activity}) }
//
//     }catch(err){
//         switch (err.constraint){
//             case "activities_name_key":
//                 return {err: new CustomError("Name already taken and must be unique")}
//             case "activities_created_by_fkey":
//                 return {err: new CustomError("User id is invalid")}
//             default:
//                 return {err};
//         }
//     }
// }
//
// module.exports.editActivity = async(data)=>{
//     try{
//         if(data.activityId == null)
//             return {err: new CustomError("Activity's id must be provided")};
//
//         const updateActivityQuery = activityManagementQueries.getUpdateActivityQuery();
//         const updateActivityValues = [data.activityId, data.ownerId, data.name, data.srcUrl, data.maxThresholdInDays, data.responsibleRoleId];
//
//         const deleteActivityVideosQuery = activityManagementQueries.getDeleteActivityVideosQuery();
//         const deleteActivityVideosValues = [data.activityId];
//         const insertVideoQuery = activityManagementQueries.getInsertVideoQuery();
//
//         const insertVideoQueriesBucket = [];
//         const insertVideoValuesBucket = [];
//         data.videos.forEach((video, index)=>{
//             insertVideoQueriesBucket.push(insertVideoQuery);
//             insertVideoValuesBucket.push([data.activityId, index + 1, video.title, video.srcUrl]);
//         })
//         const sqlQueries = [updateActivityQuery,  deleteActivityVideosQuery, ...insertVideoQueriesBucket];
//         const sqlValues = [ updateActivityValues, deleteActivityVideosValues, ...insertVideoValuesBucket];
//
//         const response = await pgAdapter.callDbTransactionCmd(sqlQueries, sqlValues);
//         const activity = response[0].rows[0];
//         for(let i = 2; i < sqlQueries.length; i++)
//             activity.videos.push(response[i].rows[0]);
//         return { response: new ApiResponse(true, {activity}) }
//
//     }catch(err){
//         if(err.constraint === "activities_name_key")
//             return {err: new CustomError("Name already taken and must be unique")}
//         return {err};
//     }
// }
//
// module.exports.deleteActivities = async(data)=>{
//     try{
//         if(data.activityIds.length === 0 )
//             return {err: new CustomError("Activities' ids must be provided") };
//         const deleteActivitiesQuery = activityManagementQueries.getDeleteActivitiesQuery();
//         const deleteActivitiesValues = [data.activityIds];
//         const response = await pgAdapter.callDbCmdPromise(deleteActivitiesQuery, deleteActivitiesValues);
//         if(response.rowCount === 0 )
//             return {err: new CustomError("Activities not found", 404) };
//
//         return { response: new ApiResponse(true, {activity: response.rows}) }
//     }catch (err){
//         return {err}
//     }
// }
