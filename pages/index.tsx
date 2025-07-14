import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import React, { useEffect, useRef } from 'react';
import Map from "@/interfaces/Map"

function Scene() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  function getCameraDirections(cam: THREE.PerspectiveCamera) {
    const forward = new THREE.Vector3();
    cam.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const up = cam.up.clone();
    const right = new THREE.Vector3().crossVectors(forward, up).normalize();

    return { forward, up, right };
  }

  useEffect(() =>
  {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.lookAt(0, 0, 1);

    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current?.appendChild(renderer.domElement);

    const map = new Map();

    for (let i = 0; i < 10; i++)
    {
      for (let j = 0; j < 10; j++)
      {
        const objectType = map.getMapObject(i, j);
        if (objectType?.type === "wall")
        {
          const wall = new THREE.Mesh(
            new THREE.BoxGeometry(),
            new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
          );
          wall.position.set(i, 0.5, -j);
          scene.add(wall);
        } 
        else if (objectType?.type === "playerStart")
        {
          const player = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
          );
          player.position.set(i, 0.3, -j - 0.5);

          camera.position.set(i, 0.5, -j);
          camera.lookAt(i, 1, -j - 1);

          scene.add(player);
          const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            new THREE.MeshBasicMaterial({ color: 0x0000ff })
          );
          floor.rotation.x = -Math.PI / 2;
          floor.position.set(i, 0, -j);
          scene.add(floor);
        
        }
        else
        {
          const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            new THREE.MeshBasicMaterial({ color: 0x0000ff })
          );
          floor.rotation.x = -Math.PI / 2;
          floor.position.set(i, 0, -j);
          scene.add(floor);
        }
      }
    }

    // player movement 
    const speed = 0.1;
    const onKeyDown = (event: KeyboardEvent) => {
      const cam = cameraRef.current;
      if (!cam) return;

      const { forward, right } = getCameraDirections(cam);

      if (event.key.toLowerCase() === "w") cam.position.add(forward.clone().multiplyScalar(speed));
      if (event.key.toLowerCase() === "s") cam.position.add(forward.clone().multiplyScalar(-speed));
      if (event.key.toLowerCase() === "a") cam.position.add(right.clone().multiplyScalar(-speed));
      if (event.key.toLowerCase() === "d") cam.position.add(right.clone().multiplyScalar(speed));
    };

    // Camera rotation values
    let yaw = 0;
    let pitch = 0;

    // Mouse movement handler
    const onMouseMovement = (event: MouseEvent) => {
      const sensitivity = 0.0009;

      yaw += event.movementX * sensitivity;   // Yaw: rotate left/right
      pitch -= event.movementY * sensitivity; // Pitch: rotate up/down
    };

    // Add event listeners
    window.addEventListener("mousemove", onMouseMovement);
    window.addEventListener("keydown", onKeyDown);
    document.body.addEventListener("click", () => {document.body.requestPointerLock();});

    const controls = new OrbitControls(camera, renderer.domElement);
    const gridHelprer = new THREE.GridHelper(200, 50);
    scene.add(gridHelprer);
    
    const animate = () =>
    {
      requestAnimationFrame(animate);
      
      const direction = new THREE.Vector3(
        Math.cos(pitch) * Math.sin(yaw),
        Math.sin(pitch),
        -Math.cos(pitch) * Math.cos(yaw)
      );
      
      const target = new THREE.Vector3().addVectors(camera.position, direction);
      camera.lookAt(target);

      controls.update();
      
      renderer.render(scene, camera);

    };

    animate();

  }, []);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
}

export default Scene;