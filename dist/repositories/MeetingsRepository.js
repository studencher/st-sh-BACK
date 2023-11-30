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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingsRepository = void 0;
const studentcher_shared_utils_1 = require("../studentcher-shared-utils");
const queries = __importStar(require("../helpers/postgresQueriesHelper/meetingsManagement"));
const postgresAdapter_1 = __importDefault(require("../storage/postgresAdapter"));
class MeetingsRepository extends studentcher_shared_utils_1.EntityRepository {
    constructor(pgClient) {
        super();
        this.dbClient = pgClient;
    }
    async find(_data) {
        const selectMeetingsQuery = queries.getMeetingsQuery();
        const selectMeetingsValues = [];
        const response = await this.dbClient.callDbCmd(selectMeetingsQuery, selectMeetingsValues);
        return response.rows;
    }
    async findUserMeetings(data) {
        const selectUserMeetingsQuery = queries.getSelectUserMeetingsQueries();
        const selectUserMeetingsValues = [data.meetingIds, data.userIds, data.isNoteProvided, data.isRateProvided];
        const response = await this.dbClient.callDbCmd(selectUserMeetingsQuery, selectUserMeetingsValues);
        return response.rows;
    }
    async editUserMeetings(data) {
        const updateUserMeetingQueriesBucket = [];
        const updateUserMeetingValuesBucket = [];
        const updateUserMeetingQuery = queries.getUpdateUserMeetingQuery();
        data.meetings.forEach((meeting) => {
            updateUserMeetingQueriesBucket.push(updateUserMeetingQuery);
            const updateUserMeetingValues = [data.userId, meeting.id, meeting.note, meeting.rate];
            updateUserMeetingValuesBucket.push(updateUserMeetingValues);
        });
        const response = await this.dbClient.callDbTransaction(updateUserMeetingQueriesBucket, updateUserMeetingValuesBucket);
        const userMeetings = [];
        for (let i = 0; i < updateUserMeetingValuesBucket.length; i++)
            userMeetings.push(response[i].rows[0]);
        return userMeetings;
    }
    async insertOne(data) {
        const insertMeetingQuery = queries.getInsertMeetingQuery();
        const insertMeetingValues = [data.id, data.committedUserId, data.channelId];
        const insertUserMeetingQueriesBucket = [];
        const insertUserMeetingValuesBucket = [];
        const insertUserMeetingQuery = queries.getInsertUserMeetingQueries();
        // data.userIds is array of user id's: ['whiteWhale@hyperactive.co.il', 'dimitriy@hyperactive.co.il']
        data.userIds.forEach((userId) => {
            insertUserMeetingQueriesBucket.push(insertUserMeetingQuery);
            const insertUserMeetingValues = [userId, data.id];
            insertUserMeetingValuesBucket.push(insertUserMeetingValues);
        });
        const sqlQueries = [insertMeetingQuery, ...insertUserMeetingQueriesBucket]; // 3 queries, 1 into meetings ( the actual creation of meeting ),
        // and 2 queries for each user that insert them into that meeting
        //"insert into user_meetings (user_id, meeting_id) VALUES ($1, $2)"
        // 
        const sqlValues = [insertMeetingValues, ...insertUserMeetingValuesBucket]; // 
        const response = await this.dbClient.callDbTransaction(sqlQueries, sqlValues);
        return response[0].rows[0];
    }
    async editOne(data) {
        const updateMeetingQuery = queries.getUpdateMeetingQuery();
        const updateMeetingValues = [data.id, data.committedUserId, data.discordChannelId, data.endedAt];
        const response = await this.dbClient.callDbCmd(updateMeetingQuery, updateMeetingValues);
        return response.rows[0];
    }
    async findMeetingIdForSupervisorEntering(data) {
        //data.channel, data.supervisorId, data.loggedUsers[0].id, data.loggedUsers[1].id
        const query = `SELECT meeting_id FROM user_meetings WHERE user_id IN ($1, $2) ORDER BY created_at DESC LIMIT 1;`;
        const values = [data.loggedUsers[0].id, data.loggedUsers[1].id];
        const meeting_id = await this.dbClient.callDbCmd(query, values);
        return meeting_id;
    }
}
exports.MeetingsRepository = MeetingsRepository;
exports.default = new MeetingsRepository(postgresAdapter_1.default);
//# sourceMappingURL=MeetingsRepository.js.map