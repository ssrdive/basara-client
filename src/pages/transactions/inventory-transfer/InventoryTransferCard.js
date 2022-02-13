import React from 'react';
import { Card, CardBody, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import { ChevronDown } from 'react-feather';

const InventoryTransferCard = ({ history }) => {
    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0">Inventory Transfer</h4>
                <UncontrolledDropdown className="d-inline">
                    <DropdownToggle color="info">
                        Inventory Transfer{' '}
                        <i className="icon">
                            <ChevronDown></ChevronDown>
                        </i>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem
                            onClick={() => {
                                history.push(`/transactions/inventory-transfer`);
                            }}>
                            Create
                        </DropdownItem>
                        <DropdownItem
                            onClick={() => {
                                history.push(`/transactions/inventory-transfer/list`);
                            }}>
                            View All
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </CardBody>
        </Card>
    );
};

export default InventoryTransferCard;