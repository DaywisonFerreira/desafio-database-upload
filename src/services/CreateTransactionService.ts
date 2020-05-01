import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Type is invalid', 401);
    }
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const transaction = await transactionsRepository.getBalance();

      if (value > transaction.total) {
        throw new AppError('Amount is not available', 400);
      }
    }

    const categoriesRepository = getRepository(Category);

    const categoryExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categoryExists) {
      const newCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(newCategory);
      const transaction = transactionsRepository.create({
        title,
        value,
        type,
        category_id: newCategory.id,
      });

      await transactionsRepository.save(transaction);
      return transaction;
    }
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryExists.id,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
