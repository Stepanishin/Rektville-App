import React, { FC } from 'react';
import CurrentBet from './CurrentBet/CurrentBet';


// import { Link } from 'react-router-dom';
import { Splide, SplideSlide } from '@splidejs/react-splide';
// Default theme
import '@splidejs/react-splide/css';

// or other themes
// import '@splidejs/react-splide/css/skyblue';
// import '@splidejs/react-splide/css/sea-green';

// or only core styles
// import '@splidejs/react-splide/css/core';
import './List.css'


interface Card {
    name?: string,
    price?: number,
    date?: string,
    quantity?: number,
    avatar?: any,
    twitter?: string,
    discord?: string,
};

const data: Array<Card> = [
    {
        name: 'LazySoccer',
        price: 1,
        date: '24.6.2022',
        avatar: 'https://ltdfoto.ru/images/2022/06/23/img.gif',
        twitter: 'www.google.com',
        discord: 'www.yandex.ru',
        quantity: 666,
    },
    {
        name: 'ChokoLabs',
        price: 0.33,
        date: '27.6.2022',
        avatar: 'https://ltdfoto.ru/images/2022/06/23/img.gif',
        twitter: 'www.google.com',
        discord: 'www.yandex.ru',
        quantity: 666,
    },
    {
        name: 'BadBoys',
        price: 1.2,
        date: '15.7.2022',
        avatar: 'https://ltdfoto.ru/images/2022/06/23/img.gif',
        twitter: 'www.google.com',
        discord: 'www.yandex.ru',
        quantity: 666,
    },
    {
        name: 'BadBoy1',
        price: 1.2,
        date: '15.7.2022',
        avatar: 'https://ltdfoto.ru/images/2022/06/23/img.gif',
        twitter: 'www.google.com',
        discord: 'www.yandex.ru',
        quantity: 666,
    },
    {
        name: 'BadBoys2',
        price: 1.2,
        date: '15.7.2022',
        avatar: 'https://ltdfoto.ru/images/2022/06/23/img.gif',
        twitter: 'www.google.com',
        discord: 'www.yandex.ru',
        quantity: 666,
    },
]


const List:FC = () => {
    

    return (
        <div className='list'>
            <Splide aria-label="My Favorite Images"
                options={ {
                    wheel: true,
                    rewind: true,
                    start:0,
                    speed: 1000,
                    dragMinThreshold: {
                            mouse: 1,
                            touch: 10,
                        },
                  } }
            >
            {
                    data.map(card => {
                        return (
                            <SplideSlide className='card' key={card.name}>
                                {/* <div className='card_info_wrap'> */}
                                    <img className='card_avatar' src={card.avatar} alt="" />
                                    {/* <img src={require(card.avatar).default} alt="" width="100" height="100" />  */}
                                    <div className='card_description'>
                                        <h3 className='card_title'>{card.name}</h3>
                                        <p>Price: {card.price} sol</p>
                                        <p>Date of mint: {card.date}</p>
                                        <a className='card_links' href={card.twitter}>Twitter</a> <br />
                                        <a className='card_links' href={card.discord}>Discord</a>
                                        <p>Items: {card.quantity}</p>
                                    </div>
                                {/* </div> */}
                                <div className='card_btn_wrap'>
                                    <button>Price will be 1 sol - 2 sol</button>
                                    <button>Price will be 4 or higher</button>
                                </div>
                            </SplideSlide>
                        )
                    })
                }
            
            </Splide>
        </div>
    );
    
};


export default List;