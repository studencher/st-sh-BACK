export function getInsertStudyPlanQuery(){
    return `insert into plans (id, name) values ($1, $2) 
            RETURNING id, name, extract(epoch from timestamp)::float as "createdAt", array[]::uuid[] as activities `
}

export function getInsertStudyPlanActivityQuery(){
    return `insert into plan_activities (plan_id, activity_id, index) values ($1, $2, $3) 
            RETURNING plan_id as "planId", activity_id as "activityId" , index `
}

export function getUpdateStudyPlanQuery(){
    return `update plans set name = COALESCE($2, name)
            where id = $1
            RETURNING id, name, extract(epoch from timestamp)::float as "createdAt", array[]::uuid[] as activities `
}
// export function getSelectStudyPlansQuery(){
//     return `with plan_activities_list as (
//                 select p.id, array_agg(activity_id) as activities
//                 from plans p
//                 join plan_activities pa on p.id = pa.plan_id
//                 group by p.id)
//             select p.id, name,  COALESCE(activities, array[]::uuid[]) as activities
//             from plans p
//             left join plan_activities_list pal on pal.id = p.id    `
// }
export function getSelectStudyPlansQuery() {
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

export function getDeleteStudyPlanActivitiesQuery(){
    return `delete from plan_activities 
            where plan_id = $1`
}

export function getDeleteStudyPlansQuery(){
    return `delete from plans where id = any($1)
            RETURNING id, name, extract(epoch from timestamp)::float as "createdAt"`
}

export function getDeleteUserPlansQuery(){
    return `delete from user_plans where plan_id = $1 and not user_id = any ($2)`
}

export function getInsertUserPlansQuery(){
    return  ` with un_nested_users as (
                 select unnest($2::text[]) as user_id ),
               registered_users as (
                 select array_agg(user_id) as list from user_plans where plan_id = $1 )
              insert into user_plans (user_id, plan_id)
              select unu.user_id, $1
              from un_nested_users unu, registered_users ru
              where not unu.user_id = any(COALESCE(ru.list, array[]::text[]))
              RETURNING user_id as "userId";`;
}

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

// export function getInsertUserPlansQuery() {
//   return `  WITH un_nested_users AS (
//                 SELECT unnest($2::text[]) AS user_id
//             ), registered_users AS (
//                 SELECT user_id, array_agg(plan_id) AS plan_ids
//                 FROM user_plans
//                 GROUP BY user_id
//             )
//             DELETE FROM user_plans
//             USING (
//                 SELECT unu.user_id
//                 FROM un_nested_users unu
//                 LEFT JOIN registered_users ru ON unu.user_id = ru.user_id
//                 WHERE ru.user_id IS NOT NULL AND $1 <> ALL(ru.plan_ids)
//             ) AS to_delete
//             WHERE user_plans.user_id = to_delete.user_id;

//             INSERT INTO user_plans (user_id, plan_id)
//             SELECT unu.user_id, $1
//             FROM un_nested_users unu
//             LEFT JOIN registered_users ru ON unu.user_id = ru.user_id
//             WHERE ru.user_id IS NULL OR $1 <> ALL(ru.plan_ids)
//             ON CONFLICT (user_id) DO UPDATE
//             SET plan_id = EXCLUDED.plan_id
//             RETURNING user_id AS "userId", plan_id AS "planId";`;
// }
