/**
 * @public
 * Vector2 is a type and a namespace.
 * - The namespace contains all types and functions to operates with Vector2
 * - The type Vector2 is an alias to Vector2.ReadonlyVector2
 * ```
 *
 * // Namespace usage example
 * const next = Vector2.add(pointA, velocityA) // add function not implemented yet
 *
 * // Type usage example
 * const readonlyPosition: Vector2 = Vector2.Zero()
 * readonlyPosition.x = 0.1 // this FAILS
 *
 * // For mutable usage, use `Vector2.Mutable`
 * const position: Vector2.Mutable = Vector2.One()
 * position.x = 3.0 // this WORKS
 * ```
 */
export type Vector2 = Vector2.ReadonlyVector2

/**
 * @public
 * Vector2 is a type and a namespace.
 * ```
 * // The namespace contains all types and functions to operates with Vector2
 * const next = Vector2.add(pointA, velocityA) // add function not implemented yet
 * // The type Vector2 is an alias to Vector2.ReadonlyVector2
 * const readonlyPosition: Vector2 = Vector2.Zero()
 * readonlyPosition.x = 0.1 // this FAILS
 *
 * // For mutable usage, use `Vector2.Mutable`
 * const position: Vector2.Mutable = Vector2.One()
 * position.x = 3.0 // this WORKS
 * ```
 */
export namespace Vector2 {
  /**
   * @public
   * For external use, type with `Vector2`, e.g. `const zeroPosition: Vector2 = Vector2.Zero()`.
   * For mutable typing, use `Vector2.Mutable`, e.g. `const oneVector: Vector2.Mutable = Vector2.One()`.
   */
  export type ReadonlyVector2 = {
    readonly x: number
    readonly y: number
  }

  /**
   * @public
   * For external usage, type with `Vector2`, e.g. `const zeroPosition: Vector2 = Vector2.Zero()`.
   * For mutable typing, use `Vector2.Mutable`, e.g. `const oneVector: Vector2.Mutable = Vector2.One()`.
   */
  export type MutableVector2 = {
    x: number
    y: number
  }

  /**
   * @public
   * Type with `Vector2` for readonly usage, e.g. `const zeroPosition: Vector2 = Vector2.Zero()`.
   * For mutable, use `Vector2.Mutable`, e.g. `const oneVector: Vector2.Mutable = Vector2.One()`.
   */
  export type Mutable = MutableVector2

  /**
   * Creates a new Vector2 object from the given x, y (floats) coordinates.
   * @param x - defines the first coordinates (on X axis)
   * @param y - defines the second coordinates (on Y axis)
   */
  export function create(
    /**
     * Defines the first coordinates (on X axis)
     */
    x: number = 0,
    /**
     * Defines the second coordinates (on Y axis)
     */
    y: number = 0
  ): MutableVector2 {
    return { x, y }
  }

  /**
   * Returns a new Vector2 set to (0.0, 0.0)
   * @returns a new empty Vector2
   */
  export function Zero(): MutableVector2 {
    return create(0.0, 0.0)
  }

  /**
   * Returns a new Vector2 set to (1.0, 1.0)
   * @returns a new unit Vector2
   */
  export function One(): MutableVector2 {
    return create(1.0, 1.0)
  }
}
