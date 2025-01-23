import { Box, Button, Typography } from "@mui/material"
import { useCallback, useEffect, useRef, useState } from "react";
import LoopMechanism from "./LoopMechanisms";
import { createTraders } from "../helpers/loopHelpers";

export const LoopContainer = ({appId}) => {
    const [containerId,setContainerId] = useState(0);
    const [ready,setReady] = useState(false);
    const [traderCount,setTraderCount] = useState(30);
    const [tRadius, setTradius] = useState(1);
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
                }
            }
            setReady(!ready);
        });
    }

    const startStop = () => {
        loopRef.current.isRunning = !loopRef.current.isRunning;
        setReady(!ready);
    }


    const LoopMechanismCallback = useCallback(() => <LoopMechanism containerId={containerId} loopRef={loopRef} init={init} />,[ready,containerId]);

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
        <LoopMechanismCallback />
    </Box>
}

export default LoopContainer;