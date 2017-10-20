import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import talk_artifacts from '../build/contracts/Talk.json'
var Talk = contract(talk_artifacts);

function initializeContracts(provider) {
  Talk.setProvider(provider);
}
export {
  Talk,
  initializeContracts
}