
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import AuctionCreatedToast from '../components/signalRNotifications/AuctionCreatedToast';
import { Auction, AuctionFinished, Bid, SagaErrorType, User } from '../store/types';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAuctionQuery } from '../api/SignalRApi';
import AuctionFinishedToast from '../components/signalRNotifications/AuctionFinishedToast';
import { RootState } from '../store/store';
import BidCreatedToast from '../components/signalRNotifications/BidCreatedToast';
import ErrorBidCreatedToast from '../components/signalRNotifications/ErrorBidCreatedToast';
import { setEventFlag } from '../store/processingSlice';

export default function SignalRProvider() {
    const user: User = useSelector((state: RootState) => state.authStore);

    const [finishedAuction, setFinishedAuction] = useState<any>();
    const finishedAuctionId = finishedAuction?.auctionId ? finishedAuction.auctionId : 'empty';
    const auction = useGetAuctionQuery(finishedAuctionId, {
        skip: finishedAuctionId === 'empty'
    });
    const [auctionId, setAuctionId] = useState('');
    const dispatch = useDispatch();
    const [connection, setConnection] = useState<HubConnection | null>(null);

    const apiUrl = process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_PROD_NOTIFY_URL
        : process.env.REACT_APP_NOTIFY_URL

    useEffect(() => {
        const tokenData = localStorage.getItem("Auction");
        const token = JSON.parse(tokenData!).token;
        const newConnection = new HubConnectionBuilder()
            .withUrl(apiUrl!, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();
        setConnection(newConnection);
    }, [apiUrl]);

    useEffect(() => {
        if (!auction.isLoading && finishedAuction) {
            toast((p) => (
                <AuctionFinishedToast
                    finishedAuction={finishedAuction}
                    auction={auction.data!.result}
                />
            ),
                { duration: 10000 });
            setFinishedAuction(null);
        }
    }, [finishedAuction, auction.data, auction.data?.result, auction.isLoading]);

    useEffect(() => {
        if (auctionId) {
            toast((p) => (
                <BidCreatedToast auctionId={auctionId} toastId={p.id} />
            ), { duration: 10000 });
            setAuctionId('');
        }
    }, [auctionId]);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Коннект установлен с хабом уведомлений');

                    connection.on('BidPlaced', (bid: Bid) => {
                        //устанавливаем флаг что данные для данного пользователя готовы и нужно обновить запрос
                        dispatch(setEventFlag({ eventName: 'BidPlaced', ready: true }));

                        setTimeout(() => {
                            if (user?.login !== bid.bidder) {
                                return toast((p) => (
                                    <BidCreatedToast auctionId={bid.auctionId} toastId={p.id} />
                                ),
                                    { duration: 10000 });
                            }
                        }, 1000);

                    })

                    connection.on('AuctionCreated', (auction: Auction) => {
                        dispatch(setEventFlag({ eventName: 'AuctionCreated', ready: true }));
                        setTimeout(() => {
                            if (user?.login !== auction.seller) {
                                return toast((p) => (
                                    <AuctionCreatedToast auction={auction} toastId={p.id} />
                                ),
                                    { duration: 10000 });
                            }
                        }, 1000);
                    })

                    connection.on('AuctionUpdated', (auction: any) => {
                        //устанавливаем флаг что данные для данного пользователя готовы и нужно обновить запрос
                        dispatch(setEventFlag({ eventName: 'AuctionUpdated', ready: true }));
                    })

                    connection.on('AuctionFinished', (finishedAuction: AuctionFinished) => {
                        setTimeout(() => {
                            setFinishedAuction(finishedAuction);
                        }, 1000);
                    })

                    connection.on('AuctionDeleted', (auction: any) => {
                        dispatch(setEventFlag({ eventName: 'AuctionDeleted', ready: true }));
                    })

                    connection.on('AuctionFinished', (finishedAuction: AuctionFinished) => {
                        setTimeout(() => {
                            setFinishedAuction(finishedAuction);
                        }, 1000);
                    })

                    connection.on('FinanceCreditAdd', (finance: any) => {
                        dispatch(setEventFlag({ eventName: 'FinanceCreditAdd', ready: true }));
                    })

                    connection.on('FaultRequestFinanceDebitAdd', (debitError: SagaErrorType) => {
                        setTimeout(() => {
                            if (user?.login === debitError.userLogin) {
                                return toast((p) => (
                                    <ErrorBidCreatedToast auctionId={debitError.auctionId} toastId={p.id} />
                                ),
                                    { duration: 10000 });
                            }
                        }, 1000);
                    })
                }).catch(err => console.log(err));
        }

        return () => {
            connection?.stop();
        }
    }, [connection, user.login, dispatch]);

    return (
        <></>
    )
}
