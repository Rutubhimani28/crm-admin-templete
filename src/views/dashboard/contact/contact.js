import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addContact,
  deleteContact,
  getContacts,
  updateContact,
} from "../../../redux/contact";
import {
  Button,
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
import Sidebar from "@components/sidebar";
import { useFormik } from "formik";
import { Edit, Eye, Trash2 } from "react-feather";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { useSkin } from "@hooks/useSkin";
import moment from "moment";
import { Box, Grid } from "@mui/material";
import { useSweetToast } from "../../../@core/layouts/utils";

const Contact = () => {
  const navigate = useNavigate();
  const { skin } = useSkin();
  const dispatch = useDispatch();
  const contactList = useSelector((state) => state?.contact);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setEditData(null);
  };
  const SweetToast = useSweetToast();
  useEffect(() => {
    dispatch(
      getContacts({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      })
    );
  }, [dispatch, paginationModel]);

  useEffect(() => {
    if (contactList?.data?.length) {
      const dataWithId = contactList?.data?.map((item) => ({
        ...item,
      }));
      setRows(dataWithId);
    }
  }, [contactList]);


  const columns = [
    { field: "title", headerName: "Title", flex: 1, renderCell: (params) => params.value || "–" },
    { field: "firstName", headerName: "First Name", flex: 1, renderCell: (params) => params.value || "–" },
    { field: "lastName", headerName: "Last Name", flex: 1, renderCell: (params) => params.value || "–" },
    { field: "email", headerName: "Email", flex: 1, renderCell: (params) => params.value || "–" },
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
              onClick={() => navigate(`/contact/contactView/${data._id}`)}
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
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    country: "",
    state: "",
    zip: "",
    dateOfBirth: "",
    gender: "",
    occupation: "",
    linkedInProfile: "",
    facebookProfile: "",
    twitterProfile: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string()
      .matches(
        /^(?:\D*\d){10}\D*$/,
        "Phone number must contain exactly 10 digits"
      )
      .required("Phone Number is required"),

    address: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    country: Yup.string(),
    zip: Yup.string(),
    dateOfBirth: Yup.date(),
    gender: Yup.string(),
    occupation: Yup.string(),
    linkedInProfile: Yup.string().url("Invalid URL"),
    facebookProfile: Yup.string().url("Invalid URL"),
    twitterProfile: Yup.string().url("Invalid URL"),
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
          const res = await dispatch(updateContact({ updatedData, paginationModel }));
          if (res.payload?.status === 200) {
            SweetToast.fire({
              icon: "success",
              title: res.payload?.data?.message,
            });
          } else {
            SweetToast.fire({
              icon: "error",
              title: res.payload?.data?.message,
            });
          }
        } else {
          const res = await dispatch(addContact(values));
          if (res.payload?.status === 201) {
            SweetToast.fire({
              icon: "success",
              title: res.payload?.data?.message,
            });
          } else {
            SweetToast.fire({
              icon: "error",
              title: res.payload?.data?.message,
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

  const { handleSubmit, values, errors, touched, handleChange, handleBlur } =
    formik;

  const handleEdit = (data) => {
    const formattedData = {
      ...data,
      dateOfBirth: data.dateOfBirth
        ? moment(data.dateOfBirth).format("YYYY-MM-DD")
        : "",
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
        dispatch(deleteContact({ selectedForDelete, paginationModel }));
      }
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  return (
    <>
      <Box className="mb-2 d-flex justify-content-between align-items-center ">
        <h3>Contact List</h3>
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
          rowCount={contactList?.total}
          disableRowSelectionOnClick
          getRowId={(row) => row._id}
          loading={loading}
          localeText={{
            noRowsLabel: loading ? "No customers found" : <Spinner />,
          }}
        />
      </Box>

      <Sidebar
        open={sidebarOpen}
        toggleSidebar={toggleSidebar}
        title={editData ? "Update Record" : "Add Record"}
        size="xl"
      >
        <Form onSubmit={handleSubmit} className="mt-2">
          <Grid container spacing={2} className="mb-2">
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="title">
                Title <span className="text-danger">*</span>
              </Label>
              <Input
                type="select"
                id="title"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={!!errors.title && touched.title}
              >
                <option value="">Select Title</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
              </Input>
              {errors.title && touched.title && (
                <Box className="text-danger">{errors.title}</Box>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="firstName">
                First Name <span className="text-danger">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                placeholder="John"
                onBlur={handleBlur}
                invalid={!!errors.firstName && touched.firstName}
              />
              {errors.firstName && touched.firstName && (
                <div className="text-danger">{errors.firstName}</div>
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="lastName">
                Last Name <span className="text-danger">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                placeholder="Doe"
                onBlur={handleBlur}
                invalid={!!errors.lastName && touched.lastName}
              />
              {errors.lastName && touched.lastName && (
                <div className="text-danger">{errors.lastName}</div>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="email">
                Email <span className="text-danger">*</span>{" "}
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="example@domain.com"
                onBlur={handleBlur}
                invalid={!!errors.email && touched.email}
              />
              {errors.email && touched.email && (
                <div className="text-danger">{errors.email}</div>
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="phoneNumber">
                Phone Number<span className="text-danger">*</span>
              </Label>
              <Input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                placeholder="123-456-7890"
                onBlur={handleBlur}
                invalid={!!errors.phoneNumber && touched.phoneNumber}
              />
              {errors.phoneNumber && touched.phoneNumber && (
                <div className="text-danger">{errors.phoneNumber}</div>
              )}
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} className="mb-2">
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
          <Grid container spacing={2} className="mb-2">
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="dateOfBirth">Date of Birth</Label>
              <Input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={values.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={!!errors.dateOfBirth && touched.dateOfBirth}
              />
              {errors.dateOfBirth && touched.dateOfBirth && (
                <div className="text-danger">{errors.dateOfBirth}</div>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="gender">Gender</Label>
              <InputGroup>
                <InputGroupText>
                  <Input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={values.gender === "male"}
                    onChange={handleChange}
                  />
                  Male
                </InputGroupText>
                <InputGroupText>
                  <Input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={values.gender === "female"}
                    onChange={handleChange}
                  />
                  Female
                </InputGroupText>
                <InputGroupText>
                  <Input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={values.gender === "other"}
                    onChange={handleChange}
                  />
                  Other
                </InputGroupText>
              </InputGroup>
              {errors.gender && touched.gender && (
                <div className="text-danger">{errors.gender}</div>
              )}
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} className="mb-2">
            <Label for="city">City</Label>
            <Input
              id="city"
              name="city"
              value={values.city}
              onChange={handleChange}
              placeholder="City"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} className="mb-2">
            <Label for="state">State</Label>
            <Input
              id="state"
              name="state"
              value={values.state}
              onChange={handleChange}
              placeholder="State"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} className="mb-2">
            <Label for="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={values.country}
              onChange={handleChange}
              placeholder="Country"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} className="mb-2">
            <Label for="zip">ZIP Code</Label>
            <Input
              id="zip"
              name="zip"
              value={values.zip}
              onChange={handleChange}
              placeholder="ZIP Code"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} className="mb-2">
            <Label for="occupation">Occupation</Label>
            <Input
              id="occupation"
              name="occupation"
              value={values.occupation}
              onChange={handleChange}
              placeholder="Occupation"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} className="mb-2">
            <Label for="linkedInProfile">LinkedIn Profile</Label>
            <Input
              id="linkedInProfile"
              name="linkedInProfile"
              value={values.linkedInProfile}
              onChange={handleChange}
              placeholder="LinkedIn URL"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} className="mb-2">
            <Label for="facebookProfile">Facebook Profile</Label>
            <Input
              id="facebookProfile"
              name="facebookProfile"
              value={values.facebookProfile}
              onChange={handleChange}
              placeholder="Facebook URL"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} className='mb-2'>
            <Label for="twitterProfile">Twitter Profile</Label>
            <Input
              id="twitterProfile"
              name="twitterProfile"
              value={values.twitterProfile}
              onChange={handleChange}
              placeholder="Twitter URL"
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

export default Contact;
