import { Big } from "big.js";

export class MathBig {
    public static min(...vals: any[]): Big {
        var v = Big(vals[0]);
        vals.forEach((i) => {
            if (v.gt(i)) {
                v = Big(i);
            }
        });
        return v;
    }
    public static max(...vals: any[]): Big {
        var v = Big(vals[0]);
        vals.forEach((i) => {
            if (v.lt(i)) {
                v = Big(i);
            }
        });
        return v;
    }
}