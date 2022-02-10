#!/bin/bash

if [[ ! "$PATH" =~ .*"solana/install/active_release/bin".* ]]; then
    eval $(gp env -e PATH="/home/gitpod/.local/share/solana/install/active_release/bin:$PATH");
fi