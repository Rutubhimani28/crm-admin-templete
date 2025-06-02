import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, Label } from "reactstrap";
import Sidebar from "@components/sidebar";
import { Formik, useFormik } from "formik";
import { Edit, Eye, Trash } from "react-feather";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { addLead, deleteLead, getLeads, updateLead } from "../../../redux/lead";

ModuleRegistry.registerModules([AllCommunityModule]);

const Lead = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const leadList = useSelector((state) => state?.lead?.data);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [editData, setEditData] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);

    useEffect(() => {
        dispatch(getLeads());
    }, [dispatch]);

    useEffect(() => {
        if (leadList?.length) {
            setRowData(leadList);
        }
    }, [leadList]);

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
        { field: "status" },
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
        city: Yup.string().required("City is required"),
        state: Yup.string(),
        country: Yup.string(),
        zip: Yup.string(),
        source: Yup.string(),
        status: Yup.string(),
        owner: Yup.string(),
        conversationDate: Yup.date(),
        followUpDate: Yup.date(),
    });

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date)) return "";
        return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
    };

    const formik = useFormik({
        initialValues: editData
            ? {
                ...editData,
                conversationDate: formatDate(editData.conversationDate),
                followUpDate: formatDate(editData.followUpDate),
            }
            : initialValues,
        validationSchema,
        enableReinitialize: true, // important to update form when editData changes
        onSubmit: (values, { resetForm }) => {
            if (editData) {
                const updatedData = { ...editData, ...values };
                dispatch(updateLead(updatedData));
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
        setIsViewMode(false);
        formik.resetForm();
    };

    const handleEdit = (data) => {
        setEditData(data);
        setIsViewMode(false);

        setSidebarOpen(true);
    };

    const handleDelete = (data) => {
        dispatch(deleteLead(data));
    };

    const handleView = (data) => {
        navigate(`/lead/leadView/${data._id}`);
    };

    return (
        <>
            <div className="mb-2 text-end">
                <Button color="primary" onClick={toggleSidebar}>
                    Add lead Record
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
                <Form onSubmit={formik.handleSubmit}>
                    <div className="container">
                        <div className="row">
                            <div className="col mb-2">
                                <Label for="name">
                                    Name <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    placeholder="Name"
                                    readOnly={isViewMode}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.name && !!formik.errors.name}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <div className="text-danger">{formik.errors.name}</div>
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
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    placeholder="example@domain.com"
                                    readOnly={isViewMode}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.email && !!formik.errors.email}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <div className="text-danger">{formik.errors.email}</div>
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
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    placeholder="123-456-7890"
                                    readOnly={isViewMode}
                                    onBlur={formik.handleBlur}
                                    invalid={
                                        formik.touched.phoneNumber && !!formik.errors.phoneNumber
                                    }
                                />
                                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                                    <div className="text-danger">{formik.errors.phoneNumber}</div>
                                )}
                            </div>

                            <div className="col mb-2">
                                <Label for="owner">Owner</Label>
                                <Input
                                    id="owner"
                                    name="owner"    
                                    value={formik.values.owner}
                                    onChange={formik.handleChange}
                                    placeholder="Owner"
                                    readOnly={isViewMode}
                                />
                            </div>
                        </div>

                        <div className="mb-2">
                            <Label for="address">Address</Label>
                            <Input
                                type="textarea"
                                id="address"
                                name="address"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                placeholder="123 Main St, City"
                                readOnly={isViewMode}
                            />
                        </div>

                        <div className="row">
                            <div className="col mb-2">
                                <Label for="city">
                                    City <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={formik.values.city}
                                    onChange={formik.handleChange}
                                    placeholder="City"
                                    readOnly={isViewMode}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.city && !!formik.errors.city}
                                />
                                {formik.touched.city && formik.errors.city && (
                                    <div className="text-danger">{formik.errors.city}</div>
                                )}
                            </div>
                            <div className="col mb-2">
                                <Label for="state">State</Label>
                                <Input
                                    id="state"
                                    name="state"
                                    value={formik.values.state}
                                    onChange={formik.handleChange}
                                    placeholder="State"
                                    readOnly={isViewMode}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col mb-2">
                                <Label for="country">Country</Label>
                                <Input
                                    id="country"
                                    name="country"
                                    value={formik.values.country}
                                    onChange={formik.handleChange}
                                    placeholder="Country"
                                    readOnly={isViewMode}
                                />
                            </div>
                            <div className="col mb-2">
                                <Label for="zip">ZIP Code</Label>
                                <Input
                                    id="zip"
                                    name="zip"
                                    value={formik.values.zip}
                                    onChange={formik.handleChange}
                                    placeholder="ZIP Code"
                                    readOnly={isViewMode}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col mb-2">
                                <Label for="source">Source</Label>
                                <select
                                    id="source"
                                    name="source"
                                    className="form-control"
                                    value={formik.values.source}
                                    onChange={formik.handleChange}
                                    disabled={isViewMode}
                                >
                                    <option value="">Select Source</option>
                                    <option value="Social Media">Social Media</option>
                                    <option value="Customer Referral">Customer Referral</option>
                                    <option value="Website">Website</option>
                                    <option value="Search Engine">Search Engine</option>
                                    <option value="Google Ads">Google Ads</option>
                                </select>
                            </div>

                            <div className="col mb-2">
                                <Label for="status">Status</Label>
                                <select
                                    id="status"
                                    name="status"
                                    className="form-control"
                                    value={formik.values.status}
                                    onChange={formik.handleChange}
                                    disabled={isViewMode}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col mb-2">
                                <Label for="conversationDate">Conversation Date</Label>
                                <Input
                                    type="date"
                                    id="conversationDate"
                                    name="conversationDate"
                                    value={formik.values.conversationDate}
                                    onChange={formik.handleChange}
                                    readOnly={isViewMode}
                                />
                            </div>
                            <div className="col mb-2">
                                <Label for="followUpDate">Follow Up Date</Label>
                                <Input
                                    type="date"
                                    id="followUpDate"
                                    name="followUpDate"
                                    value={formik.values.followUpDate}
                                    onChange={formik.handleChange}
                                    readOnly={isViewMode}
                                />
                            </div>
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

export default Lead;
