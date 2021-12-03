import React, { useState, useEffect } from 'react';
import { Button, Input, Form, Label, Row, Col } from 'reactstrap';
import { apiAuth } from '../../../basara-api';

import FormInput from '../../form/FormInput';

export default ({ idx, entriesState, handleItemChangeCommon, handleItemChange, handleItemDelete, setItem }) => {
    const [models, setModels] = useState([]);

    const discount_type_options = [
        { id: 'per', name: 'Percentage' },
        { id: 'amt', name: 'Amount' },
    ];

    useEffect(() => {
        apiAuth
            .get('/dropdown/item')
            .then((response) => {
                setModels((prevModels) => {
                    return response.data;
                });
                if (response.data.length > 0)
                    setItem(idx, entriesState[idx].item_id ? entriesState[idx].item_id : response.data[0].id);
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
                        name="item_id"
                        type="select"
                        options={models}
                        handleOnChange={handleItemChangeCommon}
                        selected={entriesState[idx].item_id ? entriesState[idx].item_id : ''}
                    />
                </Col>
                <Col lg={3}>
                    <Input
                        type="number"
                        data-idx={idx}
                        name="unit_price"
                        placeholder="Unit Price"
                        value={entriesState[idx].unit_price}
                        onChange={handleItemChange}
                    />
                </Col>
                <Col lg={2}>
                    <Input
                        type="number"
                        data-idx={idx}
                        name="qty"
                        placeholder="Quantity"
                        value={entriesState[idx].qty}
                        onChange={handleItemChange}
                    />
                </Col>
            </Row>
            <Row>
                <Col lg={2}>
                    <Label style={{ marginTop: '0.5rem' }} for="text">
                        Discount :
                    </Label>
                </Col>
                <Col lg={2}>
                    <FormInput
                        idx={idx}
                        name="discount_type"
                        type="select"
                        options={discount_type_options}
                        handleOnChange={handleItemChange}
                        selected={entriesState[idx].discount_type}
                    />
                </Col>
                <Col lg={3}>
                    <Input
                        type="number"
                        data-idx={idx}
                        name="discount_amount"
                        placeholder="Amount / Percentage Value"
                        value={entriesState[idx].discount_amount}
                        onChange={handleItemChange}
                    />
                </Col>
                <Col></Col>
                <Col style={{ textAlign: 'right' }}>
                    <Label style={{ marginTop: '0.5rem' }} for="text">
                        {entriesState[idx].totalItemPrice}
                    </Label>
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
