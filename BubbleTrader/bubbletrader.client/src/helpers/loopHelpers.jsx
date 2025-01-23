import axios from "axios";

const getBaseURL = (cb => {
    if(process.env.NODE_ENV == "development"){
        cb("https://localhost:7264");
    }
    else if(process.env.NODE_ENV === "production"){
        cb("");
    }
});

export const calculateFrame = async (frame,traders,sharePrice,cb) => {
    let next = (frame + 1);
    calculateMove(traders,sharePrice,moved => {
        let data = {
            traders: moved.traders,
            sharePrice: moved.sharePrice,

        }
        cb({
            frame: next,
            data
        });
    })
    // getBaseURL(url => {
    //     const api = axios.create({
    //         baseURL: url
    //     });
    //     api.get()
    //     .then(yup => {
    //         console.log("yup: ", yup.data);
    //     })
    //     .catch(nope => console.error(nope));
    // });
    // cb({
    //     data:{},
    //     frame: next
    // });
}

const tPositions = [];

const getCoords = (r) => {
    const coords = {x:null,y:null};
    do{
        coords.x = Math.random()*(100-2*r)+2*r;
        coords.y = Math.random()*(100-2*r)+2*r;
    }
    while(!validateCoordsAgainstTraders(coords,r));
    tPositions.push(coords);
    return coords;
}

export const createTraders = (qty,r,cb) => {
    let traders = [];
    for(let i=0; i<qty; i++){
        let coords = getCoords(r);
        traders.push({
            xPos: coords.x,
            yPos: coords.y,
            xVel: Math.random()+Math.random(),
            yVel: Math.random()+Math.random(),
            traderId: i,
            r,
            risk: Math.random(),
            cash: 1000,
            shares: 100
        });
    }
    let total = 0;
    for(let trader of traders){
        total += trader.risk;
    }
    console.log("market risk: ", total/qty);
    cb(traders);
}

const validateCoordsAgainstTraders = ({x,y},r) => {
    if(x<r || x>100-r || y<r || y>100-r) return false;
    for(let coord of tPositions){
        let dist = Math.sqrt(Math.pow(x-coord.x,2)+Math.pow(y-coord.y,2));
        if(dist < 2*r) return false;
    }
    return true;
}

const calculateMove = (traders,sharePrice,cb) => {
    let lastPrice = sharePrice;
    let collisions = [];
    for(let mover of traders){
        let checked = checkWalls(mover);
        if(checked) collisions.push(checked);
        for(let shaker of traders){
            if(mover.traderId !== shaker.traderId){
                let collision = findCollision(mover,shaker);
                if(collision) {
                    collisions.push(collision);
                    calculateTrade(mover,shaker,lastPrice,trade => {
                        lastPrice = trade.tradePrice;
                        trade.buyer.cash -= trade.tradePrice;
                        trade.seller.cash += trade.tradePrice;
                        trade.buyer.shares++;
                        trade.seller.shares--;
                    });
                }
            }
        }
    }
    for(let c of collisions){
        let trader = traders.find(t => t.traderId === c.id);
        trader.xVel = c.xVel;
        trader.yVel = c.yVel;
    }
    cb({
        traders:move(traders),
        sharePrice: lastPrice
    });
}

const move = (traders) => {
    for(var trader of traders){
        trader.xPos += trader.xVel;
        trader.yPos += trader.yVel;
    }
    return traders;
}

const findCollision = (mover,shaker) => {
    if(Math.sqrt((mover.xPos-shaker.xPos)*(mover.xPos-shaker.xPos)+(mover.yPos-shaker.yPos)*(mover.yPos-shaker.yPos)) <= 1.01*(mover.r + shaker.r)){
        let normal = Math.atan((mover.yPos-shaker.yPos)/(mover.xPos-shaker.xPos));
        let ny = Math.sin(normal);
        let nx = Math.cos(-normal);
        let dot = mover.xVel*nx + mover.yVel*ny;
        return {
            id: mover.traderId,
            xVel: mover.xVel - 2*dot*nx,
            yVel: mover.yVel - 2*dot*ny
        };
    }
}

const checkWalls = (trader) => {
    if(trader.xPos-.95*trader.r<=Math.abs(trader.xVel) || trader.xPos+.95*trader.r>=100-Math.abs(trader.xVel)){
        return {
            id: trader.traderId,
            xVel: trader.xVel * -1,
            yVel: trader.yVel
        };
    }
    else
    if(trader.yPos-.95*trader.r<=Math.abs(trader.yVel) || trader.yPos+.95*trader.r>=100-Math.abs(trader.yVel)){
        return {
            id: trader.traderId,
            xVel: trader.xVel,
            yVel: trader.yVel * -1
        };
    }
}

const calculateTrade = (mover,shaker,lastPrice,cb) => {
    let randyMover = Math.random();
    let randyShaker = Math.random();
    let moverDiff = mover.risk-randyMover;
    let shakerDiff = shaker.risk-randyShaker;
    let buyer = moverDiff > shakerDiff ? mover : shaker;
    let seller = moverDiff < shakerDiff ? mover : shaker;
    let combinedDiff = (moverDiff+shakerDiff)/500;
    let tradePrice = lastPrice * (1+combinedDiff);
    if(buyer.cash > tradePrice && seller.shares >= 1){
        cb({
            buyer,
            seller,
            tradePrice
        });
    }
}

export default {
    calculateFrame,
    createTraders
};