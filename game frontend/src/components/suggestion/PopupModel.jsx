/* eslint-disable react/prop-types */
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const PopupModel = ({ activity, onClose }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  if (!activity) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Popup Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl z-50 p-6 max-w-xl w-full relative"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          {activity.title}
        </h2>
        <pre className="text-gray-700 whitespace-pre-wrap mt-4">
          {activity.instructions}
        </pre>

        {/* Button Group */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition duration-300"
          >
            Close
          </button>
          <button
            onClick={() => navigate(`/emotion-after-suggestion/${id}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition duration-300"
          >
            Complete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PopupModel;
