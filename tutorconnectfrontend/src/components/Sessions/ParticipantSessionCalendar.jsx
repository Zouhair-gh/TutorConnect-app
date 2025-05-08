import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendarStyles.css';
const locales = {
    'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const ParticipantSessionCalendar = ({ sessions }) => {
    const events = sessions.map(session => ({
        id: session.id,
        title: session.title,
        start: new Date(session.startTime),
        end: new Date(session.endTime),
        status: session.status,
    }));

    const eventStyleGetter = (event) => {
        let backgroundColor = '#3174ad'; // Default blue
        if (event.status === 'COMPLETED') backgroundColor = '#28a745'; // Green
        if (event.status === 'CANCELLED') backgroundColor = '#dc3545'; // Red
        if (event.status === 'IN_PROGRESS') backgroundColor = '#ffc107'; // Yellow

        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block',
            },
        };
    };

    return (
        <div style={{ height: 700 }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventStyleGetter}
                views={['month', 'week', 'day', 'agenda']}
                defaultView="month"
            />
        </div>
    );
};

export default ParticipantSessionCalendar;