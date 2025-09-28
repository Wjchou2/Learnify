let timerIsOn = false;

let lastBlurTime = 0; // To store the timestamp when the window is blurred
let todoList = [];
let timeLeft = 1500;
let countdown = null;
let studyMode = true;

let sounds = [
    "https://www.youtube.com/watch?v=WPni755-Krg",
    "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    "https://www.youtube.com/watch?v=sjkrrmBnpGE",
    "https://www.youtube.com/watch?v=Rm2vkXRFJ-s",
];
let titles = ["Alpha Brain Waves", "Lofi Girl", "Ambient", "Study With Duo"];

if (localStorage.getItem("Sounds")) {
    sounds = JSON.parse(localStorage.getItem("Sounds"));
    titles = JSON.parse(localStorage.getItem("titles"));
} else {
    localStorage.setItem("Sounds", JSON.stringify(sounds));
    localStorage.setItem("titles", JSON.stringify(titles));
}
let musicPanel = document.getElementById("musicList");
let player;
function normalizeYouTubeURL(url) {
    try {
        const parsed = new URL(url);

        // video ID placeholder
        let videoId = null;

        if (
            parsed.hostname === "www.youtube.com" ||
            parsed.hostname === "youtube.com"
        ) {
            // e.g. https://www.youtube.com/watch?v=VIDEO_ID
            if (parsed.pathname === "/watch" && parsed.searchParams.has("v")) {
                videoId = parsed.searchParams.get("v");
            }
        } else if (parsed.hostname === "youtu.be") {
            // e.g. https://youtu.be/VIDEO_ID
            videoId = parsed.pathname.slice(1);
        }

        // Basic check for YouTube's 11-char video IDs
        if (videoId && /^[\w-]{11}$/.test(videoId)) {
            return `https://www.youtube.com/watch?v=${videoId}`;
        }

        // Not a valid/convertible YouTube link
        return null;
    } catch (e) {
        // Invalid URL string
        return null;
    }
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player("myVideo", {
        events: {
            onStateChange: onPlayerStateChange,
        },
    });
}

// Pause the video
function pauseVideo() {
    player.pauseVideo();
}

// Play the video
function playVideo() {
    player.playVideo();
}
drawSoundsPanel();
let menuIsOpen = false;
document.getElementById("openMenu").innerHTML = menuIsOpen
    ? "<"
    : `<span class="material-symbols-outlined">
music_note
</span>`;
function openMenu() {
    document.getElementById("musicPlayer").style.transition =
        "margin-left 0.5s";

    menuIsOpen = !menuIsOpen;
    document.getElementById("musicPlayer").style.marginLeft = menuIsOpen
        ? "0%"
        : "-20%";
    document.getElementById("openMenu").innerHTML = menuIsOpen
        ? "<"
        : `<span class="material-symbols-outlined">
music_note
</span>`;
}
document.getElementById("addMusic").addEventListener("click", function () {
    let urlToAdd = document.getElementById("musicInput").value;
    urlToAdd = normalizeYouTubeURL(urlToAdd);
    document.getElementById("musicInput").value = "";
    if (urlToAdd != null) {
        let name = prompt("Enter a name for the Video");
        sounds.push(urlToAdd);
        titles.push(name);

        localStorage.setItem("Sounds", JSON.stringify(sounds));
        localStorage.setItem("titles", JSON.stringify(titles));
        drawSoundsPanel();
    } else {
        alert("Invalid URL :(");
    }
});
function drawSoundsPanel() {
    musicPanel.innerHTML = ""; // clears all children instantly

    for (let i = 0; i < sounds.length; i++) {
        let musicEntry = document.createElement("div");
        musicEntry.className = "musicEntry";
        musicPanel.appendChild(musicEntry);
        const url = sounds[i];
        const idWithTime = url.substring(url.lastIndexOf("=") + 1);

        let imageLabel = document.createElement("img");
        imageLabel.className = "musicImage";
        imageLabel.src = `https://img.youtube.com/vi/${idWithTime}/default.jpg`;
        musicEntry.appendChild(imageLabel);

        let textLabel = document.createElement("p");
        textLabel.className = "musicLabel";
        textLabel.innerHTML = titles[i];
        musicEntry.appendChild(textLabel);
        let x = document.createElement("div");
        x.className = "deleteMusic";
        x.innerHTML = "x";
        musicEntry.appendChild(x);
        x.addEventListener("click", function (e) {
            e.stopPropagation();

            sounds.splice(i, 1);
            titles.splice(i, 1);
            localStorage.setItem("Sounds", JSON.stringify(sounds));
            localStorage.setItem("titles", JSON.stringify(titles));
            let parent = x.parentElement;
            parent.style.transition = "all 0.5s";
            parent.style.marginLeft = "100%";
            parent.style.opacity = "0";
            setTimeout(() => {
                drawSoundsPanel();
            }, 250);
        });
        musicEntry.addEventListener("click", function () {
            const url = sounds[i];
            const idWithTime = url.substring(url.lastIndexOf("=") + 1);
            // Load a new video by ID
            document.getElementById("currentPlaying").innerHTML = titles[i];

            document.getElementById("myVideo").src =
                "https://www.youtube.com/embed/" +
                idWithTime +
                "?autoplay=1" +
                "&controls=1" +
                "&modestbranding=1" +
                "&rel=0" +
                "&showinfo=0";
        });
    }
}
function onPlayerStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.PLAYING:
            document.getElementById("playButton").innerText = "pause";

            break;
        case YT.PlayerState.PAUSED:
            document.getElementById("playButton").innerText = "play_arrow";

            break;
    }
}
let isPlayingMusic = false;
document.getElementById("playButton").addEventListener("click", function () {
    if (player.getPlayerState() == 1) {
        pauseVideo();
    } else {
        playVideo();
    }
});

function updateTodoList() {
    todoList = localStorage.getItem("todo");
    todoList = JSON.parse(todoList);
    if (todoList == null) {
        todoList = [];
    }
}
updateTodoList();
// window.addEventListener("blur", leave);
// window.addEventListener("focus", returned);
window.addEventListener("beforeunload", leave);
window.addEventListener("load", returned);
let awaytimeout;
function leave() {
    lastBlurTime = Math.round(new Date().getTime() / 1000);
    localStorage.setItem("lastBlurTime", JSON.stringify(lastBlurTime));
    clearInterval(countdown);
}
function returned() {
    if (awaytimeout) {
        clearInterval(awaytimeout);
    }
    let savedLastBlurTime = localStorage.getItem("lastBlurTime");
    if (savedLastBlurTime) {
        lastBlurTime = JSON.parse(savedLastBlurTime);
        if (lastBlurTime > 0 && timerIsOn) {
            const currentTime = Math.round(new Date().getTime() / 1000);
            const secondsElapsed = currentTime - lastBlurTime;
            timeLeft -= secondsElapsed;
            lastBlurTime = 0;
            if (timeLeft > 0) {
                toggleTimerState();
            } else {
                timeLeft = 0;
                localStorage.setItem("timeLeft", "0");
                setTextLabel();
            }
        }
    }
}

let options = [];
let optionTags = [];
const tags = [
    ["religion"],
    ["math", "geo"],
    ["history"],
    ["health"],
    ["biology"],
    ["spanish"],
    ["english"],
];
let asignmentcontainer = document.createElement("div");
asignmentcontainer.id = "asignmentcontainer";
document.body.appendChild(asignmentcontainer);

document.title = "Learnify";
(_a = document.getElementById("content-wrapper")) === null || _a === void 0
    ? void 0
    : _a.remove();
(_b = document.getElementById("site-navigation-footer")) === null ||
_b === void 0
    ? void 0
    : _b.remove();
(_c = document.getElementById("main-content-wrapper")) === null || _c === void 0
    ? void 0
    : _c.remove();
let wrapper = document.getElementById("wrapper");
let container = document.createElement("div");
container.id = "container";

document.body.appendChild(container);
document.body.style.backgroundImage = `url("https://i.postimg.cc/J0c0K0kx/Chat-GPT-Image-Sep-20-2025-12-31-04-PM.png")`;

let startTimerButton = document.createElement("button");
startTimerButton.className = "hugeBtn";
startTimerButton.id = "studyButton";

startTimerButton.innerHTML = "Study";
let resetButton = document.createElement("button");
resetButton.className = "hugeBtn";
resetButton.id = "resetButton";
resetButton.innerHTML = "Reset";
let timerText = document.createElement("h1");
timerText.className = "timerText";
timerText.innerHTML = "0:00";
container.appendChild(timerText);

//createTimeSelectionBar
let timeSelection = document.createElement("div");
timeSelection.className = "timeSelection";
container.appendChild(timeSelection);

let studyModeButton = document.createElement("div");
// timeSelection.className = "timeSelection";
studyModeButton.innerHTML = "Study (25m)";

timeSelection.appendChild(studyModeButton);
let breakModeButton = document.createElement("div");
breakModeButton.innerHTML = "Break (5m)";
// timeSelection.className = "timeSelection";
timeSelection.appendChild(breakModeButton);
function updateModeColor() {
    studyModeButton.style.background = studyMode ? "#109d03ff" : "#175c11";
    breakModeButton.style.background = !studyMode ? "#109d03ff" : "#175c11";
}
if (localStorage.getItem("studyMode") != null) {
    studyMode = JSON.parse(localStorage.getItem("studyMode"));
    updateModeColor();
}
studyModeButton.addEventListener("click", function () {
    if (!studyMode) {
        studyMode = true;
        updateModeColor();
        timeLeft = 1500;
        timerIsOn = false;
        toggleTimerState();
    }

    localStorage.setItem("studyMode", studyMode);
});
breakModeButton.addEventListener("click", function () {
    if (studyMode) {
        studyMode = false;
        updateModeColor();
        timeLeft = 300;
        timerIsOn = false;
        toggleTimerState();
    }
    localStorage.setItem("studyMode", studyMode);
});

container.appendChild(startTimerButton);
container.appendChild(resetButton);
function updateList() {
    let todoListDiv = document.getElementsByClassName("containerDiv")[0];
    if (todoListDiv) {
        todoListDiv.remove();
    }

    todoListDiv = document.createElement("div");
    todoListDiv.className = "containerDiv";

    let todoHeader = document.createElement("p");
    todoHeader.className = "todolabel";
    todoHeader.innerHTML = "Todo List:";
    todoListDiv.appendChild(todoHeader);

    let todoListItemCount = -1;
    startTimerButton.before(todoListDiv);
    todoListDiv.appendChild(buttonRow);
    // todoListDiv.appendChild(clearBtn);
    let ul = document.createElement("ul");
    ul.className = "ul";

    buttonRow.before(ul);

    todoList.forEach((item) => {
        todoListItemCount++;
        const [itemName, values] = item;
        let todoItemDiv = document.createElement("li");
        todoItemDiv.className = "listDiv";
        let todoItemName = document.createElement("p");
        todoItemName.className = "textLabel";
        todoItemName.innerHTML = itemName;
        todoItemName.contentEditable = "true";
        todoItemName.id = "txtlabel" + String(todoListItemCount);
        let todoItemCheckBox = document.createElement("input");
        todoItemCheckBox.type = "checkbox";
        todoItemCheckBox.checked = values;
        todoItemCheckBox.className = "checkboxItem";
        todoItemCheckBox.id = "checkbox" + String(todoListItemCount);
        let todoItemRemove = document.createElement("span");
        todoItemRemove.className = "deletebtn";
        todoItemRemove.innerHTML = "x";
        todoItemRemove.id = "deletebn" + String(todoListItemCount);
        todoItemDiv.style.marginTop = "0px";
        todoItemCheckBox.style.marginTop = "0px";

        let dragIcon = document.createElement("p");
        dragIcon.className = "dragIcon";
        dragIcon.innerHTML = `<span class="material-symbols-outlined">drag_handle</span>`;

        todoItemDiv.style.marginTop = "0px";
        todoItemCheckBox.style.marginTop = "0px";

        ul.appendChild(todoItemDiv);
        todoItemDiv.appendChild(todoItemName);
        todoItemDiv.appendChild(todoItemCheckBox);
        todoItemDiv.appendChild(todoItemRemove);
        todoItemDiv.appendChild(dragIcon);

        let todoOptions = document.createElement("section");
        todoItemName.addEventListener("input", () => {
            const query = todoItemName.innerText.toLowerCase();
            todoOptions.innerHTML = "";
            let filteredOptions = [];
            for (let i = 0; i < options.length; i++) {
                let option =
                    options[i].toLowerCase() + optionTags[i].toLowerCase();
                if (option.includes(query)) {
                    filteredOptions.push(options[i]);
                }
            }
            if (filteredOptions.length > 0) {
                todoOptions.classList.remove("hidden");
                filteredOptions.forEach((option) => {
                    let dropdownOptionDiv = document.createElement("div");
                    dropdownOptionDiv.classList.add("selectoptions");
                    dropdownOptionDiv.textContent = option;
                    todoOptions.appendChild(dropdownOptionDiv);
                    dropdownOptionDiv.addEventListener("click", () => {
                        var _a;
                        todoItemName.innerText = option;
                        todoOptions.classList.add("hidden");
                        let todoListItemIndex = todoItemName.id;
                        todoListItemIndex = String(todoListItemIndex).slice(
                            8,
                            todoListItemIndex.length
                        );
                        todoList[Number(todoListItemIndex)] = [
                            (_a = document.getElementById(
                                "txtlabel" + todoListItemIndex
                            )) === null || _a === void 0
                                ? void 0
                                : _a.innerText,
                            document.getElementById(
                                "checkbox" + todoListItemIndex
                            ).checked,
                        ];
                        localStorage.setItem("todo", JSON.stringify(todoList));
                    });
                });
            } else {
                todoOptions.classList.add("hidden"); // Hide dropdown if no matches
            }
        });
        todoItemDiv.after(todoOptions);
        todoItemRemove.addEventListener("click", function () {
            let todoListItemIndex = this.id;
            todoListItemIndex = String(todoListItemIndex).slice(
                8,
                todoListItemIndex.length
            );
            todoList.splice(Number(todoListItemIndex), 1);
            localStorage.setItem("todo", JSON.stringify(todoList));
            let parent = this.parentElement;
            parent.style.transition = "all 0.5s";
            parent.style.marginLeft = "30%";
            parent.style.opacity = "0";
            setTimeout(() => {
                updateList();
            }, 500);
        });
        function saveUpdatedList() {
            var _a;
            let todoListItemIndex = this.id;
            todoListItemIndex = String(todoListItemIndex).slice(
                8,
                todoListItemIndex.length
            );
            todoList[Number(todoListItemIndex)] = [
                (_a = document.getElementById(
                    "txtlabel" + todoListItemIndex
                )) === null || _a === void 0
                    ? void 0
                    : _a.innerText,
                document.getElementById("checkbox" + todoListItemIndex).checked,
            ];
            localStorage.setItem("todo", JSON.stringify(todoList));
        }
        todoItemName.addEventListener("input", saveUpdatedList);
        todoItemCheckBox.addEventListener("input", saveUpdatedList);
    });

    new Sortable(ul, {
        animation: 150, // smooth animation in ms
        ghostClass: "sortable-ghost", // optional, adds class when dragging
        onEnd: function (evt) {
            const newOrder = [];
            ul.querySelectorAll("li").forEach((li) => {
                const text = li.querySelector("p")?.textContent;
                const checked =
                    li.querySelector("input[type=checkbox]")?.checked || false;
                newOrder.push([text, checked]);
            });

            // Save the new order
            localStorage.setItem("todo", JSON.stringify(newOrder));

            // Optional: update your in-memory array
            todolist = newOrder;
        },
    });
}

let createNewBtn = document.createElement("button");
createNewBtn.className = "createNewBtn";
let clearBtn = document.createElement("button");
clearBtn.className = "createNewBtn";
clearBtn.id = "clearListBtn";
clearBtn.innerHTML = "Clear All";
clearBtn.style.backgroundColor = "rgb(223 160 160)";
createNewBtn.innerHTML = `<span id="plusIcon" class="material-symbols-outlined">
add
</span><span> Create new Task</span>`;
let buttonRow = document.createElement("div");
buttonRow.className = "button-row"; // For styling
buttonRow.appendChild(createNewBtn);
buttonRow.appendChild(clearBtn);
let selectedSound = 1;
let soundsButton = document.createElement("button");
soundsButton.className = "soundButton";
soundsButton.innerHTML = "Music";
// container.appendChild(soundsButton);
let ytContainer = document.createElement("div");
document.body.appendChild(ytContainer);
//YT FRAME

container.appendChild(buttonRow);
clearBtn.addEventListener("click", function () {
    todoList = [];
    localStorage.setItem("todo", JSON.stringify(todoList));
    updateList();
});
// let header = document.getElementById("header");
// header.style.transition = "all 0.2s";
// header.style.opacity = "0";
// document.addEventListener("mousemove", function (event) {
//     let mouseY = event.clientY; // Get the vertical mouse position (Y-axis)
//     // Define a threshold for "near the top" (e.g., 50px from the top)
//     if (mouseY < 50) {
//         header.style.opacity = "1";
//     } else {
//         header.style.opacity = "0";
//     }
// });
createNewBtn.addEventListener("click", function () {
    updateTodoList();
    todoList.push(["New Task", false]);
    localStorage.setItem("todo", JSON.stringify(todoList));
    updateList();
});

function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}
let isOnStorage = localStorage.getItem("timerIsOn");
let timeLeftStorage = localStorage.getItem("timeLeft");
if (isOnStorage && timeLeftStorage) {
    timerIsOn = JSON.parse(isOnStorage);
    // timeLeftStorage = clamp(timeLeftStorage, 0, 1000000);
    timeLeft = JSON.parse(timeLeftStorage);
    toggleTimerState();
}

function setTextLabel() {
    if (String(Math.floor(timeLeft % 60)).length == 1) {
        timeString = `${Math.floor(timeLeft / 60)}:0${Math.floor(
            timeLeft % 60
        )} `;
    } else {
        timeString = `${Math.floor(timeLeft / 60)}:${Math.floor(
            timeLeft % 60
        )} `;
    }

    document.title = `(${timeString.substring(
        0,
        timeString.length - 1
    )}) Learnify`;
    timerText.innerHTML = timeString;
}
function updateTimerLabel() {
    if (timerIsOn) {
        startTimerButton.innerHTML = "Pause";
    } else {
        if (studyMode) {
            startTimerButton.innerHTML = "Study";
        } else {
            startTimerButton.innerHTML = "Continue Break";
        }
    }
}
function toggleTimerState() {
    updateTimerLabel();
    localStorage.setItem("timerIsOn", JSON.stringify(timerIsOn));
    if (countdown !== null) {
        clearInterval(countdown);
    }
    if (timerIsOn) {
    } else {
        if (countdown !== null) {
            clearInterval(countdown);
        }
    }
}
updateList();
resetButton.addEventListener("click", function () {
    timeLeft = studyMode ? 1500 : 300;
    // timeLeft = studyMode ? 1500 : 3;
    localStorage.setItem("timeLeft", JSON.stringify(timeLeft));
    timerIsOn = false;
    toggleTimerState();
    // setTextLabel();
});
startTimerButton.addEventListener("click", function () {
    if (timerIsOn) {
        timerIsOn = false;
        startTimerButton.innerHTML = "Study";
    } else {
        timerIsOn = true;
        startTimerButton.innerHTML = "Pause";
    }
    toggleTimerState();
});
const workerCode = `
let counter = 0;
setInterval(() => {
    postMessage(counter++);
   
}, 100);
`;

const blob = new Blob([workerCode], { type: "application/javascript" });
const worker = new Worker(URL.createObjectURL(blob));

worker.onmessage = (e) => {
    localStorage.setItem("timeLeft", JSON.stringify(timeLeft));
    if (timerIsOn) {
        timeLeft = clamp(timeLeft - 0.1, 0, 100000);

        if (timeLeft <= 0.1) {
            const sound = new Audio("ringtone.mp3");
            sound.play();
            timerText.innerHTML = "0:00";
            timerIsOn = false;
            timeLeft = 1500;
            studyMode = true;
            toggleTimerState();
            updateModeColor();
            return;
        }
    }
    setTextLabel();
};
updateTimerLabel();
