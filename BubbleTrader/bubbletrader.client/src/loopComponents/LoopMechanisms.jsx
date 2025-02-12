import { Box, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import { calculateFrame } from "../helpers/loopHelpers";
import Trader from "../components/Trader";
import ChartComponent from "../components/ChartComponent";
import { LineChart } from "@mui/x-charts";

export const LoopMechanism = ({loopRef,history}) => {
    const [isRunning, setIsRunning] = useState(false);
    const [frame,setFrame] = useState(0);

    useEffect(() => {
        if(loopRef?.current?.loopId !== 0 && loopRef?.current?.loopFrame !== undefined){
            setFrame(loopRef.current.loopFrame);
            if(loopRef?.current?.isRunning){
                setIsRunning(true);
                loopRef.current.intId = setInterval(march,100,cb => {
                    if(cb.frame >= 4000) loopRef.current.isRunning = false;
                    setFrame(cb.frame);
                    loopRef.current.loopFrame = cb.frame;
                    loopRef.current.data = cb.data;
                    history.push(Math.round(cb.data.sharePrice*10000)/10000);
                    loopRef.current.isComplete = cb.continue;
                    if(!cb.continue) clearInterval(loopRef?.current?.intId);
                })
            }
            else{
                setIsRunning(false);
            }
        }
        return () => clearInterval(loopRef?.current?.intId);
    },[]);

    const march = async (cb) => {
        if(loopRef && loopRef.current && loopRef.current.intId !== 0 && loopRef.current.isComplete){
            loopRef.current.isCopmlete = false;
            calculateFrame(loopRef.current.loopFrame,loopRef.current.data.traders,loopRef.current.data.sharePrice,loop => {
                if(loopRef.current.isRunning) loop.continue = true;
                loop.data.playerCash = loopRef.current.data.playerCash;
                loop.data.playerShares = loopRef.current.data.playerShares;
                cb(loop);
            })
        }
    }
    
    const Floor = () => (
        <>
            <svg
                viewBox={`0 0 100 100`}
                width={`${20}vw`}
                height={`${20}vw`}
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    border: "solid",
                }}
            >
                <text
                    x={1}
                    y={5}
                    fill="black"
                    fontSize={5}
                >
                    Share Price: {new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(loopRef?.current?.data?.sharePrice)}
                </text>
                {
                    loopRef?.current?.data?.traders?.length && loopRef.current.data.traders.map((t,i) => (
                        <Trader
                            key={i}
                            xPos={t.xPos}
                            yPos={t.yPos}
                            traderId={t.traderId}
                            collisions={t.collisions}
                            r={t.r}
                        />
                    ))
                }
            </svg>
            
        </>
    );
        
    const TradingFloorCallback = useCallback(() => <Floor />,[frame]);
        
    return <TradingFloorCallback />
}

export default LoopMechanism;