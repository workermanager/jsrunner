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
exports.MessageQueue = void 0;
const messages = require('./runner_pb');
const services = require('./runner_grpc_pb');
const grpc = require('@grpc/grpc-js');
class MessageQueue {
    constructor(server) {
        this.client = new services.MessageQueueClient(server, grpc.credentials.createInsecure());
    }
    stop() {
        grpc.closeClient(this.client);
    }
    pop() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var arg = new messages.Void();
                this.client.pop(arg, (err, res) => {
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
        });
    }
    monitor(data, err) {
        var arg = new messages.Void();
        var m = this.client.monitor(arg);
        m.on("data", (res) => {
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
exports.MessageQueue = MessageQueue;
