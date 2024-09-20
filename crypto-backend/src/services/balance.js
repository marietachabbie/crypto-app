import dotenv from 'dotenv'
dotenv.config();

import axios from 'axios';
import { ethers } from 'ethers';

const COINGECKO_URL = process.env.COINGECKO_URL;
const BLOCKCHAIN_URL = process.env.BLOCKCHAIN_URL;
const BLOCKCYPHER_URL = process.env.BLOCKCYPHER_URL;
const BLOCKCHAIR_URL = process.env.BLOCKCHAIR_URL;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

const CURRENCY_MAP = {
  ethereum: 'eth',
  bitcoin: 'btc',
  litecoin: 'ltc',
  dogecoin: 'doge',
  dash: 'dash',
}

const fetchPrices = async (currency, vsCurrency = 'usd') => {
  console.log(`${new Date().toISOString()} Service: Getting pricess for ${currency}.`);
  try {
    const response = await axios.get(COINGECKO_URL, {
      params: {
        ids: currency,
        vs_currencies: vsCurrency
      }
    });
    console.log(`${new Date().toISOString()} Axios request (prices) done successfully.`);
    return response.data;
  } catch (error) {
    console.error('Error fetching prices:', error);
    return {};
  }
};

// Function to fetch balance for various currencies
const fetchBalanceForCurrency = async (currency, address) => {
  try {
    console.log(`${new Date().toISOString()} Service: Getting balance for ${currency.toUpperCase()} address ${address}.`);
    switch(currency) {
      case CURRENCY_MAP.bitcoin:
        const responseBtc = await axios.get(`${BLOCKCHAIN_URL}/${address}`);
        console.log(`${new Date().toISOString()} Axios request done successfully.`);
        if (responseBtc.data && responseBtc.data.final_balance !== undefined) {
          // Convert from satoshi to BTC
          const balanceBtc = responseBtc.data.final_balance / 1e8;
          return balanceBtc.toFixed(8);
        } else {
          throw new Error();
        }
      case CURRENCY_MAP.ethereum:
        const provider = new ethers.InfuraProvider('mainnet', INFURA_PROJECT_ID);
        const balanceEth = await provider.getBalance(address);
        console.log(`${new Date().toISOString()} Infura request done successfully.`);
        return ethers.formatEther(balanceEth);
      case CURRENCY_MAP.litecoin:
        const responseLtc = await axios.get(`${BLOCKCYPHER_URL}/${address}/balance`);
        console.log(`${new Date().toISOString()} Axios request done successfully.`);
        return responseLtc.data.balance / 1e8;
      case CURRENCY_MAP.dogecoin:
        const responseDoge = await axios.get(`${BLOCKCHAIR_URL}/dogecoin/dashboards/address/${address}`);
        console.log(`${new Date().toISOString()} Axios request done successfully.`);
        return responseDoge.data.data[address].address.balance / 1e8;
      case CURRENCY_MAP.dash:
        const responseDash = await axios.get(`${BLOCKCHAIR_URL}/dash/dashboards/address/${address}`);
        console.log(`${new Date().toISOString()} Axios request done successfully.`);
        return responseDash.data.data[address].address.balance / 100000000;
      default:
        console.error(`Service: unsupported currency ${currency}`);
    }

    return '0';
  } catch (error) {
    console.error(`Failed to fetch balance for ${currency.toUpperCase()} address ${address}`);
    console.error(error);
    return '0';
  }
};

const BalanceSerive = {
  fetchBalances: async (currency, addresses) => {
    if (!currency || !addresses || !addresses.length) {
      throw new Error('Something went wrong, no valid data provided');
    }

    try {
      const prices = await fetchPrices(currency);
      const allPromises = await Promise.allSettled(addresses.map(async (address) => {
        const balance = await fetchBalanceForCurrency(currency.toLowerCase(), address);
        const price = prices[currency]?.usd ?? '0';
        const amount = (parseFloat(balance) * parseFloat(price)).toFixed(2);
        return {
          currency,
          amount,
        }
      }))

      return allPromises.map(promise => promise.value);
    } catch(error) {
      console.error(error);
      throw error;
    }
  }
}

export default BalanceSerive;
