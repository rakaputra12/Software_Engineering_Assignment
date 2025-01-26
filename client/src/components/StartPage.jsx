import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons for Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconGrey from "../assets/red-image.png";
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
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -24],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
});

// Component to handle dynamic map centering
const DynamicMapCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

const StartPage = () => {
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [radius, setRadius] = useState("");
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState(
    JSON.parse(sessionStorage.getItem("favorites")) || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [mapCenter, setMapCenter] = useState([50.110924, 8.682127]); // Default to Frankfurt
  const [selectedEventId, setSelectedEventId] = useState(null); // State to track selected event

  const eventsPerPage = 9;

  const categoryOptions = [
    { label: "Music", value: "Music" },
    { label: "Sports", value: "Sports" },
    { label: "Arts & Theatre", value: "Arts & Theatre" },
    { label: "Miscellaneous", value: "Miscellaneous" },
    { label: "Film", value: "Film" },
  ];

  useEffect(() => {
    sessionStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setHasSearched(true); // Show the map and event list after search
    setCurrentPage(1); // Reset to the first page on a new search

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/events?city=${city}&category=${category}&radius=${radius}`
      );
      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();
      setEvents(data.events || []);

      // Automatically update the map center to the first event's location
      if (data.events && data.events.length > 0) {
        const firstEvent = data.events[0];
        if (
          firstEvent.location &&
          firstEvent.location.lat &&
          firstEvent.location.lng
        ) {
          setMapCenter([firstEvent.location.lat, firstEvent.location.lng]);
        }
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
    setSelectedEventId(eventId); // Update selected event ID
    setMapCenter(location); // Center map on the selected event
  };

  const toggleFavorite = (event) => {
    const isFavorite = favorites.some((fav) => fav.id === event.id);
    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav.id !== event.id));
    } else {
      setFavorites([...favorites, event]);
    }
  };

  const isFavorite = (eventId) => favorites.some((fav) => fav.id === eventId);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-200 p-4">
      <div
        className={`flex flex-col items-center ${
          hasSearched
            ? "w-full max-w-7xl"
            : "h-screen w-full max-w-7xl justify-center"
        } overflow-y-auto`} // Enable scrolling for large content
        style={{ height: "auto", overflowY: "auto" }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          {!hasSearched && (
            <div className="hidden md:block w-1/3 text-gray-600 text-center">
              <h3 className="text-xl font-bold">Discover Events Near You</h3>
              <p className="mt-2">
                Find the best concerts, sports games, and theater shows in your
                area with just a few clicks!
              </p>
            </div>
          )}
          <div
            className={`p-4 bg-white rounded-lg shadow-lg ${
              hasSearched
              ? "flex flex-row gap-4 w-full max-w-7xl scale-100"
              : "flex-col space-y-6 w-full max-w-lg scale-90 "
            } transition-all duration-1000 ease-in-out`}
          >
            <h1
              className={`text-3xl font-bold mb-4 text-center text-blue-600`}
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

        {/* Event List and Map */}
        {hasSearched && (
          <div className="flex w-full mt-6 gap-6">
            {events.length > 0 && (
              <div className="w-1/2 overflow-y-auto h-[70vh]">
                {currentEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow mb-4 cursor-pointer ${
                      selectedEventId === event.id ? "border-blue-600" : ""
                    }`}
                    data-testid={`event-card-${event.id}`} // Add a data-testid for better testing
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(event);
                        }}
                        className={`px-4 py-2 rounded-md ${
                          isFavorite(event.id)
                            ? "bg-red-500 text-white"
                            : "bg-gray-300 text-black"
                        }`}
                        data-testid={`bookmark-button-${event.id}`} // Add a unique data-testid

                      >
                        {isFavorite(event.id) ? "Unbookmark" : "Bookmark"}
                      </button>
                    </div>
                  </div>
                ))}
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

            {events.length > 0 && (
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
                          {new Date(event.start_time).toLocaleDateString(
                            "en-US"
                          )}
                        </Popup>
                      </Marker>
                    ) : null
                  )}
                </MapContainer>
              </div>
            )}
          </div>
        )}

        {/* Bookmarked Events */}
        {favorites.length > 0 && (
          <div className="w-full max-w-7xl mt-6">
            <h2 className="text-2xl font-bold mb-4">Bookmarked Events</h2>
            <div className="grid grid-cols-3 gap-6">
              {favorites.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-white rounded-lg shadow-md border flex flex-col justify-between w-[100%]"
                >
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
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

        {hasSearched && events.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-6">
            No events found. Try a different search!
          </p>
        )}
      </div>
    </div>
  );
};

export default StartPage;
