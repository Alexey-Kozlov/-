import toast from 'react-hot-toast';
import { AuctionImage } from '../../store/types';
import { NavLink } from 'react-router-dom';
import { useGetImageForAuctionQuery } from '../../api/ImageApi';
import { useGetDetailedViewDataQuery } from '../../api/AuctionApi';
import { useEffect } from 'react';
const empty = require('../../assets/Empty.png');

type Props = {
    id: string;
    toastId: string;
}

export default function BidCreatedToast({ id, toastId }: Props) {
    const { isLoading, data } = useGetImageForAuctionQuery(id);
    const bidAuction = useGetDetailedViewDataQuery(id);
    useEffect(() => {
        if (bidAuction && id) {
            bidAuction.refetch();
        }
    }, [bidAuction, id]);

    return (
        <div>
            {!bidAuction.isLoading && (
                <>
                    <div className='flex flex-row-reverse' >
                        <button onClick={() => toast.dismiss(toastId)}>X</button>
                    </div>
                    <NavLink to={`/auctions/${id}`} className='flex flex-col items-center'>
                        <div className='flex flex-row items-center gap-2'>
                            <img src={!isLoading && (data?.result as AuctionImage)!.image ? (`data:image/png;base64 , ${data?.result['image']}`) : empty}
                                alt=''
                                height={80}
                                width={80}
                                className='rounded-lg'
                            />
                            <span>{`Сделана новая ставка для аукциона "${bidAuction.data?.result.title}" - ${bidAuction.data?.result.currentHighBid} руб.`}</span>
                        </div>
                    </NavLink>
                </>
            )}
        </div>
    )
}
