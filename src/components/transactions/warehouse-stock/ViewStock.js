import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Table, Spinner } from 'reactstrap';

import { apiAuth } from '../../../basara-api';

const ViewStock = ({warehouse_id}) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading((prevLoading) => true);
        apiAuth
            .get(`/transaction/warehousestock/${warehouse_id}`)
            .then((res) => {
                setLoading((prevLoading) => false);
                console.log(res.data);
                if (res.data === null) setResults((prevResults) => []);
                else setResults((prevResults) => res.data);
            })
            .catch((err) => {
                setLoading((prevLoading) => false);
                console.log(err);
            });
    }, []);

    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0 mb-1">View Stock</h4>
                <Table className="mb-0" responsive={true} striped>
                    <thead>
                        <tr>
                            <th>Warehouse Name</th>
                            <th>Item ID</th>
                            <th>Foreign ID</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => {
                            return (
                                <tr key={index}>
                                    <td>{result.warehouse_name}</td>
                                    <td><Link to={`/items/edit/${result.id}`} className="subject">{result.item_id}</Link></td>
                                    <td>{result.foreign_id}</td>
                                    <td>{result.item_name}</td>
                                    <td>{result.quantity}</td>
                                    <td>{result.price.toLocaleString()}</td>
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

export default ViewStock;