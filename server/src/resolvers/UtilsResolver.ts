import { Arg, Query, Resolver } from 'type-graphql';
import iconv from 'iconv-lite';
import ced from 'ced';

@Resolver()
export class UtilsResolver {
  @Query(() => String)
  async convertToEncoding(
    @Arg('data') base64: string,
    @Arg('encoding') target: string,
  ) {
    const buffer = Buffer.from(base64, 'base64');

    return iconv.decode(buffer, target);
  }

  @Query(() => String)
  async detectEncoding(@Arg('data') data: string) {
    const buffer = Buffer.from(data, 'base64');

    return ced(buffer);
  }
}
