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
import Entry from '../../../components/transactions/purchase-orders/OrderItem';
import { TEXTAREA_INPUT_OPTIONAL, DROPDOWN_DEFAULT, TEXT_INPUT_OPTIONAL } from '../../../constants/formValues';

import { loadDropdownConditionGeneric } from '../../../helpers/form';
import { apiAuth } from '../../../basara-api';
import { getLoggedInUser } from '../../../helpers/authUtils';

export default () => {
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ status: null, message: '' });
    const [form, setForm] = useState({
        supplier: DROPDOWN_DEFAULT,
        warehouse: DROPDOWN_DEFAULT,
        remarks: TEXTAREA_INPUT_OPTIONAL,
        discountType: DROPDOWN_DEFAULT,
        discountAmount: TEXT_INPUT_OPTIONAL,
    });
    const discountTypeOptions = [
        { id: 'per', name: 'Percentage' },
        { id: 'amt', name: 'Amount' },
    ];
    const [priceBeforeDiscount, setPriceBeforeDiscount] = useState(0);
    const [totalOrderPrice, setTotalOrderPrice] = useState(0);
    const blankEntry = {
        item_id: 0,
        qty: '',
        unit_price: '',
        discount_type: 'per',
        discount_amount: '',
        totalItemPrice: 0,
    };
    const [entriesState, setEntriesState] = useState([blankEntry]);

    useEffect(() => {
        loadDropdownConditionGeneric('business_partner', 'supplier', 'business_partner_type_id', 1, setForm);
        loadDropdownConditionGeneric('business_partner', 'warehouse', 'business_partner_type_id', 5, setForm);
        setForm((prevForm) => {
            const updatedForm = {
                ...prevForm,
                ['discountType']: { ...prevForm['discountType'], options: discountTypeOptions, value: 'per' },
            };
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

    // e.target.value used in here because form.discountAmount.value got the previouse value
    const handleDiscountAmountChange = (e) => {
        handleOnChange(e);
        if (validateDiscount(form.discountType.value, e.target.value, priceBeforeDiscount)) {
            calculateTotalOrderPrice(priceBeforeDiscount, form.discountType.value, e.target.value);
        }
    };

    // e.target.value used in here because form.discountType.value got the previouse value
    const handleDiscountTypeChange = (e) => {
        handleOnChange(e);
        if (validateDiscount(e.target.value, form.discountAmount.value, priceBeforeDiscount)) {
            calculateTotalOrderPrice(priceBeforeDiscount, form.discountType.value, e.target.value);
        }
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

    const handleItemChange = (e) => {
        const updatedEntries = [...entriesState];
        updatedEntries[e.target.dataset.idx][e.target.name] = e.target.value;
        setEntriesState(updatedEntries);
    };

    const handleItemDiscountTypeChange = (e) => {
        handleItemChange(e);
        const updatedEntries = [...entriesState];
        if (
            validateDiscount(
                e.target.value,
                updatedEntries[e.target.dataset.idx]['discount_amount'],
                updatedEntries[e.target.dataset.idx]['unit_price']
            )
        ) {
            calculateItemTotalValue(e.target.dataset.idx);
            calculatePriceBeforeDiscount();
        }
    };

    const handleItemDiscountAmtChange = (e) => {
        handleItemChange(e);
        const updatedEntries = [...entriesState];
        if (
            validateDiscount(
                updatedEntries[e.target.dataset.idx]['discount_type'],
                e.target.value,
                updatedEntries[e.target.dataset.idx]['unit_price']
            )
        ) {
            calculateItemTotalValue(e.target.dataset.idx);
            calculatePriceBeforeDiscount();
        }
    };

    const validateDiscount = (discountType, discountAmount, compareAmount) => {
        if (discountType == 'per' && parseFloat(discountAmount) > 100) {
            setSubmitStatus({ status: 'failure', message: 'Form validation errors' });
            return false;
        } else if (parseFloat(discountAmount) < 0 || parseFloat(discountAmount) > parseFloat(compareAmount)) {
            setSubmitStatus({ status: 'failure', message: 'Form validation errors' });
            return false;
        }
        setSubmitStatus({ status: null, message: '' });
        return true;
    };

    const calculateItemTotalValue = (idx) => {
        if (entriesState[idx].unit_price && entriesState[idx].qty) {
            const updatedEntries = [...entriesState];
            var val = 0;
            if (entriesState[idx].discount_type === 'per')
                val =
                    ((entriesState[idx].unit_price * (100 - entriesState[idx].discount_amount)) / 100) *
                    entriesState[idx].qty;
            else val = (entriesState[idx].unit_price - entriesState[idx].discount_amount) * entriesState[idx].qty;

            updatedEntries[idx]['totalItemPrice'] = val;
        }
    };

    const calculatePriceBeforeDiscount = () => {
        var totalPriceBeforeDiscount = entriesState.reduce((totalPrice, item) => totalPrice + item.totalItemPrice, 0);
        setPriceBeforeDiscount(totalPriceBeforeDiscount);
        calculateTotalOrderPrice(totalPriceBeforeDiscount, form.discountType.value, form.discountAmount.value);
    };

    const calculateTotalOrderPrice = (priceBeforeDiscount, discountType, discountAmount) => {
        var finalValue = 0;
        if (discountType == 'per') {
            finalValue = (priceBeforeDiscount * (100 - Number(discountAmount))) / 100;
        } else {
            finalValue = priceBeforeDiscount - Number(discountAmount);
        }

        setTotalOrderPrice(finalValue);
    };

    const submitFormHandler = (e) => {
        e.persist();
        e.preventDefault();
        setLoading((prevLoading) => true);
        setSubmitStatus({ status: null, message: '' });

        let formIsValid = true;
        entriesState.forEach((entry) => {
            if (!entry.qty || !entry.unit_price || !entry.discount_amount) formIsValid = false;
        });

        if (!formIsValid) {
            setLoading((prevLoading) => false);
            setSubmitStatus({ status: 'failure', message: 'Form validation errors' });
            return;
        }

        apiAuth
            .post(
                '/transaction/purchaseorder/new',
                qs.stringify({
                    user_id: getLoggedInUser().id,
                    supplier_id: form.supplier.value,
                    warehouse_id: form.warehouse.value,
                    entries: JSON.stringify(entriesState),
                    discount_type: form.discountType.value,
                    discount_amount: form.discountAmount.value,
                    remark: form.remarks.value,
                    price_before_discount: priceBeforeDiscount,
                    total_price: totalOrderPrice,
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

    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0">Purchase Order</h4>
                <Row>
                    <Col lg={12}>
                        <Form>
                            <Row>
                                <Col lg={6}>
                                    <Label for="text">Supplier</Label>
                                    <FormGroup>
                                        <FormInput
                                            {...form['supplier']}
                                            name="supplier"
                                            handleOnChange={handleOnChange}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col lg={6}>
                                    <Label for="text">Warehouse</Label>
                                    <FormGroup>
                                        <FormInput
                                            {...form['warehouse']}
                                            name="warehouse"
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
                                        <Entry
                                            idx={idx}
                                            entriesState={entriesState}
                                            handleItemChange={handleItemChange}
                                            handleItemDiscountTypeChange={handleItemDiscountTypeChange}
                                            handleItemDiscountAmtChange={handleItemDiscountAmtChange}
                                            handleItemDelete={(e) => handleItemDelete(e, idx)}
                                            setItem={setItem}
                                        />
                                    </div>
                                );
                            })}
                            <br />
                            <Row>
                                <Col style={{ textAlign: 'right' }}>
                                    <Label>_________________</Label>
                                </Col>
                                <Col lg={1}></Col>
                            </Row>
                            <Row>
                                <Col></Col>
                                <Col lg={3} style={{ textAlign: 'right' }}>
                                    <Label style={{ marginTop: '0.5rem' }} for="text">
                                        {priceBeforeDiscount}
                                    </Label>
                                </Col>
                                <Col lg={1}></Col>
                            </Row>
                            <FormGroup>
                                <Row>
                                    <Col lg={2}>
                                        <Label style={{ marginTop: '0.5rem' }} for="text">
                                            Order Discount :
                                        </Label>
                                    </Col>
                                    <Col lg={2}>
                                        <FormInput
                                            {...form['discountType']}
                                            name="discountType"
                                            type="select"
                                            // options={discountTypes}
                                            handleOnChange={handleDiscountTypeChange}
                                        />
                                    </Col>
                                    <Col lg={3}>
                                        <Input
                                            type="number"
                                            name="discountAmount"
                                            placeholder="Amount / Percentage Value"
                                            value={form.discountAmount.value}
                                            onChange={handleDiscountAmountChange}
                                        />
                                    </Col>
                                    <Col style={{ textAlign: 'right' }}>Total Price : </Col>
                                    <Col style={{ textAlign: 'right' }}>
                                        <Label style={{ marginTop: '0.5rem' }} for="text">
                                            {totalOrderPrice}
                                        </Label>
                                    </Col>
                                    <Col lg={1}></Col>
                                </Row>
                            </FormGroup>
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
