sh -c "$(curl -sSfL https://release.solana.com/v1.9.5/install)";
cp -R .solana-config/* /home/gitpod/.config/solana/;
echo "export PATH='/home/gitpod/.local/share/solana/install/active_release/bin:\\$PATH'" >> /home/gitpod/.bashrc;