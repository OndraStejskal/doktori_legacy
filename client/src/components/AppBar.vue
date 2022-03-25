<template>
  <div class="AppBar">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#">Kardiostimulátory</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'Events' }">Událost</b-nav-item>
          <b-nav-item :to="{ name: 'Patients'}">Pacienti</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "AppBar",
};
</script>