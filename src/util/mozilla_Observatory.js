import axios from 'axios';

export default class MozillaObservatory {
  constructor(confObj) {
    console.log('MozillaObservatory constructor');
    this.host = confObj.host;
    this.resultsummary = {
      algorithm_version: 0, end_time: '', scan_id: 0, grade: '', score: 0, tests_failed: 0, tests_passed: 0, tests_quantity: 0,
    };
  }

  // MozillaObservatoryのチェック処理
  async run() {
    console.log('MozillaObservatory run');
    try {
      console.log('最初に対象ホストがscan済みかチェックする');
      const preRes = await axios.get(`https://http-observatory.security.mozilla.org/api/v1/analyze?host=${this.host}`);
      console.log('プレ処理結果 : ');
      console.dir(preRes.data);
      if (preRes.data.scan_id) {
        console.log('scan済みの場合は結果サマリを取得する');
        this.setScanSummary(preRes.data);
        console.dir(this);
      } else {
        console.log('未scanの場合はscanを実施する');
        const newres = await axios.post(`https://http-observatory.security.mozilla.org/api/v1/analyze?host=${this.host}`);
        console.dir(newres);
        console.log('現時点のscan結果を取得する');
        this.setScanSummary(preRes.data);
      }
      console.log('scanidから詳細結果を取得する');
      console.log(`ID : ${this.resultsummary.scan_id}`);
      const res = await axios.get(`https://http-observatory.security.mozilla.org/api/v1/getScanResults?scan=${this.resultsummary.scan_id}`);
      console.dir(res);
      console.log('TODO: scan完了まで待つ');
      console.log('TODO: scan結果を取得する');
      this.resdata = res.data;
      return this.resdata; // resolveで返す
    } catch (error) {
      console.error(error);
      throw new Error(`[MozillaObservatory run] ${error}`); // rejectで返る
    }
  }

  setScanSummary(resdata) {
    Object.keys(this.resultsummary).forEach((key) => {
      this.resultsummary[key] = resdata[key];
    });
  }
}
