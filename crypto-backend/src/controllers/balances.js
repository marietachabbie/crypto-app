import BalanceService from '../services/balance.js';

const BalancesController = {
  getBalances: async (req, res, next) => {
    try {
      const { addresses, currency } = req.body;
      console.log(`${new Date().toISOString()} Controller: getting balance for ${currency}.`)

      const balances = await BalanceService.fetchBalances(currency, addresses);
      return res.json({ balances });
    } catch (error) {
      console.error('Error fetching balances:', error);
      next(error);
    }
  }
}

export default BalancesController;
