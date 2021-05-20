/* GLOBALS 
----------------------------------------------------------------------------*/
let listOfSubs = []
let subdata = []
let id = 0
let editID = 0
let editCard = null

let listOfCards = document.querySelector(".card-container")
let newSubModal = document.querySelector("#new-sub-modal")
let editModal = document.querySelector("#edit-modal")
let closeBtns = document.querySelectorAll(".close-btn")
let submitBtn = document.querySelector("#submit-button")
let newSubBtn = document.querySelector("#new-sub-button")
let saveBtn = document.querySelector("#save-button")
let deleteAllBtn = document.querySelector("#delete-all-button")
getServerData()
let sortBtn = document.querySelector("#sort-button")


/* EVENT LISTENERS
---------------------------------------------------------------------------*/
for (const button of closeBtns) {
    button.addEventListener('click', closeModalBtn)}
window.addEventListener("click",closeModalWindow)
submitBtn.addEventListener("click",newSubscription)
newSubBtn.addEventListener("click",displaySubModal)
saveBtn.addEventListener("click",saveSubscription)
deleteAllBtn.addEventListener("click",delAllSub)
sortBtn = document.addEventListener("click",sortCardsName)

/* FUNCTIONS
----------------------------------------------------------------------------*/

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
    editModal.style.display = "none"
}

/* Hides the modal popup if background is clicked*/
function closeModalWindow(event){
    if(event.target === newSubModal || event.target === editModal){
        newSubModal.style.display = "none"
        editModal.style.display = "none"
    }
  }

/* Confirmation Box for Delete All Subs*/
function delAllSub(){
    var confirmation = confirm("Delete All Subscriptions?")
    if (confirmation == true){
        clearSubs()
    }
}

/* HTTP REQUESTS
----------------------------------------------------------------------------*/

/* adds listOfSubs and id to Flask via HTTP POST */
// INPUT: none
// OUTPUT: none 
function newSubStorage(){
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:5000/addsub',
        data: JSON.stringify({subs:listOfSubs,id:id}),
        success: function(data) { alert('data: ' + data); },
        contentType: "application/json",
        dataType: 'json'
    });
}


/* Deletes Subscription object from Flask via HTTP POST */
// INPUT: id (int)
// OUTPUT: none 
function deleteStorage(id){
    // Send listofSubs to Flask
    $.post('http://127.0.0.1:5000/delsub',{num:id})
}

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

/* Updates Subscription object from Flask via HTTP POST */
// INPUT: Subscription (object)
// OUTPUT: none 
function updateStorage(sub){
    // $.post('http://127.0.0.1:5000/upsub',)
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:5000/upsub',
        data: JSON.stringify(sub),
        success: function(data) { alert('data: ' + data); },
        contentType: "application/json",
        dataType: 'json'
    });
}

/* Clears subs.json file from Flask via HTTP POST */
// INPUT: none
// Output: none
function clearSubs(){
    $.post('http://127.0.0.1:5000/clear', function(){
        window.location.reload()
    });
}


/* CARDS
----------------------------------------------------------------------------*/

/* Populates Cards Container with data from listOfSubs */
// INPUT: none
// OUTPUT: none
function updateCards(){
    for (const sub of listOfSubs){
        insertCard(sub)
    }

}

/* Inserts a card to listOfCards according to the given Subscription */
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
    button.addEventListener("click",editSubscription)
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
    newSubStorage()
    closeModalBtn()
}




/* Clears all fields in the submission form */
// INPUT: none
// OUTPUT: none 
function clearForm(form){
    form.reset()
}

/* Checks which radio button is selected and returns appropriate period as string */
// INPUT: none
// OUTPUT: "year" "month"
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
    let id = parseInt(card.firstElementChild.firstElementChild.innerHTML)
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

/* EDIT / UPDATE
----------------------------------------------------------------------------*/

/* Pulls up information for editing subscription. Implementation for EDIT button */
// INPUT: none
// OUTPUT: none 
function editSubscription(event){
    displayEditModal()
    let buttons = event.target.parentElement
    let card = buttons.parentElement
    let id = card.firstElementChild.firstElementChild.innerHTML
    let name = card.firstElementChild.lastElementChild.innerHTML
    let cost = card.children[2].firstElementChild.innerHTML.substring(1)
    let period = card.children[2].lastElementChild.innerHTML
    let date = card.children[1].lastElementChild.innerHTML
    editCard = card
    
    document.querySelector("#edit-name").value = name
    document.querySelector("#edit-cost").value = cost
    document.querySelector("#edit-date").value = date
    let edityear = document.querySelector("#edit-yearly").checked
    if (period == "/year") {
        edityear = "checked"
    }
    editID = parseInt(id)
}

/* Saves information for editing subscription. Implementation for SAVE button */
// INPUT: none
// OUTPUT: none 
function saveSubscription(){
    let editname = document.querySelector("#edit-name").value
    let editcost = parseFloat(document.querySelector("#edit-cost").value).toFixed(2)
    let editdate = document.querySelector("#edit-date").value
    let editperiod = getPeriodEdit()
    for(sub of listOfSubs){
        if (sub.id === editID){
            sub.id = editID
            sub.name = editname
            sub.cost = editcost
            sub.date = editdate
            sub.period = editperiod
            updateStorage(sub)
        }
    }
    card = editCard
    let name = card.firstElementChild.lastElementChild.innerHTML = editname
    let cost = card.children[2].firstElementChild.innerHTML = '$'+editcost
    let period = card.children[2].lastElementChild.innerHTML = '/' + editperiod
    let date = card.children[1].lastElementChild.innerHTML = editdate
    
}

/* Checks which radio button is selected and returns appropriate period as string */
// INPUT: none
// OUTPUT: "year" "month"
function getPeriodEdit(){
    result = "monthly"
    let yearly = document.querySelector("#edit-yearly").checked
    let monthly = document.querySelector("#edit-monthly").checked
    if (yearly) result = "year"
    else if (monthly) result = "month"
    return result
}

/* TOTAL COST
----------------------------------------------------------------------------*/
/* Returns total cost of all subscriptions in the list */
// INPUT: none
// OUTPUT: Float
function totalCost(){
    let cardContainer = document.querySelector(".card-container")
    let cards = cardContainer.children
    let result = 0
    for (const card of cards){
        let cost = parseFloat(card.children[2].firstElementChild.innerHTML.substring(1))
        result += cost
    }
    return result
}

/* SORT
----------------------------------------------------------------------------*/

function sortCardsName(){
    let cardContainer = document.querySelector(".card-container")
    let cards = cardContainer.children
    let unsorted = true
    let switch_flag = false
    let i = 0;
    while(unsorted){
        unsorted = false;
        for (i = 0; i < (cards.length - 1); i++){
            switch_flag = false;
            let title1 = cards[i].children[0].lastElementChild.innerHTML.toLowerCase()
            let title2 = cards[i+1].children[0].lastElementChild.innerHTML.toLowerCase()

            if (title1 > title2){
                switch_flag = true;
                break;
            }
        }
        if (switch_flag) {
            cardContainer.insertBefore(cards[i + 1], cards[i]);
            unsorted = true;
        }
    } 
}

function sortCardsCost(){
    let cardContainer = document.querySelector(".card-container")
    let cards = cardContainer.children
    let unsorted = true
    let switch_flag = false
    let i = 0;
    while(unsorted){
        unsorted = false;
        for (i = 0; i < (cards.length - 1); i++){
            switch_flag = false;
            let cost1 = parseFloat(cards[i].children[2].firstElementChild.innerHTML.substring(1))
            let cost2 = parseFloat(cards[i+1].children[2].firstElementChild.innerHTML.substring(1))

            if (cost1 > cost2){
                switch_flag = true;
                break;
            }
        }
        if (switch_flag) {
            cardContainer.insertBefore(cards[i + 1], cards[i]);
            unsorted = true;
        }
    } 
}