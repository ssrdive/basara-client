import React from 'react';
import { Row, Col } from 'reactstrap';

import PageTitle from '../../components/PageTitle';


export default () => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Transactions', path: '/transactions', active: true },
                        ]}
                        title={'Transactions'}
                    />
                </Col>
            </Row>
        </React.Fragment>
    );
};
