import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';

import PageTitle from '../../components/PageTitle';
import OrderForm from './OrderForm';

export default () => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[{ label: 'Purchase Order', path: '/purchase-order', active: true }]}
                        title={'Purchase Order'}
                    />
                </Col>
            </Row>

            <Row>
                <Col>
                    <OrderForm />
                </Col>
            </Row>
        </React.Fragment>
    );
};
