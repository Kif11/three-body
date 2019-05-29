const THREE = AFRAME.THREE;

const t1 = new THREE.Vector3();
const t2 = new THREE.Vector3();
const t3 = new THREE.Vector3();
const m1 = new THREE.Matrix4();
const UP = new THREE.Vector3(0,1,0);
//util
export function setQuaternionFromDirection(direction, up, target) {
  const x = t1;
  const y = t2;
  const z = t3;
  const m = m1;
  const el = m1.elements;

  z.copy(direction);
  x.crossVectors(up, z);


  if (x.lengthSq() === 0) {
    // parallel
    if (Math.abs(up.z) === 1) {
      z.x += 0.0001;
    } else {
      z.z += 0.0001;
    }
    z.normalize();
    x.crossVectors(up, z);
  }

  x.normalize();
  y.crossVectors(z, x);

  el[0] = x.x; el[4] = y.x; el[8] = z.x;
  el[1] = x.y; el[5] = y.y; el[9] = z.y;
  el[2] = x.z; el[6] = y.z; el[10] = z.z;

  target.setFromRotationMatrix(m);
}
