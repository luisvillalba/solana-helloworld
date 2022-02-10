if [ -f "./.solana-config/id.json" ]; then
    rm -rf /home/gitpod/.config/solana/*;
    cp -R /workspace/solana-helloworld/.solana-config/* /home/gitpod/.config/solana/;
else 
    solana-keygen new --no-bip39-passphrase
    cp -r /home/gitpod/.config/solana/* ./.solana-config
fi

solana config set --url localhost