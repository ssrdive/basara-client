import React, { useState, useEffect } from 'react';
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
    DROPDOWN_DEFAULT, 
    TEXT_INPUT_OPTIONAL, NUMBER_INPUT_OPTIONAL
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

const Create = () => {
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ status: null, message: '' });

    const [form, setForm] = useState({
        type: DROPDOWN_DEFAULT,
        name: TEXT_INPUT_REQUIRED,
        address: TEXT_INPUT_OPTIONAL,
        telephone: NUMBER_INPUT_OPTIONAL,
        email: TEXT_INPUT_REQUIRED,
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
        loadDropdownGeneric('business_partner_type', 'type', setForm);
        loadDropdownGeneric('item_category', 'category', setForm);
    }, []);

    const handleFormSubmit = e => {
        setLoading(prevLoading => true);
        setSubmitStatus({ status: null, message: '' });
        e.persist();
        e.preventDefault();
        apiAuth
            .post(
                '/businesspartner/create',
                qs.stringify({
                    user_id: getLoggedInUser().id,
                    business_partner_type_id: form.type.value,
                    name: form.name.value,
                    address: form.address.value,
                    telephone: form.telephone.value,
                    email: form.email.value
                })
            )
            .then(response => {
                setLoading(prevLoading => false);
                setSubmitStatus({ status: 'success', message: `Business partner created with number ${response.data}` });
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
                            Create
                        </Button>
                    )}
            </>
        );
    };

    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0">Create Business Partner</h4>

                <Row>
                    <Col lg={12}>
                        <Form onSubmit={handleFormSubmit}>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="text">Type</Label>
                                        <FormInput
                                            {...form['type']}
                                            name="type"
                                            handleOnChange={handleOnChange}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="text">Name</Label>
                                        <FormInput
                                            {...form['name']}
                                            name="name"
                                            placeholder="J I Hydraulic Co"
                                            handleOnChange={handleOnChange}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="text">Address</Label>
                                        <FormInput
                                            {...form['address']}
                                            name="address"
                                            placeholder="46-34, Gyeongsangnam-do, Korea"
                                            handleOnChange={handleOnChange}
                                        />
                                    </FormGroup>
                                    <SubmitComponent />
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="text">Telephone</Label>
                                        <FormInput
                                            {...form['telephone']}
                                            name="telephone"
                                            placeholder="768237192"
                                            handleOnChange={handleOnChange}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="text">Email</Label>
                                        <FormInput
                                            {...form['email']}
                                            name="email"
                                            placeholder="info@farmgear.lk"
                                            handleOnChange={handleOnChange}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
}

export default () => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Business Partners', path: '/business-partners', active: true },
                        ]}
                        title={'Business Partners'}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    
                </Col>
                <Col md={8}>
                    <Create />
                </Col>
            </Row>
        </React.Fragment>
    );
};
