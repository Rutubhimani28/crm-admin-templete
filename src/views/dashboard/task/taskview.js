import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Label, Input, Form, Card } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { contactView } from "../../../redux/contact";
import moment from "moment/moment";
import { viewTask } from "../../../redux/task";


const TaskView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Access redux state
    const taskList = useSelector((state) => state?.task?.data);

    useEffect(() => {
        if (id) {
            dispatch(viewTask({ _id: id }));
        }
    }, [id, dispatch]);

    // if (loading) {
    //     return <p>Loading contact data...</p>;
    // }

    // if (error) {
    //     return <p>Error loading contact: {error}</p>;
    // }

    if (!taskList) {
        return <p>No task data found.</p>;
    }

    // Destructure with fallback values to avoid undefined errors
    const {
        title = "",
        description = "",
        assignTo = "",
        status = "",
        priority = '',
        startDate = '',
        deadLine = ''
    } = taskList;

    return (
        <Card>
            <div className="container mt-3">
                <h3>View Task</h3>
                <Form>
                    <div className="row">
                        <div className="col mb-2">
                            <Label>Title</Label>
                            <Input value={title} readOnly />
                        </div>
                        <div className="col mb-2">
                            <Label>description</Label>
                            <Input value={description} readOnly />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col mb-2">
                            <Label>assignTo</Label>
                            <Input value={assignTo} readOnly />
                        </div>
                        <div className="col mb-2">
                            <Label>status</Label>
                            <Input value={status} readOnly />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col mb-2">
                            <Label>priority</Label>
                            <Input value={priority} readOnly />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col mb-2">
                            <Label>startDate</Label>
                            <Input value={moment(startDate).format("DD-MM-YYYY")} readOnly />
                        </div>
                        <div className="col mb-2">
                            <Label>deadLine</Label>
                            <Input value={moment(deadLine).format("DD-MM-YYYY")} readOnly />
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

export default TaskView;
