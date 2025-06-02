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

ModuleRegistry.registerModules([AllCommunityModule]);

const Customer = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const customerList = useSelector((state) => state?.customer?.data);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [editData, setEditData] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);

    useEffect(() => {
        dispatch(getCustomers());
    }, [dispatch]);

    useEffect(() => {
        if (customerList?.length) {
            setRowData(customerList);
        }
    }, [customerList]);

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
        { field: "name" },
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
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: '',
        gender: '',
        occupation: '',
        linkedInProfile: '',
        facebookProfile: '',
        twitterProfile: ''

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
        occupation: Yup.string(),
        linkedInProfile: Yup.string().url("Invalid URL"),
        facebookProfile: Yup.string().url("Invalid URL"),
        twitterProfile: Yup.string().url("Invalid URL"),
    });

    const formik = useFormik({
        initialValues: editData || initialValues,
        validationSchema,
        enableReinitialize: true, // important to update form when editData changes
        onSubmit: (values, { resetForm }) => {
            if (editData) {
                const updatedData = { ...editData, ...values };
                dispatch(updateCustomer(updatedData));
            } else {
                dispatch(addCustomer(values));
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
            dateOfBirth: data.dateOfBirth
                ? moment(data.dateOfBirth).format("YYYY-MM-DD")
                : ""
        };
        setEditData(formattedData);
        setIsViewMode(false);

        setSidebarOpen(true);
    };

    const handleDelete = (data) => {
        dispatch(deleteCustomer(data));
    };

    const handleView = (data) => {
        navigate(`/customer/customerView/${data._id}`);
    };

    return (
        <>
            <div className="mb-2 text-end">
                <Button color="primary" onClick={toggleSidebar}>
                    Add Customer Record
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
                title={editData ? "Update Customer Record" : "Add Customer Record"}
                size="xl"
            >
                <Form onSubmit={handleSubmit}>
                    <div className="container">
                        <div className="row">
                            <div className="col mb-2">
                                <Label for="name">
                                    Name <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={values.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    readOnly={isViewMode}
                                    onBlur={handleBlur}
                                    invalid={touched.name && !!errors.name}
                                />
                                {touched.name && errors.name && (
                                    <div className="text-danger">{errors.name}</div>
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
                                <Label for="occupation">Occupation</Label>
                                <Input
                                    id="occupation"
                                    name="occupation"
                                    value={values.occupation}
                                    onChange={handleChange}
                                    placeholder="Occupation"
                                    readOnly={isViewMode}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col mb-2">
                                <Label for="dateOfBirth">Date of Birth</Label>
                                <Input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={values.dateOfBirth}
                                    onChange={handleChange}
                                    readOnly={isViewMode}
                                    onBlur={handleBlur}
                                    invalid={!!errors.dateOfBirth && touched.dateOfBirth}
                                />
                                {errors.dateOfBirth && touched.dateOfBirth && (
                                    <div className="text-danger">{errors.dateOfBirth}</div>
                                )}
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
                        <div className="mb-2">
                            <Label for="linkedInProfile">LinkedIn Profile</Label>
                            <Input
                                id="linkedInProfile"
                                name="linkedInProfile"
                                value={values.linkedInProfile}
                                onChange={handleChange}
                                placeholder="LinkedIn URL"
                                readOnly={isViewMode}
                            />
                        </div>

                        <div className="mb-2">
                            <Label for="facebookProfile">Facebook Profile</Label>
                            <Input
                                id="facebookProfile"
                                name="facebookProfile"
                                value={values.facebookProfile}
                                onChange={handleChange}
                                placeholder="Facebook URL"
                                readOnly={isViewMode}
                            />
                        </div>

                        <div className="mb-2">
                            <Label for="twitterProfile">Twitter Profile</Label>
                            <Input
                                id="twitterProfile"
                                name="twitterProfile"
                                value={values.twitterProfile}
                                onChange={handleChange}
                                placeholder="Twitter URL"
                                readOnly={isViewMode}
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

export default Customer;
