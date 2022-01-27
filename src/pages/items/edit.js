import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Table,
    Spinner,
    Card,
    CardBody,
    UncontrolledAlert,
    Button,
    Label,
    Input,
    Form,
    FormGroup,
} from 'reactstrap';
import qs from 'qs';

import { apiAuth } from '../../basara-api';
import { TEXT_INPUT_REQUIRED, NUMBER_INPUT_REQUIRED } from '../../constants/formValues';

import PageTitle from '../../components/PageTitle';

const FormInput = (props) => {
    return (
        <>
            {props.type === 'select' ? (
                <Input type="select" name={props.name} onChange={props.handleOnChange}>
                    {props.options.map((option) => {
                        return (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        );
                    })}
                </Input>
            ) : (
                <Input
                    type={props.type}
                    value={props.value}
                    onChange={props.handleOnChange}
                    name={props.name}
                    placeholder={props.placeholder}
                    required={props.required}
                />
            )}
        </>
    );
};

const EditItem = ({ match }) => {
    const id = match.params.id;

    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ status: null, message: '' });

    const [form, setForm] = useState({
        name: TEXT_INPUT_REQUIRED,
        item_price: NUMBER_INPUT_REQUIRED,
    });

    const [itemDetails, setItemDetails] = useState(null);

    const fetchDetails = () => {
        apiAuth
            .get(`/item/details/byid/${id}`)
            .then((res) => {
                if (res.data === null) setItemDetails((prevReceipts) => []);
                else setItemDetails((prevReceipts) => res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleOnChange = (e) => {
        e.persist();
        setForm((prevForm) => {
            const updatedForm = { ...prevForm, [e.target.name]: { ...prevForm[e.target.name] } };
            updatedForm[e.target.name].value = e.target.value;
            return updatedForm;
        });
    };

    const handleFormSubmit = (e) => {
        setLoading((prevLoading) => true);
        setSubmitStatus({ status: null, message: '' });
        e.persist();
        e.preventDefault();
        apiAuth
            .post(
                '/item/update/byid',
                qs.stringify({
                    item_id: id,
                    name: form.name.value,
                    item_price: form.item_price.value,
                })
            )
            .then((response) => {
                setLoading((prevLoading) => false);
                setSubmitStatus({ status: 'success', message: `Item updated` });
                fetchDetails();
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
                    <Button color="success" type="submit">
                        Update Item
                    </Button>
                )}
            </>
        );
    };

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Items', path: '/items' },
                            { label: 'Edit', path: '#', active: true },
                        ]}
                        title={'Edit Item'}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <Card>
                        <CardBody>
                            <h4 className="header-title mt-0">Edit Details</h4>
                            {itemDetails != null ? (
                                <>
                                    <Form onSubmit={handleFormSubmit}>
                                        <FormGroup>
                                            <Label for="text">Item Name</Label>
                                            <FormInput
                                                {...form['name']}
                                                name="name"
                                                placeholder="Item Name"
                                                handleOnChange={handleOnChange}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="text">Item Price</Label>
                                            <FormInput
                                                {...form['item_price']}
                                                name="item_price"
                                                placeholder="Item Price"
                                                handleOnChange={handleOnChange}
                                            />
                                        </FormGroup>
                                        <SubmitComponent />
                                    </Form>
                                </>
                            ) : null}
                        </CardBody>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card>
                        <CardBody>
                            <h4 className="header-title mt-0">Current Details</h4>
                            {itemDetails != null ? (
                                <>
                                    <Table className="mb-0" responsive={true} striped>
                                        <thead>
                                            <tr>
                                                <th>Criteria</th>
                                                <th>Value</th>
                                                <th>Criteria</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <b>Item ID</b>
                                                </td>
                                                <td>{itemDetails.item_id}</td>
                                                <td>
                                                    <b>Page No</b>
                                                </td>
                                                <td>{itemDetails.page_no}</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Model ID</b>
                                                </td>
                                                <td>{itemDetails.model_id}</td>
                                                <td>
                                                    <b>Item No</b>
                                                </td>
                                                <td>{itemDetails.item_no}</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Model Name</b>
                                                </td>
                                                <td>{itemDetails.model_name}</td>
                                                <td>
                                                    <b>Foreign ID</b>
                                                </td>
                                                <td>{itemDetails.foreign_id}</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Category ID</b>
                                                </td>
                                                <td>{itemDetails.item_category_id}</td>
                                                <td>
                                                    <b>Item Name</b>
                                                </td>
                                                <td>{itemDetails.name}</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Category Name</b>
                                                </td>
                                                <td>{itemDetails.item_category_name}</td>
                                                <td>
                                                    <b>Price</b>
                                                </td>
                                                <td>LKR {itemDetails.price.toLocaleString()}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </>
                            ) : null}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default EditItem;