import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { 
  Search, 
  Navigation, 
  MapPin, 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle,
  Filter,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Navigation as NavigationIcon,
  Check
} from "lucide-react";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const workshopsData = [
  {
    id: 1,
    name: "Dharan Auto Care",
    rating: 4.8,
    reviews: 156,
    address: "BP Chowk, Dharan-1",
    distance: 1.2,
    lat: 26.8081,
    lng: 87.2850,
    services: ["Oil Change", "Brake Repair", "AC Service", "Engine Repair", "Car Wash"],
    status: "open",
    verified: true,
    phone: "+977 9800000001",
    email: "contact@dharanautocare.com",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop",
    description: "Premium auto service center with 10+ years of experience"
  },
  {
    id: 2,
    name: "Nepal Auto Workshop",
    rating: 4.5,
    reviews: 128,
    address: "Vishnupaduka, Dharan-2",
    distance: 2.5,
    lat: 26.8120,
    lng: 87.2900,
    services: ["Tire Service", "Battery Service", "AC Service", "Oil Change"],
    status: "open",
    verified: true,
    phone: "+977 9800000002",
    email: "info@nepalauto.com",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop",
    description: "Complete vehicle servicing and repair"
  },
  {
    id: 3,
    name: "Hilltop Motors",
    rating: 4.9,
    reviews: 203,
    address: "Purano Bazaar, Dharan-3",
    distance: 3.1,
    lat: 26.8050,
    lng: 87.2800,
    services: ["Engine Repair", "Painting", "AC Service", "Car Wash"],
    status: "closed",
    verified: true,
    phone: "+977 9800000003",
    email: "service@hilltopmotors.com",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w-400&h=300&fit=crop",
    description: "Specialized in engine and body works"
  },
  {
    id: 4,
    name: "Sunrise Auto Garage",
    rating: 4.3,
    reviews: 89,
    address: "Bhanu Chowk, Dharan-4",
    distance: 4.8,
    lat: 26.8150,
    lng: 87.2950,
    services: ["Brake Repair", "Tire Service", "Battery Service"],
    status: "open",
    verified: true,
    phone: "+977 9800000004",
    email: "sunriseauto@email.com",
    image: "https://images.unsplash.com/photo-1547327132-5d20850c62b3?w=400&h=300&fit=crop",
    description: "Reliable service at affordable prices"
  },
  {
    id: 5,
    name: "City Car Service",
    rating: 4.7,
    reviews: 178,
    address: "New Road, Dharan-5",
    distance: 5.5,
    lat: 26.8000,
    lng: 87.2750,
    services: ["Car Wash", "Painting", "AC Service", "Oil Change"],
    status: "open",
    verified: true,
    phone: "+977 9800000005",
    email: "citycar@service.com",
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=300&fit=crop",
    description: "Modern facility with latest equipment"
  },
  {
    id: 6,
    name: "Dharan Bike & Car Care",
    rating: 4.4,
    reviews: 112,
    address: "Ghopa Camp, Dharan-6",
    distance: 6.2,
    lat: 26.8100,
    lng: 87.3000,
    services: ["Engine Repair", "Brake Repair", "Tire Service"],
    status: "closed",
    verified: false,
    phone: "+977 9800000006",
    email: "dharancare@email.com",
    image: "https://images.unsplash.com/photo-1565689221354-d87f85d4aee2?w=400&h=300&fit=crop",
    description: "Two-wheeler and four-wheeler service"
  },
  {
    id: 7,
    name: "Auto Pro Service Center",
    rating: 4.6,
    reviews: 145,
    address: "Bijaypur, Dharan-7",
    distance: 7.8,
    lat: 26.8200,
    lng: 87.3100,
    services: ["Oil Change", "AC Service", "Battery Service", "Car Wash"],
    status: "open",
    verified: true,
    phone: "+977 9800000007",
    email: "autopro@service.com",
    image: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=400&h=300&fit=crop",
    description: "Professional auto maintenance service"
  },
  {
    id: 8,
    name: "Green Valley Motors",
    rating: 4.2,
    reviews: 76,
    address: "Rangeli Road, Dharan-8",
    distance: 8.5,
    lat: 26.8250,
    lng: 87.3200,
    services: ["Painting", "AC Service", "Tire Service"],
    status: "open",
    verified: false,
    phone: "+977 9800000008",
    email: "greenvalley@motors.com",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop",
    description: "Eco-friendly vehicle services"
  },
  {
    id: 9,
    name: "Premium Auto Works",
    rating: 4.8,
    reviews: 192,
    address: "Itahari Road, Dharan-9",
    distance: 9.1,
    lat: 26.8300,
    lng: 87.3300,
    services: ["Engine Repair", "Brake Repair", "AC Service", "Car Wash"],
    status: "open",
    verified: true,
    phone: "+977 9800000009",
    email: "premiumauto@works.com",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop",
    description: "Premium quality auto repairs"
  },
  {
    id: 10,
    name: "Quick Fix Garage",
    rating: 4.0,
    reviews: 67,
    address: "Biratnagar Highway, Dharan-10",
    distance: 10.3,
    lat: 26.8350,
    lng: 87.3400,
    services: ["Oil Change", "Tire Service", "Battery Service"],
    status: "open",
    verified: true,
    phone: "+977 9800000010",
    email: "quickfix@garage.com",
    image: "https://images.unsplash.com/photo-1541447271487-09612b3f49f7?w=400&h=300&fit=crop",
    description: "Quick and reliable minor repairs"
  },
  {
    id: 11,
    name: "Motor Master Workshop",
    rating: 4.7,
    reviews: 165,
    address: "Dharan Bypass, Dharan-11",
    distance: 11.5,
    lat: 26.8400,
    lng: 87.3500,
    services: ["Engine Repair", "Painting", "AC Service", "Brake Repair"],
    status: "closed",
    verified: true,
    phone: "+977 9800000011",
    email: "motormaster@workshop.com",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop",
    description: "Expert technicians for complex repairs"
  },
  {
    id: 12,
    name: "City Auto Hub",
    rating: 4.3,
    reviews: 98,
    address: "Main Market, Dharan-12",
    distance: 12.2,
    lat: 26.8450,
    lng: 87.3600,
    services: ["Car Wash", "Oil Change", "Battery Service", "AC Service"],
    status: "open",
    verified: false,
    phone: "+977 9800000012",
    email: "cityautohub@email.com",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
    description: "One-stop solution for all auto needs"
  }
];

// All available services
const allServices = [
  "Oil Change",
  "Brake Repair", 
  "AC Service",
  "Engine Repair",
  "Tire Service",
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
  const [userLocation, setUserLocation] = useState({ lat: 26.8120, lng: 87.2840 }); // Dharan center
  const [distanceFilter, setDistanceFilter] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState(workshopsData);
  const [currentPage, setCurrentPage] = useState(1);
  const [locationPermission, setLocationPermission] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const mapRef = useRef(null);
  const workshopsPerPage = 8;

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
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationPermission(true);
          setLocationLoading(false);
        },
        (error) => {
          console.log("Error getting location:", error);
          setLocationLoading(false);
          // Use default Dharan location if permission denied
          setUserLocation({ lat: 26.8120, lng: 87.2840 });
        }
      );
    } else {
      setLocationLoading(false);
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  // Function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filter workshops based on distance, search, and services
  useEffect(() => {
    let filtered = workshopsData.filter(workshop => {
      // Calculate distance
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        workshop.lat,
        workshop.lng
      );
      
      // Update workshop distance
      workshop.distance = Math.round(distance * 10) / 10;
      
      // Check distance filter
      if (distance > distanceFilter) return false;
      
      // Check search query
      if (searchQuery && !workshop.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !workshop.address.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Check selected services
      if (selectedServices.length > 0) {
        const hasSelectedService = selectedServices.some(service => 
          workshop.services.includes(service)
        );
        if (!hasSelectedService) return false;
      }
      
      return true;
    });
    
    // Sort by distance
    filtered.sort((a, b) => a.distance - b.distance);
    
    setFilteredWorkshops(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [distanceFilter, searchQuery, selectedServices, userLocation]);

  // Calculate pagination
  const indexOfLastWorkshop = currentPage * workshopsPerPage;
  const indexOfFirstWorkshop = indexOfLastWorkshop - workshopsPerPage;
  const currentWorkshops = filteredWorkshops.slice(indexOfFirstWorkshop, indexOfLastWorkshop);
  const totalPages = Math.ceil(filteredWorkshops.length / workshopsPerPage);

  // Toggle service selection
  const toggleService = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setDistanceFilter(10);
    setSearchQuery("");
    setSelectedServices([]);
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get current page numbers for pagination
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

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Auto Workshops in Dharan</h1>
          <p className="text-gray-600">Search and filter workshops by distance and services</p>
          
          {locationLoading && (
            <div className="mt-2 text-sm text-blue-600">
              Getting your current location...
            </div>
          )}
          
          {locationPermission && !locationLoading && (
            <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
              <Check className="h-4 w-4" />
              Using your current location in Dharan
            </div>
          )}
        </div>

        {/* Map Section */}
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
              
              {/* User location marker */}
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                <Popup>Your Current Location (Dharan, Nepal)</Popup>
              </Marker>
              
              {/* Distance circle */}
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={distanceFilter * 1000} // Convert km to meters
                pathOptions={{ fillColor: 'blue', color: 'blue', fillOpacity: 0.1, weight: 2 }}
              />
              
              {/* Workshop markers */}
              {filteredWorkshops.map((workshop) => (
                <Marker
                  key={workshop.id}
                  position={[workshop.lat, workshop.lng]}
                  icon={workshopIcon}
                >
                  <Popup className="custom-popup">
                    <div className="p-2 min-w-[250px]">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={workshop.image} 
                            alt={workshop.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
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

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Search Box */}
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

          {/* Distance Filter */}
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

          {/* Services Filter */}
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

              {/* Clear Filters Button */}
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

        {/* Workshops Grid */}
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

          {filteredWorkshops.length === 0 ? (
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
                      <img 
                        src={workshop.image} 
                        alt={workshop.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          workshop.status === 'open' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {workshop.status === 'open' ? 'Open Now' : 'Closed'}
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
                          <span className="text-gray-500 text-sm">({workshop.reviews})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm line-clamp-2">{workshop.address}</span>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 line-clamp-2">{workshop.description}</p>
                      </div>
                      
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
                      
                      <div className="flex items-center justify-between">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          View Details
                        </button>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-600 hover:text-blue-600">
                            <Phone className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-blue-600">
                            <NavigationIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
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