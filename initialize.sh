sh -c "$(curl -sSfL https://release.solana.com/v1.9.5/install)";
rm -rf /home/gitpod/.config/solana/*;
cp -R /workspace/solana-helloworld/.solana-config/* /home/gitpod/.config/solana/;
gp env PATH="/home/gitpod/.local/share/solana/install/active_release/bin:$PATH"
solana config set --url localhost