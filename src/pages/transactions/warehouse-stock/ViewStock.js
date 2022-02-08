import React from 'react';
import { Row, Col } from 'reactstrap';

import PageTitle from '../../../components/PageTitle';
import ViewStock from '../../../components/transactions/warehouse-stock/ViewStock';

const ViewStockPage = ({ location }) => {

    const params = new URLSearchParams(location.search);
    const warehouse_id = params.get("warehouse");

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Transactions', path: '/transactions' },
                            { label: 'View Stock', path: '#', active: true },
                        ]}
                        title={'View Stock'}
                    />
                </Col>
            </Row>

            <Row>
                <Col>
                    <ViewStock warehouse_id={warehouse_id} />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default ViewStockPage;