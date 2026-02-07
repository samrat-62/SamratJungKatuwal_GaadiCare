import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight, Phone, Search, Eye, Trash2 } from 'lucide-react'
import moment from 'moment'
import { cn } from "@/lib/utils"
import BookingDetailsDialog from '@/components/BookingDetailsDialog'
import axiosClient from '@/services/axiosMain'
import { BOOK_SERVICE } from '@/routes/serverEndpoints'
import { fetchAllBookings } from '@/store/slice/getAllBookings'
import { toast } from 'sonner'

const ServiceHistory = () => {
  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.userData)
  const { bookings, loading } = useSelector((state) => state.allBookings)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('completed')
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredBookings, setFilteredBookings] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [statusCounts, setStatusCounts] = useState({
    completed: 0,
    cancelled: 0
  })
  
  const itemsPerPage = 6

  useEffect(() => {
    if (bookings && user) {
      let workshopBookings = bookings.filter(booking => booking.workshopId === user._id)
      
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
      
      const completedBookings = workshopBookings.filter(b => b.status === 'completed')
      const cancelledBookings = workshopBookings.filter(b => b.status === 'cancelled')
      
      setStatusCounts({
        completed: completedBookings.length,
        cancelled: cancelledBookings.length
      })
      
      let filtered = []
      if (activeTab === 'completed') {
        filtered = completedBookings
      } else if (activeTab === 'cancelled') {
        filtered = cancelledBookings
      }
      
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setFilteredBookings(filtered)
      setCurrentPage(1)
    }
  }, [bookings, user, activeTab, searchQuery, dateRange])

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" />, label: 'Completed' },
      'cancelled': { color: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4" />, label: 'Cancelled' }
    }
    
    const config = statusConfig[status] || statusConfig.completed
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  const getInitials = (name) => {
    if (!name) return 'CU'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString) => {
    return moment(dateString).format('MMM DD, YYYY')
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A'
    return timeString
  }

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem)
  const [selectedBooking, setSelectedBooking] = useState(null);

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const clearFilters = () => {
    setSearchQuery('')
    setDateRange({ from: null, to: null })
  }

 const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setIsDialogOpen(true)
  }

  const handleDelete = async (booking) => {
    try{
         const response = await axiosClient.delete(`${BOOK_SERVICE}/${booking._id}`, { withCredentials: true });
         if(response.status === 200){
          await dispatch(fetchAllBookings());
          toast.success(response.data.message || "Booking deleted successfully");
         }
    }catch(error){
      console.error("Delete Booking Error:", error);
      toast.error(error.response?.data?.message || "Failed to delete booking");
    }
  }

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    
    return pageNumbers
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service history...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Service History</h1>
        <p className="text-gray-600">View your completed and cancelled service requests</p>
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
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredBookings.length)} of {filteredBookings.length} requests
          </p>
        </div>
      </div>

      <Card className="border-gray-200 shadow-sm mb-8">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value)
            setCurrentPage(1)
          }}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="completed" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2"
              >
                <div className="flex flex-col items-center">
                  <span className="font-medium">Completed</span>
                  <span className="text-sm text-gray-500">{statusCounts.completed}</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="cancelled" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2"
              >
                <div className="flex flex-col items-center">
                  <span className="font-medium">Cancelled</span>
                  <span className="text-sm text-gray-500">{statusCounts.cancelled}</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="completed" className="mt-6">
              {renderBookings(currentItems)}
            </TabsContent>
            <TabsContent value="cancelled" className="mt-6">
              {renderBookings(currentItems)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
          
          {getPageNumbers().map((number, index) => (
            <Button
              key={index}
              onClick={() => typeof number === 'number' ? paginate(number) : null}
              variant={number === currentPage ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-8 w-8 p-0",
                number === currentPage && "bg-orange-600 hover:bg-orange-700"
              )}
              disabled={typeof number !== 'number'}
            >
              {number}
            </Button>
          ))}
          
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
    </div>
  )

  function renderBookings(bookings) {
    if (bookings.length === 0) {
      return (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              {activeTab === 'completed' ? (
                <CheckCircle className="h-16 w-16 mx-auto" />
              ) : (
                <XCircle className="h-16 w-16 mx-auto" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No {activeTab} services found
            </h3>
            <p className="text-gray-600">
              {activeTab === 'completed' 
                ? "You don't have any completed services yet."
                : "You don't have any cancelled services."}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => {
          const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'
          
          return (
            <Card key={booking._id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={booking.userImage ? `${serverUrl}${booking.userImage}` : undefined} 
                        alt={booking.userName}
                      />
                      <AvatarFallback className="bg-orange-100 text-orange-600">
                        {getInitials(booking.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-gray-900">{booking.userName}</h3>
                      <p className="text-sm text-gray-600">
                        {booking.vehicleType} - {booking.vehicleNumber}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="mb-4">
                  <p className="font-medium text-gray-700 mb-2">
                    {booking.services?.[0] || 'Service'}
                    {booking.services && booking.services.length > 1 && ` +${booking.services.length - 1}`}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="text-sm">{formatDate(booking.bookingDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{formatTime(booking.timeSlot)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{booking.userPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 flex items-center gap-1"
                      onClick={() => handleViewDetails(booking)}
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                    {
                      isDialogOpen && ( <BookingDetailsDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        booking={selectedBooking}
      />)
                    }
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 flex items-center gap-1 border-red-600 text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(booking)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }
}

export default ServiceHistory