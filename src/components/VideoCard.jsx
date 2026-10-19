import Link from "next/link";

// 125 seconds -> "2:05"
function formatDuration(sec = 0) {
  const total = Math.floor(Number(sec) || 0);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

// 1250 -> "1.3K"
function formatViews(n = 0) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(
    Number(n) || 0
  );
}

// date -> "3 days ago"
function timeAgo(date) {
  if (!date) return "";
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [name, secs] of units) {
    const v = Math.floor(diff / secs);
    if (v >= 1) return `${v} ${name}${v > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export default function VideoCard({ video = {} }) {
  const { _id, title, thumbnail, duration, views, createdAt } = video;

  // Backend populate karta hai to owner object aata hai, warna fallback
  const owner = video.owner || video.ownerDetails || {};

  return (
    <Link href={`/watch/${_id}`} className="group block">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-800">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-neutral-700 via-neutral-800 to-red-950" />
        )}
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
          {formatDuration(duration)}
        </span>
      </div>

      {/* Info */}
      <div className="mt-3 flex gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-neutral-700 text-sm font-semibold text-white">
          {owner.avatar ? (
            <img
              src={owner.avatar}
              alt={owner.username}
              className="h-full w-full object-cover"
            />
          ) : (
            owner.username?.[0]?.toUpperCase()
          )}
        </div>

        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-red-400">
            {title}
          </h3>
          <p className="mt-1 text-xs text-gray-400">
            {owner.username || "Unknown"}
          </p>
          <p className="text-xs text-gray-400">
            {formatViews(views)} views • {timeAgo(createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
