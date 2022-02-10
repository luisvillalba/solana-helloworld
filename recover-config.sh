#!/bin/bash

./sol-env.sh

if [ -f "./.solana-config/id.json" ]; then
    if [ -d "/home/gitpod/.config/solana" ]; then
        rm -rf /home/gitpod/.config/solana/*;
    fi
    cp -R /workspace/solana-helloworld/.solana-config/* /home/gitpod/.config/solana/;
else 
    solana-keygen new --no-bip39-passphrase
    mkdir /workspace/solana-helloworld/.solana-config/
    cp -R /home/gitpod/.config/solana/* /workspace/solana-helloworld/.solana-config/
fi

solana config set --url localhost