<template>
  <div class="patients">
    <PageHeader v-bind:title="`Pacienti`"></PageHeader>

      <b-form class="mb-2 d-flex justify-content-between">
          <b-input
            id="inline-form-input-name"
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="ID"
          ></b-input>

          <b-button variant="info">Hledat</b-button>
      </b-form>

      <b-list-group v-if="patients">
        <PatientListItem
          v-bind:key="patient.id"
          v-for="patient in patients"
          v-bind:patient="patient"
        >
        </PatientListItem>
      </b-list-group>
  </div>
</template>



<script>
import PageHeader from "../components/PageHeader";
import httpClient from "../helpers/httpClient";
import PatientListItem from "../components/PatientListItem";

export default {
  name: "Patients",
  components: {
    PageHeader,
    PatientListItem,
  },
  data() {
    return {
      keyword: "",
      patients: null,
      fields: [
        { key: "name", label: "Jméno", sortable: true },
        { key: "address", label: "Adresa", sortable: true },
        { key: "id", label: "Identifikační číslo", sortable: true },
      ],
    };
  },
  computed: {
    items() {
      return this.keyword
        ? this.patients.filter(
            (item) =>
              item["name"].includes(this.keyword) ||
              item["id"].toString().includes(this.keyword) ||
              item.address.includes(this.keyword)
          )
        : this.patients;
    },
  },
  methods: {
    getPatients() {
      this.patients = null;
      httpClient
        .get("/patients")
        .then((response) => {
          this.patients = response;
          console.log(this.patients);
        })
        .catch((error) => {
          console.error(error.message);
        });
    },
  },
  mounted() {
    this.getPatients();
  },
};
</script>

<style lang="scss" scoped>
</style>