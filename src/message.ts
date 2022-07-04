const messages = require('./runner_pb');
const services = require('./runner_grpc_pb');
const grpc = require('@grpc/grpc-js');

import { Message, Monitor } from "./define"


export class MessageQueue {
    client: any;
    constructor(server: string) {
        this.client = new services.MessageQueueClient(server, grpc.credentials.createInsecure());
    }
    stop() {
        grpc.closeClient(this.client);
    }

    async pop(): Promise<Message> {
        return new Promise<Message>((resolve, reject) => {
            var arg = new messages.Void();
            this.client.pop(arg, (err: any, res: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({
                    type: res.getType(),
                    key: res.getKey(),
                    value: res.getValue(),
                });
            });
        });
    }

    monitor(data: (message: Message, m: Monitor) => void, err?: (e: any) => void): Monitor {
        var arg = new messages.Void();
        var m = this.client.monitor(arg);
        m.on("data", (res: any) => {
            data({
                type: res.getType(),
                key: res.getKey(),
                value: res.getValue(),
            }, m);
        });
        if (err) {
            m.on("error", err);
        }
        return m;
    }
}
