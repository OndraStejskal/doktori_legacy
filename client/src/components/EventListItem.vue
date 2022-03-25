<template>
  <b-list-group-item>
    <div
      class="listItemContent d-flex justify-content-between align-items-center"
    >
      <div>
        <b-icon
          icon="x-circle-fill"
          variant="danger"
          class="mr-2 mt-1"
          v-if="event.priority === eventStates.critical"
        ></b-icon>
        <b-icon
          icon="exclamation-circle-fill"
          variant="warning"
          class="mr-2 mt-1"
          v-if="event.priority === eventStates.high"
        ></b-icon>
        <b-icon
          icon="exclamation-circle-fill"
          variant="dark"
          class="mr-2 mt-1"
          v-if="event.priority === eventStates.medium"
        ></b-icon>
        <b-icon
          icon="info-circle-fill"
          variant="primary"
          class="mr-2 mt-1"
          v-if="event.priority === eventStates.low"
        ></b-icon>
        {{ event.title }}
      </div>
      <div>
        <b-button
          variant="outline-info"
          class="mb-2 text-center mr-1"
          :to="{ name: 'EventDetail', params: { eventId: event.id } }"
        >
          <b-icon icon="clipboard-data" aria-hidden="true"></b-icon>
        </b-button>
        <b-button
          v-if="bothButtons"
          variant="outline-info"
          class="mb-2 text-center mr-1"
          :to="{
            name: 'PatientDetail',
            params: { patientId: event.patientId },
          }"
        >
          <b-icon icon="person" aria-hidden="true"></b-icon>
        </b-button>
      </div>
    </div>
  </b-list-group-item>
</template>

<script>
import enums from '../helpers/enumerations';

export default {
  name: "EventListItem",
  components: {},
  props: ["event", "bothButtons"],
  data() {
    return {
      eventStates: enums.eventStates
    };
  }
};
</script>

