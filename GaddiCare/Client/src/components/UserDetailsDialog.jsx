import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { User, Mail, Phone, Calendar, Shield, Car, Wrench, CheckCircle, XCircle, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserDetailsDialog = ({ user, open, onOpenChange }) => {
  if (!user) return null;

  // Dummy recent bookings data - replace with actual data from your API
  const recentBookings = [
    {
      id: "BK-001",
      workshopName: "AutoCare Pro Workshop",
      serviceType: "General Service",
      vehicleDetails: "Maruti Swift, 2020",
      bookingDate: "2024-03-15",
      appointmentDate: "2024-03-20",
      status: "completed",
      amount: 2500,
      address: "123 MG Road, Bangalore"
    },
    {
      id: "BK-002",
      workshopName: "SpeedFix Motors",
      serviceType: "Brake Repair",
      vehicleDetails: "Hyundai Creta, 2021",
      bookingDate: "2024-03-10",
      appointmentDate: "2024-03-12",
      status: "confirmed",
      amount: 1800,
      address: "456 Koramangala, Bangalore"
    },
    {
      id: "BK-003",
      workshopName: "City Auto Works",
      serviceType: "AC Service",
      vehicleDetails: "Honda City, 2019",
      bookingDate: "2024-03-05",
      appointmentDate: "2024-03-08",
      status: "in-progress",
      amount: 3200,
      address: "789 Indiranagar, Bangalore"
    },
    {
      id: "BK-004",
      workshopName: "Elite Service Center",
      serviceType: "Denting & Painting",
      vehicleDetails: "Toyota Fortuner, 2022",
      bookingDate: "2024-03-01",
      appointmentDate: "2024-03-03",
      status: "cancelled",
      amount: 5500,
      address: "321 Whitefield, Bangalore"
    },
    {
      id: "BK-005",
      workshopName: "QuickFix Garage",
      serviceType: "Oil Change",
      vehicleDetails: "Tata Nexon, 2021",
      bookingDate: "2024-02-28",
      appointmentDate: "2024-03-02",
      status: "completed",
      amount: 1200,
      address: "654 Jayanagar, Bangalore"
    }
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{user.userName || user.name}</DialogTitle>
          <DialogDescription>
            Vehicle Owner Details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  User Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="font-medium">{user.userName || user.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">User ID</p>
                    <p className="font-medium text-sm">{user.userId || user._id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Member Since</p>
                    <p className="font-medium">{user.createdAt ? formatDate(user.createdAt) : "Unknown"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4" />
                  Account Status
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Account Type</p>
                    <Badge className="bg-blue-100 text-blue-800">
                      {user.userType || "Vehicle Owner"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <Badge className={user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {user.isActive ? "Active" : "Banned"}
                    </Badge>
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
                      {user.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {user.phoneNumber || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  Activity Stats
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Total Bookings</p>
                      <p className="font-medium text-lg">{recentBookings.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Completed</p>
                      <p className="font-medium text-lg">
                        {recentBookings.filter(b => b.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Booking</p>
                    <p className="font-medium text-sm">
                      {recentBookings.length > 0 ? formatDate(recentBookings[0].bookingDate) : "No bookings yet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Recent Bookings ({recentBookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <Car className="h-4 w-4 text-gray-500" />
                              <h4 className="font-semibold text-gray-800">{booking.vehicleDetails}</h4>
                            </div>
                            {getStatusBadge(booking.status)}
                            <span className="text-sm font-medium text-gray-700">
                              {formatCurrency(booking.amount)}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Wrench className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                <span className="font-medium">Service:</span> {booking.serviceType}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                <span className="font-medium">Workshop:</span> {booking.workshopName}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600 truncate">{booking.address}</span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span><span className="font-medium">Booked:</span> {formatDate(booking.bookingDate)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span><span className="font-medium">Appointment:</span> {formatDate(booking.appointmentDate)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <div className="text-xs font-medium text-gray-500 mb-1">Booking ID</div>
                          <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {booking.id}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Car className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No bookings found for this user</p>
                    <p className="text-sm mt-1">This user hasn't made any bookings yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Information Check */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Account Information Check</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {user.email ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">Email Address Provided</span>
              </div>
              <div className="flex items-center gap-2">
                {user.phoneNumber ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">Phone Number Provided</span>
              </div>
              <div className="flex items-center gap-2">
                {user.userName || user.name ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">Username Provided</span>
              </div>
              <div className="flex items-center gap-2">
                {user.userType === "vehicleOwner" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">Vehicle Owner Account</span>
              </div>
              <div className="flex items-center gap-2">
                {recentBookings.length > 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">Has Booking History</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;