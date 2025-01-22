import { Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import LoopContainer from "./LoopContainer";

export const Home = () => {
    const [appId, setAppId] = useState(0);

    useEffect(() => {
        if(appId === 0){
            init(id => {
                setAppId(id);
            })
        }
    },[]);

    const init = (cb) => {
        let id = Math.floor(Math.random()*111);
        cb(id);
    }

    const LoopContainerCallback = useCallback(() => appId === 0 ? <Box>Not Ready Yet</Box> : <LoopContainer appId={appId} />,[appId]);
    
    return <LoopContainerCallback />
}

export default Home;