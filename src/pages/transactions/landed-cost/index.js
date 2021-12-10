import React from 'react';
import { Card, CardBody, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import { ChevronDown } from 'react-feather';

export default ({ history }) => {
    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0">Landed Cost</h4>
                <UncontrolledDropdown className="d-inline">
                    <DropdownToggle color="info">
                        Landed Cost{' '}
                        <i className="icon">
                            <ChevronDown></ChevronDown>
                        </i>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem
                            onClick={() => {
                                history.push(`/transactions/landed-cost`);
                            }}>
                            Create
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </CardBody>
        </Card>
    );
};
