import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import qs from 'qs';
import { apiAuth } from '../../basara-api';
import { getLoggedInUser } from '../../helpers/authUtils';
import {
    Badge,
    Row,
    Col,
    Card,
    CardBody,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    UncontrolledAlert,
    Spinner,
    UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem
} from 'reactstrap';
import { ChevronDown } from 'react-feather';
import { loadDropdownGeneric } from '../../helpers/form';

import PageTitle from '../../components/PageTitle';

import {
    TEXT_INPUT_REQUIRED,
    NUMBER_INPUT_REQUIRED,
    DROPDOWN_DEFAULT,
} from '../../constants/formValues';

const FormInput = props => {
    return (
        <>
            {props.type === 'select' ? (
                <Input type="select" name={props.name} onChange={props.handleOnChange}>
                    {props.options.map(option => {
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

const CreateItem = () => {
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ status: null, message: '' });

    const [form, setForm] = useState({
        model: DROPDOWN_DEFAULT,
        category: DROPDOWN_DEFAULT,
        page_number: NUMBER_INPUT_REQUIRED,
        item_number: TEXT_INPUT_REQUIRED,
        foreign_id: TEXT_INPUT_REQUIRED,
        item_name: TEXT_INPUT_REQUIRED,
        price: NUMBER_INPUT_REQUIRED,
    });

    const handleOnChange = e => {
        e.persist();
        setForm(prevForm => {
            const updatedForm = { ...prevForm, [e.target.name]: { ...prevForm[e.target.name] } };
            updatedForm[e.target.name].value = e.target.value;
            return updatedForm;
        });
    };

    useEffect(() => {
        loadDropdownGeneric('model', 'model', setForm);
        loadDropdownGeneric('item_category', 'category', setForm);
    }, []);

    const handleFormSubmit = e => {
        setLoading(prevLoading => true);
        setSubmitStatus({ status: null, message: '' });
        e.persist();
        e.preventDefault();
        apiAuth
            .post(
                '/item/create',
                qs.stringify({
                    user_id: getLoggedInUser().id,
                    item_id: `${form.model.value}${form.category.value}${form.page_number.value}${form.item_number.value}`,
                    model_id: form.model.value,
                    item_category_id: form.category.value,
                    page_no: form.page_number.value,
                    item_no: form.item_number.value,
                    foreign_id: form.foreign_id.value,
                    item_name: form.item_name.value,
                    price: form.price.value,
                })
            )
            .then(response => {
                setLoading(prevLoading => false);
                setSubmitStatus({ status: 'success', message: `Item created with number ${response.data}` });
            })
            .catch(err => {
                setLoading(prevLoading => false);
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
                            Create Item
                        </Button>
                    )}
            </>
        );
    };

    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0">Create Item</h4>

                <Row>
                    <Col lg={12}>
                        <Form onSubmit={handleFormSubmit}>
                            <Badge color="success" className="mr-1">
                                Item Code
                            </Badge>
                            <Label>{form.model.value}{form.category.value}{form.page_number.value}{form.item_number.value}</Label>
                            <FormGroup>
                                <Label for="text">Model</Label>
                                <FormInput
                                    {...form['model']}
                                    name="model"
                                    handleOnChange={handleOnChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="text">Category</Label>
                                <FormInput
                                    {...form['category']}
                                    name="category"
                                    handleOnChange={handleOnChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="text">Page Number</Label>
                                <FormInput
                                    {...form['page_number']}
                                    name="page_number"
                                    placeholder="009"
                                    handleOnChange={handleOnChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="text">Item Number</Label>
                                <FormInput
                                    {...form['item_number']}
                                    name="item_number"
                                    placeholder="ZF.1AB"
                                    handleOnChange={handleOnChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="text">Foreign ID</Label>
                                <FormInput
                                    {...form['foreign_id']}
                                    name="foreign_id"
                                    placeholder="1W.AFZFD"
                                    handleOnChange={handleOnChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="text">Item Name</Label>
                                <FormInput
                                    {...form['item_name']}
                                    name="item_name"
                                    placeholder="Piston"
                                    handleOnChange={handleOnChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="text">Price</Label>
                                <FormInput
                                    {...form['price']}
                                    name="price"
                                    placeholder="290000"
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
}

const ItemReports = ({ history }) => {
    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0">Item Reports</h4>
                <UncontrolledDropdown className="d-inline">
                    <DropdownToggle color="info">
                        Reports{' '}
                        <i className="icon">
                            <ChevronDown></ChevronDown>
                        </i>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem
                            onClick={() => {
                                history.push(`/items/all`);
                            }}>
                            All
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </CardBody>
        </Card>
    );
};

const Items = ({ history }) => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[{ label: 'Items', path: '/items', active: true }]}
                        title={'Items'}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <ItemReports history={history} />
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <CreateItem />
                </Col>
            </Row>

            {/* <Row>
                <Col>
                    <ContractSearch />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Commitments />
                </Col>
            </Row>

            <Row>
                <Col>
                    <NewContract />
                </Col>
            </Row> */}
        </React.Fragment>
    );
};

export default Items;
