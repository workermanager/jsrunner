"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
const terra_js_1 = require("@terra-money/terra.js");
const app = (0, express_1.default)();
const PORT = parseInt(process.env.LISTEN_PORT || "30800");
const ADDR = process.env.LISTEN_ADDR || "127.0.0.1";
const ExchangeTypeSP = "tr-sp";
class Symbol {
}
class WalletInfo {
}
var Symbols = [
    {
        ex: ExchangeTypeSP,
        base: "LUNA",
        quote: "UST",
        addr: "terra1tndcaqxkpc5ce9qee5ggqf430mr2z3pefe5wj6",
        symbol: ExchangeTypeSP + ".LUNAUST",
    }
];
function loadSymbol(symbol) {
    for (var i = 0; i < Symbols.length; i++) {
        const s = Symbols[i];
        if (s.symbol == symbol) {
            return s;
        }
    }
    return undefined;
}
var LCD;
var Wallets = new Map();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get("/listSymbol", (req, res) => res.json(Symbols));
app.get("/listTicker", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var tickers = {};
        for (var i = 0; i < Symbols.length; i++) {
            const symbol = Symbols[i];
            const { assets } = yield LCD.wasm.contractQuery(symbol.addr, { pool: {} });
            const beliefPrice = (assets[0].amount / assets[1].amount).toFixed(6); // Calculate belief price using proportion of pool balances.
            tickers[symbol.symbol] = {
                "symbol": symbol.symbol,
                "bid_price": beliefPrice,
                "bid_qty": 0,
                "ask_price": beliefPrice,
                "ask_qty": 0,
                "close_price": beliefPrice,
                "create_time": new Date().getTime(),
            };
        }
        res.json(tickers);
    }
    catch (e) {
        console.log((e.response && e.response.data) || e);
        res.status(500).send((e.response && e.response.data) || e.message + "\n" + e.stack);
    }
}));
app.post("/newWallet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addr = req.body['addr'];
        const mnemonic = req.body['mnemonic'];
        if (!addr || !mnemonic) {
            throw "addr/mnemonic is required";
        }
        const mk = new terra_js_1.MnemonicKey({ mnemonic: mnemonic });
        const wallet = LCD.wallet(mk);
        Wallets.set(addr, {
            addr: addr,
            wallet: wallet,
            key: mk,
        });
        res.json({ code: 0 });
    }
    catch (e) {
        console.log((e.response && e.response.data) || e);
        res.status(500).send((e.response && e.response.data) || e.message + "\n" + e.stack);
    }
}));
app.get("/listBalance", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addr = req.query['addr'];
        if (!addr) {
            throw "addr is required";
        }
        const [coins] = yield LCD.bank.balance(addr);
        const coinsList = coins.toArray();
        var balances = {};
        for (var i = 0; i < coinsList.length; i++) {
            const coin = coinsList[i];
            var asset = coin.denom;
            switch (asset) {
                case "uluna":
                    asset = "LUNA";
                    break;
                case "uusd":
                    asset = "UST";
                    break;
            }
            balances[asset] = {
                asset: asset,
                free: coin.amount.toNumber() / 1e+6,
                volume: coin.amount.toNumber() / 1e+6,
            };
        }
        res.json(balances);
    }
    catch (e) {
        console.log((e.response && e.response.data) || e);
        res.status(500).send((e.response && e.response.data) || e.message + "\n" + e.stack);
    }
}));
app.get("/withdraw", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addr = req.query['addr'];
        const asset = req.query['asset'];
        const to = req.query['to'];
        const quantityS = req.query['quantity'];
        const code = req.query['code'];
        if (!addr || !asset || !to || !quantityS || !code) {
            throw "addr/asset/to/quantity/code is required";
        }
        const wallet = Wallets.get(addr);
        if (!wallet) {
            throw `wallet is not exists by ${addr}`;
        }
        var denom = "";
        switch (asset) {
            case "UST":
                denom = "uusd";
                break;
            case "LUNA":
                denom = "uluna";
                break;
        }
        if (denom.length < 1) {
            throw `denom is not supported ${denom}`;
        }
        const quantity = (parseFloat(quantityS) * 1e+6);
        const coins = new terra_js_1.Coins();
        coins.set(denom, quantity);
        const msg = new terra_js_1.MsgSend(wallet.key.accAddress, to, coins);
        const tx = yield wallet.wallet.createAndSignTx({ msgs: [msg], memo: code, feeDenoms: [denom] });
        const result = yield LCD.tx.broadcast(tx);
        res.json(result);
    }
    catch (e) {
        console.log((e.response && e.response.data) || e);
        res.status(500).send((e.response && e.response.data) || e.message + "\n" + e.stack);
    }
}));
app.get("/placeOrder", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addr = req.query['addr'];
        const side = req.query['side'];
        const symbol = req.query['symbol'];
        const quantityS = req.query['quantity'];
        const priceS = req.query['price'];
        if (!addr || !side || !symbol || !quantityS || !priceS) {
            throw "addr/side/symbol/quantity/price is required";
        }
        const wallet = Wallets.get(addr);
        if (!wallet) {
            throw `wallet is not exists by ${addr}`;
        }
        const pool = loadSymbol(symbol);
        if (!pool) {
            throw `symbol is not exists by ${symbol}`;
        }
        var denom = "";
        if (side == "Buy") {
            switch (pool.quote) {
                case "UST":
                    denom = "uusd";
            }
        }
        else {
            switch (pool.base) {
                case "LUNA":
                    denom = "uluna";
            }
        }
        if (denom.length < 1) {
            throw `denom is not supported ${denom}`;
        }
        const quantity = (parseFloat(quantityS) * 1e+6).toFixed(0);
        const price = (parseFloat(priceS) * 1e+6).toFixed(6);
        const coins = new terra_js_1.Coins();
        coins.set(denom, quantity);
        const msg = new terra_js_1.MsgExecuteContract(wallet.key.accAddress, pool.addr, {
            swap: {
                max_spread: "0.001",
                offer_asset: {
                    info: {
                        native_token: {
                            denom: denom,
                        },
                    },
                    amount: `${quantity}`,
                },
                belief_price: price,
            },
        }, coins);
        const tx = yield wallet.wallet.createAndSignTx({ msgs: [msg], feeDenoms: [denom] });
        const result = yield LCD.tx.broadcast(tx);
        res.json(result);
    }
    catch (e) {
        console.log((e.response && e.response.data) || e);
        res.status(500).send((e.response && e.response.data) || e.message + "\n" + e.stack);
    }
}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const gasPrices = yield (yield (0, isomorphic_fetch_1.default)('https://fcd.terra.dev/v1/txs/gas_prices')).json();
    LCD = new terra_js_1.LCDClient({
        URL: "https://fcd.terra.dev/",
        chainID: "columbus-5",
        gasPrices: new terra_js_1.Coins(gasPrices),
        gasAdjustment: "1.5",
    });
    app.listen(PORT, ADDR, () => {
        console.log(`terra server started at http://${ADDR}:${PORT}`);
    });
}))();
