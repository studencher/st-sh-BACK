"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeetingsQuery = exports.getUpdateMeetingQuery = exports.getUpdateUserMeetingQuery = exports.getSelectUserMeetingsQueries = exports.getInsertUserMeetingQueries = exports.getInsertMeetingQuery = void 0;
function getInsertMeetingQuery() {
    return `insert into meetings ( id, created_by, discord_channel_id ) 
            VALUES ( $1, $2, $3)
            RETURNING id, created_by as "createdBy", discord_channel_id as "discordChannelId",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt",
            extract(epoch from ended_at)::float as "endedAt"`;
}
exports.getInsertMeetingQuery = getInsertMeetingQuery;
function getInsertUserMeetingQueries() {
    return `insert into user_meetings (user_id, meeting_id) VALUES ($1, $2)`;
}
exports.getInsertUserMeetingQueries = getInsertUserMeetingQueries;
function getSelectUserMeetingsQueries() {
    return `select user_id as "userId", meeting_id as "meetingId", note, rate,
             extract(epoch from um.created_at)::float as "createdAt",
            extract(epoch from um.updated_at)::float as "updatedAt", 
            json_build_object('id', u.id,
                              'name', u.name ) as "createdBy"
            from user_meetings um 
            join meetings m on m.id = um.meeting_id 
            join users u on m.created_by = u.id  
            where 
            CASE WHEN $1::uuid[] is not null THEN meeting_id = any($1::uuid[]) ELSE true END and 
            CASE WHEN $2::text[] is not null THEN user_id = any($2::text[]) ELSE true END and 
            CASE WHEN $3::boolean is not null THEN CASE 
                                         WHEN $3::boolean = true THEN note is not null ELSE note is null END 
                                         ELSE true END and 
            CASE WHEN $4::boolean is not null THEN CASE 
                                         WHEN $4::boolean = true THEN rate is not null ELSE rate is null END 
                                         ELSE true END `;
}
exports.getSelectUserMeetingsQueries = getSelectUserMeetingsQueries;
function getUpdateUserMeetingQuery() {
    return `update user_meetings SET 
            note          = $3, 
            rate          = COALESCE($4, rate ),
            updated_at    = timezone('UTC'::text, NOW())
            where user_id = $1 and meeting_id = $2
            RETURNING user_id as "userId", meeting_id as "meetingId", note, rate,
             extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"`;
}
exports.getUpdateUserMeetingQuery = getUpdateUserMeetingQuery;
function getUpdateMeetingQuery() {
    return `update meetings SET 
            created_by          = COALESCE($2, created_by ), 
            discord_channel_id  = COALESCE($3, discord_channel_id ),
            ended_at            = COALESCE($4, ended_at)
            where id = $1
            RETURNING id, created_by as "createdBy", discord_channel_id as "discordChannelId",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt",
            extract(epoch from ended_at)::float as "endedAt";`;
}
exports.getUpdateMeetingQuery = getUpdateMeetingQuery;
function getMeetingsQuery() {
    return `select id, created_by as "createdBy", discord_channel_id as "discordChannelId",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt",
            extract(epoch from ended_at)::float as "endedAt"
            from meetings m 
            join user_last_track ult on m.id = ult.meeting_id ;`;
}
exports.getMeetingsQuery = getMeetingsQuery;
//# sourceMappingURL=meetingsManagement.js.map