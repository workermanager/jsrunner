"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathBig = void 0;
const big_js_1 = require("big.js");
class MathBig {
    static min(...vals) {
        var v = (0, big_js_1.Big)(vals[0]);
        vals.forEach((i) => {
            if (v.gt(i)) {
                v = (0, big_js_1.Big)(i);
            }
        });
        return v;
    }
    static max(...vals) {
        var v = (0, big_js_1.Big)(vals[0]);
        vals.forEach((i) => {
            if (v.lt(i)) {
                v = (0, big_js_1.Big)(i);
            }
        });
        return v;
    }
}
exports.MathBig = MathBig;
