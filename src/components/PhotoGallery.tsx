import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ChangeEvent,
} from "react";
import { useFetchPhotos } from "../hooks/useFetchPhotos";
import { favouriteReducer } from "../reducers/favouriteReducer";

const STORAGE_KEY = "favourites";

function loadFavourites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

const PhotoGallery = () => {
  const { loading, photos, error } = useFetchPhotos();
  const [favourites, dispatch] = useReducer(
    favouriteReducer,
    [],
    loadFavourites,
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
  }, [favourites]);

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const filteredRecords = useMemo(() => {
    const q = query.trim().toLowerCase();
    return photos.filter((photo) => photo.author.toLowerCase().includes(q));
  }, [photos, query]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        <p className="text-gray-600">Loading photos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-semibold text-red-600">
          Something went wrong while loading photos.
        </p>
        <p className="mt-2 text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search by author name..."
        className="mb-6 w-full rounded-lg 
        border-2 border-indigo-400 
        p-3 placeholder:text-slate-400 
        hover:border-indigo-600 outline-none
        focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500/10"
      />

      {filteredRecords.length === 0 ? (
        <p className="py-10 text-center text-gray-500">
          No photos found for "{query}". Try another author name.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {filteredRecords.map((photo) => {
            const isFavourite = favourites.includes(photo.id);
            return (
              <div
                key={photo.id}
                className="overflow-hidden rounded-lg bg-white shadow"
              >
                <img
                  src={`https://picsum.photos/id/${photo.id}/400/300`}
                  alt={`photo by ${photo.author}`}
                  className="h-48 w-full object-cover"
                />
                <div className="flex items-center justify-between p-3">
                  <span className="text-sm font-medium">{photo.author}</span>
                  <button
                    onClick={() => dispatch({ type: "TOGGLE", id: photo.id })}
                    title={
                      isFavourite
                        ? "Remove from favourites"
                        : "Add to favourites"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className={`h-6 w-6 ${isFavourite ? "fill-red-500 text-red-500" : "fill-none text-gray-500"}`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
