<template>
    <div class="eventDetail">
        <PageHeader v-bind:title="`Detail události`"></PageHeader>

        <div>
      <b-card title="Informace o události" class="mt-4">
        <b-table-simple v-if="event">
          <b-tbody>
            <b-tr>
              <b-td>Název</b-td>
              <b-td>{{ event.title }}</b-td>
            </b-tr>
            <b-tr>
              <b-td>Popis</b-td>
              <b-td>{{ event.description }}</b-td>
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
    </div>
    </div>
</template>

<script>

import PageHeader from "../components/PageHeader";
import httpClient from "../helpers/httpClient";
    export default {
        name: "EventDetail",
        components: {
            PageHeader,
        },
data() {
    return {
      event: null
    };},
    props: ["eventId"],
        methods: {
    getEvent() {
      this.event = null;
      httpClient
        .get("/event/" + this.eventId)
        .then((response) => {
          this.event = response;
        })
        .catch((error) => {
          console.error(error.message);
        });
    },
  },
  mounted() {
    this.getEvent();
  },
    }
</script>
