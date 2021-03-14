import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import parse from 'node-html-parser';
import qs from 'querystring';
import { URL } from 'url';
import { Service } from 'typedi';
import { RedisClient } from 'redis';
import { promisify } from 'util';
import { PromiseRedisClient } from '../common/redis';
import { UgSearchResult } from '../resolvers/TabResolver';

const UG_URL = 'https://tabs.ultimate-guitar.com/';

@Service()
export class UGService {
  http: AxiosInstance;

  constructor() {
    this.http = Axios.create({
      baseURL: UG_URL,
    });
  }

  private async fetch(url: string, config?: AxiosRequestConfig) {
    const html = await this.http.get(url, config);
    const dom = parse(html.data);
    const jsStore = dom.querySelector('.js-store');
    const json = jsStore.getAttribute('data-content');
    if (!json) {
      return;
    }
    return JSON.parse(json);
  }

  async search(query: string) {
    const data = await this.fetch(
      `https://www.ultimate-guitar.com/search.php?${qs.stringify({
        search_type: 'title',
        value: query,
      })}`,
    );
    const results = data.store.page.data.results;

    const formatted = results
      .map((r: any) =>
        r.type === 'Chords' || r.type === 'Tabs'
          ? {
              trackTitle: r.song_name,
              trackArtist: r.artist_name,
              votes: r.votes,
              rating: r.rating,
              version: r.version ?? 1,
              url: r.tab_url,
            }
          : undefined,
      )
      .filter(Boolean)
      .slice(0, 10) as UgSearchResult[];

    return formatted.sort((a, b) => {
      const aName = `${a.trackArtist} - ${a.trackTitle}`.toLocaleLowerCase();
      const bName = `${b.trackArtist} - ${b.trackTitle}`.toLocaleLowerCase();
      if (aName !== bName) {
        return 0;
      }
      return a.rating * a.votes > b.rating * b.votes ? -1 : 1;
    });
  }

  async getTab(url: string, redis: PromiseRedisClient) {
    const parsedUrl = new URL(url, UG_URL);
    const cacheKey = parsedUrl.pathname;

    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const data = await this.fetch(url);
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
