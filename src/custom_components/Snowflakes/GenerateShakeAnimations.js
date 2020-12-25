for (let i = 0; i < 11; i++) {
    console.log(`\n/*Shake Animation ${i}*/`);
    const num = Math.random()*40 + 100 - 20;
    console.log(`@keyframes snowflakes-shake${i}{0%,100%{transform:translateX(0)}50%{transform:translateX(${num}px)}}`);
    console.log(`@-webkit-keyframes snowflakes-shake${i}{0%,100%{-webkit-transform:translateX(0);transform:translateX(0)}50%{-webkit-transform:translateX(${num}px);transform:translateX(${num}px)}}`);
}