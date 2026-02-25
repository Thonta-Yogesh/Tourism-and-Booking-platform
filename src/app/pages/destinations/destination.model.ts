export interface Destination {
    id: number;
    name: string;
    description: string;
    location: string;
    imageUrl: string;
    price: number;
    rating: number;
    type: 'Beach' | 'Mountain' | 'City' | 'Cultural' | 'Nature';
    popularity: 'High' | 'Medium' | 'Low';
    images: string[];
    tourismInfo: {
        bestTimeToVisit: string;
        language: string;
        currency: string;
    };
    highlights: string[];
    duration: string;
    reviews: Review[];
}

export interface Review {
    author: string;
    avatar: string; // URL to avatar image
    rating: number;
    text: string;
    date: string;
}
