import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);
    const transactions = await transactionsRepository.find();

    const income = transactions.reduce((amount, transaction) => {
      if (transaction.type === 'income') return (amount += transaction.value);
      return amount;
    }, 0);

    const outcome = transactions.reduce((amount, transaction) => {
      if (transaction.type === 'outcome') return (amount += transaction.value);
      return amount;
    }, 0);

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
