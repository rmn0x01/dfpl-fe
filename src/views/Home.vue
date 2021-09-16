<template>
  <div class="home">
    <img alt="EPL logo" src="../assets/epl.png">
    <HomePage msg="Duplicate FPL"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HomePage from '@/components/HomePage.vue'

export default {
  name: 'Home',
  components: {
    HomePage
  }
}
</script>
