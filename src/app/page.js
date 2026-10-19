"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/api/db/route";
import VideoCard from "@/components/VideoCard";
import { useUser } from "@/context/AuthProvider"; // apni context file ka path

const LIMIT = 12;

// Chips -> backend ke sortBy / sortType
const SORTS = [
  { label: "Latest", sortBy: "createdAt", sortType: "desc" },
  { label: "Popular", sortBy: "views", sortType: "desc" },
  { label: "Oldest", sortBy: "createdAt", sortType: "asc" },
];

export default function Home() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [sort, setSort] = useState(SORTS[0]);
  const [loading, setLoading] = useState(true); // pehli baar load
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  // Login nahi hai to login page par bhejo
  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  const fetchVideos = useCallback(
    async (pageNum, replace) => {
      try {
        setError(false);
        const res = await api.get("/videos", {
          params: {
            page: pageNum,
            limit: LIMIT,
            sortBy: sort.sortBy,
            sortType: sort.sortType,
          },
        });

        // Response ka shape: apne backend ke hisaab se yahan adjust karo
        const payload = res.data.data;
        const list = Array.isArray(payload)
          ? payload
          : (payload?.videos ?? payload?.docs ?? []);

        setVideos((prev) => (replace ? list : [...prev, ...list]));
        setHasMore(payload?.hasNextPage ?? list.length === LIMIT);
        setPage(pageNum);
      } catch (err) {
        setError(true);
        toast.error(err.response?.data?.message || "Could not load videos");
      }
    },
    [sort]
  );

  // Login hone par ya sort badalne par pehla page lao
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchVideos(1, true).finally(() => setLoading(false));
  }, [user, fetchVideos]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await fetchVideos(page + 1, false);
    setLoadingMore(false);
  };

  // Auth check ho raha hai
  if (authLoading || !user) {
    return <Skeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      {/* Sort chips */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {SORTS.map((s) => (
          <button
            key={s.label}
            onClick={() => setSort(s)}
            className={`shrink-0 rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
              sort.label === s.label
                ? "bg-white text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && <Skeleton inner />}

      {/* Error */}
      {!loading && error && videos.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-gray-300">
            Something went wrong while loading videos.
          </p>
          <button
            onClick={() => {
              setLoading(true);
              fetchVideos(1, true).finally(() => setLoading(false));
            }}
            className="mt-4 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && videos.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-lg font-semibold text-white">No videos yet</p>
          <p className="mt-1 text-sm text-gray-400">
            Be the first one to upload a video.
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && videos.length > 0 && (
        <>
          <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-white/20 disabled:opacity-60"
              >
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Skeleton({ inner = false }) {
  const grid = (
    <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-video rounded-xl bg-neutral-800" />
          <div className="mt-3 flex gap-3">
            <div className="h-9 w-9 rounded-full bg-neutral-800" />
            <div className="flex-1">
              <div className="h-4 w-3/4 rounded bg-neutral-800" />
              <div className="mt-2 h-3 w-1/2 rounded bg-neutral-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return inner ? (
    grid
  ) : (
    <div className="mx-auto max-w-7xl px-4 py-5">{grid}</div>
  );
}
