"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
exports.LogState = exports.LogClear = exports.LogAdd = exports.LogError = exports.LogWarn = exports.LogInfo = exports.SysLogContent = exports.SysLogContentValue = exports.LogShows = exports.LogKeys = exports.sleep = exports.LoadWallet = exports.WalletInfo = exports.MQ = exports.Market = exports.Log = exports.Config = exports.LogShowArg = exports.LogRemoveArg = exports.LogEncode = exports.LogType = exports.LogItem = exports.MessageTypes = exports.Message = exports.OrderTypes = exports.OrderStatuses = exports.OrderSides = exports.OrderOffsets = exports.WalletPositions = exports.WalletEvents = exports.WalletEvent = exports.ListOrderArg = exports.QueryOrderArg = exports.CancelOrderArg = exports.OrderResponse = exports.OrderRequest = exports.LoadHoldingArg = exports.Holding = exports.LoadBalanceArg = exports.NewWalletArg = exports.Balance = exports.TickerArg = exports.Ticker = exports.SymbolArg = exports.Monitor = exports.KLineArg = exports.KLine = exports.DepthArg = exports.Depth = exports.NewLogger = void 0;
exports.LogShow = exports.LogProfitClear = exports.LogProfit = exports.LogStateClear = void 0;
__exportStar(require("./std"), exports);
__exportStar(require("./big"), exports);
const fs_1 = require("fs");
const log4js_1 = require("log4js");
var log4js_2 = require("log4js");
Object.defineProperty(exports, "NewLogger", { enumerable: true, get: function () { return log4js_2.getLogger; } });
const jsexchange_1 = require("jsexchange");
var jsexchange_2 = require("jsexchange");
Object.defineProperty(exports, "Depth", { enumerable: true, get: function () { return jsexchange_2.Depth; } });
Object.defineProperty(exports, "DepthArg", { enumerable: true, get: function () { return jsexchange_2.DepthArg; } });
Object.defineProperty(exports, "KLine", { enumerable: true, get: function () { return jsexchange_2.KLine; } });
Object.defineProperty(exports, "KLineArg", { enumerable: true, get: function () { return jsexchange_2.KLineArg; } });
Object.defineProperty(exports, "Monitor", { enumerable: true, get: function () { return jsexchange_2.Monitor; } });
Object.defineProperty(exports, "SymbolArg", { enumerable: true, get: function () { return jsexchange_2.SymbolArg; } });
Object.defineProperty(exports, "Ticker", { enumerable: true, get: function () { return jsexchange_2.Ticker; } });
Object.defineProperty(exports, "TickerArg", { enumerable: true, get: function () { return jsexchange_2.TickerArg; } });
Object.defineProperty(exports, "Balance", { enumerable: true, get: function () { return jsexchange_2.Balance; } });
Object.defineProperty(exports, "NewWalletArg", { enumerable: true, get: function () { return jsexchange_2.NewWalletArg; } });
Object.defineProperty(exports, "LoadBalanceArg", { enumerable: true, get: function () { return jsexchange_2.LoadBalanceArg; } });
Object.defineProperty(exports, "Holding", { enumerable: true, get: function () { return jsexchange_2.Holding; } });
Object.defineProperty(exports, "LoadHoldingArg", { enumerable: true, get: function () { return jsexchange_2.LoadHoldingArg; } });
Object.defineProperty(exports, "OrderRequest", { enumerable: true, get: function () { return jsexchange_2.OrderRequest; } });
Object.defineProperty(exports, "OrderResponse", { enumerable: true, get: function () { return jsexchange_2.OrderResponse; } });
Object.defineProperty(exports, "CancelOrderArg", { enumerable: true, get: function () { return jsexchange_2.CancelOrderArg; } });
Object.defineProperty(exports, "QueryOrderArg", { enumerable: true, get: function () { return jsexchange_2.QueryOrderArg; } });
Object.defineProperty(exports, "ListOrderArg", { enumerable: true, get: function () { return jsexchange_2.ListOrderArg; } });
Object.defineProperty(exports, "WalletEvent", { enumerable: true, get: function () { return jsexchange_2.WalletEvent; } });
Object.defineProperty(exports, "WalletEvents", { enumerable: true, get: function () { return jsexchange_2.WalletEvents; } });
Object.defineProperty(exports, "WalletPositions", { enumerable: true, get: function () { return jsexchange_2.WalletPositions; } });
Object.defineProperty(exports, "OrderOffsets", { enumerable: true, get: function () { return jsexchange_2.OrderOffsets; } });
Object.defineProperty(exports, "OrderSides", { enumerable: true, get: function () { return jsexchange_2.OrderSides; } });
Object.defineProperty(exports, "OrderStatuses", { enumerable: true, get: function () { return jsexchange_2.OrderStatuses; } });
Object.defineProperty(exports, "OrderTypes", { enumerable: true, get: function () { return jsexchange_2.OrderTypes; } });
const jswrapper_1 = require("jswrapper");
var jswrapper_2 = require("jswrapper");
Object.defineProperty(exports, "Message", { enumerable: true, get: function () { return jswrapper_2.Message; } });
Object.defineProperty(exports, "MessageTypes", { enumerable: true, get: function () { return jswrapper_2.MessageTypes; } });
const jslog_1 = require("jslog");
var jslog_2 = require("jslog");
Object.defineProperty(exports, "LogItem", { enumerable: true, get: function () { return jslog_2.LogItem; } });
Object.defineProperty(exports, "LogType", { enumerable: true, get: function () { return jslog_2.LogType; } });
Object.defineProperty(exports, "LogEncode", { enumerable: true, get: function () { return jslog_2.LogEncode; } });
Object.defineProperty(exports, "LogRemoveArg", { enumerable: true, get: function () { return jslog_2.LogRemoveArg; } });
Object.defineProperty(exports, "LogShowArg", { enumerable: true, get: function () { return jslog_2.LogShowArg; } });
(0, log4js_1.configure)({
    appenders: {
        out: {
            type: 'console',
            layout: {
                type: 'pattern',
                pattern: '%d %p %c %m'
            }
        }
    },
    categories: { default: { appenders: ['out'], level: 'info' } }
});
const log = (0, log4js_1.getLogger)("boot.ts");
//check env
if (!process.env.MARKET_SERVER) {
    throw "env.MARKET_SERVER is required";
}
if (!process.env.WALLET_SERVER) {
    throw "env.WALLET_SERVER is required";
}
if (!process.env.WRAPPER_SERVER) {
    throw "env.WRAPPER_SERVER is required";
}
var allConf = {
    marketServer: process.env.MARKET_SERVER,
    walletServer: process.env.WALLET_SERVER,
    walletConfigFile: process.env.WALLET_CONFIG_FILE,
    wrapperServer: process.env.WRAPPER_SERVER,
    logServer: process.env.LOG_SERVER,
    logToken: process.env.LOG_TOKEN,
    configFile: process.env.CONFIG_FILE,
    testing: process.env.TESTING,
};
log.info(`runner using market server by ${allConf.marketServer}`);
var marketSrv = new jsexchange_1.Market(allConf.marketServer);
log.info(`runner using wallet server by ${allConf.walletServer}`);
var walletSrv = new jsexchange_1.WalletManager(allConf.walletServer);
log.info(`runner using message server by ${allConf.wrapperServer}`);
var messageSrv = new jswrapper_1.MessageQueue(allConf.wrapperServer);
log.info(`runner using log server by ${allConf.logServer}`);
var logSrv = new jslog_1.LogPersister(allConf.logServer, allConf.logToken);
function readJSON(filename) {
    let rawdata = (0, fs_1.readFileSync)(filename);
    return JSON.parse(rawdata.toString());
}
//setup conf
exports.Config = {};
if (allConf.configFile) {
    allConf.config = readJSON(allConf.configFile);
    Object.assign(exports.Config, allConf.config);
}
//setup log
exports.Log = logSrv;
//setup market
exports.Market = marketSrv;
//setup wrapper
exports.MQ = messageSrv;
//setup wallet
if (allConf.walletConfigFile) {
    allConf.wallet = readJSON(allConf.walletConfigFile);
}
class WalletInfo {
    constructor() {
        this.Wallets = [];
    }
}
exports.WalletInfo = WalletInfo;
function LoadWallet() {
    return __awaiter(this, void 0, void 0, function* () {
        var info = new WalletInfo();
        if (!allConf.wallet || !allConf.wallet.wallets || !allConf.wallet.wallets.length) {
            return info;
        }
        for (var i = 0; i < allConf.wallet.wallets.length; i++) {
            var wc = allConf.wallet.wallets[i];
            var w = yield walletSrv.create(wc);
            // var w = walletConf;
            if (!info.Wallet) {
                info.Wallet = w;
            }
            info.Wallets.push(w);
        }
        log.info(`load ${info.Wallets.length} wallet success`);
        return info;
    });
}
exports.LoadWallet = LoadWallet;
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            if (allConf.testing) {
                resolve();
                return;
            }
            setTimeout(resolve, ms);
        });
    });
}
exports.sleep = sleep;
/**
 * 系统定义key
 */
var LogKeys;
(function (LogKeys) {
    /** 系统日志 */
    LogKeys["SysLog"] = "sys-log";
    /** 系统状态 */
    LogKeys["State"] = "state";
    /** 收益曲线 */
    LogKeys["Profit"] = "profit";
})(LogKeys = exports.LogKeys || (exports.LogKeys = {}));
var LogShows;
(function (LogShows) {
    LogShows["Log"] = "log";
    LogShows["Line"] = "line";
    LogShows["HTML"] = "html";
})(LogShows = exports.LogShows || (exports.LogShows = {}));
class SysLogContentValue {
}
exports.SysLogContentValue = SysLogContentValue;
class SysLogContent {
}
exports.SysLogContent = SysLogContent;
function LogInfo(type, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return LogAdd("info", type, data);
    });
}
exports.LogInfo = LogInfo;
function LogWarn(type, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return LogAdd("warn", type, data);
    });
}
exports.LogWarn = LogWarn;
function LogError(type, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return LogAdd("error", type, data);
    });
}
exports.LogError = LogError;
function LogAdd(level, type, data) {
    return __awaiter(this, void 0, void 0, function* () {
        var content = new SysLogContent();
        if (type instanceof SysLogContentValue) {
            content.type = type;
        }
        else if (typeof type === 'string' || type instanceof String) {
            content.type = {
                value: type,
                style: "",
            };
        }
        else {
            content.type = {
                value: JSON.stringify(type),
                style: "",
            };
        }
        if (content.type.style === "" && level !== "") {
            switch (level) {
                case "info":
                    content.type.style = "background-color: #090; color: #FFF;";
                    break;
                case "warn":
                    content.type.style = "background-color: #099; color: #FFF;";
                    break;
                case "error":
                    content.type.style = "background-color: #900; color: #FFF;";
                    break;
            }
        }
        if (data instanceof SysLogContentValue) {
            content.data = data;
        }
        else if (typeof data === 'string' || data instanceof String) {
            content.data = {
                value: data,
                style: "",
            };
        }
        else {
            content.data = {
                value: JSON.stringify(data),
                style: "",
            };
        }
        content.time = new Date().getTime();
        return exports.Log.add({
            key: LogKeys.SysLog,
            show: LogShows.Log,
            type: jslog_1.LogType.List,
            encode: jslog_1.LogEncode.JSON,
            content: JSON.stringify(content),
        });
    });
}
exports.LogAdd = LogAdd;
function LogClear() {
    return __awaiter(this, void 0, void 0, function* () {
        return exports.Log.clear({
            type: jslog_1.LogType.List,
            key: LogKeys.SysLog,
        });
    });
}
exports.LogClear = LogClear;
function LogState(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        var content = {
            title: {
                text: '状态',
            },
            content: "<div>" + args.join(" ").replace(/\n/g, "<br/>") + "</div>",
        };
        return exports.Log.set({
            key: LogKeys.State,
            show: LogShows.HTML,
            type: jslog_1.LogType.Object,
            encode: jslog_1.LogEncode.JSON,
            content: JSON.stringify(content),
        });
    });
}
exports.LogState = LogState;
function LogStateClear() {
    return __awaiter(this, void 0, void 0, function* () {
        return exports.Log.unset({
            type: jslog_1.LogType.Object,
            key: LogKeys.State,
        });
    });
}
exports.LogStateClear = LogStateClear;
function LogProfit(value) {
    return __awaiter(this, void 0, void 0, function* () {
        var content = {
            title: {
                text: '收益曲线',
            },
            x: new Date().toLocaleString(undefined, {
                month: "2-digit", day: "2-digit",
                hour: "2-digit", minute: "2-digit", second: "2-digit"
            }),
            y: value,
        };
        return exports.Log.add({
            key: LogKeys.Profit,
            show: LogShows.Line,
            type: jslog_1.LogType.List,
            encode: jslog_1.LogEncode.JSON,
            content: JSON.stringify(content),
        });
    });
}
exports.LogProfit = LogProfit;
function LogProfitClear() {
    return __awaiter(this, void 0, void 0, function* () {
        return exports.Log.clear({
            type: jslog_1.LogType.List,
            key: LogKeys.Profit,
        });
    });
}
exports.LogProfitClear = LogProfitClear;
function LogShow(message) {
    return __awaiter(this, void 0, void 0, function* () {
        return exports.Log.show({ message: message });
    });
}
exports.LogShow = LogShow;
