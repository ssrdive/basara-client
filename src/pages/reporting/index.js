import React from 'react';
import { Row, Col } from 'reactstrap';

import PageTitle from '../../components/PageTitle';
import InvoiceSearch from '../../components/reporting/InvoiceSearch';

const ReportingPage = ({ history }) => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[{ label: 'Reporting', path: '/reporting', active: true }]}
                        title={'Reporting'}
                    />
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <Row md={12}>
                        <Col md={12}>
                            <InvoiceSearch history={history} />
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* <Row>
                <Col md={4}>
                    <Row md={12}>
                        <Col md={12}>
                            <InventoryTransferCard history={history} />
                        </Col>
                    </Row>
                </Col>
                <Col md={4}>
                    <Row md={12}>
                        <Col md={12}>
                            <WarehouseStockCard history={history} />
                        </Col>
                    </Row>
                </Col>
            </Row> */}

            <Row></Row>
        </React.Fragment>
    );
};

export default ReportingPage;