<template>
  <b-list-group-item>
    <div
      class="listItemContent d-flex justify-content-between align-items-center"
    >
      <div>
        {{ patient.name }}
      </div>
      <div>
        <b-button
          variant="outline-info"
          class="mb-2 text-center mr-1"
          :to="{ name: 'PatientDetail', params: { patientId: patient.id } }"
        >
          <b-icon icon="person" aria-hidden="true"></b-icon>
        </b-button>
      </div>
    </div>
  </b-list-group-item>
</template>

<script>
export default {
  name: "PatientListItem",
  components: {},
  props: ["patient"],
};
</script>

