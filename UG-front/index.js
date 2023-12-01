let curr = new Date();
let firstDay;
let lastDay;
let numberOfEvents = 0;
let eventContainerHeight = 128;
const apiUrl = "http://api.ug-zadanie.local:8080/includes/event.inc.php";  // CHANGE THIS TO YOUR API DOMAIN/MIGHT NEED TO CHANGE PORT
$(document).ready(function () {
    renderData(); // Rendering initial data on document load
    $("#event-form").submit(function (event) { // POST
        event.preventDefault();
        let formData = {
            name: $("#InputName").val(),
            place: $("#InputPlace").val(),
            description: $("#InputDescription").val(),
            color: $("#InputColor").val(),
            date_start: $("#InputDateStart").val(),
            date_end: $("#InputDateEnd").val(),
            event_color: $("#InputColor").val(),
        };
        if(!validateAndHandle(formData)){
            return
        }
        $.ajax({
            type: "POST",
            url: apiUrl,
            data: formData,
            dataType: "json",
            encode: true,
        }).done(function (data) {
            clearForm();
            renderData();
        })
    });
});

function getEvents() {
    let currentTimestamp = Math.floor(curr.getTime() / 1000);

    $.ajax({  // GET
        type: "GET",
        url: apiUrl + "?timestamp=" + currentTimestamp,
        dataType: "json",
        encode: true,
    }).done(function (data) {
        let events = data;
        events.forEach(function (event, index) {
            numberOfEvents++;
            let eventStart = new Date(Date.parse(event.date_start));
            let eventEnd = new Date(Date.parse(event.date_end));
            let dayOfWeek = eventStart.getDay();
            let hoursStart = eventStart.getHours();
            let duration = (eventEnd - eventStart) / 3600000;
            dayOfWeek = dayOfWeek + 1;
            if (eventStart.getTime() < firstDay.getTime()) {
                dayOfWeek = 1;
            }
            let dayElement = $('.day-element:nth-of-type(' + dayOfWeek + ')');
            let eventContainer = dayElement.find('.event-container');
            let eventBar = $('<div class="event-bar" ' + 'data-name="' + event.name + '" ' +
                'data-place="' + event.place + '" ' +
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
            if ((eventStart.getTime() < firstDay.getTime()) && (lastDay.getTime() > eventEnd.getTime())) {
                let leftoverDuration = (eventEnd.getTime() - firstDay.getTime()) / 3600000;
                eventBar.css({
                    'left': '0px',
                    'width': 6 * leftoverDuration + 'px'
                })
            }
            if ((eventStart.getTime() < firstDay.getTime()) && (lastDay.getTime() < eventEnd.getTime())) {
                let leftoverDuration = (eventEnd.getTime() - firstDay.getTime()) / 3600000;
                eventBar.css({
                    'left': '0px',
                    'width': 6 * leftoverDuration + 'px'
                })
            }

            eventContainer.append(eventBar);
        });
        eventContainerHeight = numberOfEvents * 24 + 128;
        $(".event-container").css("height", eventContainerHeight + "px");
        numberOfEvents = 0;
    })
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
    // Populate the edit event form fields
    $("#editEventModal #editEventModalLabel").text("Edytuj wydarzenie: ID " + eventID);
    $("#InputEditName").val(eventName);
    $("#InputEditPlace").val(eventPlace);
    $("#InputEditDescription").val(eventDesc);
    $("#InputEditDateStart").val(eventTimestart);
    $("#InputEditDateEnd").val(eventTimeend);
    $("#InputEditColor").val(eventColor);

    // Open the edit event modal
    $("#editEventModal").modal('show');
}

function saveEditedEvent() {
    let eventID = $("#editEventModalLabel").text().replace("Edytuj wydarzenie: ID ", "");

    // Get the updated event details from the edit event form fields
    let updatedFormData = {
        name: $("#InputEditName").val(),
        place: $("#InputEditPlace").val(),
        description: $("#InputEditDescription").val(),
        date_start: $("#InputEditDateStart").val(),
        date_end: $("#InputEditDateEnd").val(),
        color: $("#InputEditColor").val(),
    };
    if(!validateAndHandleEdit(updatedFormData)){
        return
    }
    $.ajax({ // PUT request for updating a record
        type: "PUT",
        url: apiUrl + "?id=" + eventID,
        data: JSON.stringify(updatedFormData),
        dataType: "json",
        encode: true,
    }).done(function (data) {
        // Close the edit event modal
        clearEditForm();
        $("#editEventModal").modal('hide');
        renderData();
    });
}

function deleteEvent() {
    let eventID = $("#editEventModalLabel").text().replace("Edytuj wydarzenie: ID ", ""); // Pulling ID from element

    // DELETE a single record
    $.ajax({
        type: "DELETE",
        url: apiUrl + "?id=" + eventID,
        dataType: "json",
        encode: true,
    }).done(function (data) {
        clearEditForm();
        $("#editEventModal").modal('hide');
        renderData();
    });
}

function getDate() { // Need to get a date for the current week/next week functionality and also to send to backend to not pull all records ever made
    for (let i = 0; i < 7; i++) {
        let dayElement = $(".day-element:eq(" + i + ")");
        let dayValue = new Date(curr.setDate(curr.getDate() + i - curr.getDay()));
        let first = curr.getDate() - curr.getDay();
        firstDay = new Date(curr.setDate(first));
        firstDay.setHours(0, 0, 0, 0,);
        lastDay = new Date(curr.setDate(curr.getDate() + 6));
        lastDay.setHours(24, 0, 0, 0);
        // Update the day value in the HTML
        let formattedDate = dayValue.toLocaleDateString('pl', { year: 'numeric', month: 'numeric', day: 'numeric' });
        dayElement.find(".day-value").text(formattedDate);
    }

}
function validateAndHandle(formData) {
    // Event name validation
    let inputName = $("#InputName");
    if (formData.name === "") {
        inputName.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    const regexName = /^[A-Za-z\d\-\'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]*$/;
    if (!regexName.test(formData.name)) {
        inputName.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    const maxLengthName = 55;
    if (formData.name.length > maxLengthName) {
        inputName.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    inputName.removeClass("is-invalid").addClass("is-valid");
    // Place Validation
    let inputPlace = $("#InputPlace");
    const regexPlace = /^[A-Za-z\d\-\'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]*$/;
    if (!regexPlace.test(formData.place)) {
        inputPlace.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    const maxLengthPlace = 255;
    if (formData.place.length > maxLengthPlace) {
        inputPlace.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    inputPlace.removeClass("is-invalid").addClass("is-valid");
    // Description Validation
    let inputDescription = $("#InputDescription");
    const regexDescription = /^[A-Za-z\d\-\'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]*$/;
    if (!regexDescription.test(formData.description)) {
        inputDescription.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    const maxLengthDescription = 255;
    if (formData.description.length > maxLengthDescription) {
        inputDescription.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    inputDescription.removeClass("is-invalid").addClass("is-valid");
    // Date Validation
    let inputDatestart = $("#InputDateStart");
    let inputDateend = $("#InputDateEnd");
    let startDate = new Date(formData.date_start);
    let endDate = new Date(formData.date_end);
    if (!formData.date_start || !formData.date_end) {
        inputDatestart.removeClass("is-valid").addClass("is-invalid");
        inputDateend.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    if (startDate >= endDate) {
        inputDatestart.removeClass("is-valid").addClass("is-invalid");
        inputDateend.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    inputDatestart.removeClass("is-invalid").addClass("is-valid");
    inputDateend.removeClass("is-invalid").addClass("is-valid");
    // Color Validation
    let inputColor = $("#InputColor");
    const regexColor = /^#[0-9a-fA-F]{6}$/;
    if (!regexColor.test(formData.color)) {
        inputColor.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    inputColor.removeClass("is-invalid").addClass("is-valid");
    return true;
}
function validateAndHandleEdit(formData) {
    // Event name validation
    let inputName = $("#InputEditName");
    if (formData.name === "") {
        inputName.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    const regexName = /^[A-Za-z\d\-\'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]*$/;
    if (!regexName.test(formData.name)) {
        inputName.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    const maxLengthName = 55;
    if (formData.name.length > maxLengthName) {
        inputName.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    inputName.removeClass("is-invalid").addClass("is-valid");
    // Place Validation
    let inputPlace = $("#InputEditPlace");
    const regexPlace = /^[A-Za-z\d\-\'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]*$/;
    if (!regexPlace.test(formData.place)) {
        inputPlace.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    const maxLengthPlace = 255;
    if (formData.place.length > maxLengthPlace) {
        inputPlace.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    inputPlace.removeClass("is-invalid").addClass("is-valid");
    // Description Validation
    let inputDescription = $("#InputEditDescription");
    const regexDescription = /^[A-Za-z\d\-\'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]*$/;
    if (!regexDescription.test(formData.description)) {
        inputDescription.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    const maxLengthDescription = 255;
    if (formData.description.length > maxLengthDescription) {
        inputDescription.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    inputDescription.removeClass("is-invalid").addClass("is-valid");
    // Date Validation
    let inputDatestart = $("#InputEditDateStart");
    let inputDateend = $("#InputEditDateEnd");
    let startDate = new Date(formData.date_start);
    let endDate = new Date(formData.date_end);
    if (!formData.date_start || !formData.date_end) {
        inputDatestart.removeClass("is-valid").addClass("is-invalid");
        inputDateend.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    if (startDate >= endDate) {
        inputDatestart.removeClass("is-valid").addClass("is-invalid");
        inputDateend.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    inputDatestart.removeClass("is-invalid").addClass("is-valid");
    inputDateend.removeClass("is-invalid").addClass("is-valid");
    // Color Validation
    let inputColor = $("#InputEditColor");
    const regexColor = /^#[0-9a-fA-F]{6}$/;
    if (!regexColor.test(formData.color)) {
        inputColor.removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    inputColor.removeClass("is-invalid").addClass("is-valid");
    return true;
}
function clearForm(){
    $("#InputName").removeClass("is-invalid is-valid");
    $("#InputPlace").removeClass("is-invalid is-valid");
    $("#InputDescription").removeClass("is-invalid is-valid");
    $("#InputDateStart").removeClass("is-invalid is-valid");
    $("#InputDateEnd").removeClass("is-invalid is-valid");
    $("#InputColor").removeClass("is-invalid is-valid");
    $("#InputName").val('');
    $("#InputPlace").val('');
    $("#InputDescription").val('');
    $("#InputDateStart").val('');
    $("#InputDateEnd").val('');
    $("#InputColor").val("#9762F7");
}
function clearEditForm(){
    $("#InputEditName").removeClass("is-invalid is-valid");
    $("#InputEditPlace").removeClass("is-invalid is-valid");
    $("#InputEditDescription").removeClass("is-invalid is-valid");
    $("#InputEditDateStart").removeClass("is-invalid is-valid");
    $("#InputEditDateEnd").removeClass("is-invalid is-valid");
    $("#InputEditColor").removeClass("is-invalid is-valid");
    $("#InputEditName").val('');
    $("#InputEditPlace").val('');
    $("#InputEditDescription").val('');
    $("#InputEditDateStart").val('');
    $("#InputEditDateEnd").val('');
    $("#InputEditColor").val("#9762F7");
}
function clearEvents() {
    $(".event-bar").remove();
}
function nextWeek() {
    curr.setDate(curr.getDate() + 7);
    renderData();
}
function prevWeek() {
    curr.setDate(curr.getDate() - 7);
    renderData();
}

function renderData(){
    clearEvents();
    getDate();
    getEvents();
}
