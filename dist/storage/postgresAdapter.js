"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const studentcher_shared_utils_1 = require("../studentcher-shared-utils");
const pgClient = new studentcher_shared_utils_1.PostgresAdapter({
    host: process.env.POSTGRES_ADDR,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    max: 25,
    min: 4,
    connectionTimeoutMillis: 10000,
    ssl: {
        rejectUnauthorized: false
    }
});
exports.default = pgClient;
//# sourceMappingURL=postgresAdapter.js.map