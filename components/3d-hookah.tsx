"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

export default function ThreeDHookah() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(width, height)
    // Ограничиваем pixel ratio для лучшей производительности
    const pixelRatio = Math.min(window.devicePixelRatio, 2)
    renderer.setPixelRatio(pixelRatio)
    renderer.shadowMap.enabled = false // Отключаем тени для производительности
    containerRef.current.appendChild(renderer.domElement)

    camera.position.z = 5

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 7)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xffd700, 0.4)
    pointLight.position.set(-5, 3, 3)
    scene.add(pointLight)

    // Load GLTF model
    const loader = new GLTFLoader()
    let model: THREE.Group | null = null
    let animationId: number

    loader.load(
      "/models/hookah/scene.gltf",
      (gltf) => {
        model = gltf.scene
        scene.add(model)

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        // Calculate scale to fit the view
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 3 / maxDim
        model.scale.multiplyScalar(scale)

        // Center the model
        model.position.x = -center.x * scale
        model.position.y = -center.y * scale
        model.position.z = -center.z * scale

        setLoading(false)

        // Animation loop с оптимизацией
        let lastTime = 0
        const targetFPS = 60
        const frameInterval = 1000 / targetFPS

        const animate = (currentTime: number) => {
          animationId = requestAnimationFrame(animate)

          const deltaTime = currentTime - lastTime

          if (deltaTime >= frameInterval) {
            if (model) {
              model.rotation.y += 0.005
              model.rotation.x = Math.sin(currentTime * 0.0003) * 0.1
            }

            renderer.render(scene, camera)
            lastTime = currentTime
          }
        }

        animationId = requestAnimationFrame(animate)
      },
      (progress) => {
        // Progress callback
        console.log("Loading progress:", (progress.loaded / progress.total) * 100 + "%")
      },
      (error) => {
        console.error("Error loading model:", error)
        setError("Ошибка загрузки модели")
        setLoading(false)
      }
    )

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      renderer.dispose()
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="text-center">
            <div className="text-2xl mb-2">⏳</div>
            <p className="text-sm text-muted-foreground">Загрузка модели...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="text-center">
            <div className="text-2xl mb-2">❌</div>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
