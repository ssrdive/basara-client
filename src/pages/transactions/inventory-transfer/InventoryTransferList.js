import React from 'react';
import { Row, Col } from 'reactstrap';

import PageTitle from '../../../components/PageTitle';
import InventoryTransferList from '../../../components/transactions/inventory-transfer/InventoryTransferList';

const InventoryTransferListPage = () => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Transactions', path: '/transactions' },
                            { label: 'Inventory Transfer List', path: '#', active: true },
                        ]}
                        title={'Inventory Transfer List'}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <InventoryTransferList />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default InventoryTransferListPage;
