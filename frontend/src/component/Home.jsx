import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const [child, setChild] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          "http://localhost:8800/api/child/profile",
          {
            withCredentials: true,
          }
        );
        setChild(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/signin");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (isLoading) {
    return (
      <div
        className="loading-container"
        style={{
          backgroundColor: "lightblue",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="loading-animation">
          <h2>Loading your fun activities...</h2>
          <div className="loading-dots">
            <span
              style={{
                display: "inline-block",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "#4682B4",
                margin: "0 8px",
                animation: "bounce 1.4s infinite ease-in-out both",
              }}
            ></span>
            <span
              style={{
                display: "inline-block",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "#4682B4",
                margin: "0 8px",
                animation: "bounce 1.4s infinite ease-in-out both",
                animationDelay: "0.2s",
              }}
            ></span>
            <span
              style={{
                display: "inline-block",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "#4682B4",
                margin: "0 8px",
                animation: "bounce 1.4s infinite ease-in-out both",
                animationDelay: "0.4s",
              }}
            ></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="home"
      style={{
        backgroundColor: "lightblue",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "'Comic Sans MS', 'Marker Felt', sans-serif",
      }}
    >
      <div className="container">
        <div
          className="welcome-section"
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(40px, 8vw, 80px)",
              fontWeight: "bold",
              color: "#0066CC",
              marginTop: "20px",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            Hello, {child.name}!
            <span
              role="img"
              aria-label="waving hand"
              style={{ marginLeft: "10px" }}
            >
              👋
            </span>
          </h1>
          <p
            style={{
              fontSize: "clamp(16px, 3vw, 24px)",
              marginTop: "10px",
              color: "#444",
            }}
          >
            What would you like to do today?
          </p>
        </div>

        <div
          className="activities-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* ADHD Assessment Card */}
          <ActivityCard
            title="ADHD Assessment"
            emoji="🧠"
            imageSrc="/assets/it21288326/assess.jpg"
            linkTo="/profile"
            childId={child._id}
            backgroundColor="#87CEEB"
          />

          {/* Focus Development Card */}
          <ActivityCard
            title="Focus Development"
            emoji="🎯"
            imageSrc="/assets/it21288326/focus.jpg"
            linkTo="http://localhost:5173"
            childId={child._id}
            backgroundColor="#90EE90"
          />

          {/* Impulse Control Card */}
          <ActivityCard
            title="Impulse Control"
            emoji="⏱️"
            imageSrc="/assets/it21288326/impulse.jpg"
            linkTo="/reaction-time-game"
            childId={child._id}
            backgroundColor="#FFB6C1"
          />

          {/* Summary Reports Card */}
          <ActivityCard
            title="My Progress"
            emoji="📊"
            imageSrc="/assets/it21288326/report.jpg"
            linkTo="/questionnaire-form"
            childId={child._id}
            backgroundColor="#FFFFE0"
          />
          {/* Questionnaire Card */}
          <ActivityCard
            title="Activity"
            emoji="📚"
            imageSrc="/assets/ax81_reiv_220311.jpg"
            linkTo={`http://localhost:3005/dashboard/${child._id}`}
            childId={child._id}
            backgroundColor="#e8abee"
          />

          {/* Questionnaire Card */}
          <ActivityCard
            title="Predictions"
            emoji="🧮"
            imageSrc="/assets/20949.jpg"
            linkTo={`http://localhost:3005/prediction/${child._id}`}
            childId={child._id}
            backgroundColor="#edbb99"
          />
        </div>
      </div>
    </div>
  );
};

// Activity Card Component for better code organization
const ActivityCard = ({
  title,
  emoji,
  imageSrc,
  linkTo,
  childId,
  backgroundColor,
}) => {
  const isExternal = linkTo.startsWith("http");
  const Wrapper = isExternal ? "a" : Link;
  const wrapperProps = isExternal
    ? { href: linkTo, rel: "noopener noreferrer" }
    : { to: linkTo, state: { childId } };

  return (
    <Wrapper
      {...wrapperProps}
      className="activity-card-link"
      style={{ textDecoration: "none" }}
    >
      <div
        className="activity-card"
        style={{
          backgroundColor: backgroundColor,
          borderRadius: "25px",
          overflow: "hidden",
          transition: "transform 0.3s, box-shadow 0.3s",
          boxShadow: "8px 8px 15px rgba(0, 0, 0, 0.2)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "15px",
          cursor: "pointer",
          transform: "translateY(0)",
          position: "relative",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-10px)";
          e.currentTarget.style.boxShadow = "10px 15px 25px rgba(0, 0, 0, 0.3)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "8px 8px 15px rgba(0, 0, 0, 0.2)";
        }}
      >
        <div
          className="card-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "15px",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(22px, 4vw, 32px)",
              fontWeight: "bold",
              color: "#333",
              margin: "0",
              textAlign: "center",
            }}
          >
            {title}{" "}
            <span role="img" aria-label="activity icon">
              {emoji}
            </span>
          </h2>
        </div>

        <div
          className="card-image"
          style={{
            flex: "1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <img
            src={imageSrc}
            alt={`${title} activity`}
            style={{
              width: "85%",
              height: "auto",
              borderRadius: "20px",
              objectFit: "cover",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
        </div>

        <div
          className="card-footer"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            padding: "10px",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: "0",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Let's Go!
          </p>
        </div>
      </div>
    </Wrapper>
  );
};

export default Home;
