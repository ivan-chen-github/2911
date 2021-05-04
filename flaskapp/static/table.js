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

/* Inserts a row to the table for display */
// INPUT: Subscription(object)
// OUTPUT: none 
function insertEntry(sub){
    let row = table.insertRow(-1) // Firefox and opera require a parameter(-1). Other browsers do not.
    let statusCell = row.insertCell(0)
    let nameCell = row.insertCell(1)
    let costCell = row.insertCell(2)
    let dateCell = row.insertCell(3)
    statusCell.innerHTML = "Active" // Placeholder for now
    nameCell.innerHTML = sub.name
    costCell.innerHTML = sub.cost.toFixed(2)
    dateCell.innerHTML = sub.date
}
