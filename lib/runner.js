"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
const messages = require('./runner_pb');
const services = require('./runner_grpc_pb');
const grpc = require('@grpc/grpc-js');
class Runner {
    constructor(server) {
        this.client = new services.RunnerClient(server, grpc.credentials.createInsecure());
    }
    stop() {
        grpc.closeClient(this.client);
    }
    bootstrap(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
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
                this.client.bootstrap(arg, (err, res) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        });
    }
}
exports.Runner = Runner;
