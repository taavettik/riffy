import Axios, { AxiosInstance } from 'axios';
import parse from 'node-html-parser';
import { URL } from 'url';
import { Service } from 'typedi';
import { RedisClient } from 'redis';
import { promisify } from 'util';
import { PromiseRedisClient } from '../common/redis';

const UG_URL = 'https://tabs.ultimate-guitar.com/';

@Service()
export class UGService {
  http: AxiosInstance;

  constructor() {
    this.http = Axios.create({
      baseURL: UG_URL,
    });
  }

  async getTab(url: string, redis: PromiseRedisClient) {
    const parsedUrl = new URL(url, UG_URL);
    const cacheKey = parsedUrl.pathname;

    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

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

    const result = {
      trackArtist: tab.artist_name,
      trackTitle: tab.song_name,
      chords: parsed,
    };

    await redis.set(cacheKey, JSON.stringify(result));
    await redis.expire(cacheKey, 60 * 15);

    return result;
  }

  private parseChords(chords: string) {
    return chords.replace(/\[(\/|)(tab|ch)\]/g, '');
  }
}
