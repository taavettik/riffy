import Axios, { AxiosInstance } from 'axios';
import parse from 'node-html-parser';
import { Service } from 'typedi';

@Service()
export class UGService {
  http: AxiosInstance;

  constructor() {
    this.http = Axios.create({
      baseURL: 'https://tabs.ultimate-guitar.com/',
    });
  }

  async getTab(url: string) {
    const html = await this.http.get(url);
    const dom = parse(html.data);
    const jsStore = dom.querySelector('.js-store');
    const json = jsStore.getAttribute('data-content');
    if (!json) {
      return;
    }
    const data = JSON.parse(json);
    const tab = data.store.page.data.tab;
    const chords = data.store.page.data.tab_view.wiki_tab.content;
    const parsed = this.parseChords(chords);

    return {
      trackArtist: tab.artist_name,
      trackTitle: tab.song_name,
      chords: parsed,
    };
  }

  private parseChords(chords: string) {
    return chords.replace(/\[(\/|)(tab|ch)\]/g, '');
  }
}
