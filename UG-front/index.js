let curr = new Date();
let firstDay;
let lastDay;
$(document).ready(function () {
    $("#event-form").submit(function (event) {
        let formData = {
            name: $("#InputName").val(),
            place: $("#InputPlace").val(),
            description: $("#InputDescription").val(),
            color: $("#InputColor").val(),
            date_start: $("#InputDateStart").val(),
            date_end: $("#InputDateEnd").val(),
            event_color: $("#InputColor").val(),
        };

        $.ajax({
            type: "POST",
            url: "http://api.ug-zadanie.local:8080/includes/event.inc.php",
            data: formData,
            dataType: "json",
            encode: true,
        }).done(function (data) {
            clearEvents();
            getDate();
            getEvents();
        });

        event.preventDefault();
    });
    getEvents();
});

function getEvents() {
    let currentTimestamp = Math.floor(curr.getTime() / 1000);

    $.ajax({
        type: "GET",
        url: "http://api.ug-zadanie.local:8080/includes/event.inc.php?timestamp=" + currentTimestamp,
        dataType: "json",
        encode: true,
    }).done(function (data) {
        let events = data;
        events.forEach(function (event, index) {
            let eventStart = new Date(Date.parse(event.date_start));
            let eventEnd = new Date(Date.parse(event.date_end));
            let dayOfWeek = eventStart.getDay(); // Get the day of the week as a number (0 for Sunday, 1 for Monday, etc.)
            let hoursStart = eventStart.getHours();
            let duration = (eventEnd - eventStart) / 3600000;
            dayOfWeek = dayOfWeek + 1;
            if(eventStart.getTime() < firstDay.getTime()){
                dayOfWeek = 1;
            }
            let dayElement = $('.day-element:nth-of-type(' + dayOfWeek + ')');
            let eventContainer = dayElement.find('.event-container');
            let eventBar = $('<div class="event-bar" ' + 'data-name="' + event.name + '" ' + 
            'data-place="' + event.place + '" '  + 
            'data-description="' + event.description + '" ' + 
            'data-timestart="' + event.date_start + '" ' + 
            'data-timeend="' + event.date_end + '" ' + 
            'data-color="' + event.color + '" ' + 
            'data-id="' + event.id + '" ' + 
            'onClick="editShow(this)"' + '>' + event.name + '</div>').css({
                'top': (index) * 24 + 'px',
                'left': hoursStart * 6 + 'px',
                'background-color': event.color,
                'width': 6 * duration + 'px'
            });
            if((eventStart.getTime() < firstDay.getTime()) && (lastDay.getTime() > eventEnd.getTime())){
                let leftoverDuration = (eventEnd.getTime() - firstDay.getTime()) / 3600000;
                eventBar.css({
                    'left': '0px',
                    'width': 6 * leftoverDuration + 'px'
                })
            }
            if((eventStart.getTime() < firstDay.getTime()) && (lastDay.getTime() < eventEnd.getTime())){
                let leftoverDuration = (eventEnd.getTime() - firstDay.getTime()) / 3600000;
                eventBar.css({
                    'left': '0px',
                    'width': 6 * leftoverDuration + 'px'
                })
            }

            eventContainer.append(eventBar);
        });
    });
}

function editShow(element) {
    // Get the event details from the clicked element
    let eventID = $(element).data('id')
    let eventName = $(element).data('name');
    let eventPlace = $(element).data('place');
    let eventDesc = $(element).data('description');
    let eventTimestart = $(element).data('timestart');
    let eventTimeend = $(element).data('timeend');
    let eventColor = $(element).data('color');
    // You may need to fetch additional event details here based on your requirements
    // Populate the edit event form fields
    $("#editEventModal #editEventModalLabel").text("Edytuj wydarzenie: ID " + eventID);
    $("#editEventForm #InputName").val(eventName);
    $("#editEventForm #InputPlace").val(eventPlace);
    $("#editEventForm #InputDescription").val(eventDesc);
    $("#editEventForm #InputDateStart").val(eventTimestart);
    $("#editEventForm #InputDateEnd").val(eventTimeend);
    $("#editEventForm #InputColor").val(eventColor);
    // Populate other form fields based on your event data

    // Open the edit event modal
    $("#editEventModal").modal('show');
}

function saveEditedEvent() {
    // Add your logic here to save the edited event details
    // You can use the data from the edit event form fields (e.g., $("#editEventForm #InputName").val()) to update the event
    let eventID = $("#editEventModalLabel").text().replace("Edytuj wydarzenie: ID ", "");

    // Get the updated event details from the edit event form fields
    let updatedFormData = {
        name: $("#editEventForm #InputName").val(),
        place: $("#editEventForm #InputPlace").val(),
        description: $("#editEventForm #InputDescription").val(),
        date_start: $("#editEventForm #InputDateStart").val(),
        date_end: $("#editEventForm #InputDateEnd").val(),
        color: $("#editEventForm #InputColor").val(),
    };
    // Close the edit event modal
    $("#editEventModal").modal('hide');

    // Make a PUT request to update the event
    $.ajax({
        type: "PUT",
        url: "http://api.ug-zadanie.local:8080/includes/event.inc.php?id=" + eventID,
        data: JSON.stringify(updatedFormData),
        dataType: "json",
        encode: true,
    }).done(function (data) {
        // Close the edit event modal
        console.log(JSON.stringify(updatedFormData));
        $("#editEventModal").modal('hide');

        // Optionally, you may want to refresh the events on the calendar after saving the changes
        clearEvents();
        getEvents();
    });
}

function getDate() {
    for (let i = 0; i < 7; i++) {
        let dayElement = $(".day-element:eq(" + i + ")");
        let dayValue = new Date(curr.setDate(curr.getDate() + i - curr.getDay()));
        let first = curr.getDate() - curr.getDay();
        firstDay = new Date(curr.setDate(first));
        firstDay.setHours(0, 0, 0, 0,);
        lastDay = new Date(curr.setDate(curr.getDate() + 6));
        lastDay.setHours(24, 0, 0, 0);
        // Update the day value in the HTML
        dayElement.find(".day-value").text(dayValue.getDate());
    }

}

function clearEvents() {
    $(".event-bar").remove();
}
function nextWeek() {
    curr.setDate(curr.getDate() + 7);
    clearEvents();
    getDate();
    getEvents();
}
function prevWeek() {
    curr.setDate(curr.getDate() - 7);
    clearEvents();
    getDate();
    getEvents();
}

getDate();