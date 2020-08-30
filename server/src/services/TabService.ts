import { Service } from 'typedi';
import { Db } from '../common/db';
import { CamelCase } from '../common/formatters';
import { Tab, TabSearchCriteria } from '../resolvers/TabResolver';

@Service()
export class TabService {
  @CamelCase
  get(id: string, tx: Db) {
    return tx.one<Tab>(`select * from tab where id=$(id)`, { id });
  }

  async create(accountId: string, trackTitle: string, chords: string, tx: Db) {
    const { id } = await tx.one(
      `
      insert into tab (track_title, chords, account_id)
      values ($(trackTitle), $(chords), $(accountId))
      returning id`,
      {
        accountId,
        trackTitle,
        chords,
      },
    );
    return id as string;
  }

  @CamelCase
  async search(criteria: TabSearchCriteria, tx: Db) {
    return tx.any(`
    select * from tab where
    ${criteria.accountId ? 'account_id=$(accountId)' : 'true'} and
    ${
      criteria.trackTitle
        ? 'similarity(track_title, $(trackTitle)) > 0.2'
        : 'true'
    }
    `);
  }
}
