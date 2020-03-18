<template>
  <v-app>
    <v-app-bar app :absolute="true" color="indigo" dark>
      <v-toolbar-title>site analyze-site</v-toolbar-title>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>
    <v-footer app :absolute="true" color="indigo">
      <v-row justify="center" no-gutters>
        <v-btn
          v-for="(link, i) in links"
          :key="i"
          color="white"
          text
          rounded
          class="my-2"
        >
          <router-link :to="link.link" tag="p">{{ link.name}}</router-link>
        </v-btn>
        <v-col class="text-center white--text" cols="12">
          &copy; 2019 - {{ new Date().getFullYear() }} <strong>int Inc.</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
console.log('App.vue start');

export default {
  name: 'App',
  components: {},

  data: () => ({
    //
    links: [
      { name: 'Home', link: '/' },
      { name: 'About', link: '/about' },
    ],
  }),
};
</script>

<style lang="scss">
/* Vuetifyは applicationというclassにfont-familyが設定されているので直接上書きする */
* :not(.v-icon) {
  font-family: "游ゴシック Medium",YuGothic,YuGothicM,"Hiragino Kaku Gothic ProN","Hiragino Kaku Gothic Pro",メイリオ,Meiryo,sans-serif;
}
</style>
