import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import talk_artifacts from '../build/contracts/Talk.json'

async function initializeContracts(provider) {
  var Talk = contract(talk_artifacts);
  Talk.setProvider(provider);
  contracts.talk = await Talk.deployed();
}
let contracts = {}
export {
  contracts,
  initializeContracts
}