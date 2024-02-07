const COHORT = "2401-fsa-et-web-ft-sf";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;


state = {
    parties: [],
    selectedParty: null
};
const partyList = document.querySelector("#parties");
const addPartyForm = document.querySelector("#addParty");
const del = document.querySelector(".deleteBTN");



function setParty(party) {
  state.selectedParty = party;
  location.hash = party.id;
}

function hashParty() {
  const id = +location.hash.slice(1);
  state.selectedParty = state.parties.find(party => id === party.id);
}




async function addParty(event) {
    event.preventDefault();
    try {
        const date = new Date(addPartyForm.date.value).toISOString();
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            name: addPartyForm.name.value,
            description: addPartyForm.description.value,
            date: date,
            location: addPartyForm.location.value
          })
        });
        if(!response.ok)
          throw new Error("Failed to create party");
        render();
      } catch (error) {
        console.error(error);
      }
}

async function deleteParty(id) {
  try {
    const response = await fetch(API_URL+`/${id}`, {
      method: "DELETE"
    });
    if(!response.ok)
          throw new Error("Failed to delete party");
        render();
  } catch (error){
    console.error(error);
  }
}

async function getParties() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.parties = json.data;
    } catch (error) {
        console.error(error);
    }
}

function renderParties() {
    if (!state.parties.length) {
        partyList.innerHTML = "<li>No Parties.</li>";
        return;
      }
    
    const $parties = state.parties.map((party) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <h2>${party.name}</h2>
          <button>Delete</button>
        `;
        const deleteButton = li.querySelector("button");
        deleteButton.addEventListener("click", () => deleteParty(party.id));
        li.addEventListener("click", (_event) => {
          setParty(party);
          renderSelected();
        });
        return li;
      });
      partyList.replaceChildren(...$parties);
}

function renderSelected() {
  const selected = document.querySelector("article.selected_party");
  if(!state.parties.includes(state.selectedParty)){
    selected.innerHTML = ``;
    return;
  }
  selected.innerHTML = `
    <h2>${state.selectedParty.name}</h2
    <h2>${state.selectedParty.name}</h2>
    <p>${state.selectedParty.description}</p>
    <p>${state.selectedParty.date}</p>
    <p>${state.selectedParty.location}</p>
    `;
}

async function render() {
    await getParties();
    renderParties();
    hashParty();
    renderSelected();
}

render();
addPartyForm.addEventListener("submit", addParty);

