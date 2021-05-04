
let listOfSubs = localStorage["listOfSubs"]
let table = document.querySelector("table")


/* Adds subscription to table given a Subscription object */
// INPUT: Subscription(object)
// OUTPUT: none 
function updateTable(){
    let row = table.insertRow(-1) // Firefox and opera require a parameter(-1). Other browsers do not.
    let status = row.insertCell(0)
    let nameCell = row.insertCell(1)
    let costCell = row.insertCell(2)
    let dateCell = row.insertCell(3)
    nameCell.innerHTML = sub.name
    costCell.innerHTML = sub.cost
    dateCell.innerHTML = sub.date
}