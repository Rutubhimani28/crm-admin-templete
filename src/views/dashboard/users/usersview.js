import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Label, Card } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";
import { viewTask } from "../../../redux/task";
import { Box, Grid } from "@mui/material";
import { ChevronLeft } from "react-feather";
import { viewUser } from "../../../redux/Profile";

const UsersView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userList = useSelector((state) => state?.profile?.data);

  useEffect(() => {
    if (id) {
      dispatch(viewUser({ _id: id }));
    }
  }, [id, dispatch]);

  if (!userList) {
    return <p>No task data found.</p>;
  }

  const {
    userName = "",
    emailAddress = "",
    role = "",
    address = "",
    city = "",
    dateOfBirth = "",
    zip = "",
    phoneNumber = "",
  } = userList;

  return (
    <>
      <Box className="d-flex justify-content-between align-items-center mt-1 mb-1">
        <h3>View Users</h3>
        <Button color="primary" onClick={() => navigate(-1)}>
          <ChevronLeft className="mr-2" />
          Back
        </Button>
      </Box>
      <Card>
        <Box className="p-2">
          <Grid container columnSpacing={{ xs: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">User Name: </Label>
              <p>{userName || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Email Address: </Label>
              <p>{emailAddress || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Role: </Label>
              <p>{role || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Address: </Label>
              <p>{address || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">City: </Label>
              <p>{city || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Zip: </Label>
              <p>{zip || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Date Of Birth: </Label>
              <p>{moment(dateOfBirth).format("YYYY-MM-DD") || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Phone Number: </Label>
              <p>{phoneNumber || "-"}</p>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  );
};

export default UsersView;
