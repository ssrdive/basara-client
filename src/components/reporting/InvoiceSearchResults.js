import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Table, Spinner } from 'reactstrap';

const InvoiceSearchResults = ({ results, loading }) => {
    console.log(results)
    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0 mb-1">Receipt Search</h4>
                <Table className="mb-0" responsive={true} striped>
                    <thead>
                        <tr>
                            <th>Invoice ID</th>
                            <th>Created</th>
                            <th>Issuer</th>
                            <th>Location</th>
                            <th>Cost Price</th>
                            <th>Price Before Discount</th>
                            <th>Discount</th>
                            <th>Price</th>
                            <th>Customer</th>
                            <th>Customer Contact</th>
                        </tr>
                    </thead>

                    <tbody>
                        {results.map((result, index) => {
                            return (
                                <tr key={index}>
                                    <td><Link to={`/reporting/invoiceinfo/${result.id}`}>{result.id}</Link></td>
                                    <td>{result.created}</td>
                                    <td>{result.issuer}</td>
                                    <td>{result.issuing_location}</td>
                                    <td>{result.cost_price.toLocaleString()}</td>
                                    <td>{result.price_before_discount.toLocaleString()}</td>
                                    <td>{result.discount.toLocaleString()}</td>
                                    <td>{result.price_after_discount.toLocaleString()}</td>
                                    <td>{result.customer_name}</td>
                                    <td>{result.customer_contact}</td>
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

export default InvoiceSearchResults;