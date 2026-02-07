import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DELETE_USER_IMAGE, UPDATE_WORKSHOP_PROFILE, UPLOAD_WORKSHOP_IMAGE } from "@/routes/serverEndpoints";
import axiosClient from "@/services/axiosMain";
import { fetchAllWorkshops } from "@/store/slice/getAllWorkshops";
import { fetchAuthUser } from "@/store/slice/userSlice";
import { Camera, Clock, Edit, Mail, MapPin, Phone, Save, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "sonner";

const WorkshopDetails = () => {
  const { data: user } = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [hoverAvatar, setHoverAvatar] = useState(false);
  const fileInputRef = useRef(null);
  
  const [workshopData, setWorkshopData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    description: '',
    isOpen: true,
    servicesOffered: [],
    workingHours: {
      monday: { from: '09:00', to: '19:00', closed: false },
      tuesday: { from: '09:00', to: '19:00', closed: false },
      wednesday: { from: '09:00', to: '19:00', closed: false },
      thursday: { from: '09:00', to: '19:00', closed: false },
      friday: { from: '09:00', to: '19:00', closed: false },
      saturday: { from: '09:00', to: '17:00', closed: false },
      sunday: { from: '09:00', to: '17:00', closed: true }
    }
  });
  
  const [newService, setNewService] = useState('');

  useEffect(() => {
    if (user) {
      const defaultWorkingHours = {
        monday: { from: '09:00', to: '19:00', closed: false },
        tuesday: { from: '09:00', to: '19:00', closed: false },
        wednesday: { from: '09:00', to: '19:00', closed: false },
        thursday: { from: '09:00', to: '19:00', closed: false },
        friday: { from: '09:00', to: '19:00', closed: false },
        saturday: { from: '09:00', to: '17:00', closed: false },
        sunday: { from: '09:00', to: '17:00', closed: true }
      };

      setWorkshopData({
        name: user.workshopName || '',
        phone: user.phoneNumber || '',
        email: user.email || '',
        address: user.workshopAddress || '',
        description: user.description || '',
        isOpen: user.isOpen,
        servicesOffered: Array.isArray(user.servicesOffered) ? user.servicesOffered : [],
        workingHours: user.workingHours ? {
          monday: user.workingHours.monday || defaultWorkingHours.monday,
          tuesday: user.workingHours.tuesday || defaultWorkingHours.tuesday,
          wednesday: user.workingHours.wednesday || defaultWorkingHours.wednesday,
          thursday: user.workingHours.thursday || defaultWorkingHours.thursday,
          friday: user.workingHours.friday || defaultWorkingHours.friday,
          saturday: user.workingHours.saturday || defaultWorkingHours.saturday,
          sunday: user.workingHours.sunday || defaultWorkingHours.sunday
        } : defaultWorkingHours
      });
    }
  }, [user]);

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

    setImageLoading(true);

    const formData = new FormData();
    formData.append('workshopImage', file);

    try {
      const response = await axiosClient.post(UPLOAD_WORKSHOP_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        await dispatch(fetchAuthUser());
        await dispatch(fetchAllWorkshops());
        toast.success(response?.data?.message || "Image uploaded successfully");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error?.response?.data?.message || "Failed to upload image");
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!user?.workshopImage) return;

    setImageLoading(true);

    try {
      const response = await axiosClient.delete(DELETE_USER_IMAGE, {
        withCredentials: true,
      });
      
      if (response.status === 200) {
        await dispatch(fetchAuthUser());
        await dispatch(fetchAllWorkshops());
        toast.success(response?.data?.message || "Image deleted successfully");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete image");
    } finally {
      setImageLoading(false);
    }
  };

  const handleAvatarClick = () => {
    if (user?.workshopImage) {
      if (hoverAvatar) {
        handleDeleteImage();
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleInputChange = (field, value) => {
    setWorkshopData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkingHoursChange = (day, field, value) => {
    setWorkshopData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: field === 'closed' ? !prev.workingHours[day].closed : value
        }
      }
    }));
  };

  const addNewService = () => {
    if (newService.trim()) {
      setWorkshopData(prev => ({
        ...prev,
        servicesOffered: [...prev.servicesOffered, newService.trim()]
      }));
      setNewService('');
    }
  };

  const removeService = (index) => {
    const updatedServices = workshopData.servicesOffered.filter((_, i) => i !== index);
    setWorkshopData(prev => ({
      ...prev,
      servicesOffered: updatedServices
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        workshopName: workshopData.name,
        phoneNumber: workshopData.phone,
        workshopAddress: workshopData.address,
        description: workshopData.description,
        workingHours: workshopData.workingHours,
        isOpen: workshopData.isOpen,
        servicesOffered: workshopData.servicesOffered
      };

      const response = await axiosClient.patch(UPDATE_WORKSHOP_PROFILE, updateData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        await dispatch(fetchAuthUser());
        await dispatch(fetchAllWorkshops());
        setIsEditing(false);
        toast.success(response?.data?.message || "Profile updated successfully");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeDisplay = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const getAvatarInitials = () => {
    if (!workshopData.name) return 'WS';
    return workshopData.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workshop Profile</h1>
          <p className="text-gray-600">Manage your workshop details and appearance</p>
        </div>
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)} 
            className="bg-orange-600 hover:bg-orange-700"
            disabled={isLoading || imageLoading}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <Button 
            onClick={handleSave} 
            className="bg-green-600 hover:bg-green-700"
            disabled={isLoading || imageLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      <Card className="border-gray-200 shadow-sm mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="mb-6">
                <div 
                  className="relative mb-2 cursor-pointer"
                  onMouseEnter={() => setHoverAvatar(true)}
                  onMouseLeave={() => setHoverAvatar(false)}
                  onClick={handleAvatarClick}
                >
                  {user?.workshopImage ? (
                    <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                      <img 
                        src={`${import.meta.env.VITE_SERVER_URL}/${user.workshopImage}`} 
                        alt={workshopData.name}
                        className="w-full h-full object-cover"
                      />
                      {hoverAvatar && !imageLoading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Trash2 className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-48 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                      {imageLoading ? (
                        <div className="h-12 w-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Camera className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-gray-600">Upload Workshop Image</p>
                          <p className="text-sm text-gray-500 mt-1">Click to upload</p>
                        </>
                      )}
                    </div>
                  )}
                  
                  {imageLoading && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <div className="h-12 w-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 text-center">
                  {user?.workshopImage ? 
                    (hoverAvatar ? 'Click to delete image' : 'Click on image to delete') : 
                    'Click to upload workshop image'
                  }
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-orange-100 text-orange-600">
                      {getAvatarInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-gray-900">{workshopData.name}</h3>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{workshopData.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                    <span className="text-sm line-clamp-2">{workshopData.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className={`h-2 w-2 rounded-full ${workshopData.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm">{workshopData?.isOpen? 'Open' : 'Closed'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg mb-6">
                  <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2">
                    General Info
                  </TabsTrigger>
                  <TabsTrigger value="hours" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2">
                    Working Hours
                  </TabsTrigger>
                  <TabsTrigger value="services" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2">
                    Services
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Workshop Name</Label>
                        <Input
                          id="name"
                          value={workshopData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-gray-50' : ''}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <Input
                            id="phone"
                            value={workshopData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            disabled={!isEditing}
                            className={!isEditing ? 'bg-gray-50' : ''}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <Input
                          id="email"
                          value={workshopData.email}
                          disabled={true}
                          className="bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-2" />
                        <Textarea
                          id="address"
                          value={workshopData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-gray-50' : ''}
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={workshopData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                        rows={5}
                        placeholder="Describe your workshop services, expertise, and what makes you unique..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="isOpen">Workshop Status</Label>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="open"
                            name="status"
                            checked={workshopData.isOpen}
                            onChange={() => handleInputChange('isOpen', true)}
                            disabled={!isEditing}
                            className="h-4 w-4 text-orange-600"
                          />
                          <Label htmlFor="open" className="cursor-pointer">Open</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="closed"
                            name="status"
                            checked={!workshopData.isOpen}
                            onChange={() => handleInputChange('isOpen', false)}
                            disabled={!isEditing}
                            className="h-4 w-4 text-orange-600"
                          />
                          <Label htmlFor="closed" className="cursor-pointer">Closed</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="hours">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {days.map((day) => (
                        <div key={day.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={!workshopData.workingHours[day.key]?.closed}
                              onChange={() => handleWorkingHoursChange(day.key, 'closed', null)}
                              disabled={!isEditing}
                              className="h-4 w-4 text-orange-600"
                            />
                            <span className="font-medium">{day.label}</span>
                          </div>
                          
                          {workshopData.workingHours[day.key]?.closed ? (
                            <span className="text-red-600 font-medium">Closed</span>
                          ) : isEditing ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="time"
                                value={workshopData.workingHours[day.key]?.from || '09:00'}
                                onChange={(e) => handleWorkingHoursChange(day.key, 'from', e.target.value)}
                                className="w-28"
                              />
                              <span>to</span>
                              <Input
                                type="time"
                                value={workshopData.workingHours[day.key]?.to || '19:00'}
                                onChange={(e) => handleWorkingHoursChange(day.key, 'to', e.target.value)}
                                className="w-28"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>
                                {formatTimeDisplay(workshopData.workingHours[day.key]?.from)} to {formatTimeDisplay(workshopData.workingHours[day.key]?.to)}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="services">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {workshopData.servicesOffered.map((service, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          {isEditing ? (
                            <div className="space-y-3">
                              <Input
                                value={service}
                                onChange={(e) => {
                                  const updatedServices = [...workshopData.servicesOffered];
                                  updatedServices[index] = e.target.value;
                                  handleInputChange('servicesOffered', updatedServices);
                                }}
                                placeholder="Service Name"
                              />
                              <Button
                                onClick={() => removeService(index)}
                                variant="outline"
                                className="w-full border-red-600 text-red-600 hover:bg-red-50"
                              >
                                Remove Service
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <h4 className="font-bold text-gray-900 mb-1">{service}</h4>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {isEditing && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Add New Service</h3>
                        <div className="flex gap-4 mb-4">
                          <Input
                            value={newService}
                            onChange={(e) => setNewService(e.target.value)}
                            placeholder="e.g., Wheel Alignment"
                            className="flex-1"
                          />
                          <Button
                            onClick={addNewService}
                            className="bg-orange-600 hover:bg-orange-700"
                            disabled={!newService.trim()}
                          >
                            Add Service
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkshopDetails;