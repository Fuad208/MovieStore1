import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';

class ReservationsCalendar extends Component {
  static propTypes = {
    reservations: PropTypes.array.isRequired,
    movies: PropTypes.array.isRequired,
    cinemas: PropTypes.array.isRequired
  };

  static defaultProps = {
    reservations: [],
    movies: [],
    cinemas: []
  };

  onFindAttr = (id, list, attr) => {
    const item = list.find(item => item._id === id);
    return item ? item[attr] : `Not ${attr} Found`;
  };

  render() {
    const { reservations, cinemas, movies } = this.props;

    const events = reservations.map(reservation => ({
      id: reservation._id,
      title: `Movie: ${this.onFindAttr(
        reservation.movieId,
        movies,
        'title'
      )} - Cinema: ${this.onFindAttr(reservation.cinemaIds, cinemas, 'name')}`,
      start: reservation.date,
      startTime: reservation.startAt,
      url: `/movie/${reservation.movieId}`,
      backgroundColor: '#1976d2',
      borderColor: '#1976d2',
      textColor: '#ffffff'
    }));

    return (
      <FullCalendar
        defaultView="dayGridMonth"
        header={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        events={events}
        eventClick={(info) => {
          if (info.event.url) {
            info.jsEvent.preventDefault();
            window.open(info.event.url);
          }
        }}
        editable={false}
        droppable={false}
        height="auto"
      />
    );
  }
}

export default ReservationsCalendar;