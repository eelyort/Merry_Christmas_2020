import * as React from 'react';
import './Snowflakes.css';

// -webkit-animation-delay:2s,2s;animation-delay:2s,2s

const Snowflakes = ({
        numSnowflakes=12,
        sizeRange=[1,2],
        opacityRange=[0.8, 0.9],
        snowflakeTypes=['❆', '❅', '❄'],
        animationDuration=[[12, 17], [3, 7]],
        possibleShakeAnimations=10,
        animationTimingFunctions=['ease', 'ease-in', 'ease-out', 'ease-in-out'],
        rotateDur=[20, 35],
        possibleRotations=['snowflakes-rotate', 'snowflakes-rotate-reverse'],
    }) => {
    let snowflakes = Array(numSnowflakes).fill(null);

    // animation stuff
    const maxAniDelay = Math.abs(animationDuration[0][0]+animationDuration[0][1])/2;

    snowflakes = snowflakes.map((value, index) => {
        // need same value for two css options
        const aniNameString = `snowflakes-fall,snowflakes-shake${Math.floor(Math.random()*possibleShakeAnimations)}`;
        const aniDurationString = animationDuration.map((value, index) => `${(Math.random()*Math.abs(value[1]-value[0])) + Math.min(value[0], value[1])}s`).join(', ');
        const aniDelayString = `${Math.random()*maxAniDelay}s, ${Math.random()*maxAniDelay}s`;
        const aniTimingFunctionString = `${animationTimingFunctions[Math.floor(Math.random()*animationTimingFunctions.length)]}, ease-in-out`;
        // rotate
        const rotateName = `${possibleRotations[Math.floor(Math.random()*possibleRotations.length)]}`;
        const rotateDuration = `${(Math.random()*Math.abs(rotateDur[1]-rotateDur[0])) + Math.min(rotateDur[0], rotateDur[1])}s`;

        // snowflake in this one
        const snowflakeType = snowflakeTypes[Math.floor(Math.random()*snowflakeTypes.length)];

        const style = {
            fontSize: `${(Math.random()*Math.abs(sizeRange[1]-sizeRange[0])) + Math.min(sizeRange[0], sizeRange[1])}em`,
            opacity: `${(Math.random()*Math.abs(opacityRange[1]-opacityRange[0])) + Math.min(opacityRange[0], opacityRange[1])}`,
            left: `${Math.random()*100}%`,

            animationName: aniNameString,
            webkitAnimationName: aniNameString,

            animationDuration: aniDurationString,
            webkitAnimationDuration: aniDurationString,

            animationDelay: aniDelayString,
            webkitAnimationDelay: aniDelayString,

            animationTimingFunction: aniTimingFunctionString,
            webkitAnimationTimingFunction: aniTimingFunctionString,
        };
        // since transform overrides
        const style2 = {
            animationName: rotateName,
            webkitAnimationName: rotateName,

            animationDuration: rotateDuration,
            webkitAnimationDuration: rotateDuration,
        };

        return (
            <div key={`${snowflakeType} - Delay: ${aniDelayString}`} className={'Snowflakes-js-snowflake'} style={style}>
                <div className={'Snowflakes-js-snowflake-rotate'} style={style2}>
                    {snowflakeType}
                </div>
            </div>
        );
    });
    return (
        <>
            {snowflakes}
        </>
    );
};

export default Snowflakes;