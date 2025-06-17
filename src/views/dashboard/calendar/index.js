
import React, { Fragment } from 'react'
import CalendarComponent from './Calendar'

const Calendar = () => {
  return (
    <div>
      <Fragment>
        <div  className='app-calendar overflow-hidden border'>
          <CalendarComponent />
        </div>
      </Fragment>
    </div>
  )
}

export default Calendar
