import { Service } from 'typedi';
import { Db } from '../common/db';
import { CamelCase } from '../common/formatters';

const ARTIST_ID_FRAGMENT = `regexp_replace(trim(lower(track_artist)), '\\s+', '-', 'g')`;

export const formatArtistId = (name: string) =>
  name.trim().toLocaleLowerCase().replace(/\s+/g, '-');

@Service()
export class ArtistService {
  @CamelCase
  getTabsByArtist(accountId: string, artistId: string, tx: Db) {
    return tx.any(
      `select * from tab where
        ${ARTIST_ID_FRAGMENT} = $(artistId) and
        account_id = $(accountId) and
        deleted_at is null
      order by track_title`,
      {
        artistId,
        accountId,
      },
    );
  }

  @CamelCase
  getArtist(accountId: string, artistId: string, tx: Db) {
    return tx.oneOrNone(
      `
      select ${ARTIST_ID_FRAGMENT} as id, track_artist as name
      from tab where
        account_id = $(accountId) and
        ${ARTIST_ID_FRAGMENT} = $(artistId) and
        deleted_at is null
      limit 1
    `,
      { accountId, artistId },
    );
  }

  @CamelCase
  getArtists(accountId: string, tx: Db) {
    return tx.any<{
      artistId: string;
      artistName: string;
    }>(
      `
      select
        distinct on (${ARTIST_ID_FRAGMENT}) ${ARTIST_ID_FRAGMENT} as artist_id, track_artist as artist_name from tab
        where account_id=$(accountId) and deleted_at is null 
    `,
      { accountId },
    );
  }
}
