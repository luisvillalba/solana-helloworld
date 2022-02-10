#!/bin/bash

sh -c "$(curl -sSfL https://release.solana.com/v1.9.5/install)";

if [[ ! "$PATH" =~ .*"solana/install/active_release/bin".* ]]; then
    gp env PATH="/home/gitpod/.local/share/solana/install/active_release/bin:$PATH"
fi

if [ -f "./.solana-config/id.json" ]; then
    if [ -d "/home/gitpod/.config/solana" ]; then
        rm -rf /home/gitpod/.config/solana/*;
    fi
    cp -R /workspace/solana-helloworld/.solana-config/* /home/gitpod/.config/solana/;
else 
    solana-keygen new --no-bip39-passphrase
    cp -r /home/gitpod/.config/solana/* /workspace/solana-helloworld/.solana-config/
fi