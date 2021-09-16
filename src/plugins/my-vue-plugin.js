const MyPlugin = {
    // eslint-disable-next-line no-unused-vars
    install(Vue, options) {
      Vue.mixin({
        mounted() {
          console.log('Mounted!');
        }
      });
    }
  };
  
  export default MyPlugin;