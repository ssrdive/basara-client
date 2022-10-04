import React, { useState, useEffect } from 'react';
import { Button, Input, Form, Label, Row, Col } from 'reactstrap';
import { apiAuth } from '../../../basara-api';

import FormInput from '../../form/FormInput';

const TransferItem = ({
    idx,
    entriesState,
    handleItemChangeCommon,
    handleItemChange,
    handleItemDelete,
    setItem,
    itemsList,
}) => {
    const [models, setModels] = useState([]);

    const discount_type_options = [
        { id: 'per', name: 'Percentage' },
        { id: 'amt', name: 'Amount' },
    ];

    useEffect(() => {
        if (itemsList == null || itemsList.length == 0) {
            apiAuth
                .get('/dropdown/custom/items')
                .then((response) => {
                    setModels((prevModels) => {
                        return response.data;
                    });
                    if (response.data.length > 0) setItem(idx, response.data[0].id);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setModels(itemsList);
            setItem(idx, itemsList[0].id);
        }
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
                <Col lg={1}>
                    <Button color="warning" onClick={handleItemDelete}>
                        X
                    </Button>
                </Col>
            </Row>
            <Row>
            </Row>
            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
            <br />
        </Form>
    );
};

export default TransferItem;