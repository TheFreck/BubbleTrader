import { Box, Button, Typography } from "@mui/material"
import { useCallback, useEffect, useRef, useState } from "react";
import LoopMechanism from "./LoopMechanisms";
import { createTraders } from "../helpers/loopHelpers";
import ChartComponent from "../components/ChartComponent";
import TradeTicket from "../components/TradeTicket";

export const LoopContainer = ({appId}) => {
    const [containerId,setContainerId] = useState(0);
    const [ready,setReady] = useState(false);
    const [traderCount,setTraderCount] = useState(40);
    const [tRadius, setTradius] = useState(1);
    const [history,setHistory] = useState([10]);
    const [traded,setTraded] = useState(false);
    const loopRef = useRef();

    useEffect(() => {
        if(appId !== 0){
            setContainerId(appId);
            init();
        }
        return () => {
            setContainerId(0);
            init();
        }
    },[]);

    const getHistory = (cb) => {
        cb(history);
    }

    const getPrice = (cb) => {
        cb(loopRef.current.data.sharePrice);
    }

    const trade = (bs) => {
        loopRef.current.data.playerCash -= (loopRef.current.data.sharePrice*bs);
        loopRef.current.data.playerShares += bs;
        setTraded(!traded);
    }

    const init = () => {
        createTraders(traderCount,tRadius,traders => {
            loopRef.current = {
                loopId: appId,
                loopFrame: 0,
                intId: 0,
                isRunning: false,
                isComplete: true,
                data: {
                    traders,
                    sharePrice:10,
                    playerCash:1000,
                    playerShares: 100
                }
            }
            setReady(!ready);
        });
    }

    const startStop = () => {
        loopRef.current.isRunning = !loopRef.current.isRunning;
        setReady(!ready);
    }


    const ChartComponentCallback = useCallback(() => loopRef?.current?.isRunning && <ChartComponent 
            getHistory={getHistory}
            isRunning={loopRef?.current?.isRunning}
        />
    ,[ready]);

    const LoopMechanismCallback = useCallback(() => <LoopMechanism containerId={containerId} loopRef={loopRef} init={init} history={history} />,[ready,containerId]);

    const TradeTicketCallback = useCallback(() => <TradeTicket
        trade={trade}
        shares={loopRef?.current?.data?.playerShares}
        cash={loopRef?.current?.data?.playerCash}
    />,[traded]);

    return <Box
        sx={{
            width: "90vw",
            margin: "auto",
            padding: 0
        }}
    >
        <Button
            onClick={startStop}
        >
            {loopRef?.current?.isRunning ? "Stop" : "Start"}
        </Button>
        <Box
            sx={{
                display: "flex", 
                flexDirection: "row",
                width: "90vw",
                marginLeft: "5vw"
            }}
        >
            <LoopMechanismCallback />
            <ChartComponentCallback />
            <TradeTicketCallback />
        </Box>
    </Box>
}

export default LoopContainer;