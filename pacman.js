/* =========================================================
   OARADHI PAC-MAN
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");

const game =
    document.getElementById("game");

const mapScreen =
    document.getElementById("mapScreen");

const playButton =
    document.getElementById("playButton");

const restartButton =
    document.getElementById("restartButton");

const mapButton =
    document.getElementById("mapButton");

const scoreDisplay =
    document.getElementById("score");

const livesDisplay =
    document.getElementById("lives");

const currentMapDisplay =
    document.getElementById("currentMap");


/* =========================================================
   SETTINGS
========================================================= */

const COLS = 31;

const ROWS = 17;

const TILE =
    canvas.width / COLS;


/* =========================================================
   COLOURS
========================================================= */

const BLUE = "#064cff";

const BRIGHT_BLUE = "#174fff";

const YELLOW = "#ffe600";

const PELLET = "#ffe9a8";


/* =========================================================
   MAP DATA
========================================================= */

const MAP_NAMES = [

    "OARADHI",
    "RADHIRA",
    "RUZRUN",
    "WARUN"

];


/* =========================================================
   LETTER DESIGNS
========================================================= */

const LETTERS = {

    O: [
        "111",
        "101",
        "101",
        "101",
        "111"
    ],

    A: [
        "010",
        "101",
        "111",
        "101",
        "101"
    ],

    R: [
        "110",
        "101",
        "110",
        "101",
        "101"
    ],

    D: [
        "110",
        "101",
        "101",
        "101",
        "110"
    ],

    H: [
        "101",
        "101",
        "111",
        "101",
        "101"
    ],

    I: [
        "111",
        "010",
        "010",
        "010",
        "111"
    ],

    U: [
        "101",
        "101",
        "101",
        "101",
        "111"
    ],

    N: [
        "101",
        "111",
        "111",
        "111",
        "101"
    ],

    Z: [
        "111",
        "001",
        "010",
        "100",
        "111"
    ],

    W: [
        "101",
        "101",
        "101",
        "111",
        "101"
    ]

};


/* =========================================================
   GAME STATE
========================================================= */

let selectedMap = "OARADHI";

let maze = [];

let pellets = new Set();

let powerPellets = new Set();

let score = 0;

let lives = 3;

let gameRunning = false;

let level = 1;

let frightenedTimer = 0;

let lastTime = 0;

let pelletCount = 0;


/* =========================================================
   PACMAN
========================================================= */

const pacman = {

    x: 15.5,

    y: 15.5,

    direction: "left",

    nextDirection: "left",

    speed: 7,

    mouth: 0,

    mouthDirection: 1

};


/* =========================================================
   GHOSTS
========================================================= */

let ghosts = [];


const ghostColours = [

    "#ff3030",
    "#ff8bd8",
    "#20e6ff",
    "#ffad20"

];


/* =========================================================
   DIRECTIONS
========================================================= */

const DIRECTIONS = {

    left: {
        x: -1,
        y: 0
    },

    right: {
        x: 1,
        y: 0
    },

    up: {
        x: 0,
        y: -1
    },

    down: {
        x: 0,
        y: 1
    }

};


function opposite(direction) {

    if (direction === "left")
        return "right";

    if (direction === "right")
        return "left";

    if (direction === "up")
        return "down";

    return "up";

}


/* =========================================================
   CREATE MAP
========================================================= */

function createMap(word) {

    maze =
        Array.from(
            {
                length: ROWS
            },
            () =>
                Array(COLS).fill(" ")
        );


    /* -----------------------------------------------------
       OUTER BORDER
    ----------------------------------------------------- */

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
                x === 0 ||
                x === COLS - 1 ||
                y === 0 ||
                y === ROWS - 1
            ) {

                maze[y][x] = "#";

            }

        }

    }


    /* -----------------------------------------------------
       TUNNEL
    ----------------------------------------------------- */

    maze[8][0] = "T";

    maze[8][1] = " ";

    maze[8][COLS - 2] = " ";

    maze[8][COLS - 1] = "T";


    /* -----------------------------------------------------
       HORIZONTAL MAZE WALLS
    ----------------------------------------------------- */

    addHorizontalWall(
        2,
        2,
        8
    );

    addHorizontalWall(
        2,
        12,
        18
    );

    addHorizontalWall(
        2,
        22,
        28
    );


    addHorizontalWall(
        10,
        2,
        8
    );

    addHorizontalWall(
        10,
        22,
        28
    );


    addHorizontalWall(
        14,
        2,
        8
    );

    addHorizontalWall(
        14,
        11,
        20
    );

    addHorizontalWall(
        14,
        23,
        28
    );


    /* -----------------------------------------------------
       VERTICAL MAZE WALLS
    ----------------------------------------------------- */

    addVerticalWall(
        4,
        3,
        5
    );

    addVerticalWall(
        9,
        1,
        3
    );

    addVerticalWall(
        21,
        1,
        3
    );

    addVerticalWall(
        26,
        3,
        5
    );


    addVerticalWall(
        4,
        10,
        13
    );

    addVerticalWall(
        9,
        12,
        14
    );

    addVerticalWall(
        21,
        12,
        14
    );

    addVerticalWall(
        26,
        10,
        13
    );


    /* -----------------------------------------------------
       GIANT WORD
    ----------------------------------------------------- */

    drawWordWalls(word);


    /* -----------------------------------------------------
       GHOST HOUSE
    ----------------------------------------------------- */

    createGhostHouse();


    /* -----------------------------------------------------
       OPEN PACMAN AREA
    ----------------------------------------------------- */

    maze[15][14] = " ";

    maze[15][15] = " ";

    maze[15][16] = " ";

    maze[14][15] = " ";

    maze[13][15] = " ";


    /* -----------------------------------------------------
       MAKE SURE TUNNEL IS OPEN
    ----------------------------------------------------- */

    maze[8][0] = "T";

    maze[8][1] = " ";

    maze[8][COLS - 2] = " ";

    maze[8][COLS - 1] = "T";


    /* -----------------------------------------------------
       PELLETS
    ----------------------------------------------------- */

    pellets.clear();

    powerPellets.clear();


    for (
        let y = 1;
        y < ROWS - 1;
        y++
    ) {

        for (
            let x = 1;
            x < COLS - 1;
            x++
        ) {

            if (
                maze[y][x] !== "#"
            ) {

                if (
                    !isInsideGhostHouse(
                        x,
                        y
                    )
                ) {

                    if (
                        !(
                            x === 15 &&
                            y === 15
                        )
                    ) {

                        pellets.add(
                            `${x},${y}`
                        );

                    }

                }

            }

        }

    }


    /* -----------------------------------------------------
       POWER PELLETS
    ----------------------------------------------------- */

    const powerPositions = [

        [1, 1],

        [29, 1],

        [1, 15],

        [29, 15]

    ];


    powerPositions.forEach(
        ([x, y]) => {

            if (
                maze[y][x] !== "#"
            ) {

                powerPellets.add(
                    `${x},${y}`
                );

                pellets.delete(
                    `${x},${y}`
                );

            }

        }
    );


    pelletCount =
        pellets.size +
        powerPellets.size;

}


/* =========================================================
   HORIZONTAL WALL
========================================================= */

function addHorizontalWall(
    y,
    start,
    end
) {

    for (
        let x = start;
        x <= end;
        x++
    ) {

        maze[y][x] = "#";

    }

}


/* =========================================================
   VERTICAL WALL
========================================================= */

function addVerticalWall(
    x,
    start,
    end
) {

    for (
        let y = start;
        y <= end;
        y++
    ) {

        maze[y][x] = "#";

    }

}


/* =========================================================
   DRAW WORD WALLS
========================================================= */

function drawWordWalls(word) {

    let width =
        word.length * 3 +
        (word.length - 1);


    let startX =
        Math.floor(
            (COLS - width) / 2
        );


    let xPosition = startX;


    for (
        const letter of word
    ) {

        const design =
            LETTERS[letter];


        for (
            let row = 0;
            row < 5;
            row++
        ) {

            for (
                let col = 0;
                col < 3;
                col++
            ) {

                if (
                    design[row][col] === "1"
                ) {

                    const x =
                        xPosition + col;

                    const y =
                        4 + row;


                    if (
                        x > 0 &&
                        x < COLS - 1 &&
                        y > 0 &&
                        y < ROWS - 1
                    ) {

                        maze[y][x] = "#";

                    }

                }

            }

        }


        xPosition += 4;

    }

}


/* =========================================================
   GHOST HOUSE
========================================================= */

function createGhostHouse() {

    /* Top */

    for (
        let x = 12;
        x <= 18;
        x++
    ) {

        maze[10][x] = "#";

    }


    /* Bottom */

    for (
        let x = 12;
        x <= 18;
        x++
    ) {

        maze[13][x] = "#";

    }


    /* Left */

    maze[11][12] = "#";

    maze[12][12] = "#";


    /* Right */

    maze[11][18] = "#";

    maze[12][18] = "#";


    /* Interior */

    for (
        let y = 11;
        y <= 12;
        y++
    ) {

        for (
            let x = 13;
            x <= 17;
            x++
        ) {

            maze[y][x] = " ";

        }

    }


    /* Door */

    maze[10][15] = " ";

}


/* =========================================================
   GHOST HOUSE CHECK
========================================================= */

function isInsideGhostHouse(
    x,
    y
) {

    return (
        x >= 13 &&
        x <= 17 &&
        y >= 11 &&
        y <= 12
    );

}


/* =========================================================
   START GAME
========================================================= */

function startGame() {

    score = 0;

    lives = 3;

    level = 1;

    frightenedTimer = 0;

    gameRunning = true;


    currentMapDisplay.textContent =
        selectedMap;


    createMap(
        selectedMap
    );


    resetCharacters();


    updateHUD();


    mapScreen.style.display =
        "none";

    game.style.display =
        "flex";


    lastTime =
        performance.now();


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================================
   RESET CHARACTERS
========================================================= */

function resetCharacters() {

    pacman.x = 15.5;

    pacman.y = 15.5;

    pacman.direction = "left";

    pacman.nextDirection = "left";


    ghosts = [

        createGhost(
            15,
            11,
            "left",
            0
        ),

        createGhost(
            14,
            11,
            "right",
            1
        ),

        createGhost(
            16,
            11,
            "left",
            2
        ),

        createGhost(
            15,
            12,
            "up",
            3
        )

    ];

}


/* =========================================================
   CREATE GHOST
========================================================= */

function createGhost(
    x,
    y,
    direction,
    index
) {

    return {

        x: x + 0.5,

        y: y + 0.5,

        direction,

        speed: 5.2,

        colour:
            ghostColours[index],

        home: true,

        index

    };

}


/* =========================================================
   GAME LOOP
========================================================= */

function gameLoop(time) {

    if (!gameRunning) {

        draw();

        return;

    }


    const delta =
        Math.min(
            (time - lastTime) / 1000,
            0.05
        );


    lastTime = time;


    frightenedTimer -=
        delta;


    updatePacman(delta);

    updateGhosts(delta);

    checkPellets();

    checkGhostCollision();

    updateMouth(delta);

    draw();


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================================
   PACMAN UPDATE
========================================================= */

function updatePacman(delta) {

    const next =
        DIRECTIONS[
            pacman.nextDirection
        ];


    if (
        canMove(
            pacman.x,
            pacman.y,
            pacman.nextDirection
        )
    ) {

        pacman.direction =
            pacman.nextDirection;

    }


    const direction =
        DIRECTIONS[
            pacman.direction
        ];


    if (
        canMove(
            pacman.x,
            pacman.y,
            pacman.direction
        )
    ) {

        pacman.x +=
            direction.x *
            pacman.speed *
            delta;

        pacman.y +=
            direction.y *
            pacman.speed *
            delta;

    }


    handleTunnel(
        pacman
    );


    snapAtIntersection(
        pacman
    );

}


/* =========================================================
   CAN MOVE
========================================================= */

function canMove(
    x,
    y,
    direction
) {

    const dir =
        DIRECTIONS[direction];


    const nx =
        x +
        dir.x *
        0.55;

    const ny =
        y +
        dir.y *
        0.55;


    const tileX =
        Math.floor(nx);

    const tileY =
        Math.floor(ny);


    if (
        tileX < 0 ||
        tileX >= COLS ||
        tileY < 0 ||
        tileY >= ROWS
    ) {

        return true;

    }


    return (
        maze[tileY][tileX] !== "#"
    );

}


/* =========================================================
   TUNNEL
========================================================= */

function handleTunnel(
    character
) {

    if (
        character.x < -0.5
    ) {

        character.x =
            COLS - 0.5;

    }


    if (
        character.x >
        COLS - 0.5
    ) {

        character.x =
            -0.5;

    }

}


/* =========================================================
   SNAP
========================================================= */

function snapAtIntersection(
    character
) {

    if (
        Math.abs(
            character.x -
            Math.round(character.x)
        ) < 0.08
    ) {

        character.x =
            Math.round(character.x);

    }


    if (
        Math.abs(
            character.y -
            Math.round(character.y)
        ) < 0.08
    ) {

        character.y =
            Math.round(character.y);

    }

}


/* =========================================================
   GHOST UPDATE
========================================================= */

function updateGhosts(delta) {

    ghosts.forEach(
        ghost => {

            if (
                ghost.home
            ) {

                ghost.y -=
                    delta * 0.8;

                if (
                    ghost.y <= 10.5
                ) {

                    ghost.home =
                        false;

                    ghost.y =
                        9.5;

                }

                return;

            }


            const possible =
                getPossibleDirections(
                    ghost
                );


            if (
                possible.length === 0
            ) {

                return;

            }


            const current =
                ghost.direction;


            const reverse =
                opposite(
                    current
                );


            let choices =
                possible.filter(
                    direction =>
                        direction !==
                        reverse
                );


            if (
                choices.length === 0
            ) {

                choices =
                    possible;

            }


            /* Change direction near intersections */

            if (
                isNearCenter(
                    ghost
                )
            ) {

                if (
                    Math.random() <
                    0.18
                ) {

                    ghost.direction =
                        chooseGhostDirection(
                            ghost,
                            choices
                        );

                }

            }


            const dir =
                DIRECTIONS[
                    ghost.direction
                ];


            if (
                canMove(
                    ghost.x,
                    ghost.y,
                    ghost.direction
                )
            ) {

                ghost.x +=
                    dir.x *
                    ghost.speed *
                    delta;

                ghost.y +=
                    dir.y *
                    ghost.speed *
                    delta;

            }


            handleTunnel(
                ghost
            );


            snapAtIntersection(
                ghost
            );

        }
    );

}


/* =========================================================
   POSSIBLE GHOST DIRECTIONS
========================================================= */

function getPossibleDirections(
    ghost
) {

    const result = [];

    Object.keys(
        DIRECTIONS
    ).forEach(
        direction => {

            if (
                canMove(
                    ghost.x,
                    ghost.y,
                    direction
                )
            ) {

                result.push(
                    direction
                );

            }

        }
    );


    return result;

}


/* =========================================================
   GHOST AI
========================================================= */

function chooseGhostDirection(
    ghost,
    choices
) {

    if (
        frightenedTimer > 0
    ) {

        return choices[
            Math.floor(
                Math.random() *
                choices.length
            )
        ];

    }


    let best =
        choices[0];

    let bestDistance =
        Infinity;


    choices.forEach(
        direction => {

            const dir =
                DIRECTIONS[
                    direction
                ];


            const tx =
                ghost.x +
                dir.x * 3;


            const ty =
                ghost.y +
                dir.y * 3;


            const distance =
                Math.hypot(
                    pacman.x - tx,
                    pacman.y - ty
                );


            if (
                distance <
                bestDistance
            ) {

                bestDistance =
                    distance;

                best =
                    direction;

            }

        }
    );


    return best;

}


/* =========================================================
   INTERSECTION CHECK
========================================================= */

function isNearCenter(
    character
) {

    return (

        Math.abs(
            character.x -
            Math.round(character.x)
        ) < 0.1 &&

        Math.abs(
            character.y -
            Math.round(character.y)
        ) < 0.1

    );

}


/* =========================================================
   PELLETS
========================================================= */

function checkPellets() {

    const x =
        Math.floor(
            pacman.x
        );

    const y =
        Math.floor(
            pacman.y
        );


    const key =
        `${x},${y}`;


    if (
        pellets.has(key)
    ) {

        pellets.delete(key);

        score += 10;

        updateHUD();

    }


    if (
        powerPellets.has(key)
    ) {

        powerPellets.delete(key);

        score += 50;

        frightenedTimer = 8;

        updateHUD();

    }


    if (
        pellets.size === 0 &&
        powerPellets.size === 0
    ) {

        nextLevel();

    }

}


/* =========================================================
   NEXT LEVEL
========================================================= */

function nextLevel() {

    level++;

    createMap(
        selectedMap
    );

    resetCharacters();

}


/* =========================================================
   GHOST COLLISION
========================================================= */

function checkGhostCollision() {

    ghosts.forEach(
        ghost => {

            const distance =
                Math.hypot(
                    pacman.x -
                    ghost.x,

                    pacman.y -
                    ghost.y
                );


            if (
                distance < 0.65
            ) {

                if (
                    frightenedTimer > 0
                ) {

                    score += 200;

                    ghost.x =
                        15.5;

                    ghost.y =
                        11.5;

                    ghost.home =
                        true;

                    updateHUD();

                }

                else {

                    loseLife();

                }

            }

        }
    );

}


/* =========================================================
   LOSE LIFE
========================================================= */

function loseLife() {

    lives--;

    updateHUD();


    if (
        lives <= 0
    ) {

        gameOver();

        return;

    }


    resetCharacters();

}


/* =========================================================
   GAME OVER
========================================================= */

function gameOver() {

    gameRunning = false;

    draw();

    setTimeout(
        () => {

            alert(
                `GAME OVER!\n\nScore: ${score}`
            );

        },
        100
    );

}


/* =========================================================
   MOUTH
========================================================= */

function updateMouth(delta) {

    pacman.mouth +=
        pacman.mouthDirection *
        delta *
        10;


    if (
        pacman.mouth > 1
    ) {

        pacman.mouth = 1;

        pacman.mouthDirection =
            -1;

    }


    if (
        pacman.mouth < 0
    ) {

        pacman.mouth = 0;

        pacman.mouthDirection =
            1;

    }

}


/* =========================================================
   DRAW EVERYTHING
========================================================= */

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawMaze();

    drawPellets();

    drawGhosts();

    drawPacman();

}


/* =========================================================
   DRAW MAZE
========================================================= */

function drawMaze() {

    ctx.lineWidth = 2;

    ctx.strokeStyle =
        BLUE;


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
                maze[y][x] === "#"
            ) {

                drawWall(
                    x,
                    y
                );

            }

        }

    }


    /* Tunnel openings */

    ctx.fillStyle =
        "#000";

    ctx.fillRect(
        0,
        8 * TILE,
        TILE,
        TILE
    );

    ctx.fillRect(
        (COLS - 1) * TILE,
        8 * TILE,
        TILE,
        TILE
    );


    /* Ghost door */

    ctx.strokeStyle =
        "#ff8bd8";

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(
        15 * TILE,
        10 * TILE
    );

    ctx.lineTo(
        16 * TILE,
        10 * TILE
    );

    ctx.stroke();

}


/* =========================================================
   WALL DRAWING
========================================================= */

function drawWall(
    x,
    y
) {

    const px =
        x * TILE;

    const py =
        y * TILE;


    ctx.strokeStyle =
        BRIGHT_BLUE;

    ctx.lineWidth = 2;


    ctx.beginPath();

    ctx.roundRect(
        px + 2,
        py + 2,
        TILE - 4,
        TILE - 4,
        5
    );

    ctx.stroke();


    ctx.strokeStyle =
        "rgba(0,80,255,0.25)";

    ctx.lineWidth = 5;

    ctx.stroke();

}


/* =========================================================
   DRAW PELLETS
========================================================= */

function drawPellets() {

    ctx.fillStyle =
        PELLET;


    pellets.forEach(
        key => {

            const [
                x,
                y
            ] =
                key
                .split(",")
                .map(Number);


            ctx.beginPath();

            ctx.arc(
                x * TILE +
                TILE / 2,

                y * TILE +
                TILE / 2,

                2,

                0,
                Math.PI * 2
            );

            ctx.fill();

        }
    );


    powerPellets.forEach(
        key => {

            const [
                x,
                y
            ] =
                key
                .split(",")
                .map(Number);


            const pulse =
                5 +
                Math.sin(
                    performance.now() /
                    150
                ) *
                1.5;


            ctx.fillStyle =
                "#fff1a8";


            ctx.beginPath();

            ctx.arc(
                x * TILE +
                TILE / 2,

                y * TILE +
                TILE / 2,

                pulse,

                0,
                Math.PI * 2
            );

            ctx.fill();

        }
    );

}


/* =========================================================
   DRAW PACMAN
========================================================= */

function drawPacman() {

    const px =
        pacman.x * TILE;

    const py =
        pacman.y * TILE;


    const radius =
        TILE * 0.42;


    let angle = 0;


    if (
        pacman.direction === "right"
    )
        angle = 0;

    if (
        pacman.direction === "down"
    )
        angle = Math.PI / 2;

    if (
        pacman.direction === "left"
    )
        angle = Math.PI;

    if (
        pacman.direction === "up"
    )
        angle = -Math.PI / 2;


    const mouth =
        0.25 +
        pacman.mouth *
        0.25;


    ctx.fillStyle =
        YELLOW;


    ctx.beginPath();

    ctx.moveTo(
        px,
        py
    );


    ctx.arc(
        px,
        py,
        radius,
        angle + mouth,
        angle +
        Math.PI * 2 -
        mouth
    );


    ctx.closePath();

    ctx.fill();

}


/* =========================================================
   DRAW GHOSTS
========================================================= */

function drawGhosts() {

    ghosts.forEach(
        ghost => {

            const px =
                ghost.x * TILE;

            const py =
                ghost.y * TILE;

            const radius =
                TILE * 0.4;


            let colour =
                ghost.colour;


            if (
                frightenedTimer > 0
            ) {

                colour =
                    Math.floor(
                        frightenedTimer * 8
                    ) % 2 === 0
                        ? "#174fff"
                        : "#fff";

            }


            ctx.fillStyle =
                colour;


            ctx.beginPath();

            ctx.arc(
                px,
                py - 1,
                radius,
                Math.PI,
                0
            );


            ctx.lineTo(
                px + radius,
                py + radius
            );


            ctx.lineTo(
                px + radius * 0.5,
                py + radius * 0.7
            );


            ctx.lineTo(
                px,
                py + radius
            );


            ctx.lineTo(
                px - radius * 0.5,
                py + radius * 0.7
            );


            ctx.lineTo(
                px - radius,
                py + radius
            );


            ctx.closePath();

            ctx.fill();


            /* Eyes */

            ctx.fillStyle =
                "white";


            ctx.beginPath();

            ctx.arc(
                px - radius * 0.35,
                py - radius * 0.05,
                radius * 0.2,
                0,
                Math.PI * 2
            );

            ctx.arc(
                px + radius * 0.35,
                py - radius * 0.05,
                radius * 0.2,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "#222";


            ctx.beginPath();

            ctx.arc(
                px - radius * 0.3,
                py - radius * 0.05,
                radius * 0.09,
                0,
                Math.PI * 2
            );

            ctx.arc(
                px + radius * 0.3,
                py - radius * 0.05,
                radius * 0.09,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }
    );

}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    scoreDisplay.textContent =
        score;


    livesDisplay.textContent =
        "❤️ ".repeat(
            Math.max(
                lives,
                0
            )
        );

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
            key === "arrowleft" ||
            key === "a"
        ) {

            event.preventDefault();

            pacman.nextDirection =
                "left";

        }


        else if (
            key === "arrowright" ||
            key === "d"
        ) {

            event.preventDefault();

            pacman.nextDirection =
                "right";

        }


        else if (
            key === "arrowup" ||
            key === "w"
        ) {

            event.preventDefault();

            pacman.nextDirection =
                "up";

        }


        else if (
            key === "arrowdown" ||
            key === "s"
        ) {

            event.preventDefault();

            pacman.nextDirection =
                "down";

        }

    }
);


/* =========================================================
   SWIPE
========================================================= */

let touchStartX = 0;

let touchStartY = 0;


canvas.addEventListener(
    "touchstart",
    event => {

        const touch =
            event.changedTouches[0];


        touchStartX =
            touch.clientX;

        touchStartY =
            touch.clientY;

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


        const dx =
            touch.clientX -
            touchStartX;


        const dy =
            touch.clientY -
            touchStartY;


        if (
            Math.max(
                Math.abs(dx),
                Math.abs(dy)
            ) < 25
        ) {

            return;

        }


        if (
            Math.abs(dx) >
            Math.abs(dy)
        ) {

            if (
                dx > 0
            ) {

                pacman.nextDirection =
                    "right";

            } else {

                pacman.nextDirection =
                    "left";

            }

        }

        else {

            if (
                dy > 0
            ) {

                pacman.nextDirection =
                    "down";

            } else {

                pacman.nextDirection =
                    "up";

            }

        }

    },
    {
        passive: false
    }
);


/* =========================================================
   MAP SELECTION
========================================================= */

const mapButtons =
    document.querySelectorAll(
        ".map-option"
    );


mapButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                mapButtons.forEach(
                    other =>
                        other.classList.remove(
                            "selected"
                        )
                );


                button.classList.add(
                    "selected"
                );


                selectedMap =
                    button.dataset.map;

            }
        );

    }
);


/* =========================================================
   PLAY
========================================================= */

playButton.addEventListener(
    "click",
    () => {

        startGame();

    }
);


/* =========================================================
   RESTART
========================================================= */

restartButton.addEventListener(
    "click",
    () => {

        startGame();

    }
);


/* =========================================================
   RETURN TO MAPS
========================================================= */

mapButton.addEventListener(
    "click",
    () => {

        gameRunning = false;

        game.style.display =
            "none";

        mapScreen.style.display =
            "flex";

    }
);


/* =========================================================
   PREVIEW MAPS
========================================================= */

function drawPreview(
    previewCanvas,
    word
) {

    const previewContext =
        previewCanvas.getContext(
            "2d"
        );


    const width =
        previewCanvas.width;

    const height =
        previewCanvas.height;


    previewContext.fillStyle =
        "#000";

    previewContext.fillRect(
        0,
        0,
        width,
        height
    );


    const cols = 31;

    const rows = 17;

    const tile =
        width / cols;


    const oldMaze =
        maze;


    createMap(word);


    previewContext.strokeStyle =
        "#064cff";

    previewContext.lineWidth =
        1.5;


    for (
        let y = 0;
        y < rows;
        y++
    ) {

        for (
            let x = 0;
            x < cols;
            x++
        ) {

            if (
                maze[y][x] === "#"
            ) {

                previewContext.strokeRect(
                    x * tile + 1,
                    y * tile + 1,
                    tile - 2,
                    tile - 2
                );

            }

        }

    }


    /* Pellets */

    previewContext.fillStyle =
        "#ffe9a8";


    pellets.forEach(
        key => {

            const [
                x,
                y
            ] =
                key
                .split(",")
                .map(Number);


            previewContext.beginPath();

            previewContext.arc(
                x * tile +
                tile / 2,

                y * tile +
                tile / 2,

                1.2,

                0,
                Math.PI * 2
            );

            previewContext.fill();

        }
    );


    maze =
        oldMaze;

}


/* =========================================================
   GENERATE PREVIEWS
========================================================= */

document
    .querySelectorAll(
        ".preview"
    )
    .forEach(
        preview => {

            drawPreview(
                preview,
                preview.dataset.preview
            );

        }
    );


/* =========================================================
   INITIAL DRAW
========================================================= */

createMap(
    selectedMap
);

resetCharacters();

draw();
