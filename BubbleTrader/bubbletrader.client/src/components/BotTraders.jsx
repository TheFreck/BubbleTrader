import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

export const BotTraders = ({getTraders,getSharePrice,isRunning}) => {
    const botRef = useRef();
    const [frame,setFrame] = useState(0);
    const [traders,setTraders] = useState([]);
    const [sharePrice,setSharePrice] = useState(0);
    const [orderBy,setOrderBy] = useState("cash");
    const [orderDirection,setOrderDirection] = useState(true);
    const [ready,setReady] = useState(false);

    useEffect(() => {
        botRef.current = {
            isRunning,
            traders: getTraders(),
            sharePrice: getSharePrice()
        }
        
        if(isRunning){
            botRef.current.intId = setInterval(getData,100,cb => {
                for(var trader of cb.traders){
                    trader.netWorth = trader.shares*cb.sharePrice + trader.cash;
                }
                setFrame(cb.frame);
                setTraders(cb.traders);
                setSharePrice(cb.sharePrice);
                botRef.current.traders = cb.traders;
                botRef.current.sharePrice = cb.sharePrice;
                
            });
        }
        else {
            let ts = getTraders();
            setTraders(ts);
            let sh = getSharePrice();
            setSharePrice(sh);
            clearInterval(botRef?.current?.intId);
            setReady(!ready);
        }
        return () => clearInterval(botRef?.current?.intId);
    },[isRunning]);

    const getData = (cb) => {
        cb({
            traders: getTraders(),
            sharePrice: getSharePrice(),
            frame: frame+1
        })
    }

    const reorder = (col,direction) => {
        setOrderDirection(direction);
        setOrderBy(col);
        botRef.current.traders.sort((a,b) => direction ? a[col]-b[col] : b[col]-a[col]);
        setReady(!ready);
    }

    const TableContainerCallback = useCallback(() => traders && sharePrice &&
        <TableContainer component={Paper}>
            <Table
                sx={{
                    width: "60vw"
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Name
                        </TableCell>
                        <TableCell
                            sx={{cursor: "pointer"}}
                            onClick={() => orderBy === "cash" ? reorder("cash",!orderDirection) : reorder("cash",orderDirection)}
                        >
                            Cash
                        </TableCell>
                        <TableCell
                            sx={{cursor: "pointer"}}
                            onClick={() => orderBy === "shares" ? reorder("shares", !orderDirection) : reorder("shares", orderDirection)}
                        >
                            Shares
                        </TableCell>
                        <TableCell
                            sx={{cursor: "pointer"}}
                            onClick={() => orderBy==="netWorth" ? reorder("netWorth", !orderDirection) : reorder("netWorth", orderDirection)}
                        >
                            Networth
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        traders && traders.map((t,i) => (
                            <TableRow
                                key={i}
                            >
                                <TableCell>{t.traderId}</TableCell>
                                <TableCell>{new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(t.cash)}</TableCell>
                                <TableCell>{t.shares}</TableCell>
                                <TableCell>{new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(t.netWorth)}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    ,[frame,ready]);

    return <TableContainerCallback />
}

export default BotTraders;