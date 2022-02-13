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
];

// const PurchaseOrdersRoute = {
//     path: '/purchase-orders',
//     name: 'Purchase Order',
//     icon: FeatherIcon.DollarSign,
//     component: PurchaseOrders,
//     exact: true,
//     route: PrivateRoute,
//     roles: ['Admin', 'Manager'],
// };

// // requests
// const requestsRoute = {
//     path: '/requests',
//     name: 'Requests',
//     icon: FeatherIcon.GitPullRequest,
//     component: Starter,
//     route: PrivateRoute
// }

// // payments
// const paymentsRoute = {
//     path: '/payments',
//     name: 'Payments',
//     icon: FeatherIcon.DollarSign,
//     component: Starter,
//     route: PrivateRoute
// }

// // loan-calculator
// const loanCalculatorRoute = {
//     path: '/loan-calculator',
//     name: 'Loan Calculator',
//     icon: FeatherIcon.Percent,
//     component: Starter,
//     route: PrivateRoute
// }

// dashboards
// const dashboardRoutes = {
//     path: '/dashboard',
//     name: 'Dashboard',
//     icon: FeatherIcon.Home,
//     header: 'Navigation',
//     badge: {
//         variant: 'success',
//         text: '1',
//     },
//     component: Dashboard,
//     roles: ['Admin'],
//     route: PrivateRoute
// };

// apps

// const calendarAppRoutes = {
//     path: '/apps/calendar',
//     name: 'Calendar',
//     header: 'Apps',
//     icon: FeatherIcon.Calendar,
//     component: CalendarApp,
//     route: PrivateRoute,
//     roles: ['Admin'],
// };

// const emailAppRoutes = {
//     path: '/apps/email',
//     name: 'Email',
//     icon: FeatherIcon.Inbox,
//     children: [
//         {
//             path: '/apps/email/inbox',
//             name: 'Inbox',
//             component: EmailInbox,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/apps/email/details',
//             name: 'Details',
//             component: EmailDetail,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/apps/email/compose',
//             name: 'Compose',
//             component: EmailCompose,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//     ]
// };

// const projectAppRoutes = {
//     path: '/apps/projects',
//     name: 'Projects',
//     icon: FeatherIcon.Briefcase,
//     children: [
//         {
//             path: '/apps/projects/list',
//             name: 'List',
//             component: ProjectList,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/apps/projects/detail',
//             name: 'Detail',
//             component: ProjectDetail,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//     ]
// };

// const taskAppRoutes = {
//     path: '/apps/tasks',
//     name: 'Tasks',
//     icon: FeatherIcon.Bookmark,
//     children: [
//         {
//             path: '/apps/tasks/list',
//             name: 'List',
//             component: TaskList,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/apps/tasks/board',
//             name: 'Board',
//             component: TaskBoard,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//     ],
// };

// const appRoutes = [calendarAppRoutes, emailAppRoutes, projectAppRoutes, taskAppRoutes];

// // pages
// const pagesRoutes = {
//     path: '/pages',
//     name: 'Pages',
//     header: 'Custom',
//     icon: FeatherIcon.FileText,
//     children: [
//         {
//             path: '/pages/starter',
//             name: 'Starter',
//             component: Starter,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/profile',
//             name: 'Profile',
//             component: Profile,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/activity',
//             name: 'Activity',
//             component: Activity,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/invoice',
//             name: 'Invoice',
//             component: Invoice,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/pricing',
//             name: 'Pricing',
//             component: Pricing,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/error-404',
//             name: 'Error 404',
//             component: Error404,
//             route: Route
//         },
//         {
//             path: '/pages/error-500',
//             name: 'Error 500',
//             component: Error500,
//             route: Route
//         },
//     ]
// };

// // components
// const componentsRoutes = {
//     path: '/ui',
//     name: 'UI Elements',
//     header: 'Components',
//     icon: FeatherIcon.Package,
//     children: [
//         {
//             path: '/ui/bscomponents',
//             name: 'Bootstrap UI',
//             component: BSComponents,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/ui/icons',
//             name: 'Icons',
//             children: [
//                 {
//                     path: '/ui/icons/feather',
//                     name: 'Feather Icons',
//                     component: FeatherIcons,
//                     route: PrivateRoute,
//                     roles: ['Admin'],
//                 },
//                 {
//                     path: '/ui/icons/unicons',
//                     name: 'Unicons Icons',
//                     component: UniconsIcons,
//                     route: PrivateRoute,
//                     roles: ['Admin'],
//                 },
//             ]
//         },
//         {
//             path: '/ui/widgets',
//             name: 'Widgets',
//             component: Widgets,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },

//     ]
// };

// // charts
// const chartRoutes = {
//     path: '/charts',
//     name: 'Charts',
//     component: Charts,
//     icon: FeatherIcon.PieChart,
//     roles: ['Admin'],
//     route: PrivateRoute
// }

// // forms
// const formsRoutes = {
//     path: '/forms',
//     name: 'Forms',
//     icon: FeatherIcon.FileText,
//     children: [
//         {
//             path: '/forms/basic',
//             name: 'Basic Elements',
//             component: BasicForms,
//             route: PrivateRoute,
//         },
//         {
//             path: '/forms/advanced',
//             name: 'Advanced',
//             component: FormAdvanced,
//             route: PrivateRoute,
//         },
//         {
//             path: '/forms/validation',
//             name: 'Validation',
//             component: FormValidation,
//             route: PrivateRoute,
//         },
//         {
//             path: '/forms/wizard',
//             name: 'Wizard',
//             component: FormWizard,
//             route: PrivateRoute,
//         },
//         {
//             path: '/forms/editor',
//             name: 'Editor',
//             component: Editor,
//             route: PrivateRoute,
//         },
//         {
//             path: '/forms/upload',
//             name: 'File Upload',
//             component: FileUpload,
//             route: PrivateRoute,
//         }
//     ]
// };

// const tableRoutes = {
//     path: '/tables',
//     name: 'Tables',
//     icon: FeatherIcon.Grid,
//     children: [
//         {
//             path: '/tables/basic',
//             name: 'Basic',
//             component: BasicTables,
//             route: PrivateRoute,
//         },
//         {
//             path: '/tables/advanced',
//             name: 'Advanced',
//             component: AdvancedTables,
//             route: PrivateRoute,
//         }]
// };

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
];

const authProtectedRoutes = [dashboardRoute, itemsRoute, BusinessPartnersRoute, TransactionsRoute, financialsRoute];
const allFlattenRoutes = flattenRoutes(allRoutes);
export { allRoutes, authProtectedRoutes, allFlattenRoutes };
