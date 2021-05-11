

/* GLOBALS 
----------------------------------------------------------------------------*/
let listOfSubs = getServerData()
let submitBtn = document.querySelector("#submit-button")
let id = 0


/* EVENT LISTENERS
---------------------------------------------------------------------------*/
submitBtn.addEventListener("click",newSubscription)



/* FUNCTIONS / METHODS
----------------------------------------------------------------------------*/


function getServerData(){
        // // Get subs from Flask <--- not sure if this works yet
        $.get("http://127.0.0.1:5000/data").done(function(data){
            listOfSubs = data["subs"]
            let uid = data["id"]
            if (!uid) id = 0
            else id = uid
        })
}

/* Creates a new subscription. Implementation for new subscription button */
// INPUT: none
// OUTPUT: none 
function newSubscription(){
    let uid = id
    id++
    let name = document.querySelector("#subscription-form").value
    let cost = parseFloat(document.querySelector("#cost-form").value)
    let period = getPeriod()
    let date = document.querySelector("#billedDate").value
    let sub = createSub(id,name,cost,period,date)
    addSubsList(sub)
    updateStorage()
}

/* adds listOfSubs and id to local storage */
// INPUT: none
// OUTPUT: none 
function updateStorage(){
    // Send listofSubs to Flask <--- added this
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:5000/addsub',
        data: JSON.stringify({subs:listOfSubs,id:id}),
        success: function(data) { alert('data: ' + data); },
        contentType: "application/json",
        dataType: 'json'
    });
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

/* Checks which radio button is selected and returns appropriate period as string */
// INPUT: name(string) cost(float) period(string) date(Date)
// OUTPUT: "yearly" "monthly"
function getPeriod(){
    result = "monthly"
    let yearly = document.querySelector("#yearly").checked
    let monthly = document.querySelector("#monthly").checked
    if (yearly) result = "yearly"
    else if (monthly) result = "monthly"
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


