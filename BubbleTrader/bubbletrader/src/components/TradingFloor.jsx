import react, { Suspense, useEffect, useRef, useState, useContext, useCallback } from 'react';
import { Trader } from './Trader';
import TradingContext from './TradingContext';
import Podium from './Podium';
import { TradingFloorHelpers } from './TradingFloorHelpers';
import helpers from './HomeHelpers';

export const TradingFloor = (props) => {
    const { floorWidth, floorHeight, floorId } = props;
    const context = useContext(TradingContext);
    const [traders, setTraders] = useState(context.traders);
    const [militicks, setMiliticks] = useState(10);
    const [connections, setConnections] = useState([]);
    const [slowing, setSlowing] = useState(1);
    const [floorLeft, setFloorLeft] = useState(-50);
    const [floorRight, setFloorRight] = useState(150);

    const a = .00125;
    const b = 1000;
    const c = .0075;
    const floorRef = useRef();

    useEffect(() => {
        for (let podium of context.podiums) {
            podium.waves = TradingFloorHelpers.createWave(podium);
        }
        findConnections((con) => {
            setConnections(con);
        })
    }, []);

    useEffect(() => {
        if (context.isRunning) {
            if (!context.tradersIntervalId) {
                let intId = setInterval(march, militicks);
                floorRef.current.intId = intId;
                context.setIntervalId(intId);
            }
        }
        else {
            clearInterval(floorRef.current.intId);
            context.setIntervalId(0);
        }
    }, [context.isRunning]);

    const march = () => {
        const trs = [];
        const now = Math.floor(Date.now() / 100);
        if (Math.floor(Date.now() / 100) % 10 === 0) {
            for (let podium of context.podiums) {
                podium.waves = TradingFloorHelpers.createWave(podium);
            }
        }
        for (let podium of context.podiums) {
            let asset = TradingFloorHelpers.growAsset(podium);
            context.setPodiums(asset);
        }
        findConnections(pos => {
            setConnections(pos);
            for (let trader of context.traders) {
                let newXspeed = trader.xSpeed * slowing;
                let newYspeed = trader.ySpeed * slowing;
                let normal = pos.find(p => p.name === trader.name && p.type === 'normal');
                if (pos.length && normal) {
                    for (let po of pos) {
                        if (po.name !== trader.name) continue;
                        let dist = Math.sqrt(Math.pow(normal.x1 - normal.x2, 2) + Math.pow(normal.y1 - normal.y2, 2));
                        let normalAngle = po.angle;
                        if (isNaN(trader.aim)) {
                            trader.aim = -normalAngle;
                        }
                        trader.aim = TradingFloorHelpers.getBounceAngle(normalAngle, trader.xSpeed, trader.ySpeed);
                        let aimRadians = (((trader.aim) / 360) * 2 * Math.PI) % (Math.PI * 2);
                        let magnitude = (2 * normal.myMagnitude + normal.theirMagnitude) / 3;
                        if (magnitude === 0) continue;
                        let aimSin = Math.round(Math.sin(aimRadians) * 100) / 100;
                        newXspeed = -(Math.floor(aimSin * magnitude * 100) * slowing) / 100;
                        let aimCos = Math.round(Math.cos(aimRadians) * 100) / 100;
                        newYspeed = -(Math.floor(-aimCos * magnitude * 100) * slowing) / 100;
                        dist = Math.sqrt(Math.pow(normal.x1 - normal.x2, 2) + Math.pow(normal.y1 - normal.y2, 2));
                        trader.xSpeed = newXspeed;
                        trader.ySpeed = newYspeed;
                        trader.x = normal.x2 - newXspeed;
                        trader.y = normal.y2 - newYspeed;
                    }
                }
                trader.xSpeed = newXspeed;
                trader.ySpeed = newYspeed;
                trader.x += trader.xSpeed * context.marketEnergy;
                trader.y += trader.ySpeed * context.marketEnergy;
                trs.push(trader);
            }
            const movedTraders = [];
            for (let trader of trs) {
                movedTraders.push(move(trader));
            }
            setTraders(movedTraders);
        });
        context.setTraders(traders);
    };

    const move = (trader) => {
        if (!trader.isAlive || (!trader.xSpeed && !trader.ySpeed)) return;
        trader.aim = TradingFloorHelpers.getAim(trader.xSpeed, trader.ySpeed);
        // Podiums
        for (let podium of context.podiums.filter(p => p.assetName)) {
            const podHeight = podium.bottom - podium.top;
            const podWidth = podium.right - podium.left;

            // podium left
            if (trader.x > podium.left
                && trader.x < podium.xMid
                && trader.y > podium.top
                && trader.y < podium.bottom
                && trader.y < podium.bottom - (trader.x - podium.left) * podHeight / podWidth
                && trader.y > podium.top + (trader.x - podium.left) * podHeight / podWidth
                && trader.xSpeed > 0) {
                trader.xSpeed = -Math.abs(trader.xSpeed);
                const traded = trade(trader, podium);
                if (traded.status) {
                    trader.cash += traded.cash;
                    trader.portfolio[podium.assetName] += traded.shares;
                }
            }

            // podium right
            if (trader.x < podium.right
                && trader.x > podium.xMid
                && trader.y > podium.top
                && trader.y < podium.bottom
                && trader.y > podium.bottom - (trader.x - podium.left) * podHeight / podWidth
                && trader.y < podium.top + (trader.x - podium.left) * podHeight / podWidth
                && trader.xSpeed < 0) {
                trader.xSpeed = Math.abs(trader.xSpeed);
                const traded = trade(trader, podium);
                if (traded.status) {
                    trader.cash += traded.cash;
                    trader.portfolio[podium.assetName] += traded.shares;
                }
            }

            // podium top
            if (trader.y > podium.top
                && trader.y < podium.yMid
                && trader.x > podium.left
                && trader.x < podium.right
                && trader.y < podium.top + (trader.x - podium.left) * podHeight / podWidth
                && trader.y < podium.bottom - (trader.x - podium.left) * podHeight / podWidth
                && trader.ySpeed > 0) {
                trader.ySpeed = -Math.abs(trader.ySpeed);
                const traded = trade(trader, podium);
                if (traded.status) {
                    trader.cash += traded.cash;
                    trader.portfolio[podium.assetName] += traded.shares;
                }
            }

            // // podium bottom
            if (trader.y < podium.bottom
                && trader.y > podium.yMid
                && trader.x > podium.left
                && trader.x < podium.right
                && trader.y > podium.top + (trader.x - podium.left) * podHeight / podWidth
                && trader.y > podium.bottom - (trader.x - podium.left) * podHeight / podWidth
                && trader.ySpeed < 0) {
                trader.ySpeed = Math.abs(trader.ySpeed);
                const traded = trade(trader, podium);
                if (traded.status) {
                    trader.cash += traded.cash;
                    trader.portfolio[podium.assetName] += traded.shares;
                }
            }
        }
        // Walls
        // Left
        if (trader.x - trader.size / 2 < floorLeft) {
            trader.xSpeed = Math.abs(trader.xSpeed);
            trader.x = floorLeft + trader.size + trader.xSpeed;
        }
        // Right
        else if (trader.x + trader.size / 2 > floorRight) {
            trader.xSpeed = -Math.abs(trader.xSpeed);
            trader.x = floorRight - trader.size + trader.xSpeed;
        }
        // Top
        if (trader.y - trader.size / 2 < 0) {
            trader.ySpeed = Math.abs(trader.ySpeed);
            trader.y = trader.size + trader.ySpeed;
        }
        // Bottom
        else if (trader.y + trader.size / 2 > 100) {
            trader.ySpeed = -Math.abs(trader.ySpeed);
            trader.y = 100 - trader.size + trader.ySpeed;
        }
        return trader;
    };

    const findConnections = (cb) => {
        const connects = [];
        let andOut;
        for (let i = 0; i < traders.length; i++) {
            if (!traders[i].isAlive) continue;
            for (let j = 0; j < traders.length; j++) {
                if (traders[i].name === traders[j].name) continue;
                let xDist = Math.pow(traders[i].x + traders[i].xSpeed - traders[j].x + traders[j].xSpeed, 2);
                let yDist = Math.pow(traders[i].y + traders[i].ySpeed - traders[j].y + traders[j].ySpeed, 2);
                let dist = Math.sqrt(xDist + yDist);
                let tri = traders[i];
                let trj = traders[j];
                let xsa = tri.xSpeed;
                let ysa = tri.ySpeed;
                let xsb = trj.xSpeed;
                let ysb = trj.ySpeed;
                let xspa = Math.pow(xsa, 2);
                let yspa = Math.pow(ysa, 2);
                let xspb = Math.pow(xsb, 2);
                let yspb = Math.pow(ysb, 2);
                let myMagnitude = Math.sqrt(xspa + yspa);
                let theirMagnitude = Math.sqrt(xspb + yspb);
                if (dist < context.traderSize * 2) {
                    let normalAngle = TradingFloorHelpers.getAim(traders[j].x - traders[i].x, traders[j].y - traders[i].y);
                    connects.push({
                        name: traders[i].name,
                        other: traders[j].name,
                        type: 'normal',
                        x1: traders[j].x - traders[j].xSpeed,
                        x2: traders[i].x - traders[i].xSpeed,
                        y1: traders[j].y - traders[j].ySpeed,
                        y2: traders[i].y - traders[i].ySpeed,
                        red: 255,
                        green: 0,
                        blue: 0,
                        angle: normalAngle,
                        myMagnitude,
                        theirMagnitude
                    });
                }
            }
        }
        andOut = cb(connects);
        return andOut;
    }

    const trade = (trader, asset) => {
        let short = calculateMovingAverage(trader.movingAverages[0], asset.tradeHistory);
        let long = calculateMovingAverage(trader.movingAverages[1], asset.tradeHistory);
        let lastTrade = asset.tradeHistory[0]?.type;
        let randy = (2*Math.random())-1;
        const shares = Math.abs(short - long) / long * asset.shareQty + 100;
        const buyableShares = Math.floor(Math.min(Math.floor(trader.cash / asset.bid), shares) * Math.abs(trader.bullishness));
        const sellableShares = Math.floor(Math.min(trader.portfolio[asset.assetName], shares) * -Math.abs(trader.bullishness));
        // add an attractiveness variable to the asset to account for the direction of the formations
        // add an overall market sentiment variable
        if (lastTrade === 'buy') {
            if (randy > trader.fearSensitivity || randy < trader.bullishness) {
                trader.bullishness *= 1.1;
                if (sellableShares) {
                    trader.fearSensitivity *= .9;
                    return sell(trader, sellableShares, asset.assetName);
                }
                else {
                    return { status: false };
                }
            }
            else {
                trader.bullishness *= .9;
                if (buyableShares) {
                    trader.fearSensitivity *= 1.1;
                    return buy(trader, buyableShares, asset.assetName);
                }
                else {
                    return { status: false };
                }
            }
        }
        if (lastTrade === 'sell') {
            if (randy > trader.riskTolerance || randy > trader.bullishness) {
                trader.bullishness *= .9;
                if (buyableShares) {
                    trader.fearSensitivity *= 1.1;
                    return buy(trader, buyableShares, asset.assetName);
                }
                else {
                    return { status: false };
                }
            }
            else {
                trader.bullishness *= 1.1
                if (sellableShares) {
                    trader.fearSensitivity *= .9;
                    return sell(trader, sellableShares, asset.assetName);
                }
                else {
                    return { status: false };
                }
            }
        }
    }

    const buy = (buyer, shares, assetName) => {
        const asset = context.podiums.find(p => p.assetName === assetName);
        const tradeShares = Math.floor(Math.min(shares, buyer.cash / asset.bid, asset.sharesAvailable));
        asset.sharesOutstanding += tradeShares;
        asset.cashOnHand += tradeShares * asset.bid;
        asset.sharesAvailable -= tradeShares;
        const sharePortion = tradeShares / asset.sharesAvailable;
        const oldBid = asset.bid;
        const value = asset.value / asset.shareQty;
        const newBid = oldBid / (1 - sharePortion);
        const newAsk = oldBid * (1 - sharePortion);
        if (tradeShares) {
            const trade = {
                buyer: buyer.name,
                assetName,
                price: oldBid,
                tradeShares,
                value,
                type: 'buy',
                time: Date.now()
            };
            asset.tradeHistory.unshift(trade);
            asset.bid = newBid;
            asset.ask = newAsk;
            context.setPodiums(asset);
            const buyOut = {
                status: true,
                shares: tradeShares,
                cash: -tradeShares * asset.bid
            };
            console.log(`${buyer.name} bought ${shares} shares of ${assetName} for ${trade.price} per share`);
            return buyOut;
        }
        else {
            return { status: false };
        }
    }

    const sell = (seller, shares, assetName) => {
        const asset = context.podiums.find(p => p.assetName === assetName);
        const tradeShares = Math.floor(Math.min(seller.portfolio[assetName], shares, asset.cashOnHand / asset.ask));
        asset.sharesOutstanding -= tradeShares;
        asset.sharesAvailable += tradeShares;
        asset.cashOnHand -= tradeShares * asset.bid;
        const sharePortion = tradeShares / asset.sharesAvailable;
        const oldAsk = asset.ask;
        const value = asset.value / asset.shareQty;
        const newAsk = oldAsk / (1 + sharePortion);
        const newBid = oldAsk * (1 - sharePortion);
        if (tradeShares) {
            const trade = {
                buyer: seller.name,
                assetName,
                price: oldAsk,
                tradeShares,
                value,
                type: 'sell',
                time: Date.now()
            };
            asset.tradeHistory.unshift(trade)
            asset.bid = newBid;
            asset.ask = newAsk;
            context.setPodiums(asset);
            const sellOut = {
                status: true,
                shares: -tradeShares,
                cash: tradeShares * asset.bid
            };
            console.log(`${seller.name} sold ${shares} shares of ${assetName} for ${trade.price} per share`);
            return sellOut;
        }
        else {
            return { status: false };
        }
    }

    const calculateMovingAverage = (periods, tradeHistory) => {
        if (tradeHistory.length < 1) return 0;
        const closes = [];
        const groups = Object.groupBy(tradeHistory, ({ time }) => Math.floor(time / 1000));
        for (let trade of Object.entries(groups)) {
            closes.unshift(trade[1][0].price);
        }
        let closeTotal = 0;
        for (let i = 0; i < Math.min(periods, closes.length); i++) {
            closeTotal += closes[i];
        }
        return closeTotal / Math.min(periods, closes.length);
    }

    const PodiumCallback = useCallback(() =>
        context.podiums && context.podiums.map((p, i) =>
            <Podium
                key={i}
                i={i}
                name={p.assetName}
                shareQty={p.shareQty}
                startingPrice={p.startingPrice}
                sharesAvailable={p.sharesAvailable}
                top={p.top}
                bottom={p.bottom}
                left={p.left}
                right={p.right}
                bid={p.bid}
                ask={p.ask}
                tradeHistory={p.tradeHistory}
                xMid={(p.right - p.left) / 2 + p.left}
                yMid={(p.bottom - p.top) / 2 + p.top}
                waves={p.waves}
                value={p.value}
            />
        ),
        [context.traders]
    )

    const TraderCallback = useCallback(() => {
        return <Suspense fallback={null} key={"suspense-"}>
            {context.floorId && context.traders && context.traders.length > 0 && context.traders.map((t, i) =>
                <Trader
                    key={i}
                    index={i}
                    name={t.name}
                    xSpeed={t.xSpeed}
                    ySpeed={t.ySpeed}
                    x={t.x}
                    y={t.y}
                    red={t.red}
                    green={t.green}
                    blue={t.blue}
                    isGo={context.isRunning}
                    floorId={floorId}
                    size={t.size}
                    isAlive={t.isAlive}
                    aim={TradingFloorHelpers.getAim(t.xSpeed, t.ySpeed)}
                    cash={t.cash}
                    portfolio={t.portfolio}
                    bullishness={t.bullishness}
                >
                    {/* {console.log(`${JSON.parse(JSON.stringify(t.name))} x: ${JSON.parse(JSON.stringify(t.x))}; y: ${JSON.parse(JSON.stringify(t.y))}`)} */}
                </Trader>
            )}
        </Suspense>
    },
        [context.floorId, context.isRunning, context.traders, traders]);

    const ConnectionsCallback = useCallback(() =>
        <Suspense fallback={null}>
            {
                connections && connections.length && connections.map((c, j) =>
                    <line
                        key={j}
                        type={c.type}
                        names={c.names}
                        angle={c.angle}
                        x1={c.x1}
                        x2={c.x2}
                        y1={c.y1}
                        y2={c.y2}
                        stroke={`rgb(${c.red},${c.green},${c.blue})`}
                        strokeWidth={.2}
                    />
                )
            }
        </Suspense>,
        [connections]);

    return (
        <div
            ref={floorRef}
        >
            <svg
                viewBox={`0 0 100 100`}
                width={`${floorWidth - 10}vw`}
                height={`${floorHeight - 10}vh`}
                xmlns="http://www.w3.org/2000/svg"
                style={{ background: 'gray', margin: '0 5vw' }}
            >
                <PodiumCallback />
                <TraderCallback />
                <ConnectionsCallback />
            </svg>
        </div>
    )
}

export default TradingFloor;