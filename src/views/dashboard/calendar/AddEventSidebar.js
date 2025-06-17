// // ** React Imports
// import { Fragment, useState } from 'react'

// // ** Custom Components
// import Avatar from '@components/avatar'

// // ** Third Party Components
// import { X } from 'react-feather'
// import toast from 'react-hot-toast'
// import Flatpickr from 'react-flatpickr'
// import Select, { components } from 'react-select' // eslint-disable-line
// import PerfectScrollbar from 'react-perfect-scrollbar'
// import { useForm, Controller } from 'react-hook-form'

// // ** Reactstrap Imports
// import { Button, Modal, ModalHeader, ModalBody, Label, Input, Form } from 'reactstrap'

// // ** Utils
// import { selectThemeColors, isObjEmpty } from '@utils'

// // ** Avatar Images
// import img1 from '@src/assets/images/avatars/1-small.png'
// import img2 from '@src/assets/images/avatars/3-small.png'
// import img3 from '@src/assets/images/avatars/5-small.png'
// import img4 from '@src/assets/images/avatars/7-small.png'
// import img5 from '@src/assets/images/avatars/9-small.png'
// import img6 from '@src/assets/images/avatars/11-small.png'

// // ** Styles Imports
// import '@styles/react/libs/react-select/_react-select.scss'
// import '@styles/react/libs/flatpickr/flatpickr.scss'

// const AddEventSidebar = props => {
//   // ** Props
//   const {
//     open,
//     store,
//     dispatch,
//     addEvent,
//     calendarApi,
//     selectEvent,
//     updateEvent,
//     removeEvent,
//     refetchEvents,
//     calendarsColor,
//     handleAddEventSidebar
//   } = props

//   // ** Vars & Hooks
//   const selectedEvent = store.selectedEvent,
//     {
//       control,
//       setError,
//       setValue,
//       getValues,
//       handleSubmit,
//       formState: { errors }
//     } = useForm({
//       defaultValues: { title: '' }
//     })

//   // ** States
//   const [url, setUrl] = useState('')
//   const [desc, setDesc] = useState('')
//   const [guests, setGuests] = useState({})
//   const [allDay, setAllDay] = useState(false)
//   const [location, setLocation] = useState('')
//   const [endPicker, setEndPicker] = useState(new Date())
//   const [startPicker, setStartPicker] = useState(new Date())
//   const [calendarLabel, setCalendarLabel] = useState([{ value: 'Business', label: 'Business', color: 'primary' }])

//   // ** Select Options
//   const options = [
//     { value: 'Business', label: 'Business', color: 'primary' },
//     { value: 'Personal', label: 'Personal', color: 'danger' },
//     { value: 'Family', label: 'Family', color: 'warning' },
//     { value: 'Holiday', label: 'Holiday', color: 'success' },
//     { value: 'ETC', label: 'ETC', color: 'info' }
//   ]

//   const guestsOptions = [
//     { value: 'Donna Frank', label: 'Donna Frank', avatar: img1 },
//     { value: 'Jane Foster', label: 'Jane Foster', avatar: img2 },
//     { value: 'Gabrielle Robertson', label: 'Gabrielle Robertson', avatar: img3 },
//     { value: 'Lori Spears', label: 'Lori Spears', avatar: img4 },
//     { value: 'Sandy Vega', label: 'Sandy Vega', avatar: img5 },
//     { value: 'Cheryl May', label: 'Cheryl May', avatar: img6 }
//   ]

//   // ** Custom select components
//   const OptionComponent = ({ data, ...props }) => {
//     return (
//       <components.Option {...props}>
//         <span className={`bullet bullet-${data.color} bullet-sm me-50`}></span>
//         {data.label}
//       </components.Option>
//     )
//   }

//   const GuestsComponent = ({ data, ...props }) => {
//     return (
//       <components.Option {...props}>
//         <div className='d-flex flex-wrap align-items-center'>
//           <Avatar className='my-0 me-1' size='sm' img={data.avatar} />
//           <div>{data.label}</div>
//         </div>
//       </components.Option>
//     )
//   }

//   // ** Adds New Event
//   const handleAddEvent = () => {
//     const obj = {
//       title: getValues('title'),
//       start: startPicker,
//       end: endPicker,
//       allDay,
//       display: 'block',
//       extendedProps: {
//         calendar: calendarLabel[0].label,
//         url: url.length ? url : undefined,
//         guests: guests.length ? guests : undefined,
//         location: location.length ? location : undefined,
//         desc: desc.length ? desc : undefined
//       }
//     }
//     dispatch(addEvent(obj))
//     refetchEvents()
//     handleAddEventSidebar()
//     toast.success('Event Added')
//   }

//   // ** Reset Input Values on Close
//   const handleResetInputValues = () => {
//     dispatch(selectEvent({}))
//     setValue('title', '')
//     setAllDay(false)
//     setUrl('')
//     setLocation('')
//     setDesc('')
//     setGuests({})
//     setCalendarLabel([{ value: 'Business', label: 'Business', color: 'primary' }])
//     setStartPicker(new Date())
//     setEndPicker(new Date())
//   }

//   // ** Set sidebar fields
//   const handleSelectedEvent = () => {
//     if (!isObjEmpty(selectedEvent)) {
//       const calendar = selectedEvent.extendedProps.calendar

//       const resolveLabel = () => {
//         if (calendar.length) {
//           return { label: calendar, value: calendar, color: calendarsColor[calendar] }
//         } else {
//           return { value: 'Business', label: 'Business', color: 'primary' }
//         }
//       }
//       setValue('title', selectedEvent.title || getValues('title'))
//       setAllDay(selectedEvent.allDay || allDay)
//       setUrl(selectedEvent.url || url)
//       setLocation(selectedEvent.extendedProps.location || location)
//       setDesc(selectedEvent.extendedProps.description || desc)
//       setGuests(selectedEvent.extendedProps.guests || guests)
//       setStartPicker(new Date(selectedEvent.start))
//       setEndPicker(selectedEvent.allDay ? new Date(selectedEvent.start) : new Date(selectedEvent.end))
//       setCalendarLabel([resolveLabel()])
//     }
//   }

//   // ** (UI) updateEventInCalendar
//   const updateEventInCalendar = (updatedEventData, propsToUpdate, extendedPropsToUpdate) => {
//     const existingEvent = calendarApi.getEventById(updatedEventData.id)

//     // ** Set event properties except date related
//     // ? Docs: https://fullcalendar.io/docs/Event-setProp
//     // ** dateRelatedProps => ['start', 'end', 'allDay']
//     // ** eslint-disable-next-line no-plusplus
//     for (let index = 0; index < propsToUpdate.length; index++) {
//       const propName = propsToUpdate[index]
//       existingEvent.setProp(propName, updatedEventData[propName])
//     }

//     // ** Set date related props
//     // ? Docs: https://fullcalendar.io/docs/Event-setDates
//     existingEvent.setDates(new Date(updatedEventData.start), new Date(updatedEventData.end), {
//       allDay: updatedEventData.allDay
//     })

//     // ** Set event's extendedProps
//     // ? Docs: https://fullcalendar.io/docs/Event-setExtendedProp
//     // ** eslint-disable-next-line no-plusplus
//     for (let index = 0; index < extendedPropsToUpdate.length; index++) {
//       const propName = extendedPropsToUpdate[index]
//       existingEvent.setExtendedProp(propName, updatedEventData.extendedProps[propName])
//     }
//   }

//   // ** Updates Event in Store
//   const handleUpdateEvent = () => {
//     if (getValues('title').length) {
//       const eventToUpdate = {
//         id: selectedEvent.id,
//         title: getValues('title'),
//         allDay,
//         start: startPicker,
//         end: endPicker,
//         url,
//         display: allDay === false ? 'block' : undefined,
//         extendedProps: {
//           location,
//           description: desc,
//           guests,
//           calendar: calendarLabel[0].label
//         }
//       }

//       const propsToUpdate = ['id', 'title', 'url']
//       const extendedPropsToUpdate = ['calendar', 'guests', 'location', 'description']
//       dispatch(updateEvent(eventToUpdate))
//       updateEventInCalendar(eventToUpdate, propsToUpdate, extendedPropsToUpdate)

//       handleAddEventSidebar()
//       toast.success('Event Updated')
//     } else {
//       setError('title', {
//         type: 'manual'
//       })
//     }
//   }

//   // ** (UI) removeEventInCalendar
//   const removeEventInCalendar = eventId => {
//     calendarApi.getEventById(eventId).remove()
//   }

//   const handleDeleteEvent = () => {
//     dispatch(removeEvent(selectedEvent.id))
//     removeEventInCalendar(selectedEvent.id)
//     handleAddEventSidebar()
//     toast.error('Event Removed')
//   }

//   // ** Event Action buttons
//   const EventActions = () => {
//     if (isObjEmpty(selectedEvent) || (!isObjEmpty(selectedEvent) && !selectedEvent.title.length)) {
//       return (
//         <Fragment>
//           <Button className='me-1' type='submit' color='primary'>
//             Add
//           </Button>
//           <Button color='secondary' type='reset' onClick={handleAddEventSidebar} outline>
//             Cancel
//           </Button>
//         </Fragment>
//       )
//     } else {
//       return (
//         <Fragment>
//           <Button className='me-1' color='primary' onClick={handleUpdateEvent}>
//             Update
//           </Button>
//           <Button color='danger' onClick={handleDeleteEvent} outline>
//             Delete
//           </Button>
//         </Fragment>
//       )
//     }
//   }

//   // ** Close BTN
//   const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleAddEventSidebar} />

//   return (
//     <Modal
//       isOpen={open}
//       className='sidebar-lg'
//       toggle={handleAddEventSidebar}
//       onOpened={handleSelectedEvent}
//       onClosed={handleResetInputValues}
//       contentClassName='p-0 overflow-hidden'
//       modalClassName='modal-slide-in event-sidebar'
//     >
//       <ModalHeader className='mb-1' toggle={handleAddEventSidebar} close={CloseBtn} tag='div'>
//         <h5 className='modal-title'>
//           {selectedEvent && selectedEvent.title && selectedEvent.title.length ? 'Update' : 'Add'} Event
//         </h5>
//       </ModalHeader>
//       <PerfectScrollbar options={{ wheelPropagation: false }}>
//         <ModalBody className='flex-grow-1 pb-sm-0 pb-3'>
//           <Form
//             onSubmit={handleSubmit(data => {
//               if (data.title.length) {
//                 if (isObjEmpty(errors)) {
//                   if (isObjEmpty(selectedEvent) || (!isObjEmpty(selectedEvent) && !selectedEvent.title.length)) {
//                     handleAddEvent()
//                   } else {
//                     handleUpdateEvent()
//                   }
//                   handleAddEventSidebar()
//                 }
//               } else {
//                 setError('title', {
//                   type: 'manual'
//                 })
//               }
//             })}
//           >
//             <div className='mb-1'>
//               <Label className='form-label' for='title'>
//                 Title <span className='text-danger'>*</span>
//               </Label>
//               <Controller
//                 name='title'
//                 control={control}
//                 render={({ field }) => (
//                   <Input id='title' placeholder='Title' invalid={errors.title && true} {...field} />
//                 )}
//               />
//             </div>

//             <div className='mb-1'>
//               <Label className='form-label' for='label'>
//                 Label
//               </Label>
//               <Select
//                 id='label'
//                 value={calendarLabel}
//                 options={options}
//                 theme={selectThemeColors}
//                 className='react-select'
//                 classNamePrefix='select'
//                 isClearable={false}
//                 onChange={data => setCalendarLabel([data])}
//                 components={{
//                   Option: OptionComponent
//                 }}
//               />
//             </div>

//             <div className='mb-1'>
//               <Label className='form-label' for='startDate'>
//                 Start Date
//               </Label>
//               <Flatpickr
//                 required
//                 id='startDate'
//                 name='startDate'
//                 className='form-control'
//                 onChange={date => setStartPicker(date[0])}
//                 value={startPicker}
//                 options={{
//                   enableTime: allDay === false,
//                   dateFormat: 'Y-m-d H:i'
//                 }}
//               />
//             </div>

//             <div className='mb-1'>
//               <Label className='form-label' for='endDate'>
//                 End Date
//               </Label>
//               <Flatpickr
//                 required
//                 id='endDate'
//                 // tag={Flatpickr}
//                 name='endDate'
//                 className='form-control'
//                 onChange={date => setEndPicker(date[0])}
//                 value={endPicker}
//                 options={{
//                   enableTime: allDay === false,
//                   dateFormat: 'Y-m-d H:i'
//                 }}
//               />
//             </div>

//             <div className='form-switch mb-1'>
//               <Input
//                 id='allDay'
//                 type='switch'
//                 className='me-1'
//                 checked={allDay}
//                 name='customSwitch'
//                 onChange={e => setAllDay(e.target.checked)}
//               />
//               <Label className='form-label' for='allDay'>
//                 All Day
//               </Label>
//             </div>

//             <div className='mb-1'>
//               <Label className='form-label' for='eventURL'>
//                 Event URL
//               </Label>
//               <Input
//                 type='url'
//                 id='eventURL'
//                 value={url}
//                 onChange={e => setUrl(e.target.value)}
//                 placeholder='https://www.google.com'
//               />
//             </div>

//             <div className='mb-1'>
//               <Label className='form-label' for='guests'>
//                 Guests
//               </Label>
//               <Select
//                 isMulti
//                 id='guests'
//                 className='react-select'
//                 classNamePrefix='select'
//                 isClearable={false}
//                 options={guestsOptions}
//                 theme={selectThemeColors}
//                 value={guests.length ? [...guests] : null}
//                 onChange={data => setGuests([...data])}
//                 components={{
//                   Option: GuestsComponent
//                 }}
//               />
//             </div>

//             <div className='mb-1'>
//               <Label className='form-label' for='location'>
//                 Location
//               </Label>
//               <Input id='location' value={location} onChange={e => setLocation(e.target.value)} placeholder='Office' />
//             </div>

//             <div className='mb-1'>
//               <Label className='form-label' for='description'>
//                 Description
//               </Label>
//               <Input
//                 type='textarea'
//                 name='text'
//                 id='description'
//                 rows='3'
//                 value={desc}
//                 onChange={e => setDesc(e.target.value)}
//                 placeholder='Description'
//               />
//             </div>
//             <div className='d-flex mb-1'>
//               <EventActions />
//             </div>
//           </Form>
//         </ModalBody>
//       </PerfectScrollbar>
//     </Modal>
//   )
// }

// export default AddEventSidebar


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import Sidebar from "@components/sidebar";
import { useFormik } from "formik";
import { Edit, Eye, Trash2 } from "react-feather";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { addTask, deleteTask, getTasks, updateTask } from "../../../redux/task";
import { Box, Grid } from "@mui/material";
import { useSkin } from "@hooks/useSkin";
import { DataGrid } from "@mui/x-data-grid";
import { getContacts } from "../../../redux/contact";
import { getLeads } from "../../../redux/lead";
import { getTeam } from "../../../redux/team";
import { getCustomers } from "../../../redux/customer";
import { useSweetToast } from "../../../@core/layouts/utils";

const AddEventSidebar = () => {
  const navigate = useNavigate();
  const { skin } = useSkin();
  const dispatch = useDispatch();
  const taskList = useSelector((state) => state?.task);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const contactList = useSelector((state) => state.contact?.data);
  const leadList = useSelector((state) => state.lead?.data || []);
  const customerList = useSelector((state) => state.customer?.data);
  const teamList = useSelector((state) => state.team?.data);
  const [loading, setLoading] = useState(false);

  const SweetToast = useSweetToast();

  const contactOptions = contactList?.map((contact) => ({
    label: `${contact.firstName} ${contact.lastName}`,
    value: contact._id,
  }));

  const leadOptions = leadList?.map((lead) => ({
    label: `${lead.name} `,
    value: lead._id,
  }));

  const customerOptions = customerList?.map((customer) => ({
    label: `${customer.name} `,
    value: customer._id,
  }));

  const teamOptions = teamList?.map((team) => ({
    label: `${team.firstName} ${team.lastName}`,
    value: team._id,
  }));

  useEffect(() => {
    dispatch(
      getTasks({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      })
    );
    dispatch(
      getContacts({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      })
    );
    dispatch(
      getLeads({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      })
    );
    dispatch(
      getCustomers({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      })
    );
    dispatch(
      getTeam({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      })
    );
  }, [dispatch, paginationModel]);

  useEffect(() => {
    if (taskList?.data?.length) {
      const dataWithId = taskList.data.map((item) => item.task || item);

      setRows(dataWithId);
    }
  }, [taskList]);

  const columns = [
    {
      field: "title", headerName: "Title", flex: 1, renderCell: (params) => params.value || "–",
    },
    { field: "assignToName", headerName: "Assign To Name", flex: 1, renderCell: (params) => params.value || "–" },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const status = params.value;
        let bgColor = '';
        let textColor = '';

        switch (status) {
          case 'Active':
            bgColor = 'rgba(0, 255, 135, 0.1)';
            textColor = '#00ff87';
            break;
          case 'Inactive':
            bgColor = 'rgba(255, 0, 0, 0.1)';
            textColor = '#ff4d4f';
            break;
          case 'Pending':
            bgColor = 'rgba(255, 193, 7, 0.1)';
            textColor = '#ffc107';
            break;
          case 'Completed':
            bgColor = '#1565c0';
            textColor = '#bbdefb';
            break;
          default:
            bgColor = 'rgba(108, 117, 125, 0.1)';
            textColor = '#6c757d';
        }

        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <div
              style={{
                backgroundColor: bgColor,
                color: textColor,
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 500,
                lineHeight: 1,
                textTransform: 'capitalize',
                width: 'fit-content',
                textAlign: 'center',

              }}

            >
              {status}
            </div>
          </div>
        );
      }
    },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 1,
      valueFormatter: (value) =>
        value ? moment(value).format("DD/MM/YYYY") : "—",
    },
    {
      field: "deadLine",
      headerName: "dead Line",
      flex: 1,
      valueFormatter: (value) =>
        value ? moment(value).format("DD/MM/YYYY") : "—",
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex: 1,

      renderCell: (params) => {
        const data = params.row;
        return (
          <div style={{ display: "flex", marginTop: "7px" }}>
            <Button
              variant="outlined"
              size="small"
              style={{ padding: "2px" }}
              color=""
              onClick={() => {
                handleEdit(data);
              }}
            >
              <Edit size={20} color="green" />
            </Button>
            <Button
              variant="contained"
              color=""
              size="small"
              style={{ padding: "4px" }}
              onClick={() => navigate(`/task/taskView/${data._id}`)}
            >
              <Eye size={20} color={skin === "light" ? "blue" : "white"} />
            </Button>

            <Button
              variant="contained"
              color="error"
              size="small"
              style={{ padding: "2px" }}
              onClick={() => dispatch(() => openDeleteModal(data))}
            >
              <Trash2 size={20} color="red" />
            </Button>
          </div>
        );
      },
    },
  ];


  const initialValues = {
    title: "",
    description: "",
    assignToContactId: "",
    assignToLeadId: "",
    assignToCustomerId: "",
    assignToTeamId: "",
    status: "",
    priority: "",
    startDate: "",
    deadLine: "",
    related: "none",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string(),
    status: Yup.string(),
    priority: Yup.string(),
    startDate: Yup.date(),
    deadLine: Yup.date(),
  });

  const formik = useFormik({
    initialValues: editData || initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        if (editData) {
          const hasChanged = Object.keys(values).some(
            (key) => values[key] !== editData[key]
          );
          if (!hasChanged) {
            toggleSidebar();
            resetForm();
            setEditData(null);
            return;
          }
          const updatedData = { ...editData, ...values };
          const res = await dispatch(updateTask({ updatedData, paginationModel }));
          if (res.payload?.status === 200) {
            SweetToast.fire({
              icon: "success",
              title: res.payload.data.message,
            });

          } else {
            SweetToast.fire({
              icon: "error",
              title: res.payload.data.message,
            });
          }
        } else {
          const res = await dispatch(addTask(values));
          if (res.payload?.status === 201) {
            SweetToast.fire({
              icon: "success",
              title: res.payload.data.message,
            });
          } else {
            SweetToast.fire({
              icon: "error",
              title: res.payload.data.message,
            });
          }
        }
        resetForm();
        setEditData(null);
        toggleSidebar();
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  const { handleSubmit, values, errors, touched, handleChange, handleBlur } =
    formik;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setEditData(null);
    formik.resetForm();
  };

  const handleEdit = (data) => {
    let related = "none";
    let assignToContactId = "";
    let assignToLeadId = "";
    let assignToCustomerId = "";
    let assignToTeamId = "";

    if (data.assignToContactId) {
      related = "contact";
      assignToContactId = data.assignToContactId;
    } else if (data.assignToLeadId) {
      related = "lead";
      assignToLeadId = data.assignToLeadId;
    } else if (data.assignToCustomerId) {
      related = "customer";
      assignToCustomerId = data.assignToCustomerId;
    } else if (data.assignToTeamId) {
      related = "team";
      assignToTeamId = data.assignToTeamId;
    }

    const formattedData = {
      ...data,
      related,
      assignToContactId,
      assignToLeadId,
      assignToCustomerId,
      assignToTeamId,
      startDate: data.startDate
        ? moment(data.startDate).format("YYYY-MM-DD")
        : "",
      deadLine: data.deadLine ? moment(data.deadLine).format("YYYY-MM-DD") : "",
    };

    setEditData(formattedData);
    setSidebarOpen(true);
  };

  const openDeleteModal = (rowData) => {
    setSelectedForDelete(rowData);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedForDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = () => {
    try {
      if (selectedForDelete) {
        dispatch(deleteTask({ selectedForDelete, paginationModel }));
      }
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };



  return (
    <>
      <Box className="mb-2 d-flex justify-content-between align-items-center ">
        <h3>Task List</h3>
        {userData.role === "admin" && (
          <Button color="primary" onClick={toggleSidebar}>
            Add
          </Button>
        )}
      </Box>

      <Box style={{ height: 635, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          rowCount={taskList?.total || 0}
          disableRowSelectionOnClick
          getRowId={(row) => row?._id}
          loading={loading}
          localeText={{
            noRowsLabel: loading ? "No customers found" : <Spinner />,
          }}
        />
      </Box>

      <Sidebar
        open={sidebarOpen}
        toggleSidebar={toggleSidebar}
        title={editData ? "Update Task" : "Add Task"}
        size="xl"
      >
        <Form onSubmit={handleSubmit} className="mt-2">
          <Grid container spacing={2} >
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="title">
                Title <span className="text-danger">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={values.title}
                onChange={handleChange}
                placeholder="Title"
                onBlur={handleBlur}
                invalid={touched.title && !!errors.title}
              />
              {touched.title && errors.title && (
                <div className="text-danger">{errors.title}</div>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="related">Related</Label>
              <Input
                type="select"
                id="related"
                name="related"
                value={values.related}
                onChange={handleChange}
              >
                <option value="none">None</option>
                <option value="contact">Contact</option>
                <option value="lead">Lead</option>
                <option value="customer">Customer</option>
                <option value="team">team</option>
              </Input>
              {errors.related && touched.related && (
                <div className="text-danger">{errors.related}</div>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {values.related === "contact" && (
                <>
                  <Label for="assignTo">Assign To Contact</Label>
                  <Input
                    type="select"
                    id="assignToContactId"
                    name="assignToContactId"
                    value={values.assignToContactId}
                    onChange={handleChange}
                  >
                    <option value="">Select Contact</option>
                    {contactOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Input>
                </>
              )}

              {values.related === "lead" && (
                <>
                  <Label for="assignTo">Assign To Lead</Label>
                  <Input
                    type="select"
                    id="assignToLeadId"
                    name="assignToLeadId"
                    value={values.assignToLeadId}
                    onChange={handleChange}
                  >
                    <option value="">Select Lead</option>
                    {leadOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Input>
                </>
              )}
              {values.related === "team" && (
                <>
                  <Label for="assignTo">Assign To Team</Label>
                  <Input
                    type="select"
                    id="assignToTeamId"
                    name="assignToTeamId"
                    value={values.assignToTeamId}
                    onChange={handleChange}
                  >
                    <option value="">Select Team</option>
                    {teamOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Input>
                </>
              )}
              {values.related === "customer" && (
                <>
                  <Label for="assignTo">Assign To Customer</Label>
                  <Input
                    type="select"
                    id="assignToCustomerId"
                    name="assignToCustomerId"
                    value={values.assignToCustomerId}
                    onChange={handleChange}
                  >
                    <option value="">Select Customer</option>
                    {customerOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Input>
                </>
              )}

              {touched.assignTo && errors.assignTo && (
                <div className="text-danger">{errors.assignTo}</div>
              )}
            </Grid>
          </Grid>

          <Grid container spacing={2} className="mb-2">
            <Grid size={{ xs: 12, sm: 6 }}>
              <Col sm={12}>
                <Label for="status">Status</Label>
                <Input
                  id="status"
                  name="status"
                  type="select"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Completed">Completed</option>
                </Input>
              </Col>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="priority">Priority</Label>
              <Input
                id="priority"
                name="priority"
                value={values.priority}
                onChange={handleChange}
                placeholder="Priority"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} className="mb-2">
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="startDate">Start Date</Label>
              <Input
                type="date"
                id="startDate"
                name="startDate"
                value={values.startDate}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={!!errors.startDate && touched.startDate}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="deadLine">DeadLine Date</Label>
              <Input
                type="date"
                id="deadLine"
                name="deadLine"
                value={values.deadLine}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={!!errors.deadLine && touched.deadLine}
              />
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} className="mb-2">
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="123 Main St, City"
              onBlur={handleBlur}
              invalid={!!errors.description && touched.description}
            />
          </Grid>

          <Box className="d-flex justify-content-end">
            <Button className="me-1" color="primary" type="submit" disabled={loading}>
              {loading ? (
                <Spinner className="spinner-border spinner-border-sm " />
              ) : (
                editData ? "Update" : "Save"
              )}
            </Button>
            <Button color="secondary" onClick={toggleSidebar} outline>
              Cancel
            </Button>
          </Box>
        </Form>
      </Sidebar>

      <Modal isOpen={isDeleteModalOpen} toggle={closeDeleteModal}>
        <ModalHeader toggle={closeDeleteModal}>Confirm Deletion</ModalHeader>
        <ModalBody>
          Are you sure you want to delete{" "}
          <strong>
            {selectedForDelete?.firstName} {selectedForDelete?.lastName}
          </strong>
          ?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmDelete}>
            Delete
          </Button>
          <Button color="secondary" onClick={closeDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AddEventSidebar;
