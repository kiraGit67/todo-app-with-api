"use strict";
/*
function getToDoData(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => console.log(data));
}
*/

const newToDoInput = document.querySelector("#new-toDo");
const addNewToDoButton = document.querySelector("#add-new-toDo");

const deleteDoneToDosButton = document.querySelector("#delete-done-toDos");

const filterButtons = document.querySelectorAll("input[type='radio']");
console.log(filterButtons);

let toDos = [];

async function getToDoData(url) {
  const response = await fetch(url);
  const data = await response.json();

  //toDos.push(...data);
  toDos = data;
  //console.log("ToDos: ", toDos);
  createList();
}

function createList() {
  console.log(toDos);

  const toDoList = document.querySelector("#to-do-list");
  toDoList.innerHTML = "";

  toDos.forEach((toDo) => {
    console.log(toDo);
    const newLi = document.createElement("li");
    const newLiText = document.createTextNode(toDo.description);
    const newLiCheckBox = document.createElement("input");
    newLiCheckBox.type = "checkbox";
    newLiCheckBox.checked = toDo.done;

    if (toDo.done === true) {
      newLi.classList.add("toDoDone");
    }

    newLiCheckBox.addEventListener("change", () => {
      newLi.classList.toggle("toDoDone");

      console.log(toDo);
      toDo.done = !toDo.done;

      fetch("http://localhost:4730/todos/" + toDo.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toDo),
      }).then((response) => response.json());
    });

    newLi.append(newLiCheckBox, newLiText);
    toDoList.appendChild(newLi);
  });
}

addNewToDoButton.addEventListener("click", () => {
  const newToDoText = newToDoInput.value;
  const newToDo = {
    description: newToDoText,
    done: false,
  };

  const toDoDescriptions = [];

  for (let toDo of toDos) {
    toDoDescriptions.push(toDo.description);
  }

  if (!toDoDescriptions.includes(newToDoText) && newToDoText !== "") {
    fetch("http://localhost:4730/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newToDo),
    })
      .then((response) => response.json())
      .then((newToDoFromApi) => {
        toDos.push(newToDoFromApi);
        createList();
      });
  }

  newToDoInput.value = "";
});

deleteDoneToDosButton.addEventListener("click", async () => {
  const doneToDos = toDos.filter((toDo) => {
    return toDo.done === true;
  });

  console.log(doneToDos);

  for (let doneToDo of doneToDos) {
    await fetch("http://localhost:4730/todos/" + doneToDo.id, {
      method: "DELETE",
    });
  }
  getToDoData("http://localhost:4730/todos");
});

filterButtons.forEach((filterButton) => {
  filterButton.addEventListener("change", function (event) {
    const filterState = event.target.value;
    console.log(filterState);

    let filterURL;

    if (filterState === "done") {
      filterURL = "http://localhost:4730/todos?done=true";
    } else if (filterState === "open") {
      filterURL = "http://localhost:4730/todos?done=false";
    } else {
      filterURL = "http://localhost:4730/todos";
    }

    fetch(filterURL)
      .then((response) => response.json())
      .then((filteredToDos) => {
        toDos = filteredToDos;
        console.log(toDos);
        createList();
      });
  });
});

getToDoData("http://localhost:4730/todos");
