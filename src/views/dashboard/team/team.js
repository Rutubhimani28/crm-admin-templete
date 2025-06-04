import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, InputGroup, InputGroupText, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Sidebar from "@components/sidebar";
import { useFormik } from "formik";
import { Edit, Eye, Trash, Trash2 } from "react-feather";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { addTeam, deleteTeam, getTeam, updateTeam } from "../../../redux/team";
import { DataGrid } from "@mui/x-data-grid";
import { useSkin } from '@hooks/useSkin'


const Team = () => {
    const navigate = useNavigate();
    const { skin } = useSkin()
    const dispatch = useDispatch();
    const teamList = useSelector((state) => state?.team);
    const total = useSelector((state) => state.team.total);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [editData, setEditData] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });
    const [loading, setLoading] = useState(teamList?.loading);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState(null);

    useEffect(() => {
        setLoading(true)
        dispatch(getTeam({ page: paginationModel.page + 1, pageSize: paginationModel.pageSize }));
        setLoading(false)
    }, [dispatch, paginationModel]);

    useEffect(() => {
        if (teamList?.data?.length) {
            const dataWithId = teamList?.data?.map((item) => ({
                id: item._id,
                ...item,
            }));
            setRows(dataWithId);
        }
    }, [teamList]);


    const columns = [
        { field: "firstName", headerName: "First Name", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
        { field: "address", headerName: "Address", flex: 1 },
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
                            onClick={() => navigate(`/team/teamView/${data.id}`)}
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
        phoneNumber: Yup.string().required("Phone number is required")
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
        onSubmit: (values, { resetForm }) => {
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
                    dispatch(updateTeam(updatedData));
                } else {
                    dispatch(addTeam(values));
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
        setIsViewMode(false);
        formik.resetForm();
    };

    const handleEdit = (data) => {
        setEditData(data);
        setIsViewMode(false);

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


    return (
        <>
            <div className="mb-2 text-end">
                <Button color="primary" onClick={toggleSidebar}>
                    Add Team Record
                </Button>
            </div>

            <div style={{ height: 635, width: "100%" }}>
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
                />
            </div>

            <Sidebar
                open={sidebarOpen}
                toggleSidebar={toggleSidebar}
                title={editData ? "Update Team Record" : "Add Team Record"}
                size="xl"
            >
                <Form onSubmit={handleSubmit}>
                    <div className="container mt-1">
                        <div className="row">
                            <div className="col mb-2">
                                <Label for="firstName">
                                    First Name <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    readOnly={isViewMode}
                                    onBlur={handleBlur}
                                    invalid={touched.firstName && !!errors.firstName}
                                />
                                {touched.firstName && errors.firstName && (
                                    <div className="text-danger">{errors.firstName}</div>
                                )}
                            </div>
                            <div className="col mb-2">
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
                                    readOnly={isViewMode}
                                    onBlur={handleBlur}
                                    invalid={touched.lastName && !!errors.lastName}
                                />
                                {touched.lastName && errors.lastName && (
                                    <div className="text-danger">{errors.lastName}</div>
                                )}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col mb-2">
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
                                    readOnly={isViewMode}
                                    onBlur={handleBlur}
                                    invalid={
                                        touched.phoneNumber && !!errors.phoneNumber
                                    }
                                />
                                {touched.phoneNumber && errors.phoneNumber && (
                                    <div className="text-danger">{errors.phoneNumber}</div>
                                )}
                            </div>

                            <div className="col mb-2">
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
                                    readOnly={isViewMode}
                                    onBlur={handleBlur}
                                    invalid={touched.email && !!errors.email}
                                />
                                {touched.email && errors.email && (
                                    <div className="text-danger">{errors.email}</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-2">
                                <Label for="position">Position</Label>
                                <Input
                                    type="position"
                                    id="position"
                                    name="position"
                                    placeholder="Position"
                                    value={values.position}
                                    onChange={handleChange}
                                    readOnly={isViewMode}
                                />
                            </div>
                            <div className="col mb-2">
                                <Label for="gender">Gender</Label>
                                <InputGroup>
                                    <InputGroupText>
                                        <Input type="radio" name="gender" value="male" checked={values.gender === "male"} onChange={handleChange} readOnly={isViewMode} />
                                        Male
                                    </InputGroupText>
                                    <InputGroupText>
                                        <Input type="radio" name="gender" value="female" checked={values.gender === "female"} onChange={handleChange} readOnly={isViewMode} />
                                        Female
                                    </InputGroupText>
                                    <InputGroupText>
                                        <Input type="radio" name="gender" value="other" checked={values.gender === "other"} onChange={handleChange} readOnly={isViewMode} />
                                        Other
                                    </InputGroupText>
                                </InputGroup>
                                {errors.gender && touched.gender && (
                                    <div className="text-danger">{errors.gender}</div>
                                )}
                            </div>
                        </div>
                        <div className="mb-2">
                            <Label for="address">Address</Label>
                            <Input
                                type="textarea"
                                id="address"
                                name="address"
                                value={values.address}
                                onChange={handleChange}
                                placeholder="123 Main St, City"
                                readOnly={isViewMode}
                                onBlur={handleBlur}
                                invalid={!!errors.address && touched.address}
                            />
                            {errors.address && touched.address && (
                                <div className="text-danger">{errors.address}</div>
                            )}
                        </div>

                        <div className="d-flex justify-content-end">
                            {!isViewMode && (
                                <Button className="me-1" color="primary" type="submit" disabled={loading}>
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        editData ? "Update" : "Add"
                                    )}
                                </Button>
                            )}
                            <Button color="secondary" onClick={toggleSidebar} outline>
                                Cancel
                            </Button>
                        </div>
                    </div>
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

export default Team;
