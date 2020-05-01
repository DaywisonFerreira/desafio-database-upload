import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getRepository(Transaction);
    const transaction = await transactionRepository.find({
      where: { id },
    });
    if (!transaction) {
      throw new AppError('Transaction is not found!', 400);
    }
    await transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
