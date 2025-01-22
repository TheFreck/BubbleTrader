import { Box } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import { calculateFrame } from "../helpers/loopHelpers";
import Trader from "../components/Trader";

export const LoopMechanism = ({loopRef}) => {
    const [frame,setFrame] = useState(0);
    const [floorWidth, setFloorWidth] = useState(50);

    useEffect(() => {
        if(loopRef?.current?.loopId !== 0 && loopRef?.current?.loopFrame !== undefined){
            setFrame(loopRef.current.loopFrame);
            if(loopRef?.current?.isRunning){
                loopRef.current.intId = setInterval(march,100,cb => {
                    setFrame(cb.frame);
                    loopRef.current.loopFrame = cb.frame;
                    loopRef.current.data = cb.data;
                    loopRef.current.isComplete = cb.continue;
                    if(!cb.continue) clearInterval(loopRef?.current?.intId);
                })
            }
        }
        return () => clearInterval(loopRef?.current?.intId);
    },[]);

    const march = async (cb) => {
        if(loopRef && loopRef.current && loopRef.current.intId !== 0 && loopRef.current.isComplete){
            loopRef.current.isCopmlete = false;
            calculateFrame(loopRef.current.loopFrame,loopRef.current.data.traders,loop => {
                if(loopRef.current.isRunning) loop.continue = true;
                cb(loop);
            })
        }
    }
    
    const Floor = () => (
        <svg
            viewBox={`0 0 100 100`}
            width={`${floorWidth-10}vw`}
            height={`${floorWidth-10}vw`}
            xmlns="http://www.w3.org/2000/svg"
            style={{
                border: "solid",
            }}
        >
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
        </svg>);

    const TradingFloorCallback = useCallback(() => <Floor />,[frame]);

    return <TradingFloorCallback />
}

export default LoopMechanism;