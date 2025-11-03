"use client";

import { useState } from "react";
import { LoaderOne } from "@/components/ui/loader";

export default function FeedbackFormPage() {
  const [formData, setFormData] = useState({
    experience_rating: "",
    feed_back_and_improvements: "",
    to_the_community_message: "",
  });
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const handleSubmit = async () => {
    const { experience_rating, feed_back_and_improvements, to_the_community_message } = formData;
  
    if (!experience_rating || !feed_back_and_improvements || !to_the_community_message) {
      addToast("Please fill in all fields.", "warning");
      return;
    }
  
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_URL}/api/quiz/feedback/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        // Show the error message returned from API if it exists
        addToast(data.error || "Submission failed", "error");
        return;
      }
  
      console.log("Feedback submitted:", data);
      addToast("✅ Feedback submitted successfully!", "success");
  
      // Reset form
      setFormData({
        experience_rating: "",
        feed_back_and_improvements: "",
        to_the_community_message: "",
      });
    } catch (err) {
      console.error(err);
      addToast("Error submitting feedback. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4 py-12">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)" }}
      />

      {/* Toast Notifications */}
      <div className="fixed top-6 left-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-xl border rounded-xl px-4 py-3 text-sm font-medium ${
              toast.type === "warning"
                ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-200"
                : toast.type === "error"
                ? "bg-red-500/20 border-red-500/30 text-red-200"
                : "bg-green-500/20 border-green-500/30 text-green-200"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Feedback Form */}
      <div className="relative z-10 w-full max-w-3xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">Feedback Form</h1>

        {/* Experience Rating */}
        <div className="mb-6">
          <label className="block text-white mb-2 font-medium">Experience Rating</label>
          <textarea
            value={formData.experience_rating}
            onChange={(e) => setFormData({ ...formData, experience_rating: e.target.value })}
            placeholder="Share your experience..."
            className="w-full h-28 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all duration-300 resize-y"
          />
        </div>

        {/* Feedback & Improvements */}
        <div className="mb-6">
          <label className="block text-white mb-2 font-medium">Feedback & Improvements</label>
          <textarea
            value={formData.feed_back_and_improvements}
            onChange={(e) => setFormData({ ...formData, feed_back_and_improvements: e.target.value })}
            placeholder="Suggestions for improvement..."
            className="w-full h-28 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all duration-300 resize-y"
          />
        </div>

        {/* Message to Community */}
        <div className="mb-6">
          <label className="block text-white mb-2 font-medium">Message to the Community</label>
          <textarea
            value={formData.to_the_community_message}
            onChange={(e) => setFormData({ ...formData, to_the_community_message: e.target.value })}
            placeholder="Your message..."
            className="w-full h-28 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all duration-300 resize-y"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
            loading
              ? "bg-white/10 text-white/40 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl active:scale-95"
          }`}
        >
          {loading ? <LoaderOne /> : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
}
