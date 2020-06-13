var stageNum = 2;
var nowStage = 0;

var stageAnswerCntArr = [3, 5, 7];
var stageCheckAvailArr = [6, 10, 16];
var stageWaitingTimeArr = [3000, 5000, 7000];
var stageGameTimeArr = [7, 12, 17];

var startTime;
var timerId = null;


var answerArr = [];

var userClickCnt = 0;
var isClickedStartBtn = false;
var userFailClickCnt = 0;


//[TO-DO] 게임 클리어해서 넘어갈 때 스코어보드 초기화 작업
function scoreBoard() {
    var scene = document.getElementById("board_view");
    var boardWrapper = document.createElement("div");

    boardWrapper.setAttribute("id", "board_wrapper");


    var gameStartBtn = document.createElement("button");
    gameStartBtn.setAttribute("id", "gameStartBtn");
    gameStartBtn.style.width = "98%";

    gameStartBtn.textContent = "게임 시작"
    gameStartBtn.onclick = function () {
        scene = initScene(scene);
        init();
        let gameStartBtn = document.getElementById("gameStartBtn");
        gameStartBtn.style.visibility = 'hidden';

        let statusView = document.getElementById("statusView");
        statusView.textContent = "게임이 진행될 예정입니다.";

        createGameScene();
        isClickedStartBtn = true;

        //gameStartBtn.style.display='none';
    }

    var restClickView = document.createElement("h3");
    restClickView.setAttribute("id", "restClickView");
    restClickView.textContent = "남은 클릭 횟수 : " + String(stageCheckAvailArr[nowStage] - userClickCnt) + "회";

    var failClickView = document.createElement("h3");
    failClickView.setAttribute("id", "failClickView");
    failClickView.textContent = "실패 횟수 : " + userFailClickCnt + "회";


    var restPuppyView = document.createElement("h3");
    restPuppyView.setAttribute("id", "restPuppyView");
    restPuppyView.textContent = "남은 강아지 수 : " + answerArr.length + "마리";

    var restTimeView = document.createElement("h3");
    restTimeView.setAttribute("id", "restTimeView");
    restTimeView.textContent = "남은 시간 : " + stageGameTimeArr[nowStage] + "초";

    var statusView = document.createElement("h3");
    statusView.setAttribute("id", "statusView");
    statusView.textContent = "게임 시작을 눌러주세요.";


    boardWrapper.appendChild(gameStartBtn);
    boardWrapper.appendChild(restClickView);
    boardWrapper.appendChild(failClickView);
    boardWrapper.appendChild(restPuppyView);
    boardWrapper.appendChild(restTimeView);
    boardWrapper.appendChild(statusView);


    scene.appendChild(boardWrapper);

}

function getElapseTime() {
    endTime = new Date();
    var timeDiff = endTime - startTime; //in ms
    // strip the ms
    timeDiff /= 1000;

    // get seconds 
    var seconds = Math.round(timeDiff);
    return seconds;
}


function updateScoreBoard() {



    let elapsedTime = stageGameTimeArr[nowStage] - getElapseTime();
    let restClickCnt = stageCheckAvailArr[nowStage] - userClickCnt;
    if (restClickCnt <= 0) {
        restClickCnt = 0;
    }
    if (restClickCnt <= 0 || elapsedTime == 0) {
        clearInterval(timerId);
        changeScene("lose");
    }

    var restClickView = document.getElementById("restClickView");
    restClickView.textContent = "남은 클릭 횟수 : " + String(restClickCnt) + "회";
    var failClickView = document.getElementById("failClickView");
    failClickView.textContent = "실패 횟수 : " + userFailClickCnt + "회";
    var restPuppyView = document.getElementById("restPuppyView");
    restPuppyView.textContent = "남은 강아지 수 : " + answerArr.length + "마리";
    var restTimeView = document.getElementById("restTimeView");
    restTimeView.textContent = "남은 시간 : " + elapsedTime + "초";

}


function checkAnswer(id, img) {


    let isAnswer = false;
    let answer_count = stageAnswerCntArr[nowStage];
    for (let i = 0; i < answerArr.length; i++) {
        if (id == answerArr[0]) {
            isAnswer = true;
            img.setAttribute("src", "media/img2.gif");
            answerArr.shift();
        }
    }

    userClickCnt++;
    if (isAnswer == false) {
        userFailClickCnt++;
    }

    if (answerArr.length == 0) {
        alert("정답을 모두 맞추었습니다!");
        nowStage++;
        changeScene("win");
    }
}


function createAnswer() {
    let answer_count = stageAnswerCntArr[nowStage];
    for (let i = 0; i < answer_count; i++) {
        var choiceValue = Math.floor(Math.random() * 24);
        let overlapCheck = false;
        for (let j = 0; j < i; j++) {
            if (choiceValue == answerArr[j]) {
                i--;
                overlapCheck = true;
                break;
            }
        }
        if (!overlapCheck) {
            answerArr.push(choiceValue);
        }
    }
}

function initScene(scene) {
    while (scene.hasChildNodes()) {
        scene.removeChild(scene.firstChild);
    }
    return scene;
}

function visibleRestAnswer(scene) {
    var childNodes = scene.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        for (var j = 0; j < answerArr.length; j++) {
            if (i == answerArr[j]) {
                childNodes[i].style = "border: thick dotted #f44336;"
                childNodes[i].setAttribute("src", "media/img2.gif")
                console.log(childNodes[i]);
                break;
            }
        }
    }
}

function gameOverScene() {

    let gameStartBtn = document.getElementById("gameStartBtn");
    gameStartBtn.style.visibility = 'visible';
    let statusView = document.getElementById("statusView");
    statusView.textContent = "실패";
    var scene = document.getElementById("egg_wrapper");
    visibleRestAnswer(scene);

    //            var gameOverWrapper = document.createElement("div");
    //            gameOverWrapper.style="position: relative; top: 80px; left: 100px;";
    //            
    //            var gameOverImg = document.createElement("IMG");
    //            gameOverImg.setAttribute("src", "media/gameover.jpg");
    //            
    //            gameOverWrapper.appendChild(gameOverImg);   

    //gameOverImg.setAttribute("id", "gameover_img");
    //scene.appendChild(gameOverWrapper);



    //            if (confirm('다시 하시겠습니까?')) {
    //                 // Yes click
    //                nowStage=0;
    //                init();
    //                waitingScene();
    //            } else {
    //                // no click
    //            }
}

function init() {
    clearInterval(timerId);

    answerArr = [];
    userClickCnt = 0;
    userFailClickCnt = 0;
    let scene = document.getElementById("scene_view");
    initScene(scene);
    scene = document.getElementById("board_view");
    initScene(scene);
    createAnswer();
    scoreBoard();


}

function changeScene(status) {
    switch (status) {
        case "win":
            if (nowStage > stageNum) {
                alert("축하합니다. 모든 스테이지를 깨셨습니다.");
                nowStage = 0;
            }
            init();
            waitingScene();
            break;
        case "lose":
            nowStage = 0;
            gameOverScene();
            break;
    }
}


// 게임시작
function waitingScene() {
    var scene = document.getElementById("scene_view");
    var egg_wrapper = document.createElement("div");
    egg_wrapper.setAttribute("id", "egg_wrapper");

    for (let i = 0; i < 24; i++) {
        let imgSrc = "media/img1.gif";
        let eggImg = document.createElement("IMG");
        eggImg.setAttribute("src", imgSrc);
        eggImg.setAttribute("id", "egg_img");
        egg_wrapper.appendChild(eggImg);
    }
    scene.appendChild(egg_wrapper);

}


// 게임 시작
function createGameScene() {
    var scene = document.getElementById("scene_view");
    var egg_wrapper = document.createElement("div");
    egg_wrapper.style = "position: relative;"

    egg_wrapper.setAttribute("id", "egg_wrapper");


    let statusView = document.getElementById("statusView");
    statusView.textContent = "숨은 그림을 보세요.";

    let tempImgArr = [];
    for (let i = 0; i < 24; i++) {
        var eggImg = document.createElement("IMG");
        eggImg.setAttribute("id", "egg_img");

        let imgSrc = "media/img1.gif";
        for (let j = 0; j < stageAnswerCntArr[nowStage]; j++) {
            if (i == answerArr[j]) {
                imgSrc = "media/egg/egg" + String(j + 1 + ".png");
                eggImg.setAttribute("src", imgSrc);

                break;
            }
        }

        tempImgArr.push(eggImg);

        eggImg.setAttribute("src", imgSrc);

        egg_wrapper.appendChild(eggImg);
    }
    scene.appendChild(egg_wrapper);




    setTimeout(function () {
        for (let i = 0; i < tempImgArr.length; i++) {
            let imgSrc = "media/img1.gif";
            //                    for (let j = 0; j < stageAnswerCntArr[nowStage]; j++){
            //                        if (i==answerArr[j]) {
            //                            imgSrc = "media/egg/egg" + String(j + 1 + ".png");
            //                            eggImg.setAttribute("src", imgSrc);    
            //                            break;
            //                        }
            //                    }
            let statusView = document.getElementById("statusView");
            statusView.textContent = "정답을 찾으세요.";
            tempImgArr[i].setAttribute("src", imgSrc);
            tempImgArr[i].onclick = function () {
                checkAnswer(i, this);
            }
        }

        startTime = new Date();
        timerId = setInterval(updateScoreBoard, 1000);

    }, stageWaitingTimeArr[nowStage]);
}