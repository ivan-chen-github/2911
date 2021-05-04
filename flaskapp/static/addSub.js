

/* GLOBALS 
----------------------------------------------------------------------------*/
let listOfSubs = []
let submitBtn = document.querySelector("#submit-button")



/* EVENT LISTENERS
----------------------------------------------------------------------------*/
submitBtn.addEventListener("click",newSubscription)




/* FUNCTIONS / METHODS
----------------------------------------------------------------------------*/

/* Creates a new subscription. Implementation for new subscription button */
// INPUT: none
// OUTPUT: none 
function newSubscription(){
    let name = document.querySelector("#subscription-form").value
    let cost = parseFloat(document.querySelector("#cost-form").value)
    let period = getPeriod()
    let date = document.querySelector("#billedDate").value

    let sub = createSub(name,cost,period,date)
    addSubsList(sub)
    updateTable()
}

/* adds listOfSubs to local storage */
// INPUT: none
// OUTPUT: none 
function updateTable(){
    localStorage["listOfSubs"] = listOfSubs
}

/* Given a subscription object, only push to listOfSubs global if it's unique (name/cost check only) */
// INPUT: Subscription(object)
// OUTPUT: none 
function addSubsList(sub){
    let exists = 0
    for (e of listOfSubs){
        if(e.name === sub.name && e.cost == sub.cost)
        exists = 1
    }
    if (!exists) listOfSubs.push(sub)
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
// INPUT: name(string) cost(float) period(string) date(string)
// OUTPUT: Subscription(object)
function createSub(name, cost, period, date){
    let sub = {
        name,
        cost,
        period,
        date
    }
    return sub
}


/* Given a Subscription object, convert it to a JSON object and return */
// INPUT: Subscription (Object)
// OUTPUT: JSON Object (string)
function convertToJSON(subObject){
    return JSON.stringify(subObject)
}

