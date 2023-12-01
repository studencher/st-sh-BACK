export function getInsertCrawlerQuery(): string{
    return `with crawler_comment_data as (
                select json_build_object('id', cc.id,
                               'comment', cc.comment,
                               'description', cc.description) as data
                from crawler_comments cc 
                where id = $1 )  , 
             crawler_user_account_data as ( 
                select  json_build_object('id', cua.id, 
                         'username', cua.username, 
                         'password', cua.password, 
                         'description', cua.description, 
                         'postsCollection', cua.posts_collection_to_save_in) as data
                 from crawler_user_accounts cua 
                 where id = $2 ) , 
             crawler_user_search_data as (
                select json_build_object('id', cs.id,
                               'description', cs.description,
                               'keywords', cs.keywords) as data
                from crawler_searches cs 
                where id = $3 )
             INSERT INTO crawlers (comment_id, user_account_id, search_id, description) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id, description,
             ( select data from crawler_comment_data ) as comment,
             ( select data from crawler_user_account_data ) as account,
             ( select data from crawler_user_search_data ) as search `;
}

export function getDeleteCrawlersQuery(): string{
    return `DELETE FROM crawlers 
            WHERE id = ANY($1::uuid[]) 
            RETURNING id, comment_id as "commentId", user_account_id as "userAccountId", search_id as "searchId"`;
}

export function getSelectCrawlersQuery(): string{
    return `SELECT c.id, c.description,
            json_build_object('id', cua.id, 
                              'username', cua.username, 
                              'password', cua.password, 
                              'description', cua.description, 
                              'postsCollection', cua.posts_collection_to_save_in) as account,
            json_build_object('id', cs.id,
                              'description', cs.description,
                              'keywords', cs.keywords) as search,
            json_build_object('id', cc.id,
                              'comment', cc.comment,
                              'description', cc.description) as comment,
            json_build_object('createdAt', extract(epoch from cls.created_at)::float,
                              'endedAt', extract(epoch from cls.ended_at)::float) as "lastStatus"                  
            FROM crawlers c 
            join crawler_comments cc on c.comment_id = cc.id
            join crawler_user_accounts cua on c.user_account_id = cua.id
            join crawler_searches cs on c.search_id = cs.id 
            left join crawler_last_status cls on cls.crawler_id = c.id
            where 
            CASE when $1::uuid[] is null THEN true
                 else c.id = any($1::uuid[])
            END`;
}

export function getSelectCommentsQuery(): string{
    return `SELECT id, comment, description 
            FROM crawler_comments`
}

export function getInsertCommentQuery(): string{
    return `INSERT INTO crawler_comments (comment, description) 
            VALUES ($1, $2) 
            RETURNING id, comment, description`;
}

export function getDeleteCommentsQuery(): string{
    return `DELETE FROM crawler_comments 
            WHERE id = ANY($1::uuid[]) 
            RETURNING id, comment, description`;
}

export function getSelectUserAccountsQuery(): string{
    return `SELECT id, username, password, description, posts_collection_to_save_in as "postsCollection"
            FROM crawler_user_accounts`;
}
export function getInsertUserAccountQuery(): string{
    return `INSERT INTO crawler_user_accounts (username, password, description, posts_collection_to_save_in)
            VALUES ($1, $2, $3, $4) 
            RETURNING id, username, password, description, posts_collection_to_save_in as "postsCollection"`;
}
export function getDeleteUserAccountsQuery(): string{
    return `DELETE FROM crawler_user_accounts 
            WHERE id = ANY($1::uuid[]) 
            RETURNING id, username, password, description, posts_collection_to_save_in as "postsCollection"`;
}

export function getSelectSearchesQuery(): string{
    return `SELECT id, description, keywords 
            FROM crawler_searches`;
}
export function getInsertSearchQuery(): string{
    return `INSERT INTO crawler_searches (description, keywords) 
            VALUES ($1, $2) 
            RETURNING id, description, keywords`;
}
export function getDeleteSearchesQuery(): string{
    return `DELETE FROM crawler_searches 
            WHERE id = ANY($1::uuid[]) 
            RETURNING id, description, keywords`;
}


export function getInsertCrawlerStatusQuery(): string{
    return `insert into crawler_statuses (crawler_id) values ($1);`
}

export function getUpdateCrawlerStatusQuery(): string{
    return `update crawler_statuses set 
            ended_at = CASE WHEN $2 = true THEN now() ELSE null END 
            where crawler_id = $1;`
}
