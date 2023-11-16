export function getSelectQuestionsQuery() : string{
    return `select id, title, content, created_by as "createdBy", votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt" 
            from questions;`
}

export function getInsertQuestionQuery() :string{
    return `insert into questions (title, content, created_by, video_file_name)
            values ($1, $2, $3, $4) 
            RETURNING id, title, content, created_by as "createdBy", votes_sum as "votesSum",
            video_file_name as "videoFileName",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `
}

export function getUpdateQuestionQuery() :string{
    return `update questions set 
            title       = COALESCE($2, title), 
            content     = COALESCE($3, content), 
            created_by  = COALESCE($4, created_by),
            votes_sum   = COALESCE($5, votes_sum) + COALESCE($6, 0),
            updated_at  = timezone('UTC'::TEXT, NOW())
            where id = $1
            RETURNING id, title, content, created_by as "createdBy",  votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `
}

export function getDeleteQuestionsQuery() :string{
    return `delete from questions 
            where id = any($1)
            RETURNING id, title, content, created_by as "createdBy",  votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `
}

export function getInsertQuestionCommentQuery() :string{
    return `insert into question_comments (question_id, content, created_by)
            values ($1, $2, $3) 
            RETURNING id, question_id as "questionId", content, created_by as "createdBy", votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `
}

export function getUpdateQuestionCommentQuery() :string{
    return `update question_comments set 
            content     = COALESCE($2, content), 
            created_by  = COALESCE($3, created_by),
            votes_sum   = COALESCE($4, votes_sum) + COALESCE($5, 0),
            updated_at  = timezone('UTC'::TEXT, NOW())
            where id = $1
            RETURNING id, content, created_by as "createdBy",  votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `
}
export function getDeleteQuestionsCommentsQuery() :string{
    return `delete from question_comments 
            where id = any($1)
            RETURNING id, content, created_by as "createdBy",  votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `
}

export function getInsertAnswerQuery() :string{
    return `insert into answers (question_id, content, created_by, video_file_name)
            values ($1, $2, $3, $4) 
            RETURNING id, question_id as "questionId", content, created_by as "createdBy", votes_sum as "votesSum",
            video_file_name as "videoFileName",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `
}

export function getUpdateAnswerQuery() :string{
    return `update answers set 
            content     = COALESCE($2, content), 
            created_by  = COALESCE($3, created_by),
            votes_sum   = COALESCE($4, votes_sum) + COALESCE($5, 0),
            updated_at  = timezone('UTC'::TEXT, NOW())
            where id = $1
            RETURNING id, question_id as "questionId", content, created_by as "createdBy",  votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `
}
export function getDeleteAnswersQuery() :string{
    return `delete from answers 
            where id = any($1)
            RETURNING id, question_id as "questionId", content, created_by as "createdBy",  votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `
}

export function getInsertAnswerCommentQuery() :string{
    return `insert into answer_comments (answer_id, content, created_by)
            values ($1, $2, $3) 
            RETURNING id, answer_id as "answerId", content, created_by as "createdBy", votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `
}

export function getUpdateAnswerCommentQuery() :string{
    return `update answer_comments set 
            content     = COALESCE($2, content), 
            created_by  = COALESCE($3, created_by),
            votes_sum   = COALESCE($4, votes_sum) + COALESCE($5, 0),
            updated_at  = timezone('UTC'::TEXT, NOW())
            where id = $1
            RETURNING id, answer_id as "answerId", content, created_by as "createdBy",  votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `
}
export function getDeleteAnswerCommentsQuery() :string{
    return `delete from answer_comments 
            where id = any($1)
            RETURNING id, answer_id as "answerId", content, created_by as "createdBy",  votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `
}

export function getSelectQuestionFullDataQuery() : string{
    return `select id, title, content, created_by as "createdBy", votes_sum as "votesSum", 
            video_file_name as "videoFileName", answers, comments,
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt" 
            from questions_full_data($1) q;`
}
