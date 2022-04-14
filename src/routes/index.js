import React from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';
import * as FeatherIcon from 'react-feather';

import { isUserAuthenticated, getLoggedInUser } from '../helpers/authUtils';

// auth
const Login = React.lazy(() => import('../pages/auth/Login'));
const Logout = React.lazy(() => import('../pages/auth/Logout'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const ForgetPassword = React.lazy(() => import('../pages/auth/ForgetPassword'));
const Confirm = React.lazy(() => import('../pages/auth/Confirm'));

const Dashboard = React.lazy(() => import('../pages/dashboard'));

const BusinessPartners = React.lazy(() => import('../pages/business-partners'));

const Transactions = React.lazy(() => import('../pages/transactions'));
const PurchaseOrders = React.lazy(() => import('../pages/transactions/purchase-orders/PurchaseOrder'));
const PurchaseOrdersList = React.lazy(() => import('../pages/transactions/purchase-orders/PurchaseOrderList'));
const PurchaseOrderDetails = React.lazy(() => import('../pages/transactions/purchase-orders/PurchaseOrderDetails'));
const GoodsReceivedNotes = React.lazy(() => import('../pages/transactions/goods-received-notes/GoodsReceivedNotes'));
const GoodsReceivedNotesCopy = React.lazy(() =>
    import('../pages/transactions/goods-received-notes/GoodsReceivedNotesCopy')
);
const GoodsReceivedNotesList = React.lazy(() =>
    import('../pages/transactions/goods-received-notes/GoodsReceivedNotesList')
);
const GoodsReceivedNoteDetails = React.lazy(() =>
    import('../pages/transactions/goods-received-notes/GoodsReceivedNoteDetails')
);
const LandedCost = React.lazy(() => import('../pages/transactions/landed-cost/LandedCost'));
const ViewStock = React.lazy(() => import('../pages/transactions/warehouse-stock/ViewStock'));
const InventoryTransfer = React.lazy(() => import('../pages/transactions/inventory-transfer/InventoryTransfer'));

const Financials = React.lazy(() => import('../pages/financials'));
const FinancialsJournalEntry = React.lazy(() => import('../pages/financials/JournalEntry'));
const FinancialsAccountLedger = React.lazy(() => import('../pages/financials/AccountLedger'));
const FinancialsChartOfAccounts = React.lazy(() => import('../pages/financials/ChartOfAccounts'));
const FinancialsTrialBalance = React.lazy(() => import('../pages/financials/TrialBalance'));
const FinancialsPaymentVoucher = React.lazy(() => import('../pages/financials/PaymentVoucher'));
const FinancialsPaymentVouchers = React.lazy(() => import('../pages/financials/PaymentVouchers'));
const FinancialsPaymentVoucherDetails = React.lazy(() => import('../pages/financials/PaymentVoucherDetails'));
const FinancialsDeposit = React.lazy(() => import('../pages/financials/Deposit'));
const FinancialsTransaction = React.lazy(() => import('../pages/financials/Transaction'));
const FinancialsEntryAudit = React.lazy(() => import('../pages/financials/JournalEntryAudit'));
const FinancialsBalanceSheet = React.lazy(() => import('../pages/financials/BalanceSheet'));
const FinancialsIncomeStatement = React.lazy(() => import('../pages/financials/IncomeStatement'));

const Reporting = React.lazy(() => import('../pages/reporting'));
const ReportingInvoiceSearch = React.lazy(() => import('../pages/reporting/invoicesearch'));

// const CalendarApp = React.lazy(() => import('../pages/apps/Calendar'));
// const EmailInbox = React.lazy(() => import('../pages/apps/Email/Inbox'));
// const EmailDetail = React.lazy(() => import('../pages/apps/Email/Detail'));
// const EmailCompose = React.lazy(() => import('../pages/apps/Email/Compose'));
// const ProjectList = React.lazy(() => import('../pages/apps/Project/List'));
// const ProjectDetail = React.lazy(() => import('../pages/apps/Project/Detail/'));
// const TaskList = React.lazy(() => import('../pages/apps/Tasks/List'));
// const TaskBoard = React.lazy(() => import('../pages/apps/Tasks/Board'));

// pages
// const Starter = React.lazy(() => import('../pages/other/Starter'));
// const Profile = React.lazy(() => import('../pages/other/Profile/'));
// const Activity = React.lazy(() => import('../pages/other/Activity'));
// const Invoice = React.lazy(() => import('../pages/other/Invoice'));
// const Pricing = React.lazy(() => import('../pages/other/Pricing'));
// const Error404 = React.lazy(() => import('../pages/other/Error404'));
// const Error500 = React.lazy(() => import('../pages/other/Error500'));

// ui
// const BSComponents = React.lazy(() => import('../pages/uikit/BSComponents/'));
// const FeatherIcons = React.lazy(() => import('../pages/uikit/Icons/Feather'));
// const UniconsIcons = React.lazy(() => import('../pages/uikit/Icons/Unicons'));
// const Widgets = React.lazy(() => import('../pages/uikit/Widgets/'));

// charts
// const Charts = React.lazy(() => import('../pages/charts/'));

// forms
// const BasicForms = React.lazy(() => import('../pages/forms/Basic'));
// const FormAdvanced = React.lazy(() => import('../pages/forms/Advanced'));
// const FormValidation = React.lazy(() => import('../pages/forms/Validation'));
// const FormWizard = React.lazy(() => import('../pages/forms/Wizard'));
// const FileUpload = React.lazy(() => import('../pages/forms/FileUpload'));
// const Editor = React.lazy(() => import('../pages/forms/Editor'));

// tables
// const BasicTables = React.lazy(() => import('../pages/tables/Basic'));
// const AdvancedTables = React.lazy(() => import('../pages/tables/Advanced'));

const Items = React.lazy(() => import('../pages/items'));
const ItemsAll = React.lazy(() => import('../pages/items/all'));
const ItemEdit = React.lazy(() => import('../pages/items/edit'));
const ItemSearch = React.lazy(() => import('../pages/items/search'));

// handle auth and authorization
const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
            if (!isUserAuthenticated()) {
                // not logged in so redirect to login page with the return url
                return <Redirect to={{ pathname: '/account/login', state: { from: props.location } }} />;
            }

            const loggedInUser = getLoggedInUser();
            // check if route is restricted by role
            if (roles && roles.indexOf(loggedInUser.role) === -1) {
                // role not authorised so redirect to home page
                return <Redirect to={{ pathname: '/' }} />;
            }

            // authorised so return component
            return <Component {...props} />;
        }}
    />
);

// root routes
const rootRoute = {
    path: '/',
    exact: true,
    component: () => <Redirect to="/dashboard" />,
    route: PrivateRoute,
};

// dashboard
const dashboardRoute = {
    path: '/dashboard',
    name: 'Dashboard',
    header: 'Navigation',
    icon: FeatherIcon.Home,
    component: Dashboard,
    route: PrivateRoute,
    roles: ['Admin', 'Office Executive', 'Manager', 'Branch User'],
};

// items
const itemsRoute = {
    path: '/items',
    name: 'Items',
    exact: true,
    icon: FeatherIcon.Settings,
    component: Items,
    route: PrivateRoute,
    roles: ['Admin', 'Office Executive', 'Manager'],
};

const itemsSubRoute = [
    {
        path: '/items/all',
        name: 'All Items',
        exact: true,
        component: ItemsAll,
        route: PrivateRoute,
        roles: ['Admin', 'Office Executive', 'Manager'],
    },
    {
        path: '/items/edit/:id',
        name: 'Edit Item',
        exact: true,
        component: ItemEdit,
        route: PrivateRoute,
        roles: ['Admin', 'Office Executive', 'Manager'],
    },
    {
        path: '/items/search',
        name: 'Search Item',
        exact: true,
        component: ItemSearch,
        route: PrivateRoute,
        roles: ['Admin', 'Office Executive', 'Manager'],
    },
];

const BusinessPartnersRoute = {
    path: '/business-partners',
    name: 'Business Partners',
    exact: true,
    icon: FeatherIcon.Users,
    component: BusinessPartners,
    route: PrivateRoute,
    roles: ['Admin', 'Office Executive', 'Manager'],
};

const TransactionsRoute = {
    path: '/transactions',
    name: 'Transactions',
    exact: true,
    icon: FeatherIcon.Package,
    component: Transactions,
    route: PrivateRoute,
    roles: ['Admin', 'Office Executive', 'Manager'],
};

const TransactionsSubRoutes = [
    {
        path: '/transactions/purchase-order',
        name: 'Purchase Order',
        exact: true,
        component: PurchaseOrders,
        route: PrivateRoute,
        roles: ['Admin', 'Manager'],
    },
    {
        path: '/transactions/purchase-order/list',
        name: 'Purchase Order List',
        exact: true,
        component: PurchaseOrdersList,
        route: PrivateRoute,
        roles: ['Admin', 'Manager'],
    },
    {
        path: '/transactions/purchase-order/:id',
        name: 'Purchase Order Details',
        exact: true,
        component: PurchaseOrderDetails,
        route: PrivateRoute,
        roles: ['Admin', 'Manager'],
    },
    {
        path: '/transactions/goods-received-note',
        name: 'Goods Received Note',
        exact: true,
        component: GoodsReceivedNotes,
        route: PrivateRoute,
        roles: ['Admin', 'Manager'],
    },
    {
        path: '/transactions/goods-received-note-copy/:id',
        name: 'Goods Received Note (Order Copy)',
        exact: true,
        component: GoodsReceivedNotesCopy,
        route: PrivateRoute,
        roles: ['Admin', 'Manager'],
    },
    {
        path: '/transactions/goods-received-note/list',
        name: 'Goods Received Note List',
        exact: true,
        component: GoodsReceivedNotesList,
        route: PrivateRoute,
        roles: ['Admin', 'Manager'],
    },
    {
        path: '/transactions/goods-received-note/:id',
        name: 'Goods Received Note Details',
        exact: true,
        component: GoodsReceivedNoteDetails,
        route: PrivateRoute,
        roles: ['Admin', 'Manager'],
    },
    {
        path: '/transactions/landed-cost',
        name: 'Landed Cost',
        exact: true,
        component: LandedCost,
        route: PrivateRoute,
        roles: ['Admin', 'Manager'],
    },
    {
        path: '/transactions/stock',
        name: 'View Stock',
        exact: true,
        component: ViewStock,
        route: PrivateRoute,
        roles: ['Admin', 'Manager'],
    },
    {
        path: '/transactions/inventory-transfer',
        name: 'Inventory Transfer',
        exact: true,
        component: InventoryTransfer,
        route: PrivateRoute,
        roles: ['Admin', 'Manager'],
    },
];

const reportingRoute = {
    path: '/reporting',
    name: 'Reporting',
    icon: FeatherIcon.FilePlus,
    component: Reporting,
    exact: true,
    route: PrivateRoute,
    roles: ['Admin', 'Manager'],
};

const reportingSubRoutes = [
    {
        path: '/reporting/invoicesearch',
        name: 'Invoice Search',
        exact: true,
        component: ReportingInvoiceSearch,
        route: PrivateRoute,
        roles: ['Admin', 'Manager']
    },
]

const financialsRoute = {
    path: '/financials',
    name: 'Financials',
    icon: FeatherIcon.BarChart2,
    component: Financials,
    exact: true,
    route: PrivateRoute,
    roles: ['Admin', 'Manager'],
};

const financialsSubRoutes = [
    {
        path: '/financials/journal-entry',
        name: 'Journal Entry',
        exact: true,
        component: FinancialsJournalEntry,
        route: PrivateRoute,
        roles: ['Admin', 'Manager'],
    },
    {
        path: '/financials/account/:id',
        name: 'Account Ledger',
        exact: true,
        component: FinancialsAccountLedger,
        route: PrivateRoute,
        roles: ['Admin', 'Manager'],
    },
    {
        path: '/financials/chart-of-accounts',
        name: 'Chart of Accounts',
        exact: true,
        component: FinancialsChartOfAccounts,
        route: PrivateRoute,
        roles: ['Admin', 'Manager'],
    },
    {
        path: '/financials/trial-balance',
        name: 'Trial Balance',
        exact: true,
        component: FinancialsTrialBalance,
        route: PrivateRoute,
        roles: ['Admin', 'Manager'],
    },
    {
        path: '/financials/payment-voucher',
        name: 'Payment Voucher',
        exact: true,
        component: FinancialsPaymentVoucher,
        route: PrivateRoute,
        roles: ['Admin', 'Manager'],
    },
    {
        path: '/financials/payment-vouchers',
        name: 'Payment Vouchers',
        exact: true,
        component: FinancialsPaymentVouchers,
        route: PrivateRoute,
        roles: ['Admin', 'Manager'],
    },
    {
        path: '/financials/payment-voucher/:id',
        name: 'Payment Voucher Details',
        exact: true,
        component: FinancialsPaymentVoucherDetails,
        route: PrivateRoute,
        roles: ['Admin', 'Manager'],
    },
    {
        path: '/financials/deposit',
        name: 'Deposit',
        exact: true,
        component: FinancialsDeposit,
        route: PrivateRoute,
        roles: ['Admin', 'Manager'],
    },
    {
        path: '/financials/transaction/:id',
        name: 'Transaction Details',
        exact: true,
        component: FinancialsTransaction,
        route: PrivateRoute,
        roles: ['Admin', 'Manager'],
    },
    {
        path: '/financials/entryaudit',
        name: 'Journal Entry Audit',
        exact: true,
        component: FinancialsEntryAudit,
        route: PrivateRoute,
        roles: ['Admin', 'Manager']
    },
    {
        path: '/financials/balancesheet',
        name: 'Balance Sheet',
        exact: true,
        component: FinancialsBalanceSheet,
        route: PrivateRoute,
        roles: ['Admin']
    },
    {
        path: '/financials/incomestatement',
        name: 'Income Statement',
        exact: true,
        component: FinancialsIncomeStatement,
        route: PrivateRoute,
        roles: ['Admin']
    },
];

// auth
const authRoutes = {
    path: '/account',
    name: 'Auth',
    children: [
        {
            path: '/account/login',
            name: 'Login',
            component: Login,
            route: Route,
        },
        {
            path: '/account/logout',
            name: 'Logout',
            component: Logout,
            route: Route,
        },
        {
            path: '/account/register',
            name: 'Register',
            component: Register,
            route: Route,
        },
        {
            path: '/account/confirm',
            name: 'Confirm',
            component: Confirm,
            route: Route,
        },
        {
            path: '/account/forget-password',
            name: 'Forget Password',
            component: ForgetPassword,
            route: Route,
        },
    ],
};

// flatten the list of all nested routes
const flattenRoutes = (routes) => {
    let flatRoutes = [];

    routes = routes || [];
    routes.forEach((item) => {
        flatRoutes.push(item);

        if (typeof item.children !== 'undefined') {
            flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)];
        }
    });
    return flatRoutes;
};

// All routes
const allRoutes = [
    rootRoute,
    dashboardRoute,
    itemsRoute,
    ...itemsSubRoute,
    authRoutes,
    BusinessPartnersRoute,
    TransactionsRoute,
    ...TransactionsSubRoutes,
    financialsRoute,
    ...financialsSubRoutes,
    reportingRoute,
    ...reportingSubRoutes
];

const authProtectedRoutes = [dashboardRoute, itemsRoute, BusinessPartnersRoute, TransactionsRoute, financialsRoute, reportingRoute];
const allFlattenRoutes = flattenRoutes(allRoutes);
export { allRoutes, authProtectedRoutes, allFlattenRoutes };
