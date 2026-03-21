import BookingDetailsDialog from "@/components/BookingDetailsDialog";
import { AppContext } from "@/components/ContextApi";
import EditUserProfileDialog from "@/components/EditUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BOOK_SERVICE, CREATE_ROOM, DELETE_USER_IMAGE, UPDATE_USER_PROFILE, UPLOAD_USER_IMAGE } from "@/routes/serverEndpoints";
import axiosClient from "@/services/axiosMain";
import { fetchAllBookings } from "@/store/slice/getAllBookings";
import { fetchAuthUser } from "@/store/slice/userSlice";
import { format } from "date-fns";
import { Calendar, Camera, Car, ChevronLeft, ChevronRight, Edit, Eye, Mail, MessageSquare, Phone, Search, Trash2, Wrench, X } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Profile = () => { 
  const navigate = useNavigate();
  const { updateBookingStatus } = useContext(AppContext);
  const { data } = useSelector(state => state.userData);
  const { bookings, loading: bookingLoading } = useSelector(state => state?.allBookings);
  const fileInputRef = useRef(null);
  const [hoverAvatar, setHoverAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    phoneNumber: "",
  });
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [myBookingsPage, setMyBookingsPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [myBookingsFilter, setMyBookingsFilter] = useState("all");
  const [historyFilter, setHistoryFilter] = useState("all");
  const [myBookingsDateRange, setMyBookingsDateRange] = useState({ from: null, to: null });
  const [historyDateRange, setHistoryDateRange] = useState({ from: null, to: null });
  const [myBookingsSearch, setMyBookingsSearch] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [chatCreating, setChatCreating] = useState({});
  
  const dispatch = useDispatch();

  const userData = {
    name: data?.userName || "User",
    email: data?.email || "No email",
    phone: data?.phoneNumber || "No phone",
    memberSince: "January 2024",
    avatarInitials: data?.userName?.charAt(0).toUpperCase() || "U",
    userImage: data?.userImage || ""
  };

  const userBookings = bookings?.filter(booking => booking.userId === data?._id) || [];

  const myBookings = userBookings.filter(booking => 
    ["pending", "accepted", "in-progress"].includes(booking.status)
  );

  const serviceHistory = userBookings.filter(booking => 
    ["completed", "cancelled", "rejected"].includes(booking.status)
  );

  const filteredMyBookings = myBookings.filter(booking => {
    if (myBookingsFilter !== "all" && booking.status !== myBookingsFilter) return false;
    
    if (myBookingsDateRange.from && myBookingsDateRange.to) {
      const bookingDate = new Date(booking.bookingDate);
      return bookingDate >= myBookingsDateRange.from && bookingDate <= myBookingsDateRange.to;
    }
    
    if (myBookingsSearch) {
      const searchLower = myBookingsSearch.toLowerCase();
      return (
        booking.workshopName?.toLowerCase().includes(searchLower) ||
        booking.vehicleType?.toLowerCase().includes(searchLower) ||
        booking.vehicleNumber?.toLowerCase().includes(searchLower) ||
        booking.services?.some(service => service.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  const filteredHistory = serviceHistory.filter(booking => {
    if (historyFilter !== "all" && booking.status !== historyFilter) return false;
    
    if (historyDateRange.from && historyDateRange.to) {
      const bookingDate = new Date(booking.bookingDate);
      return bookingDate >= historyDateRange.from && bookingDate <= historyDateRange.to;
    }
    
    if (historySearch) {
      const searchLower = historySearch.toLowerCase();
      return (
        booking.workshopName?.toLowerCase().includes(searchLower) ||
        booking.vehicleType?.toLowerCase().includes(searchLower) ||
        booking.vehicleNumber?.toLowerCase().includes(searchLower) ||
        booking.services?.some(service => service.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  const paginatedMyBookings = filteredMyBookings.slice((myBookingsPage - 1) * 4, myBookingsPage * 4);
  const paginatedHistory = filteredHistory.slice((historyPage - 1) * 4, historyPage * 4);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axiosClient.post(UPLOAD_USER_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success(response?.data?.message || "Image uploaded successfully");
        await dispatch(fetchAuthUser());
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error?.response?.data?.message || "Failed to upload image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!userData.userImage) return;

    setIsLoading(true);

    try {
      const response = await axiosClient.delete(DELETE_USER_IMAGE, {
        withCredentials: true,
      });
      
      if (response.status === 200) {
        toast.success(response?.data?.message || "Image deleted successfully");
        await dispatch(fetchAuthUser());
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarClick = () => {
    if (userData.userImage) {
      if (hoverAvatar) {
        handleDeleteImage();
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleEditProfileClick = () => {
    setFormData({
      userName: userData.name,
      phoneNumber: userData.phone,
    });
    setOpenEditDialog(true);
  };

  const handleUpdateProfile = async (formData) => {
    setUpdateLoading(true);

    try {
      const response = await axiosClient.patch(
        UPDATE_USER_PROFILE,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success(response?.data?.message || "Profile updated successfully");
        await dispatch(fetchAuthUser());
        setOpenEditDialog(false);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteBooking = async (bookingId) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: true }));
    try {
      const response = await axiosClient.delete(`${BOOK_SERVICE}/${bookingId}`, { 
        withCredentials: true 
      });
      if (response.status === 200) {
        await dispatch(fetchAllBookings());
        toast.success(response.data.message || "Booking deleted successfully");
      }
    } catch (error) {
      console.error("Delete Booking Error:", error);
      toast.error(error.response?.data?.message || "Failed to delete booking");
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleCancelBooking = async (bookingId) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: true }));
    try {
      await updateBookingStatus(bookingId, "cancelled");
      await dispatch(fetchAllBookings());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleCreateChatRoom = async (booking) => {
    if (!booking.workshopId) {
      toast.error("Unable to start chat. Workshop information missing.");
      return;
    }

    setChatCreating(prev => ({ ...prev, [booking._id]: true }));
    try {
      const response = await axiosClient.post(
        CREATE_ROOM,
        {
          targetUserId: booking.workshopId,
          targetUserType: "workshop"
        },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        const room = response.data.room;
        toast.success(response?.data?.message || `Chat room ${response.data.status} successfully!`);
        navigate(`/user-chat?room=${room._id}`);
      }
    } catch (error) {
      console.error("Error creating chat room:", error);
      toast.error(error.response?.data?.error || "Failed to create chat room");
    } finally {
      setChatCreating(prev => ({ ...prev, [booking._id]: false }));
    }
  };
  

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">Pending</Badge>;
      case 'accepted':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">Accepted</Badge>;
      case 'in-progress':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Cancelled</Badge>;
      case 'rejected':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getActionButtons = (booking) => {
    const isActionLoading = actionLoading[booking._id];
    const isChatCreating = chatCreating[booking._id];

    switch (booking.status) {
      case 'pending':
        return (
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline"
              onClick={() => handleViewDetails(booking)}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              disabled={isActionLoading}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button 
              onClick={() => handleCancelBooking(booking._id)}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
                  Cancelling...
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </>
              )}
            </Button>
            <Button 
              onClick={() => deleteBooking(booking._id)}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </div>
        );
      case 'accepted':
      case 'in-progress':
        return (
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline"
              onClick={() => handleViewDetails(booking)}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              disabled={isActionLoading || isChatCreating}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleCreateChatRoom(booking)}
              className="border-green-600 text-green-600 hover:bg-green-50"
              disabled={isActionLoading || isChatCreating}
            >
              {isChatCreating ? (
                <>
                  <div className="h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </>
              )}
            </Button>
          </div>
        );
      case 'completed':
      case 'cancelled':
      case 'rejected':
        return (
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline"
              onClick={() => handleViewDetails(booking)}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              disabled={isActionLoading}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button 
              onClick={() => deleteBooking(booking._id)}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </div>
        );
      default:
        return (
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline"
              onClick={() => handleViewDetails(booking)}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </div>
        );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const clearMyBookingsFilters = () => {
    setMyBookingsSearch("");
    setMyBookingsDateRange({ from: null, to: null });
    setMyBookingsFilter("all");
  };

  const clearHistoryFilters = () => {
    setHistorySearch("");
    setHistoryDateRange({ from: null, to: null });
    setHistoryFilter("all");
  };

  useEffect(() => {
    setMyBookingsPage(1);
  }, [myBookingsFilter, myBookingsDateRange, myBookingsSearch]);

  useEffect(() => {
    setHistoryPage(1);
  }, [historyFilter, historyDateRange, historySearch]);

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      <EditUserProfileDialog
        open={openEditDialog}
        setOpen={setOpenEditDialog}
        formData={formData}
        setFormData={setFormData}
        updateLoading={updateLoading}
        handleSubmit={handleUpdateProfile}
      />

      {isDialogOpen && selectedBooking && (
        <BookingDetailsDialog 
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          booking={selectedBooking}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div 
                  className="relative cursor-pointer"
                  onMouseEnter={() => setHoverAvatar(true)}
                  onMouseLeave={() => setHoverAvatar(false)}
                  onClick={handleAvatarClick}
                >
                  <Avatar className="h-16 w-16">
                    {userData.userImage ? (
                      <AvatarImage src={`${import.meta.env.VITE_SERVER_URL}${userData.userImage}`} />
                    ) : null}
                    <AvatarFallback className="text-lg bg-orange-100 text-orange-800">
                      {userData.avatarInitials}
                    </AvatarFallback>
                  </Avatar>
                  
                  {hoverAvatar && !isLoading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      {userData.userImage ? (
                        <Trash2 className="h-6 w-6 text-white" />
                      ) : (
                        <Camera className="h-6 w-6 text-white" />
                      )}
                    </div>
                  )}

                  {isLoading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{userData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{userData.phone}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-1">Member since {userData.memberSince}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="gap-2 border-orange-300 hover:bg-orange-50 text-orange-700"
                  disabled={isLoading}
                  onClick={handleEditProfileClick}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
                <Button 
                  className="gap-2 bg-orange-600 hover:bg-orange-700"
                  onClick={() => navigate("/user-chat")}
                >
                  <MessageSquare className="h-4 w-4" />
                  Messages
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="mybookings" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger value="mybookings" className="data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm">My Bookings</TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm">Service History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="mybookings" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={myBookingsSearch}
                      onChange={(e) => setMyBookingsSearch(e.target.value)}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <Select value={myBookingsFilter} onValueChange={setMyBookingsFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="mr-2 h-4 w-4" />
                        {myBookingsDateRange.from ? (
                          myBookingsDateRange.to ? (
                            <>
                              {format(myBookingsDateRange.from, "MMM d")} - {format(myBookingsDateRange.to, "MMM d, yyyy")}
                            </>
                          ) : (
                            format(myBookingsDateRange.from, "MMM d, yyyy")
                          )
                        ) : (
                          "Filter by date"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-amber-400" align="start">
                      <CalendarComponent
                        mode="range"
                        selected={myBookingsDateRange}
                        onSelect={setMyBookingsDateRange}
                        numberOfMonths={2}
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {(myBookingsSearch || myBookingsDateRange.from || myBookingsDateRange.to || myBookingsFilter !== "all") && (
                  <div className="flex justify-end mb-4">
                    <Button variant="ghost" size="sm" onClick={clearMyBookingsFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )}
                
                {bookingLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="h-6 w-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : paginatedMyBookings.length > 0 ? (
                  <>
                    {paginatedMyBookings.map((booking) => (
                      <Card key={booking._id} className="border-gray-200 mb-4">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg text-gray-900">{booking.workshopName}</CardTitle>
                            {getStatusBadge(booking.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Car className="h-4 w-4" />
                              <span>{booking.vehicleType} - {booking.vehicleNumber}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Wrench className="h-4 w-4" />
                              <span>{booking.services?.join(", ")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>Date: {formatDate(booking.bookingDate)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>Time Slot: {booking.timeSlot}</span>
                            </div>
                          </div>
                          {getActionButtons(booking)}
                        </CardContent>
                      </Card>
                    ))}
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-600">
                        Showing {((myBookingsPage - 1) * 4) + 1} to {Math.min(myBookingsPage * 4, filteredMyBookings.length)} of {filteredMyBookings.length} bookings
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setMyBookingsPage(prev => Math.max(1, prev - 1))}
                          disabled={myBookingsPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setMyBookingsPage(prev => 
                            prev < Math.ceil(filteredMyBookings.length / 4) ? prev + 1 : prev
                          )}
                          disabled={myBookingsPage >= Math.ceil(filteredMyBookings.length / 4)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Car className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No active bookings found</p>
                    {(myBookingsSearch || myBookingsDateRange.from || myBookingsDateRange.to) && (
                      <Button 
                        variant="outline"
                        className="mt-4"
                        onClick={clearMyBookingsFilters}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search history..."
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <Select value={historyFilter} onValueChange={setHistoryFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="mr-2 h-4 w-4" />
                        {historyDateRange.from ? (
                          historyDateRange.to ? (
                            <>
                              {format(historyDateRange.from, "MMM d")} - {format(historyDateRange.to, "MMM d, yyyy")}
                            </>
                          ) : (
                            format(historyDateRange.from, "MMM d, yyyy")
                          )
                        ) : (
                          "Filter by date"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="range"
                        selected={historyDateRange}
                        onSelect={setHistoryDateRange}
                        numberOfMonths={2}
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {(historySearch || historyDateRange.from || historyDateRange.to || historyFilter !== "all") && (
                  <div className="flex justify-end mb-4">
                    <Button variant="ghost" size="sm" onClick={clearHistoryFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )}
                
                {bookingLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="h-6 w-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : paginatedHistory.length > 0 ? (
                  <>
                    {paginatedHistory.map((booking) => (
                      <Card key={booking._id} className="border-gray-200 mb-4">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg text-gray-900">{booking.workshopName}</CardTitle>
                            {getStatusBadge(booking.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Car className="h-4 w-4" />
                              <span>{booking.vehicleType} - {booking.vehicleNumber}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Wrench className="h-4 w-4" />
                              <span>{booking.services?.join(", ")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>Date: {formatDate(booking.bookingDate)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>Time Slot: {booking.timeSlot}</span>
                            </div>
                          </div>
                          {getActionButtons(booking)}
                        </CardContent>
                      </Card>
                    ))}
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-600">
                        Showing {((historyPage - 1) * 4) + 1} to {Math.min(historyPage * 4, filteredHistory.length)} of {filteredHistory.length} history records
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setHistoryPage(prev => Math.max(1, prev - 1))}
                          disabled={historyPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setHistoryPage(prev => 
                            prev < Math.ceil(filteredHistory.length / 4) ? prev + 1 : prev
                          )}
                          disabled={historyPage >= Math.ceil(filteredHistory.length / 4)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Car className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No service history found</p>
                    {(historySearch || historyDateRange.from || historyDateRange.to) && (
                      <Button 
                        variant="outline"
                        className="mt-4"
                        onClick={clearHistoryFilters}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">            
                <Button onClick={() => navigate("/workshop")} className="w-full justify-start gap-2 bg-orange-600 hover:bg-orange-700">
                  <Search className="h-4 w-4" />
                  Find Workshop
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Booking Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Active Bookings</p>
                    <p className="text-2xl font-bold text-blue-800">{myBookings.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600">Completed</p>
                    <p className="text-2xl font-bold text-green-800">
                      {serviceHistory.filter(b => b.status === 'completed').length}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-600">Cancelled</p>
                    <p className="text-2xl font-bold text-red-800">
                      {serviceHistory.filter(b => b.status === 'cancelled').length}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-800">{userBookings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;