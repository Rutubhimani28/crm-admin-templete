import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, Label, Card } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { viewTeam } from "../../../redux/team";
import { ChevronLeft } from "react-feather";
import { Box, Grid } from "@mui/material";

const TeamView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const teamList = useSelector((state) => state?.team?.data);
  useEffect(() => {
    if (id) {
      dispatch(viewTeam({ _id: id }));
    }
  }, [id, dispatch]);

  if (!teamList) {
    return <p>No task data found.</p>;
  }

  const {
    firstName = "",
    lastName = "",
    email = "",
    phoneNumber = "",
    address = "",
    gender = "",
    position = "",
    task = [],
    proposals = [],
  } = teamList;

  const groupedProposals = proposals.reduce(
    (acc, proposal) => {
      const status = (proposal.status || "on hold").toLowerCase();
      if (!acc[status]) acc[status] = [];
      acc[status].push(proposal);
      return acc;
    },
    { approved: [], rejected: [], OnHold: [] }
  );
  return (
    <>
      <Box className="d-flex justify-content-between align-items-center mt-1 mb-1">
        <h3>View Team</h3>
        <Button color="primary" onClick={() => navigate(-1)}>
          <ChevronLeft className="mr-2" />
          Back
        </Button>
      </Box>
      <Card className="container-md">
        <Box className="p-2">
          <Grid container columnSpacing={{ xs: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">First Name: </Label>
              <p> {firstName || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Last Name: </Label>
              <p className="fs-6"> {lastName || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Task: </Label>
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
              <p className="fs-6"> {email || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Phone Number: </Label>
              <p className="fs-6"> {phoneNumber || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Address: </Label>
              <p className="fs-6"> {address || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Gender: </Label>
              <p className="fs-6"> {gender || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Position: </Label>
              <p className="fs-6"> {position || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">proposal: </Label>
              {/* <p className="fs-6"> {position || "-"}</p> */}

              {/* {proposals?.length > 0 ? (
                proposals?.map((item, index) => (
                  <Box key={item._id}>
                    <Link
                      to={`/proposals/proposalsView/${item._id}`}
                      className="text-primary text-decoration-underline"
                    >
                      {item.title || "Untitled"}
                    </Link>
                    {index < task.length - 1 && ", "}
                  </Box>
                ))
              ) : (
                <p>-</p>
              )} */}

              {proposals.length > 0 ? (
                <>
                  {["approved", "rejected", "on hold"].map((status) => (
                    <Box key={status} className="mb-3">
                      <h6 className="text-capitalize fw-bold">
                        {status} Proposals ({groupedProposals[status]?.length || 0})
                      </h6>
                      {groupedProposals[status]?.length > 0 ? (
                        <ul>
                          {groupedProposals[status].map((item) => (
                            <li key={item._id}>
                              <Link
                                to={`/proposals/proposalsView/${item._id}`}
                                className="text-primary text-decoration-underline"
                              >
                                {item.title || "Untitled"}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted">No {status} proposals</p>
                      )}
                    </Box>
                  ))}
                </>
              ) : (
                <p>-</p>
              )}
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  );
};

export default TeamView;
