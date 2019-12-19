import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

import AuthContext from '../context/auth-context';

import './Events.css';

class EventsPage extends Component {
  state = {
    creating: false,
    events: []
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const price = parseFloat(this.priceElRef.current.value);
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    console.log(price);

    const event = { title, price, date, description };

    const requestBody = {
      query: `
            mutation {
              createEvent(eventInput: {title: "${title}" , description: "${description}", price: ${price}, date: "${date}" }) {
                _id
                title
                description
                price
                date
                creator{
                  _id
                  email
                }
              }
            }
        `
    };

    const token = this.context.token;

    fetch('http://localhost:8000/graphql', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(requestBody)
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.fetchEvents();
      })
      .catch(err => {
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false });
  };

  fetchEvents = () => {
    const requestBody = {
      query: `
            query {
              events {
                _id
                title
                description
                price
                date
                creator{
                  _id
                  email
                }
              }
            }
        `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        const events = resData.data.events;
        this.setState({ events: events });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const eventList = this.state.events.map(event => {
      return (
        <li key={event._id} className='events__list-item'>
          {event.title}
        </li>
      );
    });

    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title='Add Event'
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
          >
            <form>
              <div className='form-control'>
                <label htmlFor='title'>Title</label>
                <input type='text' id='title' ref={this.titleElRef}></input>
              </div>
              <div className='form-control'>
                <label htmlFor='price'>Price</label>
                <input type='number' id='number' ref={this.priceElRef}></input>
              </div>
              <div className='form-control'>
                <label htmlFor='date'>Date</label>
                <input
                  type='datetime-local'
                  id='date'
                  ref={this.dateElRef}
                ></input>
              </div>
              <div className='form-control'>
                <label htmlFor='description'>Description</label>
                <textarea
                  rows='4'
                  id='description'
                  ref={this.descriptionElRef}
                ></textarea>
              </div>
            </form>
          </Modal>
        )}
        {this.context.token && (
          <div className='events-control'>
            <p>Share your own Events!</p>
            <button className='btn' onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        <ul className='events__list'>{eventList}</ul>
      </React.Fragment>
    );
  }
}

export default EventsPage;
