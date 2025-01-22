import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export const Trader = ({xPos,yPos,traderId,r,collisions}) => {

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
            {
                collisions && collisions.map((c,i) => (
                    <line
                        key={i}
                        x1={c.x1}
                        x2={c.x2}
                        y1={c.y1}
                        y2={c.y2}
                        stroke="red"
                        strokeWidth=".1"
                    />
                ))
            }
            {
                collisions && collisions.map((c,i) => (
                    <line
                        key={i}
                        x1={c.x3}
                        x2={c.x4}
                        y1={c.y3}
                        y2={c.y4}
                        stroke="green"
                        strokeWidth=".1"
                    />
                ))
            }
        </>
    );
}

export default Trader;