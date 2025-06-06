import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, Label, Input, Form, Card } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { contactView } from "../../../redux/contact";
import moment from "moment/moment";
import { Box, Grid } from "@mui/material";
import { ChevronLeft } from "react-feather";

const ContactView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const contact = useSelector((state) => state?.contact?.data); // Adjust slice name
  useEffect(() => {
    if (id) {
      dispatch(contactView({ _id: id }));
    }
  }, [id, dispatch]);

  if (!contact) {
    return <p>No contact data found.</p>;
  }

  const {
    title = "",
    firstName = "",
    lastName = "",
    email = "",
    phoneNumber = "",
    address = "",
    city = "",
    state = "",
    country = "",
    zip = "",
    dateOfBirth = "",
    gender = "",
    occupation = "",
    linkedInProfile = "",
    facebookProfile = "",
    twitterProfile = "",
    task = [],
  } = contact;

  return (
    <>
      <Box className="d-flex justify-content-between align-items-center mt-1 mb-1">
        <h3>View Contact</h3>
        <Button color="primary" onClick={() => navigate(-1)}>
          <ChevronLeft className="mr-2" />
          Back
        </Button>
      </Box>
      <Card>
        <Box className="p-2">
          <Grid container columnSpacing={{ xs: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Title: </Label>
              <p>{title || "-"}</p>
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
              <Label className="fs-6 fw-bold">First Name: </Label>
              <p>{firstName || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Last Name: </Label>
              <p>{lastName || "-"}</p>
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
              <Label className="fs-6 fw-bold">City: </Label>
              <p>{city || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">State: </Label>
              <p>{state || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Country: </Label>
              <p>{country || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">ZIP Code: </Label>
              <p>{zip || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Date of Birth: </Label>
              <p>{moment(dateOfBirth).format("DD-MM-YYYY")}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Gender: </Label>
              <p>{gender || " -"}</p>
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

export default ContactView;
