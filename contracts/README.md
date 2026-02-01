
No files changed, compilation skipped
Script ran successfully.

== Logs ==
  ExchangeDeskRouter deployed at: 0xa4AA9d05f142dbd5893992B70A1E8157b4801a50
  Fee recipient: 0xD3C3d844f031c87722e38cd08052dC794F431D8f

## Setting up 1 EVM.

==========================

Chain 11155111

Estimated gas price: 2.173177652 gwei

Estimated total gas used for script: 6902200

Estimated amount required: 0.0149997067896344 ETH


## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
