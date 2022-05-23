
import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser'
import fetch from 'isomorphic-fetch';
import { MsgSend, MnemonicKey, MsgExecuteContract, Coins, LCDClient, Wallet } from '@terra-money/terra.js';


const app: Express = express();
const PORT = parseInt(process.env.LISTEN_PORT || "30800");
const ADDR = process.env.LISTEN_ADDR || "127.0.0.1";
const ExchangeTypeSP = "tr-sp"

class Symbol {
    ex: string;
    base: string;
    quote: string;
    addr: string;
    symbol: string;
}

class WalletInfo {
    addr: string;
    wallet: Wallet;
    key: MnemonicKey;
}


var Symbols: Symbol[] = [
    {
        ex: ExchangeTypeSP,
        base: "LUNA",
        quote: "UST",
        addr: "terra1tndcaqxkpc5ce9qee5ggqf430mr2z3pefe5wj6",
        symbol: ExchangeTypeSP + ".LUNAUST",
    }
];

function loadSymbol(symbol: string): Symbol | undefined {
    for (var i = 0; i < Symbols.length; i++) {
        const s = Symbols[i];
        if (s.symbol == symbol) {
            return s;
        }
    }
    return undefined;
}

var LCD: LCDClient
var Wallets = new Map<string, WalletInfo>();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/listSymbol", (req: Request, res: Response) => res.json(Symbols));

app.get("/listTicker", async (req: Request, res: Response) => {
    try {
        var tickers: any = {};
        for (var i = 0; i < Symbols.length; i++) {
            const symbol = Symbols[i];
            const { assets } = await LCD.wasm.contractQuery(symbol.addr, { pool: {} });
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
    } catch (e: any) {
        console.log((e.response && e.response.data) || e);
        res.status(500).send((e.response && e.response.data) || e.message + "\n" + e.stack);
    }
});

app.post("/newWallet", async (req: Request, res: Response) => {
    try {
        const addr = req.body['addr'];
        const mnemonic = req.body['mnemonic'];
        if (!addr || !mnemonic) {
            throw "addr/mnemonic is required"
        }
        const mk = new MnemonicKey({ mnemonic: mnemonic });
        const wallet = LCD.wallet(mk);
        Wallets.set(addr, {
            addr: addr,
            wallet: wallet,
            key: mk,
        })
        res.json({ code: 0 });
    } catch (e: any) {
        console.log((e.response && e.response.data) || e);
        res.status(500).send((e.response && e.response.data) || e.message + "\n" + e.stack);
    }
});

app.get("/listBalance", async (req: Request, res: Response) => {
    try {
        const addr = req.query['addr'] as string;
        if (!addr) {
            throw "addr is required"
        }
        const [coins] = await LCD.bank.balance(addr);
        const coinsList = coins.toArray();
        var balances: any = {};
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
    } catch (e: any) {
        console.log((e.response && e.response.data) || e);
        res.status(500).send((e.response && e.response.data) || e.message + "\n" + e.stack);
    }
});


app.get("/withdraw", async (req: Request, res: Response) => {
    try {
        const addr = req.query['addr'] as string;
        const asset = req.query['asset'] as string;
        const to = req.query['to'] as string;
        const quantityS = req.query['quantity'] as string;
        const memo = req.query['memo'] as string | undefined;
        if (!addr || !asset || !to || !quantityS) {
            throw "addr/asset/to/quantity/code is required"
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
        const quantity = (parseFloat(quantityS) * 1e+6).toFixed(0);
        const coins = new Coins();
        coins.set(denom, quantity);
        const msg = new MsgSend(
            wallet.key.accAddress,
            to,
            coins,
        );
        const tx = await wallet.wallet.createAndSignTx({ msgs: [msg], memo: memo, feeDenoms: [denom] });
        const result = await LCD.tx.broadcast(tx);
        res.json(result);
    } catch (e: any) {
        console.log((e.response && e.response.data) || e);
        res.status(500).send((e.response && e.response.data) || e.message + "\n" + e.stack);
    }
});

app.get("/placeOrder", async (req: Request, res: Response) => {
    try {
        const addr = req.query['addr'] as string;
        const side = req.query['side'] as string;
        const symbol = req.query['symbol'] as string;
        const quantityS = req.query['quantity'] as string;
        // const priceS = req.query['price'] as string;
        if (!addr || !side || !symbol || !quantityS) {
            throw "addr/side/symbol/quantity/price is required"
        }
        const wallet = Wallets.get(addr);
        if (!wallet) {
            throw `wallet is not exists by ${addr}`;
        }
        const pool = loadSymbol(symbol);
        if (!pool) {
            throw `symbol is not exists by ${symbol}`;
        }
        const { assets } = await LCD.wasm.contractQuery(pool.addr, { pool: {} });
        var beliefPrice = "";
        var denom = "";
        if (side == "Buy") {
            beliefPrice = (assets[0].amount / assets[1].amount).toFixed(6);
            switch (pool.quote) {
                case "UST":
                    denom = "uusd";
            }
        } else {
            beliefPrice = (assets[1].amount / assets[0].amount).toFixed(6);
            switch (pool.base) {
                case "LUNA":
                    denom = "uluna";
            }
        }
        if (denom.length < 1) {
            throw `denom is not supported ${denom}`;
        }
        const quantity = (parseFloat(quantityS) * 1e+6).toFixed(0);
        const coins = new Coins();
        coins.set(denom, quantity);
        var maxSpread = process.env.MAX_SPREAD
        if (!maxSpread) {
            maxSpread = "0.005";
        }
        const msg = new MsgExecuteContract(
            wallet.key.accAddress,
            pool.addr,
            {
                swap: {
                    max_spread: maxSpread,
                    offer_asset: {
                        info: {
                            native_token: {
                                denom: denom,
                            },
                        },
                        amount: `${quantity}`,
                    },
                    belief_price: beliefPrice,
                },
            },
            coins,
        );
        var feeDenom = process.env.FEE_DENOM
        if (!feeDenom) {
            feeDenom = denom;
        }
        const request = { msgs: [msg], feeDenoms: [feeDenom] };
        console.log(`place order by ${JSON.stringify(request)}`)
        const tx = await wallet.wallet.createAndSignTx(request);
        const result = await LCD.tx.broadcast(tx);
        res.json(result);
    } catch (e: any) {
        console.log((e.response && e.response.data) || e);
        res.status(500).send((e.response && e.response.data) || e.message + "\n" + e.stack);
    }
});

(async () => {
    const gasPrices = await (await fetch('https://fcd.terra.dev/v1/txs/gas_prices')).json();
    LCD = new LCDClient({
        URL: "https://fcd.terra.dev/",
        chainID: "columbus-5",
        gasPrices: new Coins(gasPrices),
        gasAdjustment: "1.5",
    });
    app.listen(PORT, ADDR, () => {
        console.log(`terra server started at http://${ADDR}:${PORT}`);
    });
})();
