import React, { useState, useEffect } from 'react';

import {
    Input,
    Row,
    Form,
    Label,
    FormGroup,
    Col,
    Card,
    CardBody,
    Button,
    Spinner,
    UncontrolledAlert,
} from 'reactstrap';
import qs from 'qs';
import FormInput from '../../form/FormInput';

import { loadDropdownGRNGeneric } from '../../../helpers/form';

import Entry from './LandedCostItem';

import { TEXTAREA_INPUT_OPTIONAL, DROPDOWN_DEFAULT, TEXT_INPUT_OPTIONAL } from '../../../constants/formValues';

import { apiAuth } from '../../../basara-api';
import { getLoggedInUser } from '../../../helpers/authUtils';

export default () => {
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ status: null, message: '' });
    const [form, setForm] = useState({
        goodsReceivedNote: DROPDOWN_DEFAULT,
    });

    const blankEntry = {
        landed_cost_type_id: 0,
        amount: '',
    };
    const [entriesState, setEntriesState] = useState([blankEntry]);

    useEffect(() => {
        loadDropdownGRNGeneric('goodsReceivedNote', setForm);
    }, []);

    const handleOnChange = (e) => {
        e.persist();
        setForm((prevForm) => {
            const updatedForm = { ...prevForm, [e.target.name]: { ...prevForm[e.target.name] } };
            updatedForm[e.target.name].value = e.target.value;
            return updatedForm;
        });
    };

    const addEntry = () => {
        setEntriesState([...entriesState, { ...blankEntry }]);
    };

    const handleItemDelete = (e, idx) => {
        e.preventDefault();
        const updatedEntries = [...entriesState];
        updatedEntries.splice(idx, 1);
        setEntriesState(updatedEntries);
    };

    const setCostType = (idx, item) => {
        const updatedEntries = [...entriesState];
        updatedEntries[idx].landed_cost_type_id = item;
        setEntriesState(updatedEntries);
    };

    const handleItemChange = (e) => {
        const updatedEntries = [...entriesState];
        updatedEntries[e.target.dataset.idx][e.target.name] = e.target.value;
        setEntriesState(updatedEntries);
    };

    const SubmitComponent = () => {
        return (
            <>
                {submitStatus.status !== null ? (
                    submitStatus.status === 'success' ? (
                        <UncontrolledAlert color="success">{submitStatus.message}</UncontrolledAlert>
                    ) : (
                        <UncontrolledAlert color="warning">{submitStatus.message}</UncontrolledAlert>
                    )
                ) : null}
                {loading ? (
                    <Spinner className="m-2" type="grow" color="success" />
                ) : (
                    <Button color="success" type="submit" onClick={submitFormHandler}>
                        Add Entries
                    </Button>
                )}
            </>
        );
    };

    const submitFormHandler = (e) => {
        e.persist();
        e.preventDefault();
        setLoading((prevLoading) => true);
        setSubmitStatus({ status: null, message: '' });

        let newEntries = [];

        entriesState.forEach((entry) => {
            const exists = newEntries.find((e) => e.landed_cost_type_id === entry.landed_cost_type_id);
            if (exists) {
                setLoading((prevLoading) => false);
                setSubmitStatus({ status: 'failure', message: 'Form validation errors' });
                return;
            } else {
                newEntries.push(entry);
            }
        });

        apiAuth
            .post(
                '/transaction/landedcost/new',
                qs.stringify({
                    user_id: getLoggedInUser().id,
                    grn_id: form.goodsReceivedNote.value,
                    entries: JSON.stringify(entriesState),
                })
            )
            .then((response) => {
                setLoading((prevLoading) => false);
                setSubmitStatus({ status: 'success', message: `Entries issued` });
                loadDropdownGRNGeneric('goodsReceivedNote', setForm);
            })
            .catch((err) => {
                setLoading((prevLoading) => false);
                setSubmitStatus({ status: 'failure', message: 'Something went wrong' });
            });
    };

    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0">Landed Cost</h4>
                <Row>
                    <Col lg={12}>
                        <Form>
                            <Row>
                                <Col lg={6}>
                                    <Label for="text">Goods Received Notes</Label>
                                    <FormGroup>
                                        <FormInput
                                            {...form['goodsReceivedNote']}
                                            name="goodsReceivedNote"
                                            handleOnChange={handleOnChange}
                                            selected=""
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Button color="info" onClick={addEntry}>
                                Add Cost Types
                            </Button>

                            <br />
                            <br />
                            {entriesState.map((val, idx) => {
                                return (
                                    <div key={idx} xs={12} sm={12} md={12}>
                                        <Entry
                                            idx={idx}
                                            entriesState={entriesState}
                                            handleItemChange={handleItemChange}
                                            handleItemDelete={(e) => handleItemDelete(e, idx)}
                                            setCostType={setCostType}
                                        />
                                    </div>
                                );
                            })}
                            <br />

                            <SubmitComponent />
                        </Form>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};
