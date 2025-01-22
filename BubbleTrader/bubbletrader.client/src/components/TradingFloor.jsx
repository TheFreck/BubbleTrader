import { Box } from "@mui/material"
import { useEffect, useRef, useState } from "react";
import Trader from "./Trader";

export const TradingFloor = ({frame,loopRef}) => {
    const [floorWidth, setFloorWidth] = useState(50);
    const [floorHeight, setFloorHeight] = useState(100);

    return (
        <Box>
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
                        />
                    ))
                }
            </svg>
        </Box>
    );
}

export default TradingFloor;