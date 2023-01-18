const express = require('express');
const app = express();
const cors = require('cors');
const accounts = require('./accounts');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { utf8ToBytes, toHex } = require('ethereum-cryptography/utils');
const secp = require("ethereum-cryptography/secp256k1");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = accounts.reduce((result, account) => {
  result[account.address] = account.amount;
  return result;
}, {});

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const { message, signature, recovery } = req.body;
  const { amount, recipient } = message;

  const messageHash = keccak256(utf8ToBytes(JSON.stringify(message)));
  const publicKey = secp.recoverPublicKey(messageHash, signature, recovery)
  const sender = '0x' + toHex(keccak256(publicKey.slice(1)).slice(-20));

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: 'Not enough funds!' });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
