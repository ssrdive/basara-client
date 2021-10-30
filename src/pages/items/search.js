import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, CardBody, Table, Spinner } from 'reactstrap';

import PageTitle from '../../components/PageTitle';
import { apiAuth } from '../../basara-api';

export default ({ location }) => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');

    const [items, setItems] = useState(null);

    useEffect(() => {
        const fetchDetails = () => {
            apiAuth
                .get(`/item/search?search=${search}`)
                .then((res) => {
                    if (res.data === null) setItems((prevReceipts) => []);
                    else setItems((prevReceipts) => res.data);
                })
                .catch((err) => {
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
                            { label: 'Search', path: '#', active: true },
                        ]}
                        title={'Item Search'}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <h4 className="header-title mt-0">Search Results</h4>

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
                                                    <td>
                                                        <Link to={'/items/edit/' + item.id}>{item.item_id}</Link>
                                                    </td>
                                                    <td>{item.model_id}</td>
                                                    <td>{item.item_category_id}</td>
                                                    <td>{item.page_no}</td>
                                                    <td>{item.item_no}</td>
                                                    <td>{item.foreign_id}</td>
                                                    <td>{item.name}</td>
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
