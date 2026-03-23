import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaRocket, 
  FaBrain, 
  FaUniversity, 
  FaChartLine, 
  FaShieldAlt, 
  FaBell, 
  FaGraduationCap, 
  FaLaptopCode,
  FaArrowRight,
  FaCheckCircle
} from 'react-icons/fa';
import { MdAnalytics, MdOutlineQuiz } from 'react-icons/md';
import { GiStarsStack } from 'react-icons/gi';

const App = () => {
  // Animation variants for fade-up effect
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const featureCardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
    hover: { y: -8, transition: { duration: 0.3 }, boxShadow: "0 20px 25px -12px rgba(0,0,0,0.2)" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 md:px-8">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, -45, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <GiStarsStack className="text-indigo-600" />
                <span>AI-Powered Guidance for Future Leaders</span>
              </motion.div>
              <motion.h1 
                variants={fadeUp}
                className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700"
              >
                Your Path to Success Starts Here
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-gray-600 mb-8 leading-relaxed">
                One-Stop Personalized Career & Education Advisor — Empowering Class 10 & 12 students with AI-driven insights, aptitude tests, and real-time guidance to shape your dream future.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started <FaArrowRight />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50 px-8 py-3 rounded-full font-semibold transition-all"
                >
                  Take Aptitude Test
                </motion.button>
              </motion.div>
              <motion.div variants={fadeUp} className="flex items-center gap-6 mt-8">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-indigo-200 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-800">
                      👤
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500"><span className="font-bold text-indigo-600">10,000+</span> students guided already</p>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Students learning"
                  className="w-full h-auto object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/30 to-transparent rounded-2xl"></div>
              </div>
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3"
              >
                <FaBrain className="text-indigo-500 text-2xl" />
                <div>
                  <p className="text-xs text-gray-500">AI Recommendation</p>
                  <p className="font-semibold text-sm">98% Match to Careers</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Everything You Need to Succeed</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-600 max-w-2xl mx-auto">Personalized tools and insights to help you make confident decisions about your academic and professional future.</motion.p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <MdOutlineQuiz className="text-3xl" />, title: "Aptitude-Based Tests", desc: "Discover your strengths with scientifically designed psychometric and skill assessments.", color: "from-cyan-500 to-blue-500" },
              { icon: <FaBrain className="text-3xl" />, title: "AI-Driven Recommendations", desc: "Get personalized subject streams, career paths, and college suggestions powered by AI.", color: "from-purple-500 to-indigo-500" },
              { icon: <FaUniversity className="text-3xl" />, title: "College & Scholarship Info", desc: "Access reliable data on government colleges, entrance exams, and scholarships.", color: "from-emerald-500 to-teal-500" },
              { icon: <FaShieldAlt className="text-3xl" />, title: "Verified Access", desc: "Secure SMS authentication ensures only verified users access personalized data.", color: "from-orange-500 to-amber-500" },
              { icon: <FaBell className="text-3xl" />, title: "Real-Time Updates", desc: "Stay informed about results, admissions, and deadlines with instant alerts.", color: "from-pink-500 to-rose-500" },
              { icon: <FaChartLine className="text-3xl" />, title: "Progress Tracking", desc: "Monitor your journey with smart reminders and achievement milestones.", color: "from-violet-500 to-purple-500" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={featureCardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover="hover"
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 shadow-md`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats & Impact Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10K+", label: "Active Students", icon: <FaGraduationCap /> },
              { value: "500+", label: "Partner Colleges", icon: <FaUniversity /> },
              { value: "98%", label: "Satisfaction Rate", icon: <FaCheckCircle /> },
              { value: "24/7", label: "AI Support", icon: <FaLaptopCode /> },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="backdrop-blur-sm bg-white/10 rounded-2xl p-6"
              >
                <div className="text-4xl mb-3 flex justify-center">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                <div className="text-indigo-100 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl p-10 md:p-16 border border-gray-100"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Ready to Shape Your Future?</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">Join thousands of students who have found their path with our intelligent guidance system.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg"
              >
                Create Free Account <FaArrowRight />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full font-semibold"
              >
                Learn More
              </motion.button>
            </div>
            <p className="text-sm text-gray-400 mt-6">No credit card required • Free for students</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default App;