import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export const Trader = ({xPos,yPos,traderId,r}) => {
    return (
        <>
            <circle
                id={"t-" + traderId}
                cx={xPos}
                cy={yPos}
                r={r}
                stroke="#ad8c2f"
                // fill="#ad8c2f"
                fill="transparent"
                strokeWidth=".1"
            />
            <text
                fontSize={".2em"}
                x={xPos}
                y={yPos}
            >
                {traderId}
            </text>
        </>
    );
}

export default Trader;