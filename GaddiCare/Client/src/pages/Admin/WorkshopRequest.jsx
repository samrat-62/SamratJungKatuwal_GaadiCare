import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, CheckCircle, XCircle, MapPin, Mail, Phone, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axiosClient from "@/services/axiosMain";
import WorkshopDetailsDialog from "@/components/WorkshopDetailsDialog";
import { UPDATE_WORKSHOP_STATUS } from "@/routes/serverEndpoints";
import { useSelector, useDispatch } from "react-redux";
import { fetchPendingWorkshops } from "@/store/slice/getAllWorkshopRequest";
import { fetchAllWorkshops } from "@/store/slice/getAllWorkshops";

const WorkshopRequests = () => {
  const dispatch = useDispatch();
  const { pendingWorkshops, loading: pendingWorkshopsLoading } = useSelector((state) => state.pendingWorkshops);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  const itemsPerPage = 6;
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const workshopsArray = Array.isArray(pendingWorkshops) ? pendingWorkshops : [];

  const handleViewDetails = (workshop) => {
    setSelectedWorkshop(workshop);
    setDialogOpen(true);
  };

  const handleApprove = async (workshopId, status) => {
    setActionLoading(workshopId);
    try {
      const response = await axiosClient.patch(`${UPDATE_WORKSHOP_STATUS}/${workshopId}`, { status }, { withCredentials: true });
      if (response.status === 200) {
        toast.success(response?.data?.message || `Workshop ${status} successfully`);
        await dispatch(fetchPendingWorkshops());
        await dispatch(fetchAllWorkshops());
      }
    } catch (error) {
      console.error("Error updating workshop status:", error);
      toast.error(error?.response?.data?.message || `Failed to ${status} workshop`);
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
    
    if (!searchQuery) return workshopsArray;
    
    const query = searchQuery.toLowerCase();
    return workshopsArray.filter(workshop => {
      if (!workshop || typeof workshop !== 'object') return false;
      
      return (
        (workshop.workshopName?.toLowerCase().includes(query) || false) ||
        (workshop.email?.toLowerCase().includes(query) || false) ||
        (workshop.isLicenseNumber?.toLowerCase().includes(query) || false) ||
        (workshop.workshopAddress?.toLowerCase().includes(query) || false)
      );
    });
  }, [workshopsArray, searchQuery]);

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

  return (
    <main className="flex-1 bg-gray-50 ml-64">
      <div className="p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, Admin</p>
            </div>
            <Badge className="bg-orange-500 text-white">
              {filteredWorkshops.length} Pending Approvals
            </Badge>
          </div>
        </div>

        <Card className="border-gray-200 shadow-sm mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-gray-900">Pending Workshop Approvals</CardTitle>
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
          </CardHeader>
          <CardContent>
            {pendingWorkshopsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading workshop requests...</p>
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
                        <th className="text-left p-4 font-semibold">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((workshop) => {
                          if (!workshop || typeof workshop !== 'object') return null;
                          
                          const services = parseServices(workshop.servicesOffered);
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
                                    className="bg-green-600 hover:bg-green-700 gap-1"
                                    onClick={() => handleApprove(workshop.workshopId, "accepted")}
                                    disabled={actionLoading === workshop.workshopId}
                                  >
                                    {actionLoading === workshop.workshopId ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <CheckCircle className="h-3 w-3" />
                                    )}
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="gap-1"
                                    onClick={() => handleApprove(workshop.workshopId, "rejected")}
                                    disabled={actionLoading === workshop.workshopId}
                                  >
                                    {actionLoading === workshop.workshopId ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <XCircle className="h-3 w-3" />
                                    )}
                                    Reject
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        }).filter(Boolean) 
                      ) : (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-gray-500">
                            {workshopsArray.length === 0 
                              ? "No pending workshop requests available." 
                              : "No workshops match your search criteria."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {filteredWorkshops.length > 0 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredWorkshops.length)} of {filteredWorkshops.length} requests
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

export default WorkshopRequests;