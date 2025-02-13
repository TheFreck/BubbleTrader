import { useCallback, useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";

export const ChartComponent = ({getHistory,isRunning}) => {
    const [pixels,setPixels] = useState([]);
    const pixelSize = 20;
    const chartRef = useRef();

    useEffect(() => {
        chartRef.current = {
            isRunning,
            intId: 0
        }
        if(isRunning){
            chartRef.current.intId = setInterval(getHistory,pixelSize*100,cb => {
                formatData(cb,formatted => {
                    setPixels([{data:formatted}]);
                })
            });
        }
        else clearInterval(chartRef?.current?.intId);
        return () => clearInterval(chartRef?.current?.intId);
    },[]);

    const formatData = (data,cb) => {
        let pix = [];
        for(var i=0; i<data.length; i+=pixelSize){
            let constituents = [];
            for(var j=0; j<pixelSize; j++){
                if(data[i+j])
                    constituents.push(data[i+j]);
                else break;
            }
            let pixel = [constituents[0],Math.max(...constituents),Math.min(...constituents),constituents[constituents.length-1]];
            pix.push([i/pixelSize,pixel]);
        }
        let remove = pix.length-30;
        let chartData = pix.filter((p,i) => i>= remove);
        console.log("chartData: ", chartData);
        cb(chartData);
    }

    return <Chart 
        style={{
            width: "60vw",
            height: "50vh",

        }}
        options={{
            chart: {
                type: "candlestick"
            },
            series: {
                data: pixels
            }
        }}
        series={pixels}
        type="candlestick"
    />
}

export default ChartComponent;