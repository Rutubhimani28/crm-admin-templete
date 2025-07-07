import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, InputGroup, InputGroupText, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import Sidebar from "@components/sidebar";
import { useFormik } from "formik";
import { Edit, Eye, Trash2 } from "react-feather";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { addTeam, deleteTeam, getTeam, updateTeam } from "../../../redux/team";
import { DataGrid } from "@mui/x-data-grid";
import { useSkin } from '@hooks/useSkin'
import { Box, Grid } from "@mui/material";
import { useSweetToast } from "../../../@core/layouts/utils";
import { updateProposal } from "../../../redux/Proposals";


const Team = () => {
    const navigate = useNavigate();
    const { skin } = useSkin()
    const dispatch = useDispatch();
    const teamList = useSelector((state) => state?.team);
    const total = useSelector((state) => state.team.total);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [editData, setEditData] = useState(null);
    const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });
    const [loading, setLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState(null);
    const SweetToast = useSweetToast();
    const [canAccess, setCanAccess] = useState(null);

    useEffect(() => {
        // setLoading(true)
        dispatch(getTeam({ page: paginationModel.page + 1, pageSize: paginationModel.pageSize }));
        // setLoading(false)
    }, [dispatch, paginationModel]);

    useEffect(() => {
        if (teamList?.data?.length) {
            const dataWithId = teamList?.data?.map((item) => ({
                ...item,
            }));
            setRows(dataWithId);
        }
    }, [teamList]);

    useEffect(() => {
        const permissionData = localStorage.getItem("createdRole");
        if (permissionData) {
            try {
                const permissions = JSON.parse(permissionData);
                if (permissions?.permissions?.Team) {
                    setCanAccess(permissions?.permissions?.Team

                    );
                } else {
                    setCanAccess(null);
                }
            } catch (err) {
                console.error("Invalid permissions format", err);
                setCanAccess(null);
            }
        } else {
            setCanAccess(null);
        }
    }, []);


    const columns = [
        { field: "firstName", headerName: "First Name", flex: 1, renderCell: (params) => params.value || "–" },
        { field: "email", headerName: "Email", flex: 1, renderCell: (params) => params.value || "–" },
        { field: "phoneNumber", headerName: "Phone Number", flex: 1, renderCell: (params) => params.value || "–" },
        { field: "address", headerName: "Address", flex: 1, renderCell: (params) => params.value || "–" },
        {
            field: "proposals",
            headerName: "Proposal Actions",
            sortable: false,
            filterable: false,
            flex: 1,
            renderCell: (params) => {
                const proposal = params.row.proposals?.[0]; // Assuming first proposal
                if (!proposal) return <span>–</span>;

                // Show buttons only if status is neither approved nor rejected
                if (proposal.status === "approved" || proposal.status === "rejected") {
                    return <span>{proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}</span>;
                }

                return (
                    <div style={{ display: "flex", gap: "4px", marginTop: "13px" }}>
                        <Button
                            color="success"
                            size="sm"
                            onClick={() => handleProposalStatusChange(proposal, "approved")}
                        >
                            Approve
                        </Button>
                        <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleProposalStatusChange(proposal, "rejected")}
                        >
                            Reject
                        </Button>
                    </div>
                );
            },
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
                        {canAccess?.edit && (
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
                        )}
                        {canAccess?.view && (
                            <Button
                                variant="contained"
                                color=''
                                size="small"
                                style={{ padding: "4px" }}
                                onClick={() => navigate(`/team/teamView/${data._id}`)}
                            >
                                <Eye size={20} color={skin === "light" ? "blue" : "white"} />
                            </Button>
                        )}
                        {canAccess?.delete && (
                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                style={{ padding: "2px" }}
                                onClick={() => dispatch(() => openDeleteModal(data))}
                            >
                                <Trash2 size={20} color="red" />
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];
    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        gender: '',
        position: '',
    };

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        phoneNumber: Yup.string().required("Phone Number is required")
            .matches(/^(?:\D*\d){10}\D*$/, "Phone number must contain exactly 10 digits")
        ,
        address: Yup.string(),
        gender: Yup.string(),
        position: Yup.string(),
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
                    const res = await dispatch(updateTeam({ updatedData, paginationModel }));
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
                    const res = await dispatch(addTeam(values));
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
    const { handleSubmit, values, errors, touched, handleChange, handleBlur } = formik;

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        setEditData(null);
        formik.resetForm();
    };

    const handleEdit = (data) => {
        setEditData(data);
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
        setLoading(true)
        try {
            if (selectedForDelete) {
                dispatch(deleteTeam({ selectedForDelete, paginationModel }));
            }
            closeDeleteModal();
        } catch (error) {
            console.error("Error deleting team:", error);
        } finally {
            setLoading(false)
        }
    };


    const handleProposalStatusChange = (proposal, newStatus) => {
        if (!proposal || !proposal._id) {
            console.error("Proposal data is missing or invalid:", proposal);
            return;
        }

        const updatedData = {
            ...proposal,
            status: newStatus
        };

        dispatch(updateProposal({ updatedData }))
            .unwrap()
            .then(() => {
                SweetToast.fire({
                    icon: "success",
                    title: `Proposal ${newStatus}`,
                });
            })
            .catch(err => {
                SweetToast.fire({
                    icon: "error",
                    title: `Failed to update proposal: ${err}`,
                });
            });
    };



    return (
        <>
            <Box className="mb-2 d-flex justify-content-between align-items-center ">
                <h3>Team List</h3>
                {canAccess?.create && (
                    <Button color="primary" onClick={toggleSidebar}>
                        Add
                    </Button>
                )}
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
                    rowCount={total}
                    disableRowSelectionOnClick
                    loading={loading}
                    getRowId={row => row._id}
                    localeText={{
                        noRowsLabel: loading ? "No customers found" : <Spinner />,
                    }}
                />
            </Box>

            <Sidebar
                open={sidebarOpen}
                toggleSidebar={toggleSidebar}
                title={editData ? "Update Team Record" : "Add Team Record"}
                size="xl"
            >
                <Form onSubmit={handleSubmit} className='mt-2'>
                    <Grid container spacing={2} className='mb-2'>
                        <Grid size={{ xs: 12, sm: 6, }}>
                            <Label for="firstName">
                                First Name <span className="text-danger">*</span>
                            </Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={values.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                onBlur={handleBlur}
                                invalid={touched.firstName && !!errors.firstName}
                            />
                            {touched.firstName && errors.firstName && (
                                <div className="text-danger">{errors.firstName}</div>
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, }}>
                            <Label for="lastName">
                                Last Name <span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="lastName"
                                id="lastName"
                                name="lastName"
                                value={values.lastName}
                                onChange={handleChange}
                                placeholder="example@domain.com"
                                onBlur={handleBlur}
                                invalid={touched.lastName && !!errors.lastName}
                            />
                            {touched.lastName && errors.lastName && (
                                <div className="text-danger">{errors.lastName}</div>
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
                                value={values.phoneNumber}
                                onChange={handleChange}
                                placeholder="123-456-7890"
                                onBlur={handleBlur}
                                invalid={
                                    touched.phoneNumber && !!errors.phoneNumber
                                }
                            />
                            {touched.phoneNumber && errors.phoneNumber && (
                                <div className="text-danger">{errors.phoneNumber}</div>
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
                                value={values.email}
                                onChange={handleChange}
                                placeholder="example@domain.com"
                                onBlur={handleBlur}
                                invalid={touched.email && !!errors.email}
                            />
                            {touched.email && errors.email && (
                                <div className="text-danger">{errors.email}</div>
                            )}
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} className='mb-2'>
                        <Grid size={{ xs: 12, sm: 6, }}>
                            <Label for="position">Position</Label>
                            <Input
                                type="position"
                                id="position"
                                name="position"
                                placeholder="Position"
                                value={values.position}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, }}>
                            <Label for="gender">Gender</Label>
                            <InputGroup>
                                <InputGroupText>
                                    <Input type="radio" name="gender" value="male" checked={values.gender === "male"} onChange={handleChange} />
                                    Male
                                </InputGroupText>
                                <InputGroupText>
                                    <Input type="radio" name="gender" value="female" checked={values.gender === "female"} onChange={handleChange} />
                                    Female
                                </InputGroupText>
                                <InputGroupText>
                                    <Input type="radio" name="gender" value="other" checked={values.gender === "other"} onChange={handleChange} />
                                    Other
                                </InputGroupText>
                            </InputGroup>
                            {errors.gender && touched.gender && (
                                <div className="text-danger">{errors.gender}</div>
                            )}
                        </Grid>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, }} className='mb-2'>
                        <Label for="address">Address</Label>
                        <Input
                            type="textarea"
                            id="address"
                            name="address"
                            value={values.address}
                            onChange={handleChange}
                            placeholder="123 Main St, City"
                            onBlur={handleBlur}
                            invalid={!!errors.address && touched.address}
                        />
                        {errors.address && touched.address && (
                            <div className="text-danger">{errors.address}</div>
                        )}
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
                    {
                        loading ? (
                            <Spinner className="spinner-border spinner-border-sm " />
                        ) : (
                            <Button color="danger" onClick={confirmDelete}>
                                Delete
                            </Button>
                        )

                    }
                    <Button color="secondary" onClick={closeDeleteModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>

        </>
    );
};

export default Team;
