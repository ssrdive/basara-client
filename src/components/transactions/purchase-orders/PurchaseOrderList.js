import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Table, Spinner } from 'reactstrap';

import { apiAuth } from '../../../basara-api';

export default () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading((prevLoading) => true);
        apiAuth
            .get(`/transaction/purchaseorder/list`)
            .then((res) => {
                setLoading((prevLoading) => false);
                if (res.data === null) setResults((prevResults) => []);
                else setResults((prevResults) => res.data);
            })
            .catch((err) => {
                setLoading((prevLoading) => false);
                console.log(err);
            });
    }, []);

    let debits = 0;
    let credits = 0;
    let balance = 0;

    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0 mb-1">Purchase Order List</h4>
                <Table className="mb-0" responsive={true} striped>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Supplier</th>
                            <th>Warehouse</th>
                            <th>Total Order Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <Link to={`/transactions/purchase-order/${result.order_id}`}>
                                            {result.order_id}
                                        </Link>
                                    </td>
                                    <td>{result.supplier}</td>
                                    <td>{result.warehouse}</td>
                                    <td>
                                        <b>LKR {result.total_price.toLocaleString()}</b>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                {loading ? <Spinner color="primary" type="grow" /> : null}
            </CardBody>
        </Card>
    );
};
