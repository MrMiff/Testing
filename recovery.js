const TronWeb = require('tronweb');
const config = require('./config');

const tronWeb = new TronWeb({
  fullHost: config.tronNode,
  privateKey: config.fromPrivateKey
});

async function main() {
  const tokenContract = await tronWeb.contract().at(config.tokenContract);
  const fromAddress = tronWeb.address.fromPrivateKey(config.fromPrivateKey);

  // Cek balance
  const balance = await tokenContract.methods.balanceOf(fromAddress).call();
  console.log(`Token balance: ${tronWeb.toBigNumber(balance).toString()}`);

  if (balance <= 0) {
    console.log("Tidak ada token untuk direcovery.");
    return;
  }

  // Kirim semua ke wallet aman
  const tx = await tokenContract.methods.transfer(config.toAddress, balance).send();
  console.log(`Recovery berhasil. TXID: ${tx}`);
}

main().catch(console.error);
