/* GLOBALS 
----------------------------------------------------------------------------*/
let listOfSubs = []
let subdata = []
let id = 0

let listOfCards = document.querySelector(".card-container")
let newSubModal = document.querySelector("#new-sub-modal")
let editModal = document.querySelector("#edit-modal")
let closeBtn = document.querySelector(".close-btn")
let submitBtn = document.querySelector("#submit-button")
let newSubBtn = document.querySelector("#new-sub-button")
getServerData()


/* EVENT LISTENERS
---------------------------------------------------------------------------*/

closeBtn.addEventListener("click",closeModalBtn)
window.addEventListener("click",closeModalWindow)
submitBtn.addEventListener("click",newSubscription)
newSubBtn.addEventListener("click",displaySubModal)

/* FUNCTIONS
----------------------------------------------------------------------------*/

/* HTTTP GET Request for latest data. Updates globals. */ 
function getServerData(){
    $.get("http://127.0.0.1:5000/data").done(function(data){
        listOfSubs = data["subs"]
        let uid = data["id"]
        if (!uid) id = 0
        else id = uid
        updateCards()
    })
}

/* Displays the modal popup box*/ 
function displayEditModal(){
    editModal.style.display = "block"
}

/* Displays the modal popup box*/ 
function displaySubModal(){
    newSubModal.style.display = "block"
}

/* Hides the modal popup box*/ 
function closeModalBtn(){
    newSubModal.style.display = "none"
}


/* Hides the modal popup if background is clicked*/
function closeModalWindow(event){
    if(event.target === newSubModal){
        newSubModal.style.display = "none"
    }
  }





/* TABLE
----------------------------------------------------------------------------*/

/* Populates table with data from listOfSubs */
// INPUT: none
// OUTPUT: none
function updateCards(){
    for (const sub of listOfSubs){
        insertCard(sub)
    }

}

/* Inserts a row according to the given Subscription for the table */
// INPUT: Subscription(object)
// OUTPUT: none 
function insertCard(sub){
    let card = createCard(sub)
    listOfCards.appendChild(card)
}

/* Constructs an entire Card with its elements according to given Sub object */
// INPUT: Subscription(object)
// OUTPUT: none 
function createCard(sub){
    let card = document.createElement("div")
    card.className = "card"

    let header = document.createElement("header")
    header.className = "card-header"
    header.insertAdjacentHTML("beforeend",'<div class="uid">'+sub.id+'</div><img width="100" src="" alt="sub pic here"><h2 class="card-title">'+sub.name+'</h2>')
    card.appendChild(header)

    let date = document.createElement("div")
    date.className = "date-container"
    date.insertAdjacentHTML("beforeend",'<span class="date">'+sub.date+'</span>')
    card.appendChild(date)

    let price = document.createElement("div")
    price.className = "price-container"
    price.insertAdjacentHTML("beforeend",'<span class="price">$'+sub.cost+'</span><span class="period">/'+sub.period+'</span>')
    card.appendChild(price)

    let buttons = document.createElement("div")
    buttons.className = "card-button-container"
    buttons.appendChild(createEditBtn())
    buttons.appendChild(createDeleteBtn())
    card.appendChild(buttons)

    return card
}


/* Creates an edit button and returns its reference */
// INPUT: none
// OUTPUT: <button> (HTML)
function createEditBtn(){
    let button = document.createElement("button")
    button.className = "edit-button"
    button.innerHTML = "edit"
    button.addEventListener("click",displayEditModal)
    return button
}


/* Creates a delete button and returns its reference */
// INPUT: none
// OUTPUT: <button> (HTML)
function createDeleteBtn(){
    let button = document.createElement("button")
    button.className = "delete-button"
    button.innerHTML = "&times;"
    button.addEventListener("click",removeCard)
    return button
}


/* ADD SUB
----------------------------------------------------------------------------*/

/* Creates a new subscription. Implementation for new subscription button */
// INPUT: none
// OUTPUT: none 
function newSubscription(){
    id++
    let name = document.querySelector("#new-sub-name").value
    let cost = parseFloat(document.querySelector("#new-sub-cost").value).toFixed(2)
    let period = getPeriod()
    let date = document.querySelector("#new-sub-date").value
    let sub = createSub(id,name,cost,period,date)

    let form = document.querySelector("#new-sub-form")
    clearForm(form)
    addSubsList(sub)
    insertCard(sub)
    updateStorage()
}

function clearForm(form){
    form.reset()
}


/* Clears all fields in the submission form */
// INPUT: none
// OUTPUT: none 

/* Checks which radio button is selected and returns appropriate period as string */
// INPUT: name(string) cost(float) period(string) date(Date)
// OUTPUT: "yearly" "monthly"
function getPeriod(){
    result = "monthly"
    let yearly = document.querySelector("#new-sub-yearly").checked
    let monthly = document.querySelector("#new-sub-monthly").checked
    if (yearly) result = "year"
    else if (monthly) result = "month"
    return result
}

/* Creates a Subscription Object and returns its reference. */
// INPUT: id(number) name(string) cost(float) period(string) date(string)
// OUTPUT: Subscription(object)
function createSub(id,name, cost, period, date){
    let sub = {
        id,
        name,
        cost,
        period,
        date
    }
    return sub
}

/* Given a subscription object, only push to listOfSubs global if it's unique (name/cost check only) */
// INPUT: Subscription(object)
// OUTPUT: none 
function addSubsList(sub){
    let exists = 0
    for (e of listOfSubs){
        if(e.name === sub.name && e.cost == sub.cost){
            exists = 1         
        }
    }
    if (!exists) {
        listOfSubs.push(sub)  
    }
}

/* DELETE SUB
----------------------------------------------------------------------------*/

/* Deletes a subscription row according to click event */
// INPUT: none
// OUTPUT: none
function removeCard(event){
    let buttons = event.target.parentElement
    let card = buttons.parentElement
    let id = card.firstElementChild.firstElementChild
    removeSub(id)
    card.remove()
}

/* Deletes a subscription from listOfSubs and Flask if they exist*/
// INPUT: none
// OUTPUT: none
function removeSub(id){
    for (const e of listOfSubs){
        if(e.id === id){
            i = listOfSubs.indexOf(e)
            listOfSubs.splice(i,1)
            deleteStorage(id)
        }
    }
}



/* adds listOfSubs and id to Flask via HTTP POST */
// INPUT: none
// OUTPUT: none 
function updateStorage(){
    // Send listofSubs to Flask
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:5000/addsub',
        data: JSON.stringify({subs:listOfSubs,id:id}),
        success: function(data) { alert('data: ' + data); },
        contentType: "application/json",
        dataType: 'json'
    });
}


/* Delets Subscription object from Flask via HTTP POST */
// INPUT: id (int)
// OUTPUT: none 
function deleteStorage(id){
    // Send listofSubs to Flask
    $.post('http://127.0.0.1:5000/delsub',{num:id})
}
