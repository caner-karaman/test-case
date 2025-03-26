import { Router } from '@vaadin/router';

const routes = [
    {
        path: '/',
        component: 'employee-list-view'
    },
    {
        path: '/create',
        component: 'employee-form'
    },
    {
        path: '/employee/edit/:id',
        component: 'employee-form'
    }
];

export function initRouter(outlet) {
    const router = new Router(outlet);
    router.setRoutes(routes);
    return router;
} 