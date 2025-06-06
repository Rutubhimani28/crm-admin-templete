import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, Label, Card } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";
import { viewCustomer } from "../../../redux/customer";
import { Box, Grid } from "@mui/material";
import { ChevronLeft } from "react-feather";

const CustomerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const customerList = useSelector((state) => state?.customer?.data);

  useEffect(() => {
    if (id) {
      dispatch(viewCustomer({ _id: id }));
    }
  }, [id, dispatch]);

  if (!customerList) {
    return <p>No customer data found.</p>;
  }

  const {
    name = "",
    email = "",
    phoneNumber = "",
    address = "",
    dateOfBirth = "",
    gender = "",
    occupation = "",
    linkedInProfile = "",
    facebookProfile = "",
    twitterProfile = "",
    task = [],
  } = customerList;

  return (
    <>
      <Box className="d-flex justify-content-between align-items-center mt-1 mb-1">
        <h3>View customer</h3>
        <Button color="primary" onClick={() => navigate(-1)}>
          <ChevronLeft className="mr-2" />
          Back
        </Button>
      </Box>
      <Card>
        <Box className="p-2">
          <Grid container columnSpacing={{ xs: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Name: </Label>
              <p>{name || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Task:</Label>
              {task?.length > 0 ? (
                task?.map((item, index) => (
                  <Box key={item._id}>
                    <Link
                      to={`/task/taskView/${item._id}`}
                      className="text-primary text-decoration-underline"
                    >
                      {item.title || "Untitled"}
                    </Link>
                    {index < task.length - 1 && ", "}
                  </Box>
                ))
              ) : (
                <p>-</p>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Email: </Label>
              <p>{email || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Phone Number: </Label>
              <p>{phoneNumber || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Address: </Label>
              <p>{address || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Date of Birth: </Label>
              <p>{moment(dateOfBirth).format("DD-MM-YYYY") || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Gender: </Label>
              <p>{gender || "-"}</p>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Occupation: </Label>
              <p>{occupation || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">LinkedIn Profile: </Label>
              <p>
                {linkedInProfile ? (
                  <a
                    href={linkedInProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {linkedInProfile}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Facebook Profile: </Label>
              <p>
                {facebookProfile ? (
                  <a
                    href={facebookProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {facebookProfile}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Twitter Profile: </Label>
              <p>
                {twitterProfile ? (
                  <a
                    href={twitterProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {twitterProfile}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  );
};

export default CustomerView;
