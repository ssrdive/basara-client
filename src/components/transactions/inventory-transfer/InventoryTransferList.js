import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Table, Spinner } from 'reactstrap';

import { apiAuth } from '../../../basara-api';

const InventoryTransferList = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading((prevLoading) => true);
        apiAuth
            .get(`/transaction/inventorytransfer/list`)
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
    
    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0 mb-1">Inventory Transfer List</h4>
                <Table className="mb-0" responsive={true} striped>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Created</th>
                            <th>Issuer</th>
                            <th>From Warehouse</th>
                            <th>To Warehouse</th>
                            <th>Resolution</th>
                            <th>Resolved By</th>
                            <th>Resolved On</th>
                            <th>Resolution Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <Link to={`/transactions/inventory-transfer/${result.inventory_transfer_id}`}>
                                            {result.inventory_transfer_id}
                                        </Link>
                                    </td>
                                    <td>{result.created}</td>
                                    <td>{result.issuer}</td>
                                    <td>{result.from_warehouse}</td>
                                    <td>{result.to_warehouse}</td>
                                    <td>{result.resolution.String}</td>
                                    <td>{result.resolved_by.String}</td>
                                    <td>{result.resolved_on.String}</td>
                                    <td>{result.resolution_remarks.String}</td>
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

export default InventoryTransferList;