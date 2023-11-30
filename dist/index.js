"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const port = process.env.PORT;
const app_1 = __importDefault(require("./app"));
app_1.default.listen(port, async () => {
    // await connectDb()
    console.log('Server connected, port:', port);
});
//# sourceMappingURL=index.js.map