"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceResponse = void 0;
class ServiceResponse {
    constructor(response, err) {
        if (response) {
            this.response = response;
        }
        if (err) {
            this.err = err;
        }
    }
}
exports.ServiceResponse = ServiceResponse;
//
// const test: IServiceResponse<{test: any[]}> = {
//     data: {
//         test: []
//     }
// }
//# sourceMappingURL=ServiceResponse.js.map