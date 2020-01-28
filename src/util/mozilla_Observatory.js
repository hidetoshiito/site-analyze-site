import axios from 'axios';

export default class MozillaObservatory {
  constructor(confObj) {
    console.log('MozillaObservatory constructor');
    this.host = confObj.host;
    this.resultsummary = {
      algorithm_version: 0, end_time: '', scan_id: 0, grade: '', score: 0, tests_failed: 0, tests_passed: 0, tests_quantity: 0,
    };
    this.resultdatas = [{ }];
  }

  // MozillaObservatoryのチェック処理
  async run() {
    console.log('MozillaObservatory run');
    try {
      console.log('最初に対象ホストがscan済みかチェックする');
      let preRes = await axios.get(`https://http-observatory.security.mozilla.org/api/v1/analyze?host=${this.host}`);
      console.log('プレ処理結果 : ');
      console.dir(preRes.data);
      // TODO: 仮
      // preRes.data.scan_id = null;
      if (preRes.data.scan_id) {
        // stateがPENDINGなら完了するまで待つ
        if (preRes.data.state !== 'FINISHED') {
          for (let i = 0; ;i += 1) {
            console.log('PENDINGなら待つ');
            // eslint-disable-next-line no-await-in-loop
            await new Promise(r => setTimeout(r, 15000));
            // eslint-disable-next-line no-await-in-loop
            preRes = await axios.get(`https://http-observatory.security.mozilla.org/api/v1/analyze?host=${this.host}`);
            if (preRes.data.state === 'FINISHED') {
              break;
            }
            if (i === 5) {
              throw new Error('TimeOut Error! Mozillaチェックが完了しませんでした');
            }
          }
        }
        console.log('scan済みの場合は結果サマリを取得する');
        this.setScanSummary(preRes.data);
        console.dir(this);
      } else {
        console.log('未scanの場合はscanを実施する');
        // const params = new URLSearchParams();
        // params.append('rescan', 'true');
        // const newres = await axios.post(`https://http-observatory.security.mozilla.org/api/v1/analyze?host=${this.host}`, params);
        const newres = await axios.post(`https://http-observatory.security.mozilla.org/api/v1/analyze?host=${this.host}`);
        console.dir(newres);
        console.log(`現時点のscan結果を取得する${newres.data.scan_id}`);
        this.setScanSummary(newres.data);
        for (;;) {
          // eslint-disable-next-line no-await-in-loop
          const res = await axios.get(`https://http-observatory.security.mozilla.org/api/v1/getScanResults?scan=${this.resultsummary.scan_id}`);
          console.log(`診断が完了するまで待つ:${Object.keys(res.data).length}`);
          console.dir(res);
          if (Object.keys(res.data).length > 0) {
            console.log('診断が終わったらサマリを取得しなおして終了する');
            // eslint-disable-next-line no-await-in-loop
            const sumRes = await axios.get(`https://http-observatory.security.mozilla.org/api/v1/analyze?host=${this.host}`);
            this.setScanSummary(sumRes.data);
            break;
          }
          // eslint-disable-next-line no-await-in-loop
          await new Promise(r => setTimeout(r, 10000));
        }
      }
      console.log('scanidから詳細結果を取得する');
      console.log(`ID : ${this.resultsummary.scan_id}`);
      const res = await axios.get(`https://http-observatory.security.mozilla.org/api/v1/getScanResults?scan=${this.resultsummary.scan_id}`);
      console.dir(res);
      this.resultdatas = res.data;
      return this.resultdatas; // resolveで返す
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
