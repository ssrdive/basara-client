import React from 'react';
import { Row, Col } from 'reactstrap';

import PageTitle from '../../components/PageTitle';
import PurchaseOrder from './purchase-orders';
import GoodsReceivedNotes from './goods-received-notes';
import LandedCost from './landed-cost';

export default ({ history }) => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[{ label: 'Transactions', path: '/transactions', active: true }]}
                        title={'Transactions'}
                    />
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <Row md={12}>
                        <Col md={12}>
                            <PurchaseOrder history={history} />
                        </Col>
                    </Row>
                </Col>
                <Col md={4}>
                    <Row md={12}>
                        <Col md={12}>
                            <GoodsReceivedNotes history={history} />
                        </Col>
                    </Row>
                </Col>
                <Col md={4}>
                    <Row md={12}>
                        <Col md={12}>
                            <LandedCost history={history} />
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row></Row>
        </React.Fragment>
    );
};
