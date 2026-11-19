import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Detect WebGL capability safely
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export default function Hero3DCanvas() {
  const mountRef = useRef(null);
  const [hasWebGL] = useState(() => isWebGLAvailable());

  useEffect(() => {
    if (!hasWebGL) return;

    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene setup
    const scene = new THREE.Scene();
    
    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 7;

    // 3. Renderer with capped DPR for mobile & GPU efficiency
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // 4. Group for mouse-reactive rotation
    const group = new THREE.Group();
    scene.add(group);

    // Core Sphere: Icosahedron with wireframe
    const coreGeometry = new THREE.IcosahedronGeometry(1.7, 3);
    const coreWireframeMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6, // Electric purple
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      roughness: 0.2,
      metalness: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreWireframeMat);
    group.add(coreMesh);

    // Inner Glowing Core
    const innerGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x201440,
      transparent: true,
      opacity: 0.6,
      wireframe: false,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerMesh);

    // Orbital Ring 1
    const ringGeo1 = new THREE.TorusGeometry(2.4, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8, // Neon blue / cyan
      transparent: true,
      opacity: 0.75,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    // Orbital Ring 2
    const ringGeo2 = new THREE.TorusGeometry(2.7, 0.015, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.5,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);

    // Floating Cyber Particle Swarm
    const particleCount = 240;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x8b5cf6);
    const color2 = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    group.add(particleSystem);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLightPurple = new THREE.PointLight(0x8b5cf6, 4, 15);
    pointLightPurple.position.set(4, 3, 3);
    scene.add(pointLightPurple);

    const pointLightBlue = new THREE.PointLight(0x38bdf8, 3, 15);
    pointLightBlue.position.set(-4, -3, 2);
    scene.add(pointLightBlue);

    // Mouse Interaction
    let targetX = 0;
    let targetY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.8;
      targetY = y * 0.8;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Resize Handler
    const onResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', onResize, { passive: true });

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        coreMesh.rotation.y += delta * 0.35;
        coreMesh.rotation.x += delta * 0.15;

        ring1.rotation.z += delta * 0.4;
        ring2.rotation.x += delta * 0.25;

        particleSystem.rotation.y += delta * 0.1;
        particleSystem.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;

        const scale = 1 + Math.sin(elapsedTime * 1.5) * 0.03;
        coreMesh.scale.set(scale, scale, scale);
      }

      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      group.rotation.y = mouseX * 1.2;
      group.rotation.x = -mouseY * 1.2;

      renderer.render(scene, camera);
    };

    animate();

    // Comprehensive Resource Disposal Cleanup (Zero WebGL leaks)
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);

      if (container && renderer && renderer.domElement) {
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }

      // Geometries disposal
      coreGeometry.dispose();
      innerGeo.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      particleGeo.dispose();

      // Materials disposal
      coreWireframeMat.dispose();
      innerMat.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      particleMat.dispose();

      // Renderer disposal
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
    };
  }, [hasWebGL]);

  if (!hasWebGL) {
    return (
      <div className="relative w-full h-[420px] md:h-[540px] flex items-center justify-center pointer-events-none select-none">
        <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-purple-600/40 via-indigo-600/30 to-sky-400/40 blur-2xl animate-pulse" />
        <div className="absolute w-48 h-48 rounded-full border border-purple-500/40 animate-spin [animation-duration:12s]" />
        <div className="absolute w-36 h-36 rounded-full border border-sky-400/30 animate-spin [animation-duration:8s] [animation-direction:reverse]" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[420px] md:h-[540px] flex items-center justify-center pointer-events-none select-none">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial from-purple-600/15 via-transparent to-transparent blur-3xl pointer-events-none" />
      <div ref={mountRef} className="w-full h-full relative z-10 pointer-events-auto" />
    </div>
  );
}
