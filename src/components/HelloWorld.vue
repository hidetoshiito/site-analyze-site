<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          サイト診断
        </h1>
        <v-text-field
          v-model="target_site"
          :label="fld_site.label"
          :hint="fld_site.hint"
          :outlined="fld_site.outlined"
          :clearable="fld_site.clearable"
        >
        </v-text-field>
        <v-btn x-large class="mb-3" width="50vw" :loading="loading_all" :disabled="loading_all" @click="analyze()" color="success">
          診断
        </v-btn>
        <div v-if="loading_member.nakcat">
          <p><v-progress-circular color="primary" indeterminate></v-progress-circular> nakcat's scaning ...</p>
        </div>
        <div v-else-if="result_member.nakcat != null">
          <p>nakcat's result</p>
          <p>{{result_member.nakcat}}</p>
        </div>
        <div v-if="loading_member.mozilla">
          <p><v-progress-circular color="primary" indeterminate></v-progress-circular> mozilla's scaning ...</p>
        </div>
        <div v-else-if="result_member.mozilla != null">
          <p>mozilla's result</p>
          <p>{{result_member.mozilla}}</p>
        </div>
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
    loading_member: { nakcat: false, mozilla: false },
    result_member: { nakcat: null, mozilla: null },
    target_site: 'https://int-inc.jp',
    fld_site: { // 診断サイトfieldの設定
      label: '診断サイト',
      hint: '診断するサイトURLを入力してください 例: https://int-inc.jp',
      outlined: true,
      clearable: true,
    },
  }),
  computed: {
    // nakcat mozilla すべてのスキャンが終わったか？
    loading_all() {
      console.log('loading_all start');
      // true(＝loading中)があるか？
      const ret = Object.keys(this.loading_member).filter(key => this.loading_member[key] === true);
      console.log(ret);
      if (ret.length > 0) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    console.log(`${this.$vnode.componentOptions.tag} : mounted start`);
    /*
    axios.post('https://http-observatory.security.mozilla.org/api/v1/analyze?host=www.mozilla.org')
      .then((response) => {
      // 処理成功2xx時のコールバック
        console.log(response.data);
      })
      .catch((error) => {
        // 処理失敗!not2xx時のコールバック
        console.err(error);
      });
    */
  },
  methods: {
    // 診断ボタン押下時の処理
    analyze() {
      console.log('method analyze start');
      this.loading_member.nakcat = true;
      axios.get(`https://mysterious-ocean-57311.herokuapp.com/analize.json?host=${this.target_site}&token=password`)
        .then((response) => {
          // 処理成功2xx時のコールバック
          console.dir(response.data);
          this.result_member.nakcat = response.data;
          this.loading_member.nakcat = false;
        })
        .catch((error) => {
          // 処理失敗!not2xx時のコールバック
          console.err(error);
          this.result_member.nakcat = { msg: 'エラー' };
          this.loading_member.nakcat = false;
        });
    },
  },
};
</script>
