import * as React from 'react';
import RectFill from "./components/RectFill/RectFill";
import './App.css';

// states
//  constants so don't have to shift the numbers around
const welcome = 0;
//  shift
const transitionA = 1;
//  zoom
const transitionB = 2;
const difficultySelect = 7;
const countdown = 3;
const playing = 4;
const gameEnded = 5;
const credits = 6;

// game constants
const winScore = 7;
//  1 game unit -> 'gameToPercent' percents
const gameToPercent = 0.05;
// all below in game units
//  the right eye starts slightly high in the beginning
const rightEyeStartOffset = -1.75/gameToPercent;
const leftEyeStartOffset = 0.85/gameToPercent;
//  game bounds
const topBound = -35/gameToPercent;
const botBound = 40/gameToPercent;
//  left: 23% on puck puts puck center on edge of paddle, TODO: when in use subtract puckRadius
const distToPaddlePlane = 23/gameToPercent;
//  same as above but death (scoring) plane
const distToDeathPlane = 23.9/gameToPercent;
//  paddle width - from center to edge is 'paddleWidth'/2
const paddleWidth = 27/gameToPercent;
//  radius of puck
const puckRadius = 2.5/gameToPercent;

// game speed constants
const ticksPS = 60;
// horizontal
const puckStartSpeed = -14;
const puckMinSpeed = 14;
// vertical
const paddleSpeed = 17;
let aiPaddleSpeed = 12;
const difficultyAISpeed = [6, 8, 12, 16];
// controls the physics of ball bouncing off the paddle
const vertSpeedConservation = .4;
// desmos: Kaguya Pong
//  s = 'scaleLine'
//  f1 = how much ySpeed the ball gets
//  f2 = how much xSpeed the ball gets
//   x-axis = distance from paddle center in percent
//   y-axis = speed
//  formula:
//   ySpeed = oldYSpeed*vertSpeedConservation + f1
//   xSpeed = (-oldXSpeed) + f2*horzSpeedMod         (min of minSpeed)
const scaleLine = 40;
// we want x speed to be slower than y speed since more space
const horzSpeedMod = 1/2;

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            state: welcome,
            countdownVal: -1,
            difficultySelected: 1,
        };

        // for handlers
        this.keysDown = new Set();

        // game variables
        this.tickInterval = null;
        this.paddle1Pos = null;
        this.paddle2Pos = null;
        this.xPuck = null;
        this.yPuck = null;
        this.xVelecityPuck = null;
        this.yVelecityPuck = null;
        this.scoreLeft = null;
        this.scoreRight = null;
    }

    // event handlers
    // handler functions
    pressAnyToContinue() {
        this.setState(() => ({state: transitionA}));
        setTimeout(() => {
            this.setState(() => ({state: transitionB}));
            setTimeout(() => this.setState(() => ({state: difficultySelect})), 1200);
        }, 1200);
    }
    playAgain() {
        this.setState(() => ({state: difficultySelect}));
    }
    selectDifficulty(val) {
        if(val === undefined || val < 0 || val > difficultyAISpeed.length) {
            console.log(`SELECTDIFFICULTY ERROR`);
        }
        else {
            aiPaddleSpeed = difficultyAISpeed[val];
            this.setState(() => ({difficultySelected: val}));
            setTimeout(() => this.setState(() => ({state: countdown, countdownVal: -1})), 50);
        }
    }
    keyPressHandler(e) {
        const {state, difficultySelected} = this.state;

        // console.log(`keyPress: ${e.key}`);

        // press any key to continue...
        if(state === welcome) {
            this.pressAnyToContinue();
        }
        // difficulty select
        if(state === difficultySelect) {
            if(e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
                if(difficultySelected > 0) {
                    this.setState((old) => ({difficultySelected: old.difficultySelected-1}));
                }
            }
            if(e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
                if(difficultySelected < difficultyAISpeed.length-1) {
                    this.setState((old) => ({difficultySelected: old.difficultySelected+1}));
                }
            }
            if(e.key === 'Enter') {
                this.selectDifficulty(difficultySelected);
            }
        }
        // play again?
        if(state === credits) {
            this.playAgain();
        }
    }
    clickHandler(e) {
        const {state} = this.state;

        console.log(`click: ${e}`);

        // press any key to continue...
        if(state === welcome){
            this.pressAnyToContinue();
        }
        // play again?
        if(state === credits){
            this.playAgain();
        }
    }
    keyDownHandler(e) {
        this.keysDown.add(e.key);
    }
    keyUpHandler(e) {
        this.keysDown.delete(e.key);
    }

    // render
    render() {
        const {state, countdownVal, difficultySelected} = this.state;

        if(state === welcome) {
            return (
                <div className={'app'} id={'app'} onKeyPress={(e) => this.keyPressHandler(e)}
                     onKeyDown={(e) => this.keyDownHandler(e)} onKeyUp={(e) => this.keyUpHandler(e)}
                     onClick={(e) => this.clickHandler(e)} tabIndex={-1}>
                    <RectFill padding={25} ratio={1.77777777778} className={"slow-transition"}>
                        <div className={"bg-2 fill"} />
                        <div className={"right-eye fill"} />
                        <div className={"left-eye fill"} />
                        <div className={"text"}>
                            PRESS START
                        </div>
                    </RectFill>
                </div>
            );
        }

        else if(state === transitionA) {
            return (
                <div className={'app'} id={'app'} onKeyPress={(e) => this.keyPressHandler(e)}
                     onKeyDown={(e) => this.keyDownHandler(e)} onKeyUp={(e) => this.keyUpHandler(e)}
                     onClick={(e) => this.clickHandler(e)} tabIndex={-1}>
                    <RectFill padding={10} ratio={1} className={"slow-transition"}>
                        <div className={"bg-2 fill fill-transition"} />
                        <div className={"right-eye fill fill-transition"} />
                        <div className={"left-eye fill fill-transition"} />
                    </RectFill>
                </div>
            );
        }

        else if(state === transitionB) {
            return(
                <div className={'app'} id={'app'} onKeyPress={(e) => this.keyPressHandler(e)}
                     onKeyDown={(e) => this.keyDownHandler(e)} onKeyUp={(e) => this.keyUpHandler(e)}
                     onClick={(e) => this.clickHandler(e)} tabIndex={-1}>
                    <RectFill padding={10} ratio={1} className={"hide-overflow"}>
                        <div className={"bg-2 fill fill2 fill-transition"} />
                        <div className={"right-eye fill fill2 fill-transition"} />
                        <div className={"left-eye fill fill2 fill-transition"} />
                    </RectFill>
                </div>
            );
        }

        else if(state === difficultySelect) {
            return(
                <div className={'app'} id={'app'} onKeyPress={(e) => this.keyPressHandler(e)}
                     onKeyDown={(e) => this.keyDownHandler(e)} onKeyUp={(e) => this.keyUpHandler(e)}
                     onClick={(e) => this.clickHandler(e)} tabIndex={-1}>
                    <RectFill padding={10} ratio={1} className={"hide-overflow"}>
                        <div className={"bg-2 fill fill2 fill-transition"} />
                        <div className={"right-eye fill fill2 fill-transition"} />
                        <div className={"left-eye fill fill2 fill-transition"} />
                        <div className={"text textGame"}>
                            ENEMY IQ:
                            <br /><br />
                            <span onClick={() => this.selectDifficulty(0)}
                                  className={'diff-selector' + ((difficultySelected === 0) ? (' selected') : (''))}>
                                CHIKA
                            </span>
                            <br /><br />
                            <span onClick={() => this.selectDifficulty(1)}
                                  className={'diff-selector' + ((difficultySelected === 1) ? (' selected') : (''))}>
                                KAGUYA
                            </span>
                            <br /><br />
                            <span onClick={() => this.selectDifficulty(2)}
                                  className={'diff-selector' + ((difficultySelected === 2) ? (' selected') : (''))}>
                                HAYASAKA
                            </span>
                            <br /><br />
                            <span onClick={() => this.selectDifficulty(3)}
                                  className={'diff-selector' + ((difficultySelected === 3) ? (' selected') : (''))}>
                                ISHIGAMI
                            </span>
                        </div>
                    </RectFill>
                </div>
            );
        }

        else if(state === countdown) {
            // Countdown
            if(countdownVal === -1){
                this.setState(() => ({countdownVal: 4}));

                setTimeout(() => {
                    this.setState(() => ({countdownVal: 3}));
                    setTimeout(() => {
                        this.setState(() => ({countdownVal: 2}));
                        setTimeout(() => {
                            this.setState(() => ({countdownVal: 1}));
                            setTimeout(() => {
                                this.setState(() => ({countdownVal: 0}));
                                setTimeout(() => {
                                    this.setState(() => ({state: playing}));
                                }, 1000);
                            }, 1000);
                        }, 1000);
                    }, 1000);
                }, 1000);
            }

            return(
                <div className={'app'} id={'app'} onKeyPress={(e) => this.keyPressHandler(e)}
                     onKeyDown={(e) => this.keyDownHandler(e)} onKeyUp={(e) => this.keyUpHandler(e)}
                     onClick={(e) => this.clickHandler(e)} tabIndex={-1}>
                    <RectFill padding={10} ratio={1} className={"hide-overflow"}>
                        <div className={"bg-2 fill fill2"} />
                        {this.makeBorders()}
                        <div className={"right-eye fill fill2"} />
                        <div className={"left-eye fill fill2"} />
                        <div className={"puck fill fill2"} />
                        <div className={"text textGame"}>
                            {((countdownVal === 4) ? ("READY") : (countdownVal))}
                        </div>
                    </RectFill>
                </div>
            );
        }

        else if(state === playing) {
            // start playing
            if(this.tickInterval === null){
                this.resetGameVars();
                console.log(`game starting, ai speed: ${aiPaddleSpeed}`);
                this.tickInterval = setInterval(() => this.tick(), 1000/ticksPS);
            }

            return(
                <div className={'app'} id={'app'} onKeyPress={(e) => this.keyPressHandler(e)}
                     onKeyDown={(e) => this.keyDownHandler(e)} onKeyUp={(e) => this.keyUpHandler(e)}
                     onClick={(e) => this.clickHandler(e)} tabIndex={-1}>
                    <RectFill padding={10} ratio={1} className={"hide-overflow"}>
                        <div className={"bg-2 fill fill2"} />
                        {this.makeBorders()}
                        <div className={"text textGame textScore"}>
                            {`${this.scoreLeft}`}<span />-<span />{`${this.scoreRight}`}
                        </div>
                        <div className={"left-eye fill fill2"} style={({
                            top: `${(this.paddle1Pos-leftEyeStartOffset)*gameToPercent}%`,
                        })} />
                        <div className={"right-eye fill fill2"} style={({
                            top: `${(this.paddle2Pos-rightEyeStartOffset)*gameToPercent}%`,
                        })} />
                        <div className={"puck fill fill2"} style={({
                            left: `${this.xPuck*gameToPercent}%`,
                            top: `${this.yPuck*gameToPercent}%`,
                        })} />
                    </RectFill>
                </div>
            );
        }

        else if(state === gameEnded) {
            if(this.tickInterval) {
                clearInterval(this.tickInterval);
                this.tickInterval = null;
            }

            return(
                <div className={'app'} id={'app'} onKeyPress={(e) => this.keyPressHandler(e)}
                     onKeyDown={(e) => this.keyDownHandler(e)} onKeyUp={(e) => this.keyUpHandler(e)}
                     onClick={(e) => this.clickHandler(e)} tabIndex={-1}>
                    <RectFill padding={10} ratio={1} className={"hide-overflow"}>
                        <div className={"bg-2 fill fill2"} />
                        {this.makeBorders()}
                        <div className={"text textGame textScore"}>
                            {`${this.scoreLeft}`}<span />-<span />{`${this.scoreRight}`}
                        </div>
                        <div className={"left-eye fill fill2"} style={({
                            top: `${(this.paddle1Pos-leftEyeStartOffset)*gameToPercent}%`,
                        })} />
                        <div className={"right-eye fill fill2"} style={({
                            top: `${(this.paddle2Pos-rightEyeStartOffset)*gameToPercent}%`,
                        })} />
                        <div className={"puck fill fill2"} style={({
                            left: `${this.xPuck*gameToPercent}%`,
                            top: `${this.yPuck*gameToPercent}%`,
                        })} />
                        <div className={"text textGame"}>
                            {`P${((this.scoreLeft > this.scoreRight) ? (1) : (2))} WINS!`}
                        </div>
                    </RectFill>
                </div>
            );
        }

        else if(state === credits) {
            return(
                <div className={'app'} id={'app'} onKeyPress={(e) => this.keyPressHandler(e)}
                     onKeyDown={(e) => this.keyDownHandler(e)} onKeyUp={(e) => this.keyUpHandler(e)}
                     onClick={(e) => this.clickHandler(e)} tabIndex={-1}>
                    <RectFill padding={10} ratio={1} className={"hide-overflow"}>
                        <div className={"bg-2 fill fill2"} />
                        {this.makeBorders()}
                        <div className={"text textGame textScore"}>
                            {`${this.scoreLeft}`}<span />-<span />{`${this.scoreRight}`}
                        </div>
                        <div className={"left-eye fill fill2"} style={({
                            top: `${(this.paddle1Pos-leftEyeStartOffset)*gameToPercent}%`,
                        })} />
                        <div className={"right-eye fill fill2"} style={({
                            top: `${(this.paddle2Pos-rightEyeStartOffset)*gameToPercent}%`,
                        })} />
                        <div className={"puck fill fill2"} style={({
                            left: `${this.xPuck*gameToPercent}%`,
                            top: `${this.yPuck*gameToPercent}%`,
                        })} />
                        <div className={"text textGame"}>
                            {`P${((this.scoreLeft > this.scoreRight) ? (1) : (2))} WINS!`}
                            <br /><br />
                            PLAY AGAIN?
                        </div>
                    </RectFill>
                </div>
            );
        }

        // TODO: onwards

        console.log(`UNKNOWN STATE IN APP: ${state}`);
        return null;
    }

    // game functions
    tick() {
        // check gameover / reset paddle position
        if(Math.abs(this.xPuck) >= distToDeathPlane) {
            if(this.scoreLeft >= winScore || this.scoreRight >= winScore) {
                clearInterval(this.tickInterval);
                this.setState(() => ({state: gameEnded}));
                setTimeout(() => this.setState(() => ({state: credits})), 2000);
                return;
            }

            this.xVelecityPuck = ((this.xPuck > 0) ? (puckStartSpeed/3 * -1) : (puckStartSpeed/3));
            this.yVelecityPuck = Math.random()*puckMinSpeed-puckMinSpeed/2;
            this.xPuck = 0;
            this.yPuck = 0;
        }

        // move paddles
        if(this.keysDown.has('ArrowUp') || this.keysDown.has('w') || this.keysDown.has('W')) {
            this.paddle1Pos = Math.max(this.paddle1Pos-paddleSpeed, topBound+paddleWidth/2);
        }
        if(this.keysDown.has('ArrowDown') || this.keysDown.has('s') || this.keysDown.has('S')) {
            this.paddle1Pos = Math.min(this.paddle1Pos+paddleSpeed, botBound-paddleWidth/2);
        }
        //  ai
        //  TODO: more complicated ai
        if(this.paddle2Pos > this.yPuck+aiPaddleSpeed) {
            this.paddle2Pos = Math.max(this.paddle2Pos-aiPaddleSpeed, topBound+paddleWidth/2);
        }
        else if(this.paddle2Pos < this.yPuck-aiPaddleSpeed) {
            this.paddle2Pos = Math.min(this.paddle2Pos+aiPaddleSpeed, botBound-paddleWidth/2);
        }

        // move ball
        //  bounce formula:
        //   ySpeed = oldYSpeed*vertSpeedConservation + f1
        //   xSpeed = (-oldXSpeed) + f2*horzSpeedMod         (min of minSpeed)
        let newX = this.xPuck + this.xVelecityPuck;
        let newY = this.yPuck + this.yVelecityPuck;
        //  worst edge case: ball moving diagonally into corner
        if((newY <= topBound || newY >= botBound) && Math.abs(newX) >= distToPaddlePlane-puckRadius){
            // console.log("corner case");
            const percentXToGo = Math.abs((Math.abs(this.xPuck - distToPaddlePlane)+puckRadius)/this.xVelecityPuck);
            const percentYToGo = ((newY <= topBound) ? (
                Math.abs((Math.abs(this.yPuck-topBound)+puckRadius)/this.yVelecityPuck)
            ) : (
                Math.abs((Math.abs(this.yPuck-botBound)+puckRadius)/this.yVelecityPuck)
            ));

            if(percentXToGo > percentYToGo){
                [newX, newY] = this.bounceY(newY);
                [this.xPuck, this.yPuck] = this.bounceX(newX);
            }
            else {
                [newX, newY] = this.bounceX(newX);
                [this.xPuck, this.yPuck] = this.bounceY(newY);
            }
        }
        else if(newY <= topBound || newY >= botBound) {
            [this.xPuck, this.yPuck] = this.bounceY(newY);
        }
        else if (Math.abs(newX) >= distToPaddlePlane-puckRadius) {
            [this.xPuck, this.yPuck] = this.bounceX(newX);
        }
        else {
            [this.xPuck, this.yPuck] = [newX, newY];
        }

        // check scoring
        if(Math.abs(this.xPuck) >= distToDeathPlane){
            this.scoreLeft += (this.xPuck > 0);
            this.scoreRight += (this.xPuck < 0);
        }

        this.forceUpdate();
    }
    // helpers ball movement
    //  return [newX, newY]
    bounceY(newY) {
        const slope = this.yVelecityPuck/this.xVelecityPuck;
        this.yVelecityPuck *= -1;

        if(newY <= topBound) {
            const projectedIntersectionX = (topBound-this.yPuck)/slope + this.xPuck;
            const xAfterBounce = Math.abs(this.xVelecityPuck) - Math.abs(projectedIntersectionX-this.xPuck);

            return [this.xPuck+this.xVelecityPuck, topBound+(-slope*xAfterBounce)];
        }
        else if(newY >= botBound) {
            const projectedIntersectionX = (botBound-this.yPuck)/slope + this.xPuck;
            const xAfterBounce = Math.abs(this.xVelecityPuck) - Math.abs(projectedIntersectionX-this.xPuck);

            return [this.xPuck+this.xVelecityPuck, botBound-(-slope*xAfterBounce)];
        }
        else {
            console.log('ERROR IN BOUNCEY');
            return undefined;
        }
    }
    //  bounce formula:
    //   xSpeed = (-oldXSpeed) + (-scale(dist)+scale/4)*horzSpeedMod         (min of minSpeed)
    //   ySpeed = oldYSpeed*vertSpeedConservation + (scale(dist))
    bounceX(newX) {
        // paddle 1
        if(-newX >= distToPaddlePlane-puckRadius) {
            // only bounce if paddle is there
            const distToCenterPaddle = (this.yPuck - this.paddle1Pos)/paddleWidth;
            if(Math.abs(distToCenterPaddle) > 0.5+puckRadius/paddleWidth){
                return [newX, this.yPuck+this.yVelecityPuck];
            }

            // calculate new velocities
            const [xVel, yVel] = [this.xSpeedBounceX(this.xVelecityPuck, distToCenterPaddle), this.ySpeedBounceX(this.yVelecityPuck, distToCenterPaddle)];

            // calculate the ball's new position this tick
            let xPos, yPos;
            //  if its already inside the paddle simply change velocities and update position
            if(-this.xPuck >= distToPaddlePlane-puckRadius) {
                [xPos, yPos] = [this.xPuck+xVel, this.yPuck+yVel];
            }
            //  otherwise simulate how the bounce would work given infinite tick rate
            else {
                // model how much more the puck should have traveled after the bounce
                const percentTurnTraveled = Math.abs((distToPaddlePlane - Math.abs(this.xPuck) - puckRadius)/this.xVelecityPuck);
                const percentMoreToTravel = 1 - percentTurnTraveled;
                // find the x/y the puck would have hit the paddle
                const projectedIntersectionY = (this.yVelecityPuck/this.xVelecityPuck)*(-distToPaddlePlane-this.xPuck+puckRadius)+this.yPuck;

                // model where the puck would have traveled to after the collision
                [xPos, yPos] = [-distToPaddlePlane+percentMoreToTravel*xVel+puckRadius, projectedIntersectionY+percentMoreToTravel*yVel];
            }

            // if the new position is still in the paddle, eject it
            if(-xPos >= distToPaddlePlane-puckRadius) {
                [xPos, yPos] = [-distToPaddlePlane+1+puckRadius, (yVel/xVel)*Math.abs((-distToPaddlePlane+1+puckRadius)-xPos)+yPos];
            }

            // update
            [this.xVelecityPuck, this.yVelecityPuck] = [xVel, yVel];
            return [xPos, yPos];
        }
        // paddle 2
        else if(newX >= distToPaddlePlane-puckRadius) {
            // only bounce if paddle is there
            const distToCenterPaddle = (this.yPuck - this.paddle2Pos)/paddleWidth;
            if(Math.abs(distToCenterPaddle) > 0.5+puckRadius/paddleWidth){
                return [newX, this.yPuck+this.yVelecityPuck];
            }

            // calculate new velocities
            const [xVel, yVel] = [-this.xSpeedBounceX(this.xVelecityPuck, distToCenterPaddle), this.ySpeedBounceX(this.yVelecityPuck, distToCenterPaddle)];

            // calculate the ball's new position this tick
            let xPos, yPos;
            //  if its already inside the paddle simply change velocities and update position
            if(this.xPuck >= distToPaddlePlane-puckRadius) {
                [xPos, yPos] = [this.xPuck+xVel, this.yPuck+yVel];
            }
            //  otherwise simulate how the bounce would work given infinite tick rate
            else {
                // model how much more the puck should have traveled after the bounce
                const percentTurnTraveled = Math.abs((distToPaddlePlane - Math.abs(this.xPuck)-puckRadius)/this.xVelecityPuck);
                const percentMoreToTravel = 1 - percentTurnTraveled;
                // find the x/y the puck would have hit the paddle
                const projectedIntersectionY = (this.yVelecityPuck/this.xVelecityPuck)*(distToPaddlePlane-this.xPuck-puckRadius)+this.yPuck;

                // model where the puck would have traveled to after the collision
                [xPos, yPos] = [distToPaddlePlane+percentMoreToTravel*xVel-puckRadius, projectedIntersectionY+percentMoreToTravel*yVel];
            }

            // if the new position is still in the paddle, eject it
            if(xPos >= distToPaddlePlane-puckRadius) {
                [xPos, yPos] = [distToPaddlePlane-1-puckRadius, (yVel/xVel)*Math.abs((distToPaddlePlane-1-puckRadius)-xPos)+yPos];
            }

            // update
            [this.xVelecityPuck, this.yVelecityPuck] = [xVel, yVel];
            return [xPos, yPos];
        }
        else {
            console.log('ERROR IN BOUNCEX');
            return undefined;
        }
    }
    xSpeedBounceX(oldSpeed, distToCenterPaddle) {
        return Math.max(Math.abs(oldSpeed) + (-scaleLine*Math.abs(distToCenterPaddle) + scaleLine/4)*horzSpeedMod, puckMinSpeed);
    }
    ySpeedBounceX(oldSpeed, distToCenterPaddle) {
        return oldSpeed*vertSpeedConservation + (scaleLine*distToCenterPaddle);
    }

    // helper function
    // makes the bounds
    makeBorders() {
        return(
            <>
                <div className={"horz-bound fill fill2"} style={({top: `${topBound*gameToPercent-puckRadius*gameToPercent}%`})} />
                <div className={"horz-bound fill fill2"} style={({top: `${botBound*gameToPercent+puckRadius*gameToPercent}%`})} />
                <div className={"vert-bound fill fill2"} style={({left: `${-distToDeathPlane*gameToPercent - puckRadius*gameToPercent}%`})} />
                <div className={"vert-bound fill fill2"} style={({left: `${distToDeathPlane*gameToPercent + puckRadius*gameToPercent}%`})} />
            </>
        );
    }
    // resets default game vars
    resetGameVars() {
        this.paddle1Pos = leftEyeStartOffset;
        this.paddle2Pos = rightEyeStartOffset;
        this.xPuck = 0;
        this.yPuck = 0;
        this.xVelecityPuck = puckStartSpeed;
        this.yVelecityPuck = 0;
        this.scoreLeft = 0;
        this.scoreRight = 0;
    }
}

export default App;
