import React from 'react';
import { Row, Col } from 'reactstrap';

import PageTitle from '../../../components/PageTitle';
import InventoryTransfer from '../../../components/transactions/inventory-transfer/InventoryTransfer';

const InventoryTransferPage = () => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Transactions', path: '/transactions' },
                            { label: 'Purchase Order', path: '#', active: true },
                        ]}
                        title={'Inventory Transfer'}
                    />
                </Col>
            </Row>

            <Row>
                <Col>
                    <InventoryTransfer />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default InventoryTransferPage;