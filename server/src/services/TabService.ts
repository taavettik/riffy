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
  async edit(
    id: string,
    accountId: string,
    data: {
      chords?: string;
    },
    tx: Db,
  ) {
    return tx.one(
      `update tab set
        ${data.chords ? 'chords = $(chords)' : 'chords = chords'}
      where
        account_id = $(accountId) and
        id = $(id)
      returning *`,
      {
        ...data,
        id,
        accountId,
      },
    );
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

  async addRecent(
    accountId: string,
    tab: { url: string } | { id: string },
    tx: Db,
  ) {
    // Couldn't figure out how to do this with a ON CONFLICT -clause
    await tx.none(
      `
      delete from view_history where
        account_id = $(accountId) and
        (
          (tab_url is not null and tab_url = $(url)) or
          (tab_id is not null and tab_id = $(id))
          )
    `,
      {
        accountId,
        url: null,
        id: null,
        ...tab,
      },
    );

    return tx.none(
      `
      insert into view_history (account_id, tab_url, tab_id) values
      ($(accountId), $(url), $(id))
    `,
      {
        accountId,
        url: null,
        id: null,
        ...tab,
      },
    );
  }

  @CamelCase
  async getRecentTabs(accountId: string, tx: Db) {
    return tx.any<{
      tabId: string | null;
      tabUrl: string | null;
      accountId: string;
      timeStamp: Date;
    }>(
      `
      select * from view_history where account_id = $(accountId) limit 10
    `,
      {
        accountId,
      },
    );
  }
}
