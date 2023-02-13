import React, {useEffect, useState} from 'react';

import {
    Row,
    Col,
    Card,
    CardBody,
    Spinner,
    Table,
} from 'reactstrap';

import PageTitle from '../../components/PageTitle';
import {apiAuth} from "../../basara-api";
import {Link} from "react-router-dom";

const AccountLedgerPage = () => {
    const [balances, setBalances] = useState(null);

    useEffect(() => {
        const fetchDetails = () => {
            apiAuth
                .get(`/businesspartner/balances`)
                .then((res) => {
                    if (res.data === null) setBalances((prevReceipts) => []);
                    else setBalances((prevReceipts) => res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        fetchDetails();
    }, []);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Business Partners', path: '/business-partners' },
                            { label: 'Balances', path: '#', active: true },
                        ]}
                        title={'BP Balances'}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <h4 className="header-title mt-0">BP Balances</h4>

                            {balances !== null ? (
                                <Table className="mb-0" responsive={true} striped>
                                    <thead>
                                    <tr>
                                        <th>Business Partner</th>
                                        <th>Balance as at Today</th>
                                        <th>Balance</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {balances.map((balance, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <Link to={'/business-partners/balance/' + balance.id}>{balance.name}</Link>
                                                </td>
                                                <td>{'LKR'} {balance.balance_today.toLocaleString()}</td>
                                                <td>{'LKR'} {balance.balance.toLocaleString()}</td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </Table>
                            ) : (
                                <Spinner type="grow" color="primary" />
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default AccountLedgerPage;