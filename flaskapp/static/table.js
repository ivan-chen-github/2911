/* GLOBALS 
----------------------------------------------------------------------------*/
let listOfSubs = []
let table = document.querySelector("table")
let subdata = []




    // // Get subs from Flask <--- not sure if this works yet
    $.get("http://127.0.0.1:5000/data").done(function(data){
        listOfSubs = data["subs"]
        updateTable()
    })
    


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
    let id = parseInt(row.cells[0].innerHTML)
    for (const e of listOfSubs){
        if(e.id === id){
            i = listOfSubs.indexOf(e)
            listOfSubs.splice(e,1)
        }
    }
    updateStorage()

}

/* adds listOfSubs and id to local storage */
// INPUT: none
// OUTPUT: none 
function updateStorage(){
    localStorage.setItem("subs",JSON.stringify(listOfSubs))
    // Send listofSubs to Flask <--- added this
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:5000/addsub',
        data: JSON.stringify({subs:listOfSubs}),
        success: function(data) { alert('data: ' + data); },
        contentType: "application/json",
        dataType: 'json'
    });
}