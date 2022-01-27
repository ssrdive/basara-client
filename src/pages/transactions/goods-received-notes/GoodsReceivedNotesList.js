import React from 'react';
import { Row, Col } from 'reactstrap';

import PageTitle from '../../../components/PageTitle';
import GoodsReceivedNoteList from '../../../components/transactions/goods-received-notes/GoodReceivedNoteList';

const GoodsReceivedNoteListPage = () => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Transactions', path: '/transactions' },
                            { label: 'Goods Received Note List', path: '#', active: true },
                        ]}
                        title={'Goods Received Note List'}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <GoodsReceivedNoteList />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default GoodsReceivedNoteListPage;
