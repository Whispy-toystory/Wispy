// PlayContent.js
import React from 'react';

import { CharacterModel } from './CharacterModel';
import { GrassModel } from './GrassModel';
import { Skybox } from './Skybox';
export function PlayContent() {
  return (
    <>
      {/* 조명*/}
      <ambientLight intensity={2} />
      <hemisphereLight intensity={0.5} groundColor="#ffffff" skyColor="#eeeeee" />
      <directionalLight position={[0, 5, 5]} intensity={5} castShadow={false} />
      <directionalLight position={[0, 5, -5]} intensity={1.5} castShadow={false} />
      <spotLight
        position={[0, -0.5, 2.5]}
        angle={Math.PI / 2}
        penumbra={10}
        intensity={1}
        castShadow={false}
      />
      <Skybox rotationX={-0.6} rotationY={15} />

      {/* 캐릭터 */}
      <CharacterModel scale={1} position={[0, -0.5, 0]} />
      
      {/* 잔디 */}
      <GrassModel
        scale={0.04}
        position={[0, -2, -1]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </>
  );
}
