import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'home' },
    },
    {
        name: 'auth-root',
        path: '/auth',
        redirect: { name: 'login' },
        children: [
            {
                name: 'login',
                path: 'login',
                component: () =>
                    import('@/pages/auth/components/LoginPage.vue'),
            },
            {
                name: 'register',
                path: 'register',
                component: () =>
                    import('@/pages/auth/components/RegisterPage.vue'),
            },
        ],
    },
    {
        name: 'root',
        path: '/',
        component: () => import('@/layouts/DefaultLayout.vue'),
        redirect: { name: 'home' },
        children: [
            {
                name: 'home',
                path: '',
                component: () => import('@/pages/home/HomePage.vue'),
            },
            {
                name: 'rooms',
                path: 'rooms',
                component: () => import('@/pages/room/RoomPage.vue'),
            },
            {
                name: 'booking',
                path: 'booking',
                component: () => import('@/pages/booking/BookingPage.vue'),
                meta: { requiresAuth: true }, // Phải đăng nhập mới được đặt phòng
            },
            {
                name: 'profile',
                path: 'profile',
                // component: () => import('@/pages/profile/ProfileLayout.vue'),
                redirect: { name: 'info' },
                meta: { requiresAuth: true }, // Phải đăng nhập mới xem được hồ sơ
                children: [
                    {
                        name: 'info',
                        path: 'info',
                        component: () =>
                            import('@/pages/profile/ProfileInfo.vue'),
                    },
                ],
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach((to, from, next) => {
    // Giả sử bạn lưu token trong localStorage khi đăng nhập thành công
    const isAuthenticated = !!localStorage.getItem('access_token')

    // Nếu trang yêu cầu đăng nhập (requiresAuth) mà chưa có token
    if (to.meta.requiresAuth && !isAuthenticated) {
        // Đá về trang đăng nhập
        next({ name: 'login' })
    }
    // Nếu đã đăng nhập rồi mà còn cố tình vào trang login/register
    else if (to.path.startsWith('/auth') && isAuthenticated) {
        // Đá về trang chủ
        next({ name: 'home' })
    }
    // Các trường hợp khác cho qua bình thường
    else {
        next()
    }
})

export default router
