'use client';
import { useState } from 'react';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import * as ecc from 'tiny-secp256k1';
import { ethers } from 'ethers';
import { BIP32Factory, BIP32Interface } from 'bip32';
import axios from 'axios';
import { Balance } from './types/balance';
const bip32 = BIP32Factory(ecc);

export default function Home() {
  const [seedPhrase, setSeedPhrase] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<{ [key: string]: string[] }>({});
  const [balances, setBalances] = useState<Balance[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ETH');

  const handleSeedPhraseChange = (value: string) => {
    if (bip39.validateMnemonic(value)) {
      setSeedPhrase(value);
    } else {
      setSeedPhrase(null);
    }
  };

  const generateEthAddresses = (walletAddresses: { [key: string]: string[] }) => {
    const ethAdresses: string[] = [];
    for (let i = 0; i < 3; i++) {
      const ethWallet = ethers.HDNodeWallet.fromPhrase(seedPhrase!, `m/44'/60'/0'/0/${i}`);
      ethAdresses.push(ethWallet.address);
    }

    walletAddresses['ETH'] = ethAdresses;
  }

  const generateCoinAdresses = (
    walletAddresses: { [key: string]: string[] },
    path: string,
    coin: string,
    network?: bitcoin.networks.Network
  ) => {
    const coinAdresses: string[] = [];
    const seedBuffer: Buffer = bip39.mnemonicToSeedSync(seedPhrase!);
    const coinRoot: BIP32Interface = bip32.fromSeed(seedBuffer);
    for (let i = 0; i < 3; i++) {
      const coinChild: BIP32Interface = coinRoot.derivePath(`${path}/${i}`);
      const options: bitcoin.Payment = { pubkey: coinChild.publicKey };
      if (network) options.network = network;

      const coinAddress = bitcoin.payments.p2pkh(options).address;
      if (coinAddress) coinAdresses.push(coinAddress);
    }

    walletAddresses[coin] = coinAdresses;
  }

  const generateAddresses = async () => {
    if (!seedPhrase) {
      alert('Invalid Seed Phrase');
      return;
    }
    const litecoinMainnet = {
      messagePrefix: '\x19Litecoin Signed Message:\n',
      bech32: 'ltc',
      bip32: {
        public: 0x019da462,
        private: 0x019d9cfe
      },
      pubKeyHash: 0x30,
      scriptHash: 0x32,
      wif: 0xb0
    };

    const walletAddresses: { [key: string]: string[] } = {};
    generateEthAddresses(walletAddresses);
    generateCoinAdresses(walletAddresses, "m/44'/0'/0'/0", 'BTC');
    generateCoinAdresses(walletAddresses, "m/44'/3'/0'/0", 'DOGE');
    generateCoinAdresses(walletAddresses, "m/44'/2'/0'/0", 'LTC', litecoinMainnet);
    generateCoinAdresses(walletAddresses, "m/44'/5'/0'/0", 'DASH', bitcoin.networks.testnet);

    setAddresses(walletAddresses);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);

    fetchBalances(newCurrency);
  };

  const fetchBalances = async (currency: string) => {
    try {
      const response = await axios.post('/api/balances', {
        addresses: addresses[currency],
        currency,
      });
      setBalances(response.data.balances);
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  return (
    <div className="content">
      <h1>Crypto Balance Checker</h1>
      <div className="seedphrase">
        <label>Seed Phrase:</label>
        <input
          style={{width: '100%'}}
          type="text"
          onChange={(e) => handleSeedPhraseChange(e.target.value)}
        />
        <button onClick={generateAddresses} disabled={!seedPhrase}>Generate Addresses</button>
      </div>

      {Object.values(addresses).length > 0 && (
        <div>
          <h2>Addresses:</h2>
          <ul>
            {Object.keys(addresses).map((currencyKey, index) => (
              <div key={index}>
                <label>{currencyKey}</label>
                <ul>
                  {addresses[currencyKey].map((address, addrIndex) => (
                    <li key={addrIndex}>{address}</li>
                  ))}
                </ul>
              </div>
            ))}
          </ul>
          <button onClick={() => fetchBalances(selectedCurrency)}>
            View Balances
          </button>
        </div>
      )}

      {balances.length > 0 && (
        <div>
          <h2>Balances (in USD):</h2>
          <ul>
            {balances.map((balance, index) => (
              <li key={index}>
                {balance.currency}: {balance.amount} USD
              </li>
            ))}
          </ul>
          <div>
            <h2>Edit Currencies</h2>
            <select
              value={selectedCurrency}
              onChange={handleCurrencyChange}
            >
              <option value="ETH">Ethereum</option>
              <option value="BTC">Bitcoin</option>
              <option value="LTC">Litecoin</option>
              <option value="DOGE">Dogecoin</option>
              <option value="DASH">Dash</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
