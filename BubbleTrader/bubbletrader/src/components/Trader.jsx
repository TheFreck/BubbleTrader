import react, { useEffect, useRef, useState, useContext, useCallback, Suspense } from 'react';
import TradingContext from './TradingContext';

export const Trader = ({
    index,
    name = 'Trader-Joe',
    xSpeed,
    ySpeed,
    x,
    y,
    red = Math.random() * 255,
    green = Math.random() * 255,
    blue = Math.random() * 255,
    floorId,
    size=2,
    isAlive,
    aim=0,
    cash,
    portfolio,
    bullishness
}) => {

    const context = useContext(TradingContext);
    const [myPortfolio, setMyPortfolio] = useState(portfolio);
    const [myCash, setMyCash] = useState(cash);
    const [myIndex, setMyIndex] = useState(index);
    const [myX,setMyX] = useState(x);
    const [myY,setMyY] = useState(y);
    const [myXspeed, setMyXspeed] = useState(xSpeed ? xSpeed : 0);
    const [myYspeed, setMyYspeed] = useState(ySpeed ? ySpeed : 0);
    const [myAim, setMyAim] = useState(aim);
    const [mySize, setMySize] = useState(size);
    const [myName, setMyName] = useState(name);
    const [myRed,setMyRed] = useState(red);
    const [myGreen, setMyGreen] = useState(green);
    const [myBlue, setMyBlue] = useState(blue);
    const [myNetworth,setMyNetworth] = useState(cash);
    const myRiskTolerance = Math.random();
    const myFearSensitivity = (Math.random()+3)/4;

    //**************************************************************************** */
    // add a magnitude modifier to be adjustable at the level of the TradingFloor
    //**************************************************************************** */


    useEffect(() => {
        if (name === 'Trader-Joe' || !red || !green || !blue) return;
    },[]);

    const Circle = () => (
        <circle
            key={myName}
            name={myName}
            aim={myAim}
            xspeed={myXspeed}
            yspeed={myYspeed}
            magnitude={Math.sqrt(myXspeed*myXspeed+myYspeed*myYspeed)}
            fill={`rgb(${myRed},${myGreen},${myBlue})`}
            stroke={`rgb(${myRed * .5},${myGreen * .5},${myBlue * .5})`}
            strokeWidth={.5}
            cx={`${myX}%`}
            cy={`${myY}%`}
            r={`${mySize}%`}
            transform={`rotate(${myAim?myAim:0},${myX?myX:0},${myY?myY:0})`}
            cash={cash}
            networth={myNetworth ? myNetworth : 0}
            risk-tolerance={myRiskTolerance}
            fear-sensitivity={myFearSensitivity}
            bullishness={bullishness}
        />
    );

    const calculateNetworth = () => {
        if(!myCash && !Object.entries(myPortfolio).length) {
            setMyNetworth(0);
            return 0;
        }
        let assetValue = 0;
        for(let [key,value] of Object.entries(context.traders.find(t => t.name === myName).portfolio)){
            let podium = context.podiums.find(p => p.name === key);
            assetValue += podium?.lastPrice*value;
        }
        setMyNetworth(myCash+assetValue);
        return myCash+assetValue;
    }

    const Direction = () => (
        <>
            {(myXspeed > 0 
            || myYspeed > 0 
            || myXspeed < 0
            || myYspeed < 0)
            &&
             <polygon 
                onClick={calculateNetworth}
                points={
                    `${(myX?myX:0)+mySize*Math.cos(Math.PI)},${(myY?myY:0)} 
                    ${(myX?myX:0)},${(myY?myY:0)-mySize} 
                    ${(myX?myX:0)-mySize*Math.cos(Math.PI)},${(myY?myY:0)}`
                } 
                fill={'plum'} 
                transform={`rotate(${myAim?myAim:0},${myX?myX:0},${myY?myY:0})`}
            />
            }

            <line
                x1={`${myX}%`}
                x2={`${myX+myXspeed*2}%`}
                y1={`${myY}%`}
                y2={`${myY+myYspeed*2}%`}
                stroke={'red'}
                strokeWidth={.5}
            />
        </>
    );

    const Label = () => {
        return (myNetworth &&
            <text 
                x={myX}
                y={myY}
                stroke='black'
                strokeWidth={.1}
                fontSize='.25em'
            >
                {/* (x: {Math.floor(myX*100)/100}, y: {Math.floor(myY*100)/100}) */}
                {/* {myIndex} */}
                {Math.floor(myNetworth*100)/100}
            </text>
        )
    } 

    return (
        <Suspense 
            fallback={null}
        >
            <Circle />
            <Direction />
            <Label />
        </Suspense>
    )
}
