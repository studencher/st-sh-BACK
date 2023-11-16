"use strict";
// const redis = require("redis");
// // const logger = require('../../utils/loggingHelper');
//
// const redisAddress = process.env.REDIS_PORT_6379_TCP_ADDR;
//
// const client = redis.createClient({host: redisAddress})
//
// client.on("error", function (err) {
//     // logger.error("Redis Error: " + err.message);
// });
//
//
// module.exports.get = function(key, cb) {
//     client.get(key, cb);
// };
//
// module.exports.setInHash = async(hash, key, value)=>{
//     return await redis.hset(hash, key, value)
// }
//
