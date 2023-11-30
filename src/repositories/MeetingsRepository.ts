import {EntityRepository, IClientRequestData} from "../studentcher-shared-utils";
import * as queries from "../helpers/postgresQueriesHelper/meetingsManagement";
import {PostgresAdapter} from "../studentcher-shared-utils/storage/PostgresAdapter";
import {IMeeting, IUserMeeting} from "../studentcher-shared-utils/entities/meeting"
import pgClient from "../storage/postgresAdapter";

export class MeetingsRepository extends EntityRepository{
    private dbClient : PostgresAdapter;
    constructor(pgClient) {
        super();
        this.dbClient = pgClient;
    }

    async find(_data: IClientRequestData): Promise<IMeeting[]>{
        const selectMeetingsQuery: string = queries.getMeetingsQuery();
        const selectMeetingsValues: any = [];
        const response = await this.dbClient.callDbCmd(selectMeetingsQuery, selectMeetingsValues);

        return response.rows;
    }
    async findUserMeetings(data: IClientRequestData): Promise<IUserMeeting[]>{
        const selectUserMeetingsQuery = queries.getSelectUserMeetingsQueries();
        const selectUserMeetingsValues = [data.meetingIds, data.userIds, data.isNoteProvided, data.isRateProvided]
        const response = await this.dbClient.callDbCmd(selectUserMeetingsQuery, selectUserMeetingsValues);
        return response.rows as IUserMeeting[];
    }

    async editUserMeetings(data: IClientRequestData): Promise<IUserMeeting[]>{
        const updateUserMeetingQueriesBucket = [];
        const updateUserMeetingValuesBucket = [];
        const updateUserMeetingQuery = queries.getUpdateUserMeetingQuery();
        data.meetings.forEach((meeting)=>{
            updateUserMeetingQueriesBucket.push(updateUserMeetingQuery);
            const updateUserMeetingValues = [data.userId, meeting.id, meeting.note, meeting.rate];
            updateUserMeetingValuesBucket.push(updateUserMeetingValues);
        })
        const response = await this.dbClient.callDbTransaction(updateUserMeetingQueriesBucket, updateUserMeetingValuesBucket);
        const userMeetings: IUserMeeting[] = [];
        for(let i=0; i < updateUserMeetingValuesBucket.length; i++)
            userMeetings.push(response[i].rows[0]);

        return userMeetings;
    }
    async insertOne(data: IClientRequestData) :Promise<IMeeting>{
        const insertMeetingQuery: string = queries.getInsertMeetingQuery();
        const insertMeetingValues: any = [data.id, data.committedUserId, data.channelId];
        const insertUserMeetingQueriesBucket = [];
        const insertUserMeetingValuesBucket = [];
        const insertUserMeetingQuery = queries.getInsertUserMeetingQueries();

        // data.userIds is array of user id's: ['whiteWhale@hyperactive.co.il', 'dimitriy@hyperactive.co.il']

        data.userIds.forEach((userId)=>{
            insertUserMeetingQueriesBucket.push(insertUserMeetingQuery);
            const insertUserMeetingValues = [userId, data.id];
            insertUserMeetingValuesBucket.push(insertUserMeetingValues);
        })
        const sqlQueries = [insertMeetingQuery, ...insertUserMeetingQueriesBucket]; // 3 queries, 1 into meetings ( the actual creation of meeting ),
                                                                                    // and 2 queries for each user that insert them into that meeting
                                                                                    //"insert into user_meetings (user_id, meeting_id) VALUES ($1, $2)"
                                                                                    // 
        const sqlValues = [insertMeetingValues, ...insertUserMeetingValuesBucket] // 
        const response: any = await this.dbClient.callDbTransaction(sqlQueries, sqlValues);
        return response[0].rows[0] as IMeeting;
    }

    async editOne(data: IClientRequestData) : Promise<IMeeting>{
        const updateMeetingQuery: string = queries.getUpdateMeetingQuery();
        const updateMeetingValues: any = [data.id, data.committedUserId, data.discordChannelId, data.endedAt];

        const response: any = await this.dbClient.callDbCmd(updateMeetingQuery, updateMeetingValues);
        return response.rows[0] as IMeeting;
    }

    async findMeetingIdForSupervisorEntering(data) {
        //data.channel, data.supervisorId, data.loggedUsers[0].id, data.loggedUsers[1].id
        const query = `SELECT meeting_id FROM user_meetings WHERE user_id IN ($1, $2) ORDER BY created_at DESC LIMIT 1;`
        const values = [data.loggedUsers[0].id, data.loggedUsers[1].id];
        const meeting_id = await this.dbClient.callDbCmd(query,values)
        return meeting_id
    }

}

export default new MeetingsRepository(pgClient);
