"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisAdapter = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
class RedisAdapter {
    constructor({ host = "", port }, logger) {
        const redisPort = isNaN(port) || port == null ? 6379 : port;
        this.client = new ioredis_1.default({ port: redisPort, host });
        this.TOPICS_SUBSCRIBERS = {};
        this.logger = logger;
        this.client.on("connect", function () {
            logger.info(`Redis client connected`);
        });
        this.client.on("error", function (err) {
            logger.error(err.message);
        });
    }
    async subscribe(topic) {
        this.logger.debug(`RedisAdapter subscribe to topic: ${topic}`);
        if (topic == null)
            throw new Error("topic must be provided.");
        if (this.TOPICS_SUBSCRIBERS[topic] != null)
            return;
        this.TOPICS_SUBSCRIBERS[topic] = true;
        await this.client.subscribe(topic);
    }
    async unsubscribe(topic) {
        this.logger.debug(`RedisAdapter unsubscribe from topic: ${topic}`);
        if (topic == null)
            throw new Error("topic must be provided.");
        const isSubscribed = this.TOPICS_SUBSCRIBERS[topic];
        if (!isSubscribed)
            return;
        await this.client.unsubscribe(topic);
        delete this.TOPICS_SUBSCRIBERS[topic];
    }
    async publish(topic, message) {
        this.logger.debug(`Publishing message using RedisAdapter: ${topic}, ${message}`);
        await this.client.publish(topic, message);
    }
    async push({ queue, message }) {
        this.logger.debug(`Right pushing message using RedisAdapter: queue - ${queue}, message -${message}`);
        await this.client.rpush(queue, message);
    }
    async pushMany({ queue, messages }) {
        this.logger.debug(`Right pushing messages using RedisAdapter: queue - ${queue}, messages - ${messages}`);
        const pipeline = this.client.pipeline();
        for (const message of messages) {
            pipeline.rpush(queue, message);
        }
        await pipeline.exec();
    }
    async pop({ queue, options }) {
        // From redis documentation - 0 indicates no timeout, block indefinitely
        this.logger.debug(`Pop message using RedisAdapter: queue - ${queue}, options -${JSON.stringify(options)}`);
        if (options === null || options === void 0 ? void 0 : options.shouldBeBlocked) {
            const popTimeout = (options === null || options === void 0 ? void 0 : options.timeout) != null ? options.timeout : 0;
            const [_key, value] = await this.client.blpop(queue, popTimeout);
            return value;
        }
        return this.client.lpop(queue);
    }
    async incrementHashProperty({ hash, property, incrementBy = 1 }) {
        this.logger.debug(`Incrementing hash property using RedisAdapter: hash - ${hash}, property -${property}, incrementBy - ${incrementBy}`);
        const result = await this.client.hincrby(hash, property, incrementBy);
        this.logger.debug(`Incrementing hash property using RedisAdapter: hash - result - ${result}`);
        return result;
    }
    async setHashProperty({ hash, property, value }) {
        this.logger.debug(`Setting hash property using RedisAdapter: hash - ${hash}, property -${property}, value - ${value}`);
        const stringValue = String(value);
        const result = await this.client.hset(hash, property, stringValue);
        this.logger.debug(`Setting hash property using RedisAdapter: hash - result - ${result}`);
        return result;
    }
    async getHash({ hash }) {
        this.logger.debug(`Getting hash using RedisAdapter: hash - ${hash}`);
        const result = await this.client.hgetall(hash);
        this.logger.debug(`Getting hash using RedisAdapter: hash - result - ${JSON.stringify(result)}`);
        return result;
    }
}
exports.RedisAdapter = RedisAdapter;
//# sourceMappingURL=RedisAdapter.js.map