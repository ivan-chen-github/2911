// Method to send data from js to Flask (not sure if it works yet)
// $.post( "/addsub", {
//     sub_data: JSON.stringify(outputData)
//   }


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
    let cost = document.querySelector("#cost-form").value
    let period = getPeriod()
    let date = document.querySelector("#billedDate").value
    listOfSubs.push(createSub(name,cost,period,date))
}

/* Checks which radio button is selected and returns appropriate period as string */
// INPUT: name(string) cost(float) period(string) date(Date)
// OUTPUT: "yearly" or "monthly". "monthly" is default
function getPeriod(){
    result = "monthly"
    let yearly = document.querySelector("#yearly").checked
    let monthly = document.querySelector("#monthly").checked
    if (yearly) result = "yearly"
    else if (monthly) result = "monthly"
    return result

}

/* Creates a Subscription Object and returns its reference. */
// INPUT: name(string) cost(float) period(string) date(Date)
// OUTPUT: Subscription (Object)
function createSub(name, cost, period, date){
    let sub = {
        name,
        cost,
        period,
        date
    }
    return sub
}


/* CGiven a subscription object, convert it to a JSON object and return */
// INPUT: Subscription (Object)
// OUTPUT: JSON Object (string)
function convertToJSON(subObject){
    return JSON.stringify(subObject)
}