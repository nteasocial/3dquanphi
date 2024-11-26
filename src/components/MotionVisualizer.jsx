import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const MotionVisualizer = () => {
  const [motion, setMotion] = useState(null);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    let animationFrameId;
    let startTime = Date.now();

    const animate = () => {
      const time = (Date.now() - startTime) * 0.001; // Convert to seconds

      if (motion === "linear") {
        // Move left to right (-200 to 200)
        setPosition(Math.sin(time) * 200);
      } else if (motion === "oscillation") {
        // Move up and down
        setPosition(Math.sin(time * 2) * 100);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    if (motion) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [motion]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setMotion("linear")}
            variant={motion === "linear" ? "default" : "outline"}
          >
            Linear Motion
          </Button>
          <Button
            onClick={() => setMotion("oscillation")}
            variant={motion === "oscillation" ? "default" : "outline"}
          >
            Oscillation
          </Button>
        </div>

        {/* Visualization Area */}
        <div className="relative w-full h-64 border rounded-lg bg-gray-50 overflow-hidden">
          {/* Moving ball */}
          <div
            className="absolute w-8 h-8 rounded-full bg-blue-500"
            style={{
              transform:
                motion === "linear"
                  ? `translateX(${position + 200}px)`
                  : `translateY(${position + 100}px)`,
              left: motion === "linear" ? "0" : "50%",
              top: motion === "oscillation" ? "0" : "50%",
              transition: "transform 0.01s linear",
            }}
          />

          {/* Center line */}
          <div
            className={`absolute ${
              motion === "linear"
                ? "w-full h-px top-1/2"
                : "h-full w-px left-1/2"
            } bg-gray-300`}
          />
        </div>

        {/* Description */}
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          {motion === "linear" && (
            <p>
              Linear Motion: The ball moves back and forth in a straight line at
              constant speed.
            </p>
          )}
          {motion === "oscillation" && (
            <p>
              Oscillation: The ball moves up and down with simple harmonic
              motion.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MotionVisualizer;
