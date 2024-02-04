# Etica Smart Contract
Welcome to the Etica smart contract repository, powering the core system of the Etica Protocol.

## Meticulous Hardfork | Etica v2 Enhancements

- **Quadratic Voting:** The incorporation of quadratic voting introduces a pioneering method to distribute voting power more equitably within the Etica ecosystem, providing safeguards against disproportionately influential votes.

- **ETI Recovery System:** A dedicated system has been implemented to facilitate the recovery of ETI in situations where commits remain unrevealed.

- **Difficulty Adjustment Update:** The block difficulty adjustment mechanism has been refined, transitioning from a 2016-block cycle to a more responsive 144-block cycle.

- **ETI Collateral Requirement:** The collateral needed for proposals in ETI has been increased, moving from 10 to 100 ETI. This adjustment aims to ensure a more meaningful commitment to proposals.

- **Validation of Etica Network Upgrade Process:** The update has been tested with a robust validation mechanism for the Etica blockchain, thanks to a secure network upgrade process.

- **Mining Vulnerability Fix:** A critical mining vulnerability related to 0xBtc has been addressed to enhance the overall security of the system.

- **Etica Smart Contract Optimizations:** Various optimizations have been applied to the Etica smart contract, enhancing efficiency and overall performance.

## Project Details

- **Version:** 2.0.0
- **License:** ISC (Internet Systems Consortium)

## Deployment and Testing

### Transition to Hardhat

As Truffle has ceased its support and the Truffle project is set to close, this repository has migrated from Truffle to Hardhat for deployment and testing.

### Legacy Versions

Legacy versions of the Etica smart contract can be found in the `contracts/legacy-versions/v1` directory.

### Running Tests

Tests located in /test need to be migrated to Hardhat. However, these tests can be run using the legacy v1 smart contract with Truffle.

To run tests with Truffle:

```bash
truffle test

Hardhat example tasks:

```shell
npx hardhat help
npx hardhat test
npx hardhat run scripts/deploy.js
```
