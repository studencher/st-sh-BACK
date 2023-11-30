"use strict";
// const pg = require('pg');
//
//
// const pgPool = new pg.Pool({
//     host: process.env.POSTGRES_ADDR,
//     database: process.env.DB_NAME,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     max: 25,
//     min: 4,
//     connectionTimeoutMillis: 10000
// })
//
//
//
//
//
// module.exports.callDbCmd = async (sqlQuery, values=[])=>{
//     const client = await pgPool.connect();
//     try{
//         return await client.query(sqlQuery, values) ;
//     } catch(err) {
//         throw err;
//     }
//     finally {
//         await client.release();
//     }
// }
//
// module.exports.callDbTransaction = async (queriesArr, valuesArr)=>{
//     if(queriesArr.length !== valuesArr.length)
//         throw new Error("queriesArr.length !== valuesArr.length in callDbTransactionCmd")
//     const client = await pgPool.connect();
//     try{
//         const response = {}
//         await client.query('BEGIN ');
//         for(let i =0; i< queriesArr.length; i++){
//             response[i] = await client.query(queriesArr[i], valuesArr[i]);
//         }
//         await client.query('COMMIT ');
//         return response;
//     }catch(err){
//         await client.query('ROLLBACK');
//         throw err
//     }
//     finally {
//         await client.release();
//     }
// }
//
