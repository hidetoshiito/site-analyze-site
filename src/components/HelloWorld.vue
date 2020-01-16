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
        <div v-else-if="nakcat_results != null">
          <p>nakcat's result</p>
          <p>{{nakcat_results}}</p>
        </div>
        <div v-if="loading_member.mozilla">
          <p><v-progress-circular color="primary" indeterminate></v-progress-circular> mozilla's scaning ...</p>
        </div>
        <div v-else-if="mozilla_summary != null">
          <p>mozilla's result</p>
          <v-card :raised="fld_summary.raised" :elevation="fld_summary.elevation" :color="grade_color" >
            <v-list-item>
                <v-list-item-title class="display-2 font-weight-bold">RANK : {{mozilla_summary.grade}}</v-list-item-title>
            </v-list-item>
          </v-card>
          <v-card v-for="(value,key) in mozilla_results" :key="value.name">
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">診断名: {{key}}</div>
                <v-list-item-title class="headline mb-1">SCORE : {{value.score_modifier}}</v-list-item-title>
                <v-list-item-subtitle>理由: {{value.score_description}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios';
import MozillaObservatory from '@/util/mozilla_Observatory';

console.log('HelloWorld start');

export default {
  name: 'HelloWorld',

  data: () => ({
    loading_member: { nakcat: false, mozilla: false },
    nakcat_results: null,
    mozilla_summary: null,
    mozilla_results: {},
    target_site: 'https://int-inc.jp',
    fld_summary: {
      raised: true, // 影あり
      elevation: 10, // 影の量
      // color: {
      //   A: 'light-blue', B: 'pink', C: 'red', D: 'blue', E: 'yellow', F: 'purple',
      // },
    },
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
      // Valueがloading中(ture)の要素があるか？
      return Object.values(this.loading_member).includes(true);
    },
    // 結果Gradeによって表示色を変更
    grade_color() {
      console.log('grade_color start');
      const color = {
        A: 'light-blue', B: 'pink', C: 'red', D: 'blue', E: 'yellow', F: 'purple',
      };
      // A+, D- みたいな表記もあるのでアルファベットのみにする
      const gradeChr = this.mozilla_summary.grade.substring(0, 1);
      return color[gradeChr];
    },
  },
  mounted() {
    console.log(`${this.$vnode.componentOptions.tag} : mounted start`);
    /*
    */
  },
  methods: {
    // 診断ボタン押下時の処理
    analyze() {
      console.log('method analyze start');
      this.loading_member.nakcat = true;
      this.loading_member.mozilla = true;
      axios.get(`https://mysterious-ocean-57311.herokuapp.com/analize.json?host=${this.target_site}&token=password`)
        .then((response) => {
          // 処理成功2xx時のコールバック
          console.dir(response.data);
          this.nakcat_results = response.data;
          this.loading_member.nakcat = false;
        })
        .catch((error) => {
          // 処理失敗!not2xx時のコールバック
          console.err(error);
          this.nakcat_results = { msg: 'エラー' };
          this.loading_member.nakcat = false;
        });
      // Mozilla Observatoryの情報取得
      const hostname = this.getHostName(this.target_site);
      const mozilla = new MozillaObservatory({ host: hostname });
      mozilla.run().then(() => {
        console.log('Mozilla Observatoryの取得結果 : ');
        console.dir(mozilla);
        this.mozilla_summary = mozilla.resultsummary;
        this.mozilla_results = mozilla.resultdatas;
        this.loading_member.mozilla = false;
      }).catch((error) => {
        console.error(error);
        this.mozilla_summary = { msg: 'システムエラー' };
        this.loading_member.mozilla = false;
      });
    },
    // URLからホスト名の取得
    getHostName(url) {
      console.log('method getHostName start');
      const ret = url.replace(/\\/g, '/').match(/\/\/([^/]*)/);
      if (ret == null || ret.length < 2) {
        return '';
      }
      return ret[1];
    },
  },
};
</script>
