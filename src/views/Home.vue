<template>
  <div class="home">
    <HelloWorld />
  </div>
</template>

<script>
import HelloWorld from '../components/HelloWorld.vue';

console.log('Home start');
export default {
  name: 'home',
  components: {
    HelloWorld,
  },
};
</script>
