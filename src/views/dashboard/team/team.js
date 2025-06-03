import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, InputGroup, InputGroupText, Label } from "reactstrap";
import Sidebar from "@components/sidebar";
import { useFormik } from "formik";
import { Edit, Eye, Trash } from "react-feather";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { addTeam, deleteTeam, getTeam, updateTeam } from "../../../redux/team";

ModuleRegistry.registerModules([AllCommunityModule]);

const Team = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const teamList = useSelector((state) => state?.team?.data);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [editData, setEditData] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);

    useEffect(() => {
        dispatch(getTeam());
    }, [dispatch]);

    useEffect(() => {
        if (teamList?.length) {
            setRowData(teamList);
        }
    }, [teamList]);

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
        { field: "firstName" },
        { field: "email" },
        { field: "phoneNumber" },
        { field: "address" },
        {
            headerName: "Actions",
            field: "actions",
            filter: false,
            cellRenderer: (params) => (
                <div className="d-flex">
                    <Button
                        size="sm"
                        // color="warning"
                        className="me-1"
                        onClick={() => handleEdit(params.data)}
                    >
                        <Edit size={14} className="me-20" />
                        {/* Edit */}
                    </Button>
                    <Button
                        size="sm"
                        color=""
                        className="me-1"
                        onClick={() => handleView(params.data)}
                    >
                        <Eye size={14} className="me-20" />
                    </Button>
                    <Button
                        size="sm"
                        // color="danger"
                        onClick={() => handleDelete(params.data)}
                    >
                        <Trash size={14} className="me-20" />
                        {/* Delete */}
                    </Button>
                </div>
            ),
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
        phoneNumber: Yup.string()
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
            if (editData) {
                const updatedData = { ...editData, ...values };
                dispatch(updateTeam(updatedData));
            } else {
                dispatch(addTeam(values));
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
        setEditData(data);
        setIsViewMode(false);

        setSidebarOpen(true);
    };

    const handleDelete = (data) => {
        dispatch(deleteTeam(data));
    };

    const handleView = (data) => {
        navigate(`/team/teamView/${data._id}`);
    };

    return (
        <>
            <div className="mb-2 text-end">
                <Button color="primary" onClick={toggleSidebar}>
                    Add Team Record
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
                title={editData ? "Update Lead Record" : "Add Lead Record"}
                size="xl"
            >
                <Form onSubmit={handleSubmit}>
                    <div className="container">
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

export default Team;
