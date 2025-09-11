/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === '12345') {
      localStorage.setItem('token', 'dummy-token');
      navigate('/home');
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen w-full flex items-center justify-center bg-nsr-dark p-4"
    >
      <div className="relative w-full max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex w-full items-center bg-[#1B3C73]/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-nsr-primary/60"
        >
          {/* Left Side - Image */}
          <div className="hidden lg:flex lg:w-1/2 rounded-3xl ml-10 overflow-hidden flex-col items-center justify-center relative">
            <motion.div
             
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute inset-0"
            ></motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ 
                duration: 0.3,
                type: "spring",
                stiffness: 300
              }}
              className="relative z-10"
            >
              <motion.img 
                src="/logo-removebg.png" 
                alt="Login" 
                className="w-full h-full object-contain"
                animate={{ 
                  rotate: [0, 2, -2, 0],
                  y: [0, -5, 5, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>

          {/* Right Side - Login Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2 p-8 md:p-12 relative"
          >
            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                  animate={{ 
                    boxShadow: [
                      "0 0 0 rgba(236,183,116,0)",
                      "0 0 20px rgba(236,183,116,0.3)",
                      "0 0 0 rgba(236,183,116,0)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="p-3 bg-nsr-primary/10 rounded-xl backdrop-blur-xl border border-nsr-primary/20"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Sparkles className="h-6 w-6 text-nsr-primary" />
                  </motion.div>
                </motion.div>
                <div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-3xl font-bold text-nsr-primary"
                  >
                    Welcome to <span className="text-nsr-accent">NSR-PC</span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-nsr-neutral mt-2"
                  >
                    Sign in to your admin dashboard
                  </motion.p>
                </div>
              </div>

              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md"
                    >
                      <p className="text-sm text-red-700">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label htmlFor="username" className="block text-sm font-medium text-nsr-primary mb-2">
                    Username
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-nsr w-full px-4 py-3 rounded-xl border border-nsr-primary/20 focus:ring-2 focus:ring-nsr-accent focus:border-transparent transition-all bg-nsr-secondary/50 backdrop-blur-sm"
                    placeholder="Enter your username"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label htmlFor="password" className="block text-sm font-medium text-nsr-primary mb-2">
                    Password
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-nsr w-full px-4 py-3 rounded-xl border border-nsr-primary/20 focus:ring-2 focus:ring-nsr-accent focus:border-transparent transition-all bg-nsr-secondary/50 backdrop-blur-sm"
                    placeholder="Enter your password"
                  />
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.022, boxShadow: "0 5px 15px rgba(0,207,255,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.7,
                    type: "spring",
                    stiffness: 500,
                    damping: 25
                  }}
                  type="submit"
                  className="btn-primary w-full text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium mt-8"
                >
                  Sign In
                </motion.button>
              </motion.form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}