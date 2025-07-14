import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';
import Map from "@/interfaces/Map";

function Scene() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const keyDowns = new Set<string>();

  useEffect(() => {
    const scene = new THREE.Scene();

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current?.appendChild(renderer.domElement);

    // Camera
    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100);
    cameraRef.current = camera;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(3, 10, 5);
    scene.add(dirLight);

    // Textures
    const floorTexture = new THREE.TextureLoader().load("/textures/floor.jpg");
    const wallTexture = new THREE.TextureLoader().load("/textures/wall.jpg");

    // Camera direction control
    let yaw = 0;
    let pitch = 0;

    // Red dot player indicator (used as target point in front of camera)
    let player: THREE.Mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.01, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    scene.add(player);

    // Build Map
    const map = new Map();
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const objectType = map.getMapObject(i, j);
        const x = i;
        const z = -j;

        if (objectType?.type === "wall") {
          const wall = new THREE.Mesh(
            new THREE.BoxGeometry(1, 5, 1),
            new THREE.MeshStandardMaterial({ map: wallTexture })
          );
          wall.position.set(x, 0.5, z);
          scene.add(wall);
        } else {
          const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            new THREE.MeshStandardMaterial({ map: floorTexture })
          );
          floor.rotation.x = -Math.PI / 2;
          floor.position.set(x, 0, z);
          scene.add(floor);

          if (objectType?.type === "playerStart") {
            camera.position.set(x, 0.7, z);
          }
        }
      }
    }

    // Input
    const speed = 0.1;
    const onKeyDown = (e: KeyboardEvent) => keyDowns.add(e.key.toLowerCase());
    const onKeyUp = (e: KeyboardEvent) => keyDowns.delete(e.key.toLowerCase());

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousemove", (event: MouseEvent) => {
      const yawSensitivity = 0.005;
      const pitchSensitivity = 0.003;
      yaw += event.movementX * yawSensitivity;
      pitch += event.movementY * pitchSensitivity;
    });

    document.body.addEventListener("click", () => {
      document.body.requestPointerLock();
    });

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);

      // Forward = where camera is looking
      const forward = new THREE.Vector3(
        Math.cos(pitch) * -Math.sin(yaw),
        Math.sin(pitch),
        Math.cos(pitch) * Math.cos(yaw)
      );

      // Right = perpendicular to forward on XZ plane
      const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

      // Move camera (based on WASD keys)
      const movement = new THREE.Vector3();

      if (keyDowns.has("w")) movement.add(forward);
      if (keyDowns.has("s")) movement.add(forward.clone().negate());
      if (keyDowns.has("d")) movement.add(right);
      if (keyDowns.has("a")) movement.add(right.clone().negate());

      movement.y = 0; 
      movement.normalize();
      camera.position.add(movement.multiplyScalar(speed));
      camera.lookAt(camera.position.clone().add(forward));

      // Position sphere in front of camera
      player.position.copy(camera.position).add(forward.clone().multiplyScalar(2));
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
}

export default Scene;