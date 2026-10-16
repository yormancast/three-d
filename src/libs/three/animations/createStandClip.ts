import * as THREE from 'three';

// Bones inferred from rig hierarchy.
// joint12_074 / joint27_081 = left & right upper leg (hip joints)
// joint13_075 / joint13_082 = left & right lower leg (knee joints)
const ROOT = '_rootJoint';
const LEFT_HIP = 'joint12_074';
const RIGHT_HIP = 'joint27_081';
const LEFT_KNEE = 'joint13_075';
const RIGHT_KNEE = 'joint13_082';

const findByName = (bones: any[], name: string): any =>
  bones.find((b: any) => b.name === name);

const q2arr = (q: any): number[] => [q.x, q.y, q.z, q.w];

export const createStandClip = (skeleton: any): any | null => {
  const bones: any[] = skeleton.bones;
  const tracks: any[] = [];

  // Sitting pose (bind) → rising → standing
  const times = [0, 0.4, 0.6];

  // Lift root upward and slightly forward as the character rises off the bench.
  // Tune these values if the character over/undershoots.
  const root = findByName(bones, ROOT);
  if (root) {
    tracks.push(new THREE.VectorKeyframeTrack(
      `${ROOT}.position`,
      times,
      [
        0, 0,    0,    // seated
        0, 0.5,  0.2,  // mid-rise, leaning forward
        0, 1.0,  0,    // standing, settled
      ]
    ));
  }

  // Hip joints: rotate from sitting (~90° forward) to straight.
  // Flip sign if the legs move the wrong way.
  const sitHipQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(1.4, 0, 0));
  const standQ = new THREE.Quaternion();

  [LEFT_HIP, RIGHT_HIP].forEach(name => {
    const bone = findByName(bones, name);
    if (bone) {
      tracks.push(new THREE.QuaternionKeyframeTrack(
        `${name}.quaternion`,
        times,
        [...q2arr(sitHipQ), ...q2arr(standQ), ...q2arr(standQ)]
      ));
    }
  });

  // Knee joints: straighten from bent (~120°).
  // Knees bend opposite to hips so the sign is negated.
  const sitKneeQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(-1.2, 0, 0));

  [LEFT_KNEE, RIGHT_KNEE].forEach(name => {
    const bone = findByName(bones, name);
    if (bone) {
      tracks.push(new THREE.QuaternionKeyframeTrack(
        `${name}.quaternion`,
        times,
        [...q2arr(sitKneeQ), ...q2arr(standQ), ...q2arr(standQ)]
      ));
    }
  });

  if (!tracks.length) {
    console.warn('[stand clip] no bones matched');
    return null;
  }

  return new THREE.AnimationClip('stand', 0.6, tracks);
};
