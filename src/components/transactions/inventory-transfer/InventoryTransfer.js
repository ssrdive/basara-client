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
import TransferItem from '../../../components/transactions/inventory-transfer/TransferItem';
import { TEXTAREA_INPUT_OPTIONAL, DROPDOWN_DEFAULT } from '../../../constants/formValues';

import {
    loadDropdownMultiConditionGeneric,
    loadDropdownConditionGeneric,
    loadDiscountType,
} from '../../../helpers/form';
import { apiAuth } from '../../../basara-api';
import { getLoggedInUser } from '../../../helpers/authUtils';

const InventoryTransfer = () => {
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ status: null, message: '' });
    const [form, setForm] = useState({
        from_warehouse: DROPDOWN_DEFAULT,
        to_warehouse: DROPDOWN_DEFAULT,
        remarks: TEXTAREA_INPUT_OPTIONAL,
    });

    const blankEntry = {
        item_id: 0,
        qty: 0,
    };
    const [entriesState, setEntriesState] = useState([blankEntry]);
    const [itemsList, setItemsList] = useState([]);

    useEffect(() => {
        loadDropdownConditionGeneric('business_partner', 'from_warehouse', 'business_partner_type_id', 5, setForm);
        loadDropdownConditionGeneric('business_partner', 'to_warehouse', 'business_partner_type_id', 5, setForm);
        loadDiscountType(setForm);
        apiAuth
            .get('/dropdown/item')
            .then((response) => {
                setItemsList((prevItemsList) => {
                    return response.data;
                });
            })
            .catch((err) => {
                console.log(err);
            });
        setForm((prevForm) => {
            const updatedForm = { ...prevForm, ['discountAmount']: { ...prevForm['discountAmount'] } };
            updatedForm['discountAmount'].value = '0';
            return updatedForm;
        });
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

    const setItem = (idx, item) => {
        const updatedEntries = [...entriesState];
        updatedEntries[idx].item_id = item;
        setEntriesState(updatedEntries);
    };

    const handleItemChangeCommon = (e) => {
        const updatedEntries = [...entriesState];
        updatedEntries[e.target.dataset.idx][e.target.name] = e.target.value;
        setEntriesState(updatedEntries);
    };

    const handleItemChange = (e) => {
        handleItemChangeCommon(e);
        const updatedEntries = [...entriesState];
        const idx = e.target.dataset.idx;
    };

    const validateDiscount = (discountType, discountAmount, compareAmount) => {
        if (discountAmount && compareAmount) {
            if (discountType == 'per' && parseFloat(discountAmount) > 100) {
                setSubmitStatus({ status: 'failure', message: 'Form validation errors' });
                return false;
            } else if (parseFloat(discountAmount) < 0 || parseFloat(discountAmount) > parseFloat(compareAmount)) {
                setSubmitStatus({ status: 'failure', message: 'Form validation errors' });
                return false;
            }
            setSubmitStatus({ status: null, message: '' });
        }
        return true;
    };

    const calculatePriceAfterDiscount = (priceBeforeDiscount, discountType, discountAmount) => {
        var finalValue = 0;
        if (discountType == 'per') {
            finalValue = (priceBeforeDiscount * (100 - Number(discountAmount))) / 100;
        } else {
            finalValue = priceBeforeDiscount - Number(discountAmount);
        }

        return finalValue;
    };

    const submitFormHandler = (e) => {
        e.persist();
        e.preventDefault();
        setLoading((prevLoading) => true);
        setSubmitStatus({ status: null, message: '' });

        let formIsValid = true;
        let newEntries = [];

        entriesState.forEach((entry) => {
            const exists = newEntries.find((e) => e.item_id === entry.item_id);
            console.log(newEntries);
            if (exists) {
                formIsValid = false;
                return;
            } else {
                newEntries.push(entry);
            }
            if (!entry.qty || parseInt(entry.qty) == 0 ) {
                formIsValid = false;
                return;
            }
        });

        if (parseInt(form.from_warehouse.value) === parseInt(form.to_warehouse.value)) {
            setLoading((prevLoading) => false);
            setSubmitStatus({ status: 'failure', message: 'From and To Warehouse cannot be the same' });
            return;
        }

        if (!formIsValid) {
            setLoading((prevLoading) => false);
            setSubmitStatus({ status: 'failure', message: 'Form validation errors' });
            return;
        } else {
            apiAuth
                .post(
                    '/transaction/inventorytransfer/new',
                    qs.stringify({
                        user_id: getLoggedInUser().id,
                        from_warehouse_id: form.from_warehouse.value,
                        to_warehouse_id: form.to_warehouse.value,
                        entries: JSON.stringify(entriesState),
                        remark: form.remarks.value,
                    })
                )
                .then((response) => {
                    setLoading((prevLoading) => false);
                    setSubmitStatus({ status: 'success', message: `Entries issued` });
                })
                .catch((err) => {
                    setLoading((prevLoading) => false);
                    setSubmitStatus({ status: 'failure', message: 'Something went wrong' });
                });
        }
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
                        Create
                    </Button>
                )}
            </>
        );
    };

    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0">Inventory Transfer</h4>
                <Row>
                    <Col lg={12}>
                        <Form>
                            <Row>
                                <Col lg={6}>
                                    <Label for="text">From Warehouse</Label>
                                    <FormGroup>
                                        <FormInput
                                            {...form['from_warehouse']}
                                            name="from_warehouse"
                                            handleOnChange={handleOnChange}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col lg={6}>
                                    <Label for="text">To Warehouse</Label>
                                    <FormGroup>
                                        <FormInput
                                            {...form['to_warehouse']}
                                            name="to_warehouse"
                                            handleOnChange={handleOnChange}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Button color="info" onClick={addEntry}>
                                Add Item
                            </Button>

                            <br />
                            <br />
                            {entriesState.map((val, idx) => {
                                return (
                                    <div key={idx} xs={12} sm={12} md={12}>
                                        <TransferItem
                                            idx={idx}
                                            entriesState={entriesState}
                                            handleItemChangeCommon={handleItemChangeCommon}
                                            handleItemChange={handleItemChange}
                                            handleItemDelete={(e) => handleItemDelete(e, idx)}
                                            setItem={setItem}
                                            itemsList={itemsList}
                                        />
                                    </div>
                                );
                            })}
                            <br />
                            <FormGroup>
                                <FormInput
                                    {...form['remarks']}
                                    name="remarks"
                                    placeholder="Remarks"
                                    handleOnChange={handleOnChange}
                                />
                            </FormGroup>
                            <SubmitComponent />
                        </Form>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

export default InventoryTransfer;