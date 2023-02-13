import React, { useState, useEffect } from 'react';
import { Button, Input, Form } from 'reactstrap';
import { apiAuth } from '../../basara-api';

import FormInput from '../form/FormInput';

const BPPaymentItem = ({ idx, entriesState, handleItemChange, handleItemDelete, setBP }) => {
    const [models, setModels] = useState([]);

    useEffect(() => {
        apiAuth
            .get('/dropdown/business_partner')
            .then((response) => {
                setModels((prevModels) => {
                    return response.data;
                });
                if (response.data.length > 0) setBP(idx, response.data[0].id);
            })
            .catch((err) => {
                console.log(err);
            });
        // eslint-disable-next-line
    }, []);

    return (
        <Form key={idx} inline>
            <FormInput idx={idx} name="bp" type="select" options={models} handleOnChange={handleItemChange} />
            &nbsp;&nbsp;&nbsp;
            <Input
                type="number"
                data-idx={idx}
                name="amount"
                placeholder="Amount"
                value={entriesState[idx].debit}
                onChange={handleItemChange}
            />
            &nbsp;&nbsp;&nbsp;
            <Button color="warning" onClick={handleItemDelete}>
                X
            </Button>
            <br />
            <br />
        </Form>
    );
};

export default BPPaymentItem;