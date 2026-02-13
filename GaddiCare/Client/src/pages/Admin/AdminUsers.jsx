import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserDetailsDialog from "@/components/UserDetailsDialog";
import { TOGGLE_ACCOUNT_STATUS } from "@/routes/serverEndpoints";
import axiosClient from "@/services/axiosMain";
import { fetchAllUsers } from "@/store/slice/getAllUsers";
import { Ban, CheckCircle, ChevronLeft, ChevronRight, Eye, Loader2, Mail, Phone, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import moment from "moment";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, loading: usersLoading } = useSelector((state) => state.allUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);
  const itemsPerPage = 6;
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);


  const vehicleOwnersArray = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users.filter(user => user.userType === "vehicleOwner");
  }, [users]);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleToggleBan = async (userId, userType) => {
    setActionLoading(userId);
    try {
      const response = await axiosClient.patch(
        `${TOGGLE_ACCOUNT_STATUS}`,
        {id: userId, type: userType},
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        const newStatus = response.data.status;
        toast.success(response?.data?.message || `User ${newStatus ? "activated" : "banned"} successfully`);
        dispatch(fetchAllUsers());
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error(error?.response?.data?.message || "Failed to update user status");
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

  const filteredUsers = useMemo(() => {
    if (!vehicleOwnersArray || vehicleOwnersArray.length === 0) return [];
    
    let filtered = vehicleOwnersArray;
    
    if (activeTab === "active") {
      filtered = filtered.filter(user => user.isActive === true);
    } else if (activeTab === "banned") {
      filtered = filtered.filter(user => user.isActive === false);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => {
        if (!user || typeof user !== 'object') return false;
        
        return (
          (user.userName?.toLowerCase().includes(query) || false) ||
          (user.email?.toLowerCase().includes(query) || false) ||
          (user.phoneNumber?.toLowerCase().includes(query) || false)
        );
      });
    }
    
    return filtered;
  }, [vehicleOwnersArray, activeTab, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

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

  // Count vehicle owners by status
  const activeCount = vehicleOwnersArray.filter(u => u.isActive === true).length;
  const bannedCount = vehicleOwnersArray.filter(u => u.isActive === false).length;
  const allCount = vehicleOwnersArray.length;

  return (
    <main className="flex-1 bg-gray-50 ml-64">
      <div className="p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, Admin</p>
            </div>
            <Badge className="bg-purple-500 text-white">
              {filteredUsers.length} {activeTab === "all" ? "Total" : activeTab === "active" ? "Active" : "Banned"} Vehicle Owners
            </Badge>
          </div>
        </div>

        <Card className="border-gray-200 shadow-sm mb-6">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-xl text-gray-900">Vehicle Owners</CardTitle>
              <div className="flex gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search vehicle owners..."
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
                <TabsTrigger value="all" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
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
            {usersLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading vehicle owners...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 text-sm">
                        <th className="text-left p-4 font-semibold">USER NAME</th>
                        <th className="text-left p-4 font-semibold">CONTACT INFO</th>
                        <th className="text-left p-4 font-semibold">JOINED DATE</th>
                        <th className="text-left p-4 font-semibold">STATUS</th>
                        <th className="text-left p-4 font-semibold">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((user) => {
                          if (!user || typeof user !== 'object') return null;
                          
                          const isBanned = user.isActive === false;
                          
                          return (
                            <tr key={user.userId || user._id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="p-4">
                                <div>
                                  <p className="font-semibold text-gray-900">{user.userName || user.name || "N/A"}</p>
                                  <p className="text-sm text-gray-500 mt-1">ID: {user.userId?.substring(0, 8) || "N/A"}</p>
                                </div>
                              </td>
                              <td className="p-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
                                    <Mail className="h-3 w-3" />
                                    <span>{user.email || "No email"}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="h-3 w-3" />
                                    <span>{user.phoneNumber || "No phone"}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div>
                                  <p className="text-gray-700">
                                    {user.createdAt ? moment(user.createdAt).format("MMMM D, YYYY") : "Unknown"}
                                  </p>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col gap-1">
                                  {isBanned ? (
                                    <Badge className="bg-red-100 text-red-800 border-red-200 mt-1">
                                      <Ban className="h-3 w-3 mr-1" />
                                      Banned
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-green-100 text-green-800 border-green-200 mt-1">
                                      <CheckCircle className="h-3 w-3 mr-1" />
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
                                    onClick={() => handleViewDetails(user)}
                                    disabled={actionLoading === (user.userId || user._id)}
                                  >
                                    <Eye className="h-3 w-3" />
                                    Details
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={isBanned ? "default" : "destructive"}
                                    className={isBanned ? "bg-green-600 hover:bg-green-700 gap-1" : "gap-1"}
                                    onClick={() => handleToggleBan(user.userId || user.userId, user.userType)}
                                    disabled={actionLoading === (user.userId || user._id)}
                                  >
                                    {actionLoading === (user.userId || user._id) ? (
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
                          <td colSpan="5" className="p-8 text-center text-gray-500">
                            {vehicleOwnersArray.length === 0 
                              ? "No vehicle owners available." 
                              : `No ${activeTab} vehicle owners match your search criteria.`}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {filteredUsers.length > 0 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} vehicle owners
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

        {dialogOpen && selectedUser && (
          <UserDetailsDialog
            user={selectedUser}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
          />
        )}
      </div>
    </main>
  );
};

export default AdminUsers;