<template>
  <div class="warna">
    <navbar/>
    <router-view></router-view>
    <footer/>
  </div>
</template>
<script setup>
import navbar from './components/layouts/header.vue'
import footer from './components/layouts/footer.vue'

</script>
<style>
.warna{
  background-color: rgb(0, 0, 72);
}
</style>