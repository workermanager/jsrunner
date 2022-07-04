import { Message, Monitor } from "./define";
export declare class MessageQueue {
    client: any;
    constructor(server: string);
    stop(): void;
    pop(): Promise<Message>;
    monitor(data: (message: Message, m: Monitor) => void, err?: (e: any) => void): Monitor;
}
//# sourceMappingURL=message.d.ts.map