import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Table } from 'reactstrap';
import { Link } from 'react-router-dom';

import { apiAuth } from '../../../basara-api';

const PurchaseOrderDetailsPage = ({ match }) => {
    const id = match.params.id;

    const [purchaseOrder, setPurchaseOrder] = useState(null);

    useEffect(() => {
        const fetchDetails = () => {
            apiAuth
                .get(`/transaction/purchaseorder/${id}`)
                .then((res) => {
                    if (res.data === null) setPurchaseOrder((prevPurchaseOrder) => null);
                    else setPurchaseOrder((prevPurchaseOrder) => res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        fetchDetails();
    }, [id]);

    // const submitFormHandler = (e) => {
    //     e.persist();
    //     e.preventDefault();

    // };

    return (
        <React.Fragment>
            <Row>
                {/* <Col md={4}>
                    <img alt="FarmGear Logo" src={logo} style={{ width: '80px' }} />
                </Col> */}
                <Col md={4}></Col>
                <Col md={4}>
                    <h3 style={{ paddingBottom: '0', marginBottom: '0' }}>FarmGear Private Limited</h3>
                    <p style={{ padding: '0', margin: '0' }}>No 67/A, Sirisangabo Place, Polonnaruwa</p>
                    <p style={{ padding: '0', margin: '0' }}>finance@farmgear.lk &nbsp;&nbsp; 9427 222 77 91</p>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <h4>Purchase Order &mdash; {id}</h4>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    {purchaseOrder != null ? (
                        <>
                            <table>
                                <tr>
                                    <td>Order Date :</td>
                                    <td>
                                        <b> {purchaseOrder.order_date.String}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Supplier :</td>
                                    <td>
                                        <b> {purchaseOrder.supplier.String}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Warehouse :</td>
                                    <td>
                                        <b> {purchaseOrder.warehouse.String}</b>
                                    </td>
                                </tr>
                            </table>
                        </>
                    ) : (
                        ''
                    )}

                    <Table>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Unit Price</th>
                                <th>Quantity</th>
                                <th style={{ textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseOrder !== null ? (
                                <>
                                    {purchaseOrder.order_item_details.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item.item_name.String}</td>
                                                <td>{item.unit_price.String}</td>
                                                <td>{item.quantity.String}</td>
                                                <td style={{ textAlign: 'right' }}>
                                                    {item.total_price.String.toLocaleString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </>
                            ) : null}

                            {purchaseOrder != null ? (
                                <>
                                    <tr>
                                        <td colSpan="5">
                                            <hr />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td style={{ textAlign: 'right' }}>
                                            LKR {purchaseOrder.price_before_discount.String}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>Discount</td>
                                        <td style={{ textAlign: 'right' }}>
                                            {purchaseOrder.discount_amount.String}
                                            {purchaseOrder.discount_type.String === 'per' ? '%' : ''}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <b>Sub Total</b>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <b>LKR {purchaseOrder.total_price.String}</b>
                                        </td>
                                    </tr>
                                </>
                            ) : (
                                ''
                            )}
                        </tbody>
                    </Table>
                    {purchaseOrder !== null ? (
                        <>
                            <table>
                                <tr>
                                    <td>Remarks :</td>
                                    <td>
                                        <b>{purchaseOrder.remarks.String}</b>
                                    </td>
                                </tr>
                            </table>
                        </>
                    ) : null}
                    <Row>
                        <Col md={6}>
                            <br />
                            <br />
                            <br />
                            <p style={{ padding: 0, margin: 0 }}>...................................................</p>
                            <p>Authorized Signature</p>
                        </Col>
                        <Col md={6}>
                            <br />
                            <br />
                            <br />
                            <p style={{ padding: 0, margin: 0 }}>...................................................</p>
                            <p>Received Signature</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Link to={`/transactions/goods-received-note-copy/${id}`}>
                        <Button color="success">Copy to GRN</Button>
                    </Link>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default PurchaseOrderDetailsPage;