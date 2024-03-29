export type Auction = {
  reservePrice: number;
  seller: string;
  winner?: string;
  soldAmount: number;
  currentHighBid: number;
  createAt: Date;
  updatedAt: Date;
  auctionEnd: Date;
  status: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  description?: string;
  image?: string;
  id: string;
  error?: string;
};

export type Bid = {
  id: string;
  auctionId: string;
  bidder: string;
  bidTime: string;
  amount: number;
  bidStatus: string;
};

export type AuctionFinished = {
  itemSold: boolean;
  auctionId: string;
  winner?: string;
  seller: string;
  amount?: number;
};

export type LoginResponse = {
  name: string;
  login: string;
  token: string;
  id: string;
};

export type CreateUser = {
  name: string;
  login: string;
  password: string;
};

export type LoginUser = {
  login: string;
  password: string;
};

export type User = {
  name: string;
  login: string;
  id?: string;
};

export type PagedResult<T> = {
  results: T[];
  pageCount: number;
  totalCount: number;
};

export type ApiResponse<T> = {
  data?: {
    statusCode: number;
    isSuccess: boolean;
    errorMessages: Array<string>;
    result: T;
  };
  error?: any;
};

export type ObjectResponse<T> = {
  data?: T;
  error?: any;
};

export type PlaceBidParams = {
  amount: number;
  auctionId: string;
};

export type CreateUpdateAuctionParams = {
  id?: string;
  data: string;
};

export type AuctionImage = {
  id: string;
  image: string;
};
