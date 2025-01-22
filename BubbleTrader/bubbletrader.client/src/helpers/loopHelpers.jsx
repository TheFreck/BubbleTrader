import axios from "axios";

const getBaseURL = (cb => {
    if(process.env.NODE_ENV == "development"){
        cb("https://localhost:7264");
    }
    else if(process.env.NODE_ENV === "production"){
        cb("");
    }
});

export const calculateFrame = async (frame,traders,cb) => {
    let next = (frame + 1);
    let data = {
        traders: calculateMove(traders)
    }
    cb({
        frame: next,
        data
    });
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
            xVel: Math.random(),
            yVel: Math.random(),
            traderId: i,
            r
        });
    }
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

const calculateMove = (traders) => {
    for(let mover of traders){
        checkWalls(mover);
        for(let shaker of traders){
            if(mover.traderId !== shaker.traderId){
                findCollision(mover,shaker);
            }
        }
    }
    return move(traders);
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
        mover.xVel = mover.xVel - 2*dot*nx;
        mover.yVel = mover.yVel - 2*dot*ny;
    }
}

const checkWalls = (trader) => {
    if(trader.xPos-.95*trader.r<=Math.abs(trader.xVel) || trader.xPos+.95*trader.r>=100-Math.abs(trader.xVel)){
        trader.xVel *= -1;
    }
    else
    if(trader.yPos-.95*trader.r<=Math.abs(trader.yVel) || trader.yPos+.95*trader.r>=100-Math.abs(trader.yVel)){
        trader.yVel *= -1;
    }
}

export default {
    calculateFrame,
    createTraders
};