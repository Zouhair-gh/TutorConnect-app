import React from "react";
import { Link } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const SessionCalendar = ({ sessions, roomId }) => {
    const events = sessions.map(session => ({
        id: session.id,
        title: session.title,
        start: new Date(session.startTime),
        end: new Date(session.endTime),
        status: session.status,
        type: session.sessionType
    }));

    const eventStyleGetter = (event) => {
        const backgroundColor = {
            SCHEDULED: '#0d6efd',
            IN_PROGRESS: '#ffc107',
            COMPLETED: '#198754',
            CANCELLED: '#dc3545',
            RESCHEDULED: '#0dcaf0'
        }[event.status];

        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                color: 'white',
                border: 'none'
            }
        };
    };

    return (



        <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600 }}
                    eventPropGetter={eventStyleGetter}
                    onSelectEvent={(event) => {
                        window.location.href = `/tutor/rooms/${roomId}/sessions/${event.id}`;
                    }}
                    components={{
                        event: ({ event }) => (
                            <div className="p-1">
                                <strong>{event.title}</strong>
                                <div className="small">{event.type}</div>
                            </div>
                        )
                    }}
                />
            </div>
        </div>
    );
};

export default SessionCalendar;