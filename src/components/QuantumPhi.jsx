import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const QuantumPhi = () => {
  const mountRef = useRef(null);
  const [currentMotion, setCurrentMotion] = useState("linear");

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(4, 4, 6);
    camera.lookAt(0, 0, 0);

    // Main sphere
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 32, 32),
      new THREE.MeshPhongMaterial({
        color: 0x0047ab,
        shininess: 80,
        specular: 0x111111,
      })
    );
    scene.add(sphere);

    // Create wave points
    const wavePoints = [];
    const numWavePoints = 50;
    const waveGeometry = new THREE.BufferGeometry();
    const waveMaterial = new THREE.LineBasicMaterial({
      color: 0x0047ab,
      transparent: true,
      opacity: 0.5,
    });

    for (let i = 0; i < numWavePoints; i++) {
      wavePoints.push(new THREE.Vector3(0, 0, 0));
    }
    waveGeometry.setFromPoints(wavePoints);
    const waveLine = new THREE.Line(waveGeometry, waveMaterial);
    scene.add(waveLine);

    // Enhanced grid with more lines
    const gridSize = 20;
    const gridDivisions = 20;
    const grid = new THREE.GridHelper(
      gridSize,
      gridDivisions,
      0x000000,
      0xdddddd
    );
    grid.material.opacity = 0.15;
    grid.material.transparent = true;
    scene.add(grid);

    // Animated grid lines
    const gridLines = new THREE.Group();
    const lineColor = 0x2196f3;
    const lineOpacity = 0.1;

    for (let i = -gridSize / 2; i <= gridSize / 2; i += 2) {
      // Vertical lines
      const vertGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i, -gridSize / 2, 0),
        new THREE.Vector3(i, gridSize / 2, 0),
      ]);
      const vertLine = new THREE.Line(
        vertGeometry,
        new THREE.LineBasicMaterial({
          color: lineColor,
          transparent: true,
          opacity: lineOpacity,
        })
      );
      gridLines.add(vertLine);

      // Horizontal lines
      const horizGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-gridSize / 2, i, 0),
        new THREE.Vector3(gridSize / 2, i, 0),
      ]);
      const horizLine = new THREE.Line(
        horizGeometry,
        new THREE.LineBasicMaterial({
          color: lineColor,
          transparent: true,
          opacity: lineOpacity,
        })
      );
      gridLines.add(horizLine);
    }
    scene.add(gridLines);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Animation with wave effect
    const waveHistory = [];
    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      if (currentMotion === "linear") {
        sphere.position.x = Math.sin(time) * 3;
        sphere.position.y = 0;

        // Update wave points when near center
        if (Math.abs(sphere.position.x) < 0.1) {
          waveHistory.push({
            x: sphere.position.x,
            y: sphere.position.y,
            time: time,
          });
        }
      } else {
        sphere.position.x = 0;
        sphere.position.y = Math.sin(time) * 3;

        // Update wave points when near center
        if (Math.abs(sphere.position.y) < 0.1) {
          waveHistory.push({
            x: sphere.position.x,
            y: sphere.position.y,
            time: time,
          });
        }
      }

      // Update wave effect
      for (let i = 0; i < numWavePoints; i++) {
        const x = (i - numWavePoints / 2) * 0.2;
        let y = 0;

        waveHistory.forEach((point) => {
          const distance = Math.abs(x - point.x);
          const age = time - point.time;
          if (age < 2) {
            y += Math.sin(distance * 5 - age * 5) * Math.exp(-age * 2) * 0.5;
          }
        });

        wavePoints[i].x = x;
        wavePoints[i].y = y;
      }
      waveGeometry.setFromPoints(wavePoints);

      // Clean up old wave points
      while (waveHistory.length > 0 && time - waveHistory[0].time > 2) {
        waveHistory.shift();
      }

      // Animate grid lines
      gridLines.children.forEach((line, i) => {
        line.material.opacity = lineOpacity + Math.sin(time + i * 0.1) * 0.05;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [currentMotion]);

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-white shadow-sm">
        <h1 className="text-3xl font-bold mb-4">
          Quantum Physics Visualizations
        </h1>
        <div className="flex gap-4 mb-2">
          <Button
            onClick={() => setCurrentMotion("linear")}
            variant={currentMotion === "linear" ? "default" : "outline"}
            className="px-6 py-2"
          >
            Linear Motion
          </Button>
          <Button
            onClick={() => setCurrentMotion("oscillation")}
            variant={currentMotion === "oscillation" ? "default" : "outline"}
            className="px-6 py-2"
          >
            Simple Harmonic Motion
          </Button>
        </div>
        <p className="text-lg">
          {currentMotion === "linear"
            ? "A particle moving in a straight line with constant velocity."
            : "A particle performing back-and-forth motion about an equilibrium point."}
        </p>
      </div>

      <div className="flex-1">
        <div ref={mountRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default QuantumPhi;
