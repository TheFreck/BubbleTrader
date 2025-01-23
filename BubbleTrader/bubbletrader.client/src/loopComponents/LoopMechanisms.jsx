import { Box, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import { calculateFrame } from "../helpers/loopHelpers";
import Trader from "../components/Trader";
import Chart from "../components/Chart";
import { LineChart } from "@mui/x-charts";

export const LoopMechanism = ({loopRef}) => {
    const [frame,setFrame] = useState(0);
    const [floorWidth, setFloorWidth] = useState(50);
    const [history,setHistory] = useState([{
        frame: 0,
        price: 10
    }]);
    const [redrawChart,sertRedrawChart] = useState(false);

    useEffect(() => {
        if(loopRef?.current?.loopId !== 0 && loopRef?.current?.loopFrame !== undefined){
            setFrame(loopRef.current.loopFrame);
            if(loopRef?.current?.isRunning){
                loopRef.current.intId = setInterval(march,100,cb => {
                    setFrame(cb.frame);
                    if(cb.frame%10 === 0) sertRedrawChart(!redrawChart);
                    loopRef.current.loopFrame = cb.frame;
                    loopRef.current.data = cb.data;
                    history.push({frame: cb.frame,price:Math.round(cb.data.sharePrice*1000)/1000});
                    console.log("loop history: ", history);
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
            calculateFrame(loopRef.current.loopFrame,loopRef.current.data.traders,loopRef.current.data.sharePrice,loop => {
                if(loopRef.current.isRunning) loop.continue = true;
                cb(loop);
            })
        }
    }

    const ChartCallback = useCallback(() => <Chart 
        history={history}
    />)
    
    const Floor = () => (
        <>
            <svg
                viewBox={`0 0 100 100`}
                width={`${floorWidth-10}vw`}
                height={`${floorWidth-10}vw`}
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
            <LineChart 
                dataset={history}
                xAxis={[{dataKey: "frame"}]}
                series={[{dataKey: "price"}]}
                width={1000}
                height={600}
            />
        </>
        );

    const TradingFloorCallback = useCallback(() => <Floor />,[frame]);

    return <TradingFloorCallback />
}

export default LoopMechanism;