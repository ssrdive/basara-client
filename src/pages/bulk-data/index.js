import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Button, Table, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import { apiAuth } from '../../basara-api';
import { getLoggedInUser } from '../../helpers/authUtils';

class BulkData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            errors: [],
            isUploading: false,
            isComparing: false,
            isSubmitting: false,
            successMessage: '',
            comparisonResults: [],
            activeTab: '1',
            pendingReports: [],
            isLoadingReports: false,
            selectedReportDetails: null,
            isLoadingDetails: false,
            selectedReportId: null
        };
    }

    componentDidMount() {
        this.fetchPendingReports();
    }

    toggleTab = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({ activeTab: tab, selectedReportDetails: null });
            if (tab === '2') {
                this.fetchPendingReports();
            }
        }
    }

    fetchPendingReports = async () => {
        this.setState({ isLoadingReports: true });
        try {
            const response = await apiAuth.get('/bulk/stock/reports');
            this.setState({ pendingReports: response.data || [], isLoadingReports: false });
        } catch (error) {
            console.error('Error fetching reports:', error);
            this.setState({ isLoadingReports: false });
        }
    }

    fetchReportDetails = async (reportId) => {
        this.setState({ isLoadingDetails: true, selectedReportId: reportId, selectedReportDetails: null });
        try {
            const response = await apiAuth.get(`/bulk/stock/reports/${reportId}`);
            this.setState({ selectedReportDetails: response.data || [], isLoadingDetails: false });
        } catch (error) {
            console.error('Error fetching report details:', error);
            this.setState({ isLoadingDetails: false });
        }
    }

    handleSubmitReport = async () => {
        if (!this.state.selectedFile) {
            alert('Please select a file first.');
            return;
        }

        this.setState({ isSubmitting: true, errors: [], successMessage: '' });

        const formData = new FormData();
        formData.append('file', this.state.selectedFile);
        formData.append('user_id', getLoggedInUser().id);

        try {
            const response = await apiAuth.post('/bulk/stock/submit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data && Array.isArray(response.data) && response.data.length > 0 && response.data[0].row !== undefined) {
                // Formatting errors from the array returned by backend
                this.setState({ errors: response.data, isSubmitting: false });
            } else {
                this.setState({
                    successMessage: 'Report submitted successfully!',
                    isSubmitting: false,
                    selectedFile: null,
                    comparisonResults: [],
                });
                alert('Report submitted successfully!');
                this.toggleTab('2'); // Switch to reports tab
            }

        } catch (error) {
            console.error('Error submitting report:', error);
            this.setState({
                isSubmitting: false,
                errors: [{ row: 0, error: 'An error occurred while submitting the report.' }]
            });
        }
    }

    handleActionReport = async (action) => {
        if (!this.state.selectedReportId) return;

        const confirmAction = window.confirm(`Are you sure you want to ${action.toLowerCase()} this report?`);
        if (!confirmAction) return;

        this.setState({ isLoadingDetails: true });

        try {
            await apiAuth.put(`/bulk/stock/reports/${this.state.selectedReportId}/${action.toLowerCase()}`, {
                user_id: parseInt(getLoggedInUser().id)
            });
            alert(`Report ${action.toLowerCase()}ed successfully!`);

            // Refresh details view and list view
            await this.fetchPendingReports();
            await this.fetchReportDetails(this.state.selectedReportId);
        } catch (error) {
            console.error(`Error trying to ${action} report:`, error);
            const errorMsg = error.response && error.response.data ? error.response.data : error.message;
            alert(`An error occurred: ${errorMsg}`);
            this.setState({ isLoadingDetails: false });
        }
    }

    handleFileChange = (event) => {
        this.setState({
            selectedFile: event.target.files[0],
            errors: [],
            successMessage: '',
            comparisonResults: []
        });
    }

    handleUploadAndVerify = async () => {
        if (!this.state.selectedFile) {
            alert('Please select a file first.');
            return;
        }

        this.setState({ isUploading: true, errors: [], successMessage: '', comparisonResults: [] });

        const formData = new FormData();
        formData.append('file', this.state.selectedFile);

        try {
            const response = await apiAuth.post('/bulk/stock/verify', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data && response.data.length > 0) {
                // Formatting errors from the array returned by backend
                this.setState({ errors: response.data, isUploading: false });
            } else {
                this.setState({ successMessage: 'File verified successfully! No errors found.', isUploading: false });
            }

        } catch (error) {
            console.error('Error uploading file:', error);
            this.setState({
                isUploading: false,
                errors: [{ row: 0, error: 'An error occurred while uploading the file.' }]
            });
        }
    }

    handleCompareStock = async () => {
        if (!this.state.selectedFile) {
            alert('Please select a file first.');
            return;
        }

        this.setState({ isComparing: true, errors: [], successMessage: '', comparisonResults: [] });

        const formData = new FormData();
        formData.append('file', this.state.selectedFile);

        try {
            const response = await apiAuth.post('/bulk/stock/compare', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (Array.isArray(response.data)) {
                // If it's an array and the first element has 'row', it's a validation error array
                if (response.data.length > 0 && response.data[0].row !== undefined) {
                    this.setState({ errors: response.data, isComparing: false });
                } else {
                    // Otherwise it's the comparison results array
                    this.setState({ comparisonResults: response.data, isComparing: false });
                }
            }
        } catch (error) {
            console.error('Error comparing stock:', error);
            let errs = [{ row: 0, error: 'An error occurred while comparing the stock.' }];
            if (error.response && error.response.data && Array.isArray(error.response.data)) {
                errs = error.response.data;
            }
            this.setState({
                isComparing: false,
                errors: errs
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="">
                    {/* preloader */}
                    {this.props.loading && <div className="preloader" />}

                    <div className="content">
                        <div className="container-fluid">
                            <div className="row page-title">
                                <div className="col-md-12">
                                    <nav aria-label="breadcrumb" className="float-right mt-1">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"><a href="/">Basara</a></li>
                                            <li className="breadcrumb-item active" aria-current="page">Bulk Data</li>
                                        </ol>
                                    </nav>
                                    <h4 className="mb-1 mt-0">Bulk Data</h4>
                                </div>
                            </div>

                            <Nav tabs className="nav-bordered">
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === '1' })}
                                        onClick={() => { this.toggleTab('1'); }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Upload Stock
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === '2' })}
                                        onClick={() => { this.toggleTab('2'); }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Pending Reports
                                    </NavLink>
                                </NavItem>
                            </Nav>

                            <TabContent activeTab={this.state.activeTab} className="mt-4">
                                <TabPane tabId="1">
                                    <Row>
                                        <Col lg={6}>
                                            <Card>
                                                <CardBody>
                                                    <h4 className="header-title mt-0 mb-3">Upload Stock CSV</h4>

                                                    <div className="form-group">
                                                        <input
                                                            type="file"
                                                            className="form-control-file"
                                                            accept=".csv"
                                                            onChange={this.handleFileChange}
                                                        />
                                                    </div>

                                                    <Button
                                                        color="primary"
                                                        onClick={this.handleUploadAndVerify}
                                                        disabled={this.state.isUploading || this.state.isComparing || this.state.isSubmitting || !this.state.selectedFile}
                                                    >
                                                        {this.state.isUploading ? 'Verifying...' : 'Upload and Verify'}
                                                    </Button>
                                                    {' '}
                                                    <Button
                                                        color="info"
                                                        onClick={this.handleCompareStock}
                                                        disabled={this.state.isUploading || this.state.isComparing || this.state.isSubmitting || !this.state.successMessage}
                                                    >
                                                        {this.state.isComparing ? 'Comparing...' : 'Compare with DB Stock'}
                                                    </Button>
                                                    {' '}
                                                    {this.state.comparisonResults.length > 0 && (
                                                        <Button
                                                            color="success"
                                                            onClick={this.handleSubmitReport}
                                                            disabled={this.state.isUploading || this.state.isComparing || this.state.isSubmitting || !this.state.selectedFile}
                                                        >
                                                            {this.state.isSubmitting ? 'Submitting...' : 'Submit Report'}
                                                        </Button>
                                                    )}

                                                    {this.state.successMessage && (
                                                        <div className="alert alert-success mt-3" role="alert">
                                                            {this.state.successMessage}
                                                        </div>
                                                    )}
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>

                                    {this.state.errors.length > 0 && (
                                        <Row>
                                            <Col lg={12}>
                                                <Card>
                                                    <CardBody>
                                                        <h4 className="header-title mt-0 mb-3 text-danger">Verification Errors</h4>
                                                        <Table className="mb-0" bordered size="sm">
                                                            <thead>
                                                                <tr>
                                                                    <th>Row</th>
                                                                    <th>Error Details</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {this.state.errors.map((error, index) => (
                                                                    <tr key={index}>
                                                                        <td>{error.row > 0 ? error.row : '-'}</td>
                                                                        <td className="text-danger">{error.error}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    )}

                                    {this.state.comparisonResults.length > 0 && (
                                        <Row>
                                            <Col lg={12}>
                                                <Card>
                                                    <CardBody>
                                                        <h4 className="header-title mt-0 mb-3 text-info">Stock Comparison Results</h4>
                                                        <div className="table-responsive">
                                                            <Table className="mb-0 table-centered" bordered size="sm" striped>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Warehouse</th>
                                                                        <th>Item ID</th>
                                                                        <th>Item Name</th>
                                                                        <th>Price (DB)</th>
                                                                        <th>Cost Price (DB * 0.70)</th>
                                                                        <th>DB Qty</th>
                                                                        <th>CSV Qty</th>
                                                                        <th>Difference (CSV - DB)</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {this.state.comparisonResults.map((res, index) => (
                                                                        <tr key={index}>
                                                                            <td>{res.warehouse_name}</td>
                                                                            <td>{res.item_id}</td>
                                                                            <td>{res.item_name}</td>
                                                                            <td>{res.price.toFixed(2)}</td>
                                                                            <td>{res.cost_price.toFixed(2)}</td>
                                                                            <td>{res.current_quantity}</td>
                                                                            <td>{res.new_quantity}</td>
                                                                            <td className={res.difference !== 0 ? (res.difference > 0 ? 'text-success font-weight-bold' : 'text-danger font-weight-bold') : ''}>
                                                                                {res.difference > 0 ? `+${res.difference}` : res.difference}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    )}
                                </TabPane>
                                <TabPane tabId="2">
                                    <Row>
                                        <Col lg={12}>
                                            <Card>
                                                <CardBody>
                                                    <h4 className="header-title mt-0 mb-3">Pending Stock Reports</h4>

                                                    {this.state.isLoadingReports ? (
                                                        <div className="text-center">Loading reports...</div>
                                                    ) : (
                                                        <div className="table-responsive">
                                                            <Table className="mb-0 table-centered table-hover" bordered size="sm">
                                                                <thead>
                                                                    <tr>
                                                                        <th>ID</th>
                                                                        <th>Created</th>
                                                                        <th>Status</th>
                                                                        <th>Warehouse</th>
                                                                        <th>Submitted By</th>
                                                                        <th>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {this.state.pendingReports.length > 0 ? (
                                                                        this.state.pendingReports.map(report => (
                                                                            <tr key={report.id}>
                                                                                <td>{report.id}</td>
                                                                                <td>{new Date(report.created).toLocaleString()}</td>
                                                                                <td>
                                                                                    <span className={classnames('badge', {
                                                                                        'badge-soft-warning': report.status === 'PENDING',
                                                                                        'badge-soft-success': report.status === 'APPROVED',
                                                                                        'badge-soft-danger': report.status === 'REJECTED'
                                                                                    })}>
                                                                                        {report.status}
                                                                                    </span>
                                                                                </td>
                                                                                <td>{report.warehouse_name}</td>
                                                                                <td>{report.user_name}</td>
                                                                                <td>
                                                                                    <Button size="sm" color="info" onClick={() => this.fetchReportDetails(report.id)}>View Details</Button>
                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                    ) : (
                                                                        <tr>
                                                                            <td colSpan="6" className="text-center">No pending reports found.</td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    )}
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>

                                    {/* Details View */}
                                    {this.state.isLoadingDetails ? (
                                        <Row className="mt-4">
                                            <Col lg={12}>
                                                <Card>
                                                    <CardBody className="text-center">
                                                        <div className="spinner-border text-primary m-2" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                        <h5 className="text-primary mt-2">Fetching Report Details...</h5>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    ) : this.state.selectedReportDetails && (
                                        <Row className="mt-4">
                                            <Col lg={12}>
                                                <Card>
                                                    <CardBody>
                                                        <h4 className="header-title mt-0 mb-3 text-primary">Report #{this.state.selectedReportId} Details</h4>
                                                        <div className="table-responsive">
                                                            <Table className="mb-0 table-centered" bordered size="sm" striped>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Warehouse</th>
                                                                        <th>Item ID</th>
                                                                        <th>Item Name</th>
                                                                        <th>Price (DB)</th>
                                                                        <th>Cost Price (DB * 0.70)</th>
                                                                        <th>DB Qty</th>
                                                                        <th>Report Qty</th>
                                                                        <th>Difference (Report - DB)</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {this.state.selectedReportDetails.map((res, index) => (
                                                                        <tr key={index}>
                                                                            <td>{res.warehouse_name}</td>
                                                                            <td>{res.item_id}</td>
                                                                            <td>{res.item_name}</td>
                                                                            <td>{res.price.toFixed(2)}</td>
                                                                            <td>{res.cost_price.toFixed(2)}</td>
                                                                            <td>{res.current_quantity}</td>
                                                                            <td>{res.new_quantity}</td>
                                                                            <td className={res.difference !== 0 ? (res.difference > 0 ? 'text-success font-weight-bold' : 'text-danger font-weight-bold') : ''}>
                                                                                {res.difference > 0 ? `+${res.difference}` : res.difference}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </Table>
                                                        </div>

                                                        {/* Admin Approval Actions */}
                                                        {(() => {
                                                            const currentReport = this.state.pendingReports.find(r => r.id === this.state.selectedReportId);
                                                            if (!currentReport) return null;

                                                            if (currentReport.status === 'PENDING') {
                                                                if (getLoggedInUser().role === 'Admin') {
                                                                    const isOwnReport = getLoggedInUser().username === currentReport.user_name;
                                                                    return (
                                                                        <div className="mt-3">
                                                                            {isOwnReport ? (
                                                                                <div className="alert alert-warning text-center mt-3 mb-0" role="alert">
                                                                                    You cannot approve your own stock report.
                                                                                </div>
                                                                            ) : (
                                                                                <div className="text-right">
                                                                                    <Button
                                                                                        color="success"
                                                                                        className="mr-2"
                                                                                        onClick={() => this.handleActionReport('Approve')}
                                                                                    >
                                                                                        <i className="uil uil-check mr-1"></i> Approve
                                                                                    </Button>
                                                                                    <Button
                                                                                        color="danger"
                                                                                        onClick={() => this.handleActionReport('Reject')}
                                                                                    >
                                                                                        <i className="uil uil-multiply mr-1"></i> Reject
                                                                                    </Button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                } else {
                                                                    return (
                                                                        <div className="alert alert-info text-center mt-3 mb-0" role="alert">
                                                                            This report is waiting for Admin approval.
                                                                        </div>
                                                                    );
                                                                }
                                                            } else {
                                                                return (
                                                                    <div className={`alert text-center mt-3 mb-0 ${currentReport.status === 'APPROVED' ? 'alert-success' : 'alert-danger'}`} role="alert">
                                                                        Status: <strong>{currentReport.status}</strong>.
                                                                        {currentReport.action_user_name && (
                                                                            <span> Actioned by <strong>{currentReport.action_user_name}</strong> {currentReport.action_on && currentReport.action_on.Valid ? `on ${new Date(currentReport.action_on.String).toLocaleString()}` : ''}</span>
                                                                        )}
                                                                    </div>
                                                                );
                                                            }
                                                        })()}

                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    )}
                                </TabPane>
                            </TabContent>

                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default BulkData;
