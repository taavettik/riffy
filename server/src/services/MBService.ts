import axios, { AxiosInstance } from 'axios';

type Entity = 'artist' | 'recording';

type SearchResponse<K extends string, E = Record<string, any>> = {
  created: string;
  count: number;
  offset: number;
} & {
  [key in K]: ({
    id: string;
    score: string;
  } & E)[];
};

interface Resource {
  id: string;
}

interface Artist extends Resource {
  name: string;
}

interface Recording extends Resource {
  title: string;
  'artist-credit': {
    name: string;
    artist?: Artist;
  }[];
}

type EntityPlulars = {
  artist: 'artists';
  recording: 'recordings';
};

type Entities = {
  artist: Artist;
  recording: Recording;
};

export class MBService {
  http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: 'http://musicbrainz.org/ws/2/',
    });

    this.getRecordingArtists('715e275e-91a4-4f51-a23b-dde1c058df3a').then(
      console.log,
    );
  }

  search<E extends Entity>(entity: E, query: string, offset = 0, limit = 10) {
    return this.get<SearchResponse<EntityPlulars[E], Entities[E]>>(
      `/${entity}`,
      {
        query: this.escape(query),
        offset,
        limit,
      },
    );
  }

  async getRecordingArtists(recordingId: string) {
    const data = await this.get<Recording>(`/recording/${recordingId}`, {
      inc: 'artists',
    });
    return data['artist-credit']
      .map((credit) => credit.artist)
      .filter(Boolean) as Artist[];
  }

  /**
   * Escape chars with special meaning in Luscene query strings
   */
  private escape(str: string) {
    return str.replace(/([!*+\-=<>&|()[\]{}^~?:\\/"])/g, '\\$1');
  }

  /**
   * Execute HTTP GET request agains the musicbrainz api
   * @param url URL of the request
   * @param params Query parameters
   */
  get<T = any>(url: string, params: Record<string, any>) {
    return this.http
      .get<T>(url, {
        params: {
          ...params,
          fmt: 'json',
        },
      })
      .then((res) => res.data);
  }
}
