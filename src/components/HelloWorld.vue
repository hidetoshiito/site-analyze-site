<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-flex xs12>
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        ></v-img>
      </v-flex>

      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Vuetify
        </h1>
        <p class="subheading font-weight-regular">
          For help and collaboration with other Vuetify developers,
          <br>please join our online
          <a href="https://community.vuetifyjs.com" target="_blank">Discord Community</a>
        </p>
        <v-text-field
          v-model="target_site"
          label="診断サイト"
          hint="診断するサイトURLを入力してください 例: https://int-inc.jp"
          outlined=true
        >
        </v-text-field>
        <v-btn :loading="loading" :disabled="loading" @click="analyze()" color="success">
          診断
        </v-btn>
        <p>{{result_status}}</p>
        <p>{{result_data}}</p>
      </v-flex>

      <v-flex
        mb-5
        xs12
      >
        <h2 class="headline font-weight-bold mb-3">What's next?</h2>

        <v-layout justify-center>
          <a
            v-for="(next, i) in whatsNext"
            :key="i"
            :href="next.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ next.text }}
          </a>
        </v-layout>
      </v-flex>

      <v-flex
        xs12
        mb-5
      >
        <h2 class="headline font-weight-bold mb-3">Important Links</h2>

        <v-layout justify-center>
          <a
            v-for="(link, i) in importantLinks"
            :key="i"
            :href="link.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ link.text }}
          </a>
        </v-layout>
      </v-flex>

      <v-flex
        xs12
        mb-5
      >
        <h2 class="headline font-weight-bold mb-3">Ecosystem</h2>

        <v-layout justify-center>
          <a
            v-for="(eco, i) in ecosystem"
            :key="i"
            :href="eco.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ eco.text }}
          </a>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios';

console.log('HelloWorld start');

export default {
  name: 'HelloWorld',

  data: () => ({
    loading: false,
    result_status: '',
    result_data: '',
    target_site: 'https://',
    ecosystem: [
      {
        text: 'vuetify-loader',
        href: 'https://github.com/vuetifyjs/vuetify-loader',
      },
      {
        text: 'github',
        href: 'https://github.com/vuetifyjs/vuetify',
      },
      {
        text: 'awesome-vuetify',
        href: 'https://github.com/vuetifyjs/awesome-vuetify',
      },
    ],
    importantLinks: [
      {
        text: 'Documentation',
        href: 'https://vuetifyjs.com',
      },
    ],
    whatsNext: [
      {},
    ],
  }),
  mounted() {
    console.log(`${this.$vnode.componentOptions.tag} : mounted start`);
  },
  methods: {
    // 診断ボタン押下時の処理
    analyze() {
      console.log('method analyze start');
      this.loading = true;
      axios.get(`https://mysterious-ocean-57311.herokuapp.com/analize.json?host=${this.target_site}&token=password`)
        .then((response) => {
          // 処理成功2xx時のコールバック
          console.dir(response.data);
          this.result_status = response.data.status;
          this.result_data = response.data.analize_names;
          this.loading = false;
        })
        .catch((error) => {
          // 処理失敗!not2xx時のコールバック
          console.err(error);
          this.result_status = 'エラー';
          this.loading = false;
        });
    },
  },
};
</script>
