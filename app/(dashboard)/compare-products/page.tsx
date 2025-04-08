"use client";

import React, { useState, useEffect, useRef } from "react";
// Alternative options:
import { 
  Search, 
  Bell, 
  ShoppingCart, 
  X, 
  Plus,
  Check,
  Info,
  Box,       // Try this instead of Cube
  LayoutGrid,   // Try this instead of Square
  Square,
  Boxes
} from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface DefibrillatorProduct {
  id: string;
  title: string;
  price: number;
  weight: string; // in lbs
  chargeTime: string; // in seconds
  dimensions: string;
  operationType: string;
  powerSource: string;
  brand: string;
  imageUrl?: string;

  // Parsed numeric values for Pareto calculations
  weightValue?: number;
  chargeTimeValue?: number;
  priceValue?: number;
  volumeValue?: number;
  paretoEfficient?: boolean;
  selected?: boolean;
}

export default function InteractiveCompareProducts() {
  const [products, setProducts] = useState<DefibrillatorProduct[]>([]);
  const [priorities, setPriorities] = useState({
    price: 40,
    weight: 25,
    chargeTime: 35,
  });
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"graph" | "table">("graph");
  const [viewMode, setViewMode] = useState<"2d" | "3d">("3d");
  const [showTooltip, setShowTooltip] = useState(false);

  // Refs for Three.js
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const pointsRef = useRef<{ [key: string]: THREE.Mesh }>({});
  const frameIdRef = useRef<number | null>(null);

  // Mock data based on the Excel file structure
  useEffect(() => {
    // This would be your API call to fetch the actual data
    const fetchedProducts: DefibrillatorProduct[] = [
      {
        id: "1",
        title: "Defibrillator Automatic ZOLL® X Series",
        price: 27850,
        weight: "11.7 lbs.",
        chargeTime: "7 Seconds",
        dimensions: "8.9 X 10.4 Inch",
        operationType: "Automatic",
        powerSource: "AC Power / Battery Operated",
        brand: "Zoll® X Series",
        imageUrl: "/api/placeholder/200/200",
      },
      {
        id: "2",
        title: "Defibrillator Unit Manual Operation Zoll® R Series",
        price: 15750,
        weight: "13.6 lbs.",
        chargeTime: "7 Seconds",
        dimensions: "8.2 X 10.5 X 12.5 Inch",
        operationType: "Manual Operation",
        powerSource: "AC Power / Battery Operated",
        brand: "Zoll® R Series",
        imageUrl: "/api/placeholder/200/200",
      },
      {
        id: "3",
        title: "Defibrillator Automatic LIFEPAK® 15",
        price: 23500,
        weight: "22 lbs.",
        chargeTime: "10 Seconds",
        dimensions: "12.5 X 15.8 X 9.1 Inch",
        operationType: "Automatic / Manual Operation",
        powerSource: "AC Power / Battery Operated",
        brand: "LIFEPAK® 15",
        imageUrl: "/api/placeholder/200/200",
      },
      {
        id: "4",
        title: "Defibrillator Semi-Automatic Philips HeartStart® FRx",
        price: 1795,
        weight: "3.5 lbs.",
        chargeTime: "8 Seconds",
        dimensions: "2.4 X 7.1 X 8.9 Inch",
        operationType: "Semi-Automatic",
        powerSource: "Battery Operated",
        brand: "Philips HeartStart® FRx",
        imageUrl: "/api/placeholder/200/200",
      },
      {
        id: "5",
        title: "Defibrillator Semi-Automatic ZOLL® AED 3",
        price: 1895,
        weight: "5.5 lbs.",
        chargeTime: "5 Seconds",
        dimensions: "5.0 X 9.2 X 9.2 Inch",
        operationType: "Semi-Automatic",
        powerSource: "Battery Operated",
        brand: "ZOLL® AED 3",
        imageUrl: "/api/placeholder/200/200",
        selected: true,
      },
      {
        id: "6",
        title: "Defibrillator Automatic Powerheart® AED G5",
        price: 1850,
        weight: "5.7 lbs.",
        chargeTime: "10 Seconds",
        dimensions: "3.4 X 9.0 X 9.5 Inch",
        operationType: "Automatic",
        powerSource: "Battery Operated",
        brand: "Powerheart® AED G5",
        imageUrl: "/api/placeholder/200/200",
      },
      {
        id: "7",
        title: "Defibrillator/Monitor Propaq MD",
        price: 24500,
        weight: "12.3 lbs.",
        chargeTime: "6 Seconds",
        dimensions: "8.9 X 10.4 X 7.9 Inch",
        operationType: "Manual Operation",
        powerSource: "AC Power / Battery Operated",
        brand: "Propaq MD",
        imageUrl: "/api/placeholder/200/200",
      },
    ];

    // Process the data
    const processedProducts = processProductData(fetchedProducts);
    setProducts(processedProducts);
  }, []);

  // Process product data - extract numeric values and calculate Pareto efficiency
  const processProductData = (productsData: DefibrillatorProduct[]) => {
    // Extract numeric values from strings for Pareto calculations
    const productsWithNumericValues = productsData.map((product) => {
      // Extract weight as a number
      const weightMatch = product.weight.match(/(\d+\.?\d*)/);
      const weightValue = weightMatch ? parseFloat(weightMatch[1]) : 999;

      // Extract charge time as a number
      const chargeTimeMatch = product.chargeTime.match(/(\d+\.?\d*)/);
      const chargeTimeValue = chargeTimeMatch
        ? parseFloat(chargeTimeMatch[1])
        : 999;

      // Get dimensions and calculate volume (width × height × depth)
      const dimensionsMatch = product.dimensions.match(
        /(\d+\.?\d*)[^0-9]*(\d+\.?\d*)[^0-9]*(\d+\.?\d*)/
      );
      let volumeValue = 999;

      if (dimensionsMatch && dimensionsMatch.length >= 4) {
        const width = parseFloat(dimensionsMatch[1]);
        const height = parseFloat(dimensionsMatch[2]);
        const depth = dimensionsMatch[3] ? parseFloat(dimensionsMatch[3]) : 1;
        volumeValue = width * height * depth;
      }

      return {
        ...product,
        weightValue,
        chargeTimeValue,
        priceValue: product.price,
        volumeValue,
        selected: product.selected || false,
      };
    });

    // Calculate Pareto efficiency
    return calculateParetoEfficiency(productsWithNumericValues);
  };

  // Function to calculate Pareto efficiency in 3D
  const calculateParetoEfficiency = (productsData: DefibrillatorProduct[]) => {
    return productsData.map((product) => {
      // A product is Pareto efficient if no other product is better in all dimensions
      const isDominated = productsData.some((otherProduct) => {
        if (product.id === otherProduct.id) return false;

        const betterPrice = otherProduct.priceValue < product.priceValue;
        const betterWeight = otherProduct.weightValue < product.weightValue;
        const betterChargeTime =
          otherProduct.chargeTimeValue < product.chargeTimeValue;

        // If another product is better in all dimensions, this product is dominated (not Pareto efficient)
        return betterPrice && betterWeight && betterChargeTime;
      });

      return {
        ...product,
        paretoEfficient: !isDominated,
      };
    });
  };

  // Calculate weighted score for each product based on user priorities
  const calculateScore = (product: DefibrillatorProduct) => {
    if (!product.priceValue || !product.weightValue || !product.chargeTimeValue)
      return 0;

    // Normalize values between 0-100 (lower is better for all metrics)
    const maxPrice = Math.max(...products.map((p) => p.priceValue || 0));
    const maxWeight = Math.max(...products.map((p) => p.weightValue || 0));
    const maxChargeTime = Math.max(
      ...products.map((p) => p.chargeTimeValue || 0)
    );

    const normalizedPrice = 100 - (product.priceValue / maxPrice) * 100;
    const normalizedWeight = 100 - (product.weightValue / maxWeight) * 100;
    const normalizedChargeTime =
      100 - (product.chargeTimeValue / maxChargeTime) * 100;

    // Apply weights based on user priorities
    return (
      normalizedPrice * (priorities.price / 100) +
      normalizedWeight * (priorities.weight / 100) +
      normalizedChargeTime * (priorities.chargeTime / 100)
    );
  };

  // Toggle product selection
  const toggleProductSelection = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, selected: !product.selected }
          : product
      )
    );
  };

  // Sort products by weighted score
  const sortedProducts = [...products].sort(
    (a, b) => calculateScore(b) - calculateScore(a)
  );

  // Get selected products
  const selectedProducts = products.filter((product) => product.selected);

  // Handler for slider changes
  const handlePriorityChange = (
    metric: "price" | "weight" | "chargeTime",
    value: number
  ) => {
    // Calculate the adjustment needed for other priorities
    const adjustment = (value - priorities[metric]) / 2;

    // Get the other two metrics
    const otherMetrics = ["price", "weight", "chargeTime"].filter(
      (m) => m !== metric
    ) as Array<"price" | "weight" | "chargeTime">;

    // Distribute the adjustment to the other metrics
    const newPriorities = {
      ...priorities,
      [metric]: value,
      [otherMetrics[0]]: Math.max(
        0,
        Math.min(100, priorities[otherMetrics[0]] - adjustment)
      ),
      [otherMetrics[1]]: Math.max(
        0,
        Math.min(100, priorities[otherMetrics[1]] - adjustment)
      ),
    };

    // Normalize to ensure sum is always 100
    const sum =
      newPriorities.price + newPriorities.weight + newPriorities.chargeTime;
    if (sum !== 100) {
      const factor = 100 / sum;
      newPriorities.price = Math.round(newPriorities.price * factor);
      newPriorities.weight = Math.round(newPriorities.weight * factor);
      newPriorities.chargeTime =
        100 - newPriorities.price - newPriorities.weight;
    }

    setPriorities(newPriorities);
  };

  // THREE.js setup and rendering
  useEffect(() => {
    if (!containerRef.current || selectedTab !== "graph" || viewMode !== "3d")
      return;

    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.position.y = 2;
    camera.position.x = 2;
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Add axes
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Add grid
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Add axis labels
    const addAxisLabel = (
      text: string,
      position: THREE.Vector3,
      color: string
    ) => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 64;
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = color;
        context.font = "bold 24px Arial";
        context.textAlign = "center";
        context.fillText(text, 64, 32);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.position.copy(position);
        sprite.scale.set(1.5, 0.75, 1);
        scene.add(sprite);
      }
    };

    // Add axis labels
    addAxisLabel("Price", new THREE.Vector3(5.5, 0, 0), "#4338ca");
    addAxisLabel("Weight", new THREE.Vector3(0, 5.5, 0), "#4338ca");
    addAxisLabel("Charge Time", new THREE.Vector3(0, 0, 5.5), "#4338ca");

    // Clean up function
    return () => {
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }

      // Clear scene
      if (sceneRef.current) {
        sceneRef.current.clear();
      }

      // Dispose of resources
      Object.values(pointsRef.current).forEach((mesh) => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => material.dispose());
        } else {
          mesh.material.dispose();
        }
      });

      rendererRef.current?.dispose();
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
      pointsRef.current = {};
    };
  }, [selectedTab, viewMode]);

  // Render 3D points
  useEffect(() => {
    if (
      !sceneRef.current ||
      !cameraRef.current ||
      !rendererRef.current ||
      !controlsRef.current ||
      selectedTab !== "graph" ||
      viewMode !== "3d"
    )
      return;

    // Clear previous points
    Object.values(pointsRef.current).forEach((mesh) => {
      if (sceneRef.current) {
        sceneRef.current.remove(mesh);
      }
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((material) => material.dispose());
      } else {
        mesh.material.dispose();
      }
    });
    pointsRef.current = {};

    // Find max values for normalization
    const maxPrice = Math.max(...products.map((p) => p.priceValue || 0));
    const maxWeight = Math.max(...products.map((p) => p.weightValue || 0));
    const maxChargeTime = Math.max(
      ...products.map((p) => p.chargeTimeValue || 0)
    );

    // Add points for each product
    products.forEach((product) => {
      if (
        !product.priceValue ||
        !product.weightValue ||
        !product.chargeTimeValue
      )
        return;

      // Normalize values to 0-10 range (to fit in our scene)
      const x = (product.priceValue / maxPrice) * 10;
      const y = (product.weightValue / maxWeight) * 10;
      const z = (product.chargeTimeValue / maxChargeTime) * 10;

      // Create sphere for point
      const geometry = new THREE.SphereGeometry(0.2, 32, 32);

      // Set material based on whether the product is Pareto efficient
      const material = new THREE.MeshStandardMaterial({
        color: product.paretoEfficient ? 0x4f46e5 : 0xcccccc,
        emissive: product.selected ? 0x22c55e : 0x000000,
        emissiveIntensity: product.selected ? 0.5 : 0,
      });

      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(x, y, z);

      // Add to scene
      if (sceneRef.current) {
        sceneRef.current.add(sphere);
      }

      // Store reference for later updates
      pointsRef.current[product.id] = sphere;

      // Add text label for product ID
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = product.paretoEfficient ? "#4f46e5" : "#666666";
        context.font = "bold 40px Arial";
        context.textAlign = "center";
        context.fillText(product.id, 32, 40);

        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(labelMaterial);
        sprite.position.set(x, y + 0.4, z);
        sprite.scale.set(0.6, 0.6, 0.6);
        if (sceneRef.current) {
          sceneRef.current.add(sprite);
        }
      }
    });

    // Connect Pareto efficient points with lines
    const paretoProducts = products
      .filter((p) => p.paretoEfficient)
      .sort((a, b) => (a.priceValue || 0) - (b.priceValue || 0));

    // Create convex hull of Pareto efficient points
    if (paretoProducts.length >= 3) {
      // Create lines between Pareto-efficient points
      for (let i = 0; i < paretoProducts.length; i++) {
        for (let j = i + 1; j < paretoProducts.length; j++) {
          const product1 = paretoProducts[i];
          const product2 = paretoProducts[j];

          if (
            !product1.priceValue ||
            !product1.weightValue ||
            !product1.chargeTimeValue ||
            !product2.priceValue ||
            !product2.weightValue ||
            !product2.chargeTimeValue
          )
            continue;

          const x1 = (product1.priceValue / maxPrice) * 10;
          const y1 = (product1.weightValue / maxWeight) * 10;
          const z1 = (product1.chargeTimeValue / maxChargeTime) * 10;

          const x2 = (product2.priceValue / maxPrice) * 10;
          const y2 = (product2.weightValue / maxWeight) * 10;
          const z2 = (product2.chargeTimeValue / maxChargeTime) * 10;

          const points = [
            new THREE.Vector3(x1, y1, z1),
            new THREE.Vector3(x2, y2, z2),
          ];

          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({
            color: 0x4f46e5,
            transparent: true,
            opacity: 0.6,
            linewidth: 1,
          });

          const line = new THREE.Line(geometry, material);
          if (sceneRef.current) {
            sceneRef.current.add(line);
          }
        }
      }
    }

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current)
        return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [products, selectedTab, viewMode]);

  // Update 3D visualization when product selection changes
  useEffect(() => {
    if (!sceneRef.current || viewMode !== "3d") return;

    // Update material for each point based on selection
    products.forEach((product) => {
      const mesh = pointsRef.current[product.id];
      if (mesh) {
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.emissive.set(product.selected ? 0x22c55e : 0x000000);
        material.emissiveIntensity = product.selected ? 0.5 : 0;
        material.needsUpdate = true;
      }
    });
  }, [products, viewMode]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            Compare Products
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <div className="relative">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-gray-600" />
                </button>
                <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {selectedProducts.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Priority Sliders */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Customize Your Priorities
          </h2>

          <div className="grid gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <span className="inline-block w-24">Price</span>
                  <span className="ml-2 text-indigo-600">
                    {priorities.price}%
                  </span>
                </label>
                <span className="text-xs text-gray-500">Lower is better</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={priorities.price}
                onChange={(e) =>
                  handlePriorityChange("price", parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <span className="inline-block w-24">Weight</span>
                  <span className="ml-2 text-indigo-600">
                    {priorities.weight}%
                  </span>
                </label>
                <span className="text-xs text-gray-500">Lower is better</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={priorities.weight}
                onChange={(e) =>
                  handlePriorityChange("weight", parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <span className="inline-block w-24">Charge Time</span>
                  <span className="ml-2 text-indigo-600">
                    {priorities.chargeTime}%
                  </span>
                </label>
                <span className="text-xs text-gray-500">Lower is better</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={priorities.chargeTime}
                onChange={(e) =>
                  handlePriorityChange("chargeTime", parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Visualization Tabs */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  selectedTab === "graph"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setSelectedTab("graph")}
              >
                Pareto Front Graph
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  selectedTab === "table"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setSelectedTab("table")}
              >
                Comparison Table
              </button>
            </div>

            {selectedTab === "graph" && (
              <div className="flex justify-end items-center p-2 bg-gray-50">
                <div className="flex space-x-2">
                  <button
                    className={`flex items-center px-3 py-1.5 rounded text-sm font-medium ${
                      viewMode === "2d"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setViewMode("2d")}
                  >
                    <Square className="h-4 w-4 mr-1.5" />
                    2D View
                  </button>
                  <button
                    className={`flex items-center px-3 py-1.5 rounded text-sm font-medium ${
                      viewMode === "3d"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setViewMode("3d")}
                  >
                    <Boxes className="h-4 w-4 mr-1.5" />
                    3D View
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-4">
            {selectedTab === "graph" ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <h2 className="text-lg font-medium text-gray-900">
                      {viewMode === "3d"
                        ? "3D Pareto Front"
                        : "Optimal Choices (Pareto Front)"}
                    </h2>
                    <button
                      className="ml-2 text-gray-400 hover:text-gray-600"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      <Info className="h-4 w-4" />
                    </button>
                    {showTooltip && (
                      <div className="absolute mt-8 bg-gray-800 text-white text-xs rounded p-2 max-w-xs z-50">
                        {viewMode === "3d"
                          ? "The 3D Pareto front visualizes all three criteria simultaneously. Products are optimal when no other product is better in all three dimensions."
                          : "The Pareto front shows optimal choices where improving one attribute requires sacrificing another. Click on points to select/compare products."}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <span className="inline-block w-3 h-3 bg-indigo-500 rounded-full"></span>
                      <span>Pareto Efficient</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <span className="inline-block w-3 h-3 bg-gray-300 rounded-full"></span>
                      <span>Dominated</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <span className="inline-block w-3 h-3 border-2 border-green-500 rounded-full"></span>
                      <span>Selected</span>
                    </div>
                  </div>
                </div>

                {viewMode === "3d" ? (
                  <div className="relative" style={{ height: "500px" }}>
                    {/* 3D Visualization */}
                    <div
                      ref={containerRef}
                      className="w-full h-full border border-gray-200 rounded-lg overflow-hidden"
                    ></div>

                    <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-md text-xs">
                      <div className="font-medium mb-1">Navigation:</div>
                      <div>• Rotate: Left click + drag</div>
                      <div>• Pan: Right click + drag</div>
                      <div>• Zoom: Mouse wheel</div>
                    </div>

                    {hoveredProduct && (
                      <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded shadow-lg p-3 z-40 text-sm w-64">
                        <div className="font-bold text-gray-900 mb-2">
                          Product {hoveredProduct}
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                          <div className="text-gray-500">Price:</div>
                          <div className="text-gray-900 font-medium">
                            $
                            {products
                              .find((p) => p.id === hoveredProduct)
                              ?.price.toLocaleString()}
                          </div>
                          <div className="text-gray-500">Weight:</div>
                          <div className="text-gray-900 font-medium">
                            {
                              products.find((p) => p.id === hoveredProduct)
                                ?.weight
                            }
                          </div>
                          <div className="text-gray-500">Charge Time:</div>
                          <div className="text-gray-900 font-medium">
                            {
                              products.find((p) => p.id === hoveredProduct)
                                ?.chargeTime
                            }
                          </div>
                          <div className="text-gray-500">Score:</div>
                          <div className="text-gray-900 font-medium">
                            {calculateScore(
                              products.find((p) => p.id === hoveredProduct) ||
                                products[0]
                            ).toFixed(1)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative h-72 border border-gray-200 rounded-lg p-4">
                    {/* X-axis and Y-axis labels */}
                    <div className="absolute inset-x-0 bottom-2 flex justify-center text-sm text-gray-600">
                      Price (lower is better)
                    </div>
                    <div className="absolute left-2 inset-y-0 flex items-center -rotate-90 transform origin-center text-sm text-gray-600">
                      Weight (lower is better)
                    </div>

                    {/* Scatter plot points */}
                    {products.map((product) => {
                      // Normalize coordinates for the chart
                      const maxPrice = Math.max(
                        ...products.map((p) => p.priceValue || 0)
                      );
                      const maxWeight = Math.max(
                        ...products.map((p) => p.weightValue || 0)
                      );

                      const x =
                        100 - ((product.priceValue || 0) / maxPrice) * 80 + 10; // 10-90% of width
                      const y =
                        10 + ((product.weightValue || 0) / maxWeight) * 80; // 10-90% of height, inverted for y-axis

                      // Size based on charge time (smaller is better)
                      const maxChargeTime = Math.max(
                        ...products.map((p) => p.chargeTimeValue || 0)
                      );
                      const size =
                        10 -
                        ((product.chargeTimeValue || 0) / maxChargeTime) * 6 +
                        4; // 4-10px

                      const isHovered = hoveredProduct === product.id;

                      return (
                        <React.Fragment key={product.id}>
                          <button
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer hover:z-10 transition-all duration-200 ${
                              product.paretoEfficient
                                ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                                : "bg-gray-300 hover:bg-gray-400 text-gray-900"
                            } ${
                              product.selected
                                ? "ring-2 ring-offset-2 ring-green-500"
                                : ""
                            } ${isHovered ? "z-30 scale-110" : "z-20"}`}
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              width: `${size * 2}px`,
                              height: `${size * 2}px`,
                            }}
                            onClick={() => toggleProductSelection(product.id)}
                            onMouseEnter={() => setHoveredProduct(product.id)}
                            onMouseLeave={() => setHoveredProduct(null)}
                          >
                            {product.id}
                          </button>

                          {/* Hover tooltip */}
                          {isHovered && (
                            <div
                              className="absolute bg-white border border-gray-200 rounded shadow-lg p-2 z-40 text-xs w-48"
                              style={{
                                left: `${Math.min(x + 5, 85)}%`,
                                top: `${Math.min(y - 5, 80)}%`,
                              }}
                            >
                              <div className="font-bold text-gray-900 mb-1">
                                {product.title}
                              </div>
                              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-gray-500">Price:</div>
                                <div className="text-gray-900 font-medium">
                                  ${product.price.toLocaleString()}
                                </div>
                                <div className="text-gray-500">Weight:</div>
                                <div className="text-gray-900 font-medium">
                                  {product.weight}
                                </div>
                                <div className="text-gray-500">
                                  Charge Time:
                                </div>
                                <div className="text-gray-900 font-medium">
                                  {product.chargeTime}
                                </div>
                                <div className="text-gray-500">Score:</div>
                                <div className="text-gray-900 font-medium">
                                  {calculateScore(product).toFixed(1)}
                                </div>
                              </div>
                              <div className="mt-1 pt-1 border-t border-gray-200 text-center">
                                Click to{" "}
                                {product.selected ? "remove" : "select"}
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}

                    {/* Pareto Front line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="7"
                          refX="0"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon
                            points="0 0, 10 3.5, 0 7"
                            fill="currentColor"
                            className="text-indigo-500"
                          />
                        </marker>
                      </defs>
                      {products
                        .filter((p) => p.paretoEfficient)
                        .sort(
                          (a, b) => (a.priceValue || 0) - (b.priceValue || 0)
                        )
                        .map((product, index, array) => {
                          if (index === array.length - 1) return null;

                          const nextProduct = array[index + 1];

                          // Normalize coordinates for the chart
                          const maxPrice = Math.max(
                            ...products.map((p) => p.priceValue || 0)
                          );
                          const maxWeight = Math.max(
                            ...products.map((p) => p.weightValue || 0)
                          );

                          const x1 =
                            100 -
                            ((product.priceValue || 0) / maxPrice) * 80 +
                            10;
                          const y1 =
                            10 + ((product.weightValue || 0) / maxWeight) * 80;

                          const x2 =
                            100 -
                            ((nextProduct.priceValue || 0) / maxPrice) * 80 +
                            10;
                          const y2 =
                            10 +
                            ((nextProduct.weightValue || 0) / maxWeight) * 80;

                          return (
                            <line
                              key={`${product.id}-${nextProduct.id}`}
                              x1={`${x1}%`}
                              y1={`${y1}%`}
                              x2={`${x2}%`}
                              y2={`${y2}%`}
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeDasharray="4"
                              className="text-indigo-500"
                            />
                          );
                        })}
                    </svg>
                  </div>
                )}

                <div className="mt-4 text-sm text-gray-600">
                  {viewMode === "3d" ? (
                    <>
                      <p>
                        <strong>3D Pareto Front:</strong> This visualization
                        shows all three criteria (price, weight, charge time)
                        simultaneously. Products that represent optimal
                        trade-offs form the Pareto front.
                      </p>
                      <p className="mt-2">
                        <strong>Axes:</strong> X-axis = Price, Y-axis = Weight,
                        Z-axis = Charge Time (lower values are better for all)
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>Pareto Front:</strong> These are the optimal
                        choices where improving one attribute (price, weight,
                        charge time) requires sacrificing another. Products on
                        this front represent the best trade-offs.
                      </p>
                      <p className="mt-2">
                        <strong>Circle Size:</strong> Indicates charge time
                        (smaller circles = faster charging)
                      </p>
                    </>
                  )}
                </div>

                {/* Selected Products Summary */}
                {selectedProducts.length > 0 && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="text-md font-medium text-gray-900 mb-3">
                      Selected Products ({selectedProducts.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedProducts.map((product) => (
                        <div
                          key={`selected-${product.id}`}
                          className="bg-green-50 border border-green-200 rounded-lg p-3 relative"
                        >
                          <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                            onClick={() => toggleProductSelection(product.id)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold mr-2">
                              {product.id}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm">
                                {product.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {product.brand}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                            <div className="bg-white rounded p-1 text-center">
                              <div className="text-gray-500">Price</div>
                              <div className="font-medium">
                                ${product.price.toLocaleString()}
                              </div>
                            </div>
                            <div className="bg-white rounded p-1 text-center">
                              <div className="text-gray-500">Weight</div>
                              <div className="font-medium">
                                {product.weight}
                              </div>
                            </div>
                            <div className="bg-white rounded p-1 text-center">
                              <div className="text-gray-500">Charge</div>
                              <div className="font-medium">
                                {product.chargeTime}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
                        Compare Selected ({selectedProducts.length})
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Table View
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    Ranked Products Based on Your Priorities
                  </h2>
                  <p className="text-sm text-gray-600">
                    Click on any row to select/deselect a product for comparison
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 border-b">
                          Rank
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 border-b">
                          Product
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 border-b">
                          Price
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 border-b">
                          Weight
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 border-b">
                          Charge Time
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 border-b">
                          Score
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 border-b">
                          Pareto Efficient
                        </th>
                        <th className="py-3 px-4 text-center text-sm font-medium text-gray-500 border-b">
                          Selected
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sortedProducts.map((product, index) => (
                        <tr
                          key={product.id}
                          className={`${
                            product.selected
                              ? "bg-green-50"
                              : index % 2 === 0
                              ? "bg-white"
                              : "bg-gray-50"
                          } 
      hover:bg-gray-100 cursor-pointer transition-colors`}
                          onClick={() => toggleProductSelection(product.id)}
                        >
                          <td className="py-3 px-4 text-sm">
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                                index < 3
                                  ? "bg-indigo-500 text-white"
                                  : "bg-gray-200 text-gray-700"
                              } font-medium`}
                            >
                              {index + 1}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3 font-medium">
                                {product.id}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 text-sm">
                                  {product.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {product.brand}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            ${product.price.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {product.weight}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {product.chargeTime}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium">
                            {calculateScore(product).toFixed(1)}
                          </td>
                          <td className="py-3 px-4">
                            {product.paretoEfficient ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Optimal
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Dominated
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div
                              className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
                                product.selected
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {product.selected ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Selected Products Summary */}
                {selectedProducts.length > 0 && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="text-md font-medium text-gray-900 mb-3">
                      Selected Products ({selectedProducts.length})
                    </h3>
                    <div className="flex justify-end">
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
                        Compare Selected ({selectedProducts.length})
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Product Recommendations */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Top Recommended Products
            </h2>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {sortedProducts.slice(0, 3).map((product, index) => (
              <div
                key={`rec-${product.id}`}
                className={`rounded-lg border ${
                  product.selected
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200"
                } overflow-hidden`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                      {index + 1}
                    </span>
                    {product.paretoEfficient && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Pareto Optimal
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900">{product.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{product.brand}</p>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-gray-500">Price</div>
                      <div className="font-medium">
                        ${product.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-gray-500">Weight</div>
                      <div className="font-medium">{product.weight}</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-gray-500">Charge</div>
                      <div className="font-medium">{product.chargeTime}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Score:{" "}
                      <span className="font-medium text-indigo-600">
                        {calculateScore(product).toFixed(1)}
                      </span>
                    </div>
                    <button
                      className={`flex items-center text-sm px-3 py-1.5 rounded ${
                        product.selected
                          ? "bg-green-100 text-green-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                      onClick={() => toggleProductSelection(product.id)}
                    >
                      {product.selected ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Selected
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          Select
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
