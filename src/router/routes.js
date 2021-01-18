import MainLayout from 'layouts/MainLayout.vue';
import SideLayout from 'layouts/MainLayoutSidebar.vue';
import HomeComponent from 'pages/Home.vue';
import ListComponent from 'pages/ListNotes.vue';
import CreateComponent from 'pages/CreateNote.vue';
import ViewComponent from 'pages/ViewNote.vue';
import Account from 'pages/Account.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        name: 'home',
        path: '/',
        component: HomeComponent
      },
      {
        name: 'list',
        path: '/list',
        component: ListComponent
      },
      {
        name: 'create',
        path: '/create',
        component: CreateComponent
      },
      {
        name: 'note',
        path: '/note',
        component: ViewComponent
      },
      {
        name: 'account',
        path: '/account',
        component: Account
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;