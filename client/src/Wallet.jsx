import { useEffect, useState } from 'react';
import server from './server';
import * as secp from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { toHex } from 'ethereum-cryptography/utils';

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  const updateAddress = async () => {
    if (privateKey) {
      const publicKey = secp.getPublicKey(privateKey);
      const address = '0x' + toHex(keccak256(publicKey.slice(1)).slice(-20));
      setAddress(address);

      if (address) {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    }
  };

  useEffect(() => {
    updateAddress(privateKey);
  }, [privateKey]);

  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <label>
        Wallet Address:
        <span>{address}</span>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
