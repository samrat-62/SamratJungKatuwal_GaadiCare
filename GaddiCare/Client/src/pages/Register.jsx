import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { 
  Check, 
  Car, 
  Wrench, 
  MapPin, 
  Phone, 
  Mail, 
  Lock, 
  User, 
  Building, 
  FileText, 
  Upload, 
  Eye, 
  EyeOff,
  Crosshair,
  Globe,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import "leaflet/dist/leaflet.css";
import axiosClient from "@/services/axiosMain";
import { toast } from "sonner";
import { REGISTER_NEW_USER } from "@/routes/serverEndpoints";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationPicker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    if (!position) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLatLng = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setPosition(userLatLng);
          map.flyTo(userLatLng, 15);
        },
        () => {
          const defaultLatLng = { lat: 28.6139, lng: 77.2090 };
          setPosition(defaultLatLng);
          map.flyTo(defaultLatLng, 10);
        }
      );
    } else {
      map.flyTo(position, map.getZoom());
    }
  }, [position, setPosition, map]);

  return position ? (
    <Marker
      position={position}
      icon={L.divIcon({
        html: `<div class="bg-blue-600 text-white p-2 rounded-full border-2 border-white shadow-lg">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
              </div>`,
        className: "workshop-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      })}
    />
  ) : null;
}

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("vehicleOwner");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [workshopImage, setWorkshopImage] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    workshopName: "",
    workshopAddress: "",
    latitude: "",
    longitude: "",
    isLicenseNumber: ""
  });

  const services = ["Oil Change", "Brake Repair", "AC Service", "Engine Repair", "Tire Service", "Battery Service", "Car Wash", "Painting"];

  const passwordRules = {
    minLength: 8,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumber: /\d/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < passwordRules.minLength) {
      errors.push(`At least ${passwordRules.minLength} characters`);
    }
    if (!passwordRules.hasUpperCase.test(password)) {
      errors.push("At least one uppercase letter");
    }
    if (!passwordRules.hasLowerCase.test(password)) {
      errors.push("At least one lowercase letter");
    }
    if (!passwordRules.hasNumber.test(password)) {
      errors.push("At least one number");
    }
    if (!passwordRules.hasSpecialChar.test(password)) {
      errors.push("At least one special character");
    }
    
    return errors;
  };

  const handleServiceToggle = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, workshopImage: "Image size should be less than 5MB" }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setWorkshopImage(reader.result);
        setErrors(prev => ({ ...prev, workshopImage: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMapClick = (latlng) => {
    setFormData(prev => ({
      ...prev,
      latitude: latlng.lat.toFixed(6),
      longitude: latlng.lng.toFixed(6)
    }));
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setMapLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          }));
          setMapLoading(false);
          setErrors(prev => ({ ...prev, latitude: "", longitude: "" }));
        },
        (error) => {
          setErrors(prev => ({ ...prev, location: "Unable to get your location" }));
          setMapLoading(false);
        }
      );
    } else {
      setErrors(prev => ({ ...prev, location: "Geolocation not supported" }));
      setMapLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }

    if (field === 'phoneNumber' && value) {
      if (!validatePhone(value)) {
        setErrors(prev => ({ ...prev, phoneNumber: "Phone number must be 10 digits" }));
      } else {
        setErrors(prev => ({ ...prev, phoneNumber: "" }));
      }
    }

    if (field === 'email' && value) {
      if (!validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
      } else {
        setErrors(prev => ({ ...prev, email: "" }));
      }
    }

    if (field === 'userName' && value) {
      if (!validateUsername(value)) {
        setErrors(prev => ({ ...prev, userName: "Username must be 3-20 characters (letters, numbers, underscore)" }));
      } else {
        setErrors(prev => ({ ...prev, userName: "" }));
      }
    }

    if (field === 'password' && value) {
      const passwordErrors = validatePassword(value);
      if (passwordErrors.length > 0) {
        setErrors(prev => ({ ...prev, password: "Password must contain: " + passwordErrors.join(", ") }));
      } else {
        setErrors(prev => ({ ...prev, password: "" }));
      }
    }

    if ((field === 'password' || field === 'confirmPassword') && formData.password && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName) {
      newErrors.userName = "Username is required";
    } else if (!validateUsername(formData.userName)) {
      newErrors.userName = "Username must be 3-20 characters (letters, numbers, underscore)";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        newErrors.password = "Password must contain: " + passwordErrors.join(", ");
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (userType === "workshop") {
      if (!formData.workshopName) newErrors.workshopName = "Workshop name is required";
      if (!formData.workshopAddress) newErrors.workshopAddress = "Workshop address is required";
      if (!formData.latitude) newErrors.latitude = "Please select location on map";
      if (!formData.longitude) newErrors.longitude = "Please select location on map";
      if (!formData.isLicenseNumber) newErrors.isLicenseNumber = "Business license number is required";
      if (selectedServices.length === 0) newErrors.services = "Please select at least one service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      setErrors(prev => ({ ...prev, terms: "You must agree to the terms and conditions" }));
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (userType === "workshop") {
        const workshopData = {
          userType,
          workshopName: formData.workshopName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          workshopAddress: formData.workshopAddress,
          latitude: formData.latitude,
          longitude: formData.longitude,
          isLicenseNumber: formData.isLicenseNumber,
          servicesOffered: selectedServices,
          password: formData.password
        };
        
        if (workshopImage) {
          workshopData.workshopImage = workshopImage;
        }
        
        const response = await axiosClient.post(REGISTER_NEW_USER, workshopData);
        if(response.status===201){
          toast.success(response?.data?.message||"Registration submitted for approval!");
          navigate("/verify-token", {state: {email: formData.email}});
        }
      } else {
        const userData = {
          userType,
          userName: formData.userName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password
        };
        const response = await axiosClient.post(REGISTER_NEW_USER, userData);
        if(response.status===201){
          toast.success(response?.data?.message||"Registration successful! Please verify your email.");
          navigate("/verify-token/verifyEmail", {state: {email: formData.email}});
        }
      }
    } catch(error) {
      toast.error(error?.response?.data?.message||"Error registering user. Please try again.");
      console.error("Error registering user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMap = () => {
    setShowMap(!showMap);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 mt-20 lg:mt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div 
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              style={{ 
                backgroundImage: "url('/image/register.jpg')",
                minHeight: "650px" 
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40"></div>
              <div className="relative z-10 h-full p-8 md:p-12 lg:p-16 flex flex-col justify-end">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                    Join GaddiCare Community
                  </h1>
                  <p className="text-xl text-white/90 mb-10 max-w-2xl">
                    Whether you're a vehicle owner or a workshop, GaddiCare connects you with the right people.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-orange-500/20 rounded-xl">
                        <Car className="text-white" size={28} />
                      </div>
                      <h2 className="text-2xl font-bold text-white">For Vehicle Owners</h2>
                    </div>
                    <ul className="space-y-3">
                      {["Find verified workshops instantly", "Track service status in real-time", "Maintain complete service history"].map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="text-orange-400" size={20} />
                          <span className="text-white/90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-amber-500/20 rounded-xl">
                        <Wrench className="text-white" size={28} />
                      </div>
                      <h2 className="text-2xl font-bold text-white">For Workshops</h2>
                    </div>
                    <ul className="space-y-3">
                      {["Reach more customers online", "Manage bookings efficiently", "Build trust with verified badge"].map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="text-amber-400" size={20} />
                          <span className="text-white/90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-white rounded-3xl shadow-2xl p-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Join GaddiCare and get started today</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                variant={userType === "vehicleOwner" ? "default" : "outline"}
                onClick={() => setUserType("vehicleOwner")}
                className="flex items-center justify-center gap-2 py-3"
              >
                <Car size={20} />
                Vehicle Owner
              </Button>
              <Button
                variant={userType === "workshop" ? "default" : "outline"}
                onClick={() => setUserType("workshop")}
                className="flex items-center justify-center gap-2 py-3"
              >
                <Wrench size={20} />
                Workshop
              </Button>
            </div>

            <div className="max-h-[550px] overflow-y-auto pr-2">
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <Label htmlFor="userName" className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4" />
                    Username
                  </Label>
                  <Input 
                    id="userName"
                    type="text"
                    placeholder="Enter your username" 
                    value={formData.userName}
                    onChange={(e) => handleInputChange("userName", e.target.value)}
                    required 
                  />
                  {errors.userName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.userName}
                    </p>
                  )}
                </div>

                {userType === "workshop" && (
                  <div>
                    <Label htmlFor="workshopName" className="flex items-center gap-2 mb-1">
                      <Building className="h-4 w-4" />
                      Workshop Name
                    </Label>
                    <Input 
                      id="workshopName"
                      type="text"
                      placeholder="Enter workshop name" 
                      value={formData.workshopName}
                      onChange={(e) => handleInputChange("workshopName", e.target.value)}
                      required 
                    />
                    {errors.workshopName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.workshopName}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <Label htmlFor="email" className="flex items-center gap-2 mb-1">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="Enter your email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required 
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phoneNumber" className="flex items-center gap-2 mb-1">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input 
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter 10-digit phone number" 
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength={10}
                    required 
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {userType === "workshop" && (
                  <>
                    <div>
                      <Label htmlFor="workshopAddress" className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4" />
                        Workshop Address
                      </Label>
                      <textarea
                        id="workshopAddress"
                        placeholder="Enter complete workshop address"
                        rows="2"
                        value={formData.workshopAddress}
                        onChange={(e) => handleInputChange("workshopAddress", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                        required
                      />
                      {errors.workshopAddress && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.workshopAddress}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label className="flex items-center gap-2 mb-1">
                        <Globe className="h-4 w-4" />
                        Select Workshop Location
                      </Label>
                      
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="latitude" className="text-xs">Latitude</Label>
                            <Input 
                              id="latitude"
                              value={formData.latitude}
                              onChange={(e) => handleInputChange("latitude", e.target.value)}
                              placeholder="26.808100"
                              className="text-sm"
                              required
                            />
                            {errors.latitude && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.latitude}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="longitude" className="text-xs">Longitude</Label>
                            <Input 
                              id="longitude"
                              value={formData.longitude}
                              onChange={(e) => handleInputChange("longitude", e.target.value)}
                              placeholder="87.285000"
                              className="text-sm"
                              required
                            />
                            {errors.longitude && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.longitude}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={handleGetCurrentLocation}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            disabled={mapLoading}
                          >
                            {mapLoading ? (
                              <span className="flex items-center justify-center">
                                <div className="h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                Loading...
                              </span>
                            ) : (
                              <>
                                <Crosshair className="mr-2 h-3 w-3" />
                                Current Location
                              </>
                            )}
                          </Button>
                          
                          <Button
                            type="button"
                            onClick={handleShowMap}
                            variant={showMap ? "default" : "outline"}
                            size="sm"
                            className="flex-1"
                          >
                            {showMap ? "Hide Map" : "Show Map"}
                          </Button>
                        </div>
                        
                        {showMap && (
                          <div className="h-48 rounded-lg overflow-hidden border border-gray-300 relative">
                            {mapLoading ? (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                <div className="text-center">
                                  <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                  <p className="text-sm text-gray-600">Loading map...</p>
                                </div>
                              </div>
                            ) : (
                              <MapContainer
                                center={[parseFloat(formData.latitude) || 26.8081, parseFloat(formData.longitude) || 87.2850]}
                                zoom={15}
                                style={{ height: "100%", width: "100%" }}
                                key={`${formData.latitude}-${formData.longitude}`}
                              >
                                <TileLayer
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <LocationPicker 
                                  position={formData.latitude && formData.longitude ? { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) } : null} 
                                  setPosition={handleMapClick}
                                />
                              </MapContainer>
                            )}
                            <p className="text-xs text-gray-500 mt-1 text-center">Click on the map to select location</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="workshop-image" className="flex items-center gap-2 mb-1">
                        <Upload className="h-4 w-4" />
                        Workshop Image
                      </Label>
                      <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-orange-400 transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="workshop-image"
                        />
                        <label htmlFor="workshop-image" className="cursor-pointer">
                          {workshopImage ? (
                            <div className="space-y-2">
                              <img
                                src={workshopImage}
                                alt="Workshop preview"
                                className="w-full h-32 object-cover rounded-lg mx-auto"
                              />
                              <p className="text-green-600 text-sm">Image uploaded</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                                <Upload className="text-orange-600" size={20} />
                              </div>
                              <p className="text-gray-700 text-sm">Upload workshop image</p>
                              <p className="text-gray-500 text-xs">PNG, JPG up to 5MB</p>
                            </div>
                          )}
                        </label>
                      </div>
                      {errors.workshopImage && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.workshopImage}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label className="mb-1">Services Offered</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {services.map((service) => (
                          <Button
                            type="button"
                            key={service}
                            onClick={() => handleServiceToggle(service)}
                            variant={selectedServices.includes(service) ? "default" : "outline"}
                            size="sm"
                            className="text-xs py-1 h-auto"
                          >
                            {service}
                          </Button>
                        ))}
                      </div>
                      {errors.services && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.services}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="isLicenseNumber" className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4" />
                        Business License Number
                      </Label>
                      <Input 
                        id="isLicenseNumber"
                        type="text"
                        placeholder="Enter business license number" 
                        value={formData.isLicenseNumber}
                        onChange={(e) => handleInputChange("isLicenseNumber", e.target.value)}
                        required 
                      />
                      {errors.isLicenseNumber && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.isLicenseNumber}
                        </p>
                      )}
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Check className="text-amber-600 h-4 w-4" />
                        <h3 className="text-sm font-semibold text-amber-800">Location Important</h3>
                      </div>
                      <p className="text-xs text-amber-700">
                        Your workshop location on the map will help customers find you easily.
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="password" className="flex items-center gap-2 mb-1">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2 mb-1">
                    <Lock className="h-4 w-4" />
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => {
                      setAgreeTerms(checked);
                      if (checked && errors.terms) {
                        setErrors(prev => ({ ...prev, terms: "" }));
                      }
                    }}
                  />
                  <label htmlFor="agreeTerms" className="text-gray-700 text-sm">
                    I agree to the <a href="/terms" className="text-orange-600 hover:underline">Terms</a> and <a href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</a>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.terms}
                  </p>
                )}

                <Button 
                  type="submit" 
                  className="w-full py-3"
                  disabled={!agreeTerms || loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </span>
                  ) : (
                    userType === "workshop" ? "Submit for Approval" : "Create Account"
                  )}
                </Button>

                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-orange-600 font-semibold hover:underline">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;