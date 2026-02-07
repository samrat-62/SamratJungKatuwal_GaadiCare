import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Car, 
  Shield, 
  Users, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Award, 
  Wrench, 
  CheckCircle,
  ArrowRight,
  Heart,
  Briefcase
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const About = () => {
  const navigate = useNavigate();
  const { users } = useSelector(state => state.allUsers);
  const { bookings } = useSelector(state => state.allBookings);
  const { allWorkshops } = useSelector(state => state.allWorkshops);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  const stats = [
    { 
      label: "Happy Customers", 
      value: `${users?.length || 100}+`, 
      icon: Users 
    },
    { 
      label: "Services Completed", 
      value: `${bookings?.filter(b => b.status === 'completed')?.length || 5000}+`, 
      icon: Wrench 
    },
    { 
      label: "Workshops Registered", 
      value: `${allWorkshops?.length || 100}+`, 
      icon: Briefcase 
    },
    { 
      label: "Active Bookings", 
      value: `${bookings?.filter(b => b.status === 'in-progress')?.length || 200}+`, 
      icon: Clock 
    }
  ];

  const values = [
    {
      title: "Trust & Reliability",
      description: "Every workshop on our platform is verified and trusted. We ensure quality service for every customer.",
      icon: Shield,
      color: "bg-orange-100 text-orange-600"
    },
    {
      title: "Customer First",
      description: "Your satisfaction is our priority. We're committed to providing the best automotive care experience.",
      icon: Heart,
      color: "bg-red-100 text-red-600"
    },
    {
      title: "Quality Service",
      description: "Partnering with certified workshops to deliver top-notch automotive repair and maintenance services.",
      icon: Award,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Transparent Pricing",
      description: "No hidden costs. Get clear estimates and fair pricing for all your vehicle services.",
      icon: CheckCircle,
      color: "bg-green-100 text-green-600"
    }
  ];

  const handleBookService = () => {
    navigate("/workshop");
  };

  const handleFindWorkshops = () => {
    navigate("/workshop");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10" />
        <div className="max-w-7xl mx-auto px-4 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-6 bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200">
              <Car className="h-4 w-4 mr-2" />
              Your Trusted Auto Care Partner
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Driving <span className="text-orange-600">Excellence</span> in<br />
              Automotive Care
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              GaddiCare connects you with trusted workshops, making vehicle maintenance 
              simple, transparent, and reliable. We're revolutionizing how India takes care of its vehicles.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={handleBookService}
                className="bg-orange-600 hover:bg-orange-700 px-8 py-6 text-lg"
              >
                Book Service Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={handleFindWorkshops}
                variant="outline" 
                className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-6 text-lg"
              >
                Find Workshops
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                  <stat.icon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-200">
                Our Journey
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                The Story Behind <span className="text-orange-600">GaddiCare</span>
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2023, GaddiCare emerged from a simple observation: finding reliable 
                  auto repair services was unnecessarily complicated. Car owners struggled with 
                  trust issues, price transparency, and service quality consistency.
                </p>
                <p>
                  Our founder, Rajesh Sharma, experienced firsthand the frustration of dealing 
                  with unreliable mechanics. This sparked the vision for GaddiCare - a platform 
                  that brings transparency, trust, and convenience to automotive care.
                </p>
                <p>
                  Today, we're proud to be India's fastest-growing auto care platform, connecting 
                  thousands of vehicle owners with certified workshops across the country.
                </p>
              </div>
            </div>
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 h-full">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <Car className="h-16 w-16 text-white mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                  <p className="text-white/90">
                    To simplify vehicle maintenance by creating a trusted network of workshops 
                    and providing transparent, reliable, and convenient auto care solutions 
                    for every vehicle owner in India.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-200">
              Why Choose Us
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Core <span className="text-orange-600">Values</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at GaddiCare
            </p>
          </div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
              >
                <Card className="border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-8">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${value.color} mb-6`}>
                      <value.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Experience Better Auto Care?
            </h2>
            <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust GaddiCare for their vehicle maintenance needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleBookService}
                className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-6 text-lg font-semibold"
              >
                <Phone className="mr-3 h-5 w-5" />
                Book Service Now
              </Button>
              <Button 
                variant="outline" 
                onClick={handleFindWorkshops}
                className="border-white text-orange-600 hover:bg-white/10 px-8 py-6 text-lg font-semibold"
              >
                <MapPin className="mr-3 h-5 w-5" />
                Find Workshops
              </Button>
            </div>
            <div className="mt-12 pt-8 border-t border-orange-500">
              <div className="flex flex-wrap justify-center gap-8">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-white" />
                  <span className="text-white">100% Verified Workshops</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-white" />
                  <span className="text-white">24/7 Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-6 w-6 text-white" />
                  <span className="text-white">Customer Reviews</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-200">
              Get In Touch
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Contact <span className="text-orange-600">Information</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're here to help you with all your automotive care needs
            </p>
          </div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <Card className="border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-6">
                    <Phone className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Phone Support</h3>
                  <p className="text-gray-600 mb-4">Available 24/7 for all your queries</p>
                  <p className="text-orange-600 font-semibold text-lg">98 00 00 00 00</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <Card className="border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-6">
                    <Mail className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Email Support</h3>
                  <p className="text-gray-600 mb-4">Get quick responses to your questions</p>
                  <p className="text-orange-600 font-semibold text-lg">support@gaddicare.com</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <Card className="border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-6">
                    <MapPin className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Headquarters</h3>
                  <p className="text-gray-600 mb-4">Our main office location</p>
                  <p className="text-orange-600 font-semibold text-lg">Itahari, Nepal</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;