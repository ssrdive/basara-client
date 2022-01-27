import React from 'react';
import { Card, CardBody, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import { ChevronDown } from 'react-feather';

const GoodsReceivedNotesCard = ({ history }) => {
    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0">Received Notes</h4>
                <UncontrolledDropdown className="d-inline">
                    <DropdownToggle color="info">
                        Goods Received Notes{' '}
                        <i className="icon">
                            <ChevronDown></ChevronDown>
                        </i>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem
                            onClick={() => {
                                history.push(`/transactions/goods-received-note`);
                            }}>
                            Create
                        </DropdownItem>
                        <DropdownItem
                            onClick={() => {
                                history.push(`/transactions/goods-received-note/list`);
                            }}>
                            View All
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </CardBody>
        </Card>
    );
};

export default GoodsReceivedNotesCard;