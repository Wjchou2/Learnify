let timerIsOn = false;

let lastBlurTime = 0; // To store the timestamp when the window is blurred
let todoList = [];
let timeLeft = 1500;
let countdown = null;

let sounds = [
    "https://www.youtube.com/watch?v=WPni755-Krg",
    "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    "https://www.youtube.com/watch?v=sjkrrmBnpGE",
    "https://www.youtube.com/watch?v=Rm2vkXRFJ-s",
];
let titles = ["Alpha Brain Waves", "Lofi Girl", "Ambient", "Study With Duo"];
let musicPanel = document.getElementById("musicSettings");
let player;

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
function openMenu() {
    menuIsOpen = !menuIsOpen;
    document.getElementById("musicPlayer").style.marginLeft = menuIsOpen
        ? "0%"
        : "-20%";
    document.getElementById("openMenu").innerText = menuIsOpen ? "<" : ">";
}

function drawSoundsPanel() {
    for (let i = 0; i < sounds.length; i++) {
        let musicEntry = document.createElement("div");
        musicEntry.className = "musicEntry";
        musicPanel.before(musicEntry);
        let textLabel = document.createElement("p");
        textLabel.innerHTML = titles[i];
        musicEntry.appendChild(textLabel);

        musicEntry.addEventListener("click", function () {
            const url = sounds[i];
            const idWithTime = url.substring(url.lastIndexOf("=") + 1);
            // Load a new video by ID
            document.getElementById("currentPlaying").innerHTML = titles[i];

            document.getElementById("myVideo").src =
                "https://www.youtube.com/embed/" +
                idWithTime +
                "?autoplay=1" +
                "&controls=0" +
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
todoList = localStorage.getItem("todo");
todoList = JSON.parse(todoList);
if (todoList == null) {
    todoList = [];
}
window.addEventListener("blur", leave);
window.addEventListener("focus", returned);
window.addEventListener("beforeunload", leave);
window.addEventListener("load", returned);
let awaytimeout;
function leave() {
    lastBlurTime = Math.round(new Date().getTime() / 1000);
    localStorage.setItem("lastBlurTime", JSON.stringify(lastBlurTime));
    clearInterval(countdown);
    awaytimeout = setInterval(() => {
        let title = document.getElementsByTagName("title")[0];
        title.innerText = `(${timeString.substring(
            0,
            timeString.length - 1
        )}) Learnify`;
    }, 1000);
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

let pageTitle = document.getElementsByTagName("title")[0];
pageTitle.innerText = "Learnify";
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
    todoList.forEach((item) => {
        todoListItemCount++;
        const [itemName, values] = item;
        let todoItemDiv = document.createElement("div");
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
        let todoItemRemove = document.createElement("button");
        todoItemRemove.className = "deletebn";
        todoItemRemove.id = "deletebn" + String(todoListItemCount);
        todoItemRemove.innerHTML = "X";
        todoItemDiv.style.marginTop = "0px";
        todoItemCheckBox.style.marginTop = "0px";
        buttonRow.before(todoItemDiv);
        todoItemDiv.appendChild(todoItemName);
        todoItemDiv.appendChild(todoItemCheckBox);
        todoItemDiv.appendChild(todoItemRemove);
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
            todoList.splice(Number(todoListItemIndex), 1); // 2nd parameter means remove one item only
            localStorage.setItem("todo", JSON.stringify(todoList));
            let parent = this.parentElement;
            parent.style.transition = "all 0.5s";
            parent.style.marginLeft = "10%";
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
setTextLabel();
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
    timerText.innerHTML = timeString;
    let title = document.getElementsByTagName("title")[0];
    title.innerText = `(${timeString.substring(
        0,
        timeString.length - 1
    )}) Learnify`;
}
function toggleTimerState() {
    if (timerIsOn) {
        startTimerButton.innerHTML = "Pause";
    } else {
        startTimerButton.innerHTML = "Study";
    }
    localStorage.setItem("timerIsOn", JSON.stringify(timerIsOn));
    if (countdown !== null) {
        clearInterval(countdown);
    }
    if (timerIsOn) {
        countdown = setInterval(() => {
            localStorage.setItem("timeLeft", JSON.stringify(timeLeft));
            timeLeft = clamp(timeLeft - 0.1, 0, 100000);

            setTextLabel();
            if (timeLeft <= 0.1) {
                timerText.innerHTML = "0:00";
                timerIsOn = false;
                timeLeft = 1500;
                toggleTimerState();
                return;
            }
        }, 100);
    } else {
        if (countdown !== null) {
            clearInterval(countdown);
        }
    }
}
updateList();
resetButton.addEventListener("click", function () {
    timeLeft = 1500;
    localStorage.setItem("timeLeft", JSON.stringify(timeLeft));
    timerIsOn = false;
    toggleTimerState();
    setTextLabel();
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
