import type { Studio, StudioCategory } from "./types";

/**
 * Sample studios shown ONLY while the backend is unreachable so the UI stays
 * explorable (marked with a visible "sample data" notice).
 */
const now = "2026-10-12T09:30:00.000Z";

const img = (
  id: string,
  size = 1200
) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${size}&q=80`;

/** Category image pool — verified Unsplash CDN photos. */
export const CATEGORY_IMAGES: Record<StudioCategory, string[]> = {
  "Photo Studios": [
    img("1500051638674-ff996a0ec29e"), // printed photos pinned on a board
    img("1516035069371-29a1b244cc32"), // camera + lenses, flatlay
  ],
  "Sound Stages": [
    img("1485846234645-a62644f84728"), // film clapperboard
    img("1493804714600-6edb1cd93080"), // cinema camera against the sky
  ],
  "Podcast Rooms": [
    img("1511671782779-c97d3d27a1d4"), // chrome mic, bokeh
    img("1485579149621-3123dd979885"), // stage microphone
    img("1516280440614-37939bbacd81"), // handheld mic, dark
  ],
  "Music Suites": [
    img("1520523839897-bd0b52f945a0"), // grand piano keys
    img("1598488035139-bdbb2231ce04"), // mixing console + guitars
    img("1511379938547-c1f69419868d"), // home studio by the window
  ],
  "Art Workshops": [
    img("1520333789090-1afc82db536a"), // artist desk with brushes
    img("1452860606245-08befc0ff44b"), // craft tools flatlay
    img("1533158326339-7f3cf2404354"), // abstract painting
  ],
};

export const SAMPLE_STUDIOS: Studio[] = [
  {
    _id: "sample-aurora-loft",
    title: "Aurora Photo Loft",
    category: "Photo Studios",
    hourlyRate: 45,
    deposit: 100,
    capacity: 8,
    location: "Dhanmondi, Dhaka",
    image: "https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Cyc Wall", "Lighting Kit", "Backdrops", "Makeup Station", "Free Wi-Fi", "Climate Control"],
    overview:
      "A bright corner loft with a 4.5m cyc wall, layered backdrops and a full LED/key-light kit.",
    ownerName: "Rifat Chowdhury",
    ownerEmail: "owner@studiospace.dev",
    rating: 4.8,
    reviewsCount: 124,
    createdAt: now,
  },
  {
    _id: "sample-echo-suite",
    title: "Echo House Podcast Suite",
    category: "Podcast Rooms",
    hourlyRate: 35,
    deposit: 80,
    capacity: 4,
    location: "Banani, Dhaka",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Soundproofing", "Podcast Gear", "Teleprompter", "Lounge Area", "Kitchenette", "Free Wi-Fi"],
    overview: "Fully treated podcast booth with a 4-person table setup and broadcast-ready gear.",
    ownerName: "Nadia Islam",
    ownerEmail: "owner2@studiospace.dev",
    rating: 4.9,
    reviewsCount: 89,
    createdAt: now,
  },
  {
    _id: "sample-blackbox-stage",
    title: "Blackbox Sound Stage 7",
    category: "Sound Stages",
    hourlyRate: 80,
    deposit: 200,
    capacity: 20,
    location: "Uttara Sector 7, Dhaka",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Green Screen", "4K Cameras", "Lighting Kit", "Wardrobe Area", "Climate Control", "Parking"],
    overview: "Blackout stage with a 6m green screen, grip package and camera support for narrative shoots.",
    ownerName: "Tanvir Rahman",
    ownerEmail: "owner3@studiospace.dev",
    rating: 4.7,
    reviewsCount: 210,
    createdAt: now,
  },
  {
    _id: "sample-freepiano-room",
    title: "Freepiano Room",
    category: "Music Suites",
    hourlyRate: 40,
    deposit: 120,
    capacity: 6,
    location: "Mirpur DOHS, Dhaka",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Grand Piano", "Live Room", "Mixing Console", "Soundproofing", "Lockers"],
    overview: "Tracked live room centred on a grand piano, with a console-driven monitoring chain.",
    ownerName: "Shafin Ahmed",
    ownerEmail: "owner4@studiospace.dev",
    rating: 5.0,
    reviewsCount: 56,
    createdAt: now,
  },
  {
    _id: "sample-clay-canvas",
    title: "Clay & Canvas Workshop",
    category: "Art Workshops",
    hourlyRate: 25,
    deposit: 50,
    capacity: 12,
    location: "Mohammadpur, Dhaka",
    image: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Easels", "Free Wi-Fi", "Kitchenette", "Lockers", "Parking"],
    overview: "Open workshop floor for pottery, painting and small cross-craft classes with daylight flooding.",
    ownerName: "Meera Saha",
    ownerEmail: "owner5@studiospace.dev",
    rating: 4.6,
    reviewsCount: 67,
    createdAt: now,
  },
  {
    _id: "sample-northlight-cyc",
    title: "Northlight Cyc Studio",
    category: "Photo Studios",
    hourlyRate: 60,
    deposit: 150,
    capacity: 10,
    location: "Gulshan 2, Dhaka",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Cyc Wall", "Backdrops", "Makeup Station", "Wardrobe Area", "Free Wi-Fi", "Parking"],
    overview: "White-shoot favourite with a curved cyc, hair-makeup bay and quick-change wardrobe corner.",
    ownerName: "Faraz Karim",
    ownerEmail: "owner6@studiospace.dev",
    rating: 4.8,
    reviewsCount: 141,
    createdAt: now,
  },
];
