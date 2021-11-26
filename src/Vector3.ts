import { MathTmp } from './preallocatedVariables'
import { FloatArray, Epsilon, ReadOnlyVector3 } from './types'
import { Matrix } from './Matrix'
import { Quaternion } from './Quaternion'
import { Scalar } from './Scalar'

/**
 * Classed used to store (x,y,z) vector representation
 * A Vector3 is the main object used in 3D geometry
 * It can represent etiher the coordinates of a point the space, either a direction
 * Reminder: Babylon.js uses a left handed forward facing system
 * @public
 */
export class Vector3 implements ReadOnlyVector3 {
  /**
   * Gets a boolean indicating that the vector is non uniform meaning x, y or z are not all the same
   */
  public get isNonUniform(): boolean {
    const absX = Math.abs(this.x)
    const absY = Math.abs(this.y)
    if (absX !== absY) {
      return true
    }

    const absZ = Math.abs(this.z)
    if (absX !== absZ) {
      return true
    }

    if (absY !== absZ) {
      return true
    }

    return false
  }
  /**
   * Creates a new Vector3 object from the given x, y, z (floats) coordinates.
   * @param x - defines the first coordinates (on X axis)
   * @param y - defines the second coordinates (on Y axis)
   * @param z - defines the third coordinates (on Z axis)
   */
  constructor(
    /**
     * Defines the first coordinates (on X axis)
     */
    public x: number = 0,
    /**
     * Defines the second coordinates (on Y axis)
     */
    public y: number = 0,
    /**
     * Defines the third coordinates (on Z axis)
     */
    public z: number = 0
  ) {}

  // Statics

  /**
   * Returns a new Vector3 as the result of the addition of the two given vectors.
   * @param vector1 - the first vector
   * @param vector2 - the second vector
   * @returns the resulting vector
   */
  public static Add(
    vector1: ReadOnlyVector3,
    vector2: ReadOnlyVector3
  ): Vector3 {
    return new Vector3(vector1.x, vector1.y, vector1.z).addInPlace(vector2)
  }

  /**
   * Get the clip factor between two vectors
   * @param vector0 - defines the first operand
   * @param vector1 - defines the second operand
   * @param axis - defines the axis to use
   * @param size - defines the size along the axis
   * @returns the clip factor
   */
  public static GetClipFactor(
    vector0: ReadOnlyVector3,
    vector1: ReadOnlyVector3,
    axis: ReadOnlyVector3,
    size: number
  ) {
    const d0 = Vector3.Dot(vector0, axis) - size
    const d1 = Vector3.Dot(vector1, axis) - size

    const s = d0 / (d0 - d1)

    return s
  }

  /**
   * Get angle between two vectors
   * @param vector0 - angle between vector0 and vector1
   * @param vector1 - angle between vector0 and vector1
   * @param normal - direction of the normal
   * @returns the angle between vector0 and vector1
   */
  public static GetAngleBetweenVectors(
    vector0: Vector3,
    vector1: Vector3,
    normal: ReadOnlyVector3
  ): number {
    const v0: Vector3 = vector0.normalizeToRef(MathTmp.Vector3[1])
    const v1: Vector3 = vector1.normalizeToRef(MathTmp.Vector3[2])
    const dot: number = Vector3.Dot(v0, v1)
    const n = MathTmp.Vector3[3]
    Vector3.CrossToRef(v0, v1, n)
    if (Vector3.Dot(n, normal) > 0) {
      return Math.acos(dot)
    }
    return -Math.acos(dot)
  }

  /**
   * Returns a new Vector3 set from the index "offset" of the given array
   * @param array - defines the source array
   * @param offset - defines the offset in the source array
   * @returns the new Vector3
   */
  public static FromArray(
    array: ArrayLike<number>,
    offset: number = 0
  ): Vector3 {
    return new Vector3(array[offset], array[offset + 1], array[offset + 2])
  }

  /**
   * Returns a new Vector3 set from the index "offset" of the given FloatArray
   * This function is deprecated.  Use FromArray instead
   * @param array - defines the source array
   * @param offset - defines the offset in the source array
   * @returns the new Vector3
   */
  public static FromFloatArray(array: FloatArray, offset?: number): Vector3 {
    return Vector3.FromArray(array, offset)
  }

  /**
   * Sets the given vector "result" with the element values from the index "offset" of the given array
   * @param array - defines the source array
   * @param offset - defines the offset in the source array
   * @param result - defines the Vector3 where to store the result
   */
  public static FromArrayToRef(
    array: ArrayLike<number>,
    offset: number,
    result: Vector3
  ): void {
    result.x = array[offset]
    result.y = array[offset + 1]
    result.z = array[offset + 2]
  }

  /**
   * Sets the given vector "result" with the element values from the index "offset" of the given FloatArray
   * This function is deprecated.  Use FromArrayToRef instead.
   * @param array - defines the source array
   * @param offset - defines the offset in the source array
   * @param result - defines the Vector3 where to store the result
   */
  public static FromFloatArrayToRef(
    array: FloatArray,
    offset: number,
    result: Vector3
  ): void {
    return Vector3.FromArrayToRef(array, offset, result)
  }

  /**
   * Sets the given vector "result" with the given floats.
   * @param x - defines the x coordinate of the source
   * @param y - defines the y coordinate of the source
   * @param z - defines the z coordinate of the source
   * @param result - defines the Vector3 where to store the result
   */
  public static FromFloatsToRef(
    x: number,
    y: number,
    z: number,
    result: Vector3
  ): void {
    result.copyFromFloats(x, y, z)
  }

  /**
   * Returns a new Vector3 set to (0.0, 0.0, 0.0)
   * @returns a new empty Vector3
   */
  public static Zero(): Vector3 {
    return new Vector3(0.0, 0.0, 0.0)
  }
  /**
   * Returns a new Vector3 set to (1.0, 1.0, 1.0)
   * @returns a new unit Vector3
   */
  public static One(): Vector3 {
    return new Vector3(1.0, 1.0, 1.0)
  }
  /**
   * Returns a new Vector3 set to (0.0, 1.0, 0.0)
   * @returns a new up Vector3
   */
  public static Up(): Vector3 {
    return new Vector3(0.0, 1.0, 0.0)
  }
  /**
   * Returns a new Vector3 set to (0.0, -1.0, 0.0)
   * @returns a new down Vector3
   */
  public static Down(): Vector3 {
    return new Vector3(0.0, -1.0, 0.0)
  }
  /**
   * Returns a new Vector3 set to (0.0, 0.0, 1.0)
   * @returns a new forward Vector3
   */
  public static Forward(): Vector3 {
    return new Vector3(0.0, 0.0, 1.0)
  }
  /**
   * Returns a new Vector3 set to (0.0, 0.0, -1.0)
   * @returns a new forward Vector3
   */
  public static Backward(): Vector3 {
    return new Vector3(0.0, 0.0, -1.0)
  }
  /**
   * Returns a new Vector3 set to (1.0, 0.0, 0.0)
   * @returns a new right Vector3
   */
  public static Right(): Vector3 {
    return new Vector3(1.0, 0.0, 0.0)
  }
  /**
   * Returns a new Vector3 set to (-1.0, 0.0, 0.0)
   * @returns a new left Vector3
   */
  public static Left(): Vector3 {
    return new Vector3(-1.0, 0.0, 0.0)
  }

  /**
   * Returns a new Vector3 set with the result of the transformation by the given matrix of the given vector.
   * This method computes tranformed coordinates only, not transformed direction vectors (ie. it takes translation in account)
   * @param vector - defines the Vector3 to transform
   * @param transformation - defines the transformation matrix
   * @returns the transformed Vector3
   */
  public static TransformCoordinates(
    vector: ReadOnlyVector3,
    transformation: Matrix
  ): Vector3 {
    const result = Vector3.Zero()
    Vector3.TransformCoordinatesToRef(vector, transformation, result)
    return result
  }

  /**
   * Sets the given vector "result" coordinates with the result of the transformation by the given matrix of the given vector
   * This method computes tranformed coordinates only, not transformed direction vectors (ie. it takes translation in account)
   * @param vector - defines the Vector3 to transform
   * @param transformation - defines the transformation matrix
   * @param result - defines the Vector3 where to store the result
   */
  public static TransformCoordinatesToRef(
    vector: ReadOnlyVector3,
    transformation: Readonly<Matrix>,
    result: Vector3
  ): void {
    return Vector3.TransformCoordinatesFromFloatsToRef(
      vector.x,
      vector.y,
      vector.z,
      transformation,
      result
    )
  }

  /**
   * Sets the given vector "result" coordinates with the result of the transformation by the given matrix of the given floats (x, y, z)
   * This method computes tranformed coordinates only, not transformed direction vectors
   * @param x - define the x coordinate of the source vector
   * @param y - define the y coordinate of the source vector
   * @param z - define the z coordinate of the source vector
   * @param transformation - defines the transformation matrix
   * @param result - defines the Vector3 where to store the result
   */
  public static TransformCoordinatesFromFloatsToRef(
    x: number,
    y: number,
    z: number,
    transformation: Readonly<Matrix>,
    result: Vector3
  ): void {
    const m = transformation.m
    const rx = x * m[0] + y * m[4] + z * m[8] + m[12]
    const ry = x * m[1] + y * m[5] + z * m[9] + m[13]
    const rz = x * m[2] + y * m[6] + z * m[10] + m[14]
    const rw = 1 / (x * m[3] + y * m[7] + z * m[11] + m[15])

    result.x = rx * rw
    result.y = ry * rw
    result.z = rz * rw
  }

  /**
   * Returns a new Vector3 set with the result of the normal transformation by the given matrix of the given vector
   * This methods computes transformed normalized direction vectors only (ie. it does not apply translation)
   * @param vector - defines the Vector3 to transform
   * @param transformation - defines the transformation matrix
   * @returns the new Vector3
   */
  public static TransformNormal(
    vector: ReadOnlyVector3,
    transformation: Matrix
  ): Vector3 {
    const result = Vector3.Zero()
    Vector3.TransformNormalToRef(vector, transformation, result)
    return result
  }

  /**
   * Sets the given vector "result" with the result of the normal transformation by the given matrix of the given vector
   * This methods computes transformed normalized direction vectors only (ie. it does not apply translation)
   * @param vector - defines the Vector3 to transform
   * @param transformation - defines the transformation matrix
   * @param result - defines the Vector3 where to store the result
   */
  public static TransformNormalToRef(
    vector: ReadOnlyVector3,
    transformation: Readonly<Matrix>,
    result: Vector3
  ): void {
    this.TransformNormalFromFloatsToRef(
      vector.x,
      vector.y,
      vector.z,
      transformation,
      result
    )
  }

  /**
   * Sets the given vector "result" with the result of the normal transformation by the given matrix of the given floats (x, y, z)
   * This methods computes transformed normalized direction vectors only (ie. it does not apply translation)
   * @param x - define the x coordinate of the source vector
   * @param y - define the y coordinate of the source vector
   * @param z - define the z coordinate of the source vector
   * @param transformation - defines the transformation matrix
   * @param result - defines the Vector3 where to store the result
   */
  public static TransformNormalFromFloatsToRef(
    x: number,
    y: number,
    z: number,
    transformation: Readonly<Matrix>,
    result: Vector3
  ): void {
    const m = transformation.m
    result.x = x * m[0] + y * m[4] + z * m[8]
    result.y = x * m[1] + y * m[5] + z * m[9]
    result.z = x * m[2] + y * m[6] + z * m[10]
  }

  /**
   * Returns a new Vector3 located for "amount" on the CatmullRom interpolation spline defined by the vectors "value1", "value2", "value3", "value4"
   * @param value1 - defines the first control point
   * @param value2 - defines the second control point
   * @param value3 - defines the third control point
   * @param value4 - defines the fourth control point
   * @param amount - defines the amount on the spline to use
   * @returns the new Vector3
   */
  public static CatmullRom(
    value1: ReadOnlyVector3,
    value2: ReadOnlyVector3,
    value3: ReadOnlyVector3,
    value4: ReadOnlyVector3,
    amount: number
  ): Vector3 {
    const squared = amount * amount
    const cubed = amount * squared

    const x =
      0.5 *
      (2.0 * value2.x +
        (-value1.x + value3.x) * amount +
        (2.0 * value1.x - 5.0 * value2.x + 4.0 * value3.x - value4.x) *
          squared +
        (-value1.x + 3.0 * value2.x - 3.0 * value3.x + value4.x) * cubed)

    const y =
      0.5 *
      (2.0 * value2.y +
        (-value1.y + value3.y) * amount +
        (2.0 * value1.y - 5.0 * value2.y + 4.0 * value3.y - value4.y) *
          squared +
        (-value1.y + 3.0 * value2.y - 3.0 * value3.y + value4.y) * cubed)

    const z =
      0.5 *
      (2.0 * value2.z +
        (-value1.z + value3.z) * amount +
        (2.0 * value1.z - 5.0 * value2.z + 4.0 * value3.z - value4.z) *
          squared +
        (-value1.z + 3.0 * value2.z - 3.0 * value3.z + value4.z) * cubed)

    return new Vector3(x, y, z)
  }

  /**
   * Returns a new Vector3 set with the coordinates of "value", if the vector "value" is in the cube defined by the vectors "min" and "max"
   * If a coordinate value of "value" is lower than one of the "min" coordinate, then this "value" coordinate is set with the "min" one
   * If a coordinate value of "value" is greater than one of the "max" coordinate, then this "value" coordinate is set with the "max" one
   * @param value - defines the current value
   * @param min - defines the lower range value
   * @param max - defines the upper range value
   * @returns the new Vector3
   */
  public static Clamp(
    value: ReadOnlyVector3,
    min: ReadOnlyVector3,
    max: ReadOnlyVector3
  ): Vector3 {
    const v = new Vector3()
    Vector3.ClampToRef(value, min, max, v)
    return v
  }
  /**
   * Sets the given vector "result" with the coordinates of "value", if the vector "value" is in the cube defined by the vectors "min" and "max"
   * If a coordinate value of "value" is lower than one of the "min" coordinate, then this "value" coordinate is set with the "min" one
   * If a coordinate value of "value" is greater than one of the "max" coordinate, then this "value" coordinate is set with the "max" one
   * @param value - defines the current value
   * @param min - defines the lower range value
   * @param max - defines the upper range value
   * @param result - defines the Vector3 where to store the result
   */
  public static ClampToRef(
    value: ReadOnlyVector3,
    min: ReadOnlyVector3,
    max: ReadOnlyVector3,
    result: Vector3
  ): void {
    let x = value.x
    x = x > max.x ? max.x : x
    x = x < min.x ? min.x : x

    let y = value.y
    y = y > max.y ? max.y : y
    y = y < min.y ? min.y : y

    let z = value.z
    z = z > max.z ? max.z : z
    z = z < min.z ? min.z : z

    result.copyFromFloats(x, y, z)
  }

  /**
   * Returns a new Vector3 located for "amount" (float) on the Hermite interpolation spline defined by the vectors "value1", "tangent1", "value2", "tangent2"
   * @param value1 - defines the first control point
   * @param tangent1 - defines the first tangent vector
   * @param value2 - defines the second control point
   * @param tangent2 - defines the second tangent vector
   * @param amount - defines the amount on the interpolation spline (between 0 and 1)
   * @returns the new Vector3
   */
  public static Hermite(
    value1: ReadOnlyVector3,
    tangent1: ReadOnlyVector3,
    value2: ReadOnlyVector3,
    tangent2: ReadOnlyVector3,
    amount: number
  ): Vector3 {
    const squared = amount * amount
    const cubed = amount * squared
    const part1 = 2.0 * cubed - 3.0 * squared + 1.0
    const part2 = -2.0 * cubed + 3.0 * squared
    const part3 = cubed - 2.0 * squared + amount
    const part4 = cubed - squared

    const x =
      value1.x * part1 +
      value2.x * part2 +
      tangent1.x * part3 +
      tangent2.x * part4
    const y =
      value1.y * part1 +
      value2.y * part2 +
      tangent1.y * part3 +
      tangent2.y * part4
    const z =
      value1.z * part1 +
      value2.z * part2 +
      tangent1.z * part3 +
      tangent2.z * part4
    return new Vector3(x, y, z)
  }

  /**
   * Returns a new Vector3 located for "amount" (float) on the linear interpolation between the vectors "start" and "end"
   * @param start - defines the start value
   * @param end - defines the end value
   * @param amount - max defines amount between both (between 0 and 1)
   * @returns the new Vector3
   */
  public static Lerp(
    start: ReadOnlyVector3,
    end: ReadOnlyVector3,
    amount: number
  ): Vector3 {
    const result = new Vector3(0, 0, 0)
    Vector3.LerpToRef(start, end, amount, result)
    return result
  }

  /**
   * Sets the given vector "result" with the result of the linear interpolation from the vector "start" for "amount" to the vector "end"
   * @param start - defines the start value
   * @param end - defines the end value
   * @param amount - max defines amount between both (between 0 and 1)
   * @param result - defines the Vector3 where to store the result
   */
  public static LerpToRef(
    start: ReadOnlyVector3,
    end: ReadOnlyVector3,
    amount: number,
    result: Vector3
  ): void {
    result.x = start.x + (end.x - start.x) * amount
    result.y = start.y + (end.y - start.y) * amount
    result.z = start.z + (end.z - start.z) * amount
  }

  /**
   * Returns the dot product (float) between the vectors "left" and "right"
   * @param left - defines the left operand
   * @param right - defines the right operand
   * @returns the dot product
   */
  public static Dot(left: ReadOnlyVector3, right: ReadOnlyVector3): number {
    return left.x * right.x + left.y * right.y + left.z * right.z
  }

  /**
   * Returns a new Vector3 as the cross product of the vectors "left" and "right"
   * The cross product is then orthogonal to both "left" and "right"
   * @param left - defines the left operand
   * @param right - defines the right operand
   * @returns the cross product
   */
  public static Cross(left: ReadOnlyVector3, right: ReadOnlyVector3): Vector3 {
    const result = Vector3.Zero()
    Vector3.CrossToRef(left, right, result)
    return result
  }

  /**
   * Sets the given vector "result" with the cross product of "left" and "right"
   * The cross product is then orthogonal to both "left" and "right"
   * @param left - defines the left operand
   * @param right - defines the right operand
   * @param result - defines the Vector3 where to store the result
   */
  public static CrossToRef(
    left: ReadOnlyVector3,
    right: ReadOnlyVector3,
    result: Vector3
  ): void {
    const x = left.y * right.z - left.z * right.y
    const y = left.z * right.x - left.x * right.z
    const z = left.x * right.y - left.y * right.x
    result.copyFromFloats(x, y, z)
  }

  /**
   * Returns a new Vector3 as the normalization of the given vector
   * @param vector - defines the Vector3 to normalize
   * @returns the new Vector3
   */
  public static Normalize(vector: Vector3): Vector3 {
    const result = Vector3.Zero()
    Vector3.NormalizeToRef(vector, result)
    return result
  }

  /**
   * Sets the given vector "result" with the normalization of the given first vector
   * @param vector - defines the Vector3 to normalize
   * @param result - defines the Vector3 where to store the result
   */
  public static NormalizeToRef(vector: Vector3, result: Vector3): void {
    vector.normalizeToRef(result)
  }

  /**
   * Gets the minimal coordinate values between two Vector3
   * @param left - defines the first operand
   * @param right - defines the second operand
   * @returns the new Vector3
   */
  public static Minimize(
    left: ReadOnlyVector3,
    right: ReadOnlyVector3
  ): Vector3 {
    const min = new Vector3(left.x, left.y, left.z)
    min.minimizeInPlace(right)
    return min
  }

  /**
   * Gets the maximal coordinate values between two Vector3
   * @param left - defines the first operand
   * @param right - defines the second operand
   * @returns the new Vector3
   */
  public static Maximize(left: Vector3, right: Vector3): Vector3 {
    const max = new Vector3(left.x, left.y, left.z)
    max.maximizeInPlace(right)
    return max
  }

  /**
   * Returns the distance between the vectors "value1" and "value2"
   * @param value1 - defines the first operand
   * @param value2 - defines the second operand
   * @returns the distance
   */
  public static Distance(
    value1: ReadOnlyVector3,
    value2: ReadOnlyVector3
  ): number {
    return Math.sqrt(Vector3.DistanceSquared(value1, value2))
  }

  /**
   * Returns the squared distance between the vectors "value1" and "value2"
   * @param value1 - defines the first operand
   * @param value2 - defines the second operand
   * @returns the squared distance
   */
  public static DistanceSquared(
    value1: ReadOnlyVector3,
    value2: ReadOnlyVector3
  ): number {
    const x = value1.x - value2.x
    const y = value1.y - value2.y
    const z = value1.z - value2.z

    return x * x + y * y + z * z
  }

  /**
   * Returns a new Vector3 located at the center between "value1" and "value2"
   * @param value1 - defines the first operand
   * @param value2 - defines the second operand
   * @returns the new Vector3
   */
  public static Center(
    value1: ReadOnlyVector3,
    value2: ReadOnlyVector3
  ): Vector3 {
    const center = Vector3.Add(value1, value2)
    center.scaleInPlace(0.5)
    return center
  }

  /**
   * Given three orthogonal normalized left-handed oriented Vector3 axis in space (target system),
   * RotationFromAxis() returns the rotation Euler angles (ex : rotation.x, rotation.y, rotation.z) to apply
   * to something in order to rotate it from its local system to the given target system
   * Note: axis1, axis2 and axis3 are normalized during this operation
   * @param axis1 - defines the first axis
   * @param axis2 - defines the second axis
   * @param axis3 - defines the third axis
   * @returns a new Vector3
   */
  public static RotationFromAxis(
    axis1: Vector3,
    axis2: Vector3,
    axis3: Vector3
  ): Vector3 {
    const rotation = Vector3.Zero()
    Vector3.RotationFromAxisToRef(axis1, axis2, axis3, rotation)
    return rotation
  }

  /**
   * The same than RotationFromAxis but updates the given ref Vector3 parameter instead of returning a new Vector3
   * @param axis1 - defines the first axis
   * @param axis2 - defines the second axis
   * @param axis3 - defines the third axis
   * @param ref - defines the Vector3 where to store the result
   */
  public static RotationFromAxisToRef(
    axis1: Vector3,
    axis2: Vector3,
    axis3: Vector3,
    ref: Vector3
  ): void {
    const quat = MathTmp.Quaternion[0]
    Quaternion.RotationQuaternionFromAxisToRef(axis1, axis2, axis3, quat)
    ref.copyFrom(quat.eulerAngles)
  }

  /**
   * Creates a string representation of the Vector3
   * @returns a string with the Vector3 coordinates.
   */
  public toString(): string {
    return `(${this.x}, ${this.y}, ${this.z})`
  }

  /**
   * Gets the class name
   * @returns the string "Vector3"
   */
  public getClassName(): string {
    return 'Vector3'
  }

  /**
   * Creates the Vector3 hash code
   * @returns a number which tends to be unique between Vector3 instances
   */
  public getHashCode(): number {
    let hash = this.x || 0
    hash = (hash * 397) ^ (this.y || 0)
    hash = (hash * 397) ^ (this.z || 0)
    return hash
  }

  // Operators

  /**
   * Creates an array containing three elements : the coordinates of the Vector3
   * @returns a new array of numbers
   */
  public asArray(): number[] {
    const result: number[] = []
    this.toArray(result, 0)
    return result
  }

  /**
   * Populates the given array or FloatArray from the given index with the successive coordinates of the Vector3
   * @param array - defines the destination array
   * @param index - defines the offset in the destination array
   * @returns the current Vector3
   */
  public toArray(array: FloatArray, index: number = 0): Vector3 {
    array[index] = this.x
    array[index + 1] = this.y
    array[index + 2] = this.z
    return this
  }

  /**
   * Converts the current Vector3 into a quaternion (considering that the Vector3 contains Euler angles representation of a rotation)
   * @returns a new Quaternion object, computed from the Vector3 coordinates
   */
  public toQuaternion(): Quaternion {
    return Quaternion.Identity.setEuler(this.y, this.x, this.z)
  }

  /**
   * Adds the given vector to the current Vector3
   * @param otherVector - defines the second operand
   * @returns the current updated Vector3
   */
  public addInPlace(otherVector: ReadOnlyVector3): Vector3 {
    return this.addInPlaceFromFloats(
      otherVector.x,
      otherVector.y,
      otherVector.z
    )
  }

  /**
   * Adds the given coordinates to the current Vector3
   * @param x - defines the x coordinate of the operand
   * @param y - defines the y coordinate of the operand
   * @param z - defines the z coordinate of the operand
   * @returns the current updated Vector3
   */
  public addInPlaceFromFloats(x: number, y: number, z: number): Vector3 {
    this.x += x
    this.y += y
    this.z += z
    return this
  }

  /**
   * Gets a new Vector3, result of the addition the current Vector3 and the given vector
   * @param otherVector - defines the second operand
   * @returns the resulting Vector3
   */
  public add(otherVector: ReadOnlyVector3): Vector3 {
    return new Vector3(
      this.x + otherVector.x,
      this.y + otherVector.y,
      this.z + otherVector.z
    )
  }

  /**
   * Adds the current Vector3 to the given one and stores the result in the vector "result"
   * @param otherVector - defines the second operand
   * @param result - defines the Vector3 object where to store the result
   * @returns the current Vector3
   */
  public addToRef(otherVector: ReadOnlyVector3, result: Vector3): Vector3 {
    return result.copyFromFloats(
      this.x + otherVector.x,
      this.y + otherVector.y,
      this.z + otherVector.z
    )
  }

  /**
   * Subtract the given vector from the current Vector3
   * @param otherVector - defines the second operand
   * @returns the current updated Vector3
   */
  public subtractInPlace(otherVector: ReadOnlyVector3): Vector3 {
    this.x -= otherVector.x
    this.y -= otherVector.y
    this.z -= otherVector.z
    return this
  }

  /**
   * Returns a new Vector3, result of the subtraction of the given vector from the current Vector3
   * @param otherVector - defines the second operand
   * @returns the resulting Vector3
   */
  public subtract(otherVector: ReadOnlyVector3): Vector3 {
    return new Vector3(
      this.x - otherVector.x,
      this.y - otherVector.y,
      this.z - otherVector.z
    )
  }

  /**
   * Subtracts the given vector from the current Vector3 and stores the result in the vector "result".
   * @param otherVector - defines the second operand
   * @param result - defines the Vector3 object where to store the result
   * @returns the current Vector3
   */
  public subtractToRef(otherVector: ReadOnlyVector3, result: Vector3): Vector3 {
    return this.subtractFromFloatsToRef(
      otherVector.x,
      otherVector.y,
      otherVector.z,
      result
    )
  }

  /**
   * Returns a new Vector3 set with the subtraction of the given floats from the current Vector3 coordinates
   * @param x - defines the x coordinate of the operand
   * @param y - defines the y coordinate of the operand
   * @param z - defines the z coordinate of the operand
   * @returns the resulting Vector3
   */
  public subtractFromFloats(x: number, y: number, z: number): Vector3 {
    return new Vector3(this.x - x, this.y - y, this.z - z)
  }

  /**
   * Subtracts the given floats from the current Vector3 coordinates and set the given vector "result" with this result
   * @param x - defines the x coordinate of the operand
   * @param y - defines the y coordinate of the operand
   * @param z - defines the z coordinate of the operand
   * @param result - defines the Vector3 object where to store the result
   * @returns the current Vector3
   */
  public subtractFromFloatsToRef(
    x: number,
    y: number,
    z: number,
    result: Vector3
  ): Vector3 {
    return result.copyFromFloats(this.x - x, this.y - y, this.z - z)
  }

  /**
   * Multiplies this vector (with an implicit 1 in the 4th dimension) and m, and divides by perspective
   * @param matrix - The transformation matrix
   */
  public applyMatrix4(matrix: Matrix) {
    this.applyMatrix4ToRef(matrix, this)
  }

  /**
   * Multiplies this vector (with an implicit 1 in the 4th dimension) and m, and divides by perspective and set the given vector "result" with this result
   * @param matrix - The transformation matrix
   * @param result - defines the Vector3 object where to store the result
   * @returns the current Vector3
   */
  public applyMatrix4ToRef(matrix: Matrix, result: Vector3) {
    const { x, y, z } = this
    const { m } = matrix
    const w = 1 / (m[3] * x + m[7] * y + m[11] * z + m[15])

    result.x = (m[0] * x + m[4] * y + m[8] * z + m[12]) * w
    result.y = (m[1] * x + m[5] * y + m[9] * z + m[13]) * w
    result.z = (m[2] * x + m[6] * y + m[10] * z + m[14]) * w

    return result
  }

  /**
   * Rotates the current Vector3 based on the given quaternion
   * @param q - defines the Quaternion
   * @returns the current Vector3
   */
  public rotate(q: Quaternion) {
    return this.rotateToRef(q, this)
  }

  /**
   * Rotates current Vector3 based on the given quaternion, but applies the rotation to target Vector3.
   * @param q - defines the Quaternion
   * @param result - defines the target Vector3
   * @returns the current Vector3
   */
  public rotateToRef(q: Quaternion, result: Vector3) {
    const { x, y, z } = this
    const { x: qx, y: qy, z: qz, w: qw } = q

    // calculate quat * vector

    const ix = qw * x + qy * z - qz * y
    const iy = qw * y + qz * x - qx * z
    const iz = qw * z + qx * y - qy * x
    const iw = -qx * x - qy * y - qz * z

    // calculate result * inverse quat

    result.x = ix * qw + iw * -qx + iy * -qz - iz * -qy
    result.y = iy * qw + iw * -qy + iz * -qx - ix * -qz
    result.z = iz * qw + iw * -qz + ix * -qy - iy * -qx

    return result
  }

  /**
   * Gets a new Vector3 set with the current Vector3 negated coordinates
   * @returns a new Vector3
   */
  public negate(): Vector3 {
    return new Vector3(-this.x, -this.y, -this.z)
  }

  /**
   * Multiplies the Vector3 coordinates by the float "scale"
   * @param scale - defines the multiplier factor
   * @returns the current updated Vector3
   */
  public scaleInPlace(scale: number): Vector3 {
    this.x *= scale
    this.y *= scale
    this.z *= scale
    return this
  }

  /**
   * Returns a new Vector3 set with the current Vector3 coordinates multiplied by the float "scale"
   * @param scale - defines the multiplier factor
   * @returns a new Vector3
   */
  public scale(scale: number): Vector3 {
    return new Vector3(this.x * scale, this.y * scale, this.z * scale)
  }

  /**
   * Multiplies the current Vector3 coordinates by the float "scale" and stores the result in the given vector "result" coordinates
   * @param scale - defines the multiplier factor
   * @param result - defines the Vector3 object where to store the result
   * @returns the current Vector3
   */
  public scaleToRef(scale: number, result: Vector3): Vector3 {
    return result.copyFromFloats(this.x * scale, this.y * scale, this.z * scale)
  }

  /**
   * Scale the current Vector3 values by a factor and add the result to a given Vector3
   * @param scale - defines the scale factor
   * @param result - defines the Vector3 object where to store the result
   * @returns the unmodified current Vector3
   */
  public scaleAndAddToRef(scale: number, result: Vector3): Vector3 {
    return result.addInPlaceFromFloats(
      this.x * scale,
      this.y * scale,
      this.z * scale
    )
  }

  /**
   * Returns true if the current Vector3 and the given vector coordinates are strictly equal
   * @param otherVector - defines the second operand
   * @returns true if both vectors are equals
   */
  public equals(otherVector: ReadOnlyVector3): boolean {
    return (
      otherVector &&
      this.x === otherVector.x &&
      this.y === otherVector.y &&
      this.z === otherVector.z
    )
  }

  /**
   * Returns true if the current Vector3 and the given vector coordinates are distant less than epsilon
   * @param otherVector - defines the second operand
   * @param epsilon - defines the minimal distance to define values as equals
   * @returns true if both vectors are distant less than epsilon
   */
  public equalsWithEpsilon(
    otherVector: ReadOnlyVector3,
    epsilon: number = Epsilon
  ): boolean {
    return (
      otherVector &&
      Scalar.WithinEpsilon(this.x, otherVector.x, epsilon) &&
      Scalar.WithinEpsilon(this.y, otherVector.y, epsilon) &&
      Scalar.WithinEpsilon(this.z, otherVector.z, epsilon)
    )
  }

  /**
   * Returns true if the current Vector3 coordinates equals the given floats
   * @param x - defines the x coordinate of the operand
   * @param y - defines the y coordinate of the operand
   * @param z - defines the z coordinate of the operand
   * @returns true if both vectors are equals
   */
  public equalsToFloats(x: number, y: number, z: number): boolean {
    return this.x === x && this.y === y && this.z === z
  }

  /**
   * Multiplies the current Vector3 coordinates by the given ones
   * @param otherVector - defines the second operand
   * @returns the current updated Vector3
   */
  public multiplyInPlace(otherVector: ReadOnlyVector3): Vector3 {
    this.x *= otherVector.x
    this.y *= otherVector.y
    this.z *= otherVector.z
    return this
  }

  /**
   * Returns a new Vector3, result of the multiplication of the current Vector3 by the given vector
   * @param otherVector - defines the second operand
   * @returns the new Vector3
   */
  public multiply(otherVector: ReadOnlyVector3): Vector3 {
    return this.multiplyByFloats(otherVector.x, otherVector.y, otherVector.z)
  }

  /**
   * Multiplies the current Vector3 by the given one and stores the result in the given vector "result"
   * @param otherVector - defines the second operand
   * @param result - defines the Vector3 object where to store the result
   * @returns the current Vector3
   */
  public multiplyToRef(otherVector: ReadOnlyVector3, result: Vector3): Vector3 {
    return result.copyFromFloats(
      this.x * otherVector.x,
      this.y * otherVector.y,
      this.z * otherVector.z
    )
  }

  /**
   * Returns a new Vector3 set with the result of the mulliplication of the current Vector3 coordinates by the given floats
   * @param x - defines the x coordinate of the operand
   * @param y - defines the y coordinate of the operand
   * @param z - defines the z coordinate of the operand
   * @returns the new Vector3
   */
  public multiplyByFloats(x: number, y: number, z: number): Vector3 {
    return new Vector3(this.x * x, this.y * y, this.z * z)
  }

  /**
   * Returns a new Vector3 set with the result of the division of the current Vector3 coordinates by the given ones
   * @param otherVector - defines the second operand
   * @returns the new Vector3
   */
  public divide(otherVector: ReadOnlyVector3): Vector3 {
    return new Vector3(
      this.x / otherVector.x,
      this.y / otherVector.y,
      this.z / otherVector.z
    )
  }

  /**
   * Divides the current Vector3 coordinates by the given ones and stores the result in the given vector "result"
   * @param otherVector - defines the second operand
   * @param result - defines the Vector3 object where to store the result
   * @returns the current Vector3
   */
  public divideToRef(otherVector: ReadOnlyVector3, result: Vector3): Vector3 {
    return result.copyFromFloats(
      this.x / otherVector.x,
      this.y / otherVector.y,
      this.z / otherVector.z
    )
  }

  /**
   * Divides the current Vector3 coordinates by the given ones.
   * @param otherVector - defines the second operand
   * @returns the current updated Vector3
   */
  public divideInPlace(otherVector: ReadOnlyVector3): Vector3 {
    return this.divideToRef(otherVector, this)
  }

  /**
   * Updates the current Vector3 with the minimal coordinate values between its and the given vector ones
   * @param other - defines the second operand
   * @returns the current updated Vector3
   */
  public minimizeInPlace(other: ReadOnlyVector3): Vector3 {
    return this.minimizeInPlaceFromFloats(other.x, other.y, other.z)
  }

  /**
   * Updates the current Vector3 with the maximal coordinate values between its and the given vector ones.
   * @param other - defines the second operand
   * @returns the current updated Vector3
   */
  public maximizeInPlace(other: ReadOnlyVector3): Vector3 {
    return this.maximizeInPlaceFromFloats(other.x, other.y, other.z)
  }

  /**
   * Updates the current Vector3 with the minimal coordinate values between its and the given coordinates
   * @param x - defines the x coordinate of the operand
   * @param y - defines the y coordinate of the operand
   * @param z - defines the z coordinate of the operand
   * @returns the current updated Vector3
   */
  public minimizeInPlaceFromFloats(x: number, y: number, z: number): Vector3 {
    if (x < this.x) {
      this.x = x
    }
    if (y < this.y) {
      this.y = y
    }
    if (z < this.z) {
      this.z = z
    }
    return this
  }

  /**
   * Updates the current Vector3 with the maximal coordinate values between its and the given coordinates.
   * @param x - defines the x coordinate of the operand
   * @param y - defines the y coordinate of the operand
   * @param z - defines the z coordinate of the operand
   * @returns the current updated Vector3
   */
  public maximizeInPlaceFromFloats(x: number, y: number, z: number): Vector3 {
    if (x > this.x) {
      this.x = x
    }
    if (y > this.y) {
      this.y = y
    }
    if (z > this.z) {
      this.z = z
    }
    return this
  }

  /**
   * Gets a new Vector3 from current Vector3 floored values
   * @returns a new Vector3
   */
  public floor(): Vector3 {
    return new Vector3(
      Math.floor(this.x),
      Math.floor(this.y),
      Math.floor(this.z)
    )
  }

  /**
   * Gets a new Vector3 from current Vector3 floored values
   * @returns a new Vector3
   */
  public fract(): Vector3 {
    return new Vector3(
      this.x - Math.floor(this.x),
      this.y - Math.floor(this.y),
      this.z - Math.floor(this.z)
    )
  }

  // Properties
  /**
   * Gets the length of the Vector3
   * @returns the length of the Vecto3
   */
  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  /**
   * Gets the squared length of the Vector3
   * @returns squared length of the Vector3
   */
  public lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z
  }

  /**
   * Normalize the current Vector3.
   * Please note that this is an in place operation.
   * @returns the current updated Vector3
   */
  public normalize(): Vector3 {
    return this.normalizeFromLength(this.length())
  }

  /**
   * Normalize the current Vector3 with the given input length.
   * Please note that this is an in place operation.
   * @param len - the length of the vector
   * @returns the current updated Vector3
   */
  public normalizeFromLength(len: number): Vector3 {
    if (len === 0 || len === 1.0) {
      return this
    }

    return this.scaleInPlace(1.0 / len)
  }

  /**
   * Normalize the current Vector3 to a new vector
   * @returns the new Vector3
   */
  public normalizeToNew(): Vector3 {
    const normalized = new Vector3(0, 0, 0)
    this.normalizeToRef(normalized)
    return normalized
  }

  /**
   * Normalize the current Vector3 to the reference
   * @param reference - define the Vector3 to update
   * @returns the updated Vector3
   */
  public normalizeToRef(reference: Vector3): Vector3 {
    const len = this.length()
    if (len === 0 || len === 1.0) {
      return reference.copyFromFloats(this.x, this.y, this.z)
    }

    return this.scaleToRef(1.0 / len, reference)
  }

  /**
   * Creates a new Vector3 copied from the current Vector3
   * @returns the new Vector3
   */
  public clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z)
  }

  /**
   * Copies the given vector coordinates to the current Vector3 ones
   * @param source - defines the source Vector3
   * @returns the current updated Vector3
   */
  public copyFrom(source: ReadOnlyVector3): Vector3 {
    return this.copyFromFloats(source.x, source.y, source.z)
  }

  /**
   * Copies the given floats to the current Vector3 coordinates
   * @param x - defines the x coordinate of the operand
   * @param y - defines the y coordinate of the operand
   * @param z - defines the z coordinate of the operand
   * @returns the current updated Vector3
   */
  public copyFromFloats(x: number, y: number, z: number): Vector3 {
    this.x = x
    this.y = y
    this.z = z
    return this
  }

  /**
   * Copies the given floats to the current Vector3 coordinates
   * @param x - defines the x coordinate of the operand
   * @param y - defines the y coordinate of the operand
   * @param z - defines the z coordinate of the operand
   * @returns the current updated Vector3
   */
  public set(x: number, y: number, z: number): Vector3 {
    return this.copyFromFloats(x, y, z)
  }

  /**
   * Copies the given float to the current Vector3 coordinates
   * @param v - defines the x, y and z coordinates of the operand
   * @returns the current updated Vector3
   */
  public setAll(v: number): Vector3 {
    this.x = this.y = this.z = v
    return this
  }
}
