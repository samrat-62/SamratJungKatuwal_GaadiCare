import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    Calendar,
    Car,
    Clock,
    MapPin,
    MessageSquare,
    Wrench,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BOOK_SERVICE } from "@/routes/serverEndpoints";
import axiosClient from "@/services/axiosMain";
import { toast } from "sonner";

const BookServiceDialog = ({ 
  open, 
   setShowBookDialog, 
  workshopId, 
  workshopName,
  userId,
  workshopServices = [] 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    vehicleType: "",
    vehicleNumber: "",
    services: [],
    problemDescription: "",
    bookingDate: "",
    timeSlot: "",
    pickupRequired: false,
    pickupAddress: "",
  });

  const vehicleTypes = [
    "Car",
    "Motorcycle",
    "SUV",
    "Truck",
    "Van",
    "Bus",
    "Other"
  ];

  const timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
    "5:00 PM - 6:00 PM"
  ];

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

  const availableServices = parseServices(workshopServices);

  useEffect(() => {
    if (open) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        bookingDate: formattedDate
      }));
    }
  }, [open]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError("");
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => {
      if (prev.services.includes(service)) {
        return {
          ...prev,
          services: prev.services.filter(s => s !== service)
        };
      } else {
        return {
          ...prev,
          services: [...prev.services, service]
        };
      }
    });
  };

  const validateForm = () => {
    if (!formData.vehicleType) {
      setError("Please select vehicle type");
      return false;
    }
    if (!formData.vehicleNumber) {
      setError("Please enter vehicle number");
      return false;
    }
    if (formData.services.length === 0) {
      setError("Please select at least one service");
      return false;
    }
    if (!formData.bookingDate) {
      setError("Please select booking date");
      return false;
    }
    if (!formData.timeSlot) {
      setError("Please select time slot");
      return false;
    }
    if (formData.pickupRequired && !formData.pickupAddress) {
      setError("Please provide pickup address");
      return false;
    }
    return true;
  };

   const resetForm = () => {
    setFormData({
      vehicleType: "",
      vehicleNumber: "",
      services: [],
      problemDescription: "",
      bookingDate: new Date().toISOString().split('T')[0],
      timeSlot: "",
      pickupRequired: false,
      pickupAddress: "",
    });
    setError("");
  };

  const handleClose = () => {
    setShowBookDialog(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await axiosClient.post(`${BOOK_SERVICE}/${userId}/${workshopId}`, formData, {withCredentials: true});

      if (response.status === 201) {
        handleClose();
        toast.success(response?.data?.message || "Service booked successfully");
      } 
    } catch (err) {
      console.error("Booking error:", err);
      setError(err?.response?.data?.message || "Failed to book service. Please try again.");
      toast.error(err?.response?.data?.message || "Failed to book service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <Dialog open={open} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Wrench className="h-6 w-6 text-blue-600" />
            Book Service at {workshopName}
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to book your vehicle service
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-600" />
              Vehicle Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleType" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Vehicle Type *
                </Label>
                <Select 
                  value={formData.vehicleType} 
                  onValueChange={(value) => handleInputChange("vehicleType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleNumber" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Vehicle Number *
                </Label>
                <Input
                  id="vehicleNumber"
                  placeholder="e.g., BA 1 PA 1234"
                  value={formData.vehicleNumber}
                  onChange={(e) => handleInputChange("vehicleNumber", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              Select Services *
            </h3>
            
            {availableServices.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600">No services available for this workshop.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {availableServices.map((service) => (
                    <div
                      key={service}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        formData.services.includes(service)
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => handleServiceToggle(service)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{service}</span>
                        {formData.services.includes(service) && (
                          <div className="h-4 w-4 flex items-center justify-center rounded-full bg-blue-600">
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Selected: {formData.services.length} service{formData.services.length !== 1 ? 's' : ''}
                </p>
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="problemDescription" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Problem Description (Optional)
            </Label>
            <Textarea
              id="problemDescription"
              placeholder="Describe the issue with your vehicle..."
              rows={3}
              value={formData.problemDescription}
              onChange={(e) => handleInputChange("problemDescription", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bookingDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Booking Date *
              </Label>
              <Input
                id="bookingDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.bookingDate}
                onChange={(e) => handleInputChange("bookingDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeSlot" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Slot *
              </Label>
              <Select
                value={formData.timeSlot}
                onValueChange={(value) => handleInputChange("timeSlot", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(slot => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pickupRequired"
                checked={formData.pickupRequired}
                onCheckedChange={(checked) => 
                  handleInputChange("pickupRequired", checked)
                }
              />
              <Label htmlFor="pickupRequired" className="cursor-pointer">
                Require Vehicle Pickup Service
              </Label>
            </div>

            {formData.pickupRequired && (
              <div className="space-y-2">
                <Label htmlFor="pickupAddress" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Pickup Address *
                </Label>
                <Input
                  id="pickupAddress"
                  placeholder="Enter pickup address"
                  value={formData.pickupAddress}
                  onChange={(e) => handleInputChange("pickupAddress", e.target.value)}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm flex items-center gap-2">
                <X className="h-4 w-4" />
                {error}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || availableServices.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookServiceDialog;