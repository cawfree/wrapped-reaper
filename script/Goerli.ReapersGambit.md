### Goerli (Reaper's Gambit)

#### Deployment

```shell
forge script script/Goerli.ReapersGambit.s.sol --rpc-url "https://eth-goerli.g.alchemy.com/v2/API_KEY" --private-key "PRIVATE_KEY" --optimize --optimizer-runs 100000000 --broadcast
```

Result:

<del>
```shell
✅ Hash: 0xce83ae62178803c313f2c5f2c3565ec6e0657feb9996f65091a9feb051f19567
Contract Address: 0x076fa3967e9ba41f5871c7a0a9d2e05d4a30654e
Block: 9117633
Paid: 0.003443349010330047 ETH (1147783 gas * 3.000000009 gwei)
```
</del>

```shell
✅ Hash: 0xe29b06b3feaf0dc81874c97211ffaf5e0077e9b67e817286634fe6eb79541131
Contract Address: 0x8c741b6543ffd188e8862C8795321e3413b2E625
Block: 9201474
Paid: 0.003558929251390968 ETH (1147783 gas * 3.100698696 gwei)
```

#### Verification

<del>
```shell
ETHERSCAN_API_KEY="API_KEY" forge verify-contract 0x076fa3967e9ba41f5871c7a0a9d2e05d4a30654e REAPERSGAMBIT --optimizer-runs 100000000 --chain goerli --verifier etherscan --watch --constructor-args $(cast abi-encode "constructor()")
```
</del>

```shell
ETHERSCAN_API_KEY="API_KEY" forge verify-contract 0x8c741b6543ffd188e8862C8795321e3413b2E625 REAPERSGAMBIT --optimizer-runs 100000000 --chain goerli --verifier etherscan --watch --constructor-args $(cast abi-encode "constructor()")
```
