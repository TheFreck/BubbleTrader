import { Box, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import { calculateFrame } from "../helpers/loopHelpers";
import Trader from "../components/Trader";

export const LoopMechanism = ({loopRef,history}) => {
    const [isRunning, setIsRunning] = useState(false);
    const [marketClosed,setMarketClosed] = useState(false);
    const [frame,setFrame] = useState(0);
    const [topFive,setTopFive] = useState([]);
    const [bottomFive,setBottomFive] = useState([]);
    const [playerRank, setPlayerRank] = useState(0);
    const stopAfter = 100;

    useEffect(() => {
        if(loopRef?.current?.loopId !== 0 && loopRef?.current?.loopFrame !== undefined){
            setFrame(loopRef.current.loopFrame);
            if(loopRef?.current?.isRunning){
                setIsRunning(true);
                loopRef.current.intId = setInterval(march,100,cb => {
                    if(cb.frame >= stopAfter) {
                        loopRef.current.isRunning = false;
                        loopRef.current.data.traders.push({
                            cash: loopRef.current.data.playerCash,
                            shares: loopRef.current.data.playerShares,
                            netWorth: loopRef.current.data.playerShares*loopRef.current.data.sharePrice+loopRef.current.data.playerCash,
                            traderId: "You"
                        })
                        loopRef.current.data.traders.sort((a,b) => a.netWorth-b.netWorth);
                        let you = loopRef.current.data.traders.find(t => t.traderId==="You");
                        setPlayerRank(loopRef.current.data.traders.indexOf(you)+1);
                        setTopFive([
                            loopRef.current.data.traders[0],
                            loopRef.current.data.traders[1],
                            loopRef.current.data.traders[2],
                            loopRef.current.data.traders[3],
                            loopRef.current.data.traders[4]
                        ]);
                        setBottomFive([
                            loopRef.current.data.traders[loopRef.current.data.traders.length-5],
                            loopRef.current.data.traders[loopRef.current.data.traders.length-4],
                            loopRef.current.data.traders[loopRef.current.data.traders.length-3],
                            loopRef.current.data.traders[loopRef.current.data.traders.length-2],
                            loopRef.current.data.traders[loopRef.current.data.traders.length-1]
                        ])
                        cb.continue = false;
                        setMarketClosed(true);
                    }
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
    },[isRunning]);

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

    const TopBody = () => topFive.map((t,i) => 
        <TableRow
            key={i}
        >
            <TableCell>
                {i+1}
            </TableCell>
            <TableCell>
                {t.traderId}
            </TableCell>
            <TableCell>
                {new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(t.cash)}
            </TableCell>
            <TableCell>
                {t.shares}
            </TableCell>
            <TableCell>
                {new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(t.netWorth)}
            </TableCell>
        </TableRow>
    );

    const BottomBody = () => bottomFive.map((t,i) => 
        <TableRow
            key={i}
        >
            <TableCell>
                {loopRef.current.data.traders.length-(4-i)}
            </TableCell>
            <TableCell>
                {t.traderId}
            </TableCell>
            <TableCell>
                {new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(t.cash)}
            </TableCell>
            <TableCell>
                {t.shares}
            </TableCell>
            <TableCell>
                {new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(t.netWorth)}
            </TableCell>
        </TableRow>
    );

    const MarketCloseModal = () => <Modal
        open={marketClosed}
        onClose={() => {
            setMarketClosed(!marketClosed)
            setFrame(0);
            setIsRunning(true);
        }}
    >
        <Box
            sx={{
                width: "80vw",
                height: "80vh",
                margin: "5vh auto",
                border: "solid",
                display: "flex",
                background: "white",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
            }}
        >
            <Typography
                variant="h3"
            >
                Market Has Closed
            </Typography>
            <Typography>
                Player Cash: {new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(loopRef.current?.data?.playerCash)}
            </Typography>
            <Typography>
                Player Shares: {loopRef.current?.data?.playerShares}
            </Typography>
            <Typography>
                Player Networth: {new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(loopRef.current?.data?.playerShares*loopRef.current?.data?.sharePrice+loopRef.current?.data?.playerCash)}
            </Typography>
            <Typography>
                Player Rank: {playerRank}
            </Typography>
            <Typography
                variant="h6"
            >
                Top Bubble Traders: 
            </Typography>
            <TableContainer>
                <Table
                    sx={{
                        width: "30vw",
                        margin: "0 auto"
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Ranking
                            </TableCell>
                            <TableCell>
                                Name
                            </TableCell>
                            <TableCell>
                                Cash
                            </TableCell>
                            <TableCell>
                                Shares
                            </TableCell>
                            <TableCell>
                                Networth
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TopBody />
                        <TableRow>
                            <TableCell>
                                ...
                            </TableCell>
                            <TableCell>
                                ...
                            </TableCell>
                            <TableCell
                                // sx={{textAlign: "center"}}
                            >
                                ...
                            </TableCell>
                            <TableCell>
                                ...
                            </TableCell>
                            <TableCell
                                // sx={{textAlign: "center"}}
                            >
                                ...
                            </TableCell>
                        </TableRow>
                        <BottomBody />
                    </TableBody>
                </Table>
            </TableContainer>

        </Box>
    </Modal>
    
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
        
    return <Box>
            <TradingFloorCallback />
            <MarketCloseModal />
        </Box>
}

export default LoopMechanism;