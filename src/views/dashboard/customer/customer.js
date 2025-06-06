import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "reactstrap";
import Sidebar from "@components/sidebar";
import { useFormik } from "formik";
import { Edit, Eye, Trash2 } from "react-feather";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  addCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "../../../redux/customer";
import moment from "moment";
import { Box, Grid } from "@mui/material";
import { useSkin } from "@hooks/useSkin";
import { DataGrid } from "@mui/x-data-grid";

const Customer = () => {
  const navigate = useNavigate();
  const { skin } = useSkin();
  const dispatch = useDispatch();
  const customerList = useSelector((state) => state?.customer);
  console.log(customerList);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState(null);

  useEffect(() => {
    dispatch(
      getCustomers({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      })
    );
  }, [dispatch, paginationModel]);

  useEffect(() => {
    if (customerList?.data?.length) {
      const dataWithId = customerList?.data?.map((item) => ({
        ...item,
      }));
      setRows(dataWithId);
    }
  }, [customerList]);

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
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
              onClick={() => navigate(`/customer/customerView/${data._id}`)}
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
    dateOfBirth: "",
    gender: "",
    occupation: "",
    linkedInProfile: "",
    facebookProfile: "",
    twitterProfile: "",
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
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
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
        dispatch(updateCustomer({ updatedData, paginationModel }));
      } else {
        dispatch(addCustomer(values));
      }
      resetForm();
      setEditData(null);
      toggleSidebar();
    },
  });

  const { handleSubmit, values, errors, touched, handleChange, handleBlur } =
    formik;

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
        : "",
    };
    setEditData(formattedData);
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
      <Box className="mb-2 text-end">
        <Button color="primary" onClick={toggleSidebar}>
          Add Customer Record
        </Button>
      </Box>

      <Box style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          rowCount={customerList?.total}
          disableRowSelectionOnClick
          getRowId={(row) => row._id}
        />
      </Box>

      <Sidebar
        open={sidebarOpen}
        toggleSidebar={toggleSidebar}
        title={editData ? "Update Customer Record" : "Add Customer Record"}
        size="xl"
      >
        <Form onSubmit={handleSubmit} className="mt-2">
          <Grid container spacing={2} className="mb-2">
            <Grid size={{ xs: 12, sm: 6 }}>
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
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
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
            </Grid>
          </Grid>

          <Grid container spacing={2} className="mb-2">
            <Grid size={{ xs: 12, sm: 6 }}>
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
                invalid={touched.phoneNumber && !!errors.phoneNumber}
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <div className="text-danger">{errors.phoneNumber}</div>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="occupation">Occupation</Label>
              <Input
                id="occupation"
                name="occupation"
                value={values.occupation}
                onChange={handleChange}
                placeholder="Occupation"
                readOnly={isViewMode}
              />
            </Grid>
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
                readOnly={isViewMode}
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
                    readOnly={isViewMode}
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
                    readOnly={isViewMode}
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
                    readOnly={isViewMode}
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
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} className="mb-2">
            <Label for="linkedInProfile">LinkedIn Profile</Label>
            <Input
              id="linkedInProfile"
              name="linkedInProfile"
              value={values.linkedInProfile}
              onChange={handleChange}
              placeholder="LinkedIn URL"
              readOnly={isViewMode}
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
              readOnly={isViewMode}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} className="mb-2">
            <Label for="twitterProfile">Twitter Profile</Label>
            <Input
              id="twitterProfile"
              name="twitterProfile"
              value={values.twitterProfile}
              onChange={handleChange}
              placeholder="Twitter URL"
              readOnly={isViewMode}
            />
          </Grid>

          <Box className="d-flex justify-content-end">
            {!isViewMode && (
              <Button className="me-1" color="primary" type="submit">
                {editData ? "Update" : "Add"}
              </Button>
            )}
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

export default Customer;
