export const move = (trader) => {
    trader.xPos += trader.xVel;
    trader.yPos += trader.yVel;
}

export const findConnections = (cb) => {

}

export const createTrader = (cb) => {
    cb({
        xPos: Math.random()*100,
        yPos: Math.random()*100,
        xVel: Math.random(),
        yVel: Math.random()
    });
}

export default {
    move,
    findConnections,
    createTrader
};