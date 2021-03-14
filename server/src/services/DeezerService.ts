import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Service } from 'typedi';

interface QueryParams {
  artist?: string;
  track?: string;
}

interface DeezerArtist {
  id: number;
  name: string;
}

interface DeezerTrack {
  id: number;
  title: string;
  artist: DeezerArtist;
  isrc: string;
}

type TrackSearchResult = Omit<DeezerTrack, 'isrc'>;

@Service()
export class DeezerService {
  http: AxiosInstance;
  requestTimestamps: number[] = [];

  constructor() {
    this.http = Axios.create({
      baseURL: 'https://api.deezer.com',
    });
  }

  private getQueryString(query: QueryParams | string) {
    if (typeof query === 'string') {
      return query;
    }

    const escape = (str: string) => str.replace(/"/g, '');
    return Object.entries(query).reduce(
      (str, [key, value]) => (value ? str + `${key}:"${escape(value)}"` : str),
      '',
    );
  }

  async search(query: QueryParams | string) {
    const q = this.getQueryString(query);

    const res = await this.http.get<{ data: TrackSearchResult[] }>(`/search`, {
      params: {
        q,
      },
    });

    return res.data.data;
  }

  async searchArtists(query: string) {
    const res = await this.http.get<{ data: DeezerArtist[] }>(
      '/search/artist',
      {
        params: {
          q: query,
        },
      },
    );

    return res.data.data;
  }

  async getTrack(id: number) {
    const res = await this.http.get<DeezerTrack>(`/track/${id}`);
    return res.data;
  }
}
