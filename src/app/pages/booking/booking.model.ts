export interface BookingRequest {
    destinationId: number;
    date: string; // ISO string or simple date string
    guests: number;
    name: string;
    email: string;
    phone: string;
    specialRequests?: string;
}
