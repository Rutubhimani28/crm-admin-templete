import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Form,
  Input,
  Label,
} from "reactstrap";
import { useFormik } from "formik";
import { Edit, Eye, Trash2 } from "react-feather";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { deleteTask } from "../../../redux/task";
import { Box, Grid } from "@mui/material";
import { useSkin } from "@hooks/useSkin";
import { DataGrid } from "@mui/x-data-grid";
import { useSweetToast } from "../../../@core/layouts/utils";
import { getAllUser, getProfile, updateProfile, updateuser } from "../../../redux/Profile";
import Sidebar from "@components/sidebar";
import { getAllRoles } from "../../../redux/rolesPermissions";

const Users = () => {
  const navigate = useNavigate();
  const { skin } = useSkin();
  const dispatch = useDispatch();
  const userList = useSelector((state) => state?.profile);
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
  const rolesList = useSelector((state) => state?.role?.data);

  const SweetToast = useSweetToast();

  const rolesOptions = Array.isArray(rolesList)
    ? rolesList.map((role) => ({
      label: `${role?.roleName}`,
      value: role?._id,
    }))
    : [];

  useEffect(() => {
    dispatch(
      getAllUser({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      })
    );

    dispatch(
      getAllRoles({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      })
    );
    dispatch(getProfile());
  }, [dispatch, paginationModel]);

  useEffect(() => {
    if (userList?.data?.length) {
      const dataWithId = userList?.data?.map((item) => item.task || item);

      setRows(dataWithId);
    }
  }, [userList]);

  const columns = [
    {
      field: "userName",
      headerName: "User Name",
      flex: 1,
      renderCell: (params) => params.value || "–",
    },
    {
      field: "emailAddress",
      headerName: "Email Address",
      flex: 1,
      renderCell: (params) => params.value || "–",
    },
    {
      field: "dateOfBirth",
      headerName: "date Of Birth",
      flex: 1,
      valueFormatter: (value) =>
        value ? moment(value).format("DD/MM/YYYY") : "—",
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: (params) => params.value || "–",
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
      renderCell: (params) => params.value || "–",
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
              onClick={() => navigate(`/profile/viewUser/${data._id}`)}
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

  const validationSchema = Yup.object().shape({
    userName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email address"),
    roleID: Yup.string().required("Role is required"),
  });

  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      roleID: "",
      phoneNumber: "",
      address: "",
      city: "",
      zip: "",
      dateOfBirth: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        if (editData) {
          const updatedData = {
            _id: editData._id, // Make sure to include the user ID
            userName: values.userName,
            emailAddress: values.email, // Note the mapping to emailAddress
            roleID: values.roleID,
            phoneNumber: values.phoneNumber,
            address: values.address,
            city: values.city,
            zip: values.zip,
            dateOfBirth: values.dateOfBirth ? moment(values.dateOfBirth).toISOString() : null,
          };
          console.log("updatedData:::", updatedData)

          const res = await dispatch(updateuser({ updatedData, paginationModel }));
          // console.log("res", res)
          // SweetToast.fire({
          //   icon: "success",
          //   title: "User updated successfully",
          // });


          if (res.payload?.status === 200) {
            SweetToast.fire({
              icon: "success",
              title: "User updated successfully",
            });
            // Refresh the user list
            // dispatch(getAllUser({
            //   page: paginationModel.page + 1,
            //   pageSize: paginationModel.pageSize,
            // }));
          } else {
            SweetToast.fire({
              icon: "error",
              title: res.payload?.data?.message || "Failed to update user",
            });
          }
        }
        resetForm();
        setEditData(null);
        toggleSidebar();
      } catch (error) {
        console.error("Error submitting form:", error);
        SweetToast.fire({
          icon: "error",
          title: "An error occurred while updating the user",
        });
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
    const formattedData = {
      ...data,
      dateOfBirth: data.dateOfBirth
        ? moment(data.dateOfBirth).format("YYYY-MM-DD")
        : "",
    };
    setEditData(formattedData);
    // Set form values here
    formik.setValues({
      userName: formattedData.userName || "",
      email: formattedData.emailAddress || "",
      roleID: formattedData.roleID || "",
      phoneNumber: formattedData.phoneNumber || "",
      address: formattedData.address || "",
      city: formattedData.city || "",
      zip: formattedData.zip || "",
      dateOfBirth: formattedData.dateOfBirth || "",
    });
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
        dispatch(deleteTask({ selectedForDelete, paginationModel }));
      }
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  return (
    <>
      <Box className="mb-2 d-flex justify-content-between align-items-center ">
        <h3>user List</h3>
      </Box>

      <Box style={{ height: "68.9vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          rowCount={userList?.total || 0}
          disableRowSelectionOnClick
          getRowId={(row) => row?._id}
          loading={loading}
          localeText={{
            noRowsLabel: loading ? "No customers found" : <Spinner />,
          }}
        />
      </Box>

      <Sidebar
        open={sidebarOpen}
        toggleSidebar={toggleSidebar}
        title={editData ? "Update User" : "Add User"}
        size="xl"
      >
        <Form onSubmit={handleSubmit} className="mt-2">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="userName">
                User Name <span className="text-danger">*</span>
              </Label>
              <Input
                id="userName"
                name="userName"
                value={values.userName}
                onChange={handleChange}
                placeholder="User Name"
                onBlur={handleBlur}
                invalid={touched.userName && !!errors.userName}
              />
              {touched.userName && errors.userName && (
                <div className="text-danger">{errors.userName}</div>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="roleID">
                Role <span className="text-danger">*</span>
              </Label>
              <Input
                type="select"
                id="roleID"
                name="roleID"
                value={values.roleID}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={touched.roleID && !!errors.roleID}
              >
                <option value="">Select Role</option>
                {rolesOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Input>
              {touched.roleID && errors.roleID && (
                <div className="text-danger">{errors.roleID}</div>
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                placeholder="Email"
                onBlur={handleBlur}
                invalid={touched.email && !!errors.email}
              />
              {touched.email && errors.email && (
                <div className="text-danger">{errors.email}</div>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="city">City</Label>
              <Input
                id="city"
                name="city"
                value={values.city}
                onChange={handleChange}
                placeholder="City"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="zip">Zip</Label>
              <Input
                id="zip"
                name="zip"
                value={values.zip}
                onChange={handleChange}
                placeholder="Zip"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Label for="dateOfBirth">Date of Birth</Label>
              <Input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={values.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>

          </Grid>
          <Grid className="mb-2">
            <Label for="address">Address</Label>
            <Input
              type="textarea"
              id="address"
              name="address"
              value={values.address}
              onChange={handleChange}
              placeholder="123 Main St, City"
              onBlur={handleBlur}
            />
          </Grid>

          <Box className="d-flex justify-content-end">
            <Button
              className="me-1"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <Spinner className="spinner-border spinner-border-sm " />
              ) : editData ? (
                "Update"
              ) : (
                "Save"
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

export default Users;