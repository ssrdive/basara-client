import React from 'react';
import { Row, Col } from 'reactstrap';

import PageTitle from '../../../components/PageTitle';
import PurchaseOrderList from '../../../components/transactions/purchase-orders/PurchaseOrderList';

const PurchaseOrderListPage = () => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Transactions', path: '/transactions' },
                            { label: 'Purchase Orders List', path: '#', active: true },
                        ]}
                        title={'Purchase Orders List'}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <PurchaseOrderList />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default PurchaseOrderListPage;
