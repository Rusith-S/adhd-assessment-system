/* eslint-disable react/prop-types */
const ActivityCard = ({ activity, onShowInstructions }) => (
  <div className="bg-white shadow-lg rounded-lg p-4 m-4 flex flex-col items-center">
    <img
      src={activity.image}
      alt={activity.title}
      className="w-60 h-60 object-cover rounded-md mb-4"
    />
    <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
    <p className="text-gray-600 mb-2">{activity.duration}</p>
    <p className="text-gray-500 text-center mb-4">{activity.description}</p>
    <button
      onClick={() => onShowInstructions(activity)}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
    >
      How to Perform
    </button>
  </div>
);

export default ActivityCard;
