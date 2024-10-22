document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: [
            {
                title: 'Mathematics',
                start: new Date().toISOString().split('T')[0], // Today's date
                end: new Date().toISOString().split('T')[0],
                allDay: true
            },
            {
                title: 'Life Science',
                start: '2024-10-25',
                end: '2024-10-25',
                allDay: true
            }
        ]
    });

    calendar.render();
});
