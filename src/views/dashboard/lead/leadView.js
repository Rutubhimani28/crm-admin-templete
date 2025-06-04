import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Label, Card } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";
import { viewLead } from "../../../redux/lead";
import { Box, Grid } from "@mui/material";
import { ChevronLeft } from "react-feather";


const LeadView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const lead = useSelector(state => state?.lead?.data); 

    useEffect(() => {
        if (id) {
            dispatch(viewLead({ _id: id }));
        }
    }, [id, dispatch]);

    if (!lead) {
        return <p>No contact data found.</p>;
    }

    const {
        name = "",
        email = "",
        phoneNumber = "",
        address = "",
        city = '',
        country = '',
        state = '',
        zip = '',
        source = '',
        status = '',
        owner = '',
        conversationDate = '',
        followUpDate = '',
    } = lead;

    return (
        <>
            <Box className="d-flex justify-content-between align-items-center mt-1 mb-1">

                <h3>View lead</h3>
                <Button color="primary" onClick={() => navigate(-1)} >
                    <ChevronLeft className="mr-2" />
                    Back
                </Button>
            </Box>
            <Card>
                <Box className='p-2'>
                    <Grid container columnSpacing={{ xs: 1 }} >
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Label className='fs-6 fw-bold'>Name: </Label>
                            <p>{name || '-'}</p>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Label className="fs-6 fw-bold">Email: </Label>
                            <p>{email || '-'}</p>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Label className="fs-6 fw-bold">Phone Number: </Label>
                            <p>{phoneNumber || '-'}</p>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Label className="fs-6 fw-bold">Status: </Label>
                            <p>{status || '-'}</p>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Label className="fs-6 fw-bold">Address: </Label>
                            <p>{address || '-'}</p>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Label className="fs-6 fw-bold">City: </Label>
                            <p>{city || '-'}</p>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Label className="fs-6 fw-bold">Country: </Label>
                            <p>{country || '-'}</p>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Label className="fs-6 fw-bold">State: </Label>
                            <p>{state || '-'}</p>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Label className="fs-6 fw-bold">ZIP Code: </Label>
                            <p>{zip || '-'}</p>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Label className="fs-6 fw-bold">Source: </Label>
                            <p>{source || '-'}</p>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Label className="fs-6 fw-bold">Owner: </Label>
                            <p>{owner || '-'}</p>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Label className="fs-6 fw-bold">Conversation Date: </Label>
                            <p>{conversationDate ? moment(conversationDate).format('YYYY-MM-DD') : '-'}</p>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Label className="fs-6 fw-bold">Follow-Up Date: </Label>
                            <p>{followUpDate ? moment(followUpDate).format('YYYY-MM-DD') : '-'}</p>
                        </Grid>

                    </Grid>

                </Box>
            </Card>
        </>
    );
};

export default LeadView;
