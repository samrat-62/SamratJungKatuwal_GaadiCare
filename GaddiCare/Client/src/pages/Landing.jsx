import { motion } from "framer-motion";
import { Search, Shield, Clock, Star, MapPin, Car, Map, Bell, CheckCircle, Wrench, Calendar, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const Landing = () => {
  const [user] = useState(false);
  const navigate = useNavigate();
  
  const stats = [
    { number: "15K+", label: "Active Users", icon: <Shield className="text-orange-500" size={24} /> },
    { number: "2.5K+", label: "Verified Workshops", icon: <Car className="text-emerald-500" size={24} /> },
    { number: "500+", label: "Daily Bookings", icon: <Clock className="text-amber-500" size={24} /> },
    { number: "98%", label: "Satisfaction Rate", icon: <Star className="text-rose-500" size={24} /> },
  ];

  const features = [
    { 
      icon: <Map className="text-orange-600" size={28} />, 
      title: "Smart Workshop Finder", 
      description: "Find verified workshops near you with our intelligent map-based search and distance filters.",
      point: "Real-time Location"
    },
    { 
      icon: <Bell className="text-emerald-600" size={28} />, 
      title: "Live Service Tracking", 
      description: "Track your vehicle repair status in real-time from booking to completion with instant updates.",
      point: "Instant Updates"
    },
    { 
      icon: <CheckCircle className="text-sky-600" size={28} />, 
      title: "Verified Workshops Only", 
      description: "All workshops undergo strict verification process to ensure quality service and reliability.",
      point: "Quality Assured"
    },
  ];

  const steps = [
    { number: "01", title: "Find Workshop", description: "Use our map to locate verified workshops near your location with distance filters.", icon: <MapPin className="text-orange-600" size={24} /> },
    { number: "02", title: "Book Service", description: "Select your vehicle, choose service type, and book an appointment at your convenience.", icon: <Calendar className="text-orange-600" size={24} /> },
    { number: "03", title: "Track Progress", description: "Monitor your vehicle service status in real-time with live updates and notifications.", icon: <TrendingUp className="text-orange-600" size={24} /> },
    { number: "04", title: "Complete & Review", description: "Receive your vehicle, make payment, and share your experience with the community.", icon: <Wrench className="text-orange-600" size={24} /> },
  ];

  const handleFindWorkshop = () => {
    navigate("/workshop");
  };

  const handleCreateAccount = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen">
      <div 
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/image/bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-900/40"></div>
        
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
            <div className="max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
              >
                Your Vehicle's Complete Care Partner
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-200 mb-10 leading-relaxed"
              >
                Find verified workshops, track services, and manage your vehicle maintenance—all in one place. Experience hassle-free vehicle care with GaddiCare.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button 
                  onClick={handleFindWorkshop}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <Search size={22} />
                  Find Workshop Near You
                </button>
                {!user && (
                  <button 
                    onClick={handleCreateAccount}
                    className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105"
                  >
                    <Users size={22} />
                    Create Account
                  </button>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose GaddiCare?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of vehicle maintenance with our comprehensive platform designed for your convenience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-orange-50">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="font-medium text-gray-800">{feature.point}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-orange-50 rounded-3xl p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Get started with GaddiCare in four simple steps and experience seamless vehicle care.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-orange-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">{step.number}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        {step.icon}
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-600 to-amber-600 py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/90 mb-10"
          >
            Join thousands of satisfied users and experience hassle-free vehicle maintenance today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={handleFindWorkshop}
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <Search size={22} />
              Find Workshop Now
            </button>
            {!user && (
              <button 
                onClick={handleCreateAccount}
                className="bg-transparent border-2 border-white hover:bg-white hover:text-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105"
              >
                <Users size={22} />
                Create Account
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;