<template>
  <div id="app">
    <AppBar></AppBar>
    <b-container class="mt-2">
      <router-view/>
    </b-container>
  </div>
</template>


<script>
  import AppBar from './components/AppBar';

  export default {
    name: 'App',
    components: {
      AppBar
    }
  }
</script>
