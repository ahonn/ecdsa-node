const fs = require('fs');
const path = require('path');
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");

const accounts = [];

for (let i = 0; i < 3; i += 1) {
  const privateKey = secp.utils.randomPrivateKey();
  const publicKey = secp.getPublicKey(privateKey);
  const address = keccak256(publicKey.slice(1)).slice(-20);
  accounts.push({
    privateKey: Buffer.from(privateKey).toString('hex'),
    publicKey: Buffer.from(publicKey).toString('hex'),
    address: '0x' + Buffer.from(address).toString('hex'),
    amount: (i + 1) * 100,
  });
}

fs.writeFileSync(path.join(__dirname, '../accounts.json'), JSON.stringify(accounts, null, 2));
