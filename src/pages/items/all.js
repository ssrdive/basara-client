import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Spinner, Card, CardBody } from 'reactstrap';
import { apiAuth } from '../../basara-api';

import PageTitle from '../../components/PageTitle';


const AllItems = () => {

    const [items, setItems] = useState(null);

    useEffect(() => {
        const fetchDetails = () => {
            apiAuth
                .get(`/item/all`)
                .then(res => {
                    if (res.data === null) setItems(prevReceipts => []);
                    else setItems(prevReceipts => res.data);
                })
                .catch(err => {
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
                            { label: 'Items', path: '/items' },
                            { label: 'All', path: '/items/all', active: true },
                        ]}
                        title={'All Items'}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <h4 className="header-title mt-0">All Items</h4>

                            {items !== null ? (
                                <Table className="mb-0" responsive={true} striped>
                                    <thead>
                                        <tr>
                                            <th>Item ID</th>
                                            <th>Model ID</th>
                                            <th>Category ID</th>
                                            <th>Page Number</th>
                                            <th>Item Number</th>
                                            <th>Foreign ID</th>
                                            <th>Item Name</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.item_id}</td>
                                                    <td>{item.model_id}</td>
                                                    <td>{item.item_category_id}</td>
                                                    <td>{item.page_no}</td>
                                                    <td>{item.item_no}</td>
                                                    <td>{item.foreign_id}</td>
                                                    <td>{item.item_name}</td>
                                                    <td>{item.price.toLocaleString()}</td>
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

export default AllItems;
