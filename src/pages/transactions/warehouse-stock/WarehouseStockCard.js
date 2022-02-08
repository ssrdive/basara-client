import React, { useEffect, useState } from 'react';
import { Card, CardBody, Label, Col, FormGroup, Button } from 'reactstrap';
import { DROPDOWN_DEFAULT } from '../../../constants/formValues';
import FormInput from '../../../components/form/FormInput';

import { loadDropdownConditionGeneric } from '../../../helpers/form';

const WarehouseStockCard = ({ history }) => {

    const [form, setForm] = useState({
        view_stock_warehouse_id: DROPDOWN_DEFAULT,
    });

    useEffect(() => {
        loadDropdownConditionGeneric('business_partner', 'view_stock_warehouse_id', 'business_partner_type_id', 5, setForm);
    }, [])

    const handleOnChange = (e) => {
        e.persist();
        setForm((prevForm) => {
            const updatedForm = { ...prevForm, [e.target.name]: { ...prevForm[e.target.name] } };
            updatedForm[e.target.name].value = e.target.value;
            return updatedForm;
        });
    };

    const submitViewStockButton = (e) => {
        e.persist();
        e.preventDefault();
        history.push(`/transactions/stock?warehouse=${form.view_stock_warehouse_id.value}`);
    }

    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0">Warehouse Stock</h4>
                <Label for="text">Warehouse</Label>
                <FormGroup>
                    <FormInput
                        {...form['view_stock_warehouse_id']}
                        name="view_stock_warehouse_id"
                        handleOnChange={handleOnChange}
                    />
                </FormGroup>
                <Button color="success" type="submit" onClick={submitViewStockButton}>View Stock</Button>
                {/* <UncontrolledDropdown className="d-inline"> */}
                {/* <DropdownToggle color="info">
                        Warehouse Stock{' '}
                        <i className="icon">
                            <ChevronDown></ChevronDown>
                        </i>
                    </DropdownToggle> */}
                {/* <DropdownMenu>
                        <DropdownItem
                            onClick={() => {
                                history.push(`/transactions/landed-cost`);
                            }}>
                            Create
                        </DropdownItem>
                    </DropdownMenu> */}
                {/* </UncontrolledDropdown> */}
            </CardBody>
        </Card>
    );
};

export default WarehouseStockCard;