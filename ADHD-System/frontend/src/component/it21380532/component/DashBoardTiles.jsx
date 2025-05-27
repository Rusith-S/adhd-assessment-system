import { Paper, Typography } from "@mui/material";
import React from "react";
import {
  Brain,
  Zap,
  GraduationCap,
  Target,
  Activity,
  Eye,
  Combine,
  MessageSquare,
} from "lucide-react";

// Icon mapping based on title
const getIconAndColor = (title) => {
  const iconMap = {
    "ADHD Type": {
      icon: Brain,
      color: "#FF6B9D", // Pink
      bgGradient: "linear-gradient(135deg, #FF6B9D 0%, #FF8E9B 100%)",
    },
    "Impulsive Level": {
      icon: Zap,
      color: "#4ECDC4", // Teal
      bgGradient: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)",
    },
    "Academic Grade": {
      icon: GraduationCap,
      color: "#45B7D1", // Blue
      bgGradient: "linear-gradient(135deg, #45B7D1 0%, #96C93D 100%)",
    },
    "Current Strategy": {
      icon: Target,
      color: "#FFA726", // Orange
      bgGradient: "linear-gradient(135deg, #FFA726 0%, #FF7043 100%)",
    },
    "Hyperactive Impulsive Score": {
      icon: Activity,
      color: "#E74C3C", // Red
      bgGradient: "linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)",
    },
    "Inattentive Score": {
      icon: Eye,
      color: "#9B59B6", // Purple
      bgGradient: "linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)",
    },
    "Combined Score": {
      icon: Combine,
      color: "#2ECC71", // Green
      bgGradient: "linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)",
    },
    "Teacher Feedback": {
      icon: MessageSquare,
      color: "#F39C12", // Yellow-Orange
      bgGradient: "linear-gradient(135deg, #F39C12 0%, #E67E22 100%)",
    },
  };

  return (
    iconMap[title] || {
      icon: Brain,
      color: "#6C757D",
      bgGradient: "linear-gradient(135deg, #6C757D 0%, #495057 100%)",
    }
  );
};

export default function DashBoardTiles({ title, value }) {
  const { icon: IconComponent, color, bgGradient } = getIconAndColor(title);

  return (
    <Paper
      elevation={10}
      style={{
        background: bgGradient,
        padding: "1rem",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        marginTop: "1.5rem",
        width: "300px",
        height: "150px",
        color: "white",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s ease-in-out",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          opacity: 0.5,
        }}
      />

      {/* Icon */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "0.5rem",
        }}
      >
        <IconComponent
          size={40}
          color="white"
          style={{
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
          }}
        />
      </div>

      {/* Title */}
      <Typography
        variant="h6"
        fontWeight="bold"
        style={{
          fontSize: "1.2rem",
          marginBottom: "0.5rem",
          textShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      >
        {title}
      </Typography>

      {/* Value */}
      <Typography
        variant="body1"
        style={{
          fontSize: "1rem",
          fontWeight: "600",
          textShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
}
