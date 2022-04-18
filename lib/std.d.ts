export declare class STD {
    static _skip(arr: number[], period: number): number;
    static _sum(arr: number[], num: number): number;
    static _avg(arr: number[], num: number): number;
    static _zeros(len: number): number[];
    static _set(arr: number[], start: number, end: number, value: number): void;
    static _diff(a: number[], b: number[]): number[];
    static _move_diff(a: number[]): number[];
    static _sma(S: number[], period: number): number[];
    static _smma(S: number[], period: number): number[];
    static _ema(S: number[], period: number): number[];
    static _cmp(arr: number[], start: number, end: number, cmpFunc: (a: number, b: number) => number): number;
    static _filt(records: number[] | any[], n: number, attr: string | undefined, iv: number, cmpFunc: (a: number, b: number) => number): number;
    static _ticks(records: any[]): any[];
}
export declare class TA {
    static Highest(records: number[] | any[], n: number, attr: string | undefined): number;
    static Lowest(records: number[] | any[], n: number, attr: string | undefined): number;
    static MA(records: number[] | any[], period: number | undefined): number[];
    static SMA(records: number[] | any[], period: number | undefined): number[];
    static EMA(records: number[] | any[], period: number | undefined): number[];
    static MACD(records: number[] | any[], fastEMA: number | undefined, slowEMA: number | undefined, signalEMA: number | undefined): number[][];
    static BOLL(records: number[] | any[], period: number | undefined, multiplier: number | undefined): number[][];
    static KDJ(records: number[] | any[], n: number | undefined, k: number | undefined, d: number | undefined): number[][];
    static RSI(records: number[] | any[], period: number | undefined): number[];
    static OBV(records: any[]): number[];
    static ATR(records: any[], period: number | undefined): number[];
    static Alligator(records: any[], jawLength: number | undefined, teethLength: number | undefined, lipsLength: number | undefined): number[][];
    static CMF(records: any[], periods: number | undefined): number[];
}
//# sourceMappingURL=std.d.ts.map