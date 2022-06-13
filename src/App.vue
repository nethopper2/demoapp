<template>
  <div id="app">
    <div class="row">
      <div class="column">
        <img alt="Nethopper logo" src="./assets/cox-edge.png" width="250">
      </div>
      <div class="column">
        <img alt="Nethopper logo" src="./assets/nethopper-logo.png" width="250">
      </div>
    </div>
    <cox msg="Welcome to the nethopper demo app for Cox Edge"/>
  </div>
</template>

<script>
import cox from './components/cox.vue'

export default {
  name: 'App',
  components: {
    cox
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
