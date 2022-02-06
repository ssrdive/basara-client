import React from 'react';
import { Row, Col } from 'reactstrap';

import PageTitle from '../../../components/PageTitle';
import LandedCost from '../../../components/transactions/landed-cost/LandedCost';

const LandedCostPage = () => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Transactions', path: '/transactions' },
                            { label: 'Landed Cost', path: '#', active: true },
                        ]}
                        title={'Landed Cost'}
                    />
                </Col>
            </Row>

            <Row>
                <Col>
                    <LandedCost />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default LandedCostPage;