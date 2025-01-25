import { useState } from "react";


const StartPage = () => {
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [radius, setRadius] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  const eventsPerPage = 9; // Maximum events to show per page

  const categoryOptions = [
    { label: "Music", value: "Music" },
    { label: "Sports", value: "Sports" },
    { label: "Arts & Theatre", value: "Arts & Theatre" },
    { label: "Miscellaneous", value: "Miscellaneous" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setHasSearched(true); // Set to true when a search is submitted
    setCurrentPage(1); // Reset to the first page on a new search

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/events?city=${city}&category=${category}&radius=${radius}`
      );
      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Calculate the events to display based on the current page
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  // Navigate to the next page
  const handleNextPage = () => {
    if (currentPage * eventsPerPage < events.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Navigate to the previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-200 p-4">
      {/* Form container */}
      <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-lg mb-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Eventure
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-gray-700 font-medium">
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

          {/* Category */}
          <div>
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

          {/* Radius */}
          <div>
            <label htmlFor="radius" className="block text-gray-700 font-medium">
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700"
          >
            {loading ? "Loading..." : "Find Events"}
          </button>
        </form>
      </div>

      {/* Event List */}
      <div className="w-full max-w-5xl">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {!loading && hasSearched && events.length === 0 && !error && (
          <p className="text-center text-gray-500">
            No events found. Try a different search!
          </p>
        )}
        {!loading && events.length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow"
                >
                  {/* Event Image */}
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  {/* Event Details */}
                  <h2 className="text-xl font-semibold text-blue-600">
                    {event.name}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    <strong>Venue:</strong> {event.venue || "Unknown Venue"}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    <strong>Date:</strong>{" "}
                    {event.start_time !== "Unknown Date"
                      ? new Date(event.start_time).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          ...(event.start_time.includes("T") && {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }),
                        })
                      : "Unknown Date"}
                  </p>
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-blue-500 hover:underline"
                  >
                    View Details
                  </a>
                </div>
              ))}
            </div>

            {/* Pagination Buttons */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`w-24 px-4 py-2 rounded-md text-center ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage * eventsPerPage >= events.length}
                className={`w-24 px-4 py-2 rounded-md text-center ${
                  currentPage * eventsPerPage >= events.length
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartPage;
