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
          <!-- 結果サマリ -->
          <v-card :raised="fld_summary.raised" :elevation="fld_summary.elevation" :color="grade_color_nakcat" >
            <v-list-item>
                <v-list-item-title class="display-2 font-weight-bold">SCORE : {{nakcat_results.status.total_score}}</v-list-item-title>
            </v-list-item>
          </v-card>
          <!-- 結果詳細 -->
          <v-card v-for="(item, index) in nakcat_results.analize_names" :key="index">
            <v-list-item three-line>
              <v-list-item-content>
                <div class="headline mb-1">診断名: {{item.name}}</div>
                <v-list-item-title class="mb-1">SCORE : {{item.score}}</v-list-item-title>
                <v-list-item-subtitle>判定内容: {{item.reports}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <p>{{nakcat_results}}</p>
        </div>
        <div v-if="loading_member.mozilla">
          <p><v-progress-circular color="primary" indeterminate></v-progress-circular> mozilla's scaning ...</p>
        </div>
        <div v-else-if="mozilla_summary != null">
          <p>mozilla's result</p>
          <v-card :raised="fld_summary.raised" :elevation="fld_summary.elevation" :color="grade_color_mozilla" >
            <v-list-item>
                <v-list-item-title class="display-2 font-weight-bold">Rank : {{mozilla_summary.grade}}</v-list-item-title>
            </v-list-item>
          </v-card>
          <v-card v-for="(value,key) in mozilla_results" :key="value.name">
            <v-list-item three-line class="vlist_base" :class="getClassOnScore(value.score_modifier)">
              <v-list-item-content class="vlist_content">
                <div class="headline mb-1">{{key}}</div>
                <v-list-item-title class="mb-1">SCORE : {{value.score_modifier}}</v-list-item-title>
                <v-list-item-subtitle>{{value.score_description}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style scoped lang="scss">
.bg-bad {
  background-color:lightpink;
}
.bg-good {
  background-color:#c0ffb5; /* lightpinkを基準にしたヘクサード配色らしい */
}
.bg-verygood {
  background-color:#b5fff4; /* lightpinkを基準にしたヘクサード配色らしい */
}
/* v-listのベース。左端のみ結果に応じた色付けを行うため左のみpadding */
.vlist_base {
  padding: 0 0 0 5px;
}
/* v-listのメイン */
.vlist_content {
  background-color:snow;
}

</style>

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
    grade_color_nakcat() {
      console.log('grade_color_nakcat start');
      return null;
    },
    grade_color_mozilla() {
      console.log('grade_color_mozilla start');
      // TODO: 適した色を考える
      const color = {
        A: '#a8ff99', B: '#99fff0', C: '#fff099', D: '#99a8ff', E: '#ff99a8', F: '#f099ff', // #ff99a8を基準にしたヘクサード配色
      };
      // A+, D- みたいな表記もあるのでアルファベットのみにする
      if (this.mozilla_summary.grade == null) {
        return null;
      }
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
    // 結果詳細のスコアに応じて色付け用のCSSクラス名を返す
    getClassOnScore(score) {
      console.log('method getClassOnScore start');
      if (score > 0) {
        return 'bg-good';
      } if (score < 0) {
        return 'bg-bad';
      }
      return 'bg-verygood';
    },
  },
};
</script>
