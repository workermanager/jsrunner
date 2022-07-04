"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BootstrapArg = exports.Monitor = exports.Message = exports.MessageTypes = void 0;
/**
 * 消息通知类型
 */
var MessageTypes;
(function (MessageTypes) {
    /** 策略交互 */
    MessageTypes[MessageTypes["Notify"] = 100] = "Notify";
    /** 外部通知 */
    MessageTypes[MessageTypes["Hook"] = 200] = "Hook";
})(MessageTypes = exports.MessageTypes || (exports.MessageTypes = {}));
/**
 * 消息对象
 */
class Message {
}
exports.Message = Message;
class Monitor {
    constructor(raw) {
        this.raw = raw;
    }
    cancel() {
        this.raw.cancel();
    }
}
exports.Monitor = Monitor;
class BootstrapArg {
}
exports.BootstrapArg = BootstrapArg;
