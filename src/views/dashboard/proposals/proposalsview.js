import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Label, Card } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";
import { Box, Grid } from "@mui/material";
import { ChevronLeft } from "react-feather";
import { getProposalById } from "../../../redux/Proposals";

const ProposalsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const proposalList = useSelector((state) => state?.Proposals?.data?.data);

  useEffect(() => {
    if (id) {
      dispatch(getProposalById({ _id: id }));
    }
  }, [id, dispatch]);

  if (!proposalList) {
    return <p>No task data found.</p>;
  }

  const {
    title = "",
    description = "",
    status = "",
    teamName = "",
    budget = "",
    dueDate = "",
  } = proposalList;

  return (
    <>
      <Box className="d-flex justify-content-between align-items-center mt-1 mb-1">
        <h3>View Task</h3>
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
              <Label className="fs-6 fw-bold">Description: </Label>
              <p>{description || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Status: </Label>
              <p>{status || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Proposer: </Label>
              <p>{teamName || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">Budget: </Label>
              <p>{budget || "-"}</p>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Label className="fs-6 fw-bold">dueDate: </Label>
              <p>{moment(dueDate).format("YYYY-MM-DD") || "-"}</p>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  );
};

export default ProposalsView;
