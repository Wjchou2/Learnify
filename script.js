let timerIsOn = false;

let lastBlurTime = 0; // To store the timestamp when the window is blurred
let todoList = [];
let timeLeft = 1500;
let countdown = null;
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
            if (timeLeft >= 0) {
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
// function getCurrentAsignments() {
//     fetch("https://schoology.shschools.org/home/upcoming_submissions_ajax")
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             return response.json(); // Assuming the response is JSON
//         })
//         .then((data) => {
//             let asignmentContainer =
//                 document.getElementById("asignmentcontainer");
//             asignmentContainer.innerHTML += data.html;
//             let asignments = document.getElementsByClassName("event-title");
//             Array.from(asignments).forEach((asignment) => {
//                 var _a;
//                 let asignmentName = asignment.firstElementChild;
//                 let asignmentTag =
//                     (_a = asignment.lastElementChild) === null ||
//                     _a === void 0
//                         ? void 0
//                         : _a.lastElementChild;
//                 options.push(asignmentName.innerText);
//                 optionTags.push(asignmentTag.innerText);
//             });
//             asignmentcontainer.remove();
//         })
//         .catch((error) => {
//             console.error("Error fetching data:", error);
//             return error;
//         });
// }
//FINISH LABELING VARIABLES BELOW

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
            parent.style.left = "500px";
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
document.head.innerHTML += `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=add" />`;
let createNewBtn = document.createElement("button");
createNewBtn.className = "createNewBtn";
let clearBtn = document.createElement("button");
clearBtn.className = "createNewBtn";
clearBtn.id = "clearListBtn";
clearBtn.innerHTML = "Clear All";
clearBtn.style.backgroundColor = "rgb(223 160 160)";
createNewBtn.innerHTML = `<span id="plusIcon" class="material-symbols-outlined">
add
</span><span> Create new Item</span>`;
let buttonRow = document.createElement("div");
buttonRow.className = "button-row"; // For styling
buttonRow.appendChild(createNewBtn);
buttonRow.appendChild(clearBtn);
let selectedSound = 1;
let soundsButton = document.createElement("button");
soundsButton.className = "soundButton";
soundsButton.innerHTML = "Music";
container.appendChild(soundsButton);
let ytContainer = document.createElement("div");
document.body.appendChild(ytContainer);
// let iframe = document.createElement("iframe");
// iframe.width = "100";
// iframe.height = "100";
// iframe.style.display = "block"; // Hide iframe, it will play in the background
// iframe.src =
//     "https://www.youtube.com/embed/Rm2vkXRFJ-s?autoplay=1&start=48&controls=0&modestbranding=1&rel=0&showinfo=0";
// soundsButton.addEventListener("click", function () {
//     if (selectedSound == 1) {
//         selectedSound = 0;
//         iframe.src =
//             "https://www.youtube.com/embed/WPni755-Krg?autoplay=1&start=48&controls=0&modestbranding=1&rel=0&showinfo=0";
//     } else {
//         iframe.src =
//             "https://www.youtube.com/embed/Rm2vkXRFJ-s?autoplay=1&start=48&controls=0&modestbranding=1&rel=0&showinfo=0";
//         selectedSound = 1;
//     }
// });
// document.body.appendChild(iframe);
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
    todoList.push(["New Item", false]);
    localStorage.setItem("todo", JSON.stringify(todoList));
    updateList();
});

let isOnStorage = localStorage.getItem("timerIsOn");
let timeLeftStorage = localStorage.getItem("timeLeft");
if (isOnStorage && timeLeftStorage) {
    timerIsOn = JSON.parse(isOnStorage);
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
            timeLeft -= 0.1;
            localStorage.setItem("timeLeft", JSON.stringify(timeLeft));
            setTextLabel();
            if (timeLeft <= 0) {
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
