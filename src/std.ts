

export class STD {
    public static _skip(arr: number[], period: number): number {
        var j = 0;
        for (var k = 0; j < arr.length; j++) {
            if (!isNaN(arr[j]))
                k++;
            if (k == period)
                break;
        }
        return j;
    }
    public static _sum(arr: number[], num: number): number {
        var sum = 0.0;
        for (var i = 0; i < num; i++) {
            if (!isNaN(arr[i])) {
                sum += arr[i];
            }
        }
        return sum;
    }
    public static _avg(arr: number[], num: number): number {
        var n = 0;
        var sum = 0.0;
        for (var i = 0; i < num; i++) {
            if (!isNaN(arr[i])) {
                sum += arr[i];
                n++;
            }
        }
        return sum / n;
    }
    public static _zeros(len: number): number[] {
        var n = [];
        for (var i = 0; i < len; i++) {
            n.push(0.0);
        }
        return n;
    }
    public static _set(arr: number[], start: number, end: number, value: number) {
        var e = Math.min(arr.length, end);
        for (var i = start; i < e; i++) {
            arr[i] = value;
        }
    }
    public static _diff(a: number[], b: number[]): number[] {
        var d = [];
        for (var i = 0; i < b.length; i++) {
            if (isNaN(a[i]) || isNaN(b[i])) {
                d.push(NaN);
            } else {
                d.push(a[i] - b[i]);
            }
        }
        return d;
    }
    public static _move_diff(a: number[]) {
        var d = [];
        for (var i = 1; i < a.length; i++) {
            d.push(a[i] - a[i - 1]);
        }
        return d;
    }
    public static _sma(S: number[], period: number): number[] {
        var R = STD._zeros(S.length);
        var j = STD._skip(S, period);
        STD._set(R, 0, j, NaN);
        if (j < S.length) {
            var sum = 0;
            for (var i = j; i < S.length; i++) {
                if (i == j) {
                    sum = STD._sum(S, i + 1);
                } else {
                    sum += S[i] - S[i - period];
                }
                R[i] = sum / period;
            }
        }
        return R;
    }
    public static _smma(S: number[], period: number): number[] {
        var R = STD._zeros(S.length);
        var j = STD._skip(S, period);
        STD._set(R, 0, j, NaN);
        if (j < S.length) {
            R[j] = STD._avg(S, j + 1);
            for (var i = j + 1; i < S.length; i++) {
                R[i] = (R[i - 1] * (period - 1) + S[i]) / period;
            }
        }
        return R;
    }
    public static _ema(S: number[], period: number): number[] {
        var R = STD._zeros(S.length);
        var multiplier = 2.0 / (period + 1);
        var j = STD._skip(S, period);
        STD._set(R, 0, j, NaN);
        if (j < S.length) {
            R[j] = STD._avg(S, j + 1);
            for (var i = j + 1; i < S.length; i++) {
                R[i] = ((S[i] - R[i - 1]) * multiplier) + R[i - 1];
            }
        }
        return R;
    }
    public static _cmp(arr: number[], start: number, end: number, cmpFunc: (a: number, b: number) => number): number {
        var v = arr[start];
        for (var i = start; i < end; i++) {
            v = cmpFunc(arr[i], v);
        }
        return v;
    }
    public static _filt(records: number[] | any[], n: number, attr: string | undefined, iv: number, cmpFunc: (a: number, b: number) => number) {
        if (records.length < 2) {
            return NaN;
        }
        var v = iv;
        var pos = n !== 0 ? records.length - Math.min(records.length - 1, n) - 1 : 0;
        for (var i = records.length - 2; i >= pos; i--) {
            if (typeof (attr) !== 'undefined') {
                v = cmpFunc(v, records[i][attr]);
            } else {
                v = cmpFunc(v, records[i]);
            }
        }
        return v;
    }
    public static _ticks(records: any[]): any[] {
        if (records.length === 0) {
            return [];
        }
        var ticks = [];
        if (typeof (records[0].close) !== 'undefined') {
            for (var i = 0; i < records.length; i++) {
                ticks.push(records[i].close);
            }
        } else {
            ticks = records;
        }
        return ticks;
    }
}

export class TA {
    public static Highest(records: number[] | any[], n: number, attr: string | undefined): number {
        return STD._filt(records, n, attr, Number.MIN_VALUE, Math.max);
    }
    public static Lowest(records: number[] | any[], n: number, attr: string | undefined): number {
        return STD._filt(records, n, attr, Number.MAX_VALUE, Math.min);
    }
    public static MA(records: number[] | any[], period: number | undefined): number[] {
        period = typeof (period) === 'undefined' ? 9 : period;
        return STD._sma(STD._ticks(records), period);
    }
    public static SMA(records: number[] | any[], period: number | undefined): number[] {
        period = typeof (period) === 'undefined' ? 9 : period;
        return STD._sma(STD._ticks(records), period);
    }
    public static EMA(records: number[] | any[], period: number | undefined): number[] {
        period = typeof (period) === 'undefined' ? 9 : period;
        return STD._ema(STD._ticks(records), period);
    }
    public static MACD(records: number[] | any[], fastEMA: number | undefined, slowEMA: number | undefined, signalEMA: number | undefined): number[][] {
        fastEMA = typeof (fastEMA) === 'undefined' ? 12 : fastEMA;
        slowEMA = typeof (slowEMA) === 'undefined' ? 26 : slowEMA;
        signalEMA = typeof (signalEMA) === 'undefined' ? 9 : signalEMA;
        var ticks = STD._ticks(records);
        var slow = STD._ema(ticks, slowEMA);
        var fast = STD._ema(ticks, fastEMA);
        // DIF
        var dif = STD._diff(fast, slow);
        // DEA
        var signal = STD._ema(dif, signalEMA);
        var histogram = STD._diff(dif, signal);
        return [dif, signal, histogram];
    }
    public static BOLL(records: number[] | any[], period: number | undefined, multiplier: number | undefined): number[][] {
        period = typeof (period) === 'undefined' ? 20 : period;
        multiplier = typeof (multiplier) === 'undefined' ? 2 : multiplier;
        var S = STD._ticks(records);
        for (var j = period - 1; j < S.length && isNaN(S[j]); j++);
        var UP = STD._zeros(S.length);
        var MB = STD._zeros(S.length);
        var DN = STD._zeros(S.length);
        STD._set(UP, 0, j, NaN);
        STD._set(MB, 0, j, NaN);
        STD._set(DN, 0, j, NaN);
        var sum = 0;
        for (var i = j; i < S.length; i++) {
            if (i == j) {
                for (var k = 0; k < period; k++) {
                    sum += S[k];
                }
            } else {
                sum = sum + S[i] - S[i - period];
            }
            var ma = sum / period;
            var d = 0;
            for (var k = i + 1 - period; k <= i; k++) {
                d += (S[k] - ma) * (S[k] - ma);
            }
            var stdev = Math.sqrt(d / period);
            var up = ma + (multiplier * stdev);
            var dn = ma - (multiplier * stdev);
            UP[i] = up;
            MB[i] = ma;
            DN[i] = dn;
        }
        // upper, middle, lower
        return [UP, MB, DN];
    }

    public static KDJ(records: number[] | any[], n: number | undefined, k: number | undefined, d: number | undefined): number[][] {
        n = typeof (n) === 'undefined' ? 9 : n;
        k = typeof (k) === 'undefined' ? 3 : k;
        d = typeof (d) === 'undefined' ? 3 : d;

        var RSV = STD._zeros(records.length);
        STD._set(RSV, 0, n - 1, NaN);
        var K = STD._zeros(records.length);
        var D = STD._zeros(records.length);
        var J = STD._zeros(records.length);

        var hs = STD._zeros(records.length);
        var ls = STD._zeros(records.length);
        for (var i = 0; i < records.length; i++) {
            hs[i] = records[i].high;
            ls[i] = records[i].low;
        }

        for (var i = 0; i < records.length; i++) {
            if (i >= (n - 1)) {
                var c = records[i].close;
                var h = STD._cmp(hs, i - (n - 1), i + 1, Math.max);
                var l = STD._cmp(ls, i - (n - 1), i + 1, Math.min);
                RSV[i] = 100 * ((c - l) / (h - l));
                K[i] = (1 * RSV[i] + (k - 1) * K[i - 1]) / k;
                D[i] = (1 * K[i] + (d - 1) * D[i - 1]) / d;
            } else {
                K[i] = D[i] = 50;
                RSV[i] = 0;
            }
            J[i] = 3 * K[i] - 2 * D[i];
        }
        // remove prefix
        for (var i = 0; i < n - 1; i++) {
            K[i] = D[i] = J[i] = NaN;
        }
        return [K, D, J];
    }

    public static RSI(records: number[] | any[], period: number | undefined): number[] {
        period = typeof (period) === 'undefined' ? 14 : period;
        var i;
        var n = period;
        var rsi = STD._zeros(records.length);
        STD._set(rsi, 0, rsi.length, NaN);
        if (records.length < n) {
            return rsi;
        }
        var ticks = STD._ticks(records);
        var deltas = STD._move_diff(ticks);
        var seed = deltas.slice(0, n);
        var up = 0;
        var down = 0;
        for (i = 0; i < seed.length; i++) {
            if (seed[i] >= 0) {
                up += seed[i];
            } else {
                down += seed[i];
            }
        }
        up /= n;
        down = -(down /= n);
        var rs = down != 0 ? up / down : 0;
        rsi[n] = 100 - 100 / (1 + rs);
        var delta = 0;
        var upval = 0;
        var downval = 0;
        for (i = n + 1; i < ticks.length; i++) {
            delta = deltas[i - 1];
            if (delta > 0) {
                upval = delta;
                downval = 0;
            } else {
                upval = 0;
                downval = -delta;
            }
            up = (up * (n - 1) + upval) / n;
            down = (down * (n - 1) + downval) / n;
            rs = up / down;
            rsi[i] = 100 - 100 / (1 + rs);
        }
        return rsi;
    }
    public static OBV(records: any[]): number[] {
        if (records.length === 0) {
            return [];
        }
        if (typeof (records[0].close) === 'undefined') {
            throw "argument must KLine";
        }
        var R: number[] = [];
        for (var i = 0; i < records.length; i++) {
            if (i === 0) {
                R[i] = records[i].volume;
            } else if (records[i].close >= records[i - 1].close) {
                R[i] = R[i - 1] + (records[i].volume as number);
            } else {
                R[i] = R[i - 1] - (records[i].volume as number);
            }
        }
        return R;
    }

    public static ATR(records: any[], period: number | undefined) {
        if (records.length === 0) {
            return [];
        }
        if (typeof (records[0].close) === 'undefined') {
            throw "argument must KLine";
        }
        period = typeof (period) === 'undefined' ? 14 : period;
        var R = STD._zeros(records.length);
        var sum = 0;
        var n = 0;
        for (var i = 0; i < records.length; i++) {
            var TR = 0;
            if (i == 0) {
                TR = records[i].high - records[i].low;
            } else {
                TR = Math.max(records[i].high - records[i].low, Math.abs(records[i].high - records[i - 1].close), Math.abs(records[i - 1].close - records[i].low));
            }
            sum += TR;
            if (i < period) {
                n = sum / (i + 1);
            } else {
                n = (((period - 1) * n) + TR) / period;
            }
            R[i] = n;
        }
        return R;
    }
    public static Alligator(records: any[], jawLength: number | undefined, teethLength: number | undefined, lipsLength: number | undefined) {
        jawLength = typeof (jawLength) === 'undefined' ? 13 : jawLength;
        teethLength = typeof (teethLength) === 'undefined' ? 8 : teethLength;
        lipsLength = typeof (lipsLength) === 'undefined' ? 5 : lipsLength;
        var ticks = [];
        for (var i = 0; i < records.length; i++) {
            ticks.push((records[i].high + records[i].low) / 2);
        }
        return [
            [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN].concat(STD._smma(ticks, jawLength)), // jaw (blue)
            [NaN, NaN, NaN, NaN, NaN].concat(STD._smma(ticks, teethLength)), // teeth (red)
            [NaN, NaN, NaN].concat(STD._smma(ticks, lipsLength)), // lips (green)
        ];
    }
    public static CMF(records: any[], periods: number | undefined) {
        periods = periods || 20;
        var ret = [];
        var sumD = 0;
        var sumV = 0;
        var arrD = [];
        var arrV = [];
        for (var i = 0; i < records.length; i++) {
            var d = (records[i].high == records[i].low) ? 0 : (2 * records[i].close - records[i].low - records[i].high) / (records[i].high - records[i].low) * records[i].volume;
            arrD.push(d);
            arrV.push(records[i].volume);
            sumD += d;
            sumV += records[i].volume;
            if (i >= periods) {
                sumD -= (arrD.shift() || 0);
                sumV -= (arrV.shift() || 0);
            }
            ret.push(sumD / sumV);
        }
        return ret;
    }
}