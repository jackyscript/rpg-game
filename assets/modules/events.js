export var occuredEvents = JSON.parse(localStorage.getItem('occuredEvents'));
if (!occuredEvents) {
    occuredEvents = {
        "isHouseEntered": false
    }
}