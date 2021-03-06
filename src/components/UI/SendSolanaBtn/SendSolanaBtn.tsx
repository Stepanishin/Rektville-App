import React, { useEffect } from 'react';
import { FC, ReactNode, useMemo, useCallback, useState } from 'react';
import './SendSolanaBtn.css'

import { clusterApiUrl, Transaction, SystemProgram, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { actions, utils, programs, NodeWallet, Connection} from '@metaplex/js';
import { WalletAdapterNetwork, WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { termsAndConditionsSlice } from '../../../store/reducers/getTermsAndConditionsReducer';
import { getDatabase, ref, get, child, push, update, set } from "firebase/database";
import { timerAndDisableBtnSlice } from '../../../store/reducers/getTimerAndDisablebtnReducer';
import { ISendSolanaBtnProps } from '../../../types/ISendSolanaBtnProps';

let thelamports = 0;
// let theWallet = "8Dx6iP2qLMnaj8uWGLdVwhAhMV4DZ8PvFF6Uy4VCULH"

const SendSolanaBtn: FC<ISendSolanaBtnProps> = ({cardDescrMore, cardDescrLess,wallet,classN,name,SolForWhat, SolForMore, SolForLess}) => {

    let alarmTerms: any
    let alarm_sendSucces : any
    let alarm_sendError : any
    useEffect(() => {
        alarmTerms = document.querySelector('.alarm_terms')!
    }, [])

    const db = getDatabase();
    const {isDisabled} = useAppSelector(state => state.termsAndConditionsSlice)
    const {termsAndConditions} = termsAndConditionsSlice.actions
    const {isTimeToDisable} = useAppSelector(state => state.timerAndDisableBtnSlice)
    const {timerAndDisableBtn} = timerAndDisableBtnSlice.actions
    const dispatch = useAppDispatch()


    // let [lamports, setLamports] = useState(price);
    // let lamports: any = judgePrice
    // let [wallet, setWallet] = useState("8Dx6iP2qLMnaj8uWGLdVwhAhMV4DZ8PvFF6Uy4VCULH");
    let theWallet:any= wallet

    const connection = new Connection(clusterApiUrl("mainnet-beta"))
    const { publicKey, sendTransaction } = useWallet();


    const onClick = useCallback( async (e:any) => {

        alarm_sendError = document.querySelector('.alarm_sendError')!

        try {
            let judgePrice:number = +(e.target.value)
        
        alarmTerms = document.querySelector('.alarm_terms')!
        alarm_sendSucces = document.querySelector('.alarm_sendSucces')!

        if (isTimeToDisable) {
            return false
        }

        if (isDisabled) {
            alarmTerms.classList.add('alarm_terms_display')

            const closeAlarm =() => {
                alarmTerms.classList.remove('alarm_terms_display')
            }

            setTimeout(closeAlarm, 3000)
            return false
        }

        if (!publicKey) {
            let wl: HTMLElement = document.querySelector('.wallet-adapter-button')!
            if (wl instanceof HTMLElement) {
                    wl.click()         
            }
            
        }

        if (!publicKey) throw new WalletNotConnectedError('connect wallet123');
        


        connection.getBalance(publicKey).then((bal) => {
        });

        let lamportsI = LAMPORTS_PER_SOL*e.target.value;
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: new PublicKey(theWallet),
                lamports: lamportsI,
            })
        );

        const signature = await sendTransaction(transaction, connection);
        
        await connection.confirmTransaction(signature, 'processed');
        
        const updateDb = () => {
            const dbRef = ref(getDatabase());
                    get(child(dbRef,  `/Judges/${name}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        let arr = snapshot.val()

                        const updates:any = {};

                        let solQuantity:any = 0;
                        if (SolForWhat === 'SolForMore') {
                            solQuantity = arr.SolForMore
                        } else if (SolForWhat === 'SolForLess') {
                            solQuantity = arr.SolForLess
                        }

                        updates[`/Judges/${name}` + `/${SolForWhat}/`] = judgePrice + solQuantity;
        
                        get(child(dbRef,  `/Judges/${name}/wallets/${SolForWhat}`)).then((snapshot) => {
                            if (snapshot.exists()) {
                                let userWallet = publicKey.toBase58()
                                let arr = snapshot.val()
                                if (arr.hasOwnProperty(`${userWallet}`)) {
                                    let currentBet = arr[userWallet].bet
                                    updates[`/Judges/${name}/wallets/${SolForWhat}/${userWallet}/bet/`] = currentBet + judgePrice
                                    return update(ref(db), updates);
                                } else {
                                    set(ref(db, `/Judges/${name}/wallets/${SolForWhat}/${userWallet}`), {
                                        'userWallet': userWallet,
                                        'bet': judgePrice,
                                    });
                                }
                            }
                        }).catch((error) => {
                            console.error(error);
                        });
                        

                        alarm_sendSucces.classList.add('alarm_sendSucces_display')
                        const closeAlarmSucces =() => {
                            alarm_sendSucces.classList.remove('alarm_sendSucces_display')
                        }
                        setTimeout(closeAlarmSucces, 5000)

                        return update(ref(db), updates);
    
                    } else {
                        console.log("No data available");
                    }
                    }).catch((error) => {
                    console.error(error);
                    });
        }
        updateDb()
          } catch (err) {
            alarm_sendError.classList.add('alarm_sendError_display')
            const closeAlarmError =() => {
                alarm_sendError.classList.remove('alarm_sendError_display')
            }
            setTimeout(closeAlarmError, 5000)
          }

         
    }, [publicKey, sendTransaction, connection ]);

    
    

    return (
        <div className='SendSolanaBtn_container'>

            <div className={classN} >
                <p style={{color: 'black', textAlign:'center'}} >{cardDescrLess} {cardDescrMore}</p>  <br />
                <div className='btnDEMO_container' >
                    <button value={0.1}  onClick={onClick} className='btnDEMO'>
                        0.1 SOL <br />
                        <span style={{fontSize: '10px'}}>
                        {
                            SolForLess && SolForMore
                            ?
                            SolForWhat === 'SolForMore'
                            ?
                            " win " + ((SolForMore + (SolForLess * 0.8) + 0.1)  / ((SolForMore + 0.1) / 0.1)).toFixed(2) + " SOL"
                            :
                            " win " + ((SolForLess + (SolForMore * 0.8) + 0.1)  / ((SolForLess + 0.1) / 0.1)).toFixed(2) + " SOL"
                            :
                            <></>
                        }
                        </span>
                        
                    </button>
                    <button value={0.3}  onClick={onClick} className='btnDEMO'>
                        0.3 SOL <br />
                        <span style={{fontSize: '10px'}}>
                        {
                            SolForLess && SolForMore
                            ?
                            SolForWhat === 'SolForMore'
                            ?
                            "win " + (((SolForMore + (SolForLess * 0.8) + 0.3)  / ((SolForMore + 0.3) / 0.1)) * 3).toFixed(2) + " SOL"
                            :
                            "win " + (((SolForLess + (SolForMore * 0.8) + 0.3)  / ((SolForLess + 0.3) / 0.1)) * 3).toFixed(2) + " SOL"
                            :
                            <></>
                        }
                        </span>
                    </button>
                    <button value={0.5}  onClick={onClick} className='btnDEMO'>
                        0.5 SOL<br />
                        <span style={{fontSize: '10px'}}>
                        {
                            SolForLess && SolForMore
                            ?
                            SolForWhat === 'SolForMore'
                            ?
                            "win " + (((SolForMore + (SolForLess * 0.8) + 0.5)  / ((SolForMore + 0.5) / 0.1)) * 5).toFixed(2) + " SOL"
                            :
                            "win " + (((SolForLess + (SolForMore * 0.8) + 0.5)  / ((SolForLess + 0.5) / 0.1)) * 5).toFixed(2) + " SOL"
                            :
                            <></>
                        }
                        </span>
                    </button>
                    <button value={1}  onClick={onClick} className='btnDEMO'>
                        1 SOL<br />
                        <span style={{fontSize: '10px'}}>
                        {
                            SolForLess && SolForMore
                            ?
                            SolForWhat === 'SolForMore'
                            ?
                            "win " + (((SolForMore + (SolForLess * 0.8) + 1)  / ((SolForMore + 1) / 0.1)) * 10).toFixed(2) + " SOL"
                            :
                            "win " + (((SolForLess + (SolForMore * 0.8) + 1)  / ((SolForLess + 1) / 0.1)) * 10).toFixed(2) + " SOL"
                            :
                            <></>
                        }
                        </span>
                    </button>
                </div>               
            </div>


            <div className='alarm_terms'>Accept terms and conditions!</div>
            <div className='alarm_sendSucces'>Sending successful!</div>
            <div className='alarm_sendError'>Something went wrong</div>
        </div>
    );
};

export default SendSolanaBtn;