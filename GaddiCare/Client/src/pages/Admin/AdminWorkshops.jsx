import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkshopDetailsDialog from "@/components/WorkshopDetailsDialog";
import { TOGGLE_ACCOUNT_STATUS } from "@/routes/serverEndpoints";
import axiosClient from "@/services/axiosMain";
import { fetchAllWorkshops } from "@/store/slice/getAllWorkshops";
import { Ban, CheckCircle, ChevronLeft, ChevronRight, Eye, Loader2, Mail, MapPin, Phone, Search, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const AdminWorkshops = () => {
  const dispatch = useDispatch();
  const { allWorkshops, loading: allWorkshopsLoading } = useSelector((state) => state.allWorkshops);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);
  const itemsPerPage = 6;
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const workshopsArray = Array.isArray(allWorkshops) ? allWorkshops : [];


  const handleViewDetails = (workshop) => {
    setSelectedWorkshop(workshop);
    setDialogOpen(true);
  };

  const handleToggleBan = async (workshopId, userType) => {
    setActionLoading(workshopId);
    try {
      const response = await axiosClient.patch(
        `${TOGGLE_ACCOUNT_STATUS}`,
        { id: workshopId, type: userType },
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        const newStatus = response.data.status;
        toast.success(response?.data?.message || `Workshop ${newStatus ? "activated" : "banned"} successfully`);
        dispatch(fetchAllWorkshops());
      }
    } catch (error) {
      console.error("Error toggling workshop status:", error);
      toast.error(error?.response?.data?.message || "Failed to update workshop status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
  };


  const filteredWorkshops = useMemo(() => {
    if (!workshopsArray || workshopsArray.length === 0) return [];
    
    let filtered = workshopsArray;
    

    if (activeTab === "active") {
      filtered = filtered.filter(workshop => workshop.isActive === true);
    } else if (activeTab === "banned") {
      filtered = filtered.filter(workshop => workshop.isActive === false);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(workshop => {
        if (!workshop || typeof workshop !== 'object') return false;
        
        return (
          (workshop.workshopName?.toLowerCase().includes(query) || false) ||
          (workshop.email?.toLowerCase().includes(query) || false) ||
          (workshop.isLicenseNumber?.toLowerCase().includes(query) || false) ||
          (workshop.workshopAddress?.toLowerCase().includes(query) || false)
        );
      });
    }
    
    return filtered;
  }, [workshopsArray, activeTab, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWorkshops.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredWorkshops.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const parseServices = (services) => {
    if (!services || !Array.isArray(services) || services.length === 0) return [];
    try {
      if (typeof services[0] === 'string') {
        return JSON.parse(services[0]);
      }
      return services;
    } catch (error) {
      return Array.isArray(services) ? services : [];
    }
  };

  const activeCount = workshopsArray.filter(w => w.isActive === true).length;
  const bannedCount = workshopsArray.filter(w => w.isActive === false).length;
  const allCount = workshopsArray.length;

  return (
    <main className="flex-1 bg-gray-50 ml-64">
      <div className="p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, Admin</p>
            </div>
            <Badge className="bg-blue-500 text-white">
              {filteredWorkshops.length} {activeTab === "all" ? "Total" : activeTab === "active" ? "Active" : "Banned"} Workshops
            </Badge>
          </div>
        </div>

        <Card className="border-gray-200 shadow-sm mb-6">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-xl text-gray-900">All Workshops</CardTitle>
              <div className="flex gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search workshops..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 text-sm"
                  />
                </div>
                {searchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-[400px]">
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  All ({allCount})
                </TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                  Active ({activeCount})
                </TabsTrigger>
                <TabsTrigger value="banned" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Banned ({bannedCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            {allWorkshopsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading workshops...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 text-sm">
                        <th className="text-left p-4 font-semibold">WORKSHOP NAME</th>
                        <th className="text-left p-4 font-semibold">CONTACT INFO</th>
                        <th className="text-left p-4 font-semibold">LOCATION</th>
                        <th className="text-left p-4 font-semibold">SERVICES</th>
                        <th className="text-left p-4 font-semibold">STATUS</th>
                        <th className="text-left p-4 font-semibold">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((workshop) => {
                          if (!workshop || typeof workshop !== 'object') return null;
                          
                          const services = parseServices(workshop.servicesOffered);
                          const isBanned = workshop.isActive === false;
                          const isVerified = workshop.accountVerified === true;
                          
                          return (
                            <tr key={workshop.workshopId} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="p-4">
                                <div>
                                  <p className="font-semibold text-gray-900">{workshop.workshopName || "N/A"}</p>
                                  <p className="text-sm text-gray-500 mt-1">{workshop.isLicenseNumber || "No license"}</p>
                                </div>
                              </td>
                              <td className="p-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
                                    <Mail className="h-3 w-3" />
                                    <span>{workshop.email || "No email"}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="h-3 w-3" />
                                    <span>{workshop.phoneNumber || "No phone"}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">{workshop.workshopAddress || "No address"}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-wrap gap-1">
                                  {Array.isArray(services) && services.length > 0 ? (
                                    <>
                                      {services.slice(0, 3).map((service, index) => (
                                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                          {service}
                                        </span>
                                      ))}
                                      {services.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                          +{services.length - 3}
                                        </span>
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-xs text-gray-500">No services listed</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col gap-1">
                                  {isVerified ? (
                                    <Badge className="bg-green-100 text-green-800 border-green-200">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Verified
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                                      <XCircle className="h-3 w-3 mr-1" />
                                      Unverified
                                    </Badge>
                                  )}
                                  {isBanned ? (
                                    <Badge className="bg-red-100 text-red-800 border-red-200 mt-1">
                                      <Ban className="h-3 w-3 mr-1" />
                                      Banned
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-green-100 text-green-800 border-green-200 mt-1">
                                      Active
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1"
                                    onClick={() => handleViewDetails(workshop)}
                                    disabled={actionLoading === workshop.workshopId}
                                  >
                                    <Eye className="h-3 w-3" />
                                    Details
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={isBanned ? "default" : "destructive"}
                                    className={isBanned ? "bg-green-600 hover:bg-green-700 gap-1" : "gap-1"}
                                    onClick={() => handleToggleBan(workshop.workshopId, "workshop")}
                                    disabled={actionLoading === workshop.workshopId}
                                  >
                                    {actionLoading === workshop.workshopId ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : isBanned ? (
                                      <>
                                        <CheckCircle className="h-3 w-3" />
                                        Unban
                                      </>
                                    ) : (
                                      <>
                                        <Ban className="h-3 w-3" />
                                        Ban
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        }).filter(Boolean)
                      ) : (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-gray-500">
                            {workshopsArray.length === 0 
                              ? "No workshops available." 
                              : `No ${activeTab} workshops match your search criteria.`}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {filteredWorkshops.length > 0 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredWorkshops.length)} of {filteredWorkshops.length} workshops
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {dialogOpen && selectedWorkshop && (
          <WorkshopDetailsDialog
            workshop={selectedWorkshop}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
          />
        )}
      </div>
    </main>
  );
};

export default AdminWorkshops;