import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, InputGroup, InputGroupText, Label } from "reactstrap";
import Sidebar from "@components/sidebar";
import { Formik, useFormik } from "formik";
import { Edit, Eye, Trash } from "react-feather";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { addCustomer, deleteCustomer, getCustomers, updateCustomer } from "../../../redux/customer";
import moment from "moment";
import Select, { components } from 'react-select'
import { addTask, deleteTask, getTasks, updateTask } from "../../../redux/task";


ModuleRegistry.registerModules([AllCommunityModule]);

const Task = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const taskList = useSelector((state) => state?.task?.data);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [editData, setEditData] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);

    useEffect(() => {
        dispatch(getTasks());
    }, [dispatch]);

    useEffect(() => {
        if (taskList?.length) {
            setRowData(taskList);
        }
    }, [taskList]);

    const defaultColDef = useMemo(
        () => ({
            filter: true,
            floatingFilter: false,
            sortable: true,
            resizable: true,
            flex: 1,
        }),
        []
    );


    const columnDefs = [
        { field: "title", headerName: "Title" },
        { field: "assignTo", headerName: "Assign To" },
        {
            field: "startDate",
            headerName: "Start Date",
            valueFormatter: (params) =>
                params.value ? moment(params.value).format("YYYY-MM-DD") : ""
        },
        {
            field: "deadLine",
            headerName: "Deadline",
            valueFormatter: (params) =>
                params.value ? moment(params.value).format("YYYY-MM-DD") : ""
        },
        {
            headerName: "Actions",
            field: "actions",
            filter: false,
            cellRenderer: (params) => (
                <div className="d-flex">
                    <Button
                        size="sm"
                        className="me-1"
                        onClick={() => handleEdit(params.data)}
                    >
                        <Edit size={14} className="me-20" />
                    </Button>
                    <Button
                        size="sm"
                        className="me-1"
                        color=""
                        onClick={() => handleView(params.data)}
                    >
                        <Eye size={14} className="me-20" />
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => handleDelete(params.data)}
                    >
                        <Trash size={14} className="me-20" />
                    </Button>
                </div>
            ),
        },
    ];

    const initialValues = {
        title: "",
        description: "",
        assignTo: "",
        status: "",
        priority: '',
        startDate: '',
        deadLine: ''

    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        description: Yup.string(),
        assignTo: Yup.string().required("Assign To is required"),
        status: Yup.string(),
        priority: Yup.string(),
        startDate: Yup.date(),
        deadLine: Yup.date(),
    });

    const formik = useFormik({
        initialValues: editData || initialValues,
        validationSchema,
        enableReinitialize: true, // important to update form when editData changes
        onSubmit: (values, { resetForm }) => {
            if (editData) {
                const updatedData = { ...editData, ...values };
                dispatch(updateTask(updatedData));
            } else {
                dispatch(addTask(values));
            }
            resetForm();
            setEditData(null);
            toggleSidebar();
        },
    });

    const { handleSubmit, values, errors, touched, handleChange, handleBlur } = formik;

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        setEditData(null);
        setIsViewMode(false);
        formik.resetForm();
    };

    const handleEdit = (data) => {
        const formattedData = {
            ...data,
            startDate: data.startDate
                ? moment(data.startDate).format("YYYY-MM-DD")
                : ""
            ,
            deadLine: data.deadLine
                ? moment(data.deadLine).format("YYYY-MM-DD")
                : "",
        };
        setEditData(formattedData);
        setIsViewMode(false);

        setSidebarOpen(true);
    };

    const handleDelete = (data) => {
        dispatch(deleteTask (data));
    };

    const handleView = (data) => {
        navigate(`/task/taskView/${data._id}`);
    };

    const statusOptions = [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "archived", label: "Archived" },
        { value: "pending", label: "Pending" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" }
    ];

    return (
        <>
            <div className="mb-2 text-end">
                <Button color="primary" onClick={toggleSidebar}>
                    Add Task 
                </Button>
            </div>

            <div style={{ height: 500, width: "100%" }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 20, 50, 100]}
                />
            </div>

            <Sidebar
                open={sidebarOpen}
                toggleSidebar={toggleSidebar}
                title={editData ? "Update Task" : "Add Task"}
                size="xl"
            >
                <Form onSubmit={handleSubmit}>
                    <div className="container">
                        <div className="row">
                            <div className="col mb-2">
                                <Label for="title">
                                    Title <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={values.title}
                                    onChange={handleChange}
                                    placeholder="Title"
                                    readOnly={isViewMode}
                                    onBlur={handleBlur}
                                    invalid={touched.title && !!errors.title}
                                />
                                {touched.title && errors.title && (
                                    <div className="text-danger">{errors.title}</div>
                                )}
                            </div>
                            <div className="col mb-2">
                                <Label for="assignTo">
                                    AssignTo <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    id="assignTo"
                                    name="assignTo"
                                    value={values.assignTo}
                                    onChange={handleChange}
                                    placeholder="AssignTo"
                                    readOnly={isViewMode}
                                    onBlur={handleBlur}
                                    invalid={touched.assignTo && !!errors.assignTo}
                                />
                                {touched.assignTo && errors.assignTo && (
                                    <div className="text-danger">{errors.assignTo}</div>
                                )}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col mb-2">
                                <Label for="status">Status</Label>
                                <Select
                                    id="status"
                                    name="status"
                                    options={statusOptions}
                                    value={statusOptions.find((option) => option.value === values.status) || null}
                                    onChange={(selectedOption) => formik.setFieldValue("status", selectedOption?.value)}
                                    onBlur={() => formik.setFieldTouched("status", true)}
                                    isDisabled={isViewMode}
                                    classNamePrefix="react-select"
                                />
                            </div>
                            <div className="col mb-2">
                                <Label for="priority">Priority</Label>
                                <Input
                                    id="priority"
                                    name="priority"
                                    value={values.priority}
                                    onChange={handleChange}
                                    placeholder="Priority"
                                    readOnly={isViewMode}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col mb-2">
                                <Label for="startDate">Start Date</Label>
                                <Input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={values.startDate}
                                    onChange={handleChange}
                                    readOnly={isViewMode}
                                    onBlur={handleBlur}
                                    invalid={!!errors.startDate && touched.startDate}
                                />
                            </div>
                            <div className="col mb-2">
                                <Label for="deadLine">DeadLine Date</Label>
                                <Input
                                    type="date"
                                    id="deadLine"
                                    name="deadLine"
                                    value={values.deadLine}
                                    onChange={handleChange}
                                    readOnly={isViewMode}
                                    onBlur={handleBlur}
                                    invalid={!!errors.deadLine && touched.deadLine}
                                />
                            </div>

                        </div>
                        <div className=" mb-2">
                            <Label for="description">Description</Label>
                            <Input
                                type="textarea"
                                id="description"
                                name="description"
                                value={values.description}
                                onChange={handleChange}
                                placeholder="123 Main St, City"
                                readOnly={isViewMode}
                                onBlur={handleBlur}
                                invalid={!!errors.description && touched.description}
                            />
                        </div>

                        <div className="d-flex justify-content-end">
                            {!isViewMode && (
                                <Button className="me-1" color="primary" type="submit">
                                    {editData ? "Update" : "Add"}
                                </Button>
                            )}
                            <Button color="secondary" onClick={toggleSidebar} outline>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Form>
            </Sidebar>
        </>
    );
};

export default Task;
