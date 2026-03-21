import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Car, CheckCircle, Clock, Mail, MapPin, Phone, Shield, User, Wrench, XCircle } from "lucide-react";
import { useSelector } from "react-redux";

const UserDetailsDialog = ({ user, open, onOpenChange }) => {
  if (!user) return null;

  const {bookings} = useSelector(state=>state.allBookings);

  const userBookings = bookings?.filter(booking => booking.userId === user.userId || booking.userId === user._id) || [];
  const recentBookings = userBookings.slice(0, 3);

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
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
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
                    <Badge className={!user.isBanned ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {!user.isBanned ? "Active" : "Banned"}
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
                      {user.userEmail || user.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {user.userPhone || user.phoneNumber || "N/A"}
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
                      <p className="font-medium text-lg">{userBookings.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Completed</p>
                      <p className="font-medium text-lg">
                        {userBookings.filter(b => b.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Booking</p>
                    <p className="font-medium text-sm">
                      {userBookings.length > 0 ? formatDate(userBookings[0].bookingDate) : "No bookings yet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Recent Bookings (Latest 3)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <div key={booking._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <Car className="h-4 w-4 text-gray-500" />
                              <h4 className="font-semibold text-gray-800">{booking.vehicleType} - {booking.vehicleNumber}</h4>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Wrench className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                <span className="font-medium">Services:</span> {booking.services?.join(", ")}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                <span className="font-medium">Workshop:</span> {booking.workshopName}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600 truncate">{booking.workshopAddress}</span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span><span className="font-medium">Booked:</span> {formatDateTime(booking.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span><span className="font-medium">Appointment:</span> {formatDate(booking.bookingDate)} - {booking.timeSlot}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <div className="text-xs font-medium text-gray-500 mb-1">Booking ID</div>
                          <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {booking.bookingId}
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

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Account Information Check</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {user.userEmail || user.email ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">Email Address Provided</span>
              </div>
              <div className="flex items-center gap-2">
                {user.userPhone || user.phoneNumber ? (
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
                {userBookings.length > 0 ? (
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
