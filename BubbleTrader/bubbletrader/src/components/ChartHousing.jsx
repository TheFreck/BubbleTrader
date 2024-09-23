import React, { Suspense, useCallback, useContext, useEffect, useRef, useState } from "react";
import TradingContext from "./TradingContext";
import PriceChart from "./PriceChart";
import Form from 'react-bootstrap/Form';

export const ChartHousing = () => {
    const context = useContext(TradingContext);
    const [asset, setAsset] = useState({ assetName: "none" });
    const [periods, setPeriods] = useState(100);
    const [assetNames, setAssetNames] = useState([]);
    const [movingAverage1, setMovingAverage1] = useState(1);
    const [movingAverage2, setMovingAverage2] = useState(1);
    const [displayPriceOrValue, setDisplayPriceOrValue] = useState(true);
    const [displayMovingAverages, setDisplayMovingAverages] = useState(true);
    const [displayType, setDisplayType] = useState('ohlc');

    const handleAssetSelection = event => {
        if (event.target.value.toLowerCase() === 'none') {
            setAsset({ assetName: 'none' });
        }
        else {
            setAsset(context.podiums.find(p => p.assetName === event.target.value));
        }
    }

    const handlePeriodSelection = event => {
        setPeriods(event.target.value);
    }

    const handleMovingAve1 = event => {
        setMovingAverage1(event.target.value);
    }

    const handleMovingAve2 = event => {
        setMovingAverage2(event.target.value);
    }

    const handleDisplayType = (event, newType) => {
        console.log("event: ", event);
        console.log("newType: ", newType);
        setDisplayType(newType);
    }

    const PriceChartCallback = useCallback(() => (
                <PriceChart
                    asset={asset}
                    periods={periods}
                    isActive={context.isRunning}
                    movingAverage1={movingAverage1}
                    movingAverage2={movingAverage2}
                    displayPriceOrValue={displayPriceOrValue}
                    displayMovingAverages={displayMovingAverages}
                    displayType={displayType}
                />,
        [context.floorId, context.isRunning, asset.assetName, periods, displayPriceOrValue, displayMovingAverages, displayType]));

    return <PriceChart
        asset={asset}
        periods={periods}
        isActive={context.isRunning}
        movingAverage1={movingAverage1}
        movingAverage2={movingAverage2}
        displayPriceOrValue={displayPriceOrValue}
        displayMovingAverages={displayMovingAverages}
        displayType={displayType}
    />
    //return <div
    //    style={{ marginTop: '1em' }}
    //>
    //    {/*{asset && assetNames &&*/}
    //    {/*    <Form*/}
    //    {/*        style={{ minWidth: '5vw' }}*/}
    //    {/*    >*/}
    //    {/*        <Form.Label>Asset</Form.Label>*/}
    //    {/*        <Form.Select*/}
    //    {/*            label='Asset'*/}
    //    {/*            onChange={handleAssetSelection}*/}
    //    {/*            value={asset.assetName}*/}
    //    {/*        >*/}
    //    {/*            <option value="none">*/}
    //    {/*                None*/}
    //    {/*            </option>*/}
    //    {/*            {context.assetNames && context.assetNames.map((a, i) =>*/}
    //    {/*                <option key={i} value={a}>{a}</option>*/}
    //    {/*            )}*/}
    //    {/*        </Form.Select>*/}
    //    {/*    </Form>*/}
    //    {/*}*/}
    //    {/*<Form.Text id='Moving Average 1' onChange={handleMovingAve1} value={movingAverage1} />*/}
    //    {/*<Form.Text id='Moving Average 2' onChange={handleMovingAve2} value={movingAverage2} />*/}
    //    {/*<Form.Control>*/}
    //    {/*    <Form.Select*/}
    //    {/*        value={periods}*/}
    //    {/*        label='Periods'*/}
    //    {/*        onChange={handlePeriodSelection}*/}
    //    {/*    >*/}
    //    {/*        <option value={50}>50</option>*/}
    //    {/*        <option value={100}>100</option>*/}
    //    {/*        <option value={150}>150</option>*/}
    //    {/*        <option value={200}>200</option>*/}
    //    {/*        <option value={500}>500</option>*/}
    //    {/*        <option value={1000}>1000</option>*/}
    //    {/*        <option value={5000}>5000</option>*/}
    //    {/*        <option value={10000}>10000</option>*/}
    //    {/*    </Form.Select>*/}
    //    {/*</Form.Control>*/}
    //    {/*<Form.Check*/}
    //    {/*    type="switch"*/}
    //    {/*    id="pvSwitch"*/}
    //    {/*    lable="Price/Value"*/}
    //    {/*    onChange={() => { setDisplayPriceOrValue(!displayPriceOrValue) }}*/}
    //    {/*>*/}
    //    {/*    <option*/}
    //    {/*        value="prices"*/}
    //    {/*        selected={true}*/}
    //    {/*    >*/}
    //    {/*        <span>Price</span>*/}
    //    {/*    </option>*/}
    //    {/*    <option*/}
    //    {/*        value="value"*/}
    //    {/*        selected={false}*/}
    //    {/*    >*/}
    //    {/*        <span>Value</span>*/}
    //    {/*    </option>*/}
    //    {/*</Form.Check>*/}
    //    {/*<Form.Check*/}
    //    {/*    id="movingAverage"*/}
    //    {/*    onChange={() => setDisplayMovingAverages(!displayMovingAverages)}*/}
    //    {/*    label="MA"*/}
    //    {/*>*/}
    //    {/*    <span>MA</span>*/}
    //    {/*</Form.Check>*/}
    //    {/*<Form.Control*/}
    //    {/*    exclusive*/}
    //    {/*    onChange={handleDisplayType}*/}
    //    {/*>*/}
    //    {/*    <Form.Check*/}
    //    {/*        value='ohlc'*/}
    //    {/*        selected={displayType === 'ohlc'}*/}
    //    {/*    >*/}
    //    {/*        <span>OHLC</span>*/}
    //    {/*    </Form.Check>*/}
    //    {/*    <Form.Check*/}
    //    {/*        value='line'*/}
    //    {/*        selected={displayType === 'line'}*/}
    //    {/*    >*/}
    //    {/*        <span>Line</span>*/}
    //    {/*    </Form.Check>*/}
    //    {/*</Form.Control>*/}

    //    <PriceChartCallback />
    //</div>
}

export default ChartHousing;