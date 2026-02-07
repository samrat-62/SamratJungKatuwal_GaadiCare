import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Star, TrendingDown, TrendingUp, Users, Wrench } from "lucide-react";
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

const DashboardWorkshop = () => {
  const { data:user } = useSelector((state) => state.userData);
  const { bookings } = useSelector((state) => state.allBookings);
  const { reviews } = useSelector((state) => state.allReviews);
  
  const [workshopStats, setWorkshopStats] = useState({
    totalClients: 0,
    totalServices: 0,
    completedServices: 0,
    averageRating: 0,
    reviewsCount: 0,
    pendingRequests: 0,
    inProgress: 0
  });
  
  const [recentServices, setRecentServices] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [yearlyComparison, setYearlyComparison] = useState({
    currentYearServices: 0,
    previousYearServices: 0
  });

  useEffect(() => {
    if (!user || !bookings) return;

    const calculateStats = () => {
      const workshopBookings = bookings.filter(booking => booking.workshopId === user._id);
      const workshopReviews = reviews.filter(review => review.workshopId?._id === user._id);
      
      const uniqueClients = [...new Set(workshopBookings.map(booking => booking.userId))].length;
      
      const pendingCount = workshopBookings.filter(booking => booking.status === "pending").length;
      const inProgressCount = workshopBookings.filter(booking => booking.status === "in-progress").length;
      const completedCount = workshopBookings.filter(booking => booking.status === "completed").length;
      
      const averageRating = workshopReviews.length > 0 
        ? (workshopReviews.reduce((sum, review) => sum + review.rating, 0) / workshopReviews.length).toFixed(1)
        : "0.0";
      
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentYearBookings = workshopBookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate.getFullYear() === currentYear;
      });
      
      const previousYearBookings = workshopBookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate.getFullYear() === currentYear - 1;
      });
      
      const recentServicesData = workshopBookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(booking => ({
          id: booking._id,
          clientName: booking.userName,
          serviceType: booking.services.join(", "),
          status: booking.status,
          date: new Date(booking.createdAt).toLocaleDateString(),
          time: new Date(booking.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }));
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const serviceChartData = [];
      
      for (let month = 0; month < 12; month++) {
        const monthServices = currentYearBookings.filter(booking => {
          const bookingDate = new Date(booking.createdAt);
          return bookingDate.getMonth() === month;
        }).length;
        
        serviceChartData.push({
          name: months[month],
          month: month + 1,
          services: monthServices,
          total: monthServices
        });
      }

      const currentYearServices = currentYearBookings.length;
      const previousYearServices = previousYearBookings.length;

      setRecentServices(recentServicesData);
      setServiceData(serviceChartData);
      
      setYearlyComparison({
        currentYearServices,
        previousYearServices
      });

      setWorkshopStats({
        totalClients: uniqueClients,
        totalServices: workshopBookings.length,
        completedServices: completedCount,
        averageRating,
        reviewsCount: workshopReviews.length,
        pendingRequests: pendingCount,
        inProgress: inProgressCount
      });
    };

    calculateStats();
  }, [user, bookings, reviews]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'accepted': { color: 'bg-blue-100 text-blue-800', label: 'Accepted' },
      'in-progress': { color: 'bg-purple-100 text-purple-800', label: 'In Progress' },
      'completed': { color: 'bg-green-100 text-green-800', label: 'Completed' },
      'cancelled': { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const serviceGrowth = calculateGrowth(yearlyComparison.currentYearServices, yearlyComparison.previousYearServices);

  const getCurrentMonthName = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    return monthNames[currentDate.getMonth()];
  };

  const currentMonthName = getCurrentMonthName();

  const stats = [
    {
      title: "Total Clients",
      value: workshopStats.totalClients.toString(),
      change: "Clients served",
      icon: <Users className="h-6 w-6" />,
      color: "bg-orange-100 text-orange-700"
    },
    {
      title: "Total Bookings",
      value: workshopStats.totalServices.toString(),
      change: "All time bookings",
      icon: <Wrench className="h-6 w-6" />,
      color: "bg-orange-100 text-orange-700"
    },
    {
      title: "Completed Services",
      value: workshopStats.completedServices.toString(),
      change: "Successfully completed",
      icon: <CheckCircle className="h-6 w-6" />,
      color: "bg-orange-100 text-orange-700"
    },
    {
      title: "Average Rating",
      value: workshopStats.averageRating.toString(),
      change: `${workshopStats.reviewsCount} reviews`,
      icon: <Star className="h-6 w-6" />,
      color: "bg-orange-100 text-orange-700"
    }
  ];

  const ServiceTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = monthNames.indexOf(label);
      
      const isFutureMonth = monthIndex > currentMonth;
      
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-semibold text-gray-900 mb-2">
            {label} {new Date().getFullYear()}
            {isFutureMonth && (
              <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Future Month</span>
            )}
          </p>
          <div className="space-y-1">
            <p className={`text-sm ${isFutureMonth ? 'text-gray-400' : 'text-orange-600'}`}>
              <span className="font-medium">Bookings:</span> {isFutureMonth ? '0 (Not yet)' : payload[0]?.value || 0}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const performanceStats = [
    {
      title: "Pending Requests",
      value: workshopStats.pendingRequests.toString(),
      color: "bg-yellow-50 border-yellow-200",
      textColor: "text-yellow-700"
    },
    {
      title: "In Progress",
      value: workshopStats.inProgress.toString(),
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-700"
    },
    {
      title: "Completed",
      value: workshopStats.completedServices.toString(),
      color: "bg-green-50 border-green-200",
      textColor: "text-green-700"
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-700 font-medium mt-1">{stat.title}</p>
                  <p className="text-sm text-gray-500 mt-2">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-gray-200 shadow-sm mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Year-to-Year Booking Performance ({new Date().getFullYear() - 1} vs {new Date().getFullYear()})
          </CardTitle>
          <p className="text-sm text-gray-500">
            Booking completion trend up to {currentMonthName} {new Date().getFullYear()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Booking Growth
                </h3>
                <div className={`flex items-center gap-1 ${parseFloat(serviceGrowth) >= 0 ? 'text-orange-600' : 'text-red-600'}`}>
                  {parseFloat(serviceGrowth) >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="font-medium">{serviceGrowth}%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">{new Date().getFullYear() - 1}</p>
                  <p className="text-2xl font-bold text-gray-900">{yearlyComparison.previousYearServices}</p>
                  <p className="text-xs text-gray-500 mt-1">Full Year Bookings</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">{new Date().getFullYear()}</p>
                  <p className="text-2xl font-bold text-gray-900">{yearlyComparison.currentYearServices}</p>
                  <p className="text-xs text-gray-500 mt-1">Jan - {currentMonthName} Bookings</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Recent Bookings</CardTitle>
            <p className="text-sm text-gray-500">Last 5 booking requests</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{service.clientName}</h4>
                      {getStatusBadge(service.status)}
                    </div>
                    <p className="text-sm text-gray-600">{service.serviceType}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{service.date} • {service.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-3">
                {performanceStats.map((stat, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${stat.color} ${stat.textColor}`}>
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="text-sm font-medium">{stat.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Booking Trend {new Date().getFullYear()}
            </CardTitle>
            <p className="text-sm text-gray-500">
              Monthly booking data (real data up to {currentMonthName})
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={serviceData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#666" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    stroke="#666" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip content={<ServiceTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    iconType="circle"
                    iconSize={8}
                  />
                  <Area
                    type="monotone"
                    dataKey="services"
                    name="Bookings Completed"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.4}
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings (Jan - {currentMonthName})</p>
                  <p className="text-2xl font-bold text-gray-900">{yearlyComparison.currentYearServices}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${parseFloat(serviceGrowth) >= 0 ? 'text-orange-600' : 'text-red-600'}`}>
                    {parseFloat(serviceGrowth) >= 0 ? '+' : ''}{serviceGrowth}%
                  </p>
                  <p className="text-xs text-gray-500">vs same period last year</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DashboardWorkshop;