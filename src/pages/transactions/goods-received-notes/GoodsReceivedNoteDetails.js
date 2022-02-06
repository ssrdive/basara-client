import React, { useEffect, useState } from 'react';
import { Row, Col, Table } from 'reactstrap';

import { apiAuth } from '../../../basara-api';

const GoodsReceivedNoteDetailsPage = ({ match }) => {
    const id = match.params.id;

    const [goodsReceivedNote, setGoodsReceivedNote] = useState(null);

    useEffect(() => {
        const fetchDetails = () => {
            apiAuth
                .get(`/transaction/goodsreceivednote/${id}`)
                .then((res) => {
                    if (res.data === null) setGoodsReceivedNote((prevGoodsReceivedNote) => null);
                    else setGoodsReceivedNote((prevGoodsReceivedNote) => res.data);
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
                    <h4>Goods Received Note &mdash; {id}</h4>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    {goodsReceivedNote != null ? (
                        <>
                            <table>
                                <tr>
                                    <td>Order Date :</td>
                                    <td>
                                        <b> {goodsReceivedNote.order_date.String}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Supplier :</td>
                                    <td>
                                        <b> {goodsReceivedNote.supplier.String}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Warehouse :</td>
                                    <td>
                                        <b> {goodsReceivedNote.warehouse.String}</b>
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
                            {goodsReceivedNote !== null ? (
                                <>
                                    {goodsReceivedNote.grn_item_details.map((item, index) => {
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

                            {goodsReceivedNote != null ? (
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
                                            LKR {goodsReceivedNote.price_before_discount.String}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>Discount</td>
                                        <td style={{ textAlign: 'right' }}>
                                            {goodsReceivedNote.discount_amount.String}
                                            {goodsReceivedNote.discount_type.String === 'per' ? '%' : ''}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <b>Sub Total</b>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <b>LKR {goodsReceivedNote.total_price.String}</b>
                                        </td>
                                    </tr>
                                </>
                            ) : (
                                ''
                            )}
                        </tbody>
                    </Table>
                    {goodsReceivedNote !== null ? (
                        <>
                            <table>
                                <tr>
                                    <td>Remarks :</td>
                                    <td>
                                        <b>{goodsReceivedNote.remarks.String}</b>
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
        </React.Fragment>
    );
};

export default GoodsReceivedNoteDetailsPage;