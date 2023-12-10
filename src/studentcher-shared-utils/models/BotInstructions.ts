
export class BotInstructions {
    type: string;
    data: unknown;
    userId?: any

    constructor(type: string, data: unknown = {},userId?: any) {
        this.type = type;
        this.data = data;
        this.userId = userId;
    }
}


