### Local Deployment

The local deployment script contains an example configuration which enables us to test locally. 

```shell
anvil --chain-id 1337
forge script script/Local.s.sol --fork-url http://localhost:8545 --private-key "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" --broadcast
```

- The deployer address is `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` (initialized to `10000 ETH`).
- The test account is `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` with private key `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`.
  - This account is initialized with a balance of `10M $RG` and `1000 ETH`.


> **Warning**
> 
> If you start encountering issues to do with block asynchrony on Anvil, it's likely due to caching of the chain state in MetaMask for the test account.
> 
> You can remove this by clearing account data in MetaMask under the __Advanced__ section.
