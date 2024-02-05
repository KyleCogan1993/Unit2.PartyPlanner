const COHORT = "2401-fsa-et-web-ft-sf";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;


state = {
    parties: []
};
const partyList = document.querySelector("#parties");
const addPartyForm = document.querySelector("#addParty");


async function addParty(event) {
    event.preventDefault();
    try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            name: addPartyForm.name.value,
            description: addPartyForm.description.value,
            date: addPartyForm.date.value,
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

function deleteParty() {

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
        partyList.innerHTML = "<li>No artists.</li>";
        return;
      }
    
    const $parties = state.parties.map((party) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <h2>${party.name}</h2>
          <p>${party.description}</p>
          <p>${party.date}</p>
          <p>${party.location}</p>
        `;
        return li;
      });
      partyList.replaceChildren(...$parties);
}

async function render() {
    await getParties();
    renderParties();
}

render();
addPartyForm.addEventListener("submit", addParty);

