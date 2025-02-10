import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";


const categoryOptions = [
  { label: "Music", value: "Music" },
  { label: "Sports", value: "Sports" },
  { label: "Arts & Theatre", value: "Arts & Theatre" },
  { label: "Miscellaneous", value: "Miscellaneous" },
  { label: "Film", value: "Film" },
];

const StartPage = () => {
  // Search form state
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [radius, setRadius] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched] = useState(false);

  // Favorites state (bookmarked events) from sessionStorage
  const [favorites, setFavorites] = useState(
    JSON.parse(sessionStorage.getItem("favorites")) || []
  );

  // Update sessionStorage whenever favorites change.
  useEffect(() => {
    sessionStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const navigate = useNavigate();

  // When the form is submitted, navigate to /list with the search parameters.
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    navigate(`/list?city=${city}&category=${category}&radius=${radius}`);
  };

  // Toggle (remove/add) bookmark; on this page, you'll typically remove bookmarks.
  const toggleFavorite = (event) => {
    const isFav = favorites.some((fav) => fav.id === event.id);
    if (isFav) {
      setFavorites(favorites.filter((fav) => fav.id !== event.id));
    } else {
      setFavorites([...favorites, event]);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-200 p-4">
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        {/* Left text block (visible on larger screens) */}
        {!hasSearched && (
          <div className="hidden md:block w-1/3 text-gray-600 text-center">
            <h3 className="text-xl font-bold">Discover Events Near You</h3>
            <p className="mt-2">
              Find the best concerts, sports games, and theater shows in your
              area with just a few clicks!
            </p>
          </div>
        )}

        {/* Search Form */}
        <div
          className={`p-4 bg-white rounded-lg shadow-lg ${
            hasSearched
              ? "flex flex-row gap-4 w-full max-w-7xl scale-100"
              : "flex-col space-y-6 w-full max-w-lg scale-90"
          } transition-all duration-1000 ease-in-out`}
        >
          <h1
            className="text-3xl font-bold mb-4 text-center text-blue-600"
            style={{ marginTop: "30px" }}
          >
            Eventure
          </h1>
          <form
            onSubmit={handleSubmit}
            className={`flex flex-1 ${
              hasSearched
                ? "flex-row items-center gap-4"
                : "flex-col space-y-6"
            } transition-all duration-1000 ease-in-out`}
          >
            <div className="flex-1">
              <label
                htmlFor="city"
                className="block text-gray-700 font-medium"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a city"
                required
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="category"
                className="block text-gray-700 font-medium"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label
                htmlFor="radius"
                className="block text-gray-700 font-medium"
              >
                Radius (km)
              </label>
              <input
                type="number"
                id="radius"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 10"
                required
              />
            </div>
            <button
              type="submit"
              className={`${
                hasSearched ? "self-center" : "w-full"
              } bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700`}
              style={{ marginTop: "20px", padding: "10px" }}
            >
              {loading ? "Loading..." : "Find Events"}
            </button>
          </form>
        </div>

        {/* Right text block (visible on larger screens) */}
        {!hasSearched && (
          <div className="hidden md:block w-1/3 text-gray-600 text-center">
            <h3 className="text-xl font-bold">Save Your Favorites</h3>
            <p className="mt-2">
              Bookmark events you love and never miss out on the action. Your
              personalized event planner is here.
            </p>
          </div>
        )}
      </div>

      {/* Bookmarked Events Section */}
      {favorites.length > 0 && (
        <div className="w-full max-w-7xl mt-6">
          <h2 className="text-2xl font-bold mb-4">Bookmarked Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {favorites.map((event) => (
              <div
                key={event.id}
                className="p-4 bg-white rounded-lg shadow-md border flex flex-col justify-between"
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-bold text-blue-600 hover:underline"
                >
                  {event.name}
                </a>
                <p className="text-gray-600">{event.venue}</p>
                <p className="text-gray-600">{event.start_time}</p>
                <button
                  onClick={() => toggleFavorite(event)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md w-full"
                >
                  Remove Bookmark
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StartPage;
