import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Table } from 'reactstrap';

import { apiAuth } from '../../../basara-api';

export default ({ match }) => {
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

    const submitFormHandler = (e) => {
        e.persist();
        e.preventDefault();
    };

    return (
        <React.Fragment>
            <Row>
                <Col md={4}>{/* <img alt="Agrivest Logo" src={logo} style={{ width: '80px' }} /> */}</Col>
                <Col md={4}></Col>
                <Col md={4}>
                    <h3 style={{ paddingBottom: '0', marginBottom: '0' }}>Agrivest Private Limited</h3>
                    <p style={{ padding: '0', margin: '0' }}>Hospital Junction Polonnaruwa</p>
                    <p style={{ padding: '0', margin: '0' }}>info@agrivest.lk &nbsp;&nbsp; 9427 222 22 79</p>
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
                                <th>Discount</th>
                                <th style={{ textAlign: 'center' }}>Amount</th>
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
                                                <td>
                                                    {item.discount_amount.String}
                                                    {item.discount_type.String == 'per' ? '%' : ''}
                                                </td>
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
                                        <td></td>
                                        <td style={{ textAlign: 'right' }}>
                                            LKR {purchaseOrder.price_before_discount.String}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td></td>
                                        <td>Discount</td>
                                        <td>
                                            {purchaseOrder.discount_amount.String}
                                            {purchaseOrder.discount_type.String === 'per' ? '%' : ''}
                                        </td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <b>Sub Total</b>
                                        </td>
                                        <td></td>
                                        <td></td>
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
                    <Button color="success" type="submit" onClick={submitFormHandler}>
                        Copy to BRN
                    </Button>
                </Col>
            </Row>
        </React.Fragment>
    );
};
