### Mainnet (Wrapped Reaper)

#### Deployment

Upper bound predicted gas:

```shell
300000 + 4000000 + 5000000 = 9300000
```

Upper bound predicted costs:

```shell
# Gas Price of 50 gwei:
9300000 * 50 = 465000000 gwei = 0.465 ETH

# Gas Price of 30 gwei:
9300000 * 30 = 279000000 gwei = 0.279 ETH
```

```shell
forge script script/Mainnet.WrappedReaper.s.sol --rpc-url "https://eth-mainnet.g.alchemy.com/v2/API_KEY" --private-key "PRIVATE_KEY" --optimize --optimizer-runs 100000000 --broadcast
```

Result:

```shell
##### mainnet
✅ Hash: 0x4813c70fce0775796526327013f964feffa2dec1a57aff68f334b9043cd030fb
Contract Address: 0x157e43fd2C7285172bd3B2826c2E7c5D790D8bb6
Block: 17530657
Paid: 0.00656472906530424 ETH (288180 gas * 22.779960668 gwei)


##### mainnet
✅ Hash: 0x0a5d6b241a2a9638bdbea82c4987fcab39dab665b23f8713bad1f61f28da5798
Contract Address: 0x549f1387948DcD57bF1e48eD9f977B5BC9BDd26d
Block: 17530657
Paid: 0.088743733314602924 ETH (3895693 gas * 22.779960668 gwei)


##### mainnet
✅ Hash: 0x53cd9b9eb67714f27231b13d6d4d0c47279acb47d82016b8ef82b94263df946c
Contract Address: 0xeC91E38a6Bd8D25c582d86bECdAd2003A25deECC
Block: 17530657
Paid: 0.098458224761510856 ETH (4322142 gas * 22.779960668 gwei)
```

#### Verification

```shell
# WrappedReaperUtils.sol
ETHERSCAN_API_KEY="" forge verify-contract 0x157e43fd2C7285172bd3B2826c2E7c5D790D8bb6 WrappedReaperUtils --optimizer-runs 100000000 --chain mainnet --verifier etherscan --watch --constructor-args $(cast abi-encode "constructor()") 
# WrappedReaperRenderer.sol (Notice the library deployment address for verification).
ETHERSCAN_API_KEY="" forge verify-contract 0x549f1387948DcD57bF1e48eD9f977B5BC9BDd26d WrappedReaperRenderer --optimizer-runs 100000000 --chain mainnet --verifier etherscan --watch --constructor-args $(cast abi-encode "constructor()") --libraries src/WrappedReaperUtils.sol:WrappedReaperUtils:0x157e43fd2C7285172bd3B2826c2E7c5D790D8bb6
# WrappedReaper.sol (Notice the library deployment address for verification).
ETHERSCAN_API_KEY="" forge verify-contract 0xeC91E38a6Bd8D25c582d86bECdAd2003A25deECC WrappedReaper --optimizer-runs 100000000 --chain mainnet --verifier etherscan --watch --constructor-args $(cast abi-encode "constructor(address,address,uint256,uint256,uint256,uint256,uint256)" 0x2C91D908E9fab2dD2441532a04182d791e590f2d 0x549f1387948DcD57bF1e48eD9f977B5BC9BDd26d 99 900 3300 40 1200) --libraries src/WrappedReaperUtils.sol:WrappedReaperUtils:0x157e43fd2C7285172bd3B2826c2E7c5D790D8bb6
```
