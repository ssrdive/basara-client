import React, { useEffect, useState } from 'react';
import { Row, Col, Table } from 'reactstrap';

import { apiAuth } from '../../../basara-api';

import logo from '../../../assets/images/logo.png';

const GoodsReceivedNoteDetailsPage = ({ match }) => {
    const id = match.params.id;

    const [invoice, setInvoice] = useState(null);

    useEffect(() => {
        const fetchDetails = () => {
            apiAuth
                .get(`/transaction/invoice/${id}`)
                .then((res) => {
                    if (res.data === null) setInvoice((prevGoodsReceivedNote) => null);
                    else setInvoice((prevGoodsReceivedNote) => res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        fetchDetails();
    }, [id]);

    return (
        <React.Fragment>
            <Row>
                <Col md={4}>
                    <img alt="FarmGear Logo" src={logo} style={{ width: '80px' }} />
                </Col>
                <Col md={4}></Col>
                <Col md={4}>
                    <h3 style={{ paddingBottom: '0', marginBottom: '0', textAlign: 'right' }}>FarmGear Private Limited</h3>
                    <p style={{ padding: '0', margin: '0', textAlign: 'right' }}>No 67/A, Sirisangabo Place, Polonnaruwa</p>
                    <p style={{ padding: '0', margin: '0', textAlign: 'right' }}>finance@farmgear.lk &nbsp;&nbsp; 9427 222 77 91</p>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <h4>Invoice &mdash; {id}</h4>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    {invoice != null ? (
                        <>
                            <table>
                                <tr>
                                    <td>Issue By :</td>
                                    <td>
                                        <b> {invoice.issued_by}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Warehouse :</td>
                                    <td>
                                        <b> {invoice.warehouse}</b>
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
                            <th>ID</th>
                            <th>Item ID</th>
                            <th>Name</th>
                            <th>Qty</th>
                            <th style={{ textAlign: 'right' }}>Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {invoice !== null ? (
                            <>
                                {invoice.item_details.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.item_id}</td>
                                            <td>{item.item_id_sys}</td>
                                            <td>{item.item_name}</td>
                                            <td>{item.qty}</td>

                                            <td style={{ textAlign: 'right' }}>
                                                {parseFloat(item.price).toLocaleString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </>
                        ) : null}

                        {invoice != null ? (
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
                                        LKR {parseFloat(invoice.price_before_discount).toLocaleString()}
                                    </td>
                                </tr>

                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>Discount</td>
                                    <td style={{ textAlign: 'right' }}>
                                        {invoice.discount} {'%'}
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <b>Sub Total</b>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <b>LKR {parseFloat(invoice.price_after_discount).toLocaleString()}</b>
                                    </td>
                                </tr>
                            </>
                        ) : (
                            ''
                        )}
                        </tbody>
                    </Table>
                    <Row>
                        <Col md={4}>
                            <br />
                            <br />
                            <br />
                            <p style={{ padding: 0, margin: 0 }}>...................................................</p>
                            <p>Authorized Signature</p>
                        </Col>
                        <Col md={4}>
                            <br />
                            <br />
                            <br />
                            <p style={{ padding: 0, margin: 0 }}>...................................................</p>
                            <p>Security Signature</p>
                        </Col>
                        <Col md={4}>
                            <br />
                            <br />
                            <br />
                            <p style={{ padding: 0, margin: 0 }}>...................................................</p>
                            <p>Received Signature</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default GoodsReceivedNoteDetailsPage;