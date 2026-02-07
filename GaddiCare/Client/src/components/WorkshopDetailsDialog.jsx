import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Building, Calendar, Check, Clock, Globe, Mail, MapPin, Phone, Wrench, X } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const WorkshopDetailsDialog = ({ workshop, open, onOpenChange }) => {
  const [mapReady, setMapReady] = useState(false);

  if (!workshop) return null;

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

  const services = parseServices(workshop.servicesOffered);
  
  const latitude = parseFloat(workshop.latitude);
  const longitude = parseFloat(workshop.longitude);
  const hasValidCoordinates = !isNaN(latitude) && !isNaN(longitude);

  const formattedRegistrationDate = workshop.createdAt 
    ? moment(workshop.createdAt).format('MMMM Do YYYY, h:mm:ss a')
    : 'Not available';


  const relativeRegistrationDate = workshop.createdAt 
    ? moment(workshop.createdAt).fromNow()
    : 'Not available';

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

  useEffect(() => {
    if (open && hasValidCoordinates) {
      setMapReady(true);
    }
  }, [open, hasValidCoordinates]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{workshop.workshopName}</DialogTitle>
          <DialogDescription>
            Workshop Registration Details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {workshop.workshopImage && (
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <img
                src={`${import.meta.env.VITE_SERVER_URL}/${workshop.workshopImage}`}
                alt={workshop.workshopName}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-3">
              <Globe className="h-4 w-4" />
              Workshop Location
            </h3>
            {hasValidCoordinates ? (
              <div className="h-64 rounded-lg overflow-hidden border border-gray-300 relative">
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
                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
                  <p>Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}</p>
                </div>
              </div>
            ) : (
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Location coordinates not available</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4" />
                  Workshop Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Workshop Name</p>
                    <p className="font-medium">{workshop.workshopName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">License Number</p>
                    <p className="font-medium">{workshop.isLicenseNumber}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" />
                  Location Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-medium">{workshop.workshopAddress}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Latitude</p>
                      <p className="font-medium">{workshop.latitude}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Longitude</p>
                      <p className="font-medium">{workshop.longitude}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {workshop.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {workshop.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Account Status</p>
                    <Badge className={workshop.accountVerified ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                      {workshop.accountVerified ? "Verified" : "Pending Verification"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  Registration Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">User Type</p>
                    <p className="font-medium capitalize">{workshop.userType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Registration Date</p>
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-sm">
                        {formattedRegistrationDate}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{relativeRegistrationDate}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Registration ID</p>
                    <p className="font-medium text-sm">{workshop._id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-3">
              <Wrench className="h-4 w-4" />
              Services Offered ({services.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {services.map((service, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Verification Check</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {workshop.workshopName ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">Workshop Name Provided</span>
              </div>
              <div className="flex items-center gap-2">
                {workshop.isLicenseNumber ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">License Number Provided</span>
              </div>
              <div className="flex items-center gap-2">
                {workshop.workshopAddress ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">Address Provided</span>
              </div>
              <div className="flex items-center gap-2">
                {workshop.email ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">Valid Email Address</span>
              </div>
              <div className="flex items-center gap-2">
                {hasValidCoordinates ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">Valid Location Coordinates</span>
              </div>
              <div className="flex items-center gap-2">
                {workshop.createdAt ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">Registration Date Recorded</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkshopDetailsDialog;