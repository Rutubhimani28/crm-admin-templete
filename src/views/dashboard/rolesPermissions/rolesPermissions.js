
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Button,
    Col,
    Form,
    Input,
    InputGroup,
    InputGroupText,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Spinner,
} from "reactstrap";
import { useFormik } from "formik";
import { Edit, Eye, Shield, Trash2 } from "react-feather";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
    deleteCustomer,
    updateCustomer,
} from "../../../redux/customer";
import moment from "moment";
import { Box, Grid } from "@mui/material";
import { useSkin } from "@hooks/useSkin";
import { DataGrid } from "@mui/x-data-grid";
import { useSweetToast } from "../../../@core/layouts/utils";
import { addRoles, getAllRoles, updateRoles } from "../../../redux/rolesPermissions";


const RolesPermissions = () => {
    const navigate = useNavigate();
    const { skin } = useSkin();
    const dispatch = useDispatch();
    const rolesList = useSelector((state) => state?.role);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [editData, setEditData] = useState(null);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const SweetToast = useSweetToast();

    const toggleFormModal = () => {
        setIsFormModalOpen(!isFormModalOpen);
        setEditData(null);
        formik.resetForm();
    };


    useEffect(() => {
        // setLoading(true);
        dispatch(
            getAllRoles({
                page: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
            })
        );
    }, [dispatch, paginationModel]);

    useEffect(() => {
        try {
            if (rolesList?.data?.length) {
                const dataWithId = rolesList?.data?.map((item) => ({
                    ...item,
                }));
                setRows(dataWithId);
            }
        } catch (error) {
            console.error(error);
        } finally {
            // setLoading(false);
        }
    }, [rolesList]);

    const columns = [
        { field: "roleName", headerName: "Role Name", flex: 1, renderCell: (params) => params.value || "–" },
        {
            field: "createdAt",
            headerName: "Created At",
            flex: 1,
            renderCell: (params) =>
                params.value ? moment(params.value).format("DD-MM-YYYY, hh:mm A") : "–",
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
                            onClick={() => navigate(`/rolesPermissions/permissions/${data._id}`)}
                        >
                            <Shield size={20} color={skin === "light" ? "blue" : "white"} />
                        </Button>

                        {/* <Button
                            variant="contained"
                            color="error"
                            size="small"
                            style={{ padding: "2px" }}
                            onClick={() => dispatch(() => openDeleteModal(data))}
                        >
                            <Trash2 size={20} color="red" />
                        </Button> */}
                    </div>
                );
            },
        },
    ];

    const initialValues = {
        roleName: "",

    };

    const validationSchema = Yup.object().shape({
        roleName: Yup.string().required("Name is required"),
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
                    const res = await dispatch(updateRoles({ updatedData, paginationModel }));
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
                    const res = await dispatch(addRoles(values));
                    console.log("res", res)
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
                setIsFormModalOpen(false);
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
        // const formattedData = {
        //     ...data,
        //     dateOfBirth: data.dateOfBirth
        //         ? moment(data.dateOfBirth).format("YYYY-MM-DD")
        //         : "",
        // };
        setEditData(data);
        setSidebarOpen(true);
        setIsFormModalOpen(true);
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
                dispatch(deleteCustomer({ selectedForDelete, paginationModel }));
            }
            closeDeleteModal();
        } catch (error) {
            console.error("Error deleting team:", error);
        }
    };

    return (
        <>
            <Box className="mb-2 d-flex justify-content-between align-items-center ">
                <h3>Roles List</h3>
                <Button color="primary" onClick={() => setIsFormModalOpen(true)}>
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
                    rowCount={rolesList?.total}
                    disableRowSelectionOnClick
                    getRowId={(row) => row._id}
                    loading={loading}
                    localeText={{
                        noRowsLabel: loading ? "No customers found" : <Spinner />,
                    }}
                />
            </Box>

            <Modal isOpen={isFormModalOpen} toggle={toggleFormModal} size="lg" centered>
                <ModalHeader toggle={toggleFormModal}>
                    {editData ? "Update Role" : "Add Role"}
                </ModalHeader>
                <Form onSubmit={handleSubmit}>
                    <ModalBody>
                        <Col xs={12}>
                            <Label for="roleName">Role Name</Label>
                            <Input
                                // id="roleName"
                                name="roleName"
                                placeholder="Enter role name"
                                value={values.roleName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={touched.roleName && !!errors.roleName}
                            />
                        </Col>

                        {/* <Col xs={12} className="mt-3">
                            <h6>Role Permissions</h6>
                            {initialPermissions.map((perm, i) => (
                                <div key={i} className="d-flex align-items-center mb-1">
                                    <Label className="me-2" style={{ minWidth: "180px" }}>
                                        {perm}
                                    </Label>
                                    {["read", "write", "create"].map((act) => (
                                        <Input
                                            key={act}
                                            type="checkbox"
                                            className="me-1 ms-1"
                                            checked={values.permissions[perm]?.[act]}
                                            onChange={(e) =>
                                                formik.setFieldValue(
                                                    `permissions.${perm}.${act}`,
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            ))}
                        </Col> */}
                    </ModalBody>

                    <ModalFooter>
                        <Button color="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner size="sm" /> : editData ? "Update" : "Save"}
                        </Button>
                        <Button color="secondary" onClick={toggleFormModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>

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

export default RolesPermissions;
