

/* GLOBALS 
----------------------------------------------------------------------------*/
let listOfSubs = []
let submitBtn = document.querySelector("#submit-button")
let id = retrieveID()


/* EVENT LISTENERS
----------------------------------------------------------------------------*/
submitBtn.addEventListener("click",newSubscription)




/* FUNCTIONS / METHODS
----------------------------------------------------------------------------*/

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

    // Send sub to Flask
    $.post( "http://127.0.0.1:5000/addsub", {
        sub_data: (JSON.stringify(sub))
    });

    // // Get subs from Flask <--- not sure if this works yet
    // $.get("http://127.0.0.1:5000/data", function(data) {
    //     console.log($.parseJSON(data))
    // })

}

/* adds listOfSubs and id to local storage */
// INPUT: none
// OUTPUT: none 
function updateStorage(){
    localStorage.setItem("subs",JSON.stringify(listOfSubs))
    localStorage.setItem("id",id)
}

/* Retrieve ID from local storage and sets it global. If it doesn't exist,
set id = 0 */
// INPUT: none
// OUTPUT: none 
function retrieveID(){
    let result = localStorage.getItem("Id")
    if (!result){
        return 0
    }
    else {return result}
}

/* Given a subscription object, only push to listOfSubs global if it's unique (name/cost check only) */
// INPUT: Subscription(object)
// OUTPUT: none 
function addSubsList(sub){
    let exists = 0
    for (e of listOfSubs){
        if(e.name === sub.name && e.cost == sub.cost){
        exists = 1}
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


