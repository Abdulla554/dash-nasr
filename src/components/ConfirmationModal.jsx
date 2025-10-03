/* eslint-disable no-unused-vars */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-r from-[#0C0C0E] via-[#0F1B24] to-[#11212D] backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ y: 16, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 16, opacity: 0, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22, mass: 0.8 }}
          className="card-nsr relative w-full max-w-md m-4 z-50 rounded-2xl p-6 bg-nsr-secondary/70 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]"
        >
          <div className="absolute inset-0 -z-10 rounded-2xl pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

          <div className="flex items-start gap-4 my-4">
            <div className="shrink-0 h-11 w-11 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white grid place-items-center shadow-lg">
              !
            </div>
            <div className="">
              <h3 className="text-2xl font-semibold tracking-tight text-nsr-primary mb-1">{title}</h3>
              <p className="text-sm leading-6 text-nsr-neutral/90">{message}</p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/15 text-nsr-neutral hover:bg-white/5 active:scale-[0.98] transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg hover:from-red-600 hover:to-rose-700 active:scale-[0.98] transition-all"
            >
              حذف
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 