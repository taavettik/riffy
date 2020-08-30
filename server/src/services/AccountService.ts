import { Service } from 'typedi/decorators/Service';
import { Db } from '../common/db';

@Service()
export class AccountService {
  getByName(name: string, tx: Db) {
    return tx.oneOrNone(`select * from account where name = $(name)`, { name });
  }
}
