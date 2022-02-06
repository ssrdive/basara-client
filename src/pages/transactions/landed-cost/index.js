import React from 'react';
import { Card, CardBody, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import { ChevronDown } from 'react-feather';

const LandedCostCard = ({ history }) => {
    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0">Landed Costs</h4>
                <UncontrolledDropdown className="d-inline">
                    <DropdownToggle color="info">
                        Landed Costs{' '}
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

export default LandedCostCard;