#!/bin/bash

# REF: https://github.com/jpmorganchase/quorum/blob/master/docs/running.md

. GENESIS_JSON_INPUT

cat <<EOF_GENESIS_JSON > genesis.json

{
  "alloc": {
    "0x0000000000000000000000000000000000000020": {
    "code": "${CODE_BINARY}",
      "storage": {
        "0x0000000000000000000000000000000000000000000000000000000000000001": "0x02",
        "0x0000000000000000000000000000000000000000000000000000000000000002": "0x04",
        "0x0000000000000000000000000000000000000000000000000000000000000004": "0x02",
        "${MAKER_01_STORE}"   : "0x01",
        "${SIGNER_01_STORE}"  : "0x01",
        "${OBSERVER_01_STORE}": "0x01"
      }
    },
    "0x${MAKER_01}"   : { "balance": "1000000000000000000000000000" },
    "0x${SIGNER_01}"  : { "balance": "1000000000000000000000000000" },
    "0x${OBSERVER_01}": { "balance": "1000000000000000000000000000" }
  },
  "coinbase": "0x0000000000000000000000000000000000000000",
  "config": { "homesteadBlock": 0 },
  "difficulty": "0x0",
  "extraData": "0x",
  "gasLimit": "0x2FEFD800",
  "mixhash": "0x00000000000000000000000000000000000000647572616c65787365646c6578",
  "nonce": "0x0",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "timestamp": "0x00"
}
EOF_GENESIS_JSON

# Note: Once created initialize geth with command:
# $ geth init genesis.json
