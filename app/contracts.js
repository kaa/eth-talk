// Import our contract artifacts and turn them into usable abstractions.
import talk_artifacts from '../build/contracts/Talk.json'

async function initializeContracts(web3) {
  let netId = await web3.eth.net.getId();
  console.log("netId is", netId);
  contracts.talk = new web3.eth.Contract(talk_artifacts.abi, talk_artifacts.networks[netId].address);
}

let contracts = {}
export {
  contracts,
  initializeContracts
}