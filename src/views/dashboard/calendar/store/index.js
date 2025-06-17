// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Fetch Events
export const fetchEvents = createAsyncThunk('appCalendar/fetchEvents', async calendars => {
  const response = await axios.get('/apps/calendar/events', { params: { calendars } })
  return response.data
})

// ** Add Event
export const addEvent = createAsyncThunk('appCalendar/addEvent', async event => {
  const response = await axios.post('/apps/calendar/add-event', { event })
  return response.data
})

// ** Update Event
export const updateEvent = createAsyncThunk('appCalendar/updateEvent', async event => {
  const response = await axios.post('/apps/calendar/update-event', { event })
  return response.data
})

// ** Delete Event
export const deleteEvent = createAsyncThunk('appCalendar/deleteEvent', async id => {
  const response = await axios.delete('/apps/calendar/remove-event', { params: { id } })
  return response.data
})

// ** Fetch Tasks
export const fetchTasks = createAsyncThunk('appCalendar/fetchTasks', async () => {
  try {
    const response = await axios.get('/task/getTasks')
    console.log('Raw task data:', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
})

export const appCalendarSlice = createSlice({
  name: 'appCalendar',
  initialState: {
    events: [],
    selectedEvent: {},
    selectedCalendars: ['Personal', 'Business', 'Family', 'Holiday', 'ETC'],
    tasks: []
  },
  reducers: {
    selectEvent: (state, action) => {
      state.selectedEvent = action.payload
    },
    selectCalendar: (state, action) => {
      const filterIndex = state.selectedCalendars.indexOf(action.payload)
      if (filterIndex === -1) {
        state.selectedCalendars.push(action.payload)
      } else {
        state.selectedCalendars.splice(filterIndex, 1)
      }
    },
    selectAllCalendars: (state, action) => {
      const value = action.payload
      if (value === true) {
        state.selectedCalendars = ['Personal', 'Business', 'Family', 'Holiday', 'ETC']
      } else {
        state.selectedCalendars = []
      }
    },
    setEvents: (state, action) => {
      state.events = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        console.log('Processing tasks in reducer:', action.payload)

        // First, clear existing task events
        state.events = state.events.filter(event => !event.extendedProps?.isTask)

        // Convert tasks to calendar events
        const taskEvents = action.payload.map(task => {
          const event = {
            id: task._id,
            title: task.title,
            start: task.startDate,
            end: task.deadLine,
            allDay: true,
            display: 'block',
            backgroundColor: '#00ff87',
            borderColor: '#00ff87',
            textColor: '#000',
            extendedProps: {
              isTask: true,
              taskData: {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadLine: task.deadLine,
                assignToName: task.assignToName
              },
              calendar: 'Business'
            }
          }
          console.log('Created event:', event)
          return event
        })

        console.log('All task events:', taskEvents)
        state.events = [...state.events, ...taskEvents]
        state.tasks = action.payload
      })
  }
})

export const { selectEvent, selectCalendar, selectAllCalendars, setEvents } = appCalendarSlice.actions

export default appCalendarSlice.reducer
