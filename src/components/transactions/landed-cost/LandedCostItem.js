import React, { useState, useEffect } from 'react';
import { Button, Input, Form, Label, Row, Col } from 'reactstrap';
import { apiAuth } from '../../../basara-api';

import FormInput from '../../form/FormInput';

export default ({ idx, entriesState, handleItemChange, handleItemDelete, setCostType }) => {
    const [models, setModels] = useState([]);

    useEffect(() => {
        apiAuth
            .get('/dropdown/landed_cost_type')
            .then((response) => {
                setModels((prevModels) => {
                    return response.data;
                });
                if (response.data.length > 0) setCostType(idx, response.data[0].id);
            })
            .catch((err) => {
                console.log(err);
            });
        // eslint-disable-next-line
    }, []);

    return (
        <Form key={idx}>
            <Row>
                <Col lg={4}>
                    {' '}
                    <FormInput
                        idx={idx}
                        name="landed_cost_type_id"
                        type="select"
                        options={models}
                        handleOnChange={handleItemChange}
                    />
                </Col>
                <Col lg={3}>
                    <Input
                        type="number"
                        data-idx={idx}
                        name="amount"
                        placeholder="Amount"
                        value={entriesState[idx].amount}
                        onChange={handleItemChange}
                    />
                </Col>

                <Col lg={1}>
                    <Button color="warning" onClick={handleItemDelete}>
                        X
                    </Button>
                </Col>
            </Row>
            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
            <br />
        </Form>
    );
};
