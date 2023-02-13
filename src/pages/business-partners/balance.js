import React, {useEffect, useState} from 'react';
import {Row, Col, Card, CardBody, Table, Spinner} from 'reactstrap';

import PageTitle from '../../components/PageTitle';
import AccountLedger from '../../components/financials/AccountLedger';
import {Link} from "react-router-dom";
import {apiAuth} from "../../basara-api";

const BusinessPartnerBalancePage = ({ match }) => {
    const id = match.params.id;

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading((prevLoading) => true);
        apiAuth
            .get(`/businesspartner/balance/${id}`)
            .then((res) => {
                setLoading((prevLoading) => false);
                if (res.data === null) setResults((prevResults) => []);
                else setResults((prevResults) => res.data);
            })
            .catch((err) => {
                setLoading((prevLoading) => false);
                console.log(err);
            });
    }, [id]);

    let balance = 0;

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Business Partners', path: '/business-partners' },
                            { label: 'Balance', path: '#', active: true },
                        ]}
                        title={'Business Partners'}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <h4 className="header-title mt-0">BP Balance</h4>

                            <Table className="mb-0" responsive={true} striped>
                                <thead>
                                <tr>
                                    <th>BP Name</th>
                                    <th>Transaction ID</th>
                                    <th>Posting Date</th>
                                    <th>Effective Date</th>
                                    <th>DR</th>
                                    <th>CR</th>
                                    <th>Balance</th>
                                    <th>Remark</th>
                                </tr>
                                </thead>
                                <tbody>
                                {results.map((result, index) => {
                                    if (result.type === 'DR') {
                                        balance = balance + parseFloat(result.amount);
                                    } else {
                                        balance = balance - parseFloat(result.amount);
                                    }
                                    return (
                                        <tr key={index}>
                                            <td>{result.bp_name}</td>
                                            <Link to={'/financials/transaction/' + result.transaction_id}>
                                                <td>{result.transaction_id}</td>
                                            </Link>
                                            <td>{result.posting_date}</td>
                                            <td>{result.effective_date}</td>
                                            <td>
                                                {result.type === 'DR' ? (
                                                    <>
                                                        {'LKR'} {result.amount.toLocaleString()}
                                                    </>
                                                ) : null}
                                            </td>
                                            <td>
                                                {result.type === 'CR' ? (
                                                    <>
                                                        {'LKR'} {result.amount.toLocaleString()}
                                                    </>
                                                ) : null}
                                            </td>
                                            <td>
                                                <b>LKR {balance.toLocaleString()}</b>
                                            </td>
                                            <td>{result.remark}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </Table>
                            {loading ? <Spinner color="primary" type="grow" /> : null}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default BusinessPartnerBalancePage;