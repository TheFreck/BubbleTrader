export const TradingFloorHelpers = {
    createWave: (asset) => {
        const magnitude = TradingFloorHelpers.getMagnitude();
        const duration = Math.floor(Math.random()*(magnitude > 0 ? 200 : 50));
        let wave = {
            magnitude,
            duration
        }
        asset.waves.push(wave);
        // console.log("creating wave: ", wave);
        return asset.waves;
    },
    growAsset: (asset) => {
        let growth = 0;
        for(let i=0; i<asset.waves.length; i++){
            let growthCycle =  TradingFloorHelpers.getGrowthCycle(asset.waves[i].duration/200)/20;
            growth += asset.waves[i].magnitude * growthCycle;
            asset.waves[i].duration--;
        }
        asset.waves = asset.waves.filter(w => w.duration > 0);
        asset.value *= 1+growth;
        return asset;
    },
    getMagnitude: () => {
        let randy = Math.random();
        let a = .03;
        let b = 500;
        let c = .002;
        let mag = Math.atan(-b*(1+c))-a;
        return Math.tan(randy * mag - a)/b+c;
    },
    getGrowthCycle: (period) => {
        // marginal growth curve
        let cycle = Math.pow(period,1/period)/Math.pow(period,period);
        return cycle;
    },
    getBounceAngle: (normal, xSp, ySp) => {
        let aim = TradingFloorHelpers.getAim(xSp, ySp);
        let aimAdjustment = (normal - aim);
        return (aim + aimAdjustment) % 360;
    },
    getAim: (xSpeed, ySpeed) => {
        let aim = 0;
        if (xSpeed === 0 && ySpeed === 0) {
            return 0;
        }
        if (xSpeed === 0) {
            if (ySpeed > 0) {
                aim = 180;
            }
            else {
                aim = 0;
            }
        }
        if (ySpeed === 0) {
            if (xSpeed > 0) {
                aim = 90;
            }
            else {
                aim = 270;
            }
        }
        if (ySpeed < 0) {
            aim = (Math.atan(-xSpeed / ySpeed) / Math.PI * 180) % 360;
        }
        else {
            aim = (Math.atan(-xSpeed / ySpeed) / Math.PI * 180 + 180) % 360;
        }
        return Math.floor(aim * 100) / 100;
    }
}

export default TradingFloorHelpers;