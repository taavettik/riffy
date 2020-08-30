import { Service } from 'typedi/decorators/Service';
import { Db } from '../common/db';
import { CamelCase } from '../common/formatters';
import { Account } from '../resolvers/AccountResolver';

@Service()
export class AccountService {
  @CamelCase
  getByName(name: string, tx: Db) {
    return tx.oneOrNone<Account>(`select * from account where name = $(name)`, {
      name,
    });
  }
}
