/* =========================================================
   OARADHI PAC-MAN
   VERSION 1
   MAP SELECTION + GAME FRAMEWORK
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

const gameCanvas =
    document.getElementById("gameCanvas");

const scoreDisplay =
    document.getElementById("score");

const livesDisplay =
    document.getElementById("lives");

const currentMapDisplay =
    document.getElementById("currentMap");

const gameMessage =
    document.getElementById("gameMessage");

const ctx =
    gameCanvas.getContext("2d");


/* =========================================================
   MAP DATA
========================================================= */

const MAPS = {

    OARADHI: {

        name: "OARADHI",

        description:
            "Classic balanced maze",

        accent: "#ffd91a",

        layout: [

            "#########",
            "#.......#",
            "#.###.###",
            "#.......#",
            "###.#.###",
            "#.......#",
            "#########"

        ]

    },


    RADHIRA: {

        name: "RADHIRA",

        description:
            "Symmetrical and tricky",

        accent: "#ff72c8",

        layout: [

            "#########",
            "#...#...#",
            "#.#.#.#.#",
            "#.......#",
            "###.#.###",
            "#.......#",
            "#########"

        ]

    },


    RUZRUN: {

        name: "RUZRUN",

        description:
            "Fast and open",

        accent: "#4facfe",

        layout: [

            "#########",
            "#.......#",
            "#.#####.#",
            "#.......#",
            "#.#####.#",
            "#.......#",
            "#########"

        ]

    },


    WARUN: {

        name: "WARUN",

        description:
            "Compact and dangerous",

        accent: "#43e97b",

        layout: [

            "#########",
            "#.#...#.#",
            "#.......#",
            "###.#.###",
            "#.......#",
            "#.#...#.#",
            "#########"

        ]

    }

};


/* =========================================================
   GAME STATE
========================================================= */

let selectedMap = null;

let currentMap = null;

let score = 0;

let lives = 3;


/* =========================================================
   CREATE MAP MENU
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

function selectMap(mapName) {

    selectedMap =
        MAPS[mapName];


    document
        .querySelectorAll(".map-card")
        .forEach(card => {

            card.classList.toggle(
                "selected",
                card.dataset.map === mapName
            );

        });


    playButton.disabled = false;

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


    scoreDisplay.textContent =
        score;


    livesDisplay.textContent =
        "❤️❤️❤️";


    currentMapDisplay.textContent =
        currentMap.name;


    mapScreen.classList.add(
        "hidden"
    );


    gameScreen.classList.remove(
        "hidden"
    );


    gameMessage.textContent =
        "Use arrow keys, WASD, or swipe ✨";


    resizeCanvas();

    drawPlaceholderMaze();

}


/* =========================================================
   RETURN TO MAPS
========================================================= */

function showMapScreen() {

    gameScreen.classList.add(
        "hidden"
    );


    mapScreen.classList.remove(
        "hidden"
    );

}


/* =========================================================
   RESTART
========================================================= */

function restartGame() {

    score = 0;

    lives = 3;


    scoreDisplay.textContent =
        score;


    livesDisplay.textContent =
        "❤️❤️❤️";


    gameMessage.textContent =
        "Use arrow keys, WASD, or swipe ✨";


    drawPlaceholderMaze();

}


/* =========================================================
   CANVAS SIZE
========================================================= */

function resizeCanvas() {

    const size =
        Math.min(
            gameCanvas.parentElement.clientWidth,
            700
        );


    const pixelRatio =
        window.devicePixelRatio || 1;


    gameCanvas.width =
        size * pixelRatio;


    gameCanvas.height =
        size * pixelRatio;


    gameCanvas.style.width =
        `${size}px`;


    gameCanvas.style.height =
        `${size}px`;


    ctx.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
    );


    drawPlaceholderMaze();

}


/* =========================================================
   DRAW CURRENT MAP
========================================================= */

function drawPlaceholderMaze() {

    if (!currentMap) {
        return;
    }


    const width =
        gameCanvas.clientWidth;

    const height =
        gameCanvas.clientHeight;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const layout =
        currentMap.layout;


    const rows =
        layout.length;

    const columns =
        layout[0].length;


    const cellWidth =
        width / columns;

    const cellHeight =
        height / rows;


    /* Background */

    ctx.fillStyle =
        "#03030d";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* Maze */

    for (
        let row = 0;
        row < rows;
        row++
    ) {

        for (
            let col = 0;
            col < columns;
            col++
        ) {

            const character =
                layout[row][col];


            const x =
                col * cellWidth;

            const y =
                row * cellHeight;


            if (
                character === "#"
            ) {

                ctx.fillStyle =
                    currentMap.accent;

                ctx.fillRect(
                    x + 2,
                    y + 2,
                    cellWidth - 4,
                    cellHeight - 4
                );

            }


            else if (
                character === "."
            ) {

                ctx.fillStyle =
                    "#ffffff";

                ctx.beginPath();

                ctx.arc(
                    x + cellWidth / 2,
                    y + cellHeight / 2,
                    Math.max(
                        2,
                        cellWidth * 0.06
                    ),
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }

        }

    }


    /* Temporary player */

    const playerX =
        4 * cellWidth +
        cellWidth / 2;

    const playerY =
        3 * cellHeight +
        cellHeight / 2;


    ctx.fillStyle =
        "#ffd91a";

    ctx.beginPath();

    ctx.arc(
        playerX,
        playerY,
        Math.min(
            cellWidth,
            cellHeight
        ) * 0.35,
        0.25,
        Math.PI * 2 - 0.25
    );

    ctx.lineTo(
        playerX,
        playerY
    );

    ctx.fill();

}


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        const validKeys = [

            "arrowup",
            "arrowdown",
            "arrowleft",
            "arrowright",

            "w",
            "a",
            "s",
            "d"

        ];


        if (
            validKeys.includes(key)
        ) {

            event.preventDefault();


            handleDirection(
                key
            );

        }

    }
);


/* =========================================================
   DIRECTION
========================================================= */

function handleDirection(key) {

    const directions = {

        arrowup: "up",
        w: "up",

        arrowdown: "down",
        s: "down",

        arrowleft: "left",
        a: "left",

        arrowright: "right",
        d: "right"

    };


    const direction =
        directions[key];


    gameMessage.textContent =
        `Moving ${direction} ✨`;

}


/* =========================================================
   MOBILE SWIPE
========================================================= */

let touchStartX = 0;

let touchStartY = 0;

let touchStartTime = 0;


gameCanvas.addEventListener(
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


gameCanvas.addEventListener(
    "touchmove",
    event => {

        event.preventDefault();

    },
    {
        passive: false
    }
);


gameCanvas.addEventListener(
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
            distance < 25 ||
            duration > 1000
        ) {

            return;

        }


        let direction;


        if (
            Math.abs(deltaX) >
            Math.abs(deltaY)
        ) {

            direction =
                deltaX > 0
                    ? "right"
                    : "left";

        }

        else {

            direction =
                deltaY > 0
                    ? "down"
                    : "up";

        }


        handleDirection(
            direction
        );

    },
    {
        passive: false
    }
);


/* =========================================================
   BUTTONS
========================================================= */

playButton.addEventListener(
    "click",
    startGame
);


backButton.addEventListener(
    "click",
    showMapScreen
);


restartButton.addEventListener(
    "click",
    restartGame
);


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
