import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Label, Input, Form, Card } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { viewTeam } from "../../../redux/team";


const TeamView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Access redux state
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
        firstName = '',
        lastName = '',
        email = '',
        phoneNumber = '',
        address = '',
        gender = '',
        position = '',
    } = teamList;

    return (
        <Card>
            <div className="container mt-3">
                <h3>View Team</h3>
                <Form>
                    <div className="row">
                        <div className="col mb-2">
                            <Label>First Name</Label>
                            <Input value={firstName} readOnly />
                        </div>
                        <div className="col mb-2">
                            <Label>Last Name</Label>
                            <Input value={lastName} readOnly />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col mb-2">
                            <Label>email</Label>
                            <Input value={email} readOnly />
                        </div>
                        <div className="col mb-2">
                            <Label>Phone Number</Label>
                            <Input value={phoneNumber} readOnly />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col mb-2">
                            <Label>address</Label>
                            <Input value={address} readOnly />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col mb-2">
                            <Label>gender</Label>
                            <Input value={gender} readOnly />
                        </div>
                        <div className="col mb-2">
                            <Label>position</Label>
                            <Input value={position} readOnly />
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

export default TeamView;
