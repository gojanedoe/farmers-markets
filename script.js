// Event listener for page load
window.addEventListener("load", function () {
    console.log('Page loaded.');
    init();
});

// DOM code for page elements
function init() {
    // ENTER ZIP CODE - have data validation & errors / css changes if invalid input
    let zipcode = 20001;

    // On submit, use zip code to add to the end of fetch url
    let fetchURL = "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zipcode;

    let marketList = document.getElementById("market-list");

    fetch(fetchURL).then(function (response) {
        response.json().then(function (json) {

            json.results.forEach(market => {
                let marketName = market.marketname.slice(market.marketname.indexOf(".") + 3);
                let milesAway = market.marketname.slice(0, market.marketname.indexOf(".") + 2);
                let marketURL = "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + market.id;

                fetch(marketURL)
                    .then(response => response.json())
                    .then(data => {
                        let schedule = data.marketdetails.Schedule;
                        //console.log(schedule);

                        // slice at <br> for each different set of hours

                        let dailyHours = schedule.slice(25, schedule.indexOf(";"));
                        let season = schedule.slice(0, 25);
                        let lastUpdated = schedule.slice(6, 10);

                        marketList.innerHTML += `<li>${marketName} is ${milesAway} miles away. - Open</li>
                            <ul>
                                <li>Hours: ${dailyHours} <span class="last-updated">(last updated: ${lastUpdated})</span></li>
                                <li>Season: ${season}</span></li>
                            </ul>`;

                        checkOpen(season);

                        // green if open, black if closed???
                    });
            });
        });
    });
}

function checkOpen(season) {
    let isOpen;
    let dateFrom = season.slice(0, 10);
    let dateTo = season.slice(14, 24);
    let today = new Date().toISOString().slice(0, 10);

    // Remove dashes and other misc characters
    today = today.split("-").join("");

    dateFrom = dateFrom.split("/");
    dateFrom.unshift(dateFrom.pop()); // move last element to front
    dateFrom = dateFrom.join("");

    // if (today > dateFrom && today < dateTo) {
    //     console.log("OPEN");
    // }

    // var today = new Date();
    // var dd = String(today.getDate()).padStart(2, '0');
    // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    // var yyyy = today.getFullYear();
    //today = mm + '/' + dd + '/' + yyyy;

    console.log(today);

    //console.log(dateFrom, dateTo);

    // compare date to current date

    /*
    var dateFrom = "02/05/2013";
    var dateTo = "02/09/2013";
    var dateCheck = "02/07/2013";

    var d1 = dateFrom.split("/");
    var d2 = dateTo.split("/");
    var c = dateCheck.split("/");

    var from = new Date(d1[2], parseInt(d1[1])-1, d1[0]);  // -1 because months are from 0 to 11
    var to   = new Date(d2[2], parseInt(d2[1])-1, d2[0]);
    var check = new Date(c[2], parseInt(c[1])-1, c[0]);

    */

    //console.log(isOpen);
}