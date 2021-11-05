import React from 'react';
import { Card, CardBody, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import { ChevronDown } from 'react-feather';

export default ({ history }) => {
    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0">Purchase Orders</h4>
                <UncontrolledDropdown className="d-inline">
                    <DropdownToggle color="info">
                        Orders{' '}
                        <i className="icon">
                            <ChevronDown></ChevronDown>
                        </i>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem
                            onClick={() => {
                                history.push(`/transactions/purchase-order`);
                            }}>
                            Create
                        </DropdownItem>
                        <DropdownItem
                            onClick={() => {
                                history.push(`/transactions/purchase-order/list`);
                            }}>
                            View All
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </CardBody>
        </Card>
    );
};
