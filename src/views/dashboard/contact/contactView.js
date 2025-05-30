import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Label, Input, Form, Card } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { contactView } from "../../../redux/contact";
import moment from "moment/moment";


const ContactView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Access redux state
    const contact = useSelector(state => state?.contact?.data); // Adjust slice name

    useEffect(() => {
        if (id) {
            dispatch(contactView({ _id: id }));
        }
    }, [id, dispatch]);

    // if (loading) {
    //     return <p>Loading contact data...</p>;
    // }

    // if (error) {
    //     return <p>Error loading contact: {error}</p>;
    // }

    if (!contact) {
        return <p>No contact data found.</p>;
    }

    // Destructure with fallback values to avoid undefined errors
    const {
        title = '',
        firstName = '',
        lastName = '',
        email = '',
        phoneNumber = '',
        address = '',
        city = '',
        state = '',
        country = '',
        zip = '',
        dateOfBirth = '',
        gender = '',
        occupation = '',
        linkedInProfile = '',
        facebookProfile = '',
        twitterProfile = ''
    } = contact;

    return (
        <Card>
            <div className="container mt-3">
                <h3>View Contact</h3>
                <Form>
                    <div className="row">
                        <div className="col mb-2">
                            <Label>Title</Label>
                            <Input value={title} readOnly />
                        </div>
                        <div className="col mb-2">
                            <Label>First Name</Label>
                            <Input value={firstName} readOnly />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col mb-2">
                            <Label>Last Name</Label>
                            <Input value={lastName} readOnly />
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
                            <Label>Date of Birth</Label>
                            <Input value={moment(dateOfBirth).format("DD-MM-YYYY")} readOnly />
                        </div>
                        <div className="col mb-2">
                            <Label>Gender</Label>
                            <Input value={gender} readOnly />
                        </div>
                    </div>

                    <div className="mb-2">
                        <Label>Occupation</Label>
                        <Input value={occupation} readOnly />
                    </div>

                    <div className="mb-2">
                        <Label>LinkedIn Profile</Label>
                        <Input value={linkedInProfile} readOnly />
                    </div>

                    <div className="mb-2">
                        <Label>Facebook Profile</Label>
                        <Input value={facebookProfile} readOnly />
                    </div>

                    <div className="mb-2">
                        <Label>Twitter Profile</Label>
                        <Input value={twitterProfile} readOnly />
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

export default ContactView;
