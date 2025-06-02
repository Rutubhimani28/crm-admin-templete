import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Label, Input, Form, Card } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";
import { viewCustomer } from "../../../redux/customer";


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

    // if (loading) {
    //     return <p>Loading contact data...</p>;
    // }

    // if (error) {
    //     return <p>Error loading contact: {error}</p>;
    // }

    if (!customerList) {
        return <p>No customer data found.</p>;
    }

    const {
        name = "",
        email = "",
        phoneNumber = "",
        address = "",
        dateOfBirth = '',
        gender = '',
        occupation = '',
        linkedInProfile = '',
        facebookProfile = '',
        twitterProfile = ''
    } = customerList;

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
                        <div className="col mb-2">
                            <Label>Phone Number</Label>
                            <Input value={phoneNumber} readOnly />
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
                        <Label>Address</Label>
                        <Input type="textarea" value={address} readOnly />
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

export default CustomerView;
