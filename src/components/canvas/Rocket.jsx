import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import RocketGLB from "../../assets/3d/rocket.glb";
import { DirectionalLight } from "three";

const light = new DirectionalLight("#ffffff", 2);
light.position.set(5, 5, 5);
light.castShadow = true;

const Rocket = () => {
	const rocket = useGLTF(RocketGLB);

	return (
		<primitive
			object={rocket.scene}
			scale={1}
			rotation-z={45}
			position={[2, -1, 0]}
		/>
	);
};

const RocketCanvas = () => {
	return (
		<Canvas
			style={{ width: "100%", height: "250px" }}
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
				camera.add(light);
				scene.add(camera);
			}}
		>
			<Suspense fallback={null}>
				<OrbitControls
					autoRotate
					enablePan={false}
					enableZoom={false}
					maxPolarAngle={Math.PI / 2}
					minPolarAngle={Math.PI / 2}
				/>
				<Rocket />
				<Preload all />
			</Suspense>
		</Canvas>
	);
};

export default RocketCanvas;
