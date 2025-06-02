import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Label, Input, Form, Card } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { contactView } from "../../../redux/contact";
import moment from "moment/moment";
import { viewLead } from "../../../redux/lead";


const LeadView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Access redux state
    const lead = useSelector(state => state?.lead?.data); // Adjust slice name

    useEffect(() => {
        if (id) {
            dispatch(viewLead({ _id: id }));
        }
    }, [id, dispatch]);

    // if (loading) {
    //     return <p>Loading contact data...</p>;
    // }

    // if (error) {
    //     return <p>Error loading contact: {error}</p>;
    // }

    if (!lead) {
        return <p>No contact data found.</p>;
    }

    // Destructure with fallback values to avoid undefined errors
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
        <Card>
            <div className="container mt-3">
                <h3>View Contact</h3>
                <Form>
                    <div className="row">
                        <div className="col mb-2">
                            <Label>Name</Label>
                            <Input value={name} readOnly />
                        </div>
                        <div className="col mb-2">
                            <Label>Email</Label>
                            <Input value={email} readOnly />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col mb-2">
                            <Label>Phone Number</Label>
                            <Input value={phoneNumber} readOnly />
                        </div>
                        <div className="col mb-2">
                            <Label>Owner</Label>
                            <Input value={owner} readOnly />
                        </div>
                    </div>
                    <div className="mb-2">
                        <Label>Address</Label>
                        <Input type="textarea" value={address} readOnly />
                    </div>
                    <div className="row">
                        <div className="col mb-2">
                            <Label>City</Label>
                            <Input value={city} readOnly />
                        </div>
                        <div className="col mb-2">
                            <Label>State</Label>
                            <Input value={state} readOnly />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col mb-2">
                            <Label>Country</Label>
                            <Input value={country} readOnly />
                        </div>
                        <div className="col mb-2">
                            <Label>ZIP Code</Label>
                            <Input value={zip} readOnly />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col mb-2">
                            <Label>source</Label>
                            <Input value={source} readOnly />
                        </div>
                        <div className="col mb-2">
                            <Label>status</Label>
                            <Input value={status} readOnly />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col mb-2">
                            <Label>Conversation Date</Label>
                            <Input value={moment(conversationDate).format("DD-MM-YYYY")} readOnly />
                        </div>
                        <div className="col mb-2">
                            <Label>Follow-Up Date</Label>
                            <Input value={moment(followUpDate).format("DD-MM-YYYY")} readOnly />
                        </div>
                    </div>


                    <div className="mb-2">
                        <Button color="secondary" onClick={() => navigate(-1)}>
                            Back
                        </Button>
                    </div>
                </Form>
            </div>
        </Card>
    );
};

export default LeadView;
