import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth'

const router = createRouter({
  history: createWebHistory('/passenger/'),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'trips-search-main',
          component: () => import('../modules/tripSearch/views/MainView.vue'),
          meta: { requiresAuth: false }
        },
        {
          path: '/trips-search/:from/:to/:date/',
          name: 'trips-search-list',
          component: () => import('../modules/tripSearch/views/TripsSearchListView.vue'),
          meta: { requiresAuth: false },
          props: true
        },
        {
          path: '/trip-search/:tripId/:segmentId',
          name: 'trip-details',
          component: () => import('../modules/tripSearch/views/TripDetailsView.vue'),
          props: true
        },
        {
          path: '/order/:orderUserId/:orderDate',
          name: 'order',
          component: () => import('../modules/tripSearch/views/TicketsOrderView.vue'),
          props: true,
          meta: { requiresAuth: true }
        },
        {
          path: '/profile',
          meta: { requiresAuth: true },
          name: 'user-profile',
          component: () => import('@/modules/userProfile/views/ProfileView.vue')
        },
        {
          path: '/orders',
          meta: { requiresAuth: true },
          children: [
            {
              path: '',
              name: 'user-orders',
              component: () => import('../modules/userProfile/views/TicketOrdersView.vue')
            },
            {
              path: ':id',
              name: 'user-order-details',
              component: () => import('../modules/userProfile/views/TicketOrderDetailsView.vue'),
              props: true
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      component: () => import('../modules/auth/views/LoginView.vue'),
      meta: { loginForm: true, overlayLoading: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth) {
    if (authStore.isAuthenticated) {
      authStore
        .fetchUser()
        .then(() => next())
        .catch(() => {
          authStore.isAuthenticated = false
          next('/login')
        })
    } else {
      next('/login')
    }
  } else if (to.meta.loginForm && authStore.isAuthenticated) {
    // Если авторизован и пытается на форму входа
    next('/') // Возвращаем обратно или на главную
  } else {
    next()
  }
})

export default router
