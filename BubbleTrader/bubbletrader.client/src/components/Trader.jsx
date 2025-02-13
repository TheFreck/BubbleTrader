export const Trader = ({xPos,yPos,traderId,r}) => {
    return (
        <>
            <circle
                id={"t-" + traderId}
                cx={xPos}
                cy={yPos}
                r={r}
                stroke="#ad8c2f"
                fill="transparent"
                strokeWidth=".1"
            />
        </>
    );
}

export default Trader;