import React from 'react';
import { Row, Col } from 'reactstrap';

import PageTitle from '../../../components/PageTitle';
import GoodReceivedNote from '../../../components/transactions/goods-received-notes/GoodReceivedNote';

const GoodsReceivedNotesPage = () => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Transactions', path: '/transactions' },
                            { label: 'Goods Received Note', path: '#', active: true },
                        ]}
                        title={'Goods Received Note'}
                    />
                </Col>
            </Row>

            <Row>
                <Col>
                    <GoodReceivedNote />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default GoodsReceivedNotesPage;