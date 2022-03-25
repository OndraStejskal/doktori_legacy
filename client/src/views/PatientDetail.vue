<template>
  <div class="patientDetail">
    <PageHeader v-bind:title="`Profil pacienta`"></PageHeader>

    <div v-if="patient">
      <b-card title="Základní údaje" class="mt-4">
        <b-table-simple >
          <b-tbody>
            <b-tr>
              <b-td>Jméno</b-td>
              <b-td>{{ patient.name }}</b-td>
            </b-tr>
            <b-tr>
              <b-td>Bydliště</b-td>
              <b-td>{{ patient.address }}</b-td>
            </b-tr>
            <b-tr>
              <b-td>Další informace</b-td>
              <b-td>??????????</b-td>
            </b-tr>
            <b-tr>
              <b-td>Další informace</b-td>
              <b-td>??????????</b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </b-card>

      <b-card title="Události" class="mt-4">
        <b-list-group>
            <EventListItem
              v-bind:key="event.id"
              v-for="event in patient.events"
              v-bind:event="event"
              v-bind:bothButtons="false"
            ></EventListItem>
        </b-list-group>
      </b-card>

      <b-card title="Měření" class="mt-4">
        <BarChartTest></BarChartTest>
      </b-card>
    </div>
  </div>
</template>

<script>
import EventListItem from "../components/EventListItem";
import PageHeader from "../components/PageHeader";
import BarChartTest from "../components/BarChartTest";
import httpClient from "../helpers/httpClient";

export default {
  name: "PatientDetail",
  components: {
    PageHeader,
    BarChartTest,
    EventListItem,
  },
  data() {
    return {
      patient: null,
      events: null,
    };
  },
  props: ["patientId"],
  methods: {
    getPatient() {
      this.patient = null;
      httpClient
        .get("/patientDetail/" + this.patientId)
        .then((response) => {
          this.patient = response;
        })
        .catch((error) => {
          console.error(error.message);
        });
    },
  },
  mounted() {
    this.getPatient();
  },
};
</script>
