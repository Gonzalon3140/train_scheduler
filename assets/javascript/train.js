var index = 0;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDgnV0Mo5jo0-d5YAF7a0rLC1GKnDFYtj4",
    authDomain: "trainproject-330c9.firebaseapp.com",
    databaseURL: "https://trainproject-330c9.firebaseio.com",
    projectId: "trainproject-330c9",
    storageBucket: "trainproject-330c9.appspot.com",
    messagingSenderId: "1091909701701"
};
firebase.initializeApp(config);

var database = firebase.database();

console.log(database)
$("#formID").on("submit", function (event) {
    event.preventDefault();

    var name = $("#trainName").val().trim();
    var destination = $("#trainDestination").val().trim();
    var firstTime = $("#firstTrainTime").val().trim();
    var frequency = $("#frequency").val().trim();

    database.ref().push({
        name: name,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency
    });

    $("#trainName").val("");
    $("#trainDestination").val("");
    $("#firstTrainTime").val("");
    $("#frequency").val("");

    return false;
});

function removeRow() {
    $(".row-" + $(this).attr("data-index")).remove();
    database.ref().child($(this).attr("data-key")).remove();
    console.log(removeRow)

};

database.ref().on("child_added", function (snapshot) {
    let train = snapshot.val()

    var timeArr = train.firstTime.split(":");
    var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
    var maxMoment = moment.max(moment(), trainTime);
    var trainArrival;
    var trainMinutes;

    if (maxMoment === trainTime) {
        trainArrival = trainTime.format("hh:mm A");
        trainMinutes = trainTime.diff(moment(), "minutes");
    } else {

        // Calculate the minutes until arrival using hardcore math
        // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
        // and find the modulus between the difference and the frequency.
        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differenceTimes % train.frequency;
        trainMinutes = train.frequency - tRemainder;
        // To calculate the arrival time, add the tMinutes to the current time
        trainArrival = moment().add(trainMinutes, "m").format("hh:mm A");
    }
    console.log(trainArrival, trainMinutes % 60)

    $("#train-table > tbody").append("<tr><td>" + train.name + "</td><td>" + train.destination + "</td><td>" +
        train.frequency + "</td><td>" + train.firstTime + "</td><td>" + trainMinutes % 60 + "</td></tr>");
});