import { createRouter, createWebHistory } from 'vue-router'
import PassengerRoutesView from '../views/PassengerRoutesView.vue'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'passenger-routes-view',
      component: PassengerRoutesView
    },
    {
      path: '/driver-routes-view',
      name: 'driver-routes-view',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/passenger-routes-item-info/:routeId',
      name: 'passenger-routes-item-info',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/PassengerRouteItemInfoView.vue'),
      props: true
    },
    {
      path: '/route-filter',
      name: 'route-filter',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RouteFilter.vue')
    },
    {
      path: '/route-filter/find-address/:typePage',
      name: 'find-address',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/FindAddressView.vue'),
      props: true
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/chats',
      name: 'chats',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
