export const AuthRoutes = [
    {
        path: '',
        name: 'Login',
        component: () => import('@/features/auth/views/login/LoginView.vue')
    }
];