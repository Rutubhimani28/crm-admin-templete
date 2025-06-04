
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Sidebar from "@components/sidebar";
import { useFormik } from "formik";
import { Edit, Eye, Trash2 } from "react-feather";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { addLead, deleteLead, getLeads, updateLead } from "../../../redux/lead";
import { DataGrid } from "@mui/x-data-grid";
import { useSkin } from '@hooks/useSkin'
import moment from "moment";
import { Box, Grid } from "@mui/material";

const Lead = () => {
    const navigate = useNavigate();
    const { skin } = useSkin()
    const dispatch = useDispatch();
    const leadList = useSelector((state) => state?.lead);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [rows, setRows] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState(null);

    useEffect(() => {
        dispatch(getLeads({ page: paginationModel.page + 1, pageSize: paginationModel.pageSize }));
    }, [dispatch, paginationModel]);

    useEffect(() => {
        if (leadList?.data?.length) {
            const dataWithId = leadList?.data?.map((item) => ({
                ...item,
            }));
            setRows(dataWithId);
        }
    }, [leadList]);


    const columns = [
        { field: "name", headerName: "Name", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
        { field: "address", headerName: "Address", flex: 1 },
        { field: "status", headerName: "Status", flex: 1 },
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
                            color=''
                            onClick={() => {
                                handleEdit(data)
                            }}
                        >
                            <Edit size={20} color="green" />
                        </Button>
                        <Button
                            variant="contained"
                            color=''
                            size="small"
                            style={{ padding: "4px" }}
                            onClick={() => navigate(`/lead/leadView/${data._id}`)}
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
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        city: "",
        country: "",
        state: "",
        zip: "",
        source: "",
        status: "",
        owner: "",
        conversationDate: "",
        followUpDate: "",
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        phoneNumber: Yup.string()
            .matches(
                /^(?:\D*\d){10}\D*$/,
                "Phone number must contain exactly 10 digits"
            )
            .required("Phone number is required"),

        address: Yup.string(),
        city: Yup.string(),
        state: Yup.string(),
        country: Yup.string(),
        zip: Yup.string(),
        source: Yup.string(),
        status: Yup.string(),
        owner: Yup.string(),
        conversationDate: Yup.date(),
        followUpDate: Yup.date(),
    });


    const formik = useFormik({
        initialValues: editData || initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            if (editData) {
                const hasChanged = Object.keys(values).some(
                    key => values[key] !== editData[key]
                );
                if (!hasChanged) {
                    toggleSidebar();
                    resetForm();
                    setEditData(null);
                    return;
                }
                const updatedData = { ...editData, ...values };
                dispatch(updateLead({ updatedData, paginationModel }));
            } else {
                dispatch(addLead(values));
            }
            resetForm();
            setEditData(null);
            toggleSidebar();
        },
    });

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        setEditData(null);
        formik.resetForm();
    };

    const handleEdit = (data) => {
        const formattedData = {
            ...data,
            conversationDate: data.conversationDate
                ? moment(data.conversationDate).format("YYYY-MM-DD")
                : ""
            ,
            followUpDate: data.followUpDate
                ? moment(data.followUpDate).format("YYYY-MM-DD")
                : ""
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
                dispatch(deleteLead({ selectedForDelete, paginationModel }));
            }
            closeDeleteModal();
        } catch (error) {
            console.error("Error deleting team:", error);
        }
    };


    return (
        <>
            <Box className="mb-2 text-end">
                <Button color="primary" onClick={toggleSidebar}>
                    Add lead Record
                </Button>
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
                    rowCount={leadList?.total}
                    disableRowSelectionOnClick
                    // loading={loading}
                    getRowId={row => row._id}
                />
            </Box>

            <Sidebar
                open={sidebarOpen}
                toggleSidebar={toggleSidebar}
                title={editData ? "Update Lead Record" : "Add Lead Record"}
                size="xl"
            >
                <Form onSubmit={formik.handleSubmit} className='mt-2'>
                    <Grid container spacing={2} className='mb-2'>
                        <Grid size={{ xs: 12, sm: 6, }}>
                            <Label for="name">
                                Name <span className="text-danger">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                placeholder="Name"
                                onBlur={formik.handleBlur}
                                invalid={formik.touched.name && !!formik.errors.name}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <div className="text-danger">{formik.errors.name}</div>
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, }}>
                            <Label for="email">
                                Email <span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                placeholder="example@domain.com"
                                onBlur={formik.handleBlur}
                                invalid={formik.touched.email && !!formik.errors.email}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-danger">{formik.errors.email}</div>
                            )}
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} className='mb-2'>
                        <Grid size={{ xs: 12, sm: 6, }}>
                            <Label for="phoneNumber">
                                Phone Number <span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formik.values.phoneNumber}
                                onChange={formik.handleChange}
                                placeholder="123-456-7890"
                                onBlur={formik.handleBlur}
                                invalid={
                                    formik.touched.phoneNumber && !!formik.errors.phoneNumber
                                }
                            />
                            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                                <div className="text-danger">{formik.errors.phoneNumber}</div>
                            )}
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, }}>
                            <Label for="owner">Owner</Label>
                            <Input
                                id="owner"
                                name="owner"
                                value={formik.values.owner}
                                onChange={formik.handleChange}
                                placeholder="Owner"
                            />
                        </Grid>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, }} className='mb-2'>
                        <Label for="address">Address</Label>
                        <Input
                            type="textarea"
                            id="address"
                            name="address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            placeholder="123 Main St, City"
                        />
                    </Grid>

                    <Grid container spacing={2} className='mb-2'>
                        <Grid size={{ xs: 12, sm: 6, }}>
                            <Label for="city">
                                City
                            </Label>
                            <Input
                                id="city"
                                name="city"
                                value={formik.values.city}
                                onChange={formik.handleChange}
                                placeholder="City"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, }}>
                            <Label for="state">State</Label>
                            <Input
                                id="state"
                                name="state"
                                value={formik.values.state}
                                onChange={formik.handleChange}
                                placeholder="State"
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} className='mb-2'>
                        <Grid size={{ xs: 12, sm: 6, }}>
                            <Label for="country">Country</Label>
                            <Input
                                id="country"
                                name="country"
                                value={formik.values.country}
                                onChange={formik.handleChange}
                                placeholder="Country"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, }}>
                            <Label for="zip">ZIP Code</Label>
                            <Input
                                id="zip"
                                name="zip"
                                value={formik.values.zip}
                                onChange={formik.handleChange}
                                placeholder="ZIP Code"
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} className='mb-2'>
                        <Grid size={{ xs: 12, sm: 6, }}>
                            <Label for="source">Source</Label>
                            <Col sm={12}>
                                <Input
                                    id="source"
                                    name="source"
                                    type="select"
                                    value={formik.values.source}
                                    onChange={formik.handleChange}
                                >
                                    <option value="">Select Source</option>
                                    <option value="Social Media">Social Media</option>
                                    <option value="Customer Referral">Customer Referral</option>
                                    <option value="Website">Website</option>
                                    <option value="Search Engine">Search Engine</option>
                                    <option value="Google Ads">Google Ads</option>
                                </Input>
                            </Col>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, }}>
                            <Label for="status">Status</Label>
                            <Col sm={12}>
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
                                </Input>
                            </Col>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} className='mb-2'>
                        <Grid size={{ xs: 12, sm: 6, }}>
                            <Label for="conversationDate">Conversation Date</Label>
                            <Input
                                type="date"
                                id="conversationDate"
                                name="conversationDate"
                                value={formik.values.conversationDate}
                                onChange={formik.handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, }}>

                            <Label for="followUpDate">Follow Up Date</Label>
                            <Input
                                type="date"
                                id="followUpDate"
                                name="followUpDate"
                                value={formik.values.followUpDate}
                                onChange={formik.handleChange}
                            />
                        </Grid>
                    </Grid>

                    <Box className="d-flex justify-content-end">

                        <Button className="me-1" color="primary" type="submit">
                            {editData ? "Update" : "Add"}
                        </Button>

                        <Button color="secondary" onClick={toggleSidebar} outline>
                            Cancel
                        </Button>
                    </Box>
                </Form>
            </Sidebar>

            <Modal isOpen={isDeleteModalOpen} toggle={closeDeleteModal}>
                <ModalHeader toggle={closeDeleteModal}>
                    Confirm Deletion
                </ModalHeader>
                <ModalBody>
                    Are you sure you want to delete <strong>
                        {selectedForDelete?.firstName} {selectedForDelete?.lastName}
                    </strong>?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={confirmDelete}>
                        Yes, Delete
                    </Button>
                    <Button color="secondary" onClick={closeDeleteModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>

        </>
    );
};

export default Lead;
