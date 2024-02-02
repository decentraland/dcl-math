import { buildArray } from './utils'
import { Vector3 } from './Vector3'
import { Quaternion } from './Quaternion'
import { Matrix } from './Matrix'

// Temporary pre-allocated objects for engine internal use
// usage in any internal function :
// var tmp = Tmp.Vector3[0];   <= gets access to the first pre-created Vector3
// There's a Tmp array per object type : int, float, Vector2, Vector3, Vector4, Quaternion, Matrix

let MathTmp: {
  Vector3: Vector3[]
  Matrix: Matrix[]
  Quaternion: Quaternion[]
  staticUp: Readonly<Vector3>
  tmpMatrix: Matrix
}

/**
 * @public
 * Same as Tmp but not exported to keep it only for math functions to avoid conflicts
 */
export function getMathTmp() {
  if (MathTmp) {
    return MathTmp
  }

  MathTmp = {
    Vector3: buildArray(6, Vector3.Zero),
    Matrix: buildArray(2, Matrix.Identity),
    Quaternion: buildArray(3, Quaternion.Zero),
    staticUp: Vector3.Up() as Readonly<Vector3>,
    tmpMatrix: Matrix.Zero()
  }

  return MathTmp
}
