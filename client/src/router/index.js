import Vue from 'vue';
import VueRouter from 'vue-router';
import Events from '../views/Events.vue';
import PatientDetail from '../views/PatientDetail.vue';
import EventDetail from '../views/EventDetail.vue';
import Patients from '../views/Patients.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: { name: 'Events' }
  },
  {
    path: '/events',
    name: 'Events',
    component: Events
  },
  {
    path: '/patients',
    name: 'Patients',
    component: Patients
  },

  {
    path: '/event/:eventId',
    name: 'EventDetail',
    component: EventDetail,
    props: true
  },
  {
    path: '/patientDetail/:patientId',
    name: 'PatientDetail',
    component: PatientDetail,
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
