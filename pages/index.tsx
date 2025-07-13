import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';
import Map from "@/interfaces/Map"

function Scene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => 
  {
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      80,
      window.innerWidth / window.innerHeight,
      1,
      100,
    )
    camera.lookAt(0, 0, 1);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current?.appendChild(renderer.domElement);

    const map = new Map();
    
    for (let i = 0; i < 10; i++)
    {
      let objectType: Map | undefined;
      for (let j = 0; j < 10; j++)
      {
        objectType = map.getMapObject(i, j);

      }
    }


  }, []);

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh', cursor: 'crosshair' }} />;
}

export default function App() {
  return (
    <div className="App">
      <Scene />
    </div>
  );
}
