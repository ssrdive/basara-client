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
import Entry from './GRNItem';
import { TEXTAREA_INPUT_OPTIONAL, DROPDOWN_DEFAULT, TEXT_INPUT_OPTIONAL } from '../../../constants/formValues';

import { loadDropdownConditionGeneric, loadDiscountType } from '../../../helpers/form';
import { apiAuth } from '../../../basara-api';
import { getLoggedInUser } from '../../../helpers/authUtils';

export default (props) => {
    const orderId = props.orderId;

    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ status: null, message: '' });
    const [form, setForm] = useState({
        supplier: DROPDOWN_DEFAULT,
        warehouse: DROPDOWN_DEFAULT,
        remarks: TEXTAREA_INPUT_OPTIONAL,
        discountType: DROPDOWN_DEFAULT,
        discountAmount: TEXT_INPUT_OPTIONAL,
    });

    const [totalPriceBeforeDiscount, setTotalPriceBeforeDiscount] = useState(0);
    const [totalPriceAfterDiscount, setTotalPriceAfterDiscount] = useState(0);
    const blankEntry = {
        item_id: 0,
        qty: '',
        unit_price: '',
        discount_type: 'per',
        discount_amount: '',
        totalItemPrice: 0,
    };

    const [entriesState, setEntriesState] = useState([]);

    useEffect(() => {
        loadDropdownConditionGeneric('business_partner', 'supplier', 'business_partner_type_id', 1, setForm);
        loadDropdownConditionGeneric('business_partner', 'warehouse', 'business_partner_type_id', 5, setForm);
        loadDiscountType(setForm);

        if (orderId != null && orderId.trim() != '') {
            const fetchDetails = async () => {
                apiAuth
                    .get(`/transaction/copypurchaseorder/${orderId}`)
                    .then((res) => {
                        if (res.data != null) {
                            setInitialData(res.data);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            };

            fetchDetails();
        } else {
            addEntry();
        }
    }, []);

    const setInitialData = (data) => {
        let itemsList = data.order_item_details;
        let entries = [];
        var totalPriceBeforeDiscount = 0;
        for (let i = 0; i < itemsList.length; i++) {
            console.log(i + ',' + itemsList[i].discount_type.String);
            var totalItemPrice =
                calculatePriceAfterDiscount(
                    itemsList[i].unit_price.String,
                    itemsList[i].discount_type.String,
                    itemsList[i].discount_amount.String
                ) * itemsList[i].quantity.String;

            entries.push({
                item_id: itemsList[i].item_id.String,
                qty: itemsList[i].quantity.String,
                unit_price: itemsList[i].unit_price.String,
                discount_type: itemsList[i].discount_type.String,
                discount_amount: itemsList[i].discount_amount.String,
                totalItemPrice: totalItemPrice,
            });
            totalPriceBeforeDiscount = totalPriceBeforeDiscount + totalItemPrice;
        }
        setEntriesState(entries);
        setTotalPriceBeforeDiscount(totalPriceBeforeDiscount);

        setTotalPriceAfterDiscount(
            calculatePriceAfterDiscount(
                totalPriceBeforeDiscount,
                data.discount_type.String,
                data.discount_amount.String
            )
        );

        setForm((prevForm) => {
            const updatedForm = { ...prevForm };
            updatedForm['supplier'].value = data.supplier_id.String;
            updatedForm['warehouse'].value = data.warehouse_id.String;
            updatedForm['discountType'].value = data.discount_type.String;
            updatedForm['discountAmount'].value = data.discount_amount.String;

            return updatedForm;
        });
    };

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
        if (validateDiscount(form.discountType.value, e.target.value, totalPriceBeforeDiscount)) {
            setTotalPriceAfterDiscount(
                calculatePriceAfterDiscount(totalPriceBeforeDiscount, form.discountType.value, e.target.value)
            );
        }
    };

    // e.target.value used in here because form.discountType.value got the previouse value
    const handleDiscountTypeChange = (e) => {
        handleOnChange(e);
        if (validateDiscount(e.target.value, form.discountAmount.value, totalPriceBeforeDiscount)) {
            setTotalPriceAfterDiscount(
                calculatePriceAfterDiscount(totalPriceBeforeDiscount, form.discountType.value, e.target.value)
            );
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

    const handleItemChangeCommon = (e) => {
        const updatedEntries = [...entriesState];
        updatedEntries[e.target.dataset.idx][e.target.name] = e.target.value;
        setEntriesState(updatedEntries);
    };

    const handleItemChange = (e) => {
        handleItemChangeCommon(e);
        const updatedEntries = [...entriesState];
        const idx = e.target.dataset.idx;
        if (
            validateDiscount(
                updatedEntries[idx]['discount_type'],
                updatedEntries[idx]['discount_amount'],
                updatedEntries[idx]['unit_price']
            )
        ) {
            calculateItemTotalPrice(e.target.dataset.idx);
            calculateTotalPrice();
        }
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

    const calculateItemTotalPrice = (idx) => {
        if (entriesState[idx].unit_price && entriesState[idx].qty) {
            const updatedEntries = [...entriesState];
            console.log(idx + ',' + entriesState[idx].discount_type);
            var val =
                calculatePriceAfterDiscount(
                    entriesState[idx].unit_price,
                    entriesState[idx].discount_type,
                    entriesState[idx].discount_amount
                ) * entriesState[idx].qty;

            updatedEntries[idx]['totalItemPrice'] = val;
        }
    };

    const calculateTotalPrice = () => {
        var totalPriceBeforeDiscount = entriesState.reduce((totalPrice, item) => totalPrice + item.totalItemPrice, 0);
        setTotalPriceBeforeDiscount(totalPriceBeforeDiscount);
        setTotalPriceAfterDiscount(
            calculatePriceAfterDiscount(totalPriceBeforeDiscount, form.discountType.value, form.discountAmount.value)
        );
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
                '/transaction/goodsreceivednote/new',
                qs.stringify({
                    order_id: orderId,
                    user_id: getLoggedInUser().id,
                    supplier_id: form.supplier.value,
                    warehouse_id: form.warehouse.value,
                    entries: JSON.stringify(entriesState),
                    discount_type: form.discountType.value,
                    discount_amount: form.discountAmount.value,
                    remark: form.remarks.value,
                    price_before_discount: totalPriceBeforeDiscount,
                    total_price: totalPriceAfterDiscount,
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
                <h4 className="header-title mt-0">Goods Received Note</h4>
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
                                            handleItemChangeCommon={handleItemChangeCommon}
                                            handleItemChange={handleItemChange}
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
                                        {totalPriceBeforeDiscount}
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
                                            {totalPriceAfterDiscount}
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
