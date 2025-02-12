import { Box, Button, Typography } from "@mui/material";

export const TradeTicket = ({trade,shares,cash,sharePrice}) => {

    return <Box
        sx={{
            border: "solid",
            height: "20vh",
            width: "20vw",
        }}
    >
        <Typography>
            Shares: {shares}
        </Typography>
        <Typography>
            Cash: {new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(cash)}
        </Typography>
        <Typography>
            Networth: {new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(cash + sharePrice*shares)}
        </Typography>
        <Button
            onClick={() => trade(1)}
        >
            Buy
        </Button>
        <Button
            onClick={() => trade(-1)}
        >
            Sell
        </Button>
    </Box>
}

export default TradeTicket;