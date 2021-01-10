import { Service } from 'typedi';
import { Db } from '../common/db';
import { CamelCase } from '../common/formatters';

const ARTIST_ID_FRAGMENT = `regexp_replace(trim(lower(track_artist)), '\\s+', '-', 'g')`;

@Service()
export class ArtistService {
  getId(artistName: string) {
    return artistName.trim().toLocaleLowerCase().replace(/\s+/g, '-');
  }

  @CamelCase
  getTabsByArtist(accountId: string, artistId: string, tx: Db) {
    return tx.any(
      `select * from tab where
        ${ARTIST_ID_FRAGMENT} = $(artistId) and
        account_id = $(accountId)`,
      {
        artistId,
        accountId,
      },
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
        where account_id=$(accountId); 
    `,
      { accountId },
    );
  }
}
