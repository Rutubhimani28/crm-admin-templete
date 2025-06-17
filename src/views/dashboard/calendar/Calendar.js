import React, { Fragment, useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
import '@styles/react/apps/app-calendar.scss';

import TaskSidebar from './TaskSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks } from '../../../redux/task';
import { useSkin } from "@hooks/useSkin";


const CalendarComponent = () => {
    const { skin } = useSkin();  
  const calendarRef = useRef(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const dispatch = useDispatch();
  const taskList = useSelector((state) => state?.task);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  useEffect(() => {
    dispatch(getTasks({
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
    }));

    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
    }
  }, [dispatch]);

  useEffect(() => {
    if (taskList && taskList.data) {
      const calendarEvents = taskList.data.map(task => ({
        id: task._id,
        title: task.title || 'Untitled',
        priority: task.priority || 'Medium',
        start: task.startDate,
        end: task.deadLine,
        // backgroundColor: getPriorityColor(task.priority),
        backgroundColor: 'rgba(115, 103, 240, 0.3)',
        // borderColor: getPriorityColor(task.priority),
        borderColor: "rgba(115, 103, 240, 0.3)",
        textColor: getPriorityColor(task.priority, true)
      }));
      setEvents(calendarEvents);
    }
  }, [taskList]);

  const getPriorityColor = (priority, text) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'rgba(255, 107, 107, 0.3)';     // Red-ish
      case 'medium':
        return 'rgba(255, 168, 0, 0.3)';      // Amber
      case 'low':
        return 'rgba(0, 201, 167, 0.3)';      // Green/Teal
      default:
        return 'rgba(115, 103, 240, 0.3)';    // Purple fallback
    }
  };

  const handleDateClick = (info) => {
    const clickedDate = info.dateStr;
    const emptyTask = {
      title: '',
      description: '',
      status: '',
      priority: '',
      startDate: clickedDate,
      deadLine: clickedDate,
      assignToName: ''
    };
    setSelectedTask(emptyTask);
    setSidebarOpen(true);
  };

  return (
    <div style={{ backgroundColor: skin === 'dark' ? '#283046' : '#ffffff' }}>
      <Fragment>
        <div className='app-calendar m-0 border'>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              start: 'prev,next today',
              center: 'title',
              end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            }}
            views={{
              dayGridMonth: { buttonText: 'Month' },
              timeGridWeek: { buttonText: 'Week' },
              timeGridDay: { buttonText: 'Day' },
              listMonth: { buttonText: 'List' }
            }}
            editable={true}
            selectable={true}
            dateClick={handleDateClick}
            events={events}
            eventContent={(eventInfo) => (
              <div style={{ padding: '2px 4px' }}>
                <div style={{
                  fontWeight: 'bold',
                  // fontSize: '0.9rem',
                  marginBottom: '2px',
                  color: '#fff'
                }}>
                  {eventInfo.event.title}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#000',
                  backgroundColor: getPriorityColor(eventInfo.event.extendedProps.priority),
                  padding: '1px 6px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {eventInfo.event.extendedProps.priority}
                </div>
              </div>
            )}
          />
          <TaskSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            task={selectedTask}
          />
        </div>
      </Fragment>
    </div>
  );
};

export default CalendarComponent;
