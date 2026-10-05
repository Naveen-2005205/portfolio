// src/components/InteractiveMemoji.jsx
const { useState, useEffect, useRef } = React;

// Toggle interaction/animation (set to true once static alignment is approved)
const ENABLE_INTERACTION = true;

const InteractiveMemoji = () => {
  const containerRef = useRef(null);
  const mountRef = useRef(null);
  
  const [hasWebGL, setHasWebGL] = useState(true);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);
  
  // Refs for animation loop (avoiding React state re-renders)
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const meshesRef = useRef({});
  const groupsRef = useRef({});
  const restPositionsRef = useRef({});
  const animationFrameId = useRef(null);
  
  // Mouse position state (normalized -1 to 1)
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });
  
  // Tracking responsiveness modifiers
  const trackingScale = useRef(1.0);
  
  // Blinking animation states
  const blinkState = useRef({
    inProgress: false,
    duration: 150, // total blink duration in ms
    startTime: 0,
    nextBlinkTime: 0
  });

  // 1. WebGL Support Failsafe Check
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl || typeof THREE === 'undefined') {
        setHasWebGL(false);
        setLoading(false);
      }
    } catch (e) {
      setHasWebGL(false);
      setLoading(false);
    }
  }, []);

  // 2. Fetch Layer Configuration
  useEffect(() => {
    if (!hasWebGL) return;
    
    fetch('assets/memoji/memoji-layer-config.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load layer config');
        return res.json();
      })
      .then(data => {
        setConfig(data);
      })
      .catch(err => {
        console.error('[Memoji] Config error, falling back to static:', err);
        setHasWebGL(false);
        setLoading(false);
      });
  }, [hasWebGL]);

  // 3. Main Three.js Scene Setup & Loop
  useEffect(() => {
    if (!config || !hasWebGL) return;
    
    // Set up trackingScale based on screen width
    const handleResizeScale = () => {
      const w = window.innerWidth;
      if (w < 768) {
        trackingScale.current = 0.0; // Mobile: No tracking, only blink/idle
      } else if (w < 1024) {
        trackingScale.current = 0.4; // Tablet: Reduced parallax
      } else {
        trackingScale.current = 1.0; // Desktop: Full parallax
      }
    };
    handleResizeScale();
    window.addEventListener('resize', handleResizeScale);

    // Track mouse coordinates
    const onMouseMove = (e) => {
      if (trackingScale.current === 0.0) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      // Calculate cursor position relative to canvas container
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Keep clamped between -1 and 1
      targetMouse.current.x = Math.max(-1.0, Math.min(1.0, x));
      targetMouse.current.y = Math.max(-1.0, Math.min(1.0, y));
    };

    const onMouseLeave = () => {
      // Return smoothly to center when mouse leaves
      targetMouse.current.x = 0;
      targetMouse.current.y = 0;
    };
    
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });

    // Initialize WebGL Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const designWidth = 1370;
    const designHeight = 1148;
    const fov = 35;
    const fovRad = (fov * Math.PI) / 180;
    
    // Initial aspect
    const container = mountRef.current;
    const width = container.clientWidth || 420;
    const height = container.clientHeight || 350;
    const aspect = width / height;
    
    const camera = new THREE.PerspectiveCamera(fov, aspect, 10, 5000);
    cameraRef.current = camera;
    
    // Setup camera distance dynamically to make sure character is fully visible
    let distHeight = designHeight / (2 * Math.tan(fovRad / 2));
    let distWidth = (designWidth / aspect) / (2 * Math.tan(fovRad / 2));
    const distance = Math.max(distHeight, distWidth);
    camera.position.set(0, 0, distance);
    
    // Setup transparent renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Transparent
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Load textures
    const textureLoader = new THREE.TextureLoader();
    const textures = {};
    let loadedCount = 0;
    const keys = Object.keys(config).filter((key) => key !== 'laptop.png' && key !== 'body.png');
    
    // Create Groups
    const memojiRoot = new THREE.Group();
    const bodyGroup = new THREE.Group();
    const laptopGroup = new THREE.Group();
    const headGroup = new THREE.Group();
    const glassesGroup = new THREE.Group();
    const leftEyeGroup = new THREE.Group();
    const rightEyeGroup = new THREE.Group();
    
    scene.add(memojiRoot);
    memojiRoot.add(bodyGroup);
    memojiRoot.add(laptopGroup);
    memojiRoot.add(headGroup);
    
    groupsRef.current = {
      memojiRoot,
      bodyGroup,
      laptopGroup,
      headGroup,
      glassesGroup,
      leftEyeGroup,
      rightEyeGroup
    };

    // Calculate Head Pivot in world space to rotate around correctly
    const headConfig = config['head.png'];
    const headPivotWorldX = (headConfig.x + headConfig.pivot[0]) - designWidth / 2;
    const headPivotWorldY = designHeight / 2 - (headConfig.y + headConfig.pivot[1]);
    
    // Position the HeadGroup at the head pivot
    headGroup.position.set(headPivotWorldX, headPivotWorldY, headConfig.z);

    const loadTexture = (key) => {
      textureLoader.load(
        `assets/memoji/layers/${key}`,
        (texture) => {
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          textures[key] = texture;
          loadedCount++;
          
          if (loadedCount === keys.length) {
            // All loaded! Setup materials and meshes
            buildScene();
            setLoading(false);
          }
        },
        undefined,
        (err) => {
          console.error('[Memoji] Texture loading failed:', err);
          setHasWebGL(false);
          setLoading(false);
        }
      );
    };

    keys.forEach(loadTexture);

    const buildScene = () => {
      keys.forEach((key) => {
        const item = config[key];
        const tex = textures[key];
        
        // Setup plane geometry and offset its vertices to position the rotation pivot correctly
        const geom = new THREE.PlaneGeometry(item.width, item.height);
        
        const dx = item.pivot[0] - item.width / 2;
        const dy = item.height / 2 - item.pivot[1];
        geom.translate(-dx, -dy, 0); // Translate geometry opposite to pivot offset
        
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          depthWrite: false,
          depthTest: true
        });
        
        const mesh = new THREE.Mesh(geom, mat);
        meshesRef.current[key] = mesh;
        
        // World coordinates of the pivot
        const pivotWorldX = (item.x + item.pivot[0]) - designWidth / 2;
        const pivotWorldY = designHeight / 2 - (item.y + item.pivot[1]);
        
        // Z offset
        const zPos = item.z;

        // Position meshes relative to parent groups and store rest positions
        let posX = 0;
        let posY = 0;
        let posZ = zPos;
        if (key === 'laptop.png' || key === 'body.png') {
          posX = pivotWorldX;
          posY = pivotWorldY;
        } else {
          posX = pivotWorldX - headPivotWorldX;
          posY = pivotWorldY - headPivotWorldY;
          posZ = zPos - headConfig.z;
        }
        
        restPositionsRef.current[key] = { x: posX, y: posY, z: posZ };
        mesh.position.set(posX, posY, posZ);

        if (key === 'laptop.png') {
          laptopGroup.add(mesh);
        } else if (key === 'body.png') {
          bodyGroup.add(mesh);
        } else if (key.includes('glasses')) {
          glassesGroup.add(mesh);
        } else if (key.includes('left-eye') || key.includes('left-pupil')) {
          leftEyeGroup.add(mesh);
        } else if (key.includes('right-eye') || key.includes('right-pupil')) {
          rightEyeGroup.add(mesh);
        } else {
          headGroup.add(mesh);
        }
      });
      
      // Assemble groups hierarchy
      headGroup.add(glassesGroup);
      headGroup.add(leftEyeGroup);
      headGroup.add(rightEyeGroup);
      
      // Set initial blink check timer
      blinkState.current.nextBlinkTime = Date.now() + 2500 + Math.random() * 4000;
    };

    // Responsive camera aspect adjustments using ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      if (!renderer || !camera) return;
      for (let entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w === 0 || h === 0) continue;
        
        renderer.setSize(w, h);
        
        const newAspect = w / h;
        camera.aspect = newAspect;
        
        let newDistHeight = designHeight / (2 * Math.tan(fovRad / 2));
        let newDistWidth = (designWidth / newAspect) / (2 * Math.tan(fovRad / 2));
        camera.position.z = Math.max(newDistHeight, newDistWidth);
        camera.updateProjectionMatrix();
      }
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();
    
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      
      if (!ENABLE_INTERACTION) {
        // Reset everything to rest positions
        memojiRoot.position.y = 0;
        headGroup.rotation.set(0, 0, 0);
        
        Object.keys(meshesRef.current).forEach((key) => {
          const mesh = meshesRef.current[key];
          const rest = restPositionsRef.current[key];
          if (mesh && rest) {
            mesh.position.set(rest.x, rest.y, rest.z);
            mesh.scale.set(1, 1, 1);
            mesh.rotation.set(0, 0, 0);
          }
        });
        
        laptopGroup.position.set(0, 0, 0);
        bodyGroup.position.set(0, 0, 0);
        bodyGroup.scale.set(1, 1, 1);
        
        renderer.render(scene, camera);
        return;
      }
      
      const dt = clock.getDelta();
      const time = clock.getElapsedTime();
      
      // LERP/DAMP cursor tracking smoothly
      // Pupils react fastest, Head follows smoothly, hair has slight lag
      const pupilLerp = 0.15;
      const headLerp = 0.05;
      const tScale = trackingScale.current;
      
      currentMouse.current.x += (targetMouse.current.x * tScale - currentMouse.current.x) * headLerp;
      currentMouse.current.y += (targetMouse.current.y * tScale - currentMouse.current.y) * headLerp;
      
      const mx = currentMouse.current.x;
      const my = currentMouse.current.y;
      
      // 1. Idle float / breathing micro-movements
      const idleFloat = Math.sin(time * 1.5) * 3.0; // ±3px vertical float
      const idleBreatheScale = 1.0 + Math.sin(time * 2.0) * 0.003; // breathing scaling
      const idleMicroRotate = Math.sin(time * 0.8) * 0.001; // tiny rotational breathing
      
      memojiRoot.position.y = idleFloat;
      
      // 2. Head Rotation (Pivot based)
      // Max angles: Y: ±7 deg (0.12 rad), X: ±4 deg (0.07 rad), Z: ±1.5 deg (0.026 rad)
      const targetHeadRotY = mx * 0.122; // rotation around vertical Y axis
      const targetHeadRotX = my * 0.07;  // rotation around horizontal X axis
      const targetHeadRotZ = mx * -0.026; // rotation around depth Z axis
      
      headGroup.rotation.y = targetHeadRotY + idleMicroRotate;
      headGroup.rotation.x = targetHeadRotX;
      headGroup.rotation.z = targetHeadRotZ;
      
      // 3. Hair lag / inertia (slight lagging rotation relative to head)
      const hairFront = meshesRef.current['hair-front.png'];
      const hairBack = meshesRef.current['hair-back.png'];
      if (hairFront && hairBack) {
        // Damped hair lag: local rotation is opposite to head rotation to resist movement
        const targetHairRotY = -headGroup.rotation.y * 0.2;
        hairFront.rotation.y += (targetHairRotY - hairFront.rotation.y) * 0.1;
        hairBack.rotation.y += (targetHairRotY - hairBack.rotation.y) * 0.1;
      }
      
      // 4. Glasses follow head perfectly (already children of HeadGroup)
      
      // 5. Pupils Cursor Tracking (clamped inside sclera socket)
      // Pupils react immediately (using targetMouse for speed, lerped independently)
      const leftPupil = meshesRef.current['left-pupil.png'];
      const rightPupil = meshesRef.current['right-pupil.png'];
      const leftPupilRest = restPositionsRef.current['left-pupil.png'];
      const rightPupilRest = restPositionsRef.current['right-pupil.png'];
      
      if (leftPupil && rightPupil && leftPupilRest && rightPupilRest) {
        // Pupil lerp is faster than head
        const pMouseX = targetMouse.current.x * tScale;
        const pMouseY = targetMouse.current.y * tScale;
        
        // Horizontal constraint: ~12px max offset, Vertical: ~7px max offset
        const maxPupilX = 12.0;
        const maxPupilY = 7.0;
        
        // Calculate pupil position offset inside Eye socket
        const pX = pMouseX * maxPupilX;
        const pY = pMouseY * maxPupilY;
        
        // Apply damping relative to rest offsets
        leftPupil.position.x += (leftPupilRest.x + pX - leftPupil.position.x) * pupilLerp;
        leftPupil.position.y += (leftPupilRest.y + pY - leftPupil.position.y) * pupilLerp;
        
        rightPupil.position.x += (rightPupilRest.x + pX - rightPupil.position.x) * pupilLerp;
        rightPupil.position.y += (rightPupilRest.y + pY - rightPupil.position.y) * pupilLerp;
      }

      // 6. Character-only mode: laptop/body layers are disabled. The root provides the float/breathing motion.\n      // 7. Blinking Mechanism
      const now = Date.now();
      const blink = blinkState.current;
      
      if (!blink.inProgress && now >= blink.nextBlinkTime) {
        // Trigger a blink
        blink.inProgress = true;
        blink.startTime = now;
      }
      
      const leftEyeWhite = meshesRef.current['left-eye-white.png'];
      const rightEyeWhite = meshesRef.current['right-eye-white.png'];
      
      if (leftEyeWhite && rightEyeWhite && leftPupil && rightPupil) {
        if (blink.inProgress) {
          const elapsed = now - blink.startTime;
          const halfDur = blink.duration / 2;
          
          let progress = 0;
          if (elapsed < halfDur) {
            // Closing (0 to 1)
            progress = elapsed / halfDur;
          } else if (elapsed < blink.duration) {
            // Opening (1 to 0)
            progress = 1.0 - ((elapsed - halfDur) / halfDur);
          } else {
            // Blink finished
            blink.inProgress = false;
            blink.nextBlinkTime = now + 2500 + Math.random() * 4000; // Schedule next blink
            progress = 0;
          }
          
          // Occlusion-aware blink:
          // Pupil scales down to 0 first (closes faster), then the eye white scales to 0
          // This gives the impression of a closing eyelid coming down over the eye!
          const pupilScaleY = Math.max(0.0, 1.0 - progress * 1.5); // scales to 0 by 66% progress
          const eyeScaleY = Math.max(0.001, 1.0 - progress * 1.0); // scales to 0.001 by 100% progress
          
          leftPupil.scale.y = pupilScaleY;
          rightPupil.scale.y = pupilScaleY;
          
          leftEyeWhite.scale.y = eyeScaleY;
          rightEyeWhite.scale.y = eyeScaleY;
          
          // Push pupils slightly downwards during blink to align with closed eyelid center
          const blinkPushY = -progress * 6.0;
          leftPupil.position.y += blinkPushY * dt;
          rightPupil.position.y += blinkPushY * dt;
        } else {
          // Reset eye scales
          leftPupil.scale.y = 1;
          rightPupil.scale.y = 1;
          leftEyeWhite.scale.y = 1;
          rightEyeWhite.scale.y = 1;
        }
      }
      
      renderer.render(scene, camera);
    };
    
    // Start animation loop
    animate();
    
    // Cleanup on unmount
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', handleResizeScale);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      // Clean up WebGL resources
      if (rendererRef.current && rendererRef.current.domElement) {
        try {
          rendererRef.current.domElement.remove();
        } catch (e) {}
        rendererRef.current.dispose();
      }
      
      // Dispose materials & textures
      Object.keys(meshesRef.current).forEach((key) => {
        const mesh = meshesRef.current[key];
        if (mesh) {
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
      
      Object.keys(textures).forEach((key) => {
        textures[key].dispose();
      });
    };
  }, [config, hasWebGL]);

  // Render Fallout static image if WebGL / Three.js fails or is loading
  if (!hasWebGL) {
    return (
      <img 
        className="memoji-avatar-img static-fallback" 
        src="assets/memoji/memoji-laptop.PNG" 
        alt="Naveen working on a laptop fallback"
        draggable="false"
      />
    );
  }

  return (
    <div 
      className="memoji-interactive-container"
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* ThreeJS Mounting DOM Node */}
      <div 
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          opacity: loading ? 0 : 1,
          transform: loading ? 'scale(0.95)' : 'scale(1)',
          transition: 'opacity 0.6s ease-out, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />
      
      {/* Keep static reference rendering as placeholder while assets are preloading */}
      {loading && (
        <img 
          className="memoji-avatar-img preloader-placeholder" 
          src="assets/memoji/memoji-laptop.PNG" 
          alt="Naveen working on a laptop placeholder"
          draggable="false"
          style={{
            position: 'absolute',
            zIndex: 2,
            width: '100%',
            maxWidth: '420px',
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  );
};

window.PortfolioComponents = window.PortfolioComponents || {};
window.PortfolioComponents.InteractiveMemoji = InteractiveMemoji;
