import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { FC, useState } from 'react';
import { Connection} from '@metaplex/js'; 
import './ConnectWallet.css';
import { IWalletProps } from '../../../types/IWalletProps';

require('@solana/wallet-adapter-react-ui/styles.css');


const ConnectWallet:FC<IWalletProps> = ({className,classNameBorder}) => {
    return (   
        <Content className={className} classNameBorder={classNameBorder} /> 
    );
};

export default ConnectWallet;

const Content: FC<IWalletProps> = ({className,classNameBorder}) => {
    let [lamports, setLamports] = useState(.1);
    let [wallet, setWallet] = useState("8Dx6iP2qLMnaj8uWGLdVwhAhMV4DZ8PvFF6Uy4VCULH");

  
    const connection = new Connection(clusterApiUrl("mainnet-beta"))
    const { publicKey, sendTransaction } = useWallet();

    return (
        <div className={className}>   
            <div className={classNameBorder}>
                <WalletMultiButton />
            </div>
        </div>
    );
};