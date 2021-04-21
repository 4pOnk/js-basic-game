let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight - 100;

let w = Math.floor(canvas.width/64);
let h = Math.floor(canvas.height/64);

let mtx = [];
let cd = [];
let pPos = [0,0];

let hearts = 0;

let movement = false;



//wins
let winWin = document.querySelector('#screenRating > div');
let dieWin = document.querySelector('#screenLoss > div');
let startWin = document.querySelector('#screenWelcome > div');

let userName = document.getElementById('username');

let startBtn = document.getElementById('startBtn');

let timerDiv = document.getElementById('hudTime');

let minuts = 0;
let seconds = 0;
let timeCD = true;

setInterval(()=>{
    if(!timeCD){
        if(++seconds === 60){
            seconds = 0;
            minuts++;
        }
        let time = minuts<10?'0'+minuts:minuts;
        time += ':';
        time += seconds<10?'0' + seconds:seconds;
        timerDiv.innerHTML = time
    }
},1000);


document.addEventListener('keyup',()=>{
    startBtn.disabled = !(userName.value.length > 0)
});
startBtn.addEventListener('click',()=>{
    startWin.classList.remove('active');
    movement = true;
    document.getElementById('hudUsername').innerHTML = userName.value;
    timeCD = false;
});
let startBtns =document.getElementsByClassName('start-over');
for (let i = 0; i < startBtns.length; i++){
    startBtns[i].addEventListener('click',()=>{
        winWin.classList.remove('active');
        dieWin.classList.remove('active');
        movement = true;
        generateAll();
        drawMtx();
        timeCD = false;
        minuts = 0;
        seconds = 0;
    })
}

let win = ()=>{
    winWin.classList.add('active');
    movement = false;
    timeCD = true;
};
let die = () => {
    dieWin.classList.add('active');
    movement = false;
    timeCD = true;
};






//0 - tunnel
//1 - ground
//2 - heart
//3 - stone
//5 - player

let generateMtx = ()=>{
    mtx = [];
    cd = [];
    for(let y = 0; y < h; y++){
        mtx.push([]);
        cd.push([]);
        for(let x = 0; x < w; x++){
            mtx[y][x] = 1;
            cd[y][x] = false;
        }
    }
    mtx.push([]);
    for(let x = 0; x < w; x++){
        mtx[h][x] = -1;
    }
};
let randomHeart = ()=>{
    let ry = Math.floor(Math.random()*h);
    let rx = Math.floor(Math.random()*w);
    if(mtx[ry][rx] === 1)mtx[ry][rx] = 2;
    else randomHeart();
};
let randomStone = ()=>{
    let ry = Math.floor(Math.random()*h);
    let rx = Math.floor(Math.random()*w);
    if(mtx[ry][rx] === 1)mtx[ry][rx] = 3;
    else randomStone();
};
let generateAll = ()=>{
    generateMtx();
    mtx[0][0] = 5;
    pPos = [0,0];
    for (let i = 0; i < 10; i++){
        randomHeart();
        randomStone();
    }
};
generateAll();


let heartsDiv = document.getElementById('heartsDiv');

let countHearts = ()=>{
    hearts = 0;
    for(let y = 0; y < h; y++){
        for(let x = 0; x < w; x++){
            if(mtx[y][x] === 2){
                hearts++;
            }
        }
    }
    heartsDiv.innerHTML = 10 - hearts;
    if(hearts === 0)win();
};


let dropDownCheck = ()=>{
    for(let y = 0; y < h; y++){
        for(let x = 0; x < w; x++){
            if((mtx[y][x] === 2 || mtx[y][x] === 3) && (mtx[y+1][x] === 0 || mtx[y + 1][x] === 5) && !cd[y][x]){
                let item  = mtx[y][x];
                cd[y][x] = true;
                setTimeout(()=>{
                    if(item  === mtx[y][x]) {
                        if (mtx[y + 1][x] === 5 && item === 3) {
                            mtx[y][x] = 0;
                            mtx[y + 1][x] = 3;
                            die();
                        }else if (mtx[y + 1][x] === 5 && item === 2) {
                            mtx[y][x] = 0;
                            mtx[y + 1][x] = 5;
                        }else{
                            mtx[y][x] = 0;
                            mtx[y + 1][x] = item;
                        }
                        cd[y][x] = false;
                        drawMtx();
                    }
                },1000)
            }
        }
    }
};





let ground = new Image();
ground.src = 'assets/img/ground.png';

let heart = new Image();
heart.src = 'assets/img/heart.svg';

let stone = new Image();
stone.src = 'assets/img/stone.png';

let player = new Image();
player.src = 'assets/img/player.png';


let drawMtx = ()=> {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let y = 0; y < h; y++){
        for(let x = 0; x < w; x++){
            if(mtx[y][x] === 1){
                ctx.drawImage(ground,x*64,y*64,64,64);
            }else if(mtx[y][x] === 2){
                ctx.drawImage(heart,x*64,y*64,64,64);
            }else if(mtx[y][x] === 3){
                ctx.drawImage(stone,x*64,y*64,64,64);
            }else if(mtx[y][x] === 5){
                ctx.drawImage(player,x*64,y*64,64,64);
            }
        }
    }
    countHearts();
    dropDownCheck();
};

player.onload = () =>{
    drawMtx();
};





document.addEventListener('keypress',(e)=>{
    if(movement) {
        if (e.code === 'KeyD' && pPos[1] < w - 1 && mtx[pPos[0]][pPos[1] + 1] !== 3) {
            mtx[pPos[0]][pPos[1]] = 0;
            pPos[1]++;
            mtx[pPos[0]][pPos[1]] = 5;
        } else if (e.code === 'KeyA' && pPos[1] > 0 && mtx[pPos[0]][pPos[1] - 1] !== 3) {
            mtx[pPos[0]][pPos[1]] = 0;
            pPos[1]--;
            mtx[pPos[0]][pPos[1]] = 5;
        } else if (e.code === 'KeyW' && pPos[0] > 0 && mtx[pPos[0] - 1][pPos[1]] !== 3) {
            mtx[pPos[0]][pPos[1]] = 0;
            pPos[0]--;
            mtx[pPos[0]][pPos[1]] = 5;
        } else if (e.code === 'KeyS' && pPos[0] < h - 1 && mtx[pPos[0] + 1][pPos[1]] !== 3) {
            mtx[pPos[0]][pPos[1]] = 0;
            pPos[0]++;
            mtx[pPos[0]][pPos[1]] = 5;
        }
        drawMtx();
    }
});