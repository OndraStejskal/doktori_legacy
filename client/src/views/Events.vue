<template>
  <div class="home">
    <PageHeader v-bind:title="`Události`"></PageHeader>
    <b-list-group v-if="events">
      <EventListItem
        v-bind:key="event.id"
        v-for="event in events"
        v-bind:event="event"
        v-bind:bothButtons="true"
      >
      </EventListItem>
    </b-list-group>
  </div>
</template>

<script>
// @ is an alias to /src
import PageHeader from "../components/PageHeader";
import httpClient from "../helpers/httpClient";
import EventListItem from "../components/EventListItem";
export default {
  name: "Home",
  components: {
    PageHeader,
    EventListItem,
  },
  data() {
    return {
      events: null,
    };
  },
  methods: {
    getEvents() {
      this.events = null;
      httpClient
        .get("/events")
        .then((response) => {
          this.events = response;
        })
        .catch((error) => {
          console.error(error.message);
        });
    },
  },
  mounted() {
    this.getEvents();
  },
};
</script>
