export interface PublicUser {
  name: string;
  email: string;
  photoURL: string;
  role?: string;
  joinedAt?: string;
}

export type StudioCategory =
  | "Photo Studios"
  | "Sound Stages"
  | "Podcast Rooms"
  | "Music Suites"
  | "Art Workshops";

export const STUDIO_CATEGORIES: StudioCategory[] = [
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

export const COMMON_AMENITIES = [
  "Cyc Wall",
  "Green Screen",
  "Lighting Kit",
  "Backdrops",
  "Soundproofing",
  "Mixing Console",
  "Grand Piano",
  "Live Room",
  "4K Cameras",
  "Teleprompter",
  "Podcast Gear",
  "Makeup Station",
  "Wardrobe Area",
  "Free Wi-Fi",
  "Parking",
  "Kitchenette",
  "Climate Control",
  "Lounge Area",
  "Easels",
  "Lockers",
];

export interface Studio {
  _id: string;
  title: string;
  category: StudioCategory | string;
  hourlyRate: number;
  deposit: number;
  capacity: number;
  location: string;
  image: string;
  gallery?: string[];
  amenities: string[];
  overview: string;
  ownerName: string;
  ownerEmail: string;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  updatedAt?: string;
}

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioCategory?: string;
  hourlyRate: number;
  deposit: number;
  hours: number;
  date: string; 
  startTime: string; 
  endTime: string; 
  total: number;
  status: BookingStatus;
  userEmail: string;
  userName: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  studioId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface WishlistItem {
  _id: string;
  userEmail: string;
  studioId: string;
  studio: Studio;
  createdAt: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
}
