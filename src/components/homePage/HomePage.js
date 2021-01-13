import Snowflakes from "../../custom_components/Snowflakes/Snowflakes";
import Photo_Me from "../../img/troy.jpg";
import App from "../app/App";
import React from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";

const numHyphens = 80;
let hyphenLeft = "";
let hyphenRight = "";
for (let i = 0; i < numHyphens; i++) {
    hyphenLeft += " <--";
    hyphenRight += "--> ";
}

const HomePage = () => (
    <div className={'background'}>
        <Snowflakes numSnowflakes={40} opacityRange={[0.4, 0.8]} sizeRange={[1.5, 3.3]} />
        <p className={'static-text main'}>
            <span className={'title'}>Merry Christmas</span>
        </p>
        <p className={'static-text'}>
            Merry Christmas Emily!<br />
            You're the best girlfriend ever!<br />
            I really really really love you a lottttt!!!!!!!!!!<br /><br />
            You're amazing,<br />
            cute,<br />
            nice,<br />
            caring,<br />
            warm,<br />
            hot,<br />
            funny,<br />
            wholesome,<br />
            adorable,<br />
            considerate,<br />
            sexy,<br />
            interesting,<br />
            relaxing,<br />
            pretty,<br />
            fun,<br />
            and you have beautiful eyes!<br /><br />
            I'm really glad that I met you and talked to you and asked you out!<br />
            Thank you for blowing my expectations away every time we talkkkkkk<br />
            You're more amazing then I ever imagined :D<br /><br />
            I wanna be with you and love you forever!<br />
            I really really really really love you!<br />
        </p>
        <div className={'static-text no-wrap'}>
            {`|${hyphenLeft} I Love You This Much! ${hyphenRight}|`}
        </div>
        <p className={'static-text'}>
            Also, I got a haircut :P<br />
            Choi returns >:D
            <br />
            <img className={'portrait'} src={Photo_Me} alt={""} />
            <br />
            Lastly: <Link to="/kaguya_pong">Cursed Kaguya Pong!</Link>
        </p>
    </div>
);

export default HomePage;