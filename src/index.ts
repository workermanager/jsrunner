export * from "./std"
export * from "./big"
export * from "./define"
export * from "./message"
import { readFileSync } from "fs"
import { configure as confLogger, getLogger } from "log4js";
import * as jsonc from "jsonc-parser"
export { getLogger as NewLogger } from "log4js";
import { Market as MarketClass, Wallet as WalletClass, WalletManager } from "jsexchange"
export {
    Depth, DepthArg, KLine, KLineArg, Monitor, SymbolArg, Ticker, TickerArg,
    Balance, NewWalletArg, LoadBalanceArg, Holding, LoadHoldingArg,
    OrderRequest, OrderResponse, CancelOrderArg, QueryOrderArg, ListOrderArg, WalletEvent,
    WalletEvents, WalletPositions, OrderOffsets, OrderSides, OrderStatuses, OrderTypes,
    WithdrawArg, Tx
} from "jsexchange"
import { MessageQueue } from "./message"
import { LogEncode, LogPersister, LogType } from "jslog"
import { Runner } from "./runner"
import { BootstrapArg } from "./define"
export { LogItem, LogType, LogEncode, LogRemoveArg, LogShowArg } from "jslog"

confLogger({
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
const log = getLogger("boot.ts");

//check env
if (!process.env.MARKET_SERVER) {
    throw "env.MARKET_SERVER is required";
}
if (!process.env.WALLET_SERVER) {
    throw "env.WALLET_SERVER is required";
}
if (!process.env.MESSAGE_SERVER) {
    throw "env.MESSAGE_SERVER is required";
}
if (!process.env.RUNNER_SERVER) {
    throw "env.RUNNER_SERVER is required";
}
var allConf: any = {
    marketServer: process.env.MARKET_SERVER,
    walletServer: process.env.WALLET_SERVER,
    walletConfigFile: process.env.WALLET_CONFIG_FILE,
    messageServer: process.env.MESSAGE_SERVER,
    logServer: process.env.LOG_SERVER,
    runnerServer: process.env.RUNNER_SERVER,
    logToken: process.env.LOG_TOKEN,
    configFile: process.env.CONFIG_FILE,
    testing: process.env.TESTING,
}

log.info(`runner using market server by ${allConf.marketServer}`);
var marketSrv = new MarketClass(allConf.marketServer)
log.info(`runner using wallet server by ${allConf.walletServer}`);
var walletSrv = new WalletManager(allConf.walletServer);
log.info(`runner using message server by ${allConf.messageServer}`);
var messageSrv = new MessageQueue(allConf.messageServer);
log.info(`runner using log server by ${allConf.logServer}`);
var logSrv = new LogPersister(allConf.logServer, allConf.logToken);
log.info(`runner using runner server by ${allConf.runnerServer}`);
var runnerSrv = new Runner(allConf.runnerServer);

function readJSON(filename: string): any {
    let rawdata = readFileSync(filename);
    return jsonc.parse(rawdata.toString());
}

export function ReadJSONMeta(filename: string): any {
    let rawdata = readFileSync(filename).toString();
    var result: any = {};
    var preComment = "";
    var preProperty = ""
    jsonc.visit(rawdata, {
        onComment: (offset: number, length: number) => preComment = rawdata.substring(offset, offset + length),
        onObjectProperty: (property: string) => preProperty = property,
        onLiteralValue: (value: any) => {
            if (preProperty) {
                preComment = preComment.trim();
                preComment = preComment.replace(/^\/[\/\*]+/, "")
                preComment = preComment.replace(/[\*]+\/$/, "")
                preComment = preComment.trim();
                var selected = preComment.match(/\@Selected\(.*\)/);
                var selectedValue = selected && selected.length && selected[0];
                if (selectedValue) {
                    selectedValue = selectedValue.replace(/^\@Selected\(/, "")
                    selectedValue = selectedValue.replace(/\)$/, "")
                }
                result[preProperty] = {
                    value: value,
                    type: typeof value,
                    comment: preComment,
                    selected: selectedValue,
                }
            }
            preComment = "";
            preProperty = "";
        },
    });
    return result;
}

//setup conf
export var Config: any = {};
if (allConf.configFile) {
    allConf.config = readJSON(allConf.configFile);
    Object.assign(Config, allConf.config);
}

//setup log
export const Log = logSrv;

//setup market
export const Market = marketSrv;

//setup message
export const MQ = messageSrv;

//setup wallet
export const WM = walletSrv;

//setup wallet
export var WalletConfig: any = {};
if (allConf.walletConfigFile) {
    WalletConfig = readJSON(allConf.walletConfigFile);
}

export class WalletInfo {
    Wallet: WalletClass;
    Wallets: WalletClass[] = [];
}

export async function Bootstrap(arg: BootstrapArg): Promise<void> {
    await runnerSrv.bootstrap(arg);
}

export async function LoadWallet(): Promise<WalletInfo> {
    var info = new WalletInfo();
    if (!WalletConfig || !WalletConfig.wallets || !WalletConfig.wallets.length) {
        return info;
    }
    for (var i = 0; i < WalletConfig.wallets.length; i++) {
        var wc = WalletConfig.wallets[i];
        var w = await walletSrv.create(wc);
        // var w = walletConf;
        if (!info.Wallet) {
            info.Wallet = w;
        }
        info.Wallets.push(w);
    }
    log.info(`load ${info.Wallets.length} wallet success`);
    return info;
}

export async function sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
        if (allConf.testing) {
            resolve();
            return;
        }
        setTimeout(resolve, ms);
    });
}

/**
 * 系统定义key
 */
export enum LogKeys {
    /** 系统日志 */
    SysLog = "sys-log",
    /** 系统状态 */
    State = "state",
    /** 收益曲线 */
    Profit = "profit"
}

export enum LogShows {
    Log = "log",
    Line = "line",
    HTML = "html",
}

export class SysLogContentValue {
    value: string;
    style?: string;
}

export class SysLogContent {
    type: SysLogContentValue;
    data: SysLogContentValue;
    time: number;
}


export async function LogInfo(type: any, data: any) {
    return LogAdd("info", type, data);
}

export async function LogWarn(type: any, data: any) {
    return LogAdd("warn", type, data);
}

export async function LogError(type: any, data: any) {
    return LogAdd("error", type, data);
}


export async function LogAdd(level: string, type: any, data: any): Promise<boolean> {
    var content = new SysLogContent();
    if (type instanceof SysLogContentValue) {
        content.type = type;
    } else if (typeof type === 'string' || type instanceof String) {
        content.type = {
            value: type as string,
            style: "",
        }
    } else {
        content.type = {
            value: JSON.stringify(type),
            style: "",
        }
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
                content.type.style = "background-color: #900; color: #FFF;"
                break;
        }
    }
    if (data instanceof SysLogContentValue) {
        content.data = data;
    } else if (typeof data === 'string' || data instanceof String) {
        content.data = {
            value: data as string,
            style: "",
        }
    } else {
        content.data = {
            value: JSON.stringify(data),
            style: "",
        }
    }
    content.time = new Date().getTime();
    return Log.add({
        key: LogKeys.SysLog,
        show: LogShows.Log,
        type: LogType.List,
        encode: LogEncode.JSON,
        content: JSON.stringify(content),
    })
}

export async function LogClear() {
    return Log.clear({
        type: LogType.List,
        key: LogKeys.SysLog,
    });
}

export async function LogState(...args: string[]): Promise<boolean> {
    var content = {
        title: {
            text: '状态',
        },
        content: "<div>" + args.join(" ").replace(/\n/g, "<br/>") + "</div>",
    };
    return Log.set({
        key: LogKeys.State,
        show: LogShows.HTML,
        type: LogType.Object,
        encode: LogEncode.JSON,
        content: JSON.stringify(content),
    })
}

export async function LogPrintState(...args: string[]): Promise<boolean> {
    console.log(...args);
    return await LogState(...args);
}

export async function LogStateClear() {
    return Log.unset({
        type: LogType.Object,
        key: LogKeys.State,
    });
}

export async function LogProfit(value: number): Promise<boolean> {
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
    return Log.add({
        key: LogKeys.Profit,
        show: LogShows.Line,
        type: LogType.List,
        encode: LogEncode.JSON,
        content: JSON.stringify(content),
    })
}


export async function LogProfitClear() {
    return Log.clear({
        type: LogType.List,
        key: LogKeys.Profit,
    });
}

export async function LogShow(message: string): Promise<boolean> {
    return Log.show({ message: message });
}