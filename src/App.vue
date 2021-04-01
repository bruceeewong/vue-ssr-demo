<template>
  <div id="app">
    <ul>
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li>
        <router-link to="/about">About</router-link>
      </li>
    </ul>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      message: "拉勾教育",
    };
  },
  methods: {
    onClick() {
      console.log("hello world");
    },
  },
};
</script>

<style>
</style>