import { Service } from 'typedi';
import { Db } from '../common/db';
import { CamelCase } from '../common/formatters';
import { Tab } from '../resolvers/TabResolver';

@Service()
export class TabService {
  @CamelCase
  get(id: string, tx: Db) {
    return tx.one<Tab>(
      `select * from tab where id=$(id) and deleted_at is null`,
      { id },
    );
  }

  async create(
    accountId: string,
    data: {
      chords: string;
      title: string;
      artist?: string;
    },
    tx: Db,
  ): Promise<string> {
    const existing = await tx.oneOrNone(
      `
      select
        id, track_title, track_artist
      from tab where
        track_title = $(title) and
        track_artist = $(artist) and
        account_id = $(accountId)`,
      {
        title: data.title,
        artist: data.artist,
        accountId,
      },
    );

    if (existing) {
      await tx.none(
        `
      update tab set
        chords = $(chords)
      where id = $(id)
      `,
        {
          id: existing.id,
          chords: data.chords,
        },
      );
      return existing.id;
    }

    const { id } = await tx.one(
      `
      insert into tab (track_title, chords, account_id, track_artist)
      values ($(title), $(chords), $(accountId), $(artist))
      returning id`,
      {
        accountId,
        ...data,
      },
    );
    return id as string;
  }

  async getConflicts(accountId: string, artist: string, title: string, tx: Db) {
    const tabs = await tx.any(
      `
      select id from tab where
        track_artist = $(artist) and
        track_title = $(title) and
        account_id = $(accountId)
    `,
      {
        title,
        artist,
        accountId,
      },
    );

    return Promise.all(tabs.map((tab) => this.get(tab.id, tx)));
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
  async delete(id: string, accountId: string, tx: Db) {
    await tx.none(
      `delete from view_history where tab_id = $(id) and account_id = $(accountId)`,
      { accountId, id },
    );
    return tx.one(
      `update tab set
        deleted_at = now()
      where
        id = $(id) and
        account_id = $(accountId) and
        deleted_at is null
      returning id`,
      { id, accountId },
    );
  }

  @CamelCase
  async getByAccount(accountId: string, tx: Db) {
    return tx.manyOrNone(
      `
      select * from tab where account_id=$(accountId) and deleted_at is null;
    `,
      { accountId },
    );
  }

  @CamelCase
  async search(accountId: string, searchTerm: string, tx: Db) {
    return tx.any(
      `
      select * from tab
      where
        account_id = $(accountId) and
        (
          similarity($(search), track_title) > 0.2 or
          similarity($(search), track_artist) > 0.2
        )
      order by similarity(lower($(search)), lower(concat(track_title, ' ', track_artist))) desc
      limit 10
    `,
      {
        search: searchTerm,
        accountId,
      },
    );
  }

  async addRecent(
    accountId: string,
    tab: { url: string } | { id: string },
    tx: Db,
  ) {
    const transposition = await this.getTabTransposition(accountId, tab, tx);

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
      insert into view_history (account_id, tab_url, tab_id, transposition) values
      ($(accountId), $(url), $(id), $(transposition))
    `,
      {
        accountId,
        url: null,
        id: null,
        ...tab,
        transposition: transposition?.transposition ?? 0,
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
      select * from view_history
      where account_id = $(accountId)
      order by view_history.timestamp desc
      limit 10
    `,
      {
        accountId,
      },
    );
  }

  @CamelCase
  async setTabTransposition(
    accountId: string,
    params: { id: string } | { url: string },
    transposition: number,
    tx: Db,
  ) {
    return tx.none(
      `
      insert into view_history (${
        'id' in params ? 'tab_id' : 'tab_url'
      }, account_id, transposition)
      values (${
        'id' in params ? '$(id)' : '$(url)'
      }, $(accountId), $(transposition))
      on conflict (${'id' in params ? 'tab_id' : 'tab_url'}, account_id)
      do update set transposition = excluded.transposition
    `,
      {
        ...params,
        accountId,
        transposition,
      },
    );
  }

  @CamelCase
  async getTabTransposition(
    accountId: string,
    params: { id: string } | { url: string },
    tx: Db,
  ) {
    return tx.oneOrNone<{ transposition: number }>(
      `
      select transposition from view_history
      where account_id = $(accountId) and
      ${'id' in params ? `tab_id = $(id)` : 'tab_url = $(url)'}
    `,
      {
        ...params,
        accountId,
      },
    );
  }
}
