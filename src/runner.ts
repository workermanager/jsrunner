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

    async bootstrap(args: BootstrapArg): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            var arg = new messages.BootstrapArg();
            if (args.exchanges) {
                arg.setExchangesList(args.exchanges);
            }
            if (args.symbols) {
                arg.setSymbolsList(args.symbols);
            }
            if (args.config) {
                arg.setConfig(JSON.stringify(args.config));
            }
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
