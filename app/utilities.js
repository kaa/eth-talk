import { default as Web3 } from 'web3';

function getBlock(blockNum) {
  return new Promise((res, rej) => {
    return web3.eth.getBlock((blockNum, true), async (err, block) => {
      //console.log('block object: ', block)
      return err ? rej(err) : res(block)
    })
  });
}

function getBlockNumber() {
  return new Promise((res, rej) => {
    return web3.eth.getBlockNumber(async (err, blockNum) => {
      //console.log('block number: ', blockNum)
      return err ? rej(err) : res(blockNum)
    })
  });
}

async function loopBlocks(start, end) {
  for (let i = start; i <= end; i++) {
    console.log("Searching block " + i);

    let block = await getBlock(i)
    if (block.transactions != null) {
      console.log(`got transaction from block ${i}: `, block)
    }
  }
}

async function getTransactionsByAccount(myaccount, startBlockNumber, endBlockNumber) {
  endBlockNumber = await getBlockNumber()
  startBlockNumber = endBlockNumber > 1000 ? endBlockNumber - 1000 : 0;
  //console.log("Using startBlockNumber: " + startBlockNumber);
  console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks " + startBlockNumber + " and " + endBlockNumber);

  loopBlocks(startBlockNumber, endBlockNumber);
  /*
  for (let i = startBlockNumber; i <= endBlockNumber; i++) {
    if (i % 1000 == 0) {
      console.log("Searching block " + i);
    }
    let block = await getBlock(i)
      .then(result => {
        if (result.transactions != null) {
          result.transactions.forEach(function (e) {
            if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
              console.log("  tx hash          : " + e.hash + "\n"
                + "   nonce           : " + e.nonce + "\n"
                + "   blockHash       : " + e.blockHash + "\n"
                + "   blockNumber     : " + e.blockNumber + "\n"
                + "   transactionIndex: " + e.transactionIndex + "\n"
                + "   from            : " + e.from + "\n"
                + "   to              : " + e.to + "\n"
                + "   value           : " + e.value + "\n"
                + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
                + "   gasPrice        : " + e.gasPrice + "\n"
                + "   gas             : " + e.gas + "\n"
                + "   input           : " + e.input);
            }
          })
        }
      })
  }
  */
}

export default {
  getTransactionsByAccount
}