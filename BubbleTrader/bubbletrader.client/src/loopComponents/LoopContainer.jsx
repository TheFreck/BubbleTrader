import { Box, Button, Grid2, Typography } from "@mui/material"
import { useCallback, useEffect, useRef, useState } from "react";
import LoopMechanism from "./LoopMechanisms";
import { createTraders } from "../helpers/loopHelpers";
import ChartComponent from "../components/ChartComponent";
import TradeTicket from "../components/TradeTicket";
import BotTraders from "../components/BotTraders";

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

    // useEffect(() => console.log("ready: ", ready),[ready]);

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
                    marketSentiment: .1,
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


    const ChartComponentCallback = useCallback(() => <ChartComponent 
            getHistory={getHistory}
            isRunning={loopRef?.current?.isRunning}
        />
    ,[ready]);

    const LoopMechanismCallback = useCallback(() => <LoopMechanism 
        containerId={containerId} 
        loopRef={loopRef} 
        init={init} 
        history={history} 
    ></LoopMechanism>,[ready,containerId]);

    const TradeTicketCallback = useCallback(() => <TradeTicket
        trade={trade}
        shares={loopRef?.current?.data?.playerShares}
        cash={loopRef?.current?.data?.playerCash}
        sharePrice={loopRef?.current?.data?.sharePrice}
    />,[traded]);

    const BotTradersCallback = useCallback(() => loopRef.current && loopRef.current.data && loopRef.current.data.traders && loopRef.current.data.sharePrice && 
    <BotTraders 
        getTraders={() => loopRef.current.data.traders} 
        getSharePrice={() => loopRef.current.data.sharePrice}
        isRunning={loopRef.current.isRunning}
    />, [ready]);

    return <Box
        sx={{
            width: "90vw",
            margin: "auto",
            padding: 0
        }}
    >
        {
            !loopRef?.current?.isRunning &&
            <Button
                onClick={startStop}
            >
                Start
            </Button>
        }
        <Box
            sx={{
                display: "flex", 
                flexDirection: "row",
                width: "90vw",
                marginLeft: "5vw"
            }}
        >
            <Grid2
                container
                size={12}
            >
                <Grid2
                    container
                    spacing={1}
                    size={4}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <LoopMechanismCallback />
                    <TradeTicketCallback />
                </Grid2>
                <Grid2
                    size={8}
                >
                    <ChartComponentCallback />
                    <BotTradersCallback />
                </Grid2>
            </Grid2>
        </Box>
    </Box>
}

export default LoopContainer;