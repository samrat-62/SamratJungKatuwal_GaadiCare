import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  MapPin,
  Navigation,
  Search,
  Shield,
  Sliders,
  Star,
  Wrench,
  XCircle
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const allServices = [
  "Oil Change",
  "Brake Repair", 
  "Tire Service",
  "AC Service",
  "Engine Repair",
  "Battery Service",
  "Car Wash",
  "Painting"
];

function LocationMarker({ setUserLocation }) {
  const map = useMapEvents({
    locationfound(e) {
      setUserLocation(e.latlng);
      map.flyTo(e.latlng, 13);
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return null;
}

const WorkshopsPage = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const { allWorkshops, loading: allWorkshopsLoading } = useSelector((state) => state.allWorkshops);
  const { reviews } = useSelector((state) => state.allReviews);
  const [distanceFilter, setDistanceFilter] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [locationPermission, setLocationPermission] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const mapRef = useRef(null);
  const workshopsPerPage = 8;

  const handleNavigateToDetails = (workshopId) => navigate(`/workshop/${workshopId}`);

  const workshopIcon = L.divIcon({
    html: `<div class="bg-blue-600 text-white p-2 rounded-full border-2 border-white shadow-lg">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>`,
    className: "workshop-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  const userIcon = L.divIcon({
    html: `<div class="bg-green-600 text-white p-2 rounded-full border-2 border-white shadow-lg animate-pulse">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>`,
    className: "user-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          setLocationPermission(true);
          setLocationLoading(false);
        },
        (error) => {
          console.log("Error getting location:", error);
          setLocationLoading(false);
          setUserLocation({ lat: 26.8120, lng: 87.2840 });
        }
      );
    } else {
      setLocationLoading(false);
      setUserLocation({ lat: 26.8120, lng: 87.2840 });
    }
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    if (!allWorkshops || !userLocation) return;

    const processWorkshops = allWorkshops.map(workshop => {
      const lat = parseFloat(workshop.latitude);
      const lng = parseFloat(workshop.longitude);
      let distance = null;
      
      if (!isNaN(lat) && !isNaN(lng)) {
        distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
        distance = Math.round(distance * 10) / 10;
      }

      const services = Array.isArray(workshop.servicesOffered) ? workshop.servicesOffered : [];
      
      let image = "";
      if (workshop.workshopImage && workshop.workshopImage.trim() !== "") {
        image = `${import.meta.env.VITE_SERVER_URL}${workshop.workshopImage}`;
      }

      const workshopReviews = reviews.filter(review => review.workshopId._id === workshop._id);
      const averageRating = workshopReviews.length > 0 
        ? (workshopReviews.reduce((sum, review) => sum + review.rating, 0) / workshopReviews.length).toFixed(1)
        : "0.0";
      
      return {
        id: workshop._id,
        workshopId: workshop.workshopId,
        name: workshop.workshopName || "Auto Workshop",
        rating: averageRating,
        reviews: workshopReviews.length,
        address: workshop.workshopAddress || "Address not available",
        distance,
        lat,
        lng,
        services,
        isOpen: workshop.isOpen,
        verified: workshop.accountVerified || false,
        phone: workshop.phoneNumber || "Not available",
        email: workshop.email || "Not available",
        image,
        description: workshop.description || "",
        license: workshop.isLicenseNumber,
        createdAt: workshop.createdAt
      };
    });

    let filtered = processWorkshops.filter(workshop => {
      if (workshop.distance === null) return false;
      
      if (workshop.distance > distanceFilter) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!workshop.name.toLowerCase().includes(query) && 
            !workshop.address.toLowerCase().includes(query)) {
          return false;
        }
      }
      
      if (selectedServices.length > 0) {
        const hasSelectedService = selectedServices.some(service => 
          workshop.services.includes(service)
        );
        if (!hasSelectedService) return false;
      }
      
      return true;
    });
    
    filtered.sort((a, b) => a.distance - b.distance);
    
    setFilteredWorkshops(filtered);
    setCurrentPage(1);
  }, [distanceFilter, searchQuery, selectedServices, userLocation, allWorkshops, reviews]);

  const indexOfLastWorkshop = currentPage * workshopsPerPage;
  const indexOfFirstWorkshop = indexOfLastWorkshop - workshopsPerPage;
  const currentWorkshops = filteredWorkshops.slice(indexOfFirstWorkshop, indexOfLastWorkshop);
  const totalPages = Math.ceil(filteredWorkshops.length / workshopsPerPage);

  const toggleService = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const clearFilters = () => {
    setDistanceFilter(10);
    setSearchQuery("");
    setSelectedServices([]);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (!userLocation) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading location data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Auto Workshops Near You</h1>
          <p className="text-gray-600">Search and filter workshops by distance and services</p>
          
          {locationLoading && (
            <div className="mt-2 text-sm text-blue-600">
              Getting your current location...
            </div>
          )}
          
          {locationPermission && !locationLoading && (
            <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
              <Check className="h-4 w-4" />
              Using your current location
            </div>
          )}
          
          {!locationPermission && !locationLoading && (
            <div className="mt-2 text-sm text-yellow-600 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Using default location (Location access not granted)
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden mb-8 z-10 relative">
          <div className="h-96">
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                <Popup>Your Current Location</Popup>
              </Marker>
              
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={distanceFilter * 1000}
                pathOptions={{ fillColor: 'blue', color: 'blue', fillOpacity: 0.1, weight: 2 }}
              />
              
              {filteredWorkshops.map((workshop) => (
                <Marker
                  key={workshop.id}
                  position={[workshop.lat, workshop.lng]}
                  icon={workshopIcon}
                >
                  <Popup className="custom-popup">
                    <div className="p-2 min-w-[250px]">
                      <div className="flex items-start gap-3 mb-2">
                        {workshop.image ? (
                          <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={workshop.image} 
                              alt={workshop.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                            <Wrench className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-lg">{workshop.name}</h3>
                          <p className="text-sm text-gray-600">{workshop.address}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">{workshop.rating}</span>
                            <span className="text-gray-500">({workshop.reviews} reviews)</span>
                          </div>
                          <p className="text-sm font-medium text-blue-600">{workshop.distance} km away</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {workshop.services.slice(0, 3).map((service, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              <LocationMarker setUserLocation={setUserLocation} />
            </MapContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search workshops by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center gap-3 mb-4">
                <Navigation className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-gray-900">Distance Filter: {distanceFilter} km</h3>
                    <span className="text-sm font-medium text-blue-600">
                      {filteredWorkshops.length} workshop{filteredWorkshops.length !== 1 ? 's' : ''} found
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={distanceFilter}
                    onChange={(e) => setDistanceFilter(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 km</span>
                    <span>10 km</span>
                    <span>25 km</span>
                    <span>50 km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Services Filter</h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {allServices.map((service) => (
                  <button
                    key={service}
                    onClick={() => toggleService(service)}
                    className={`px-4 py-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                      selectedServices.includes(service)
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-700 hover:border-blue-300"
                    }`}
                  >
                    {selectedServices.includes(service) && <Check className="h-4 w-4" />}
                    {service}
                  </button>
                ))}
              </div>

              {(searchQuery || selectedServices.length > 0 || distanceFilter !== 10) && (
                <button
                  onClick={clearFilters}
                  className="w-full mt-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Workshops ({filteredWorkshops.length})
            </h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Sliders className="h-5 w-5" />
              <span>Showing {Math.min(workshopsPerPage, currentWorkshops.length)} of {filteredWorkshops.length} workshops within {distanceFilter} km</span>
            </div>
          </div>

          {allWorkshopsLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading workshops...</p>
            </div>
          ) : filteredWorkshops.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow">
              <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No workshops found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Try adjusting your search criteria or increasing the distance filter to find more workshops
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {currentWorkshops.map((workshop) => (
                  <div key={workshop.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      {workshop.image ? (
                        <img 
                          src={workshop.image} 
                          alt={workshop.name}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <Wrench className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          workshop.isOpen === true 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {workshop?.isOpen === true ? 'Open Now' : 'Closed'}
                        </div>
                        {workshop.verified && (
                          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            Verified
                          </div>
                        )}
                      </div>
                      <div className="absolute top-3 right-3 px-3 py-1 bg-gray-900/70 text-white rounded-full text-sm font-medium">
                        {workshop.distance} km
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{workshop.name}</h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-semibold">{workshop.rating}</span>
                          <span className="text-gray-500 text-sm">({workshop.reviews} reviews)</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm line-clamp-2">{workshop.address}</span>
                      </div>
                      
                      {workshop.description && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 line-clamp-2">{workshop.description}</p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {workshop.services.slice(0, 3).map((service, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {service}
                          </span>
                        ))}
                        {workshop.services.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            +{workshop.services.length - 3}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-center">
                        <button onClick={()=>handleNavigateToDetails(workshop?.workshopId)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {getPageNumbers().map((number, index) => (
                    <button
                      key={index}
                      onClick={() => typeof number === 'number' ? paginate(number) : null}
                      className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg font-medium ${
                        number === currentPage
                          ? 'bg-blue-600 text-white'
                          : typeof number === 'number'
                          ? 'text-gray-700 hover:bg-gray-100'
                          : 'text-gray-400 cursor-default'
                      }`}
                      disabled={typeof number !== 'number'}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkshopsPage;
