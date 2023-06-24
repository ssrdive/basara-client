import React, { useEffect, useState } from 'react';
import { Row, Col, Table } from 'reactstrap';

import { apiAuth } from '../../../basara-api';

import logo from '../../../assets/images/logo.png';

const GoodsReceivedNoteDetailsPage = ({ match }) => {
    const id = match.params.id;

    const [inventoryTransfer, setInventoryTransfer] = useState(null);

    useEffect(() => {
        const fetchDetails = () => {
            apiAuth
                .get(`/transaction/inventorytransfer/${id}`)
                .then((res) => {
                    if (res.data === null) setInventoryTransfer((prevGoodsReceivedNote) => null);
                    else setInventoryTransfer((prevGoodsReceivedNote) => res.data);
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
                    <h4>Inventory Transfer &mdash; {id}</h4>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    {inventoryTransfer != null ? (
                        <>
                            <table>
                                <tr>
                                    <td>Created :</td>
                                    <td>
                                        <b> {inventoryTransfer.created}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>From Warehouse :</td>
                                    <td>
                                        <b> {inventoryTransfer.from_warehouse}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>To Warehouse :</td>
                                    <td>
                                        <b> {inventoryTransfer.to_warehouse}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Resolution :</td>
                                    <td>
                                        <b> {inventoryTransfer.resolution}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Resolved By :</td>
                                    <td>
                                        <b> {inventoryTransfer.resolved_by}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Resolved On :</td>
                                    <td>
                                        <b> {inventoryTransfer.resolved_on}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Resolved Remarks :</td>
                                    <td>
                                        <b> {inventoryTransfer.resolution_remarks}</b>
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
                        </tr>
                        </thead>
                        <tbody>
                        {inventoryTransfer !== null ? (
                            <>
                                {inventoryTransfer.transfer_items.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.item_id}</td>
                                            <td>{item.item_id_sys}</td>
                                            <td>{item.item_name}</td>
                                            <td>{item.qty}</td>
                                        </tr>
                                    );
                                })}
                            </>
                        ) : null}
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