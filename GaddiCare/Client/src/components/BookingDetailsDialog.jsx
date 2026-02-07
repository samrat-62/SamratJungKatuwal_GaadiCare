import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Phone, Mail, MapPin, Car, User, Wrench, AlertCircle, CheckCircle, XCircle, Navigation, Building } from 'lucide-react'
import moment from 'moment'

const BookingDetailsDialog = ({ isOpen, onClose, booking }) => {
  if (!booking) return null

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: <AlertCircle className="h-4 w-4" />, label: 'Pending' },
      'accepted': { color: 'bg-blue-100 text-blue-800', icon: <CheckCircle className="h-4 w-4" />, label: 'Accepted' },
      'in-progress': { color: 'bg-purple-100 text-purple-800', icon: <Wrench className="h-4 w-4" />, label: 'In Progress' },
      'completed': { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" />, label: 'Completed' },
      'cancelled': { color: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4" />, label: 'Cancelled' }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString) => {
    return moment(dateString).format('MMMM Do, YYYY')
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Booking Details</span>
            {getStatusBadge(booking.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-16 w-16 border-2">
                  <AvatarImage 
                    src={booking.userImage ? `${serverUrl}${booking.userImage}` : undefined} 
                    alt={booking.userName}
                  />
                  <AvatarFallback className="bg-orange-100 text-orange-600 text-lg">
                    {getInitials(booking.userName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{booking.userName}</h3>
                  <div className="space-y-1 mt-1">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{booking.userPhone}</span>
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span>{booking.userEmail}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Vehicle Details
                </h3>
                <div className="space-y-2 pl-6">
                  <p className="text-sm">
                    <span className="font-medium">Type:</span> {booking.vehicleType}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Number:</span> {booking.vehicleNumber}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Booking ID:</span> {booking.bookingId || booking._id}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                {booking.workshopImage && (
                  <Avatar className="h-16 w-16 border-2">
                    <AvatarImage 
                      src={`${serverUrl}${booking.workshopImage}`} 
                      alt={booking.workshopName}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                      {getInitials(booking.workshopName)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{booking.workshopName}</h3>
                  <div className="space-y-1 mt-1">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Building className="h-3 w-3" />
                      <span>{booking.workshopAddress}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Service Schedule
                </h3>
                <div className="space-y-2 pl-6">
                  <p className="text-sm">
                    <span className="font-medium">Date:</span> {formatDate(booking.bookingDate)}
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{booking.timeSlot}</span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location Details
                </h3>
                <div className="space-y-2 pl-6">
                  <p className="text-sm">
                    <span className="font-medium">Pickup Required:</span> {booking.pickupRequired ? 'Yes' : 'No'}
                  </p>
                  {booking.pickupAddress && (
                    <p className="text-sm">
                      <span className="font-medium">Pickup Address:</span> {booking.pickupAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Services Requested
            </h3>
            <div className="flex flex-wrap gap-2 pl-6">
              {booking.services && booking.services.map((service, index) => (
                <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          {booking.problemDescription && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Problem Description</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">{booking.problemDescription}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-1">Created At</h4>
              <p className="text-sm text-gray-600">
                {moment(booking.createdAt).format('MMMM Do, YYYY h:mm A')}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-1">Last Updated</h4>
              <p className="text-sm text-gray-600">
                {moment(booking.updatedAt).format('MMMM Do, YYYY h:mm A')}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-1">Cancellation Status</h4>
              <p className="text-sm text-gray-600">
                {booking.isCancelled ? 'Cancelled' : 'Active'}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BookingDetailsDialog
