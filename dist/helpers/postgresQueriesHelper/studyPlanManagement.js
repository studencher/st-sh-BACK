"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInsertUserPlansQuery = exports.getDeleteUserPlansQuery = exports.getDeleteStudyPlansQuery = exports.getDeleteStudyPlanActivitiesQueryFromPlanActivities = exports.getDeleteStudyPlanActivitiesQueryFromUserActivityHistory = exports.getDeleteStudyPlanActivitiesQueryFromUserActivityMetaData = exports.getDeleteStudyPlanActivitiesQueryFromUserActivityVideoStatusHistory = exports.getDeleteStudyPlanActivitiesQuery = exports.getSelectStudyPlansQuery = exports.getUpdateStudyPlanQuery = exports.getInsertStudyPlanActivityQuery = exports.getInsertStudyPlanQuery = void 0;
function getInsertStudyPlanQuery() {
    return `insert into plans (id, name) values ($1, $2) 
            RETURNING id, name, extract(epoch from timestamp)::float as "createdAt", array[]::uuid[] as activities `;
}
exports.getInsertStudyPlanQuery = getInsertStudyPlanQuery;
// export function getInsertStudyPlanActivityQuery() {
//   return `insert into plan_activities (plan_id, activity_id, index) values ($1, $2, $3)
//             RETURNING plan_id as "planId", activity_id as "activityId" , index `;
// }
function getInsertStudyPlanActivityQuery() {
    return `INSERT INTO plan_activities (plan_id, activity_id, index)
VALUES ($1, $2, $3)
ON CONFLICT (plan_id, activity_id)
DO UPDATE SET index = $3
RETURNING plan_id as "planId", activity_id as "activityId", index;
`;
}
exports.getInsertStudyPlanActivityQuery = getInsertStudyPlanActivityQuery;
function getUpdateStudyPlanQuery() {
    return `update plans set name = COALESCE($2, name)
            where id = $1
            RETURNING id, name, extract(epoch from timestamp)::float as "createdAt", array[]::uuid[] as activities `;
}
exports.getUpdateStudyPlanQuery = getUpdateStudyPlanQuery;
function getSelectStudyPlansQuery() {
    return `with plan_activities_list as (
                    select p.id, array_agg(activity_id) as activities 
                    from plans p 
                    join plan_activities pa on p.id = pa.plan_id
                    group by p.id),
                user_activities_list as (
                    select p.id, array_agg(user_id) as users
                    from plans p
                    join user_plans up on p.id = up.plan_id
                    group by p.id) 
            select p.id, name,  COALESCE(activities, array[]::uuid[]) as activities,
            COALESCE(users, array[]::text[]) as users
            from plans p 
            left join plan_activities_list pal on pal.id = p.id
            left join user_activities_list ual on ual.id = p.id;`;
}
exports.getSelectStudyPlansQuery = getSelectStudyPlansQuery;
function getDeleteStudyPlanActivitiesQuery() {
    return `delete from plan_activities where plan_id = $1;`;
}
exports.getDeleteStudyPlanActivitiesQuery = getDeleteStudyPlanActivitiesQuery;
// export function getDeleteStudyPlanActivitiesQuery() {
//   return `delete from user_activity_video_status_history where plan_id = $1 and activity_id = $2;
//           delete from user_activity_meta_data where plan_id = $1 and activity_id = $2;
//           delete from user_activity_history where plan_id = $1 and activity_id = $2;
//           delete from plan_activities where plan_id = $1;`;
// }
// export function getDeleteStudyPlanActivitiesQuery() {
//   return `WITH activities_to_remove AS (
//     SELECT pa.plan_id, pa.activity_id
//     FROM plan_activities pa
//     WHERE pa.plan_id = $1 AND pa.activity_id = ANY($2::text[])
// ),
// relevant_activities AS (
//     SELECT pa.plan_id, pa.activity_id, 'user_activity_video_status_history' AS table_name
//     FROM activities_to_remove pa
//     UNION ALL
//     SELECT pa.plan_id, pa.activity_id, 'user_activity_meta_data' AS table_name
//     FROM activities_to_remove pa
//     UNION ALL
//     SELECT pa.plan_id, pa.activity_id, 'user_activity_history' AS table_name
//     FROM activities_to_remove pa
//     UNION ALL
//     SELECT pa.plan_id, pa.activity_id, 'plan_activities' AS table_name
//     FROM activities_to_remove pa
// )
// DELETE FROM user_activity_video_status_history
// USING relevant_activities
// WHERE user_activity_video_status_history.plan_id = relevant_activities.plan_id
//   AND user_activity_video_status_history.activity_id = relevant_activities.activity_id;
// DELETE FROM user_activity_meta_data
// USING relevant_activities
// WHERE user_activity_meta_data.plan_id = relevant_activities.plan_id
//   AND user_activity_meta_data.activity_id = relevant_activities.activity_id;
// DELETE FROM user_activity_history
// USING relevant_activities
// WHERE user_activity_history.plan_id = relevant_activities.plan_id
//   AND user_activity_history.activity_id = relevant_activities.activity_id;
// DELETE FROM plan_activities
// USING activities_to_remove
// WHERE plan_activities.plan_id = activities_to_remove.plan_id
//   AND plan_activities.activity_id = activities_to_remove.activity_id;
// `;
// }
function getDeleteStudyPlanActivitiesQueryFromUserActivityVideoStatusHistory() {
    return `WITH activities_to_remove AS (
    SELECT pa.plan_id, pa.activity_id
    FROM plan_activities pa
    WHERE pa.plan_id = $1 AND pa.activity_id = ANY($2::text[])
),
relevant_activities AS (
    SELECT pa.plan_id, pa.activity_id
    FROM activities_to_remove pa
)
DELETE FROM user_activity_video_status_history
USING relevant_activities
WHERE user_activity_video_status_history.plan_id = relevant_activities.plan_id
  AND user_activity_video_status_history.activity_id = relevant_activities.activity_id;`;
}
exports.getDeleteStudyPlanActivitiesQueryFromUserActivityVideoStatusHistory = getDeleteStudyPlanActivitiesQueryFromUserActivityVideoStatusHistory;
function getDeleteStudyPlanActivitiesQueryFromUserActivityMetaData() {
    return `WITH activities_to_remove AS (
    SELECT pa.plan_id, pa.activity_id
    FROM plan_activities pa
    WHERE pa.plan_id = $1 AND pa.activity_id = ANY($2::text[])
),
relevant_activities AS (
    SELECT pa.plan_id, pa.activity_id
    FROM activities_to_remove pa
)
DELETE FROM user_activity_meta_data
USING relevant_activities
WHERE user_activity_meta_data.plan_id = relevant_activities.plan_id
  AND user_activity_meta_data.activity_id = relevant_activities.activity_id;`;
}
exports.getDeleteStudyPlanActivitiesQueryFromUserActivityMetaData = getDeleteStudyPlanActivitiesQueryFromUserActivityMetaData;
function getDeleteStudyPlanActivitiesQueryFromUserActivityHistory() {
    return `WITH activities_to_remove AS (
    SELECT pa.plan_id, pa.activity_id
    FROM plan_activities pa
    WHERE pa.plan_id = $1 AND pa.activity_id = ANY($2::text[])
),
relevant_activities AS (
    SELECT pa.plan_id, pa.activity_id
    FROM activities_to_remove pa
)
DELETE FROM user_activity_history
USING relevant_activities
WHERE user_activity_history.plan_id = relevant_activities.plan_id
  AND user_activity_history.activity_id = relevant_activities.activity_id;`;
}
exports.getDeleteStudyPlanActivitiesQueryFromUserActivityHistory = getDeleteStudyPlanActivitiesQueryFromUserActivityHistory;
function getDeleteStudyPlanActivitiesQueryFromPlanActivities() {
    return `WITH activities_to_remove AS (
    SELECT pa.plan_id, pa.activity_id
    FROM plan_activities pa
    WHERE pa.plan_id = $1 AND pa.activity_id = ANY($2::text[])
),
relevant_activities AS (
    SELECT pa.plan_id, pa.activity_id
    FROM activities_to_remove pa
)
DELETE FROM plan_activities
USING activities_to_remove
WHERE plan_activities.plan_id = activities_to_remove.plan_id
  AND plan_activities.activity_id = activities_to_remove.activity_id;`;
}
exports.getDeleteStudyPlanActivitiesQueryFromPlanActivities = getDeleteStudyPlanActivitiesQueryFromPlanActivities;
function getDeleteStudyPlansQuery() {
    return `delete from plans where id = any($1)
            RETURNING id, name, extract(epoch from timestamp)::float as "createdAt"`;
}
exports.getDeleteStudyPlansQuery = getDeleteStudyPlansQuery;
function getDeleteUserPlansQuery() {
    return `delete from user_plans where plan_id = $1 and not user_id = any ($2)`;
}
exports.getDeleteUserPlansQuery = getDeleteUserPlansQuery;
// export function getInsertUserPlansQuery(){
//     return  ` with un_nested_users as (
//                  select unnest($2::text[]) as user_id ),
//                registered_users as (
//                  select array_agg(user_id) as list from user_plans where plan_id = $1 )
//               insert into user_plans (user_id, plan_id)
//               select unu.user_id, $1
//               from un_nested_users unu, registered_users ru
//               where not unu.user_id = any(COALESCE(ru.list, array[]::text[]))
//               RETURNING user_id as "userId";`;
// }
// export function getInsertUserPlansQuery() {
//   return ` with un_nested_users as (
//                     select unnest($2::text[]) as user_id),
//                 registered_users as (
//                     select array_agg(user_id) as list from user_plans where plan_id = $1)
//             delete from user_plans using (
//                 select unu.user_id
//                 from un_nested_users unu
//                 left join registered_users ru on unu.user_id = any(ru.list)
//                 where ru.list IS NULL) as to_delete
//             where user_plans.user_id = to_delete.user_id and user_plans.plan_id = $1;
//             insert into user_plans (user_id, plan_id)
//             select unu.user_id, $1
//             from un_nested_users unu
//             left join registered_users ru on unu.user_id = any(ru.list)
//             where ru.list IS NULL
//             RETURNING user_id as "userId";`;
// }
function getInsertUserPlansQuery() {
    return `  WITH un_nested_users AS (
                SELECT unnest($2::text[]) AS user_id
            ), registered_users AS (
                SELECT user_id, array_agg(plan_id) AS plan_ids
                FROM user_plans
                GROUP BY user_id
            )
            DELETE FROM user_plans
            USING (
                SELECT unu.user_id
                FROM un_nested_users unu
                LEFT JOIN registered_users ru ON unu.user_id = ru.user_id
                WHERE ru.user_id IS NOT NULL AND $1 <> ALL(ru.plan_ids)
            ) AS to_delete
            WHERE user_plans.user_id = to_delete.user_id;

            INSERT INTO user_plans (user_id, plan_id)
            SELECT unu.user_id, $1
            FROM un_nested_users unu
            LEFT JOIN registered_users ru ON unu.user_id = ru.user_id
            WHERE ru.user_id IS NULL OR $1 <> ALL(ru.plan_ids)
            ON CONFLICT (user_id) DO UPDATE
            SET plan_id = EXCLUDED.plan_id
            RETURNING user_id AS "userId", plan_id AS "planId";`;
}
exports.getInsertUserPlansQuery = getInsertUserPlansQuery;
//# sourceMappingURL=studyPlanManagement.js.map