import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";

export const Chart = ({history}) => {

    return <LineChart 
        dataset={history}
        xAxis={[{dataKey: "frame"}]}
        series={[{dataKey: "price"}]}
        width={1000}
        height={600}
    />
}

export default Chart;