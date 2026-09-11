import Image from "next/image";
import { hasPhoto, type LeaderPhoto as Photo } from "@/lib/media";

type LeaderPhotoProps = {
  photo: Photo;
  /** Первый экран грузим приоритетно — влияет на LCP (§15). */
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/**
 * Портрет руководителя с фиксированным соотношением сторон:
 * место под изображение занято всегда, layout shift исключён (§15).
 */
export function LeaderPhotoFrame({
  photo,
  priority = false,
  sizes = "(min-width: 1024px) 460px, 100vw",
  className = "",
}: LeaderPhotoProps) {
  const available = hasPhoto(photo);

  return (
    <div
      className={`relative overflow-hidden bg-bg-muted ${className}`}
      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
    >
      {available ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-3 border border-line px-6 text-center"
          role="img"
          aria-label={photo.alt}
        >
          <span className="font-display text-4xl text-ink-muted">ИН</span>
          <span className="text-xs leading-relaxed text-ink-muted">
            Здесь будет фотография
            <br />
            Ивана Новикова
          </span>
        </div>
      )}
    </div>
  );
}
