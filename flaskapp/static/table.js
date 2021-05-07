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
    let row = table.insertRow(-1) // Firefox and opera require a parameter(-1). Other browsers do not.
    let statusCell = row.insertCell(0)
    let nameCell = row.insertCell(1)
    let costCell = row.insertCell(2)
    let dateCell = row.insertCell(3)
    statusCell.innerHTML = "Active" // Placeholder default for now
    nameCell.innerHTML = sub.name
    costCell.innerHTML = sub.cost.toFixed(2)
    dateCell.innerHTML = sub.date
    addButtons(row)
}

/* Adds edit, notes, and delete button to table row  */
function addButtons(row){
    let cell = row.insertCell(4)
    let deleteBtn = "<button id=delete-btn>delete</button>"
    let notesBtn = "<button onclick=\"window.location.href='note.html';\" id=notes-btn>notes</button>"
    let editBtn = "<button onclick=\"window.location.href='new.html';\" id=edit-btn>edit</button>"
    cell.insertAdjacentHTML("afterbegin",deleteBtn + notesBtn + editBtn)
}