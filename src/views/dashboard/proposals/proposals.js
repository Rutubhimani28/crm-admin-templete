
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import Sidebar from "@components/sidebar";
import { useFormik } from "formik";
import { Edit, Eye, Trash2 } from "react-feather";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { useSkin } from '@hooks/useSkin'
import moment from "moment";
import { Box, Grid } from "@mui/material";
import { useSweetToast } from "../../../@core/layouts/utils";
import { getTeam } from "../../../redux/team";
import { addProposal, deleteProposal, getProposal, updateProposal } from "../../../redux/Proposals";

const Proposals = () => {
    const navigate = useNavigate();
    const { skin } = useSkin()
    const dispatch = useDispatch();
    const proposalList = useSelector((state) => state?.Proposals || []);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [rows, setRows] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const teamList = useSelector((state) => state?.team?.data || []);

    const SweetToast = useSweetToast();

    // const teamOptions = teamList?.map((team) => ({
    //     label: `${team?.firstName} ${team?.lastName}`,
    //     value: team?._id,
    // }));

    const teamOptions = Array.isArray(teamList)
        ? teamList.map(team => ({
            label: `${team?.firstName} ${team?.lastName}`,
            value: team?._id,
        }))
        : [];

    useEffect(() => {
        // setLoading(true);
        dispatch(getProposal({ page: paginationModel.page + 1, pageSize: paginationModel.pageSize }));
        dispatch(
            getTeam({
                page: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
            })
        );
    }, [dispatch, paginationModel]);

    useEffect(() => {
        if (proposalList?.data?.length) {
            const dataWithId = proposalList?.data?.map((item) => ({
                ...item,
            }));
            console.log("dataWithId", dataWithId)
            setRows(dataWithId);
            // setLoading(false);
        }
    }, [proposalList]);


    const columns = [
        { field: "title", headerName: "Title", flex: 1 },
        { field: "teamName", headerName: "Proposer", flex: 1 },
        { field: "budget", headerName: "Budget", flex: 1 },
        {
            field: "dueDate", headerName: "DueDate", flex: 1, valueFormatter: (value) =>
                value ? moment(value).format("DD/MM/YYYY") : "—",
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            renderCell: (params) => {
                const status = params.value;
                let bgColor = '';
                let textColor = '';

                switch (status) {
                    case 'Approved':
                        bgColor = 'rgba(0, 255, 135, 0.1)';
                        textColor = '#008000';
                        break;
                    case 'Rejected':
                        bgColor = 'rgba(255, 0, 0, 0.1)';
                        textColor = '#ff4d4f';
                        break;
                    case 'On Hold':
                        bgColor = '#c1930733';
                        textColor = '#c19308';
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
                            onClick={() => navigate(`/proposals/proposalsview/${data._id}`)}
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
        status: "",
        proposer: "",
        budget: "",
        dueDate: "",
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        description: Yup.string(),
        status: Yup.string(),
        proposer: Yup.string(),
        budget: Yup.string(),
        dueDate: Yup.date(),

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
                        key => values[key] !== editData[key]
                    );
                    if (!hasChanged) {
                        toggleSidebar();
                        resetForm();
                        setEditData(null);
                        return;
                    }
                    const updatedData = { ...editData, ...values };
                    const res = await dispatch(updateProposal({ updatedData, paginationModel }));
                    console.log("res", res)
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
                    const res = await dispatch(addProposal(values));
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

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        setEditData(null);
        formik.resetForm();
    };

    const handleEdit = (data) => {
        const formattedData = {
            ...data,
            dueDate: data.dueDate
                ? moment(data.dueDate).format("YYYY-MM-DD")
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
                dispatch(deleteProposal({ selectedForDelete, paginationModel }));
            }
            closeDeleteModal();
        } catch (error) {
            console.error("Error deleting team:", error);
        }
    };

    return (
        <>
            <Box className="mb-2 d-flex justify-content-between align-items-center ">
                <h3>Proposals List</h3>
                <Button color="primary" onClick={toggleSidebar}>
                    Add
                </Button>
            </Box>

            <Box style={{ height: '68.9vh', width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pagination
                    paginationMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 20]}
                    rowCount={proposalList?.total}
                    disableRowSelectionOnClick
                    loading={loading}
                    localeText={{
                        noRowsLabel: loading ? '' : 'No records to display'
                    }}
                    getRowId={row => row?._id}
                />
            </Box>

            <Sidebar
                open={sidebarOpen}
                toggleSidebar={toggleSidebar}
                title={editData ? "Update Proposals Record" : "Add Proposals Record"}
                size="xl"
            >
                <Form onSubmit={formik.handleSubmit} className='mt-2'>
                    <Grid container spacing={2} className='mb-2'>
                        <Grid size={{ xs: 12, sm: 6, }}>
                            <Label for="title">
                                Title <span className="text-danger">*</span>
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                placeholder="Title"
                                onBlur={formik.handleBlur}
                                invalid={formik.touched.title && !!formik.errors.title}
                            />
                            {formik.touched.title && formik.errors.title && (
                                <div className="text-danger">{formik.errors.title}</div>
                            )}
                        </Grid>

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
                                    <option value="Approved">Approved </option>
                                    <option value="Rejected">Rejected </option>
                                    <option value="On Hold">On Hold</option>
                                    {/* <option value="Completed">Completed</option> */}
                                </Input>
                            </Col>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Label for="proposer">Team</Label>
                            <Input
                                type="select"
                                id="proposer"
                                name="proposer"
                                value={formik.values.proposer}
                                onChange={formik.handleChange}
                            >
                                <option value="">Select Team</option>
                                {teamOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Input>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, }}>
                            <Label for="budget">
                                Budget
                            </Label>
                            <Input
                                id="number"
                                name="budget"
                                value={formik.values.budget}
                                onChange={formik.handleChange}
                                placeholder="Budget"
                                onBlur={formik.handleBlur}
                                invalid={formik.touched.budget && !!formik.errors.budget}
                            />
                            {formik.touched.budget && formik.errors.budget && (
                                <div className="text-danger">{formik.errors.budget}</div>
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, }}>
                            <Label for="dueDate">
                                DueDate
                            </Label>
                            <Input
                                id="dueDate"
                                type="date"
                                name="dueDate"
                                value={formik.values.dueDate}
                                onChange={formik.handleChange}
                                placeholder="DueDate"
                                onBlur={formik.handleBlur}
                                invalid={formik.touched.dueDate && !!formik.errors.dueDate}
                            />
                            {formik.touched.dueDate && formik.errors.dueDate && (
                                <div className="text-danger">{formik.errors.dueDate}</div>
                            )}
                        </Grid>

                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} className="mb-2">
                        <Label for="description">Description</Label>
                        <Input
                            type="textarea"
                            id="description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            placeholder="Description"
                        // onBlur={handleBlur}
                        // invalid={!!errors.description && touched.description}
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

export default Proposals;
