import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';

import PageTitle from '../../../components/PageTitle';
import PurchaseOrder from '../../../components/transactions/purchase-orders/PurchaseOrder';

export default () => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Transactions', path: '/transactions' },
                            { label: 'Purchase Order', path: '#', active: true },
                        ]}
                        title={'Purchase Order'}
                    />
                </Col>
            </Row>

            <Row>
                <Col>
                    <PurchaseOrder />
                </Col>
            </Row>
        </React.Fragment>
    );
};
