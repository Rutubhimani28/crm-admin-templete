import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Sidebar from '@components/sidebar'
import { Box, Button, Grid } from '@mui/material'
import { Col, Input, Label } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { addTask } from '../../../redux/task'
import { getContacts } from '../../../redux/contact'
import { getLeads } from '../../../redux/lead'
import { getCustomers } from '../../../redux/customer'
import { getTeam } from '../../../redux/team'
import { useSweetToast } from "../../../@core/layouts/utils";

const TaskSidebar = ({ open, onClose, task = null }) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const contactList = useSelector((state) => state.contact?.data);
    const leadList = useSelector((state) => state.lead?.data || []);
    const customerList = useSelector((state) => state.customer?.data);
    const teamList = useSelector((state) => state.team?.data);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
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
        initialValues: initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            console.log('Formik values:', values)
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

            resetForm();
            onClose()
        }
    })

    const { handleSubmit, values, errors, touched, handleChange, handleBlur } =
        formik;


    // const handleSubmit = (values) => {
    //     console.log('Formik values:', values)
    //     onClose()
    // }

    return (
        <Sidebar
            open={open}
            toggleSidebar={onClose}
            title={task ? "Edit Task" : "Add Task"}
            size="xl"
        >
            <form onSubmit={handleSubmit} className="mt-2">
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
                            "Save"
                        )}
                    </Button>
                    {/* <Button color="secondary" onClick={onClose()} outline>
                        Cancel
                    </Button> */}
                </Box>
            </form>
        </Sidebar>
    )
}

export default TaskSidebar
