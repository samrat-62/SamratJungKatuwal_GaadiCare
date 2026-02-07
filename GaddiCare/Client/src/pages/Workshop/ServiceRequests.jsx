import BookingDetailsDialog from '@/components/BookingDetailsDialog'
import { AppContext } from '@/components/ContextApi'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon, Check, ChevronLeft, ChevronRight, Clock, Eye, MapPin, MessageCircle, Phone, PlayCircle, Search, X } from 'lucide-react'
import moment from 'moment'
import { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const ServiceRequests = () => {
  const {updateBookingStatus} = useContext(AppContext);
  const { data: user } = useSelector((state) => state.userData)
  const { bookings, loading } = useSelector((state) => state.allBookings)
  
  const [activeTab, setActiveTab] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filteredBookings, setFilteredBookings] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [currentPage, setCurrentPage] = useState(1)
  const bookingsPerPage = 6
  
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    accepted: 0,
    'in-progress': 0
  })

  useEffect(() => {
    if (bookings && user) {
      let workshopBookings = bookings.filter(booking => 
        booking.workshopId === user._id && 
        booking.status !== 'completed' && 
        booking.status !== 'cancelled'
      )
      
      if (dateRange.from && dateRange.to) {
        workshopBookings = workshopBookings.filter(booking => {
          const bookingDate = new Date(booking.createdAt)
          return bookingDate >= dateRange.from && bookingDate <= dateRange.to
        })
      }
      
      if (searchQuery) {
        workshopBookings = workshopBookings.filter(booking => 
          booking.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.vehicleType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.services?.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      }
      
      const counts = {
        all: workshopBookings.length,
        pending: workshopBookings.filter(b => b.status === 'pending').length,
        accepted: workshopBookings.filter(b => b.status === 'accepted').length,
        'in-progress': workshopBookings.filter(b => b.status === 'in-progress').length
      }
      
      setStatusCounts(counts)
      
      let filtered = workshopBookings
      
      if (activeTab !== 'all') {
        filtered = workshopBookings.filter(booking => booking.status === activeTab)
      }
      
      const sortedBookings = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setFilteredBookings(sortedBookings)
      setCurrentPage(1)
    }
  }, [bookings, user, activeTab, searchQuery, dateRange])

  const indexOfLastBooking = currentPage * bookingsPerPage
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking)
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage)

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setIsDialogOpen(true)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'accepted': { color: 'bg-blue-100 text-blue-800', label: 'Accepted' },
      'in-progress': { color: 'bg-purple-100 text-purple-800', label: 'In Progress' },
      'completed': { color: 'bg-green-100 text-green-800', label: 'Completed' },
      'cancelled': { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    return (
      <Badge className={`${config.color}`}>
        {config.label}
      </Badge>
    )
  }

  const getActionButtons = (booking) => {
    switch (booking.status) {
      case 'pending':
        return (
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={() => updateBookingStatus(booking.bookingId, 'accepted')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Accept
            </Button>
            <Button 
              onClick={() => updateBookingStatus(booking.bookingId, 'rejected')}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button 
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>
        )
      case 'accepted':
        return (
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={() => updateBookingStatus(booking.bookingId, 'in-progress')}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Start Service
            </Button>
            <Button 
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>
        )
      case 'in-progress':
        return (
          <div className="flex gap-2 mt-4">
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => updateBookingStatus(booking.bookingId, 'completed')}
            >
              <Check className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
            <Button 
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>
        )
      default:
        return (
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>
        )
    }
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const clearFilters = () => {
    setSearchQuery('')
    setDateRange({ from: null, to: null })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
        <p className="text-gray-600">Manage and respond to customer service requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, vehicle, service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {moment(dateRange.from).format('MMM D, YYYY')} - {moment(dateRange.to).format('MMM D, YYYY')}
                    </>
                  ) : (
                    moment(dateRange.from).format('MMM D, YYYY')
                  )
                ) : (
                  "Filter by date"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-amber-400" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
          
          {(searchQuery || dateRange.from || dateRange.to) && (
            <Button variant="outline" type="button" className="relative z-50" onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600">
            Showing {indexOfFirstBooking + 1}-{Math.min(indexOfLastBooking, filteredBookings.length)} of {filteredBookings.length} requests
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2"
          >
            <div className="flex flex-col items-center">
              <span className="font-medium">All</span>
              <span className="text-sm text-gray-500">{statusCounts.all}</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="pending" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2"
          >
            <div className="flex flex-col items-center">
              <span className="font-medium">Pending</span>
              <span className="text-sm text-gray-500">{statusCounts.pending}</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="accepted" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2"
          >
            <div className="flex flex-col items-center">
              <span className="font-medium">Accepted</span>
              <span className="text-sm text-gray-500">{statusCounts.accepted}</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="in-progress" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2"
          >
            <div className="flex flex-col items-center">
              <span className="font-medium">In Progress</span>
              <span className="text-sm text-gray-500">{statusCounts['in-progress']}</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderBookings(currentBookings)}
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          {renderBookings(currentBookings)}
        </TabsContent>
        <TabsContent value="accepted" className="mt-6">
          {renderBookings(currentBookings)}
        </TabsContent>
        <TabsContent value="in-progress" className="mt-6">
          {renderBookings(currentBookings)}
        </TabsContent>
      </Tabs>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }
            
            return (
              <Button
                key={pageNum}
                onClick={() => paginate(pageNum)}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  currentPage === pageNum && "bg-orange-600 hover:bg-orange-700"
                )}
              >
                {pageNum}
              </Button>
            )
          })}
          
          <Button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-gray-600 ml-2">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
      {
        isDialogOpen && (<BookingDetailsDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        booking={selectedBooking}
      />)
      }
    </div>
  )

  function renderBookings(bookings) {
    if (bookings.length === 0) {
      return (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <MessageCircle className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No service requests found</h3>
            <p className="text-gray-600">
              {activeTab === 'all' 
                ? "You don't have any active service requests."
                : `You don't have any ${activeTab} service requests.`}
            </p>
            {(searchQuery || dateRange.from || dateRange.to) && (
              <Button 
                onClick={clearFilters}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="grid grid-cols-1 gap-6">
        {bookings.map((booking) => (
          <Card key={booking._id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage 
                      src={booking.userImage ? `${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}${booking.userImage}` : undefined} 
                      alt={booking.userName}
                    />
                    <AvatarFallback className="bg-orange-100 text-orange-600">
                      {getInitials(booking.userName || 'CU')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{booking.userName}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-gray-600">
                        <CalendarIcon className="h-4 w-4" />
                        <span className="text-sm">
                          {moment(booking.bookingDate).format('YYYY-MM-DD')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{booking.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{booking.userPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(booking.status)}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(booking)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <p className="font-medium text-gray-900 mb-1">
                  {booking.vehicleType} - {booking.vehicleNumber}
                </p>
                {booking.pickupAddress && (
                  <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{booking.pickupAddress}</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="font-medium text-gray-700 mb-1">Services:</p>
                <div className="flex flex-wrap gap-2">
                  {booking.services && booking.services.map((service, index) => (
                    <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {booking.problemDescription && (
                <div className="mb-4">
                  <p className="font-medium text-gray-700 mb-1">Description:</p>
                  <p className="text-gray-600 text-sm">{booking.problemDescription}</p>
                </div>
              )}

              {getActionButtons(booking)}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
}

export default ServiceRequests