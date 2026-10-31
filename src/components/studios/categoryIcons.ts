import type { IconType } from "react-icons";
import { LuCamera, LuMic, LuMusic, LuVideo, LuPaintbrush } from "react-icons/lu";
import type { StudioCategory } from "@/lib/types";


export const CATEGORY_ICONS: Record<StudioCategory, IconType> = {
  "Photo Studios": LuCamera,
  "Sound Stages": LuVideo,
  "Podcast Rooms": LuMic,
  "Music Suites": LuMusic,
  "Art Workshops": LuPaintbrush,
};
