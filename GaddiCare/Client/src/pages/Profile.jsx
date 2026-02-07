import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Car, Wrench, Edit, Search, Mail, Phone, Trash2, Camera } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef } from "react";
import axiosClient from "@/services/axiosMain";
import { DELETE_USER_IMAGE, UPLOAD_USER_IMAGE, UPDATE_USER_PROFILE } from "@/routes/serverEndpoints";
import { fetchAuthUser } from "@/store/slice/userSlice";
import { toast } from "sonner";
import EditUserProfileDialog from "@/components/EditUserProfile";
import { useNavigate } from "react-router";
const Profile = () => { 
  const navigate=useNavigate();
  const { data } = useSelector(state => state.userData);
  const fileInputRef = useRef(null);
  const [hoverAvatar, setHoverAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    phoneNumber: "",
  });
  const dispatch = useDispatch();

  const userData = {
    name: data?.userName || "User",
    email: data?.email || "No email",
    phone: data?.phoneNumber || "No phone",
    memberSince: "January 2024",
    avatarInitials: data?.userName?.charAt(0).toUpperCase() || "U",
    userImage: data?.userImage || ""
  };

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
      const response = await axiosClient.post(UPLOAD_USER_IMAGE,formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success(response?.data?.message||"Image uploaded successfully");
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
      
      if (response.status === 200 ) {
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

  const activeBookings = [
    {
      id: 1,
      workshopName: "AutoCare Pro Workshop",
      status: "IN PROGRESS",
      vehicle: "Honda City - DL 01 AB 1234",
      service: "Oil Change",
      bookedDate: "2024-01-20",
      estCompletion: "2024-01-20 5:00 PM",
      progress: 75
    }
  ];

  const serviceHistory = [
    {
      id: 1,
      workshop: "AutoCare Pro Workshop",
      service: "Oil Change",
      date: "2024-01-15",
      status: "Completed"
    },
    {
      id: 2,
      workshop: "Speedy Fix Garage",
      service: "Brake Service",
      date: "2023-12-10",
      status: "Completed"
    },
    {
      id: 3,
      workshop: "City Auto Works",
      service: "General Checkup",
      date: "2023-11-05",
      status: "Completed"
    }
  ];

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
                      <AvatarImage src={`${import.meta.env.VITE_SERVER_URL}/${userData.userImage}`} />
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
              
              <Button 
                variant="outline" 
                className="gap-2 border-orange-300 hover:bg-orange-50 text-orange-700"
                disabled={isLoading}
                onClick={handleEditProfileClick}
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger value="active" className="data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm">Active Bookings</TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm">Service History</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="space-y-4">
                {activeBookings.map((booking) => (
                  <Card key={booking.id} className="border-gray-200">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg text-gray-900">{booking.workshopName}</CardTitle>
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200">
                          {booking.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Car className="h-4 w-4" />
                          <span>{booking.vehicle}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Wrench className="h-4 w-4" />
                          <span>{booking.service}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Booked: {booking.bookedDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Est. Completion: {booking.estCompletion}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{booking.progress}%</span>
                        </div>
                        <Progress value={booking.progress} className="h-2 [&>div]:bg-orange-600" />
                        <div className="flex justify-between mt-4">
                          <div className="text-center">
                            <div className="h-2 w-2 rounded-full bg-orange-600 mx-auto mb-1"></div>
                            <span className="text-xs text-orange-600 font-medium">Pending</span>
                          </div>
                          <div className="text-center">
                            <div className="h-2 w-2 rounded-full bg-orange-600 mx-auto mb-1"></div>
                            <span className="text-xs text-orange-600 font-medium">Accepted</span>
                          </div>
                          <div className="text-center">
                            <div className="h-2 w-2 rounded-full bg-orange-600 mx-auto mb-1"></div>
                            <span className="text-xs text-orange-600 font-medium">In Progress</span>
                          </div>
                          <div className="text-center">
                            <div className="h-2 w-2 rounded-full bg-gray-300 mx-auto mb-1"></div>
                            <span className="text-xs text-gray-400">Completed</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="history" className="space-y-4">
                {serviceHistory.map((service) => (
                  <Card key={service.id} className="border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{service.workshop}</h3>
                          <div className="flex items-center gap-2 mt-2 text-gray-600">
                            <Wrench className="h-4 w-4" />
                            <span>{service.service}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{service.date}</span>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                          {service.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">            
                <Button onClick={()=>navigate("/workshop")} className="w-full justify-start gap-2 bg-orange-600 hover:bg-orange-700">
                  <Search className="h-4 w-4" />
                  Find Workshop
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
