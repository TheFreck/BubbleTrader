import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";

export const Chart = ({history}) => {
    const [xaxis,setXaxis] = useState([]);
    const [yaxis,setYaxis] = useState([]);

    useEffect(() =>{
        console.log("chart history: ", history);
        // let xs = history.map(h => h.frame);
        // let ys = history.map(h => h.price);
        // console.log("xs: ", xs);
        // console.log("ys: ", ys);
    },[]);

    return <LineChart 
        dataset={history}
        xAxis={[{dataKey: "frame"}]}
        series={[{dataKey: "price"}]}
        // xAxis={[{
        //     data: history.map(h => h.frame)
        // }]}
        // series={[{
        //     data: history.map(h => h.price)
        // }]}
        width={1000}
        height={600}
    />
    // return <div>Chart</div>
}

export default Chart;