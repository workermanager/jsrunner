export * from "./std";
export * from "./big";
export { getLogger as NewLogger } from "log4js";
import { Market as MarketClass, Wallet as WalletClass } from "jsexchange";
export { Depth, DepthArg, KLine, KLineArg, Monitor, SymbolArg, Ticker, TickerArg, Balance, NewWalletArg, LoadBalanceArg, Holding, LoadHoldingArg, OrderRequest, OrderResponse, CancelOrderArg, QueryOrderArg, ListOrderArg, WalletEvent, WalletEvents, WalletPositions, OrderOffsets, OrderSides, OrderStatuses, OrderTypes } from "jsexchange";
import { MessageQueue } from "jswrapper";
export { Message, MessageTypes } from "jswrapper";
import { LogPersister } from "jslog";
export { LogItem, LogType, LogEncode, LogRemoveArg, LogShowArg } from "jslog";
export declare var Config: any;
export declare const Log: LogPersister;
export declare var Market: MarketClass;
export declare var MQ: MessageQueue;
export declare class WalletInfo {
    Wallet: WalletClass;
    Wallets: WalletClass[];
}
export declare function LoadWallet(): Promise<WalletInfo>;
export declare function sleep(ms: number): Promise<void>;
/**
 * 系统定义key
 */
export declare enum LogKeys {
    /** 系统日志 */
    SysLog = "sys-log",
    /** 系统状态 */
    State = "state",
    /** 收益曲线 */
    Profit = "profit"
}
export declare enum LogShows {
    Log = "log",
    Line = "line",
    HTML = "html"
}
export declare class SysLogContentValue {
    value: string;
    style?: string;
}
export declare class SysLogContent {
    type: SysLogContentValue;
    data: SysLogContentValue;
    time: number;
}
export declare function LogInfo(type: any, data: any): Promise<boolean>;
export declare function LogWarn(type: any, data: any): Promise<boolean>;
export declare function LogError(type: any, data: any): Promise<boolean>;
export declare function LogAdd(level: string, type: any, data: any): Promise<boolean>;
export declare function LogClear(): Promise<boolean>;
export declare function LogState(...args: string[]): Promise<boolean>;
export declare function LogStateClear(): Promise<boolean>;
export declare function LogProfit(value: number): Promise<boolean>;
export declare function LogProfitClear(): Promise<boolean>;
export declare function LogShow(message: string): Promise<boolean>;
//# sourceMappingURL=index.d.ts.map