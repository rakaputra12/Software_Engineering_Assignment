// EventListPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons for Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconGrey from "../assets/red-image.png"; // adjust path if needed
import markerIconRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const markerGreyIcon = L.icon({
  iconUrl: markerIconGrey,
  iconSize: [21, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -24],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
});

const DynamicMapCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

const EventListPage = () => {
  // Read initial search parameters from the URL.
  const [searchParams] = useSearchParams();
  const initialCity = searchParams.get("city") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialRadius = searchParams.get("radius") || "";

  // Local state for search fields (editable, but changes here won't trigger a fetch)
  const [city, setCity] = useState(initialCity);
  const [category, setCategory] = useState(initialCategory);
  const [radius, setRadius] = useState(initialRadius);

  // Other states.
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mapCenter, setMapCenter] = useState([50.110924, 8.682127]); // default center (e.g. Frankfurt)
  const [selectedEventId, setSelectedEventId] = useState(null);

  // State for bookmarked events (favorites)
  const [favorites, setFavorites] = useState(
    JSON.parse(sessionStorage.getItem("favorites")) || []
  );

  // Sync favorites to sessionStorage.
  useEffect(() => {
    sessionStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const eventsPerPage = 9;
  const navigate = useNavigate();

  // Being on this page means a search has been made.
  const hasSearched = true;

  // Fetch events whenever the URL search parameters change.
  // (This ensures that changing the form fields alone won't trigger a fetch.)
  useEffect(() => {
    const queryCity = searchParams.get("city") || "";
    const queryCategory = searchParams.get("category") || "";
    const queryRadius = searchParams.get("radius") || "";

    const fetchEvents = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/events?city=${queryCity}&category=${queryCategory}&radius=${queryRadius}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data.events || []);

        // If events exist, update the map center to the first event's location.
        if (data.events && data.events.length > 0 && data.events[0].location) {
          const firstEvent = data.events[0];
          setMapCenter([firstEvent.location.lat, firstEvent.location.lng]);
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchParams]); // Only run when the URL query parameters change

  // Pagination logic.
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const handleNextPage = () => {
    if (currentPage * eventsPerPage < events.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleEventClick = (eventId, location) => {
    setSelectedEventId(eventId);
    setMapCenter(location);
  };

  // When the search bar is submitted, update the URL query parameters and reset pagination.
  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    navigate(`/list?city=${city}&category=${category}&radius=${radius}`);
    // The useEffect above will then refetch events using the new URL parameters.
  };

  // "No events found" message.
  const noEventsMessage = events.length === 0 && !loading && (
    <p className="text-center text-gray-500 mt-6">
      No events found. Try a different search!
    </p>
  );

  // Toggle (add/remove) a bookmarked event.
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
      {/* Horizontal Search Bar */}
      <div className="w-full max-w-7xl mb-6">
        <div className="p-4 bg-white rounded-lg shadow-lg flex flex-row gap-4 items-center">
          <h1
            onClick={() => navigate("/")}
            className="text-3xl font-bold text-blue-600"
            style={{ marginTop: "15px", cursor: "pointer" }}
          >
            Eventure
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-row items-center gap-4 flex-1"
          >
            <div className="flex-1">
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
                <option value="Music">Music</option>
                <option value="Sports">Sports</option>
                <option value="Arts & Theatre">Arts & Theatre</option>
                <option value="Miscellaneous">Miscellaneous</option>
                <option value="Film">Film</option>
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
              className="bg-blue-600 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-blue-700"
              style={{ marginTop: "20px", padding: "10px" }}
            >
              Find Events
            </button>
          </form>
        </div>
      </div>

      {/* Loading and Error States */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Event List and Map */}
      {events.length > 0 ? (
        <div className="flex w-full max-w-7xl gap-6">
          {/* Event List */}
          <div className="w-1/2 overflow-y-auto h-[70vh]">
            {currentEvents.map((event) => (
              <div
                key={event.id}
                data-testid={`event-card-${event.id}`} 
                className={`p-4 bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow mb-4 cursor-pointer ${
                  selectedEventId === event.id ? "border-blue-600" : ""
                }`}
                onClick={() =>
                  handleEventClick(event.id, [
                    event.location.lat,
                    event.location.lng,
                  ])
                }
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold text-blue-600">
                  {event.name}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  <strong>Venue:</strong> {event.venue || "Unknown Venue"}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  <strong>Date:</strong>{" "}
                  {new Date(event.start_time).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    ...(event.start_time.includes("T") && {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }),
                  })}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Details
                  </a>
                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(event);
                    }}
                    className={`px-4 py-2 rounded-md ${
                      favorites.some((fav) => fav.id === event.id)
                        ? "bg-red-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                    data-testid={`bookmark-button-${event.id}`}
                  >
                    {favorites.some((fav) => fav.id === event.id)
                      ? "Unbookmark"
                      : "Bookmark"}
                  </button>
                </div>
              </div>
            ))}
            {/* Pagination Controls */}
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

          {/* Map */}
          <div className="w-1/2 h-[70vh]">
            <MapContainer
              center={mapCenter}
              zoom={13}
              className="w-full h-full rounded-lg shadow-md"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <DynamicMapCenter center={mapCenter} />
              {events.map((event, index) =>
                event.location ? (
                  <Marker
                    key={index}
                    position={[event.location.lat, event.location.lng]}
                    icon={
                      selectedEventId === event.id
                        ? markerGreyIcon
                        : L.icon({
                            iconRetinaUrl: markerIconRetina,
                            iconUrl: markerIcon,
                            shadowUrl: markerShadow,
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41],
                          })
                    }
                  >
                    <Popup>
                      <strong>{event.name}</strong>
                      <br />
                      Venue: {event.venue || "Unknown Venue"}
                      <br />
                      Date:{" "}
                      {new Date(event.start_time).toLocaleDateString("en-US")}
                    </Popup>
                  </Marker>
                ) : null
              )}
            </MapContainer>
          </div>
        </div>
      ) : (
        noEventsMessage
      )}

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

export default EventListPage;
