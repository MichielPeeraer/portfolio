import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import EarthGLB from "../../assets/3d/earth.glb";
import { DirectionalLight, AmbientLight } from "three";

const ambientLight = new AmbientLight("#fff", 0.1);
const directionalLight = new DirectionalLight("#fff", 2);
directionalLight.position.set(-10, 4, 2);
directionalLight.castShadow = true;

const Earth = () => {
	const earth = useGLTF(EarthGLB);
	return <primitive object={earth.scene} scale={1.5} />;
};

const EarthCanvas = () => {
	return (
		<Canvas
			style={{ height: "250px", zIndex: -1 }}
			shadows
			frameloop="demand"
			dpr={[1, 2]}
			gl={{ preserveDrawingBuffer: true }}
			camera={{
				fov: 45,
				near: 0.1,
				far: 200,
			}}
			onCreated={({ camera, scene }) => {
				camera.add(ambientLight);
				camera.add(directionalLight);
				scene.add(camera);
			}}
		>
			<Suspense fallback={null}>
				<OrbitControls
					autoRotate
					autoRotateSpeed={1}
					enablePan={false}
					enableZoom={false}
					enableRotate={false}
					maxPolarAngle={Math.PI / 3}
					minPolarAngle={Math.PI / 3}
				/>
				<Earth />
				<Preload all />
			</Suspense>
		</Canvas>
	);
};

export default EarthCanvas;
