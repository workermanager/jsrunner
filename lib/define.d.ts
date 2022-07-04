/**
 * 消息通知类型
 */
export declare enum MessageTypes {
    /** 策略交互 */
    Notify = 100,
    /** 外部通知 */
    Hook = 200
}
/**
 * 消息对象
 */
export declare class Message {
    /** 消息类型，MessageTypes定义 */
    type: number;
    /** 消息关键词，策略交互时为用户定义的key，外部通知时为url路径 */
    key: string;
    /** 消息内容，策略交互时为用户定义的value，外部通知时为get的query参数或post的body */
    value: string;
}
export declare class Monitor {
    raw: any;
    constructor(raw: any);
    cancel(): void;
}
export declare class BootstrapArg {
    markets?: any;
}
//# sourceMappingURL=define.d.ts.map