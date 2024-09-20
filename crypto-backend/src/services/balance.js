import dotenv from 'dotenv'
dotenv.config();

import axios from 'axios';
import { ethers } from 'ethers';

/* Extracting API URLs and keys from environment variables */
const COINGECKO_URL = process.env.COINGECKO_URL;
const BLOCKCHAIN_URL = process.env.BLOCKCHAIN_URL;
const BLOCKCYPHER_URL = process.env.BLOCKCYPHER_URL;
const BLOCKCHAIR_URL = process.env.BLOCKCHAIR_URL;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

/* Map of supported cryptocurrencies and their symbols */
const CURRENCY_MAP = {
  ethereum: 'eth',
  bitcoin: 'btc',
  litecoin: 'ltc',
  dogecoin: 'doge',
  dash: 'dash',
}

/* Fetches the price of a cryptocurrency in a specified currency */
const fetchPrices = async (currency, vsCurrency = 'usd') => {
  console.log(`${new Date().toISOString()} Service: Getting pricess for ${currency}.`);
  try {
    const response = await axios.get(COINGECKO_URL, {
      params: {
        ids: currency, // Currency ID (e.g., 'bitcoin')
        vs_currencies: vsCurrency, // Target currency for price (e.g., 'usd')
      }
    });
    console.log(`${new Date().toISOString()} Axios request (prices) done successfully.`);
    return response.data;
  } catch (error) {
    console.error('Error fetching prices:', error);
    /* Return an empty object in case of failure */
    return {};
  }
};

/* Fetches the balance for a specific cryptocurrency and address */
const fetchBalanceForCurrency = async (currency, address) => {
  try {
    console.log(`${new Date().toISOString()} Service: Getting balance for ${currency.toUpperCase()} address ${address}.`);
    switch(currency) {
      case CURRENCY_MAP.bitcoin:
        /* Fetch Bitcoin balance */
        const responseBtc = await axios.get(`${BLOCKCHAIN_URL}/${address}`);
        console.log(`${new Date().toISOString()} Axios request done successfully.`);
        if (responseBtc.data && responseBtc.data.final_balance !== undefined) {
          /* Convert satoshi to BTC */
          const balanceBtc = responseBtc.data.final_balance / 1e8;
          return balanceBtc.toFixed(8);
        } else {
          throw new Error();
        }
      case CURRENCY_MAP.ethereum:
        /* Setup Ethereum provider */
        const provider = new ethers.InfuraProvider('mainnet', INFURA_PROJECT_ID);
        /* Fetch Ethereum balance */
        const balanceEth = await provider.getBalance(address);
        console.log(`${new Date().toISOString()} Infura request done successfully.`);
        /* Convert wei to ETH */
        return ethers.formatEther(balanceEth);
      case CURRENCY_MAP.litecoin:
        /* Fetch Litecoin balance */
        const responseLtc = await axios.get(`${BLOCKCYPHER_URL}/${address}/balance`);
        console.log(`${new Date().toISOString()} Axios request done successfully.`);
        /* Convert satoshi to LTC */
        return responseLtc.data.balance / 1e8;
      case CURRENCY_MAP.dogecoin:
        /* Fetch Dogecoin balance */
        const responseDoge = await axios.get(`${BLOCKCHAIR_URL}/dogecoin/dashboards/address/${address}`);
        console.log(`${new Date().toISOString()} Axios request done successfully.`);
        /* Convert satoshi to DOGE */
        return responseDoge.data.data[address].address.balance / 1e8;
      case CURRENCY_MAP.dash:
        /* Fetch Dash balance */
        const responseDash = await axios.get(`${BLOCKCHAIR_URL}/dash/dashboards/address/${address}`);
        console.log(`${new Date().toISOString()} Axios request done successfully.`);
        /* Convert satoshi to DASH */
        return responseDash.data.data[address].address.balance / 100000000;
      default:
        console.error(`Service: unsupported currency ${currency}`);
    }

    /* Return zero balance if currency is unsupported */
    return '0';
  } catch (error) {
    console.error(`Failed to fetch balance for ${currency.toUpperCase()} address ${address}`);
    console.error(error);
    /* Return zero on error */
    return '0';
  }
};

/* Balance service to fetch balances for multiple addresses */
const BalanceSerive = {
  fetchBalances: async (currency, addresses) => {
    /* Validate input */
    if (!currency || !addresses || !addresses.length) {
      throw new Error('Something went wrong, no valid data provided');
    }

    try {
      /* Get prices for the currency */
      const prices = await fetchPrices(currency);
      const allPromises = await Promise.allSettled(addresses.map(async (address) => {
        /* Fetch balance for each address */
        const balance = await fetchBalanceForCurrency(currency.toLowerCase(), address);
        /* Get price in USD, default to 0 if missing */
        const price = prices[currency]?.usd ?? '0';
        /* Calculate value in USD */
        const amount = (parseFloat(balance) * parseFloat(price)).toFixed(2);
        return {
          currency,
          amount,
        }
      }))

      /* Return the resolved balances */
      return allPromises.map(promise => promise.value);
    } catch(error) {
      console.error(error);
      /* Rethrow error for middleware to handle */
      throw error;
    }
  }
}

export default BalanceSerive;
