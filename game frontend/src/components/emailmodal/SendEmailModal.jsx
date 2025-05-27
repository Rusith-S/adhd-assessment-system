/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";

const SendEmailModal = ({ gameSessionId, isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}email/send`,
        {
          gameSessionId,
          email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedback(response.data.message);
    } catch (error) {
      console.error("Error sending email:", error);
      setFeedback("Error sending email.");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Send Report To Doctor</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors"
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </form>
        {feedback && (
          <p className="mt-4 text-center text-green-600 font-medium">
            {feedback}
          </p>
        )}
      </div>
    </div>
  );
};

export default SendEmailModal;
