const messages = require('./runner_pb');
const services = require('./runner_grpc_pb');
const grpc = require('@grpc/grpc-js');

import { BootstrapArg } from "./define"


export class Runner {
    client: any;
    constructor(server: string) {
        this.client = new services.RunnerClient(server, grpc.credentials.createInsecure());
    }
    stop() {
        grpc.closeClient(this.client);
    }

    async bootstrap(arg: BootstrapArg): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            var arg = new messages.Void();
            this.client.bootstrap(arg, (err: any, res: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}
