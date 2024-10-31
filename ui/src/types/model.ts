export interface Review {
  review: string;
  rating: number;
}

export interface Model {
  title: string;
  type: string;
  subtype: string;
  price: number;
  reviews: Review[];
  description: string;
  tags: string[];
  downloads: number;
  likes: number;
  lastUpdated: Date;
}
