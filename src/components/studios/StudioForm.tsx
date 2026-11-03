"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  LuChevronLeft,
  LuHash,
  LuImageUp,
  LuLoader,
  LuPlus,
  LuUpload,
  LuX,
} from "react-icons/lu";
import { uploadToImgbb } from "@/lib/uploadImage";
import {
  COMMON_AMENITIES,
  STUDIO_CATEGORIES,
  type Studio,
} from "@/lib/types";
import Image from "next/image";

interface StudioFormProps {
  mode: "create" | "edit";
  initial?: Studio;
  host: { name: string; email: string };
  submitting: boolean;
  onSubmit: (payload: StudioFormPayload) => void;
}

export interface StudioFormPayload {
  title: string;
  category: string;
  hourlyRate: number;
  deposit: number;
  capacity: number;
  location: string;
  image: string;
  gallery: string[];
  amenities: string[];
  overview: string;
}

const httpUrl = (value: string) => /^https?:\/\/\S+$/.test(value.trim());

export default function StudioForm({
  mode,
  initial,
  host,
  submitting,
  onSubmit,
}: StudioFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(
    initial?.category && STUDIO_CATEGORIES.includes(initial.category as never)
      ? initial.category
      : ""
  );
  const [hourlyRate, setHourlyRate] = useState(
    initial ? String(initial.hourlyRate) : ""
  );
  const [deposit, setDeposit] = useState(initial ? String(initial.deposit) : "");
  const [capacity, setCapacity] = useState(
    initial ? String(initial.capacity) : ""
  );
  const [location, setLocation] = useState(initial?.location ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [gallery, setGallery] = useState<string[]>(initial?.gallery ?? []);
  const [galleryInput, setGalleryInput] = useState("");
  const [amenities, setAmenities] = useState<string[]>(initial?.amenities ?? []);
  const [customAmenity, setCustomAmenity] = useState("");
  const [overview, setOverview] = useState(initial?.overview ?? "");

  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);


  const errors = useMemo(() => {
    const messages: Record<string, string> = {};
    if (title.trim().length < 3) messages.title = "Title needs at least 3 characters.";
    if (!category) messages.category = "Pick a category from the list.";
    const rate = Number(hourlyRate);
    if (!Number.isFinite(rate) || rate < 1 || rate > 10000)
      messages.hourlyRate = "Hourly rate must be between $1 and $10,000.";
    const dep = Number(deposit);
    if (!Number.isFinite(dep) || dep < 0 || dep > 100000)
      messages.deposit = "Deposit must be $0 or more (max $100,000).";
    const cap = Number(capacity);
    if (!Number.isInteger(cap) || cap < 1 || cap > 500)
      messages.capacity = "Capacity must be a whole number of 1 or more.";
    if (location.trim().length < 4) messages.location = "Add the area or full address.";
    if (image.trim() && !httpUrl(image))
      messages.image = "Image URL must start with http:// or https://";
    if (overview.trim().length < 30)
      messages.overview = `Tell creators more — at least 30 characters (${overview.trim().length}/30).`;
    if (amenities.length === 0)
      messages.amenities = "Pick at least one amenity so creators know what's included.";
    return messages;
  }, [title, category, hourlyRate, deposit, capacity, location, image, overview, amenities]);

  const formValid = Object.keys(errors).length === 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    if (!formValid) {
      toast.error("Please fix the highlighted fields before submitting.");
      return;
    }

    const uniqueImages = [...new Set([image.trim(), ...gallery])].filter(Boolean);

    onSubmit({
      title: title.trim(),
      category,
      hourlyRate: Number(hourlyRate),
      deposit: Number(deposit),
      capacity: Number(capacity),
      location: location.trim(),
      image: uniqueImages[0] ?? "",
      gallery: uniqueImages.slice(1),
      amenities,
      overview: overview.trim(),
    });
  };


  const uploadCover = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadToImgbb(file);
      setImage(url);
      toast.success("Cover image uploaded.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Image upload failed — try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const uploadGalleryFiles = async (files: FileList) => {
    const list = Array.from(files);
    if (list.length === 0) return;
    setGalleryUploading(true);
    try {
      const urls = await Promise.all(list.map((file) => uploadToImgbb(file)));
      setGallery((current) => [...current, ...urls]);
      toast.success(`${urls.length} extra ${urls.length === 1 ? "image" : "images"} added.`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "One or more uploads failed."
      );
    } finally {
      setGalleryUploading(false);
    }
  };


  const toggleAmenity = (amenity: string) => {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity]
    );
  };

  const addCustomAmenity = () => {
    const value = customAmenity.trim();
    if (!value) return;
    if (amenities.includes(value)) {
      toast.info("That amenity is already added.");
      return;
    }
    setAmenities((current) => [...current, value]);
    setCustomAmenity("");
  };

  const errorText = (field: keyof typeof errors, label: string) =>
    errors[field] ? (
      <p className="mt-1.5 text-xs font-medium text-error">{errors[field]}</p>
    ) : (
      <p className="mt-1.5 text-xs text-base-content/40">{label}</p>
    );

  return (
    <form onSubmit={handleSubmit} className="mt-8" noValidate>

      <fieldset className="panel-item rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6">
        <legend className="sr-only">The basics</legend>
        <h2 className="font-heading text-lg font-semibold">The basics</h2>
        <p className="mt-1 text-xs text-base-content/50">
          How creators will recognise your space in the grid.
        </p>

        <div className="mt-5 grid gap-4">
          <label className="block">
            <span className="label-text mb-1.5 block font-medium">
              Studio Title <span className="text-error">*</span>
            </span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Aurora Photo Loft — cyc wall + north light"
              className={`input input-bordered w-full bg-base-100 ${
                errors.title ? "input-error" : ""
              }`}
            />
            {errorText("title", "At least 3 characters.")}
          </label>

          <label className="block">
            <span className="mb-1.5 block font-medium">
              Category <span className="text-error">*</span>
            </span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={`select select-bordered w-full cursor-pointer bg-base-100 ${
                errors.category ? "select-error" : ""
              }`}
            >
              <option value="" disabled>
                Select a category…
              </option>
              {STUDIO_CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.category ? (
              <p className="mt-1.5 text-xs font-medium text-error">{errors.category}</p>
            ) : (
              <p className="mt-1.5 text-xs text-base-content/40">
                Photo Studios · Sound Stages · Podcast Rooms · Music Suites · Art Workshops
              </p>
            )}
          </label>
        </div>
      </fieldset>


      <fieldset className="mt-6 rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6">
        <h2 className="font-heading text-lg font-semibold">Pricing &amp; capacity</h2>
        <p className="mt-1 text-xs text-base-content/50">
          Hourly rate plus the refundable deposit creators see up front.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block font-medium">
              Hourly Rate ($) <span className="text-error">*</span>
            </span>
            <input
              type="number"
              min={1}
              max={10000}
              value={hourlyRate}
              onChange={(event) => setHourlyRate(event.target.value)}
              placeholder="45"
              className={`input input-bordered w-full bg-base-100 ${
                errors.hourlyRate ? "input-error" : ""
              }`}
            />
            {errorText("hourlyRate", "Whole dollars, $1–$10,000.")}
          </label>

          <label className="block">
            <span className="mb-1.5 block font-medium">
              Security Deposit ($) <span className="text-error">*</span>
            </span>
            <input
              type="number"
              min={0}
              max={100000}
              value={deposit}
              onChange={(event) => setDeposit(event.target.value)}
              placeholder="100"
              className={`input input-bordered w-full bg-base-100 ${
                errors.deposit ? "input-error" : ""
              }`}
            />
            {errorText("deposit", "Refundable; $0 is fine.")}
          </label>

          <label className="block">
            <span className="mb-1.5 block font-medium">
              Max Capacity <span className="text-error">*</span>
            </span>
            <input
              type="number"
              min={1}
              max={500}
              value={capacity}
              onChange={(event) => setCapacity(event.target.value)}
              placeholder="8"
              className={`input input-bordered w-full bg-base-100 ${
                errors.capacity ? "input-error" : ""
              }`}
            />
            {errorText("capacity", "People at one time (1–500).")}
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block font-medium">
            Location / Address <span className="text-error">*</span>
          </span>
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="e.g. House 12, Road 7, Dhanmondi, Dhaka"
            className={`input input-bordered w-full bg-base-100 ${
              errors.location ? "input-error" : ""
            }`}
          />
          {errorText("location", "Area + city searches best.")}
        </label>
      </fieldset>


      <fieldset className="mt-6 rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6">
        <h2 className="font-heading text-lg font-semibold">Visuals</h2>
        <p className="mt-1 text-xs text-base-content/50">
          Upload photos (hosted via imgbb) or paste an image URL directly.
        </p>

        <div className="mt-5 grid gap-4">
          <div>
            <span className="mb-1.5 block font-medium">
              Main Image (cover) <span className="text-error">*</span>
            </span>
            <div className="flex flex-wrap items-start gap-3">
              <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-base-300 bg-base-200">
                {image && httpUrl(image) ? (

                  <Image
                    src={image}
                    alt="Studio cover preview"
                    fill
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <LuImageUp aria-hidden className="size-6 text-base-content/30" />
                )}
              </div>
              <div className="flex min-w-64 flex-1 flex-wrap gap-2">
                <input
                  type="url"
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                  placeholder="https://i.ibb.co/your-studio.jpg"
                  className={`input input-bordered min-w-64 flex-1 bg-base-100 ${
                    errors.image ? "input-error" : ""
                  }`}
                />
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void uploadCover(file);
                    event.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploading}
                  className="btn btn-outline btn-primary gap-1.5 px-4"
                >
                  {uploading ? (
                    <LuLoader aria-hidden className="size-4 animate-spin" />
                  ) : (
                    <LuUpload aria-hidden className="size-4" />
                  )}
                  {uploading ? "Uploading…" : "Upload"}
                </button>
              </div>
            </div>
            {errors.image ? (
              <p className="mt-1.5 text-xs font-medium text-error">{errors.image}</p>
            ) : (
              <p className="mt-1.5 text-xs text-base-content/40">
                A wide, well-lit shot (16:9) works best.
              </p>
            )}
          </div>

          <div>
            <span className="mb-1.5 block font-medium">Gallery (optional)</span>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="url"
                value={galleryInput}
                onChange={(event) => setGalleryInput(event.target.value)}
                placeholder="Paste an extra image URL…"
                className="input input-bordered min-w-64 flex-1 bg-base-100"
              />
              <button
                type="button"
                onClick={() => {
                  const url = galleryInput.trim();
                  if (url && !httpUrl(url)) {
                    toast.error("Gallery URL must start with http:// or https://");
                    return;
                  }
                  if (gallery.includes(url)) {
                    toast.info("That image is already in the gallery.");
                    return;
                  }
                  if (url) setGallery((current) => [...current, url]);
                  setGalleryInput("");
                }}
                className="btn btn-ghost gap-1.5 px-4"
              >
                <LuPlus aria-hidden className="size-4" />
                Add
              </button>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(event) => {
                  if (event.target.files?.length)
                    void uploadGalleryFiles(event.target.files);
                  event.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={galleryUploading}
                className="btn btn-outline btn-primary gap-1.5 px-4"
              >
                {galleryUploading ? (
                  <LuLoader aria-hidden className="size-4 animate-spin" />
                ) : (
                  <LuUpload aria-hidden className="size-4" />
                )}
                {galleryUploading ? "Uploading…" : "Upload more"}
              </button>
            </div>

            {gallery.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {gallery.map((url, index) => (
                  <span
                    key={url}
                    className="group relative inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200/70 py-1 pl-1 pr-2.5"
                  >
                    <Image
                      src={url}
                      alt=""
                      fill
                      className="size-7 rounded-full object-cover"
                    />
                    <span className="max-w-40 truncate text-xs text-base-content/70">
                      {url.split("/").pop()}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setGallery((current) => current.filter((_, i) => i !== index));
                      }}
                      aria-label={`Remove gallery image ${index + 1}`}
                      className="text-base-content/40 transition hover:text-error"
                    >
                      <LuX aria-hidden className="size-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="mt-1.5 text-xs text-base-content/40">
              Shown as slides behind the cover in the studio&apos;s gallery.
            </p>
          </div>
        </div>
      </fieldset>


      <fieldset className="mt-6 rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6">
        <h2 className="font-heading text-lg font-semibold">
          Amenities <span className="text-error">*</span>
        </h2>
        <p className="mt-1 text-xs text-base-content/50">
          Tick everything included — or add your own tag below.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {COMMON_AMENITIES.map((amenity) => {
            const active = amenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                aria-pressed={active}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-primary bg-primary/10 font-medium text-primary"
                    : "border-base-300 bg-base-100 text-base-content/70 hover:border-base-content/30 hover:text-base-content"
                }`}
              >
                {amenity}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex max-w-md gap-2">
          <label className="relative flex-1">
            <LuHash
              aria-hidden
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-base-content/40"
            />
            <input
              type="text"
              value={customAmenity}
              onChange={(event) => setCustomAmenity(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addCustomAmenity();
                }
              }}
              placeholder="Add a custom amenity (e.g. Teleprompter)"
              className="input input-bordered w-full bg-base-100 pl-9"
            />
          </label>
          <button
            type="button"
            onClick={addCustomAmenity}
            className="btn btn-outline gap-1.5 px-4"
          >
            <LuPlus aria-hidden className="size-4" />
            Add
          </button>
        </div>

        {amenities.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="w-full text-xs font-medium text-base-content/50">
              Added ({amenities.length}) — click ✕ to remove:
            </span>
            {amenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {amenity}
                <button
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  aria-label={`Remove ${amenity}`}
                  className="text-primary/60 transition hover:text-error"
                >
                  <LuX aria-hidden className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {errors.amenities && (
          <p className="mt-3 text-xs font-medium text-error">{errors.amenities}</p>
        )}
      </fieldset>


      <fieldset className="mt-6 rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6">
        <h2 className="font-heading text-lg font-semibold">Detailed overview</h2>
        <p className="mt-1 text-xs text-base-content/50">
          Layout, equipment, natural light at different hours, house rules.
        </p>

        <label className="mt-4 block">
          <textarea
            value={overview}
            onChange={(event) => setOverview(event.target.value)}
            rows={6}
            placeholder="Describe the space, what's included in the rate, and how a shoot usually runs…"
            className={`textarea textarea-bordered w-full bg-base-100 leading-6 ${
              errors.overview ? "textarea-error" : ""
            }`}
          />
          <span className="mt-1.5 flex items-center justify-between text-xs">
            {errors.overview ? (
              <span className="font-medium text-error">{errors.overview}</span>
            ) : (
              <span className="text-base-content/40">
                Minimum 30 characters — specifics win bookings.
              </span>
            )}
            <span
              className={`${
                overview.trim().length >= 30 ? "text-success" : "text-base-content/40"
              }`}
            >
              {overview.trim().length} chars
            </span>
          </span>
        </label>


        <div className="mt-5 rounded-xl border border-base-200 bg-base-200/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
            Host (read-only)
          </p>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Name</span>
              <input
                type="text"
                value={host.name}
                readOnly
                className="input input-bordered w-full cursor-not-allowed bg-base-200/70 opacity-80"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Email</span>
              <input
                type="email"
                value={host.email}
                readOnly
                className="input input-bordered w-full cursor-not-allowed bg-base-200/70 opacity-80"
              />
            </label>
          </div>
          <p className="mt-2 text-[11px] text-base-content/40">
            Ownership is stamped server-side from your session — it can&apos;t be edited.
          </p>
        </div>
      </fieldset>

      <div className="mt-7 flex flex-wrap items-center justify-end gap-3">
        <Link
          href="/my-listings"
          className="btn btn-ghost gap-1.5 px-5 text-base-content/70"
        >
          <LuChevronLeft aria-hidden className="size-4" />
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary gap-2 rounded-full px-8 font-semibold"
        >
          {submitting && <LuLoader aria-hidden className="size-4.5 animate-spin" />}
          {mode === "create"
            ? submitting
              ? "Publishing…"
              : "Add Studio"
            : submitting
              ? "Saving…"
              : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
