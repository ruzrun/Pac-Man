/* =========================================================
   OARADHI PAC-MAN
   WORD MAZE VERSION
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const mapScreen =
    document.getElementById("mapScreen");

const gameScreen =
    document.getElementById("gameScreen");

const mapList =
    document.getElementById("mapList");

const playButton =
    document.getElementById("playButton");

const backButton =
    document.getElementById("backButton");

const restartButton =
    document.getElementById("restartButton");

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");

const scoreDisplay =
    document.getElementById("score");

const livesDisplay =
    document.getElementById("lives");

const currentMapDisplay =
    document.getElementById("currentMap");

const gameMessage =
    document.getElementById("gameMessage");


/* =========================================================
   SETTINGS
========================================================= */

const COLS = 28;

const ROWS = 15;

const TILE = 24;


/* =========================================================
   MAPS
========================================================= */

/*
    # = wall
    . = dot
    space = empty path
    P = player spawn
    G = ghost area
*/

const MAPS = {

    OARADHI: {

        name: "OARADHI",

        description:
            "The OARADHI maze",

        accent:
            "#123cff",

        layout: [

            "############################",

            "#............##............#",

            "#.####.#####.##.#####.####.#",

            "#.#  #.#   #....#   #.#  #.#",

            "#.#  #.#   ######   #.#  #.#",

            "#.####.#####.##.#####.####.#",

            "#..........................#",

            "###.##.###.######.###.##.###",

            "#....#....#  GG  #....#....#",

            "###.##.###.######.###.##.###",

            "#..........................#",

            "#.####.#####.##.#####.####.#",

            "#.#  #.#   #....#   #.#  #.#",

            "#..........................#",

            "############################"

        ]

    },


    RADHIRA: {

        name: "RADHIRA",

        description:
            "Symmetrical and tricky",

        accent:
            "#ff38a8",

        layout: [

            "############################",

            "#..........................#",

            "#.###.###.######.###.###..#",

            "#.#...#.#........#.#...#..#",

            "#.#.###.####..####.###.#..#",

            "#.#....................#..#",

            "#.######.########.######..#",

            "#........#  GG  #..........#",

            "#.######.########.######..#",

            "#.#....................#..#",

            "#.#.###.####..####.###.#..#",

            "#.#...#.#........#.#...#..#",

            "#.###.###.######.###.###..#",

            "#..........................#",

            "############################"

        ]

    },


    RUZRUN: {

        name: "RUZRUN",

        description:
            "Fast and open",

        accent:
            "#168cff",

        layout: [

            "############################",

            "#..........................#",

            "#.######.##########.######.#",

            "#.#......................#.#",

            "#.#.####.##########.####.#.#",

            "#.#.#................#.#.#.#",

            "#.#.#.####..GG..####.#.#.#",

            "#...#................#...#.#",

            "#.#.#.####......####.#.#.#",

            "#.#.#................#.#.#.#",

            "#.#.####.##########.####.#.#",

            "#.#......................#.#",

            "#.######.##########.######.#",

            "#..........................#",

            "############################"

        ]

    },


    WARUN: {

        name: "WARUN",

        description:
            "Compact and dangerous",

        accent:
            "#28d66f",

        layout: [

            "############################",

            "#..##......##......##......#",

            "#..##.####.##.####.##.####.#",

            "#....#....#....#....#.....#",

            "####.#.##.####.##.####.####",

            "#....#.................#...#",

            "#.######.####GG####.######.#",

            "#..........................#",

            "#.######.####..####.######.#",

            "#...#.................#....#",

            "####.####.##.####.##.####.#",

            "#.....#....#....#....#....#",

            "#.####.##.####.##.####.##.#",

            "#..........................#",

            "############################"

        ]

    }

};


/* =========================================================
   STATE
========================================================= */

let selectedMap = null;

let currentMap = null;

let board = [];

let score = 0;

let lives = 3;

let gameRunning = false;

let animationFrame = null;


/* =========================================================
   PLAYER
========================================================= */

const player = {

    x: 1,

    y: 1,

    direction: "right",

    nextDirection: "right",

    speed: 7

};


/* =========================================================
   DIRECTION
========================================================= */

const DIRECTIONS = {

    up: {
        x: 0,
        y: -1
    },

    down: {
        x: 0,
        y: 1
    },

    left: {
        x: -1,
        y: 0
    },

    right: {
        x: 1,
        y: 0
    }

};


/* =========================================================
   MAP MENU
========================================================= */

function createMapMenu() {

    mapList.innerHTML = "";

    Object.values(MAPS).forEach(
        map => {

            const card =
                document.createElement("div");

            card.className =
                "map-card";

            card.dataset.map =
                map.name;


            const title =
                document.createElement("h2");

            title.textContent =
                map.name;


            const preview =
                createMapPreview(
                    map.layout
                );


            const description =
                document.createElement("p");

            description.textContent =
                map.description;


            card.appendChild(title);

            card.appendChild(preview);

            card.appendChild(description);


            card.addEventListener(
                "click",
                () => {

                    selectMap(
                        map.name
                    );

                }
            );


            mapList.appendChild(card);

        }
    );

}


/* =========================================================
   MAP PREVIEW
========================================================= */

function createMapPreview(layout) {

    const preview =
        document.createElement("div");

    preview.className =
        "map-preview";

    preview.style.gridTemplateColumns =
        `repeat(${COLS}, 1fr)`;

    preview.style.gridTemplateRows =
        `repeat(${ROWS}, 1fr)`;


    layout.forEach(row => {

        [...row].forEach(
            character => {

                const cell =
                    document.createElement("div");


                if (
                    character === "#"
                ) {

                    cell.className =
                        "preview-wall";

                }

                else {

                    cell.className =
                        "preview-path";


                    if (
                        character === "."
                    ) {

                        cell.classList.add(
                            "preview-dot"
                        );

                    }

                }


                preview.appendChild(
                    cell
                );

            }
        );

    });


    return preview;

}


/* =========================================================
   SELECT MAP
========================================================= */

function selectMap(name) {

    selectedMap =
        MAPS[name];


    document
        .querySelectorAll(".map-card")
        .forEach(card => {

            card.classList.toggle(
                "selected",
                card.dataset.map === name
            );

        });


    playButton.disabled =
        false;

}


/* =========================================================
   START GAME
========================================================= */

function startGame() {

    if (!selectedMap) {
        return;
    }


    currentMap =
        selectedMap;


    score = 0;

    lives = 3;

    gameRunning = true;


    currentMapDisplay.textContent =
        currentMap.name;


    scoreDisplay.textContent =
        score;


    updateLives();


    mapScreen.classList.add(
        "hidden"
    );

    gameScreen.classList.remove(
        "hidden"
    );


    loadMap();


    resizeCanvas();


    gameMessage.textContent =
        "Swipe or use the arrow keys ✨";


    startLoop();

}


/* =========================================================
   LOAD MAP
========================================================= */

function loadMap() {

    board =
        currentMap.layout.map(
            row => [...row]
        );


    findPlayerSpawn();


    player.direction =
        "right";

    player.nextDirection =
        "right";

}


/* =========================================================
   PLAYER SPAWN
========================================================= */

function findPlayerSpawn() {

    /*
        We intentionally place the player
        at the first safe corridor.
    */

    for (
        let y = 0;
        y < ROWS;
        y++
    ) {

        for (
            let x = 0;
            x < COLS;
            x++
        ) {

            if (
                board[y][x] === "."
            ) {

                player.x =
                    x;

                player.y =
                    y;

                board[y][x] =
                    " ";

                return;

            }

        }

    }

}


/* =========================================================
   CANVAS
========================================================= */

function resizeCanvas() {

    const width =
        canvas.clientWidth;

    const height =
        width *
        ROWS /
        COLS;


    const ratio =
        window.devicePixelRatio || 1;


    canvas.width =
        width * ratio;

    canvas.height =
        height * ratio;


    canvas.style.height =
        `${height}px`;


    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );


    draw();

}


/* =========================================================
   DRAW
========================================================= */

function draw() {

    if (!currentMap) {
        return;
    }


    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;


    const tileWidth =
        width / COLS;

    const tileHeight =
        height / ROWS;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    ctx.fillStyle =
        "#000";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* =========================================
       WALLS + DOTS
    ========================================= */

    for (
        let y = 0;
        y < ROWS;
        y++
    ) {

        for (
            let x = 0;
            x < COLS;
            x++
        ) {

            const tile =
                board[y][x];


            if (
                tile === "#"
            ) {

                drawWall(
                    x,
                    y,
                    tileWidth,
                    tileHeight
                );

            }


            else if (
                tile === "."
            ) {

                drawDot(
                    x,
                    y,
                    tileWidth,
                    tileHeight
                );

            }

        }

    }


    /* =========================================
       PLAYER
    ========================================= */

    drawPlayer(
        tileWidth,
        tileHeight
    );

}


/* =========================================================
   WALL
========================================================= */

function drawWall(
    x,
    y,
    width,
    height
) {

    const px =
        x * width;

    const py =
        y * height;


    ctx.strokeStyle =
        currentMap.accent;

    ctx.lineWidth =
        Math.max(
            2,
            width * 0.12
        );


    ctx.strokeRect(
        px + width * 0.16,
        py + height * 0.16,
        width * 0.68,
        height * 0.68
    );

}


/* =========================================================
   DOT
========================================================= */

function drawDot(
    x,
    y,
    width,
    height
) {

    ctx.fillStyle =
        "#fff";


    ctx.beginPath();


    ctx.arc(
        x * width + width / 2,
        y * height + height / 2,
        Math.max(
            1.5,
            width * 0.07
        ),
        0,
        Math.PI * 2
    );


    ctx.fill();

}


/* =========================================================
   PLAYER
========================================================= */

function drawPlayer(
    width,
    height
) {

    const px =
        player.x * width +
        width / 2;

    const py =
        player.y * height +
        height / 2;


    const radius =
        Math.min(
            width,
            height
        ) * 0.36;


    let rotation = 0;


    if (
        player.direction === "right"
    ) {

        rotation = 0;

    }

    else if (
        player.direction === "down"
    ) {

        rotation =
            Math.PI / 2;

    }

    else if (
        player.direction === "left"
    ) {

        rotation =
            Math.PI;

    }

    else if (
        player.direction === "up"
    ) {

        rotation =
            -Math.PI / 2;

    }


    ctx.save();


    ctx.translate(
        px,
        py
    );


    ctx.rotate(
        rotation
    );


    ctx.fillStyle =
        "#ffd91a";


    ctx.beginPath();


    ctx.moveTo(
        0,
        0
    );


    ctx.arc(
        0,
        0,
        radius,
        0.35,
        Math.PI * 2 - 0.35
    );


    ctx.closePath();


    ctx.fill();


    ctx.restore();

}


/* =========================================================
   MOVEMENT
========================================================= */

function movePlayer() {

    if (!gameRunning) {
        return;
    }


    const next =
        DIRECTIONS[
            player.nextDirection
        ];


    if (
        canMove(
            player.x + next.x,
            player.y + next.y
        )
    ) {

        player.direction =
            player.nextDirection;

    }


    const direction =
        DIRECTIONS[
            player.direction
        ];


    const newX =
        player.x +
        direction.x;

    const newY =
        player.y +
        direction.y;


    if (
        canMove(
            newX,
            newY
        )
    ) {

        player.x =
            newX;

        player.y =
            newY;


        collectDot();

    }

}


/* =========================================================
   CAN MOVE
========================================================= */

function canMove(
    x,
    y
) {

    if (
        x < 0 ||
        x >= COLS ||
        y < 0 ||
        y >= ROWS
    ) {

        return false;

    }


    return board[y][x] !== "#";

}


/* =========================================================
   COLLECT DOT
========================================================= */

function collectDot() {

    if (
        board[player.y][player.x] === "."
    ) {

        board[player.y][player.x] =
            " ";


        score += 10;


        scoreDisplay.textContent =
            score;


        checkDots();

    }

}


/* =========================================================
   CHECK DOTS
========================================================= */

function checkDots() {

    for (
        let y = 0;
        y < ROWS;
        y++
    ) {

        for (
            let x = 0;
            x < COLS;
            x++
        ) {

            if (
                board[y][x] === "."
            ) {

                return;

            }

        }

    }


    gameMessage.textContent =
        "MAP CLEARED! ✨";


    gameRunning =
        false;

}


/* =========================================================
   GAME LOOP
========================================================= */

let lastMove =
    0;


function startLoop() {

    cancelAnimationFrame(
        animationFrame
    );


    lastMove =
        performance.now();


    function loop(time) {

        if (!gameRunning) {

            draw();

            return;

        }


        if (
            time - lastMove >
            130
        ) {

            movePlayer();

            lastMove =
                time;

        }


        draw();


        animationFrame =
            requestAnimationFrame(
                loop
            );

    }


    animationFrame =
        requestAnimationFrame(
            loop
        );

}


/* =========================================================
   DIRECTION INPUT
========================================================= */

function setDirection(
    direction
) {

    if (!gameRunning) {
        return;
    }


    player.nextDirection =
        direction;

}


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        if (
            key === "arrowup" ||
            key === "w"
        ) {

            event.preventDefault();

            setDirection("up");

        }


        else if (
            key === "arrowdown" ||
            key === "s"
        ) {

            event.preventDefault();

            setDirection("down");

        }


        else if (
            key === "arrowleft" ||
            key === "a"
        ) {

            event.preventDefault();

            setDirection("left");

        }


        else if (
            key === "arrowright" ||
            key === "d"
        ) {

            event.preventDefault();

            setDirection("right");

        }

    }
);


/* =========================================================
   MOBILE SWIPE
========================================================= */

let touchStartX = 0;

let touchStartY = 0;

let touchStartTime = 0;


canvas.addEventListener(
    "touchstart",
    event => {

        const touch =
            event.changedTouches[0];


        touchStartX =
            touch.clientX;

        touchStartY =
            touch.clientY;

        touchStartTime =
            Date.now();

    },
    {
        passive: false
    }
);


canvas.addEventListener(
    "touchmove",
    event => {

        event.preventDefault();

    },
    {
        passive: false
    }
);


canvas.addEventListener(
    "touchend",
    event => {

        const touch =
            event.changedTouches[0];


        const deltaX =
            touch.clientX -
            touchStartX;


        const deltaY =
            touch.clientY -
            touchStartY;


        const distance =
            Math.max(
                Math.abs(deltaX),
                Math.abs(deltaY)
            );


        const duration =
            Date.now() -
            touchStartTime;


        if (
            distance < 20 ||
            duration > 1000
        ) {

            return;

        }


        if (
            Math.abs(deltaX) >
            Math.abs(deltaY)
        ) {

            if (
                deltaX > 0
            ) {

                setDirection(
                    "right"
                );

            }

            else {

                setDirection(
                    "left"
                );

            }

        }

        else {

            if (
                deltaY > 0
            ) {

                setDirection(
                    "down"
                );

            }

            else {

                setDirection(
                    "up"
                );

            }

        }

    },
    {
        passive: false
    }
);


/* =========================================================
   LIVES
========================================================= */

function updateLives() {

    livesDisplay.textContent =
        "❤️".repeat(lives);

}


/* =========================================================
   BACK
========================================================= */

backButton.addEventListener(
    "click",
    () => {

        gameRunning =
            false;


        cancelAnimationFrame(
            animationFrame
        );


        gameScreen.classList.add(
            "hidden"
        );


        mapScreen.classList.remove(
            "hidden"
        );

    }
);


/* =========================================================
   RESTART
========================================================= */

restartButton.addEventListener(
    "click",
    () => {

        score = 0;

        lives = 3;

        scoreDisplay.textContent =
            score;

        updateLives();

        loadMap();

        gameRunning =
            true;

        gameMessage.textContent =
            "Swipe or use the arrow keys ✨";

        startLoop();

    }
);


/* =========================================================
   PLAY
========================================================= */

playButton.addEventListener(
    "click",
    startGame
);


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            currentMap &&
            !gameScreen.classList.contains(
                "hidden"
            )
        ) {

            resizeCanvas();

        }

    }
);


/* =========================================================
   INITIALISE
========================================================= */

createMapMenu();
