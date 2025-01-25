import { Box, Button, Typography } from "@mui/material";

export const TradeTicket = ({trade,shares,cash}) => {

    return <Box
        sx={{
            border: "solid",
            height: "20vh",
            width: "40vw"
        }}
    >
        Trade Ticket
        <Typography>
            Shares: {shares}
        </Typography>
        <Typography>
            Cash: {new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(cash)}
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