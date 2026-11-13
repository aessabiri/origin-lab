import * as THREE from 'three';

/**
 * Fast WebGL Geometry Optimizer & Vertex Decimation Engine for Mid-to-Low Hardware
 * Uses Geometry-UUID caching so right and mirrored left limb meshes share a single GPU buffer.
 */
export class GeometryOptimizer {
  static defaultInstance = new GeometryOptimizer();

  static registerMesh(mesh) {
    return GeometryOptimizer.defaultInstance.registerMesh(mesh);
  }

  static applySceneLOD(meshes, ratio) {
    if (Array.isArray(meshes)) {
      meshes.forEach((m) => GeometryOptimizer.defaultInstance.registerMesh(m));
    }
    return GeometryOptimizer.defaultInstance.applyVertexResolution(ratio);
  }

  constructor() {
    this.geometryCache = new Map();
  }

  registerMesh(mesh) {
    if (!mesh || !mesh.geometry) return;
    if (!mesh.userData.originalGeometry) {
      mesh.userData.originalGeometry = mesh.geometry;
    }
    const origGeom = mesh.userData.originalGeometry;
    const geomId = origGeom.uuid;

    if (!this.geometryCache.has(geomId)) {
      this.geometryCache.set(geomId, {
        original: origGeom,
        cachedLODs: new Map(),
        meshes: new Set([mesh]),
      });
    } else {
      this.geometryCache.get(geomId).meshes.add(mesh);
    }
  }

  getDecimatedGeometry(geomId, targetRatio) {
    const entry = this.geometryCache.get(geomId);
    if (!entry) return null;

    if (targetRatio >= 0.98) {
      return entry.original;
    }

    const roundedRatio = Math.max(0.25, Math.min(1.0, Math.round(targetRatio * 20) / 20));
    if (entry.cachedLODs.has(roundedRatio)) {
      return entry.cachedLODs.get(roundedRatio);
    }

    const original = entry.original;
    const pos = original.attributes?.position;
    if (!pos) return original;

    const indices = original.index ? original.index.array : null;

    if (!indices || indices.length === 0) {
      const step = Math.max(1, Math.round(1 / roundedRatio));
      const newPos = [];
      for (let i = 0; i < pos.count; i += step * 3) {
        if (i + 2 < pos.count) {
          for (let j = 0; j < 3; j++) {
            newPos.push(pos.getX(i + j), pos.getY(i + j), pos.getZ(i + j));
          }
        }
      }
      const simp = new THREE.BufferGeometry();
      simp.setAttribute('position', new THREE.Float32BufferAttribute(newPos, 3));
      simp.computeVertexNormals();
      entry.cachedLODs.set(roundedRatio, simp);
      return simp;
    }

    const step = Math.max(1, Math.round(1 / roundedRatio));
    const newIndices = [];
    for (let i = 0; i < indices.length; i += 3 * step) {
      if (i + 2 < indices.length) {
        newIndices.push(indices[i], indices[i + 1], indices[i + 2]);
      }
    }

    const simp = original.clone();
    simp.setIndex(newIndices);
    simp.computeVertexNormals();

    entry.cachedLODs.set(roundedRatio, simp);
    return simp;
  }

  applyVertexResolution(ratio) {
    let totalVertices = 0;
    let totalTriangles = 0;

    for (const [geomId, entry] of this.geometryCache.entries()) {
      const decimatedGeom = this.getDecimatedGeometry(geomId, ratio);
      if (decimatedGeom) {
        for (const mesh of entry.meshes) {
          mesh.geometry = decimatedGeom;
        }
        const meshCount = entry.meshes.size;
        if (decimatedGeom.index) {
          totalTriangles += (decimatedGeom.index.count / 3) * meshCount;
          totalVertices += decimatedGeom.attributes.position.count * meshCount;
        } else if (decimatedGeom.attributes?.position) {
          totalTriangles += (decimatedGeom.attributes.position.count / 3) * meshCount;
          totalVertices += decimatedGeom.attributes.position.count * meshCount;
        }
      }
    }

    return {
      totalVertices: Math.round(totalVertices),
      totalTriangles: Math.round(totalTriangles),
    };
  }

  dispose() {
    for (const entry of this.geometryCache.values()) {
      for (const lod of entry.cachedLODs.values()) {
        lod.dispose();
      }
      entry.meshes.clear();
    }
    this.geometryCache.clear();
  }
}
