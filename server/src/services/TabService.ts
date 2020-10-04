import { Service } from 'typedi';
import { Db } from '../common/db';
import { CamelCase } from '../common/formatters';
import { Tab } from '../resolvers/TabResolver';

@Service()
export class TabService {
  @CamelCase
  get(id: string, tx: Db) {
    return tx.one<Tab>(`select * from tab where id=$(id)`, { id });
  }

  async create(
    accountId: string,
    data: {
      chords: string;
      title: string;
      artist?: string;
      mbTrackId?: string;
      mbArtistId?: string;
    },
    tx: Db,
  ) {
    const { id } = await tx.one(
      `
      insert into tab (track_title, chords, account_id, track_artist, mb_track_id, mb_artist_id)
      values ($(title), $(chords), $(accountId), $(artist), $(mbTrackId), $(mbArtistId))
      returning id`,
      {
        accountId,
        ...data,
      },
    );
    return id as string;
  }

  @CamelCase
  async getByAccount(accountId: string, tx: Db) {
    return tx.manyOrNone(
      `
      select * from tab where account_id=$(accountId);
    `,
      { accountId },
    );
  }
}
