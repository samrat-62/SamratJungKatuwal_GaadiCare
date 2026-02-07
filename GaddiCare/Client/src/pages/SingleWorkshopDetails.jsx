import BookServiceDialog from "@/components/BookServiceDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { GET_WORKSHOP_BY_ID } from "@/routes/serverEndpoints";
import axiosClient from "@/services/axiosMain";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ArrowLeft,
  Calendar,
  Car,
  Check,
  Clock,
  Globe,
  Mail,
  Map,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  Shield,
  ShieldCheck,
  Star,
  Users,
  Wrench,
  X
} from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import RatingDialog from "@/components/RatingDialog";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SingleWorkshopPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [showBookDialog, setShowBookDialog] = useState(false);
  const [hasBookedService, setHasBookedService] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const {data:userData}=useSelector(state=>state.userData);
  const {reviews}=useSelector(state=>state.allReviews);
  const {bookings}=useSelector(state=>state.allBookings);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`${GET_WORKSHOP_BY_ID}/${id}`);
        
        if (response.status === 200) {
          setWorkshop(response.data.workshop);
          setError(null);
        } else {
          setError("Workshop not found");
        }
      } catch (err) {
        console.error("Error fetching workshop:", err);
        setError(err.response?.data?.message || "Failed to fetch workshop details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWorkshop();
    }
  }, [id]);

  useEffect(() => {
    if (workshop && workshop.latitude && workshop.longitude) {
      setMapReady(true);
    }
  }, [workshop]);

  useEffect(() => {
    if (userData && bookings && workshop && reviews) {
      const userBookings = bookings?.filter(booking => 
        booking.userId === userData._id && 
        booking.workshopId === workshop._id 
      );
      setHasBookedService(userBookings.length > 0);

      const userReview = reviews.find(review => 
        review.userId._id === userData._id && 
        review.workshopId._id === workshop._id
      );
      setExistingReview(userReview || null);
    }
  },[userData, bookings, workshop, reviews]);

  const parseServices = (services) => {
    if (!services || services.length === 0) return [];
    try {
      if (typeof services[0] === 'string') {
        return JSON.parse(services[0]);
      }
      return services;
    } catch (error) {
      return services;
    }
  };

  const handleShow=(id)=>{
    if(id){
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    }
  }

  const getCurrentDaySchedule = () => {
    if (!workshop?.workingHours) return null;
    
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[moment().day()];
    const schedule = workshop.workingHours[today];
    
    return schedule;
  };

  const getCurrentStatus = () => {
    const schedule = getCurrentDaySchedule();
    if (!schedule || schedule.closed) return { isOpen: false, message: 'Closed Today' };
    
    const now = moment();
    const currentTime = now.format('HH:mm');
    const fromTime = schedule.from || '00:00';
    const toTime = schedule.to || '23:59';
    
    const isOpen = currentTime >= fromTime && currentTime <= toTime;
    return { 
      isOpen, 
      message: isOpen ? `Open Now • Closes ${toTime}` : `Opens at ${fromTime}` 
    };
  };

  const formatWorkingHours = () => {
    if (!workshop?.workingHours) return [];
    
    const days = [
      { key: 'monday', label: 'Monday' },
      { key: 'tuesday', label: 'Tuesday' },
      { key: 'wednesday', label: 'Wednesday' },
      { key: 'thursday', label: 'Thursday' },
      { key: 'friday', label: 'Friday' },
      { key: 'saturday', label: 'Saturday' },
      { key: 'sunday', label: 'Sunday' }
    ];
    
    return days.map(day => {
      const schedule = workshop.workingHours[day.key];
      if (!schedule) return { ...day, hours: 'Not Set', open: false };
      
      if (schedule.closed) return { ...day, hours: 'Closed', open: false };
      
      return { 
        ...day, 
        hours: `${schedule.from || 'N/A'} - ${schedule.to || 'N/A'}`, 
        open: true 
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-12 w-48" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
            
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !workshop) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/workshops")}
            className="mb-8 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Workshops
          </Button>
          
          <div className="text-center py-16">
            <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Workshop Not Found</h1>
            <p className="text-gray-600 mb-6">{error || "The workshop you're looking for doesn't exist."}</p>
            <Button onClick={() => navigate("/workshops")}>
              Browse All Workshops
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const services = parseServices(workshop.servicesOffered);
  
  const latitude = parseFloat(workshop.latitude);
  const longitude = parseFloat(workshop.longitude);
  const hasValidCoordinates = !isNaN(latitude) && !isNaN(longitude);

  const formattedRegistrationDate = workshop.createdAt 
    ? moment(workshop.createdAt).format('MMMM Do YYYY, h:mm A')
    : 'Not available';

  const relativeRegistrationDate = workshop.createdAt 
    ? moment(workshop.createdAt).fromNow()
    : 'Not available';

  const workshopReviews = reviews.filter(review => review.workshopId._id === workshop._id);
  const averageRating = workshopReviews.length > 0 
    ? (workshopReviews.reduce((sum, review) => sum + review.rating, 0) / workshopReviews.length).toFixed(1)
    : "0.0";

  const currentStatus = getCurrentStatus();
  const workingHoursList = formatWorkingHours();

  const workshopIcon = L.divIcon({
    html: `<div class="bg-orange-600 text-white p-2 rounded-full border-2 border-white shadow-lg">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>`,
    className: "workshop-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Workshops
        </Button>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="lg:w-1/3">
              {workshop.workshopImage ? (
                <img
                  src={`${import.meta.env.VITE_SERVER_URL}/${workshop.workshopImage}`}
                  alt={workshop.workshopName}
                  className="w-full h-64 lg:h-full object-cover rounded-xl shadow-md"
                />
              ) : (
                <div className="w-full h-64 lg:h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center shadow-md">
                  <Car className="h-20 w-20 text-blue-400" />
                </div>
              )}
            </div>

            <div className="lg:w-2/3">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{workshop.workshopName}</h1>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge className={workshop.accountVerified ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                      {workshop.accountVerified ? (
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          Verified Workshop
                        </span>
                      ) : "Pending Verification"}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {averageRating} Stars
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col items-start lg:items-end gap-2">
                  <div className="flex items-center gap-2 text-amber-600">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="text-xl font-bold">{averageRating}</span>
                    <span className="text-gray-500">({workshopReviews.length} reviews)</span>
                  </div>
                  <Badge variant="outline" className={currentStatus.isOpen ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {currentStatus.message}
                    </span>
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{workshop.workshopAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{workshop.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{workshop.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">{formattedRegistrationDate}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={() => handleShow("contact-info-card")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                  <PhoneCall className="h-4 w-4" />
                  Call Now
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Send Message
                </Button>
                <Button 
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => setShowBookDialog(true)}
                >
                  <Wrench className="h-4 w-4" />
                  Book a Service
                </Button>
                {hasBookedService && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 border-amber-500 text-amber-600 hover:bg-amber-50"
                    onClick={() => setShowRatingDialog(true)}
                  >
                    <Star className="h-4 w-4" />
                    {existingReview ? "Update Review" : "Give Review"}
                  </Button>
                )}
                {showRatingDialog && 
                <RatingDialog
                  open={showRatingDialog}
                  onOpenChange={setShowRatingDialog}
                  workshopId={workshop._id}
                  workshopName={workshop.workshopName}
                  userId={userData?._id}
                />}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Wrench className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Services Offered</h2>
                  <Badge className="ml-2">{services.length} services</Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm relative z-10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Location</h2>
                  </div>
                </div>

                {hasValidCoordinates ? (
                  <div className="h-80 rounded-lg overflow-hidden border border-gray-200 relative">
                    {mapReady && (
                      <MapContainer
                        center={[latitude, longitude]}
                        zoom={15}
                        style={{ height: "100%", width: "100%" }}
                        scrollWheelZoom={false}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker 
                          position={[latitude, longitude]} 
                          icon={workshopIcon}
                        >
                          <Popup>
                            <div className="p-2">
                              <h4 className="font-bold">{workshop.workshopName}</h4>
                              <p className="text-sm">{workshop.workshopAddress}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Registered: {relativeRegistrationDate}
                              </p>
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>
                    )}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 text-sm shadow-md">
                      <p className="font-medium">{workshop.workshopAddress}</p>
                      <p className="text-xs text-gray-600">Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                    <Globe className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium">Location coordinates not available</p>
                    <p className="text-sm text-gray-500 mt-2">Address: {workshop.workshopAddress}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Workshop</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-600">
                      {workshop.description || `${workshop.workshopName} is a professional auto repair and maintenance workshop located in ${workshop.workshopAddress}.`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  Verification Status
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Account Verified</span>
                    {workshop.accountVerified ? (
                      <Badge className="bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-100 text-orange-800">
                        <Clock className="h-3 w-3 mr-1" /> Pending
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">License Number</span>
                    <Badge variant="outline">{workshop.isLicenseNumber}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Registration ID</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {workshop.workshopId?.slice(0, 8)}...
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">User Type</span>
                    <Badge variant="outline" className="capitalize">{workshop.userType}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Active Status</span>
                    {workshop.isActive ? (
                      <Badge className="bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" /> Active
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <X className="h-3 w-3 mr-1" /> Inactive
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>Registration Details</span>
                  </div>
                  <p className="text-sm text-gray-700">Registered: {formattedRegistrationDate}</p>
                  <p className="text-xs text-gray-500">({relativeRegistrationDate})</p>
                </div>
              </CardContent>
            </Card>

           <Card className="border shadow-sm">
  <CardContent className="p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Business Hours</h2>
    
    {!workshop.workingHours || Object.keys(workshop.workingHours).length === 0 ? (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Business hours not specified</p>
        <p className="text-sm text-gray-500 mt-2">This workshop hasn't set their working hours yet</p>
      </div>
    ) : (
      <div className="space-y-3">
        {workingHoursList.map((schedule, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${schedule.open ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className={schedule.open ? "text-gray-900" : "text-gray-400"}>{schedule.label}</span>
            </div>
            <span className={schedule.open ? "text-gray-700 font-medium" : "text-gray-400"}>{schedule.hours}</span>
          </div>
        ))}
      </div>
    )}
  </CardContent>
</Card>

            <Card className="border shadow-sm" id="contact-info-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{workshop.phoneNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Mail className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{workshop.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Workshop Address</p>
                      <p className="font-medium">{workshop.workshopAddress}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BookServiceDialog
        open={showBookDialog}
        setShowBookDialog={setShowBookDialog}
        workshopId={workshop.workshopId}
        workshopName={workshop.workshopName}
        userId={userData?.userId}
        workshopServices={workshop.servicesOffered}
      />
    </div>
  );
};

export default SingleWorkshopPage;