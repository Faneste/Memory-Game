let allObjects = [];
let movesCount = 0;
// timer
let sec = 0;
let min = 0;
let hour = 0;
let timerStart;
let intervalIsRunning = false;

function initiateArr() {
  allObjects = [
    { sign: "x", visible: false, guessed: false, id: 0, imgSrc: "images/x.png"},
    { sign: "x", visible: false, guessed: false, id: 1, imgSrc: "images/x.png"},
    { sign: "y", visible: false, guessed: false, id: 2, imgSrc: "images/y.png"},
    { sign: "y", visible: false, guessed: false, id: 3, imgSrc: "images/y.png"},
    { sign: "z", visible: false, guessed: false, id: 4, imgSrc: "images/z.png"},
    { sign: "z", visible: false, guessed: false, id: 5, imgSrc: "images/z.png"},
    { sign: "w", visible: false, guessed: false, id: 6, imgSrc: "images/w.png"},
    { sign: "w", visible: false, guessed: false, id: 7, imgSrc: "images/w.png"},
    { sign: "q", visible: false, guessed: false, id: 8, imgSrc: "images/q.png"},
    { sign: "q", visible: false, guessed: false, id: 9, imgSrc: "images/q.png"},
    { sign: "r", visible: false, guessed: false, id: 10, imgSrc: "images/r.png"},
    { sign: "r", visible: false, guessed: false, id: 11, imgSrc: "images/r.png"}
  ];
}

function select6() {
  initiateArr();
  allObjects = allObjects.slice(0, 6);
  startGame();
}

function select12() {
  initiateArr();
  allObjects = allObjects.slice(0, 12);
  startGame();
}

function startGame() {
  // if timer is running then prompt
  if (intervalIsRunning) {
    if (confirm("Quit this game and start a new one?")) {} else {return;}
  };
  // reset moves count
  movesCount = 0;
  document.getElementById("movesCount").innerHTML = movesCount;
  // reset and start timer
  resetTimer();
  timer();
  // randomize array
  allObjects.sort(function() {
    return .5 - Math.random();
  });
  buildButtons();
}

function buildButtons() {

  // deletes old html and builds a new updated one
  let nodeDelete = document.getElementsByClassName("button");
  // backwards loop bcs index of html element is changing with html coll.
  for (var i = nodeDelete.length - 1; i >= 0; i--) {
    // Remove first element (at [0]) repeatedly
    nodeDelete[0].remove();
  }
  // deletes old html and builds a new updated one
  let nodeDeleteHidden = document.getElementsByClassName("buttonHidden");
  // backwards loop bcs index of html element is changing with html coll.
  for (var i = nodeDeleteHidden.length - 1; i >= 0; i--) {
    // Remove first element (at [0]) repeatedly
    nodeDeleteHidden[0].remove();
  }

  allObjects.forEach((item, i) => {

    let mainContainer = document.getElementById("buttonsContainer");
    // if buttons is not guessed/still active then build it again
    if (!item.guessed) {

      let button = document.createElement("div");
      button.classList.add("button");
      button.setAttribute('data-id', item.id);
      button.onclick = function() {
        buttonClicked(button);
      };

      let sign = document.createElement("img");
      sign.classList.add(item.visible);
      sign.src = item.imgSrc;

      button.appendChild(sign);
      mainContainer.appendChild(button);
    }
    // if buttons are guessed/not active then build it again to take place in html
    if (item.guessed) {
      let buttonHidden = document.createElement("div");
      buttonHidden.classList.add("buttonHidden");
      mainContainer.appendChild(buttonHidden);
    }
  });
}

function buttonClicked(button) {
  const click = new Audio('sound/click.wav');
  click.volume = 0.5;
  click.play();

  movesCount++;
  document.getElementById("movesCount").innerHTML = `<span id="movesCountSpan">${movesCount}</span>`;
  // putting guessed into selected arr to compare and toggle
  let selected = [];
  allObjects.forEach((item, i) => {
    if (parseInt(button.getAttribute("data-id")) === item.id) {
      item.visible = !item.visible;
    };
    if (item.visible) {
      selected.push(item);
    };
  });
  buildButtons();

  // animate by adding class
  if (selected[1].sign) {
    if (selected[0].sign === selected[1].sign) {
      let imgAnimate = document.getElementsByClassName("true");
      const win = new Audio('sound/win.wav');
      win.volume = 0.5;
      win.play();
      // backwards loop bcs index of html element is changing with html coll.
      for (var i = 0; i < imgAnimate.length; i++) {
        imgAnimate[i].classList.add( "animated", "zoomOut");
      }
    }
  }

  if (selected[1].sign) {
    // put invis. div for 0.5sec so that only two can be selected
    document.getElementById("invisibleOverlayDiv").style.display = "block";
    setTimeout(function() {
      document.getElementById("invisibleOverlayDiv").style.display = "none";
    }, 500);
  }

  // timeout to compare selected arr then toggling guessed
  setTimeout(function() {
    if (selected[1].sign) {
      if (selected[0].sign === selected[1].sign) {
        // animation
        let imgAnimate = document.getElementsByClassName("true");
        // backwards loop bcs index of html element is changing with html coll.
        for (var i = 0; i < imgAnimate.length; i++) {
          imgAnimate[i].classList.add( "animated", "rubberBand");
        }
        allObjects.forEach((item, i) => {
          if (item.visible) { item.guessed = true; }
          item.visible = false;
        });
      } else {
        allObjects.forEach((item, i) => { item.visible = false; });
      }
    }
    // if all items.guessed are true then game over
    if (allObjects.every(x => x.guessed === true)) {
      document.getElementById("gameOverContainer").innerHTML =
      `Your last time was: ${hour < 10 ? '0' + hour : hour}:${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
      resetTimer();
    }
    buildButtons();
  }, 500);
}

////////////// timer
function updateTime() {
  document.getElementById("timerInfo").innerHTML =
  `Time: ${hour < 10 ? '0' + hour : hour}:${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
}

function timer() {
  intervalIsRunning = true;
  timerStart = setInterval(function(){ secFunc(); updateTime(); }, 1000);
}

function secFunc() {
  sec++;
  if (sec > 59) {
    sec = 0;
    minFunc();
  }
}

function minFunc() {
  min++;
  if (min > 59) {
    min = 0;
    hourFunc();
  };
}

function hourFunc() { hour++; }

function resetTimer() {
  intervalIsRunning = false;
  clearInterval(timerStart);
  sec = 0;
  min = 0;
  hour = 0;
  updateTime();
}

//
