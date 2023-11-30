"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelectQuestionFullDataQuery = exports.getDeleteAnswerCommentsQuery = exports.getUpdateAnswerCommentQuery = exports.getInsertAnswerCommentQuery = exports.getDeleteAnswersQuery = exports.getUpdateAnswerQuery = exports.getInsertAnswerQuery = exports.getDeleteQuestionsCommentsQuery = exports.getUpdateQuestionCommentQuery = exports.getInsertQuestionCommentQuery = exports.getDeleteQuestionsQuery = exports.getUpdateQuestionQuery = exports.getInsertQuestionQuery = exports.getSelectQuestionsQuery = void 0;
function getSelectQuestionsQuery() {
    return `select id, title, content, created_by as "createdBy", votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt" 
            from questions;`;
}
exports.getSelectQuestionsQuery = getSelectQuestionsQuery;
function getInsertQuestionQuery() {
    return `insert into questions (title, content, created_by, video_file_name)
            values ($1, $2, $3, $4) 
            RETURNING id, title, content, created_by as "createdBy", votes_sum as "votesSum",
            video_file_name as "videoFileName",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `;
}
exports.getInsertQuestionQuery = getInsertQuestionQuery;
function getUpdateQuestionQuery() {
    return `update questions set 
            title       = COALESCE($2, title), 
            content     = COALESCE($3, content), 
            created_by  = COALESCE($4, created_by),
            votes_sum   = COALESCE($5, votes_sum) + COALESCE($6, 0),
            updated_at  = timezone('UTC'::TEXT, NOW())
            where id = $1
            RETURNING id, title, content, created_by as "createdBy",  votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `;
}
exports.getUpdateQuestionQuery = getUpdateQuestionQuery;
function getDeleteQuestionsQuery() {
    return `delete from questions 
            where id = any($1)
            RETURNING id, title, content, created_by as "createdBy",  votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `;
}
exports.getDeleteQuestionsQuery = getDeleteQuestionsQuery;
function getInsertQuestionCommentQuery() {
    return `insert into question_comments (question_id, content, created_by)
            values ($1, $2, $3) 
            RETURNING id, question_id as "questionId", content, created_by as "createdBy", votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `;
}
exports.getInsertQuestionCommentQuery = getInsertQuestionCommentQuery;
function getUpdateQuestionCommentQuery() {
    return `update question_comments set 
            content     = COALESCE($2, content), 
            created_by  = COALESCE($3, created_by),
            votes_sum   = COALESCE($4, votes_sum) + COALESCE($5, 0),
            updated_at  = timezone('UTC'::TEXT, NOW())
            where id = $1
            RETURNING id, content, created_by as "createdBy",  votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `;
}
exports.getUpdateQuestionCommentQuery = getUpdateQuestionCommentQuery;
function getDeleteQuestionsCommentsQuery() {
    return `delete from question_comments 
            where id = any($1)
            RETURNING id, content, created_by as "createdBy",  votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `;
}
exports.getDeleteQuestionsCommentsQuery = getDeleteQuestionsCommentsQuery;
function getInsertAnswerQuery() {
    return `insert into answers (question_id, content, created_by, video_file_name)
            values ($1, $2, $3, $4) 
            RETURNING id, question_id as "questionId", content, created_by as "createdBy", votes_sum as "votesSum",
            video_file_name as "videoFileName",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `;
}
exports.getInsertAnswerQuery = getInsertAnswerQuery;
function getUpdateAnswerQuery() {
    return `update answers set 
            content     = COALESCE($2, content), 
            created_by  = COALESCE($3, created_by),
            votes_sum   = COALESCE($4, votes_sum) + COALESCE($5, 0),
            updated_at  = timezone('UTC'::TEXT, NOW())
            where id = $1
            RETURNING id, question_id as "questionId", content, created_by as "createdBy",  votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `;
}
exports.getUpdateAnswerQuery = getUpdateAnswerQuery;
function getDeleteAnswersQuery() {
    return `delete from answers 
            where id = any($1)
            RETURNING id, question_id as "questionId", content, created_by as "createdBy",  votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `;
}
exports.getDeleteAnswersQuery = getDeleteAnswersQuery;
function getInsertAnswerCommentQuery() {
    return `insert into answer_comments (answer_id, content, created_by)
            values ($1, $2, $3) 
            RETURNING id, answer_id as "answerId", content, created_by as "createdBy", votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `;
}
exports.getInsertAnswerCommentQuery = getInsertAnswerCommentQuery;
function getUpdateAnswerCommentQuery() {
    return `update answer_comments set 
            content     = COALESCE($2, content), 
            created_by  = COALESCE($3, created_by),
            votes_sum   = COALESCE($4, votes_sum) + COALESCE($5, 0),
            updated_at  = timezone('UTC'::TEXT, NOW())
            where id = $1
            RETURNING id, answer_id as "answerId", content, created_by as "createdBy",  votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `;
}
exports.getUpdateAnswerCommentQuery = getUpdateAnswerCommentQuery;
function getDeleteAnswerCommentsQuery() {
    return `delete from answer_comments 
            where id = any($1)
            RETURNING id, answer_id as "answerId", content, created_by as "createdBy",  votes_sum as "votesSum",
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt"; `;
}
exports.getDeleteAnswerCommentsQuery = getDeleteAnswerCommentsQuery;
function getSelectQuestionFullDataQuery() {
    return `select id, title, content, created_by as "createdBy", votes_sum as "votesSum", 
            video_file_name as "videoFileName", answers, comments,
            extract(epoch from created_at)::float as "createdAt",
            extract(epoch from updated_at)::float as "updatedAt" 
            from questions_full_data($1) q;`;
}
exports.getSelectQuestionFullDataQuery = getSelectQuestionFullDataQuery;
//# sourceMappingURL=questionsManagement.js.map