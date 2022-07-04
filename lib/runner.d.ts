import { BootstrapArg } from "./define";
export declare class Runner {
    client: any;
    constructor(server: string);
    stop(): void;
    bootstrap(arg: BootstrapArg): Promise<void>;
}
//# sourceMappingURL=runner.d.ts.map