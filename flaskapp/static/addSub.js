

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

    // Send listofSubs to Flask <--- added this
    $.post( "http://127.0.0.1:5000/addsub", {
        sub_data: (JSON.stringify(listOfSubs))
    });

    // // Get subs from Flask <--- not sure if this works yet
    // $.get("http://127.0.0.1:5000/data", function(data) {
    //     console.log($.parseJSON(data))
    // })
}

/* adds listOfSubs to local storage */
// INPUT: none
// OUTPUT: none 
function updateTable(){
    localStorage.setItem("subs",JSON.stringify(listOfSubs))
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


