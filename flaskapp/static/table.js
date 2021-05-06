/* GLOBALS 
----------------------------------------------------------------------------*/
let listOfSubs = JSON.parse(localStorage.getItem("subs"))
let table = document.querySelector("table")

updateTable()

/* Populates table with data from listOfSubs */
// INPUT: Subscription(object)
// OUTPUT: none 
function updateTable(){
    for (const sub of listOfSubs){
        insertEntry(sub)
    }

}

/* Inserts a row according to the given Subscription for the table */
// INPUT: Subscription(object)
// OUTPUT: none 
function insertEntry(sub){
    let row = table.insertRow(-1) // Firefox and Opera require a parameter(-1). Other browsers do not.
    let statusCell = row.insertCell(0)
    let nameCell = row.insertCell(1)
    let costCell = row.insertCell(2)
    let dateCell = row.insertCell(3)
    statusCell.innerHTML = sub.id // Placeholder default for now
    nameCell.innerHTML = sub.name
    costCell.innerHTML = sub.cost.toFixed(2)
    dateCell.innerHTML = sub.date
    addButtons(row)
}

/* Adds edit, notes, and delete button to table row  */
// INPUT: <tr> (HTML)
// OUTPUT: none 
function addButtons(row){
    let cell = row.insertCell(4)
    cell.appendChild(createDeleteBtn())
    // let notesBtn = "<button onclick=\"window.location.href='note.html';\" id=notes-btn>notes</button>"
    // let editBtn = "<button onclick=\"window.location.href='new.html';\" id=edit-btn>edit</button>"
    // cell.insertAdjacentHTML("afterbegin",notesBtn + editBtn)
}

/* Creates a delete button and returns its reference */
// INPUT: none
// OUTPUT: <button> (HTML)
function createDeleteBtn(){
    let button = document.createElement("button")
    button.id = "delete-btn"
    button.innerHTML = "delete"
    button.addEventListener("click",removeRow)
    return button
}

/* Deletes a subscription row according to click event */
// INPUT: none
// OUTPUT: none
function removeRow(event){
    let cell = event.target.parentElement
    let row = cell.parentElement
    removeSub(row)
    table.deleteRow(row.rowIndex)
}

/* Deletes a subscription from listOfSubs */
// INPUT: none
// OUTPUT: none
function removeSub(row){
    let id = row.cells[0]
    for (const e of listOfSubs){
        if(e.id === id){
            i = listOfSubs.indexOf(e)
            listOfSubs.splice(e,1)
        }
    }
    console.log("hi)")
    updateStorage()

}

/* adds listOfSubs and id to local storage */
// INPUT: none
// OUTPUT: none 
function updateStorage(){
    localStorage.setItem("subs",JSON.stringify(listOfSubs))
}