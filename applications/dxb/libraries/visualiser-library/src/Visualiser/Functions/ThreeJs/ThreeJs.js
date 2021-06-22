var document = global.document;
const REVISION = "121",
  MOUSE = { LEFT: 0, MIDDLE: 1, RIGHT: 2, ROTATE: 0, DOLLY: 1, PAN: 2 },
  TOUCH = { ROTATE: 0, PAN: 1, DOLLY_PAN: 2, DOLLY_ROTATE: 3 },
  CullFaceNone = 0,
  CullFaceBack = 1,
  CullFaceFront = 2,
  CullFaceFrontBack = 3,
  BasicShadowMap = 0,
  PCFShadowMap = 1,
  PCFSoftShadowMap = 2,
  VSMShadowMap = 3,
  FrontSide = 0,
  BackSide = 1,
  DoubleSide = 2,
  FlatShading = 1,
  SmoothShading = 2,
  NoBlending = 0,
  NormalBlending = 1,
  AdditiveBlending = 2,
  SubtractiveBlending = 3,
  MultiplyBlending = 4,
  CustomBlending = 5,
  AddEquation = 100,
  SubtractEquation = 101,
  ReverseSubtractEquation = 102,
  MinEquation = 103,
  MaxEquation = 104,
  ZeroFactor = 200,
  OneFactor = 201,
  SrcColorFactor = 202,
  OneMinusSrcColorFactor = 203,
  SrcAlphaFactor = 204,
  OneMinusSrcAlphaFactor = 205,
  DstAlphaFactor = 206,
  OneMinusDstAlphaFactor = 207,
  DstColorFactor = 208,
  OneMinusDstColorFactor = 209,
  SrcAlphaSaturateFactor = 210,
  NeverDepth = 0,
  AlwaysDepth = 1,
  LessDepth = 2,
  LessEqualDepth = 3,
  EqualDepth = 4,
  GreaterEqualDepth = 5,
  GreaterDepth = 6,
  NotEqualDepth = 7,
  MultiplyOperation = 0,
  MixOperation = 1,
  AddOperation = 2,
  NoToneMapping = 0,
  LinearToneMapping = 1,
  ReinhardToneMapping = 2,
  CineonToneMapping = 3,
  ACESFilmicToneMapping = 4,
  CustomToneMapping = 5,
  UVMapping = 300,
  CubeReflectionMapping = 301,
  CubeRefractionMapping = 302,
  EquirectangularReflectionMapping = 303,
  EquirectangularRefractionMapping = 304,
  CubeUVReflectionMapping = 306,
  CubeUVRefractionMapping = 307,
  RepeatWrapping = 1e3,
  ClampToEdgeWrapping = 1001,
  MirroredRepeatWrapping = 1002,
  NearestFilter = 1003,
  NearestMipmapNearestFilter = 1004,
  NearestMipMapNearestFilter = 1004,
  NearestMipmapLinearFilter = 1005,
  NearestMipMapLinearFilter = 1005,
  LinearFilter = 1006,
  LinearMipmapNearestFilter = 1007,
  LinearMipMapNearestFilter = 1007,
  LinearMipmapLinearFilter = 1008,
  LinearMipMapLinearFilter = 1008,
  UnsignedByteType = 1009,
  ByteType = 1010,
  ShortType = 1011,
  UnsignedShortType = 1012,
  IntType = 1013,
  UnsignedIntType = 1014,
  FloatType = 1015,
  HalfFloatType = 1016,
  UnsignedShort4444Type = 1017,
  UnsignedShort5551Type = 1018,
  UnsignedShort565Type = 1019,
  UnsignedInt248Type = 1020,
  AlphaFormat = 1021,
  RGBFormat = 1022,
  RGBAFormat = 1023,
  LuminanceFormat = 1024,
  LuminanceAlphaFormat = 1025,
  RGBEFormat = RGBAFormat,
  DepthFormat = 1026,
  DepthStencilFormat = 1027,
  RedFormat = 1028,
  RedIntegerFormat = 1029,
  RGFormat = 1030,
  RGIntegerFormat = 1031,
  RGBIntegerFormat = 1032,
  RGBAIntegerFormat = 1033,
  RGB_S3TC_DXT1_Format = 33776,
  RGBA_S3TC_DXT1_Format = 33777,
  RGBA_S3TC_DXT3_Format = 33778,
  RGBA_S3TC_DXT5_Format = 33779,
  RGB_PVRTC_4BPPV1_Format = 35840,
  RGB_PVRTC_2BPPV1_Format = 35841,
  RGBA_PVRTC_4BPPV1_Format = 35842,
  RGBA_PVRTC_2BPPV1_Format = 35843,
  RGB_ETC1_Format = 36196,
  RGB_ETC2_Format = 37492,
  RGBA_ETC2_EAC_Format = 37496,
  RGBA_ASTC_4x4_Format = 37808,
  RGBA_ASTC_5x4_Format = 37809,
  RGBA_ASTC_5x5_Format = 37810,
  RGBA_ASTC_6x5_Format = 37811,
  RGBA_ASTC_6x6_Format = 37812,
  RGBA_ASTC_8x5_Format = 37813,
  RGBA_ASTC_8x6_Format = 37814,
  RGBA_ASTC_8x8_Format = 37815,
  RGBA_ASTC_10x5_Format = 37816,
  RGBA_ASTC_10x6_Format = 37817,
  RGBA_ASTC_10x8_Format = 37818,
  RGBA_ASTC_10x10_Format = 37819,
  RGBA_ASTC_12x10_Format = 37820,
  RGBA_ASTC_12x12_Format = 37821,
  RGBA_BPTC_Format = 36492,
  SRGB8_ALPHA8_ASTC_4x4_Format = 37840,
  SRGB8_ALPHA8_ASTC_5x4_Format = 37841,
  SRGB8_ALPHA8_ASTC_5x5_Format = 37842,
  SRGB8_ALPHA8_ASTC_6x5_Format = 37843,
  SRGB8_ALPHA8_ASTC_6x6_Format = 37844,
  SRGB8_ALPHA8_ASTC_8x5_Format = 37845,
  SRGB8_ALPHA8_ASTC_8x6_Format = 37846,
  SRGB8_ALPHA8_ASTC_8x8_Format = 37847,
  SRGB8_ALPHA8_ASTC_10x5_Format = 37848,
  SRGB8_ALPHA8_ASTC_10x6_Format = 37849,
  SRGB8_ALPHA8_ASTC_10x8_Format = 37850,
  SRGB8_ALPHA8_ASTC_10x10_Format = 37851,
  SRGB8_ALPHA8_ASTC_12x10_Format = 37852,
  SRGB8_ALPHA8_ASTC_12x12_Format = 37853,
  LoopOnce = 2200,
  LoopRepeat = 2201,
  LoopPingPong = 2202,
  InterpolateDiscrete = 2300,
  InterpolateLinear = 2301,
  InterpolateSmooth = 2302,
  ZeroCurvatureEnding = 2400,
  ZeroSlopeEnding = 2401,
  WrapAroundEnding = 2402,
  NormalAnimationBlendMode = 2500,
  AdditiveAnimationBlendMode = 2501,
  TrianglesDrawMode = 0,
  TriangleStripDrawMode = 1,
  TriangleFanDrawMode = 2,
  LinearEncoding = 3e3,
  sRGBEncoding = 3001,
  GammaEncoding = 3007,
  RGBEEncoding = 3002,
  LogLuvEncoding = 3003,
  RGBM7Encoding = 3004,
  RGBM16Encoding = 3005,
  RGBDEncoding = 3006,
  BasicDepthPacking = 3200,
  RGBADepthPacking = 3201,
  TangentSpaceNormalMap = 0,
  ObjectSpaceNormalMap = 1,
  ZeroStencilOp = 0,
  KeepStencilOp = 7680,
  ReplaceStencilOp = 7681,
  IncrementStencilOp = 7682,
  DecrementStencilOp = 7683,
  IncrementWrapStencilOp = 34055,
  DecrementWrapStencilOp = 34056,
  InvertStencilOp = 5386,
  NeverStencilFunc = 512,
  LessStencilFunc = 513,
  EqualStencilFunc = 514,
  LessEqualStencilFunc = 515,
  GreaterStencilFunc = 516,
  NotEqualStencilFunc = 517,
  GreaterEqualStencilFunc = 518,
  AlwaysStencilFunc = 519,
  StaticDrawUsage = 35044,
  DynamicDrawUsage = 35048,
  StreamDrawUsage = 35040,
  StaticReadUsage = 35045,
  DynamicReadUsage = 35049,
  StreamReadUsage = 35041,
  StaticCopyUsage = 35046,
  DynamicCopyUsage = 35050,
  StreamCopyUsage = 35042,
  GLSL1 = "100",
  GLSL3 = "300 es";
function EventDispatcher() {}
Object.assign(EventDispatcher.prototype, {
  addEventListener: function (e, t) {
    void 0 === this._listeners && (this._listeners = {});
    const n = this._listeners;
    void 0 === n[e] && (n[e] = []), -1 === n[e].indexOf(t) && n[e].push(t);
  },
  hasEventListener: function (e, t) {
    if (void 0 === this._listeners) return !1;
    const n = this._listeners;
    return void 0 !== n[e] && -1 !== n[e].indexOf(t);
  },
  removeEventListener: function (e, t) {
    if (void 0 === this._listeners) return;
    const n = this._listeners[e];
    if (void 0 !== n) {
      const e = n.indexOf(t);
      -1 !== e && n.splice(e, 1);
    }
  },
  dispatchEvent: function (e) {
    if (void 0 === this._listeners) return;
    const t = this._listeners[e.type];
    if (void 0 !== t) {
      e.target = this;
      const n = t.slice(0);
      for (let t = 0, r = n.length; t < r; t++) n[t].call(this, e);
    }
  }
});
const _lut = [];
for (let e = 0; e < 256; e++) _lut[e] = (e < 16 ? "0" : "") + e.toString(16);
let _seed = 1234567;
const MathUtils = {
  DEG2RAD: Math.PI / 180,
  RAD2DEG: 180 / Math.PI,
  generateUUID: function () {
    const e = (4294967295 * Math.random()) | 0,
      t = (4294967295 * Math.random()) | 0,
      n = (4294967295 * Math.random()) | 0,
      r = (4294967295 * Math.random()) | 0;
    return (
      _lut[255 & e] +
      _lut[(e >> 8) & 255] +
      _lut[(e >> 16) & 255] +
      _lut[(e >> 24) & 255] +
      "-" +
      _lut[255 & t] +
      _lut[(t >> 8) & 255] +
      "-" +
      _lut[((t >> 16) & 15) | 64] +
      _lut[(t >> 24) & 255] +
      "-" +
      _lut[(63 & n) | 128] +
      _lut[(n >> 8) & 255] +
      "-" +
      _lut[(n >> 16) & 255] +
      _lut[(n >> 24) & 255] +
      _lut[255 & r] +
      _lut[(r >> 8) & 255] +
      _lut[(r >> 16) & 255] +
      _lut[(r >> 24) & 255]
    ).toUpperCase();
  },
  clamp: function (e, t, n) {
    return Math.max(t, Math.min(n, e));
  },
  euclideanModulo: function (e, t) {
    return ((e % t) + t) % t;
  },
  mapLinear: function (e, t, n, r, i) {
    return r + ((e - t) * (i - r)) / (n - t);
  },
  lerp: function (e, t, n) {
    return (1 - n) * e + n * t;
  },
  smoothstep: function (e, t, n) {
    return e <= t ? 0 : e >= n ? 1 : (e = (e - t) / (n - t)) * e * (3 - 2 * e);
  },
  smootherstep: function (e, t, n) {
    return e <= t
      ? 0
      : e >= n
      ? 1
      : (e = (e - t) / (n - t)) * e * e * (e * (6 * e - 15) + 10);
  },
  randInt: function (e, t) {
    return e + Math.floor(Math.random() * (t - e + 1));
  },
  randFloat: function (e, t) {
    return e + Math.random() * (t - e);
  },
  randFloatSpread: function (e) {
    return e * (0.5 - Math.random());
  },
  seededRandom: function (e) {
    return (
      void 0 !== e && (_seed = e % 2147483647),
      ((_seed = (16807 * _seed) % 2147483647) - 1) / 2147483646
    );
  },
  degToRad: function (e) {
    return e * MathUtils.DEG2RAD;
  },
  radToDeg: function (e) {
    return e * MathUtils.RAD2DEG;
  },
  isPowerOfTwo: function (e) {
    return 0 == (e & (e - 1)) && 0 !== e;
  },
  ceilPowerOfTwo: function (e) {
    return Math.pow(2, Math.ceil(Math.log(e) / Math.LN2));
  },
  floorPowerOfTwo: function (e) {
    return Math.pow(2, Math.floor(Math.log(e) / Math.LN2));
  },
  setQuaternionFromProperEuler: function (e, t, n, r, i) {
    const o = Math.cos,
      a = Math.sin,
      s = o(n / 2),
      c = a(n / 2),
      l = o((t + r) / 2),
      h = a((t + r) / 2),
      u = o((t - r) / 2),
      d = a((t - r) / 2),
      p = o((r - t) / 2),
      m = a((r - t) / 2);
    switch (i) {
      case "XYX":
        e.set(s * h, c * u, c * d, s * l);
        break;
      case "YZY":
        e.set(c * d, s * h, c * u, s * l);
        break;
      case "ZXZ":
        e.set(c * u, c * d, s * h, s * l);
        break;
      case "XZX":
        e.set(s * h, c * m, c * p, s * l);
        break;
      case "YXY":
        e.set(c * p, s * h, c * m, s * l);
        break;
      case "ZYZ":
        e.set(c * m, c * p, s * h, s * l);
        break;
      default:
        console.warn(
          "THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " +
            i
        );
    }
  }
};
class Vector2 {
  constructor(e = 0, t = 0) {
    Object.defineProperty(this, "isVector2", { value: !0 }),
      (this.x = e),
      (this.y = t);
  }
  get width() {
    return this.x;
  }
  set width(e) {
    this.x = e;
  }
  get height() {
    return this.y;
  }
  set height(e) {
    this.y = e;
  }
  set(e, t) {
    return (this.x = e), (this.y = t), this;
  }
  setScalar(e) {
    return (this.x = e), (this.y = e), this;
  }
  setX(e) {
    return (this.x = e), this;
  }
  setY(e) {
    return (this.y = e), this;
  }
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y);
  }
  copy(e) {
    return (this.x = e.x), (this.y = e.y), this;
  }
  add(e, t) {
    return void 0 !== t
      ? (console.warn(
          "THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead."
        ),
        this.addVectors(e, t))
      : ((this.x += e.x), (this.y += e.y), this);
  }
  addScalar(e) {
    return (this.x += e), (this.y += e), this;
  }
  addVectors(e, t) {
    return (this.x = e.x + t.x), (this.y = e.y + t.y), this;
  }
  addScaledVector(e, t) {
    return (this.x += e.x * t), (this.y += e.y * t), this;
  }
  sub(e, t) {
    return void 0 !== t
      ? (console.warn(
          "THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."
        ),
        this.subVectors(e, t))
      : ((this.x -= e.x), (this.y -= e.y), this);
  }
  subScalar(e) {
    return (this.x -= e), (this.y -= e), this;
  }
  subVectors(e, t) {
    return (this.x = e.x - t.x), (this.y = e.y - t.y), this;
  }
  multiply(e) {
    return (this.x *= e.x), (this.y *= e.y), this;
  }
  multiplyScalar(e) {
    return (this.x *= e), (this.y *= e), this;
  }
  divide(e) {
    return (this.x /= e.x), (this.y /= e.y), this;
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  applyMatrix3(e) {
    const t = this.x,
      n = this.y,
      r = e.elements;
    return (
      (this.x = r[0] * t + r[3] * n + r[6]),
      (this.y = r[1] * t + r[4] * n + r[7]),
      this
    );
  }
  min(e) {
    return (
      (this.x = Math.min(this.x, e.x)), (this.y = Math.min(this.y, e.y)), this
    );
  }
  max(e) {
    return (
      (this.x = Math.max(this.x, e.x)), (this.y = Math.max(this.y, e.y)), this
    );
  }
  clamp(e, t) {
    return (
      (this.x = Math.max(e.x, Math.min(t.x, this.x))),
      (this.y = Math.max(e.y, Math.min(t.y, this.y))),
      this
    );
  }
  clampScalar(e, t) {
    return (
      (this.x = Math.max(e, Math.min(t, this.x))),
      (this.y = Math.max(e, Math.min(t, this.y))),
      this
    );
  }
  clampLength(e, t) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(
      Math.max(e, Math.min(t, n))
    );
  }
  floor() {
    return (this.x = Math.floor(this.x)), (this.y = Math.floor(this.y)), this;
  }
  ceil() {
    return (this.x = Math.ceil(this.x)), (this.y = Math.ceil(this.y)), this;
  }
  round() {
    return (this.x = Math.round(this.x)), (this.y = Math.round(this.y)), this;
  }
  roundToZero() {
    return (
      (this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x)),
      (this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y)),
      this
    );
  }
  negate() {
    return (this.x = -this.x), (this.y = -this.y), this;
  }
  dot(e) {
    return this.x * e.x + this.y * e.y;
  }
  cross(e) {
    return this.x * e.y - this.y * e.x;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  angle() {
    return Math.atan2(-this.y, -this.x) + Math.PI;
  }
  distanceTo(e) {
    return Math.sqrt(this.distanceToSquared(e));
  }
  distanceToSquared(e) {
    const t = this.x - e.x,
      n = this.y - e.y;
    return t * t + n * n;
  }
  manhattanDistanceTo(e) {
    return Math.abs(this.x - e.x) + Math.abs(this.y - e.y);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, t) {
    return (this.x += (e.x - this.x) * t), (this.y += (e.y - this.y) * t), this;
  }
  lerpVectors(e, t, n) {
    return (
      (this.x = e.x + (t.x - e.x) * n), (this.y = e.y + (t.y - e.y) * n), this
    );
  }
  equals(e) {
    return e.x === this.x && e.y === this.y;
  }
  fromArray(e, t) {
    return void 0 === t && (t = 0), (this.x = e[t]), (this.y = e[t + 1]), this;
  }
  toArray(e, t) {
    return (
      void 0 === e && (e = []),
      void 0 === t && (t = 0),
      (e[t] = this.x),
      (e[t + 1] = this.y),
      e
    );
  }
  fromBufferAttribute(e, t, n) {
    return (
      void 0 !== n &&
        console.warn(
          "THREE.Vector2: offset has been removed from .fromBufferAttribute()."
        ),
      (this.x = e.getX(t)),
      (this.y = e.getY(t)),
      this
    );
  }
  rotateAround(e, t) {
    const n = Math.cos(t),
      r = Math.sin(t),
      i = this.x - e.x,
      o = this.y - e.y;
    return (this.x = i * n - o * r + e.x), (this.y = i * r + o * n + e.y), this;
  }
  random() {
    return (this.x = Math.random()), (this.y = Math.random()), this;
  }
}
class Matrix3 {
  constructor() {
    Object.defineProperty(this, "isMatrix3", { value: !0 }),
      (this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1]),
      arguments.length > 0 &&
        console.error(
          "THREE.Matrix3: the constructor no longer reads arguments. use .set() instead."
        );
  }
  set(e, t, n, r, i, o, a, s, c) {
    const l = this.elements;
    return (
      (l[0] = e),
      (l[1] = r),
      (l[2] = a),
      (l[3] = t),
      (l[4] = i),
      (l[5] = s),
      (l[6] = n),
      (l[7] = o),
      (l[8] = c),
      this
    );
  }
  identity() {
    return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this;
  }
  clone() {
    return new this.constructor().fromArray(this.elements);
  }
  copy(e) {
    const t = this.elements,
      n = e.elements;
    return (
      (t[0] = n[0]),
      (t[1] = n[1]),
      (t[2] = n[2]),
      (t[3] = n[3]),
      (t[4] = n[4]),
      (t[5] = n[5]),
      (t[6] = n[6]),
      (t[7] = n[7]),
      (t[8] = n[8]),
      this
    );
  }
  extractBasis(e, t, n) {
    return (
      e.setFromMatrix3Column(this, 0),
      t.setFromMatrix3Column(this, 1),
      n.setFromMatrix3Column(this, 2),
      this
    );
  }
  setFromMatrix4(e) {
    const t = e.elements;
    return (
      this.set(t[0], t[4], t[8], t[1], t[5], t[9], t[2], t[6], t[10]), this
    );
  }
  multiply(e) {
    return this.multiplyMatrices(this, e);
  }
  premultiply(e) {
    return this.multiplyMatrices(e, this);
  }
  multiplyMatrices(e, t) {
    const n = e.elements,
      r = t.elements,
      i = this.elements,
      o = n[0],
      a = n[3],
      s = n[6],
      c = n[1],
      l = n[4],
      h = n[7],
      u = n[2],
      d = n[5],
      p = n[8],
      m = r[0],
      f = r[3],
      g = r[6],
      v = r[1],
      y = r[4],
      _ = r[7],
      x = r[2],
      b = r[5],
      M = r[8];
    return (
      (i[0] = o * m + a * v + s * x),
      (i[3] = o * f + a * y + s * b),
      (i[6] = o * g + a * _ + s * M),
      (i[1] = c * m + l * v + h * x),
      (i[4] = c * f + l * y + h * b),
      (i[7] = c * g + l * _ + h * M),
      (i[2] = u * m + d * v + p * x),
      (i[5] = u * f + d * y + p * b),
      (i[8] = u * g + d * _ + p * M),
      this
    );
  }
  multiplyScalar(e) {
    const t = this.elements;
    return (
      (t[0] *= e),
      (t[3] *= e),
      (t[6] *= e),
      (t[1] *= e),
      (t[4] *= e),
      (t[7] *= e),
      (t[2] *= e),
      (t[5] *= e),
      (t[8] *= e),
      this
    );
  }
  determinant() {
    const e = this.elements,
      t = e[0],
      n = e[1],
      r = e[2],
      i = e[3],
      o = e[4],
      a = e[5],
      s = e[6],
      c = e[7],
      l = e[8];
    return (
      t * o * l - t * a * c - n * i * l + n * a * s + r * i * c - r * o * s
    );
  }
  getInverse(e, t) {
    void 0 !== t &&
      console.warn(
        "THREE.Matrix3: .getInverse() can no longer be configured to throw on degenerate."
      );
    const n = e.elements,
      r = this.elements,
      i = n[0],
      o = n[1],
      a = n[2],
      s = n[3],
      c = n[4],
      l = n[5],
      h = n[6],
      u = n[7],
      d = n[8],
      p = d * c - l * u,
      m = l * h - d * s,
      f = u * s - c * h,
      g = i * p + o * m + a * f;
    if (0 === g) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const v = 1 / g;
    return (
      (r[0] = p * v),
      (r[1] = (a * u - d * o) * v),
      (r[2] = (l * o - a * c) * v),
      (r[3] = m * v),
      (r[4] = (d * i - a * h) * v),
      (r[5] = (a * s - l * i) * v),
      (r[6] = f * v),
      (r[7] = (o * h - u * i) * v),
      (r[8] = (c * i - o * s) * v),
      this
    );
  }
  transpose() {
    let e;
    const t = this.elements;
    return (
      (e = t[1]),
      (t[1] = t[3]),
      (t[3] = e),
      (e = t[2]),
      (t[2] = t[6]),
      (t[6] = e),
      (e = t[5]),
      (t[5] = t[7]),
      (t[7] = e),
      this
    );
  }
  getNormalMatrix(e) {
    return this.setFromMatrix4(e).getInverse(this).transpose();
  }
  transposeIntoArray(e) {
    const t = this.elements;
    return (
      (e[0] = t[0]),
      (e[1] = t[3]),
      (e[2] = t[6]),
      (e[3] = t[1]),
      (e[4] = t[4]),
      (e[5] = t[7]),
      (e[6] = t[2]),
      (e[7] = t[5]),
      (e[8] = t[8]),
      this
    );
  }
  setUvTransform(e, t, n, r, i, o, a) {
    const s = Math.cos(i),
      c = Math.sin(i);
    this.set(
      n * s,
      n * c,
      -n * (s * o + c * a) + o + e,
      -r * c,
      r * s,
      -r * (-c * o + s * a) + a + t,
      0,
      0,
      1
    );
  }
  scale(e, t) {
    const n = this.elements;
    return (
      (n[0] *= e),
      (n[3] *= e),
      (n[6] *= e),
      (n[1] *= t),
      (n[4] *= t),
      (n[7] *= t),
      this
    );
  }
  rotate(e) {
    const t = Math.cos(e),
      n = Math.sin(e),
      r = this.elements,
      i = r[0],
      o = r[3],
      a = r[6],
      s = r[1],
      c = r[4],
      l = r[7];
    return (
      (r[0] = t * i + n * s),
      (r[3] = t * o + n * c),
      (r[6] = t * a + n * l),
      (r[1] = -n * i + t * s),
      (r[4] = -n * o + t * c),
      (r[7] = -n * a + t * l),
      this
    );
  }
  translate(e, t) {
    const n = this.elements;
    return (
      (n[0] += e * n[2]),
      (n[3] += e * n[5]),
      (n[6] += e * n[8]),
      (n[1] += t * n[2]),
      (n[4] += t * n[5]),
      (n[7] += t * n[8]),
      this
    );
  }
  equals(e) {
    const t = this.elements,
      n = e.elements;
    for (let e = 0; e < 9; e++) if (t[e] !== n[e]) return !1;
    return !0;
  }
  fromArray(e, t) {
    void 0 === t && (t = 0);
    for (let n = 0; n < 9; n++) this.elements[n] = e[n + t];
    return this;
  }
  toArray(e, t) {
    void 0 === e && (e = []), void 0 === t && (t = 0);
    const n = this.elements;
    return (
      (e[t] = n[0]),
      (e[t + 1] = n[1]),
      (e[t + 2] = n[2]),
      (e[t + 3] = n[3]),
      (e[t + 4] = n[4]),
      (e[t + 5] = n[5]),
      (e[t + 6] = n[6]),
      (e[t + 7] = n[7]),
      (e[t + 8] = n[8]),
      e
    );
  }
}
let _canvas;
const ImageUtils = {
  getDataURL: function (e) {
    if (/^data:/i.test(e.src)) return e.src;
    if ("undefined" == typeof HTMLCanvasElement) return e.src;
    let t;
    if (e instanceof HTMLCanvasElement) t = e;
    else {
      void 0 === _canvas &&
        (_canvas = document.createElementNS(
          "http://www.w3.org/1999/xhtml",
          "canvas"
        )),
        (_canvas.width = e.width),
        (_canvas.height = e.height);
      const n = _canvas.getContext("2d");
      e instanceof ImageData
        ? n.putImageData(e, 0, 0)
        : n.drawImage(e, 0, 0, e.width, e.height),
        (t = _canvas);
    }
    return t.width > 2048 || t.height > 2048
      ? t.toDataURL("image/jpeg", 0.6)
      : t.toDataURL("image/png");
  }
};
let textureId = 0;
function Texture(e, t, n, r, i, o, a, s, c, l) {
  Object.defineProperty(this, "id", { value: textureId++ }),
    (this.uuid = MathUtils.generateUUID()),
    (this.name = ""),
    (this.image = void 0 !== e ? e : Texture.DEFAULT_IMAGE),
    (this.mipmaps = []),
    (this.mapping = void 0 !== t ? t : Texture.DEFAULT_MAPPING),
    (this.wrapS = void 0 !== n ? n : ClampToEdgeWrapping),
    (this.wrapT = void 0 !== r ? r : ClampToEdgeWrapping),
    (this.magFilter = void 0 !== i ? i : LinearFilter),
    (this.minFilter = void 0 !== o ? o : LinearMipmapLinearFilter),
    (this.anisotropy = void 0 !== c ? c : 1),
    (this.format = void 0 !== a ? a : RGBAFormat),
    (this.internalFormat = null),
    (this.type = void 0 !== s ? s : UnsignedByteType),
    (this.offset = new Vector2(0, 0)),
    (this.repeat = new Vector2(1, 1)),
    (this.center = new Vector2(0, 0)),
    (this.rotation = 0),
    (this.matrixAutoUpdate = !0),
    (this.matrix = new Matrix3()),
    (this.generateMipmaps = !0),
    (this.premultiplyAlpha = !1),
    (this.flipY = !0),
    (this.unpackAlignment = 4),
    (this.encoding = void 0 !== l ? l : LinearEncoding),
    (this.version = 0),
    (this.onUpdate = null);
}
(Texture.DEFAULT_IMAGE = void 0),
  (Texture.DEFAULT_MAPPING = 300),
  (Texture.prototype = Object.assign(Object.create(EventDispatcher.prototype), {
    constructor: Texture,
    isTexture: !0,
    updateMatrix: function () {
      this.matrix.setUvTransform(
        this.offset.x,
        this.offset.y,
        this.repeat.x,
        this.repeat.y,
        this.rotation,
        this.center.x,
        this.center.y
      );
    },
    clone: function () {
      return new this.constructor().copy(this);
    },
    copy: function (e) {
      return (
        (this.name = e.name),
        (this.image = e.image),
        (this.mipmaps = e.mipmaps.slice(0)),
        (this.mapping = e.mapping),
        (this.wrapS = e.wrapS),
        (this.wrapT = e.wrapT),
        (this.magFilter = e.magFilter),
        (this.minFilter = e.minFilter),
        (this.anisotropy = e.anisotropy),
        (this.format = e.format),
        (this.internalFormat = e.internalFormat),
        (this.type = e.type),
        this.offset.copy(e.offset),
        this.repeat.copy(e.repeat),
        this.center.copy(e.center),
        (this.rotation = e.rotation),
        (this.matrixAutoUpdate = e.matrixAutoUpdate),
        this.matrix.copy(e.matrix),
        (this.generateMipmaps = e.generateMipmaps),
        (this.premultiplyAlpha = e.premultiplyAlpha),
        (this.flipY = e.flipY),
        (this.unpackAlignment = e.unpackAlignment),
        (this.encoding = e.encoding),
        this
      );
    },
    toJSON: function (e) {
      const t = void 0 === e || "string" == typeof e;
      if (!t && void 0 !== e.textures[this.uuid]) return e.textures[this.uuid];
      const n = {
        metadata: {
          version: 4.5,
          type: "Texture",
          generator: "Texture.toJSON"
        },
        uuid: this.uuid,
        name: this.name,
        mapping: this.mapping,
        repeat: [this.repeat.x, this.repeat.y],
        offset: [this.offset.x, this.offset.y],
        center: [this.center.x, this.center.y],
        rotation: this.rotation,
        wrap: [this.wrapS, this.wrapT],
        format: this.format,
        type: this.type,
        encoding: this.encoding,
        minFilter: this.minFilter,
        magFilter: this.magFilter,
        anisotropy: this.anisotropy,
        flipY: this.flipY,
        premultiplyAlpha: this.premultiplyAlpha,
        unpackAlignment: this.unpackAlignment
      };
      if (void 0 !== this.image) {
        const r = this.image;
        if (
          (void 0 === r.uuid && (r.uuid = MathUtils.generateUUID()),
          !t && void 0 === e.images[r.uuid])
        ) {
          let t;
          if (Array.isArray(r)) {
            t = [];
            for (let e = 0, n = r.length; e < n; e++)
              t.push(ImageUtils.getDataURL(r[e]));
          } else t = ImageUtils.getDataURL(r);
          e.images[r.uuid] = { uuid: r.uuid, url: t };
        }
        n.image = r.uuid;
      }
      return t || (e.textures[this.uuid] = n), n;
    },
    dispose: function () {
      this.dispatchEvent({ type: "dispose" });
    },
    transformUv: function (e) {
      if (300 !== this.mapping) return e;
      if ((e.applyMatrix3(this.matrix), e.x < 0 || e.x > 1))
        switch (this.wrapS) {
          case RepeatWrapping:
            e.x = e.x - Math.floor(e.x);
            break;
          case ClampToEdgeWrapping:
            e.x = e.x < 0 ? 0 : 1;
            break;
          case MirroredRepeatWrapping:
            1 === Math.abs(Math.floor(e.x) % 2)
              ? (e.x = Math.ceil(e.x) - e.x)
              : (e.x = e.x - Math.floor(e.x));
        }
      if (e.y < 0 || e.y > 1)
        switch (this.wrapT) {
          case RepeatWrapping:
            e.y = e.y - Math.floor(e.y);
            break;
          case ClampToEdgeWrapping:
            e.y = e.y < 0 ? 0 : 1;
            break;
          case MirroredRepeatWrapping:
            1 === Math.abs(Math.floor(e.y) % 2)
              ? (e.y = Math.ceil(e.y) - e.y)
              : (e.y = e.y - Math.floor(e.y));
        }
      return this.flipY && (e.y = 1 - e.y), e;
    }
  })),
  Object.defineProperty(Texture.prototype, "needsUpdate", {
    set: function (e) {
      !0 === e && this.version++;
    }
  });
class Vector4 {
  constructor(e = 0, t = 0, n = 0, r = 1) {
    Object.defineProperty(this, "isVector4", { value: !0 }),
      (this.x = e),
      (this.y = t),
      (this.z = n),
      (this.w = r);
  }
  get width() {
    return this.z;
  }
  set width(e) {
    this.z = e;
  }
  get height() {
    return this.w;
  }
  set height(e) {
    this.w = e;
  }
  set(e, t, n, r) {
    return (this.x = e), (this.y = t), (this.z = n), (this.w = r), this;
  }
  setScalar(e) {
    return (this.x = e), (this.y = e), (this.z = e), (this.w = e), this;
  }
  setX(e) {
    return (this.x = e), this;
  }
  setY(e) {
    return (this.y = e), this;
  }
  setZ(e) {
    return (this.z = e), this;
  }
  setW(e) {
    return (this.w = e), this;
  }
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      case 2:
        this.z = t;
        break;
      case 3:
        this.w = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z, this.w);
  }
  copy(e) {
    return (
      (this.x = e.x),
      (this.y = e.y),
      (this.z = e.z),
      (this.w = void 0 !== e.w ? e.w : 1),
      this
    );
  }
  add(e, t) {
    return void 0 !== t
      ? (console.warn(
          "THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead."
        ),
        this.addVectors(e, t))
      : ((this.x += e.x),
        (this.y += e.y),
        (this.z += e.z),
        (this.w += e.w),
        this);
  }
  addScalar(e) {
    return (this.x += e), (this.y += e), (this.z += e), (this.w += e), this;
  }
  addVectors(e, t) {
    return (
      (this.x = e.x + t.x),
      (this.y = e.y + t.y),
      (this.z = e.z + t.z),
      (this.w = e.w + t.w),
      this
    );
  }
  addScaledVector(e, t) {
    return (
      (this.x += e.x * t),
      (this.y += e.y * t),
      (this.z += e.z * t),
      (this.w += e.w * t),
      this
    );
  }
  sub(e, t) {
    return void 0 !== t
      ? (console.warn(
          "THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."
        ),
        this.subVectors(e, t))
      : ((this.x -= e.x),
        (this.y -= e.y),
        (this.z -= e.z),
        (this.w -= e.w),
        this);
  }
  subScalar(e) {
    return (this.x -= e), (this.y -= e), (this.z -= e), (this.w -= e), this;
  }
  subVectors(e, t) {
    return (
      (this.x = e.x - t.x),
      (this.y = e.y - t.y),
      (this.z = e.z - t.z),
      (this.w = e.w - t.w),
      this
    );
  }
  multiplyScalar(e) {
    return (this.x *= e), (this.y *= e), (this.z *= e), (this.w *= e), this;
  }
  applyMatrix4(e) {
    const t = this.x,
      n = this.y,
      r = this.z,
      i = this.w,
      o = e.elements;
    return (
      (this.x = o[0] * t + o[4] * n + o[8] * r + o[12] * i),
      (this.y = o[1] * t + o[5] * n + o[9] * r + o[13] * i),
      (this.z = o[2] * t + o[6] * n + o[10] * r + o[14] * i),
      (this.w = o[3] * t + o[7] * n + o[11] * r + o[15] * i),
      this
    );
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  setAxisAngleFromQuaternion(e) {
    this.w = 2 * Math.acos(e.w);
    const t = Math.sqrt(1 - e.w * e.w);
    return (
      t < 1e-4
        ? ((this.x = 1), (this.y = 0), (this.z = 0))
        : ((this.x = e.x / t), (this.y = e.y / t), (this.z = e.z / t)),
      this
    );
  }
  setAxisAngleFromRotationMatrix(e) {
    let t, n, r, i;
    const o = e.elements,
      a = o[0],
      s = o[4],
      c = o[8],
      l = o[1],
      h = o[5],
      u = o[9],
      d = o[2],
      p = o[6],
      m = o[10];
    if (
      Math.abs(s - l) < 0.01 &&
      Math.abs(c - d) < 0.01 &&
      Math.abs(u - p) < 0.01
    ) {
      if (
        Math.abs(s + l) < 0.1 &&
        Math.abs(c + d) < 0.1 &&
        Math.abs(u + p) < 0.1 &&
        Math.abs(a + h + m - 3) < 0.1
      )
        return this.set(1, 0, 0, 0), this;
      t = Math.PI;
      const e = (a + 1) / 2,
        o = (h + 1) / 2,
        f = (m + 1) / 2,
        g = (s + l) / 4,
        v = (c + d) / 4,
        y = (u + p) / 4;
      return (
        e > o && e > f
          ? e < 0.01
            ? ((n = 0), (r = 0.707106781), (i = 0.707106781))
            : ((r = g / (n = Math.sqrt(e))), (i = v / n))
          : o > f
          ? o < 0.01
            ? ((n = 0.707106781), (r = 0), (i = 0.707106781))
            : ((n = g / (r = Math.sqrt(o))), (i = y / r))
          : f < 0.01
          ? ((n = 0.707106781), (r = 0.707106781), (i = 0))
          : ((n = v / (i = Math.sqrt(f))), (r = y / i)),
        this.set(n, r, i, t),
        this
      );
    }
    let f = Math.sqrt(
      (p - u) * (p - u) + (c - d) * (c - d) + (l - s) * (l - s)
    );
    return (
      Math.abs(f) < 0.001 && (f = 1),
      (this.x = (p - u) / f),
      (this.y = (c - d) / f),
      (this.z = (l - s) / f),
      (this.w = Math.acos((a + h + m - 1) / 2)),
      this
    );
  }
  min(e) {
    return (
      (this.x = Math.min(this.x, e.x)),
      (this.y = Math.min(this.y, e.y)),
      (this.z = Math.min(this.z, e.z)),
      (this.w = Math.min(this.w, e.w)),
      this
    );
  }
  max(e) {
    return (
      (this.x = Math.max(this.x, e.x)),
      (this.y = Math.max(this.y, e.y)),
      (this.z = Math.max(this.z, e.z)),
      (this.w = Math.max(this.w, e.w)),
      this
    );
  }
  clamp(e, t) {
    return (
      (this.x = Math.max(e.x, Math.min(t.x, this.x))),
      (this.y = Math.max(e.y, Math.min(t.y, this.y))),
      (this.z = Math.max(e.z, Math.min(t.z, this.z))),
      (this.w = Math.max(e.w, Math.min(t.w, this.w))),
      this
    );
  }
  clampScalar(e, t) {
    return (
      (this.x = Math.max(e, Math.min(t, this.x))),
      (this.y = Math.max(e, Math.min(t, this.y))),
      (this.z = Math.max(e, Math.min(t, this.z))),
      (this.w = Math.max(e, Math.min(t, this.w))),
      this
    );
  }
  clampLength(e, t) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(
      Math.max(e, Math.min(t, n))
    );
  }
  floor() {
    return (
      (this.x = Math.floor(this.x)),
      (this.y = Math.floor(this.y)),
      (this.z = Math.floor(this.z)),
      (this.w = Math.floor(this.w)),
      this
    );
  }
  ceil() {
    return (
      (this.x = Math.ceil(this.x)),
      (this.y = Math.ceil(this.y)),
      (this.z = Math.ceil(this.z)),
      (this.w = Math.ceil(this.w)),
      this
    );
  }
  round() {
    return (
      (this.x = Math.round(this.x)),
      (this.y = Math.round(this.y)),
      (this.z = Math.round(this.z)),
      (this.w = Math.round(this.w)),
      this
    );
  }
  roundToZero() {
    return (
      (this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x)),
      (this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y)),
      (this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z)),
      (this.w = this.w < 0 ? Math.ceil(this.w) : Math.floor(this.w)),
      this
    );
  }
  negate() {
    return (
      (this.x = -this.x),
      (this.y = -this.y),
      (this.z = -this.z),
      (this.w = -this.w),
      this
    );
  }
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w;
  }
  lengthSq() {
    return (
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }
  length() {
    return Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }
  manhattanLength() {
    return (
      Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w)
    );
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, t) {
    return (
      (this.x += (e.x - this.x) * t),
      (this.y += (e.y - this.y) * t),
      (this.z += (e.z - this.z) * t),
      (this.w += (e.w - this.w) * t),
      this
    );
  }
  lerpVectors(e, t, n) {
    return (
      (this.x = e.x + (t.x - e.x) * n),
      (this.y = e.y + (t.y - e.y) * n),
      (this.z = e.z + (t.z - e.z) * n),
      (this.w = e.w + (t.w - e.w) * n),
      this
    );
  }
  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z && e.w === this.w;
  }
  fromArray(e, t) {
    return (
      void 0 === t && (t = 0),
      (this.x = e[t]),
      (this.y = e[t + 1]),
      (this.z = e[t + 2]),
      (this.w = e[t + 3]),
      this
    );
  }
  toArray(e, t) {
    return (
      void 0 === e && (e = []),
      void 0 === t && (t = 0),
      (e[t] = this.x),
      (e[t + 1] = this.y),
      (e[t + 2] = this.z),
      (e[t + 3] = this.w),
      e
    );
  }
  fromBufferAttribute(e, t, n) {
    return (
      void 0 !== n &&
        console.warn(
          "THREE.Vector4: offset has been removed from .fromBufferAttribute()."
        ),
      (this.x = e.getX(t)),
      (this.y = e.getY(t)),
      (this.z = e.getZ(t)),
      (this.w = e.getW(t)),
      this
    );
  }
  random() {
    return (
      (this.x = Math.random()),
      (this.y = Math.random()),
      (this.z = Math.random()),
      (this.w = Math.random()),
      this
    );
  }
}
function WebGLRenderTarget(e, t, n) {
  (this.width = e),
    (this.height = t),
    (this.scissor = new Vector4(0, 0, e, t)),
    (this.scissorTest = !1),
    (this.viewport = new Vector4(0, 0, e, t)),
    (n = n || {}),
    (this.texture = new Texture(
      void 0,
      n.mapping,
      n.wrapS,
      n.wrapT,
      n.magFilter,
      n.minFilter,
      n.format,
      n.type,
      n.anisotropy,
      n.encoding
    )),
    (this.texture.image = {}),
    (this.texture.image.width = e),
    (this.texture.image.height = t),
    (this.texture.generateMipmaps =
      void 0 !== n.generateMipmaps && n.generateMipmaps),
    (this.texture.minFilter =
      void 0 !== n.minFilter ? n.minFilter : LinearFilter),
    (this.depthBuffer = void 0 === n.depthBuffer || n.depthBuffer),
    (this.stencilBuffer = void 0 !== n.stencilBuffer && n.stencilBuffer),
    (this.depthTexture = void 0 !== n.depthTexture ? n.depthTexture : null);
}
function WebGLMultisampleRenderTarget(e, t, n) {
  WebGLRenderTarget.call(this, e, t, n), (this.samples = 4);
}
(WebGLRenderTarget.prototype = Object.assign(
  Object.create(EventDispatcher.prototype),
  {
    constructor: WebGLRenderTarget,
    isWebGLRenderTarget: !0,
    setSize: function (e, t) {
      (this.width === e && this.height === t) ||
        ((this.width = e),
        (this.height = t),
        (this.texture.image.width = e),
        (this.texture.image.height = t),
        this.dispose()),
        this.viewport.set(0, 0, e, t),
        this.scissor.set(0, 0, e, t);
    },
    clone: function () {
      return new this.constructor().copy(this);
    },
    copy: function (e) {
      return (
        (this.width = e.width),
        (this.height = e.height),
        this.viewport.copy(e.viewport),
        (this.texture = e.texture.clone()),
        (this.depthBuffer = e.depthBuffer),
        (this.stencilBuffer = e.stencilBuffer),
        (this.depthTexture = e.depthTexture),
        this
      );
    },
    dispose: function () {
      this.dispatchEvent({ type: "dispose" });
    }
  }
)),
  (WebGLMultisampleRenderTarget.prototype = Object.assign(
    Object.create(WebGLRenderTarget.prototype),
    {
      constructor: WebGLMultisampleRenderTarget,
      isWebGLMultisampleRenderTarget: !0,
      copy: function (e) {
        return (
          WebGLRenderTarget.prototype.copy.call(this, e),
          (this.samples = e.samples),
          this
        );
      }
    }
  ));
class Quaternion {
  constructor(e = 0, t = 0, n = 0, r = 1) {
    Object.defineProperty(this, "isQuaternion", { value: !0 }),
      (this._x = e),
      (this._y = t),
      (this._z = n),
      (this._w = r);
  }
  static slerp(e, t, n, r) {
    return n.copy(e).slerp(t, r);
  }
  static slerpFlat(e, t, n, r, i, o, a) {
    let s = n[r + 0],
      c = n[r + 1],
      l = n[r + 2],
      h = n[r + 3];
    const u = i[o + 0],
      d = i[o + 1],
      p = i[o + 2],
      m = i[o + 3];
    if (h !== m || s !== u || c !== d || l !== p) {
      let e = 1 - a;
      const t = s * u + c * d + l * p + h * m,
        n = t >= 0 ? 1 : -1,
        r = 1 - t * t;
      if (r > Number.EPSILON) {
        const i = Math.sqrt(r),
          o = Math.atan2(i, t * n);
        (e = Math.sin(e * o) / i), (a = Math.sin(a * o) / i);
      }
      const i = a * n;
      if (
        ((s = s * e + u * i),
        (c = c * e + d * i),
        (l = l * e + p * i),
        (h = h * e + m * i),
        e === 1 - a)
      ) {
        const e = 1 / Math.sqrt(s * s + c * c + l * l + h * h);
        (s *= e), (c *= e), (l *= e), (h *= e);
      }
    }
    (e[t] = s), (e[t + 1] = c), (e[t + 2] = l), (e[t + 3] = h);
  }
  static multiplyQuaternionsFlat(e, t, n, r, i, o) {
    const a = n[r],
      s = n[r + 1],
      c = n[r + 2],
      l = n[r + 3],
      h = i[o],
      u = i[o + 1],
      d = i[o + 2],
      p = i[o + 3];
    return (
      (e[t] = a * p + l * h + s * d - c * u),
      (e[t + 1] = s * p + l * u + c * h - a * d),
      (e[t + 2] = c * p + l * d + a * u - s * h),
      (e[t + 3] = l * p - a * h - s * u - c * d),
      e
    );
  }
  get x() {
    return this._x;
  }
  set x(e) {
    (this._x = e), this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(e) {
    (this._y = e), this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(e) {
    (this._z = e), this._onChangeCallback();
  }
  get w() {
    return this._w;
  }
  set w(e) {
    (this._w = e), this._onChangeCallback();
  }
  set(e, t, n, r) {
    return (
      (this._x = e),
      (this._y = t),
      (this._z = n),
      (this._w = r),
      this._onChangeCallback(),
      this
    );
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }
  copy(e) {
    return (
      (this._x = e.x),
      (this._y = e.y),
      (this._z = e.z),
      (this._w = e.w),
      this._onChangeCallback(),
      this
    );
  }
  setFromEuler(e, t) {
    if (!e || !e.isEuler)
      throw new Error(
        "THREE.Quaternion: .setFromEuler() now expects an Euler rotation rather than a Vector3 and order."
      );
    const n = e._x,
      r = e._y,
      i = e._z,
      o = e._order,
      a = Math.cos,
      s = Math.sin,
      c = a(n / 2),
      l = a(r / 2),
      h = a(i / 2),
      u = s(n / 2),
      d = s(r / 2),
      p = s(i / 2);
    switch (o) {
      case "XYZ":
        (this._x = u * l * h + c * d * p),
          (this._y = c * d * h - u * l * p),
          (this._z = c * l * p + u * d * h),
          (this._w = c * l * h - u * d * p);
        break;
      case "YXZ":
        (this._x = u * l * h + c * d * p),
          (this._y = c * d * h - u * l * p),
          (this._z = c * l * p - u * d * h),
          (this._w = c * l * h + u * d * p);
        break;
      case "ZXY":
        (this._x = u * l * h - c * d * p),
          (this._y = c * d * h + u * l * p),
          (this._z = c * l * p + u * d * h),
          (this._w = c * l * h - u * d * p);
        break;
      case "ZYX":
        (this._x = u * l * h - c * d * p),
          (this._y = c * d * h + u * l * p),
          (this._z = c * l * p - u * d * h),
          (this._w = c * l * h + u * d * p);
        break;
      case "YZX":
        (this._x = u * l * h + c * d * p),
          (this._y = c * d * h + u * l * p),
          (this._z = c * l * p - u * d * h),
          (this._w = c * l * h - u * d * p);
        break;
      case "XZY":
        (this._x = u * l * h - c * d * p),
          (this._y = c * d * h - u * l * p),
          (this._z = c * l * p + u * d * h),
          (this._w = c * l * h + u * d * p);
        break;
      default:
        console.warn(
          "THREE.Quaternion: .setFromEuler() encountered an unknown order: " + o
        );
    }
    return !1 !== t && this._onChangeCallback(), this;
  }
  setFromAxisAngle(e, t) {
    const n = t / 2,
      r = Math.sin(n);
    return (
      (this._x = e.x * r),
      (this._y = e.y * r),
      (this._z = e.z * r),
      (this._w = Math.cos(n)),
      this._onChangeCallback(),
      this
    );
  }
  setFromRotationMatrix(e) {
    const t = e.elements,
      n = t[0],
      r = t[4],
      i = t[8],
      o = t[1],
      a = t[5],
      s = t[9],
      c = t[2],
      l = t[6],
      h = t[10],
      u = n + a + h;
    if (u > 0) {
      const e = 0.5 / Math.sqrt(u + 1);
      (this._w = 0.25 / e),
        (this._x = (l - s) * e),
        (this._y = (i - c) * e),
        (this._z = (o - r) * e);
    } else if (n > a && n > h) {
      const e = 2 * Math.sqrt(1 + n - a - h);
      (this._w = (l - s) / e),
        (this._x = 0.25 * e),
        (this._y = (r + o) / e),
        (this._z = (i + c) / e);
    } else if (a > h) {
      const e = 2 * Math.sqrt(1 + a - n - h);
      (this._w = (i - c) / e),
        (this._x = (r + o) / e),
        (this._y = 0.25 * e),
        (this._z = (s + l) / e);
    } else {
      const e = 2 * Math.sqrt(1 + h - n - a);
      (this._w = (o - r) / e),
        (this._x = (i + c) / e),
        (this._y = (s + l) / e),
        (this._z = 0.25 * e);
    }
    return this._onChangeCallback(), this;
  }
  setFromUnitVectors(e, t) {
    let n = e.dot(t) + 1;
    return (
      n < 1e-6
        ? ((n = 0),
          Math.abs(e.x) > Math.abs(e.z)
            ? ((this._x = -e.y), (this._y = e.x), (this._z = 0), (this._w = n))
            : ((this._x = 0), (this._y = -e.z), (this._z = e.y), (this._w = n)))
        : ((this._x = e.y * t.z - e.z * t.y),
          (this._y = e.z * t.x - e.x * t.z),
          (this._z = e.x * t.y - e.y * t.x),
          (this._w = n)),
      this.normalize()
    );
  }
  angleTo(e) {
    return 2 * Math.acos(Math.abs(MathUtils.clamp(this.dot(e), -1, 1)));
  }
  rotateTowards(e, t) {
    const n = this.angleTo(e);
    if (0 === n) return this;
    const r = Math.min(1, t / n);
    return this.slerp(e, r), this;
  }
  identity() {
    return this.set(0, 0, 0, 1);
  }
  inverse() {
    return this.conjugate();
  }
  conjugate() {
    return (
      (this._x *= -1),
      (this._y *= -1),
      (this._z *= -1),
      this._onChangeCallback(),
      this
    );
  }
  dot(e) {
    return this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w;
  }
  lengthSq() {
    return (
      this._x * this._x +
      this._y * this._y +
      this._z * this._z +
      this._w * this._w
    );
  }
  length() {
    return Math.sqrt(
      this._x * this._x +
        this._y * this._y +
        this._z * this._z +
        this._w * this._w
    );
  }
  normalize() {
    let e = this.length();
    return (
      0 === e
        ? ((this._x = 0), (this._y = 0), (this._z = 0), (this._w = 1))
        : ((e = 1 / e),
          (this._x = this._x * e),
          (this._y = this._y * e),
          (this._z = this._z * e),
          (this._w = this._w * e)),
      this._onChangeCallback(),
      this
    );
  }
  multiply(e, t) {
    return void 0 !== t
      ? (console.warn(
          "THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead."
        ),
        this.multiplyQuaternions(e, t))
      : this.multiplyQuaternions(this, e);
  }
  premultiply(e) {
    return this.multiplyQuaternions(e, this);
  }
  multiplyQuaternions(e, t) {
    const n = e._x,
      r = e._y,
      i = e._z,
      o = e._w,
      a = t._x,
      s = t._y,
      c = t._z,
      l = t._w;
    return (
      (this._x = n * l + o * a + r * c - i * s),
      (this._y = r * l + o * s + i * a - n * c),
      (this._z = i * l + o * c + n * s - r * a),
      (this._w = o * l - n * a - r * s - i * c),
      this._onChangeCallback(),
      this
    );
  }
  slerp(e, t) {
    if (0 === t) return this;
    if (1 === t) return this.copy(e);
    const n = this._x,
      r = this._y,
      i = this._z,
      o = this._w;
    let a = o * e._w + n * e._x + r * e._y + i * e._z;
    if (
      (a < 0
        ? ((this._w = -e._w),
          (this._x = -e._x),
          (this._y = -e._y),
          (this._z = -e._z),
          (a = -a))
        : this.copy(e),
      a >= 1)
    )
      return (this._w = o), (this._x = n), (this._y = r), (this._z = i), this;
    const s = 1 - a * a;
    if (s <= Number.EPSILON) {
      const e = 1 - t;
      return (
        (this._w = e * o + t * this._w),
        (this._x = e * n + t * this._x),
        (this._y = e * r + t * this._y),
        (this._z = e * i + t * this._z),
        this.normalize(),
        this._onChangeCallback(),
        this
      );
    }
    const c = Math.sqrt(s),
      l = Math.atan2(c, a),
      h = Math.sin((1 - t) * l) / c,
      u = Math.sin(t * l) / c;
    return (
      (this._w = o * h + this._w * u),
      (this._x = n * h + this._x * u),
      (this._y = r * h + this._y * u),
      (this._z = i * h + this._z * u),
      this._onChangeCallback(),
      this
    );
  }
  equals(e) {
    return (
      e._x === this._x &&
      e._y === this._y &&
      e._z === this._z &&
      e._w === this._w
    );
  }
  fromArray(e, t) {
    return (
      void 0 === t && (t = 0),
      (this._x = e[t]),
      (this._y = e[t + 1]),
      (this._z = e[t + 2]),
      (this._w = e[t + 3]),
      this._onChangeCallback(),
      this
    );
  }
  toArray(e, t) {
    return (
      void 0 === e && (e = []),
      void 0 === t && (t = 0),
      (e[t] = this._x),
      (e[t + 1] = this._y),
      (e[t + 2] = this._z),
      (e[t + 3] = this._w),
      e
    );
  }
  fromBufferAttribute(e, t) {
    return (
      (this._x = e.getX(t)),
      (this._y = e.getY(t)),
      (this._z = e.getZ(t)),
      (this._w = e.getW(t)),
      this
    );
  }
  _onChange(e) {
    return (this._onChangeCallback = e), this;
  }
  _onChangeCallback() {}
}
class Vector3 {
  constructor(e = 0, t = 0, n = 0) {
    Object.defineProperty(this, "isVector3", { value: !0 }),
      (this.x = e),
      (this.y = t),
      (this.z = n);
  }
  set(e, t, n) {
    return (
      void 0 === n && (n = this.z),
      (this.x = e),
      (this.y = t),
      (this.z = n),
      this
    );
  }
  setScalar(e) {
    return (this.x = e), (this.y = e), (this.z = e), this;
  }
  setX(e) {
    return (this.x = e), this;
  }
  setY(e) {
    return (this.y = e), this;
  }
  setZ(e) {
    return (this.z = e), this;
  }
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      case 2:
        this.z = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }
  copy(e) {
    return (this.x = e.x), (this.y = e.y), (this.z = e.z), this;
  }
  add(e, t) {
    return void 0 !== t
      ? (console.warn(
          "THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead."
        ),
        this.addVectors(e, t))
      : ((this.x += e.x), (this.y += e.y), (this.z += e.z), this);
  }
  addScalar(e) {
    return (this.x += e), (this.y += e), (this.z += e), this;
  }
  addVectors(e, t) {
    return (
      (this.x = e.x + t.x), (this.y = e.y + t.y), (this.z = e.z + t.z), this
    );
  }
  addScaledVector(e, t) {
    return (this.x += e.x * t), (this.y += e.y * t), (this.z += e.z * t), this;
  }
  sub(e, t) {
    return void 0 !== t
      ? (console.warn(
          "THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."
        ),
        this.subVectors(e, t))
      : ((this.x -= e.x), (this.y -= e.y), (this.z -= e.z), this);
  }
  subScalar(e) {
    return (this.x -= e), (this.y -= e), (this.z -= e), this;
  }
  subVectors(e, t) {
    return (
      (this.x = e.x - t.x), (this.y = e.y - t.y), (this.z = e.z - t.z), this
    );
  }
  multiply(e, t) {
    return void 0 !== t
      ? (console.warn(
          "THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead."
        ),
        this.multiplyVectors(e, t))
      : ((this.x *= e.x), (this.y *= e.y), (this.z *= e.z), this);
  }
  multiplyScalar(e) {
    return (this.x *= e), (this.y *= e), (this.z *= e), this;
  }
  multiplyVectors(e, t) {
    return (
      (this.x = e.x * t.x), (this.y = e.y * t.y), (this.z = e.z * t.z), this
    );
  }
  applyEuler(e) {
    return (
      (e && e.isEuler) ||
        console.error(
          "THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order."
        ),
      this.applyQuaternion(_quaternion.setFromEuler(e))
    );
  }
  applyAxisAngle(e, t) {
    return this.applyQuaternion(_quaternion.setFromAxisAngle(e, t));
  }
  applyMatrix3(e) {
    const t = this.x,
      n = this.y,
      r = this.z,
      i = e.elements;
    return (
      (this.x = i[0] * t + i[3] * n + i[6] * r),
      (this.y = i[1] * t + i[4] * n + i[7] * r),
      (this.z = i[2] * t + i[5] * n + i[8] * r),
      this
    );
  }
  applyNormalMatrix(e) {
    return this.applyMatrix3(e).normalize();
  }
  applyMatrix4(e) {
    const t = this.x,
      n = this.y,
      r = this.z,
      i = e.elements,
      o = 1 / (i[3] * t + i[7] * n + i[11] * r + i[15]);
    return (
      (this.x = (i[0] * t + i[4] * n + i[8] * r + i[12]) * o),
      (this.y = (i[1] * t + i[5] * n + i[9] * r + i[13]) * o),
      (this.z = (i[2] * t + i[6] * n + i[10] * r + i[14]) * o),
      this
    );
  }
  applyQuaternion(e) {
    const t = this.x,
      n = this.y,
      r = this.z,
      i = e.x,
      o = e.y,
      a = e.z,
      s = e.w,
      c = s * t + o * r - a * n,
      l = s * n + a * t - i * r,
      h = s * r + i * n - o * t,
      u = -i * t - o * n - a * r;
    return (
      (this.x = c * s + u * -i + l * -a - h * -o),
      (this.y = l * s + u * -o + h * -i - c * -a),
      (this.z = h * s + u * -a + c * -o - l * -i),
      this
    );
  }
  project(e) {
    return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(
      e.projectionMatrix
    );
  }
  unproject(e) {
    return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(
      e.matrixWorld
    );
  }
  transformDirection(e) {
    const t = this.x,
      n = this.y,
      r = this.z,
      i = e.elements;
    return (
      (this.x = i[0] * t + i[4] * n + i[8] * r),
      (this.y = i[1] * t + i[5] * n + i[9] * r),
      (this.z = i[2] * t + i[6] * n + i[10] * r),
      this.normalize()
    );
  }
  divide(e) {
    return (this.x /= e.x), (this.y /= e.y), (this.z /= e.z), this;
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  min(e) {
    return (
      (this.x = Math.min(this.x, e.x)),
      (this.y = Math.min(this.y, e.y)),
      (this.z = Math.min(this.z, e.z)),
      this
    );
  }
  max(e) {
    return (
      (this.x = Math.max(this.x, e.x)),
      (this.y = Math.max(this.y, e.y)),
      (this.z = Math.max(this.z, e.z)),
      this
    );
  }
  clamp(e, t) {
    return (
      (this.x = Math.max(e.x, Math.min(t.x, this.x))),
      (this.y = Math.max(e.y, Math.min(t.y, this.y))),
      (this.z = Math.max(e.z, Math.min(t.z, this.z))),
      this
    );
  }
  clampScalar(e, t) {
    return (
      (this.x = Math.max(e, Math.min(t, this.x))),
      (this.y = Math.max(e, Math.min(t, this.y))),
      (this.z = Math.max(e, Math.min(t, this.z))),
      this
    );
  }
  clampLength(e, t) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(
      Math.max(e, Math.min(t, n))
    );
  }
  floor() {
    return (
      (this.x = Math.floor(this.x)),
      (this.y = Math.floor(this.y)),
      (this.z = Math.floor(this.z)),
      this
    );
  }
  ceil() {
    return (
      (this.x = Math.ceil(this.x)),
      (this.y = Math.ceil(this.y)),
      (this.z = Math.ceil(this.z)),
      this
    );
  }
  round() {
    return (
      (this.x = Math.round(this.x)),
      (this.y = Math.round(this.y)),
      (this.z = Math.round(this.z)),
      this
    );
  }
  roundToZero() {
    return (
      (this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x)),
      (this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y)),
      (this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z)),
      this
    );
  }
  negate() {
    return (this.x = -this.x), (this.y = -this.y), (this.z = -this.z), this;
  }
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, t) {
    return (
      (this.x += (e.x - this.x) * t),
      (this.y += (e.y - this.y) * t),
      (this.z += (e.z - this.z) * t),
      this
    );
  }
  lerpVectors(e, t, n) {
    return (
      (this.x = e.x + (t.x - e.x) * n),
      (this.y = e.y + (t.y - e.y) * n),
      (this.z = e.z + (t.z - e.z) * n),
      this
    );
  }
  cross(e, t) {
    return void 0 !== t
      ? (console.warn(
          "THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead."
        ),
        this.crossVectors(e, t))
      : this.crossVectors(this, e);
  }
  crossVectors(e, t) {
    const n = e.x,
      r = e.y,
      i = e.z,
      o = t.x,
      a = t.y,
      s = t.z;
    return (
      (this.x = r * s - i * a),
      (this.y = i * o - n * s),
      (this.z = n * a - r * o),
      this
    );
  }
  projectOnVector(e) {
    const t = e.lengthSq();
    if (0 === t) return this.set(0, 0, 0);
    const n = e.dot(this) / t;
    return this.copy(e).multiplyScalar(n);
  }
  projectOnPlane(e) {
    return _vector.copy(this).projectOnVector(e), this.sub(_vector);
  }
  reflect(e) {
    return this.sub(_vector.copy(e).multiplyScalar(2 * this.dot(e)));
  }
  angleTo(e) {
    const t = Math.sqrt(this.lengthSq() * e.lengthSq());
    if (0 === t) return Math.PI / 2;
    const n = this.dot(e) / t;
    return Math.acos(MathUtils.clamp(n, -1, 1));
  }
  distanceTo(e) {
    return Math.sqrt(this.distanceToSquared(e));
  }
  distanceToSquared(e) {
    const t = this.x - e.x,
      n = this.y - e.y,
      r = this.z - e.z;
    return t * t + n * n + r * r;
  }
  manhattanDistanceTo(e) {
    return (
      Math.abs(this.x - e.x) + Math.abs(this.y - e.y) + Math.abs(this.z - e.z)
    );
  }
  setFromSpherical(e) {
    return this.setFromSphericalCoords(e.radius, e.phi, e.theta);
  }
  setFromSphericalCoords(e, t, n) {
    const r = Math.sin(t) * e;
    return (
      (this.x = r * Math.sin(n)),
      (this.y = Math.cos(t) * e),
      (this.z = r * Math.cos(n)),
      this
    );
  }
  setFromCylindrical(e) {
    return this.setFromCylindricalCoords(e.radius, e.theta, e.y);
  }
  setFromCylindricalCoords(e, t, n) {
    return (
      (this.x = e * Math.sin(t)), (this.y = n), (this.z = e * Math.cos(t)), this
    );
  }
  setFromMatrixPosition(e) {
    const t = e.elements;
    return (this.x = t[12]), (this.y = t[13]), (this.z = t[14]), this;
  }
  setFromMatrixScale(e) {
    const t = this.setFromMatrixColumn(e, 0).length(),
      n = this.setFromMatrixColumn(e, 1).length(),
      r = this.setFromMatrixColumn(e, 2).length();
    return (this.x = t), (this.y = n), (this.z = r), this;
  }
  setFromMatrixColumn(e, t) {
    return this.fromArray(e.elements, 4 * t);
  }
  setFromMatrix3Column(e, t) {
    return this.fromArray(e.elements, 3 * t);
  }
  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z;
  }
  fromArray(e, t) {
    return (
      void 0 === t && (t = 0),
      (this.x = e[t]),
      (this.y = e[t + 1]),
      (this.z = e[t + 2]),
      this
    );
  }
  toArray(e, t) {
    return (
      void 0 === e && (e = []),
      void 0 === t && (t = 0),
      (e[t] = this.x),
      (e[t + 1] = this.y),
      (e[t + 2] = this.z),
      e
    );
  }
  fromBufferAttribute(e, t, n) {
    return (
      void 0 !== n &&
        console.warn(
          "THREE.Vector3: offset has been removed from .fromBufferAttribute()."
        ),
      (this.x = e.getX(t)),
      (this.y = e.getY(t)),
      (this.z = e.getZ(t)),
      this
    );
  }
  random() {
    return (
      (this.x = Math.random()),
      (this.y = Math.random()),
      (this.z = Math.random()),
      this
    );
  }
}
const _vector = new Vector3(),
  _quaternion = new Quaternion();
class Box3 {
  constructor(e, t) {
    Object.defineProperty(this, "isBox3", { value: !0 }),
      (this.min = void 0 !== e ? e : new Vector3(1 / 0, 1 / 0, 1 / 0)),
      (this.max = void 0 !== t ? t : new Vector3(-1 / 0, -1 / 0, -1 / 0));
  }
  set(e, t) {
    return this.min.copy(e), this.max.copy(t), this;
  }
  setFromArray(e) {
    let t = 1 / 0,
      n = 1 / 0,
      r = 1 / 0,
      i = -1 / 0,
      o = -1 / 0,
      a = -1 / 0;
    for (let s = 0, c = e.length; s < c; s += 3) {
      const c = e[s],
        l = e[s + 1],
        h = e[s + 2];
      c < t && (t = c),
        l < n && (n = l),
        h < r && (r = h),
        c > i && (i = c),
        l > o && (o = l),
        h > a && (a = h);
    }
    return this.min.set(t, n, r), this.max.set(i, o, a), this;
  }
  setFromBufferAttribute(e) {
    let t = 1 / 0,
      n = 1 / 0,
      r = 1 / 0,
      i = -1 / 0,
      o = -1 / 0,
      a = -1 / 0;
    for (let s = 0, c = e.count; s < c; s++) {
      const c = e.getX(s),
        l = e.getY(s),
        h = e.getZ(s);
      c < t && (t = c),
        l < n && (n = l),
        h < r && (r = h),
        c > i && (i = c),
        l > o && (o = l),
        h > a && (a = h);
    }
    return this.min.set(t, n, r), this.max.set(i, o, a), this;
  }
  setFromPoints(e) {
    this.makeEmpty();
    for (let t = 0, n = e.length; t < n; t++) this.expandByPoint(e[t]);
    return this;
  }
  setFromCenterAndSize(e, t) {
    const n = _vector$1.copy(t).multiplyScalar(0.5);
    return this.min.copy(e).sub(n), this.max.copy(e).add(n), this;
  }
  setFromObject(e) {
    return this.makeEmpty(), this.expandByObject(e);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.min.copy(e.min), this.max.copy(e.max), this;
  }
  makeEmpty() {
    return (
      (this.min.x = this.min.y = this.min.z = 1 / 0),
      (this.max.x = this.max.y = this.max.z = -1 / 0),
      this
    );
  }
  isEmpty() {
    return (
      this.max.x < this.min.x ||
      this.max.y < this.min.y ||
      this.max.z < this.min.z
    );
  }
  getCenter(e) {
    return (
      void 0 === e &&
        (console.warn("THREE.Box3: .getCenter() target is now required"),
        (e = new Vector3())),
      this.isEmpty()
        ? e.set(0, 0, 0)
        : e.addVectors(this.min, this.max).multiplyScalar(0.5)
    );
  }
  getSize(e) {
    return (
      void 0 === e &&
        (console.warn("THREE.Box3: .getSize() target is now required"),
        (e = new Vector3())),
      this.isEmpty() ? e.set(0, 0, 0) : e.subVectors(this.max, this.min)
    );
  }
  expandByPoint(e) {
    return this.min.min(e), this.max.max(e), this;
  }
  expandByVector(e) {
    return this.min.sub(e), this.max.add(e), this;
  }
  expandByScalar(e) {
    return this.min.addScalar(-e), this.max.addScalar(e), this;
  }
  expandByObject(e) {
    e.updateWorldMatrix(!1, !1);
    const t = e.geometry;
    void 0 !== t &&
      (null === t.boundingBox && t.computeBoundingBox(),
      _box.copy(t.boundingBox),
      _box.applyMatrix4(e.matrixWorld),
      this.union(_box));
    const n = e.children;
    for (let e = 0, t = n.length; e < t; e++) this.expandByObject(n[e]);
    return this;
  }
  containsPoint(e) {
    return !(
      e.x < this.min.x ||
      e.x > this.max.x ||
      e.y < this.min.y ||
      e.y > this.max.y ||
      e.z < this.min.z ||
      e.z > this.max.z
    );
  }
  containsBox(e) {
    return (
      this.min.x <= e.min.x &&
      e.max.x <= this.max.x &&
      this.min.y <= e.min.y &&
      e.max.y <= this.max.y &&
      this.min.z <= e.min.z &&
      e.max.z <= this.max.z
    );
  }
  getParameter(e, t) {
    return (
      void 0 === t &&
        (console.warn("THREE.Box3: .getParameter() target is now required"),
        (t = new Vector3())),
      t.set(
        (e.x - this.min.x) / (this.max.x - this.min.x),
        (e.y - this.min.y) / (this.max.y - this.min.y),
        (e.z - this.min.z) / (this.max.z - this.min.z)
      )
    );
  }
  intersectsBox(e) {
    return !(
      e.max.x < this.min.x ||
      e.min.x > this.max.x ||
      e.max.y < this.min.y ||
      e.min.y > this.max.y ||
      e.max.z < this.min.z ||
      e.min.z > this.max.z
    );
  }
  intersectsSphere(e) {
    return (
      this.clampPoint(e.center, _vector$1),
      _vector$1.distanceToSquared(e.center) <= e.radius * e.radius
    );
  }
  intersectsPlane(e) {
    let t, n;
    return (
      e.normal.x > 0
        ? ((t = e.normal.x * this.min.x), (n = e.normal.x * this.max.x))
        : ((t = e.normal.x * this.max.x), (n = e.normal.x * this.min.x)),
      e.normal.y > 0
        ? ((t += e.normal.y * this.min.y), (n += e.normal.y * this.max.y))
        : ((t += e.normal.y * this.max.y), (n += e.normal.y * this.min.y)),
      e.normal.z > 0
        ? ((t += e.normal.z * this.min.z), (n += e.normal.z * this.max.z))
        : ((t += e.normal.z * this.max.z), (n += e.normal.z * this.min.z)),
      t <= -e.constant && n >= -e.constant
    );
  }
  intersectsTriangle(e) {
    if (this.isEmpty()) return !1;
    this.getCenter(_center),
      _extents.subVectors(this.max, _center),
      _v0.subVectors(e.a, _center),
      _v1.subVectors(e.b, _center),
      _v2.subVectors(e.c, _center),
      _f0.subVectors(_v1, _v0),
      _f1.subVectors(_v2, _v1),
      _f2.subVectors(_v0, _v2);
    let t = [
      0,
      -_f0.z,
      _f0.y,
      0,
      -_f1.z,
      _f1.y,
      0,
      -_f2.z,
      _f2.y,
      _f0.z,
      0,
      -_f0.x,
      _f1.z,
      0,
      -_f1.x,
      _f2.z,
      0,
      -_f2.x,
      -_f0.y,
      _f0.x,
      0,
      -_f1.y,
      _f1.x,
      0,
      -_f2.y,
      _f2.x,
      0
    ];
    return (
      !!satForAxes(t, _v0, _v1, _v2, _extents) &&
      !!satForAxes(
        (t = [1, 0, 0, 0, 1, 0, 0, 0, 1]),
        _v0,
        _v1,
        _v2,
        _extents
      ) &&
      (_triangleNormal.crossVectors(_f0, _f1),
      satForAxes(
        (t = [_triangleNormal.x, _triangleNormal.y, _triangleNormal.z]),
        _v0,
        _v1,
        _v2,
        _extents
      ))
    );
  }
  clampPoint(e, t) {
    return (
      void 0 === t &&
        (console.warn("THREE.Box3: .clampPoint() target is now required"),
        (t = new Vector3())),
      t.copy(e).clamp(this.min, this.max)
    );
  }
  distanceToPoint(e) {
    return _vector$1.copy(e).clamp(this.min, this.max).sub(e).length();
  }
  getBoundingSphere(e) {
    return (
      void 0 === e &&
        console.error(
          "THREE.Box3: .getBoundingSphere() target is now required"
        ),
      this.getCenter(e.center),
      (e.radius = 0.5 * this.getSize(_vector$1).length()),
      e
    );
  }
  intersect(e) {
    return (
      this.min.max(e.min),
      this.max.min(e.max),
      this.isEmpty() && this.makeEmpty(),
      this
    );
  }
  union(e) {
    return this.min.min(e.min), this.max.max(e.max), this;
  }
  applyMatrix4(e) {
    return this.isEmpty()
      ? this
      : (_points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e),
        _points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e),
        _points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e),
        _points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e),
        _points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e),
        _points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e),
        _points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e),
        _points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e),
        this.setFromPoints(_points),
        this);
  }
  translate(e) {
    return this.min.add(e), this.max.add(e), this;
  }
  equals(e) {
    return e.min.equals(this.min) && e.max.equals(this.max);
  }
}
function satForAxes(e, t, n, r, i) {
  for (let o = 0, a = e.length - 3; o <= a; o += 3) {
    _testAxis.fromArray(e, o);
    const a =
        i.x * Math.abs(_testAxis.x) +
        i.y * Math.abs(_testAxis.y) +
        i.z * Math.abs(_testAxis.z),
      s = t.dot(_testAxis),
      c = n.dot(_testAxis),
      l = r.dot(_testAxis);
    if (Math.max(-Math.max(s, c, l), Math.min(s, c, l)) > a) return !1;
  }
  return !0;
}
const _points = [
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3()
  ],
  _vector$1 = new Vector3(),
  _box = new Box3(),
  _v0 = new Vector3(),
  _v1 = new Vector3(),
  _v2 = new Vector3(),
  _f0 = new Vector3(),
  _f1 = new Vector3(),
  _f2 = new Vector3(),
  _center = new Vector3(),
  _extents = new Vector3(),
  _triangleNormal = new Vector3(),
  _testAxis = new Vector3(),
  _box$1 = new Box3();
class Sphere {
  constructor(e, t) {
    (this.center = void 0 !== e ? e : new Vector3()),
      (this.radius = void 0 !== t ? t : -1);
  }
  set(e, t) {
    return this.center.copy(e), (this.radius = t), this;
  }
  setFromPoints(e, t) {
    const n = this.center;
    void 0 !== t ? n.copy(t) : _box$1.setFromPoints(e).getCenter(n);
    let r = 0;
    for (let t = 0, i = e.length; t < i; t++)
      r = Math.max(r, n.distanceToSquared(e[t]));
    return (this.radius = Math.sqrt(r)), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.center.copy(e.center), (this.radius = e.radius), this;
  }
  isEmpty() {
    return this.radius < 0;
  }
  makeEmpty() {
    return this.center.set(0, 0, 0), (this.radius = -1), this;
  }
  containsPoint(e) {
    return e.distanceToSquared(this.center) <= this.radius * this.radius;
  }
  distanceToPoint(e) {
    return e.distanceTo(this.center) - this.radius;
  }
  intersectsSphere(e) {
    const t = this.radius + e.radius;
    return e.center.distanceToSquared(this.center) <= t * t;
  }
  intersectsBox(e) {
    return e.intersectsSphere(this);
  }
  intersectsPlane(e) {
    return Math.abs(e.distanceToPoint(this.center)) <= this.radius;
  }
  clampPoint(e, t) {
    const n = this.center.distanceToSquared(e);
    return (
      void 0 === t &&
        (console.warn("THREE.Sphere: .clampPoint() target is now required"),
        (t = new Vector3())),
      t.copy(e),
      n > this.radius * this.radius &&
        (t.sub(this.center).normalize(),
        t.multiplyScalar(this.radius).add(this.center)),
      t
    );
  }
  getBoundingBox(e) {
    return (
      void 0 === e &&
        (console.warn("THREE.Sphere: .getBoundingBox() target is now required"),
        (e = new Box3())),
      this.isEmpty()
        ? (e.makeEmpty(), e)
        : (e.set(this.center, this.center), e.expandByScalar(this.radius), e)
    );
  }
  applyMatrix4(e) {
    return (
      this.center.applyMatrix4(e),
      (this.radius = this.radius * e.getMaxScaleOnAxis()),
      this
    );
  }
  translate(e) {
    return this.center.add(e), this;
  }
  equals(e) {
    return e.center.equals(this.center) && e.radius === this.radius;
  }
}
const _vector$2 = new Vector3(),
  _segCenter = new Vector3(),
  _segDir = new Vector3(),
  _diff = new Vector3(),
  _edge1 = new Vector3(),
  _edge2 = new Vector3(),
  _normal = new Vector3();
class Ray {
  constructor(e, t) {
    (this.origin = void 0 !== e ? e : new Vector3()),
      (this.direction = void 0 !== t ? t : new Vector3(0, 0, -1));
  }
  set(e, t) {
    return this.origin.copy(e), this.direction.copy(t), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.origin.copy(e.origin), this.direction.copy(e.direction), this;
  }
  at(e, t) {
    return (
      void 0 === t &&
        (console.warn("THREE.Ray: .at() target is now required"),
        (t = new Vector3())),
      t.copy(this.direction).multiplyScalar(e).add(this.origin)
    );
  }
  lookAt(e) {
    return this.direction.copy(e).sub(this.origin).normalize(), this;
  }
  recast(e) {
    return this.origin.copy(this.at(e, _vector$2)), this;
  }
  closestPointToPoint(e, t) {
    void 0 === t &&
      (console.warn("THREE.Ray: .closestPointToPoint() target is now required"),
      (t = new Vector3())),
      t.subVectors(e, this.origin);
    const n = t.dot(this.direction);
    return n < 0
      ? t.copy(this.origin)
      : t.copy(this.direction).multiplyScalar(n).add(this.origin);
  }
  distanceToPoint(e) {
    return Math.sqrt(this.distanceSqToPoint(e));
  }
  distanceSqToPoint(e) {
    const t = _vector$2.subVectors(e, this.origin).dot(this.direction);
    return t < 0
      ? this.origin.distanceToSquared(e)
      : (_vector$2.copy(this.direction).multiplyScalar(t).add(this.origin),
        _vector$2.distanceToSquared(e));
  }
  distanceSqToSegment(e, t, n, r) {
    _segCenter.copy(e).add(t).multiplyScalar(0.5),
      _segDir.copy(t).sub(e).normalize(),
      _diff.copy(this.origin).sub(_segCenter);
    const i = 0.5 * e.distanceTo(t),
      o = -this.direction.dot(_segDir),
      a = _diff.dot(this.direction),
      s = -_diff.dot(_segDir),
      c = _diff.lengthSq(),
      l = Math.abs(1 - o * o);
    let h, u, d, p;
    if (l > 0)
      if (((u = o * a - s), (p = i * l), (h = o * s - a) >= 0))
        if (u >= -p)
          if (u <= p) {
            const e = 1 / l;
            d =
              (h *= e) * (h + o * (u *= e) + 2 * a) +
              u * (o * h + u + 2 * s) +
              c;
          } else
            (u = i),
              (d = -(h = Math.max(0, -(o * u + a))) * h + u * (u + 2 * s) + c);
        else
          (u = -i),
            (d = -(h = Math.max(0, -(o * u + a))) * h + u * (u + 2 * s) + c);
      else
        u <= -p
          ? (d =
              -(h = Math.max(0, -(-o * i + a))) * h +
              (u = h > 0 ? -i : Math.min(Math.max(-i, -s), i)) * (u + 2 * s) +
              c)
          : u <= p
          ? ((h = 0),
            (d = (u = Math.min(Math.max(-i, -s), i)) * (u + 2 * s) + c))
          : (d =
              -(h = Math.max(0, -(o * i + a))) * h +
              (u = h > 0 ? i : Math.min(Math.max(-i, -s), i)) * (u + 2 * s) +
              c);
    else
      (u = o > 0 ? -i : i),
        (d = -(h = Math.max(0, -(o * u + a))) * h + u * (u + 2 * s) + c);
    return (
      n && n.copy(this.direction).multiplyScalar(h).add(this.origin),
      r && r.copy(_segDir).multiplyScalar(u).add(_segCenter),
      d
    );
  }
  intersectSphere(e, t) {
    _vector$2.subVectors(e.center, this.origin);
    const n = _vector$2.dot(this.direction),
      r = _vector$2.dot(_vector$2) - n * n,
      i = e.radius * e.radius;
    if (r > i) return null;
    const o = Math.sqrt(i - r),
      a = n - o,
      s = n + o;
    return a < 0 && s < 0 ? null : a < 0 ? this.at(s, t) : this.at(a, t);
  }
  intersectsSphere(e) {
    return this.distanceSqToPoint(e.center) <= e.radius * e.radius;
  }
  distanceToPlane(e) {
    const t = e.normal.dot(this.direction);
    if (0 === t) return 0 === e.distanceToPoint(this.origin) ? 0 : null;
    const n = -(this.origin.dot(e.normal) + e.constant) / t;
    return n >= 0 ? n : null;
  }
  intersectPlane(e, t) {
    const n = this.distanceToPlane(e);
    return null === n ? null : this.at(n, t);
  }
  intersectsPlane(e) {
    const t = e.distanceToPoint(this.origin);
    return 0 === t || e.normal.dot(this.direction) * t < 0;
  }
  intersectBox(e, t) {
    let n, r, i, o, a, s;
    const c = 1 / this.direction.x,
      l = 1 / this.direction.y,
      h = 1 / this.direction.z,
      u = this.origin;
    return (
      c >= 0
        ? ((n = (e.min.x - u.x) * c), (r = (e.max.x - u.x) * c))
        : ((n = (e.max.x - u.x) * c), (r = (e.min.x - u.x) * c)),
      l >= 0
        ? ((i = (e.min.y - u.y) * l), (o = (e.max.y - u.y) * l))
        : ((i = (e.max.y - u.y) * l), (o = (e.min.y - u.y) * l)),
      n > o || i > r
        ? null
        : ((i > n || n != n) && (n = i),
          (o < r || r != r) && (r = o),
          h >= 0
            ? ((a = (e.min.z - u.z) * h), (s = (e.max.z - u.z) * h))
            : ((a = (e.max.z - u.z) * h), (s = (e.min.z - u.z) * h)),
          n > s || a > r
            ? null
            : ((a > n || n != n) && (n = a),
              (s < r || r != r) && (r = s),
              r < 0 ? null : this.at(n >= 0 ? n : r, t)))
    );
  }
  intersectsBox(e) {
    return null !== this.intersectBox(e, _vector$2);
  }
  intersectTriangle(e, t, n, r, i) {
    _edge1.subVectors(t, e),
      _edge2.subVectors(n, e),
      _normal.crossVectors(_edge1, _edge2);
    let o,
      a = this.direction.dot(_normal);
    if (a > 0) {
      if (r) return null;
      o = 1;
    } else {
      if (!(a < 0)) return null;
      (o = -1), (a = -a);
    }
    _diff.subVectors(this.origin, e);
    const s = o * this.direction.dot(_edge2.crossVectors(_diff, _edge2));
    if (s < 0) return null;
    const c = o * this.direction.dot(_edge1.cross(_diff));
    if (c < 0) return null;
    if (s + c > a) return null;
    const l = -o * _diff.dot(_normal);
    return l < 0 ? null : this.at(l / a, i);
  }
  applyMatrix4(e) {
    return (
      this.origin.applyMatrix4(e), this.direction.transformDirection(e), this
    );
  }
  equals(e) {
    return e.origin.equals(this.origin) && e.direction.equals(this.direction);
  }
}
class Matrix4 {
  constructor() {
    Object.defineProperty(this, "isMatrix4", { value: !0 }),
      (this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
      arguments.length > 0 &&
        console.error(
          "THREE.Matrix4: the constructor no longer reads arguments. use .set() instead."
        );
  }
  set(e, t, n, r, i, o, a, s, c, l, h, u, d, p, m, f) {
    const g = this.elements;
    return (
      (g[0] = e),
      (g[4] = t),
      (g[8] = n),
      (g[12] = r),
      (g[1] = i),
      (g[5] = o),
      (g[9] = a),
      (g[13] = s),
      (g[2] = c),
      (g[6] = l),
      (g[10] = h),
      (g[14] = u),
      (g[3] = d),
      (g[7] = p),
      (g[11] = m),
      (g[15] = f),
      this
    );
  }
  identity() {
    return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
  }
  clone() {
    return new Matrix4().fromArray(this.elements);
  }
  copy(e) {
    const t = this.elements,
      n = e.elements;
    return (
      (t[0] = n[0]),
      (t[1] = n[1]),
      (t[2] = n[2]),
      (t[3] = n[3]),
      (t[4] = n[4]),
      (t[5] = n[5]),
      (t[6] = n[6]),
      (t[7] = n[7]),
      (t[8] = n[8]),
      (t[9] = n[9]),
      (t[10] = n[10]),
      (t[11] = n[11]),
      (t[12] = n[12]),
      (t[13] = n[13]),
      (t[14] = n[14]),
      (t[15] = n[15]),
      this
    );
  }
  copyPosition(e) {
    const t = this.elements,
      n = e.elements;
    return (t[12] = n[12]), (t[13] = n[13]), (t[14] = n[14]), this;
  }
  extractBasis(e, t, n) {
    return (
      e.setFromMatrixColumn(this, 0),
      t.setFromMatrixColumn(this, 1),
      n.setFromMatrixColumn(this, 2),
      this
    );
  }
  makeBasis(e, t, n) {
    return (
      this.set(
        e.x,
        t.x,
        n.x,
        0,
        e.y,
        t.y,
        n.y,
        0,
        e.z,
        t.z,
        n.z,
        0,
        0,
        0,
        0,
        1
      ),
      this
    );
  }
  extractRotation(e) {
    const t = this.elements,
      n = e.elements,
      r = 1 / _v1$1.setFromMatrixColumn(e, 0).length(),
      i = 1 / _v1$1.setFromMatrixColumn(e, 1).length(),
      o = 1 / _v1$1.setFromMatrixColumn(e, 2).length();
    return (
      (t[0] = n[0] * r),
      (t[1] = n[1] * r),
      (t[2] = n[2] * r),
      (t[3] = 0),
      (t[4] = n[4] * i),
      (t[5] = n[5] * i),
      (t[6] = n[6] * i),
      (t[7] = 0),
      (t[8] = n[8] * o),
      (t[9] = n[9] * o),
      (t[10] = n[10] * o),
      (t[11] = 0),
      (t[12] = 0),
      (t[13] = 0),
      (t[14] = 0),
      (t[15] = 1),
      this
    );
  }
  makeRotationFromEuler(e) {
    (e && e.isEuler) ||
      console.error(
        "THREE.Matrix4: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order."
      );
    const t = this.elements,
      n = e.x,
      r = e.y,
      i = e.z,
      o = Math.cos(n),
      a = Math.sin(n),
      s = Math.cos(r),
      c = Math.sin(r),
      l = Math.cos(i),
      h = Math.sin(i);
    if ("XYZ" === e.order) {
      const e = o * l,
        n = o * h,
        r = a * l,
        i = a * h;
      (t[0] = s * l),
        (t[4] = -s * h),
        (t[8] = c),
        (t[1] = n + r * c),
        (t[5] = e - i * c),
        (t[9] = -a * s),
        (t[2] = i - e * c),
        (t[6] = r + n * c),
        (t[10] = o * s);
    } else if ("YXZ" === e.order) {
      const e = s * l,
        n = s * h,
        r = c * l,
        i = c * h;
      (t[0] = e + i * a),
        (t[4] = r * a - n),
        (t[8] = o * c),
        (t[1] = o * h),
        (t[5] = o * l),
        (t[9] = -a),
        (t[2] = n * a - r),
        (t[6] = i + e * a),
        (t[10] = o * s);
    } else if ("ZXY" === e.order) {
      const e = s * l,
        n = s * h,
        r = c * l,
        i = c * h;
      (t[0] = e - i * a),
        (t[4] = -o * h),
        (t[8] = r + n * a),
        (t[1] = n + r * a),
        (t[5] = o * l),
        (t[9] = i - e * a),
        (t[2] = -o * c),
        (t[6] = a),
        (t[10] = o * s);
    } else if ("ZYX" === e.order) {
      const e = o * l,
        n = o * h,
        r = a * l,
        i = a * h;
      (t[0] = s * l),
        (t[4] = r * c - n),
        (t[8] = e * c + i),
        (t[1] = s * h),
        (t[5] = i * c + e),
        (t[9] = n * c - r),
        (t[2] = -c),
        (t[6] = a * s),
        (t[10] = o * s);
    } else if ("YZX" === e.order) {
      const e = o * s,
        n = o * c,
        r = a * s,
        i = a * c;
      (t[0] = s * l),
        (t[4] = i - e * h),
        (t[8] = r * h + n),
        (t[1] = h),
        (t[5] = o * l),
        (t[9] = -a * l),
        (t[2] = -c * l),
        (t[6] = n * h + r),
        (t[10] = e - i * h);
    } else if ("XZY" === e.order) {
      const e = o * s,
        n = o * c,
        r = a * s,
        i = a * c;
      (t[0] = s * l),
        (t[4] = -h),
        (t[8] = c * l),
        (t[1] = e * h + i),
        (t[5] = o * l),
        (t[9] = n * h - r),
        (t[2] = r * h - n),
        (t[6] = a * l),
        (t[10] = i * h + e);
    }
    return (
      (t[3] = 0),
      (t[7] = 0),
      (t[11] = 0),
      (t[12] = 0),
      (t[13] = 0),
      (t[14] = 0),
      (t[15] = 1),
      this
    );
  }
  makeRotationFromQuaternion(e) {
    return this.compose(_zero, e, _one);
  }
  lookAt(e, t, n) {
    const r = this.elements;
    return (
      _z.subVectors(e, t),
      0 === _z.lengthSq() && (_z.z = 1),
      _z.normalize(),
      _x.crossVectors(n, _z),
      0 === _x.lengthSq() &&
        (1 === Math.abs(n.z) ? (_z.x += 1e-4) : (_z.z += 1e-4),
        _z.normalize(),
        _x.crossVectors(n, _z)),
      _x.normalize(),
      _y.crossVectors(_z, _x),
      (r[0] = _x.x),
      (r[4] = _y.x),
      (r[8] = _z.x),
      (r[1] = _x.y),
      (r[5] = _y.y),
      (r[9] = _z.y),
      (r[2] = _x.z),
      (r[6] = _y.z),
      (r[10] = _z.z),
      this
    );
  }
  multiply(e, t) {
    return void 0 !== t
      ? (console.warn(
          "THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead."
        ),
        this.multiplyMatrices(e, t))
      : this.multiplyMatrices(this, e);
  }
  premultiply(e) {
    return this.multiplyMatrices(e, this);
  }
  multiplyMatrices(e, t) {
    const n = e.elements,
      r = t.elements,
      i = this.elements,
      o = n[0],
      a = n[4],
      s = n[8],
      c = n[12],
      l = n[1],
      h = n[5],
      u = n[9],
      d = n[13],
      p = n[2],
      m = n[6],
      f = n[10],
      g = n[14],
      v = n[3],
      y = n[7],
      _ = n[11],
      x = n[15],
      b = r[0],
      M = r[4],
      w = r[8],
      S = r[12],
      T = r[1],
      E = r[5],
      A = r[9],
      L = r[13],
      C = r[2],
      R = r[6],
      P = r[10],
      B = r[14],
      D = r[3],
      G = r[7],
      I = r[11],
      N = r[15];
    return (
      (i[0] = o * b + a * T + s * C + c * D),
      (i[4] = o * M + a * E + s * R + c * G),
      (i[8] = o * w + a * A + s * P + c * I),
      (i[12] = o * S + a * L + s * B + c * N),
      (i[1] = l * b + h * T + u * C + d * D),
      (i[5] = l * M + h * E + u * R + d * G),
      (i[9] = l * w + h * A + u * P + d * I),
      (i[13] = l * S + h * L + u * B + d * N),
      (i[2] = p * b + m * T + f * C + g * D),
      (i[6] = p * M + m * E + f * R + g * G),
      (i[10] = p * w + m * A + f * P + g * I),
      (i[14] = p * S + m * L + f * B + g * N),
      (i[3] = v * b + y * T + _ * C + x * D),
      (i[7] = v * M + y * E + _ * R + x * G),
      (i[11] = v * w + y * A + _ * P + x * I),
      (i[15] = v * S + y * L + _ * B + x * N),
      this
    );
  }
  multiplyScalar(e) {
    const t = this.elements;
    return (
      (t[0] *= e),
      (t[4] *= e),
      (t[8] *= e),
      (t[12] *= e),
      (t[1] *= e),
      (t[5] *= e),
      (t[9] *= e),
      (t[13] *= e),
      (t[2] *= e),
      (t[6] *= e),
      (t[10] *= e),
      (t[14] *= e),
      (t[3] *= e),
      (t[7] *= e),
      (t[11] *= e),
      (t[15] *= e),
      this
    );
  }
  determinant() {
    const e = this.elements,
      t = e[0],
      n = e[4],
      r = e[8],
      i = e[12],
      o = e[1],
      a = e[5],
      s = e[9],
      c = e[13],
      l = e[2],
      h = e[6],
      u = e[10],
      d = e[14];
    return (
      e[3] *
        (+i * s * h -
          r * c * h -
          i * a * u +
          n * c * u +
          r * a * d -
          n * s * d) +
      e[7] *
        (+t * s * d -
          t * c * u +
          i * o * u -
          r * o * d +
          r * c * l -
          i * s * l) +
      e[11] *
        (+t * c * h -
          t * a * d -
          i * o * h +
          n * o * d +
          i * a * l -
          n * c * l) +
      e[15] *
        (-r * a * l - t * s * h + t * a * u + r * o * h - n * o * u + n * s * l)
    );
  }
  transpose() {
    const e = this.elements;
    let t;
    return (
      (t = e[1]),
      (e[1] = e[4]),
      (e[4] = t),
      (t = e[2]),
      (e[2] = e[8]),
      (e[8] = t),
      (t = e[6]),
      (e[6] = e[9]),
      (e[9] = t),
      (t = e[3]),
      (e[3] = e[12]),
      (e[12] = t),
      (t = e[7]),
      (e[7] = e[13]),
      (e[13] = t),
      (t = e[11]),
      (e[11] = e[14]),
      (e[14] = t),
      this
    );
  }
  setPosition(e, t, n) {
    const r = this.elements;
    return (
      e.isVector3
        ? ((r[12] = e.x), (r[13] = e.y), (r[14] = e.z))
        : ((r[12] = e), (r[13] = t), (r[14] = n)),
      this
    );
  }
  getInverse(e, t) {
    void 0 !== t &&
      console.warn(
        "THREE.Matrix4: .getInverse() can no longer be configured to throw on degenerate."
      );
    const n = this.elements,
      r = e.elements,
      i = r[0],
      o = r[1],
      a = r[2],
      s = r[3],
      c = r[4],
      l = r[5],
      h = r[6],
      u = r[7],
      d = r[8],
      p = r[9],
      m = r[10],
      f = r[11],
      g = r[12],
      v = r[13],
      y = r[14],
      _ = r[15],
      x = p * y * u - v * m * u + v * h * f - l * y * f - p * h * _ + l * m * _,
      b = g * m * u - d * y * u - g * h * f + c * y * f + d * h * _ - c * m * _,
      M = d * v * u - g * p * u + g * l * f - c * v * f - d * l * _ + c * p * _,
      w = g * p * h - d * v * h - g * l * m + c * v * m + d * l * y - c * p * y,
      S = i * x + o * b + a * M + s * w;
    if (0 === S)
      return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const T = 1 / S;
    return (
      (n[0] = x * T),
      (n[1] =
        (v * m * s -
          p * y * s -
          v * a * f +
          o * y * f +
          p * a * _ -
          o * m * _) *
        T),
      (n[2] =
        (l * y * s -
          v * h * s +
          v * a * u -
          o * y * u -
          l * a * _ +
          o * h * _) *
        T),
      (n[3] =
        (p * h * s -
          l * m * s -
          p * a * u +
          o * m * u +
          l * a * f -
          o * h * f) *
        T),
      (n[4] = b * T),
      (n[5] =
        (d * y * s -
          g * m * s +
          g * a * f -
          i * y * f -
          d * a * _ +
          i * m * _) *
        T),
      (n[6] =
        (g * h * s -
          c * y * s -
          g * a * u +
          i * y * u +
          c * a * _ -
          i * h * _) *
        T),
      (n[7] =
        (c * m * s -
          d * h * s +
          d * a * u -
          i * m * u -
          c * a * f +
          i * h * f) *
        T),
      (n[8] = M * T),
      (n[9] =
        (g * p * s -
          d * v * s -
          g * o * f +
          i * v * f +
          d * o * _ -
          i * p * _) *
        T),
      (n[10] =
        (c * v * s -
          g * l * s +
          g * o * u -
          i * v * u -
          c * o * _ +
          i * l * _) *
        T),
      (n[11] =
        (d * l * s -
          c * p * s -
          d * o * u +
          i * p * u +
          c * o * f -
          i * l * f) *
        T),
      (n[12] = w * T),
      (n[13] =
        (d * v * a -
          g * p * a +
          g * o * m -
          i * v * m -
          d * o * y +
          i * p * y) *
        T),
      (n[14] =
        (g * l * a -
          c * v * a -
          g * o * h +
          i * v * h +
          c * o * y -
          i * l * y) *
        T),
      (n[15] =
        (c * p * a -
          d * l * a +
          d * o * h -
          i * p * h -
          c * o * m +
          i * l * m) *
        T),
      this
    );
  }
  scale(e) {
    const t = this.elements,
      n = e.x,
      r = e.y,
      i = e.z;
    return (
      (t[0] *= n),
      (t[4] *= r),
      (t[8] *= i),
      (t[1] *= n),
      (t[5] *= r),
      (t[9] *= i),
      (t[2] *= n),
      (t[6] *= r),
      (t[10] *= i),
      (t[3] *= n),
      (t[7] *= r),
      (t[11] *= i),
      this
    );
  }
  getMaxScaleOnAxis() {
    const e = this.elements,
      t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2],
      n = e[4] * e[4] + e[5] * e[5] + e[6] * e[6],
      r = e[8] * e[8] + e[9] * e[9] + e[10] * e[10];
    return Math.sqrt(Math.max(t, n, r));
  }
  makeTranslation(e, t, n) {
    return this.set(1, 0, 0, e, 0, 1, 0, t, 0, 0, 1, n, 0, 0, 0, 1), this;
  }
  makeRotationX(e) {
    const t = Math.cos(e),
      n = Math.sin(e);
    return this.set(1, 0, 0, 0, 0, t, -n, 0, 0, n, t, 0, 0, 0, 0, 1), this;
  }
  makeRotationY(e) {
    const t = Math.cos(e),
      n = Math.sin(e);
    return this.set(t, 0, n, 0, 0, 1, 0, 0, -n, 0, t, 0, 0, 0, 0, 1), this;
  }
  makeRotationZ(e) {
    const t = Math.cos(e),
      n = Math.sin(e);
    return this.set(t, -n, 0, 0, n, t, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
  }
  makeRotationAxis(e, t) {
    const n = Math.cos(t),
      r = Math.sin(t),
      i = 1 - n,
      o = e.x,
      a = e.y,
      s = e.z,
      c = i * o,
      l = i * a;
    return (
      this.set(
        c * o + n,
        c * a - r * s,
        c * s + r * a,
        0,
        c * a + r * s,
        l * a + n,
        l * s - r * o,
        0,
        c * s - r * a,
        l * s + r * o,
        i * s * s + n,
        0,
        0,
        0,
        0,
        1
      ),
      this
    );
  }
  makeScale(e, t, n) {
    return this.set(e, 0, 0, 0, 0, t, 0, 0, 0, 0, n, 0, 0, 0, 0, 1), this;
  }
  makeShear(e, t, n) {
    return this.set(1, t, n, 0, e, 1, n, 0, e, t, 1, 0, 0, 0, 0, 1), this;
  }
  compose(e, t, n) {
    const r = this.elements,
      i = t._x,
      o = t._y,
      a = t._z,
      s = t._w,
      c = i + i,
      l = o + o,
      h = a + a,
      u = i * c,
      d = i * l,
      p = i * h,
      m = o * l,
      f = o * h,
      g = a * h,
      v = s * c,
      y = s * l,
      _ = s * h,
      x = n.x,
      b = n.y,
      M = n.z;
    return (
      (r[0] = (1 - (m + g)) * x),
      (r[1] = (d + _) * x),
      (r[2] = (p - y) * x),
      (r[3] = 0),
      (r[4] = (d - _) * b),
      (r[5] = (1 - (u + g)) * b),
      (r[6] = (f + v) * b),
      (r[7] = 0),
      (r[8] = (p + y) * M),
      (r[9] = (f - v) * M),
      (r[10] = (1 - (u + m)) * M),
      (r[11] = 0),
      (r[12] = e.x),
      (r[13] = e.y),
      (r[14] = e.z),
      (r[15] = 1),
      this
    );
  }
  decompose(e, t, n) {
    const r = this.elements;
    let i = _v1$1.set(r[0], r[1], r[2]).length();
    const o = _v1$1.set(r[4], r[5], r[6]).length(),
      a = _v1$1.set(r[8], r[9], r[10]).length();
    this.determinant() < 0 && (i = -i),
      (e.x = r[12]),
      (e.y = r[13]),
      (e.z = r[14]),
      _m1.copy(this);
    const s = 1 / i,
      c = 1 / o,
      l = 1 / a;
    return (
      (_m1.elements[0] *= s),
      (_m1.elements[1] *= s),
      (_m1.elements[2] *= s),
      (_m1.elements[4] *= c),
      (_m1.elements[5] *= c),
      (_m1.elements[6] *= c),
      (_m1.elements[8] *= l),
      (_m1.elements[9] *= l),
      (_m1.elements[10] *= l),
      t.setFromRotationMatrix(_m1),
      (n.x = i),
      (n.y = o),
      (n.z = a),
      this
    );
  }
  makePerspective(e, t, n, r, i, o) {
    void 0 === o &&
      console.warn(
        "THREE.Matrix4: .makePerspective() has been redefined and has a new signature. Please check the docs."
      );
    const a = this.elements,
      s = (2 * i) / (t - e),
      c = (2 * i) / (n - r),
      l = (t + e) / (t - e),
      h = (n + r) / (n - r),
      u = -(o + i) / (o - i),
      d = (-2 * o * i) / (o - i);
    return (
      (a[0] = s),
      (a[4] = 0),
      (a[8] = l),
      (a[12] = 0),
      (a[1] = 0),
      (a[5] = c),
      (a[9] = h),
      (a[13] = 0),
      (a[2] = 0),
      (a[6] = 0),
      (a[10] = u),
      (a[14] = d),
      (a[3] = 0),
      (a[7] = 0),
      (a[11] = -1),
      (a[15] = 0),
      this
    );
  }
  makeOrthographic(e, t, n, r, i, o) {
    const a = this.elements,
      s = 1 / (t - e),
      c = 1 / (n - r),
      l = 1 / (o - i),
      h = (t + e) * s,
      u = (n + r) * c,
      d = (o + i) * l;
    return (
      (a[0] = 2 * s),
      (a[4] = 0),
      (a[8] = 0),
      (a[12] = -h),
      (a[1] = 0),
      (a[5] = 2 * c),
      (a[9] = 0),
      (a[13] = -u),
      (a[2] = 0),
      (a[6] = 0),
      (a[10] = -2 * l),
      (a[14] = -d),
      (a[3] = 0),
      (a[7] = 0),
      (a[11] = 0),
      (a[15] = 1),
      this
    );
  }
  equals(e) {
    const t = this.elements,
      n = e.elements;
    for (let e = 0; e < 16; e++) if (t[e] !== n[e]) return !1;
    return !0;
  }
  fromArray(e, t) {
    void 0 === t && (t = 0);
    for (let n = 0; n < 16; n++) this.elements[n] = e[n + t];
    return this;
  }
  toArray(e, t) {
    void 0 === e && (e = []), void 0 === t && (t = 0);
    const n = this.elements;
    return (
      (e[t] = n[0]),
      (e[t + 1] = n[1]),
      (e[t + 2] = n[2]),
      (e[t + 3] = n[3]),
      (e[t + 4] = n[4]),
      (e[t + 5] = n[5]),
      (e[t + 6] = n[6]),
      (e[t + 7] = n[7]),
      (e[t + 8] = n[8]),
      (e[t + 9] = n[9]),
      (e[t + 10] = n[10]),
      (e[t + 11] = n[11]),
      (e[t + 12] = n[12]),
      (e[t + 13] = n[13]),
      (e[t + 14] = n[14]),
      (e[t + 15] = n[15]),
      e
    );
  }
}
const _v1$1 = new Vector3(),
  _m1 = new Matrix4(),
  _zero = new Vector3(0, 0, 0),
  _one = new Vector3(1, 1, 1),
  _x = new Vector3(),
  _y = new Vector3(),
  _z = new Vector3();
class Euler {
  constructor(e = 0, t = 0, n = 0, r = Euler.DefaultOrder) {
    Object.defineProperty(this, "isEuler", { value: !0 }),
      (this._x = e),
      (this._y = t),
      (this._z = n),
      (this._order = r);
  }
  get x() {
    return this._x;
  }
  set x(e) {
    (this._x = e), this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(e) {
    (this._y = e), this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(e) {
    (this._z = e), this._onChangeCallback();
  }
  get order() {
    return this._order;
  }
  set order(e) {
    (this._order = e), this._onChangeCallback();
  }
  set(e, t, n, r) {
    return (
      (this._x = e),
      (this._y = t),
      (this._z = n),
      (this._order = r || this._order),
      this._onChangeCallback(),
      this
    );
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }
  copy(e) {
    return (
      (this._x = e._x),
      (this._y = e._y),
      (this._z = e._z),
      (this._order = e._order),
      this._onChangeCallback(),
      this
    );
  }
  setFromRotationMatrix(e, t, n) {
    const r = MathUtils.clamp,
      i = e.elements,
      o = i[0],
      a = i[4],
      s = i[8],
      c = i[1],
      l = i[5],
      h = i[9],
      u = i[2],
      d = i[6],
      p = i[10];
    switch ((t = t || this._order)) {
      case "XYZ":
        (this._y = Math.asin(r(s, -1, 1))),
          Math.abs(s) < 0.9999999
            ? ((this._x = Math.atan2(-h, p)), (this._z = Math.atan2(-a, o)))
            : ((this._x = Math.atan2(d, l)), (this._z = 0));
        break;
      case "YXZ":
        (this._x = Math.asin(-r(h, -1, 1))),
          Math.abs(h) < 0.9999999
            ? ((this._y = Math.atan2(s, p)), (this._z = Math.atan2(c, l)))
            : ((this._y = Math.atan2(-u, o)), (this._z = 0));
        break;
      case "ZXY":
        (this._x = Math.asin(r(d, -1, 1))),
          Math.abs(d) < 0.9999999
            ? ((this._y = Math.atan2(-u, p)), (this._z = Math.atan2(-a, l)))
            : ((this._y = 0), (this._z = Math.atan2(c, o)));
        break;
      case "ZYX":
        (this._y = Math.asin(-r(u, -1, 1))),
          Math.abs(u) < 0.9999999
            ? ((this._x = Math.atan2(d, p)), (this._z = Math.atan2(c, o)))
            : ((this._x = 0), (this._z = Math.atan2(-a, l)));
        break;
      case "YZX":
        (this._z = Math.asin(r(c, -1, 1))),
          Math.abs(c) < 0.9999999
            ? ((this._x = Math.atan2(-h, l)), (this._y = Math.atan2(-u, o)))
            : ((this._x = 0), (this._y = Math.atan2(s, p)));
        break;
      case "XZY":
        (this._z = Math.asin(-r(a, -1, 1))),
          Math.abs(a) < 0.9999999
            ? ((this._x = Math.atan2(d, l)), (this._y = Math.atan2(s, o)))
            : ((this._x = Math.atan2(-h, p)), (this._y = 0));
        break;
      default:
        console.warn(
          "THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " +
            t
        );
    }
    return (this._order = t), !1 !== n && this._onChangeCallback(), this;
  }
  setFromQuaternion(e, t, n) {
    return (
      _matrix.makeRotationFromQuaternion(e),
      this.setFromRotationMatrix(_matrix, t, n)
    );
  }
  setFromVector3(e, t) {
    return this.set(e.x, e.y, e.z, t || this._order);
  }
  reorder(e) {
    return (
      _quaternion$1.setFromEuler(this), this.setFromQuaternion(_quaternion$1, e)
    );
  }
  equals(e) {
    return (
      e._x === this._x &&
      e._y === this._y &&
      e._z === this._z &&
      e._order === this._order
    );
  }
  fromArray(e) {
    return (
      (this._x = e[0]),
      (this._y = e[1]),
      (this._z = e[2]),
      void 0 !== e[3] && (this._order = e[3]),
      this._onChangeCallback(),
      this
    );
  }
  toArray(e, t) {
    return (
      void 0 === e && (e = []),
      void 0 === t && (t = 0),
      (e[t] = this._x),
      (e[t + 1] = this._y),
      (e[t + 2] = this._z),
      (e[t + 3] = this._order),
      e
    );
  }
  toVector3(e) {
    return e
      ? e.set(this._x, this._y, this._z)
      : new Vector3(this._x, this._y, this._z);
  }
  _onChange(e) {
    return (this._onChangeCallback = e), this;
  }
  _onChangeCallback() {}
}
(Euler.DefaultOrder = "XYZ"),
  (Euler.RotationOrders = ["XYZ", "YZX", "ZXY", "XZY", "YXZ", "ZYX"]);
const _matrix = new Matrix4(),
  _quaternion$1 = new Quaternion();
class Layers {
  constructor() {
    this.mask = 1;
  }
  set(e) {
    this.mask = (1 << e) | 0;
  }
  enable(e) {
    this.mask |= (1 << e) | 0;
  }
  enableAll() {
    this.mask = -1;
  }
  toggle(e) {
    this.mask ^= (1 << e) | 0;
  }
  disable(e) {
    this.mask &= ~((1 << e) | 0);
  }
  disableAll() {
    this.mask = 0;
  }
  test(e) {
    return 0 != (this.mask & e.mask);
  }
}
let _object3DId = 0;
const _v1$2 = new Vector3(),
  _q1 = new Quaternion(),
  _m1$1 = new Matrix4(),
  _target = new Vector3(),
  _position = new Vector3(),
  _scale = new Vector3(),
  _quaternion$2 = new Quaternion(),
  _xAxis = new Vector3(1, 0, 0),
  _yAxis = new Vector3(0, 1, 0),
  _zAxis = new Vector3(0, 0, 1),
  _addedEvent = { type: "added" },
  _removedEvent = { type: "removed" };
function Object3D() {
  Object.defineProperty(this, "id", { value: _object3DId++ }),
    (this.uuid = MathUtils.generateUUID()),
    (this.name = ""),
    (this.type = "Object3D"),
    (this.parent = null),
    (this.children = []),
    (this.up = Object3D.DefaultUp.clone());
  const e = new Vector3(),
    t = new Euler(),
    n = new Quaternion(),
    r = new Vector3(1, 1, 1);
  t._onChange(function () {
    n.setFromEuler(t, !1);
  }),
    n._onChange(function () {
      t.setFromQuaternion(n, void 0, !1);
    }),
    Object.defineProperties(this, {
      position: { configurable: !0, enumerable: !0, value: e },
      rotation: { configurable: !0, enumerable: !0, value: t },
      quaternion: { configurable: !0, enumerable: !0, value: n },
      scale: { configurable: !0, enumerable: !0, value: r },
      modelViewMatrix: { value: new Matrix4() },
      normalMatrix: { value: new Matrix3() }
    }),
    (this.matrix = new Matrix4()),
    (this.matrixWorld = new Matrix4()),
    (this.matrixAutoUpdate = Object3D.DefaultMatrixAutoUpdate),
    (this.matrixWorldNeedsUpdate = !1),
    (this.layers = new Layers()),
    (this.visible = !0),
    (this.castShadow = !1),
    (this.receiveShadow = !1),
    (this.frustumCulled = !0),
    (this.renderOrder = 0),
    (this.userData = {});
}
(Object3D.DefaultUp = new Vector3(0, 1, 0)),
  (Object3D.DefaultMatrixAutoUpdate = !0),
  (Object3D.prototype = Object.assign(
    Object.create(EventDispatcher.prototype),
    {
      constructor: Object3D,
      isObject3D: !0,
      onBeforeRender: function () {},
      onAfterRender: function () {},
      applyMatrix4: function (e) {
        this.matrixAutoUpdate && this.updateMatrix(),
          this.matrix.premultiply(e),
          this.matrix.decompose(this.position, this.quaternion, this.scale);
      },
      applyQuaternion: function (e) {
        return this.quaternion.premultiply(e), this;
      },
      setRotationFromAxisAngle: function (e, t) {
        this.quaternion.setFromAxisAngle(e, t);
      },
      setRotationFromEuler: function (e) {
        this.quaternion.setFromEuler(e, !0);
      },
      setRotationFromMatrix: function (e) {
        this.quaternion.setFromRotationMatrix(e);
      },
      setRotationFromQuaternion: function (e) {
        this.quaternion.copy(e);
      },
      rotateOnAxis: function (e, t) {
        return _q1.setFromAxisAngle(e, t), this.quaternion.multiply(_q1), this;
      },
      rotateOnWorldAxis: function (e, t) {
        return (
          _q1.setFromAxisAngle(e, t), this.quaternion.premultiply(_q1), this
        );
      },
      rotateX: function (e) {
        return this.rotateOnAxis(_xAxis, e);
      },
      rotateY: function (e) {
        return this.rotateOnAxis(_yAxis, e);
      },
      rotateZ: function (e) {
        return this.rotateOnAxis(_zAxis, e);
      },
      translateOnAxis: function (e, t) {
        return (
          _v1$2.copy(e).applyQuaternion(this.quaternion),
          this.position.add(_v1$2.multiplyScalar(t)),
          this
        );
      },
      translateX: function (e) {
        return this.translateOnAxis(_xAxis, e);
      },
      translateY: function (e) {
        return this.translateOnAxis(_yAxis, e);
      },
      translateZ: function (e) {
        return this.translateOnAxis(_zAxis, e);
      },
      localToWorld: function (e) {
        return e.applyMatrix4(this.matrixWorld);
      },
      worldToLocal: function (e) {
        return e.applyMatrix4(_m1$1.getInverse(this.matrixWorld));
      },
      lookAt: function (e, t, n) {
        e.isVector3 ? _target.copy(e) : _target.set(e, t, n);
        const r = this.parent;
        this.updateWorldMatrix(!0, !1),
          _position.setFromMatrixPosition(this.matrixWorld),
          this.isCamera || this.isLight
            ? _m1$1.lookAt(_position, _target, this.up)
            : _m1$1.lookAt(_target, _position, this.up),
          this.quaternion.setFromRotationMatrix(_m1$1),
          r &&
            (_m1$1.extractRotation(r.matrixWorld),
            _q1.setFromRotationMatrix(_m1$1),
            this.quaternion.premultiply(_q1.inverse()));
      },
      add: function (e) {
        if (arguments.length > 1) {
          for (let e = 0; e < arguments.length; e++) this.add(arguments[e]);
          return this;
        }
        return e === this
          ? (console.error(
              "THREE.Object3D.add: object can't be added as a child of itself.",
              e
            ),
            this)
          : (e && e.isObject3D
              ? (null !== e.parent && e.parent.remove(e),
                (e.parent = this),
                this.children.push(e),
                e.dispatchEvent(_addedEvent))
              : console.error(
                  "THREE.Object3D.add: object not an instance of THREE.Object3D.",
                  e
                ),
            this);
      },
      remove: function (e) {
        if (arguments.length > 1) {
          for (let e = 0; e < arguments.length; e++) this.remove(arguments[e]);
          return this;
        }
        const t = this.children.indexOf(e);
        return (
          -1 !== t &&
            ((e.parent = null),
            this.children.splice(t, 1),
            e.dispatchEvent(_removedEvent)),
          this
        );
      },
      attach: function (e) {
        return (
          this.updateWorldMatrix(!0, !1),
          _m1$1.getInverse(this.matrixWorld),
          null !== e.parent &&
            (e.parent.updateWorldMatrix(!0, !1),
            _m1$1.multiply(e.parent.matrixWorld)),
          e.applyMatrix4(_m1$1),
          e.updateWorldMatrix(!1, !1),
          this.add(e),
          this
        );
      },
      getObjectById: function (e) {
        return this.getObjectByProperty("id", e);
      },
      getObjectByName: function (e) {
        return this.getObjectByProperty("name", e);
      },
      getObjectByProperty: function (e, t) {
        if (this[e] === t) return this;
        for (let n = 0, r = this.children.length; n < r; n++) {
          const r = this.children[n].getObjectByProperty(e, t);
          if (void 0 !== r) return r;
        }
      },
      getWorldPosition: function (e) {
        return (
          void 0 === e &&
            (console.warn(
              "THREE.Object3D: .getWorldPosition() target is now required"
            ),
            (e = new Vector3())),
          this.updateWorldMatrix(!0, !1),
          e.setFromMatrixPosition(this.matrixWorld)
        );
      },
      getWorldQuaternion: function (e) {
        return (
          void 0 === e &&
            (console.warn(
              "THREE.Object3D: .getWorldQuaternion() target is now required"
            ),
            (e = new Quaternion())),
          this.updateWorldMatrix(!0, !1),
          this.matrixWorld.decompose(_position, e, _scale),
          e
        );
      },
      getWorldScale: function (e) {
        return (
          void 0 === e &&
            (console.warn(
              "THREE.Object3D: .getWorldScale() target is now required"
            ),
            (e = new Vector3())),
          this.updateWorldMatrix(!0, !1),
          this.matrixWorld.decompose(_position, _quaternion$2, e),
          e
        );
      },
      getWorldDirection: function (e) {
        void 0 === e &&
          (console.warn(
            "THREE.Object3D: .getWorldDirection() target is now required"
          ),
          (e = new Vector3())),
          this.updateWorldMatrix(!0, !1);
        const t = this.matrixWorld.elements;
        return e.set(t[8], t[9], t[10]).normalize();
      },
      raycast: function () {},
      traverse: function (e) {
        e(this);
        const t = this.children;
        for (let n = 0, r = t.length; n < r; n++) t[n].traverse(e);
      },
      traverseVisible: function (e) {
        if (!1 === this.visible) return;
        e(this);
        const t = this.children;
        for (let n = 0, r = t.length; n < r; n++) t[n].traverseVisible(e);
      },
      traverseAncestors: function (e) {
        const t = this.parent;
        null !== t && (e(t), t.traverseAncestors(e));
      },
      updateMatrix: function () {
        this.matrix.compose(this.position, this.quaternion, this.scale),
          (this.matrixWorldNeedsUpdate = !0);
      },
      updateMatrixWorld: function (e) {
        this.matrixAutoUpdate && this.updateMatrix(),
          (this.matrixWorldNeedsUpdate || e) &&
            (null === this.parent
              ? this.matrixWorld.copy(this.matrix)
              : this.matrixWorld.multiplyMatrices(
                  this.parent.matrixWorld,
                  this.matrix
                ),
            (this.matrixWorldNeedsUpdate = !1),
            (e = !0));
        const t = this.children;
        for (let n = 0, r = t.length; n < r; n++) t[n].updateMatrixWorld(e);
      },
      updateWorldMatrix: function (e, t) {
        const n = this.parent;
        if (
          (!0 === e && null !== n && n.updateWorldMatrix(!0, !1),
          this.matrixAutoUpdate && this.updateMatrix(),
          null === this.parent
            ? this.matrixWorld.copy(this.matrix)
            : this.matrixWorld.multiplyMatrices(
                this.parent.matrixWorld,
                this.matrix
              ),
          !0 === t)
        ) {
          const e = this.children;
          for (let t = 0, n = e.length; t < n; t++)
            e[t].updateWorldMatrix(!1, !0);
        }
      },
      toJSON: function (e) {
        const t = void 0 === e || "string" == typeof e,
          n = {};
        t &&
          ((e = {
            geometries: {},
            materials: {},
            textures: {},
            images: {},
            shapes: {}
          }),
          (n.metadata = {
            version: 4.5,
            type: "Object",
            generator: "Object3D.toJSON"
          }));
        const r = {};
        function i(t, n) {
          return void 0 === t[n.uuid] && (t[n.uuid] = n.toJSON(e)), n.uuid;
        }
        if (
          ((r.uuid = this.uuid),
          (r.type = this.type),
          "" !== this.name && (r.name = this.name),
          !0 === this.castShadow && (r.castShadow = !0),
          !0 === this.receiveShadow && (r.receiveShadow = !0),
          !1 === this.visible && (r.visible = !1),
          !1 === this.frustumCulled && (r.frustumCulled = !1),
          0 !== this.renderOrder && (r.renderOrder = this.renderOrder),
          "{}" !== JSON.stringify(this.userData) &&
            (r.userData = this.userData),
          (r.layers = this.layers.mask),
          (r.matrix = this.matrix.toArray()),
          !1 === this.matrixAutoUpdate && (r.matrixAutoUpdate = !1),
          this.isInstancedMesh &&
            ((r.type = "InstancedMesh"),
            (r.count = this.count),
            (r.instanceMatrix = this.instanceMatrix.toJSON())),
          this.isMesh || this.isLine || this.isPoints)
        ) {
          r.geometry = i(e.geometries, this.geometry);
          const t = this.geometry.parameters;
          if (void 0 !== t && void 0 !== t.shapes) {
            const n = t.shapes;
            if (Array.isArray(n))
              for (let t = 0, r = n.length; t < r; t++) {
                const r = n[t];
                i(e.shapes, r);
              }
            else i(e.shapes, n);
          }
        }
        if (void 0 !== this.material)
          if (Array.isArray(this.material)) {
            const t = [];
            for (let n = 0, r = this.material.length; n < r; n++)
              t.push(i(e.materials, this.material[n]));
            r.material = t;
          } else r.material = i(e.materials, this.material);
        if (this.children.length > 0) {
          r.children = [];
          for (let t = 0; t < this.children.length; t++)
            r.children.push(this.children[t].toJSON(e).object);
        }
        if (t) {
          const t = o(e.geometries),
            r = o(e.materials),
            i = o(e.textures),
            a = o(e.images),
            s = o(e.shapes);
          t.length > 0 && (n.geometries = t),
            r.length > 0 && (n.materials = r),
            i.length > 0 && (n.textures = i),
            a.length > 0 && (n.images = a),
            s.length > 0 && (n.shapes = s);
        }
        return (n.object = r), n;
        function o(e) {
          const t = [];
          for (const n in e) {
            const r = e[n];
            delete r.metadata, t.push(r);
          }
          return t;
        }
      },
      clone: function (e) {
        return new this.constructor().copy(this, e);
      },
      copy: function (e, t) {
        if (
          (void 0 === t && (t = !0),
          (this.name = e.name),
          this.up.copy(e.up),
          this.position.copy(e.position),
          (this.rotation.order = e.rotation.order),
          this.quaternion.copy(e.quaternion),
          this.scale.copy(e.scale),
          this.matrix.copy(e.matrix),
          this.matrixWorld.copy(e.matrixWorld),
          (this.matrixAutoUpdate = e.matrixAutoUpdate),
          (this.matrixWorldNeedsUpdate = e.matrixWorldNeedsUpdate),
          (this.layers.mask = e.layers.mask),
          (this.visible = e.visible),
          (this.castShadow = e.castShadow),
          (this.receiveShadow = e.receiveShadow),
          (this.frustumCulled = e.frustumCulled),
          (this.renderOrder = e.renderOrder),
          (this.userData = JSON.parse(JSON.stringify(e.userData))),
          !0 === t)
        )
          for (let t = 0; t < e.children.length; t++) {
            const n = e.children[t];
            this.add(n.clone());
          }
        return this;
      }
    }
  ));
const _vector1 = new Vector3(),
  _vector2 = new Vector3(),
  _normalMatrix = new Matrix3();
class Plane {
  constructor(e, t) {
    Object.defineProperty(this, "isPlane", { value: !0 }),
      (this.normal = void 0 !== e ? e : new Vector3(1, 0, 0)),
      (this.constant = void 0 !== t ? t : 0);
  }
  set(e, t) {
    return this.normal.copy(e), (this.constant = t), this;
  }
  setComponents(e, t, n, r) {
    return this.normal.set(e, t, n), (this.constant = r), this;
  }
  setFromNormalAndCoplanarPoint(e, t) {
    return this.normal.copy(e), (this.constant = -t.dot(this.normal)), this;
  }
  setFromCoplanarPoints(e, t, n) {
    const r = _vector1
      .subVectors(n, t)
      .cross(_vector2.subVectors(e, t))
      .normalize();
    return this.setFromNormalAndCoplanarPoint(r, e), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.normal.copy(e.normal), (this.constant = e.constant), this;
  }
  normalize() {
    const e = 1 / this.normal.length();
    return this.normal.multiplyScalar(e), (this.constant *= e), this;
  }
  negate() {
    return (this.constant *= -1), this.normal.negate(), this;
  }
  distanceToPoint(e) {
    return this.normal.dot(e) + this.constant;
  }
  distanceToSphere(e) {
    return this.distanceToPoint(e.center) - e.radius;
  }
  projectPoint(e, t) {
    return (
      void 0 === t &&
        (console.warn("THREE.Plane: .projectPoint() target is now required"),
        (t = new Vector3())),
      t.copy(this.normal).multiplyScalar(-this.distanceToPoint(e)).add(e)
    );
  }
  intersectLine(e, t) {
    void 0 === t &&
      (console.warn("THREE.Plane: .intersectLine() target is now required"),
      (t = new Vector3()));
    const n = e.delta(_vector1),
      r = this.normal.dot(n);
    if (0 === r)
      return 0 === this.distanceToPoint(e.start) ? t.copy(e.start) : void 0;
    const i = -(e.start.dot(this.normal) + this.constant) / r;
    return i < 0 || i > 1 ? void 0 : t.copy(n).multiplyScalar(i).add(e.start);
  }
  intersectsLine(e) {
    const t = this.distanceToPoint(e.start),
      n = this.distanceToPoint(e.end);
    return (t < 0 && n > 0) || (n < 0 && t > 0);
  }
  intersectsBox(e) {
    return e.intersectsPlane(this);
  }
  intersectsSphere(e) {
    return e.intersectsPlane(this);
  }
  coplanarPoint(e) {
    return (
      void 0 === e &&
        (console.warn("THREE.Plane: .coplanarPoint() target is now required"),
        (e = new Vector3())),
      e.copy(this.normal).multiplyScalar(-this.constant)
    );
  }
  applyMatrix4(e, t) {
    const n = t || _normalMatrix.getNormalMatrix(e),
      r = this.coplanarPoint(_vector1).applyMatrix4(e),
      i = this.normal.applyMatrix3(n).normalize();
    return (this.constant = -r.dot(i)), this;
  }
  translate(e) {
    return (this.constant -= e.dot(this.normal)), this;
  }
  equals(e) {
    return e.normal.equals(this.normal) && e.constant === this.constant;
  }
}
const _v0$1 = new Vector3(),
  _v1$3 = new Vector3(),
  _v2$1 = new Vector3(),
  _v3 = new Vector3(),
  _vab = new Vector3(),
  _vac = new Vector3(),
  _vbc = new Vector3(),
  _vap = new Vector3(),
  _vbp = new Vector3(),
  _vcp = new Vector3();
class Triangle {
  constructor(e, t, n) {
    (this.a = void 0 !== e ? e : new Vector3()),
      (this.b = void 0 !== t ? t : new Vector3()),
      (this.c = void 0 !== n ? n : new Vector3());
  }
  static getNormal(e, t, n, r) {
    void 0 === r &&
      (console.warn("THREE.Triangle: .getNormal() target is now required"),
      (r = new Vector3())),
      r.subVectors(n, t),
      _v0$1.subVectors(e, t),
      r.cross(_v0$1);
    const i = r.lengthSq();
    return i > 0 ? r.multiplyScalar(1 / Math.sqrt(i)) : r.set(0, 0, 0);
  }
  static getBarycoord(e, t, n, r, i) {
    _v0$1.subVectors(r, t), _v1$3.subVectors(n, t), _v2$1.subVectors(e, t);
    const o = _v0$1.dot(_v0$1),
      a = _v0$1.dot(_v1$3),
      s = _v0$1.dot(_v2$1),
      c = _v1$3.dot(_v1$3),
      l = _v1$3.dot(_v2$1),
      h = o * c - a * a;
    if (
      (void 0 === i &&
        (console.warn("THREE.Triangle: .getBarycoord() target is now required"),
        (i = new Vector3())),
      0 === h)
    )
      return i.set(-2, -1, -1);
    const u = 1 / h,
      d = (c * s - a * l) * u,
      p = (o * l - a * s) * u;
    return i.set(1 - d - p, p, d);
  }
  static containsPoint(e, t, n, r) {
    return (
      this.getBarycoord(e, t, n, r, _v3),
      _v3.x >= 0 && _v3.y >= 0 && _v3.x + _v3.y <= 1
    );
  }
  static getUV(e, t, n, r, i, o, a, s) {
    return (
      this.getBarycoord(e, t, n, r, _v3),
      s.set(0, 0),
      s.addScaledVector(i, _v3.x),
      s.addScaledVector(o, _v3.y),
      s.addScaledVector(a, _v3.z),
      s
    );
  }
  static isFrontFacing(e, t, n, r) {
    return (
      _v0$1.subVectors(n, t),
      _v1$3.subVectors(e, t),
      _v0$1.cross(_v1$3).dot(r) < 0
    );
  }
  set(e, t, n) {
    return this.a.copy(e), this.b.copy(t), this.c.copy(n), this;
  }
  setFromPointsAndIndices(e, t, n, r) {
    return this.a.copy(e[t]), this.b.copy(e[n]), this.c.copy(e[r]), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.a.copy(e.a), this.b.copy(e.b), this.c.copy(e.c), this;
  }
  getArea() {
    return (
      _v0$1.subVectors(this.c, this.b),
      _v1$3.subVectors(this.a, this.b),
      0.5 * _v0$1.cross(_v1$3).length()
    );
  }
  getMidpoint(e) {
    return (
      void 0 === e &&
        (console.warn("THREE.Triangle: .getMidpoint() target is now required"),
        (e = new Vector3())),
      e
        .addVectors(this.a, this.b)
        .add(this.c)
        .multiplyScalar(1 / 3)
    );
  }
  getNormal(e) {
    return Triangle.getNormal(this.a, this.b, this.c, e);
  }
  getPlane(e) {
    return (
      void 0 === e &&
        (console.warn("THREE.Triangle: .getPlane() target is now required"),
        (e = new Plane())),
      e.setFromCoplanarPoints(this.a, this.b, this.c)
    );
  }
  getBarycoord(e, t) {
    return Triangle.getBarycoord(e, this.a, this.b, this.c, t);
  }
  getUV(e, t, n, r, i) {
    return Triangle.getUV(e, this.a, this.b, this.c, t, n, r, i);
  }
  containsPoint(e) {
    return Triangle.containsPoint(e, this.a, this.b, this.c);
  }
  isFrontFacing(e) {
    return Triangle.isFrontFacing(this.a, this.b, this.c, e);
  }
  intersectsBox(e) {
    return e.intersectsTriangle(this);
  }
  closestPointToPoint(e, t) {
    void 0 === t &&
      (console.warn(
        "THREE.Triangle: .closestPointToPoint() target is now required"
      ),
      (t = new Vector3()));
    const n = this.a,
      r = this.b,
      i = this.c;
    let o, a;
    _vab.subVectors(r, n), _vac.subVectors(i, n), _vap.subVectors(e, n);
    const s = _vab.dot(_vap),
      c = _vac.dot(_vap);
    if (s <= 0 && c <= 0) return t.copy(n);
    _vbp.subVectors(e, r);
    const l = _vab.dot(_vbp),
      h = _vac.dot(_vbp);
    if (l >= 0 && h <= l) return t.copy(r);
    const u = s * h - l * c;
    if (u <= 0 && s >= 0 && l <= 0)
      return (o = s / (s - l)), t.copy(n).addScaledVector(_vab, o);
    _vcp.subVectors(e, i);
    const d = _vab.dot(_vcp),
      p = _vac.dot(_vcp);
    if (p >= 0 && d <= p) return t.copy(i);
    const m = d * c - s * p;
    if (m <= 0 && c >= 0 && p <= 0)
      return (a = c / (c - p)), t.copy(n).addScaledVector(_vac, a);
    const f = l * p - d * h;
    if (f <= 0 && h - l >= 0 && d - p >= 0)
      return (
        _vbc.subVectors(i, r),
        (a = (h - l) / (h - l + (d - p))),
        t.copy(r).addScaledVector(_vbc, a)
      );
    const g = 1 / (f + m + u);
    return (
      (o = m * g),
      (a = u * g),
      t.copy(n).addScaledVector(_vab, o).addScaledVector(_vac, a)
    );
  }
  equals(e) {
    return e.a.equals(this.a) && e.b.equals(this.b) && e.c.equals(this.c);
  }
}
const _colorKeywords = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
  },
  _hslA = { h: 0, s: 0, l: 0 },
  _hslB = { h: 0, s: 0, l: 0 };
function hue2rgb(e, t, n) {
  return (
    n < 0 && (n += 1),
    n > 1 && (n -= 1),
    n < 1 / 6
      ? e + 6 * (t - e) * n
      : n < 0.5
      ? t
      : n < 2 / 3
      ? e + 6 * (t - e) * (2 / 3 - n)
      : e
  );
}
function SRGBToLinear(e) {
  return e < 0.04045
    ? 0.0773993808 * e
    : Math.pow(0.9478672986 * e + 0.0521327014, 2.4);
}
function LinearToSRGB(e) {
  return e < 0.0031308 ? 12.92 * e : 1.055 * Math.pow(e, 0.41666) - 0.055;
}
class Color {
  constructor(e, t, n) {
    return (
      Object.defineProperty(this, "isColor", { value: !0 }),
      void 0 === t && void 0 === n ? this.set(e) : this.setRGB(e, t, n)
    );
  }
  set(e) {
    return (
      e && e.isColor
        ? this.copy(e)
        : "number" == typeof e
        ? this.setHex(e)
        : "string" == typeof e && this.setStyle(e),
      this
    );
  }
  setScalar(e) {
    return (this.r = e), (this.g = e), (this.b = e), this;
  }
  setHex(e) {
    return (
      (e = Math.floor(e)),
      (this.r = ((e >> 16) & 255) / 255),
      (this.g = ((e >> 8) & 255) / 255),
      (this.b = (255 & e) / 255),
      this
    );
  }
  setRGB(e, t, n) {
    return (this.r = e), (this.g = t), (this.b = n), this;
  }
  setHSL(e, t, n) {
    if (
      ((e = MathUtils.euclideanModulo(e, 1)),
      (t = MathUtils.clamp(t, 0, 1)),
      (n = MathUtils.clamp(n, 0, 1)),
      0 === t)
    )
      this.r = this.g = this.b = n;
    else {
      const r = n <= 0.5 ? n * (1 + t) : n + t - n * t,
        i = 2 * n - r;
      (this.r = hue2rgb(i, r, e + 1 / 3)),
        (this.g = hue2rgb(i, r, e)),
        (this.b = hue2rgb(i, r, e - 1 / 3));
    }
    return this;
  }
  setStyle(e) {
    function t(t) {
      void 0 !== t &&
        parseFloat(t) < 1 &&
        console.warn(
          "THREE.Color: Alpha component of " + e + " will be ignored."
        );
    }
    let n;
    if ((n = /^((?:rgb|hsl)a?)\(\s*([^\)]*)\)/.exec(e))) {
      let e;
      const r = n[1],
        i = n[2];
      switch (r) {
        case "rgb":
        case "rgba":
          if (
            (e =
              /^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(
                i
              ))
          )
            return (
              (this.r = Math.min(255, parseInt(e[1], 10)) / 255),
              (this.g = Math.min(255, parseInt(e[2], 10)) / 255),
              (this.b = Math.min(255, parseInt(e[3], 10)) / 255),
              t(e[5]),
              this
            );
          if (
            (e =
              /^(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(
                i
              ))
          )
            return (
              (this.r = Math.min(100, parseInt(e[1], 10)) / 100),
              (this.g = Math.min(100, parseInt(e[2], 10)) / 100),
              (this.b = Math.min(100, parseInt(e[3], 10)) / 100),
              t(e[5]),
              this
            );
          break;
        case "hsl":
        case "hsla":
          if (
            (e =
              /^([0-9]*\.?[0-9]+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(
                i
              ))
          ) {
            const n = parseFloat(e[1]) / 360,
              r = parseInt(e[2], 10) / 100,
              i = parseInt(e[3], 10) / 100;
            return t(e[5]), this.setHSL(n, r, i);
          }
      }
    } else if ((n = /^\#([A-Fa-f0-9]+)$/.exec(e))) {
      const e = n[1],
        t = e.length;
      if (3 === t)
        return (
          (this.r = parseInt(e.charAt(0) + e.charAt(0), 16) / 255),
          (this.g = parseInt(e.charAt(1) + e.charAt(1), 16) / 255),
          (this.b = parseInt(e.charAt(2) + e.charAt(2), 16) / 255),
          this
        );
      if (6 === t)
        return (
          (this.r = parseInt(e.charAt(0) + e.charAt(1), 16) / 255),
          (this.g = parseInt(e.charAt(2) + e.charAt(3), 16) / 255),
          (this.b = parseInt(e.charAt(4) + e.charAt(5), 16) / 255),
          this
        );
    }
    return e && e.length > 0 ? this.setColorName(e) : this;
  }
  setColorName(e) {
    const t = _colorKeywords[e];
    return (
      void 0 !== t
        ? this.setHex(t)
        : console.warn("THREE.Color: Unknown color " + e),
      this
    );
  }
  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }
  copy(e) {
    return (this.r = e.r), (this.g = e.g), (this.b = e.b), this;
  }
  copyGammaToLinear(e, t) {
    return (
      void 0 === t && (t = 2),
      (this.r = Math.pow(e.r, t)),
      (this.g = Math.pow(e.g, t)),
      (this.b = Math.pow(e.b, t)),
      this
    );
  }
  copyLinearToGamma(e, t) {
    void 0 === t && (t = 2);
    const n = t > 0 ? 1 / t : 1;
    return (
      (this.r = Math.pow(e.r, n)),
      (this.g = Math.pow(e.g, n)),
      (this.b = Math.pow(e.b, n)),
      this
    );
  }
  convertGammaToLinear(e) {
    return this.copyGammaToLinear(this, e), this;
  }
  convertLinearToGamma(e) {
    return this.copyLinearToGamma(this, e), this;
  }
  copySRGBToLinear(e) {
    return (
      (this.r = SRGBToLinear(e.r)),
      (this.g = SRGBToLinear(e.g)),
      (this.b = SRGBToLinear(e.b)),
      this
    );
  }
  copyLinearToSRGB(e) {
    return (
      (this.r = LinearToSRGB(e.r)),
      (this.g = LinearToSRGB(e.g)),
      (this.b = LinearToSRGB(e.b)),
      this
    );
  }
  convertSRGBToLinear() {
    return this.copySRGBToLinear(this), this;
  }
  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this), this;
  }
  getHex() {
    return (
      ((255 * this.r) << 16) ^ ((255 * this.g) << 8) ^ ((255 * this.b) << 0)
    );
  }
  getHexString() {
    return ("000000" + this.getHex().toString(16)).slice(-6);
  }
  getHSL(e) {
    void 0 === e &&
      (console.warn("THREE.Color: .getHSL() target is now required"),
      (e = { h: 0, s: 0, l: 0 }));
    const t = this.r,
      n = this.g,
      r = this.b,
      i = Math.max(t, n, r),
      o = Math.min(t, n, r);
    let a, s;
    const c = (o + i) / 2;
    if (o === i) (a = 0), (s = 0);
    else {
      const e = i - o;
      switch (((s = c <= 0.5 ? e / (i + o) : e / (2 - i - o)), i)) {
        case t:
          a = (n - r) / e + (n < r ? 6 : 0);
          break;
        case n:
          a = (r - t) / e + 2;
          break;
        case r:
          a = (t - n) / e + 4;
      }
      a /= 6;
    }
    return (e.h = a), (e.s = s), (e.l = c), e;
  }
  getStyle() {
    return (
      "rgb(" +
      ((255 * this.r) | 0) +
      "," +
      ((255 * this.g) | 0) +
      "," +
      ((255 * this.b) | 0) +
      ")"
    );
  }
  offsetHSL(e, t, n) {
    return (
      this.getHSL(_hslA),
      (_hslA.h += e),
      (_hslA.s += t),
      (_hslA.l += n),
      this.setHSL(_hslA.h, _hslA.s, _hslA.l),
      this
    );
  }
  add(e) {
    return (this.r += e.r), (this.g += e.g), (this.b += e.b), this;
  }
  addColors(e, t) {
    return (
      (this.r = e.r + t.r), (this.g = e.g + t.g), (this.b = e.b + t.b), this
    );
  }
  addScalar(e) {
    return (this.r += e), (this.g += e), (this.b += e), this;
  }
  sub(e) {
    return (
      (this.r = Math.max(0, this.r - e.r)),
      (this.g = Math.max(0, this.g - e.g)),
      (this.b = Math.max(0, this.b - e.b)),
      this
    );
  }
  multiply(e) {
    return (this.r *= e.r), (this.g *= e.g), (this.b *= e.b), this;
  }
  multiplyScalar(e) {
    return (this.r *= e), (this.g *= e), (this.b *= e), this;
  }
  lerp(e, t) {
    return (
      (this.r += (e.r - this.r) * t),
      (this.g += (e.g - this.g) * t),
      (this.b += (e.b - this.b) * t),
      this
    );
  }
  lerpHSL(e, t) {
    this.getHSL(_hslA), e.getHSL(_hslB);
    const n = MathUtils.lerp(_hslA.h, _hslB.h, t),
      r = MathUtils.lerp(_hslA.s, _hslB.s, t),
      i = MathUtils.lerp(_hslA.l, _hslB.l, t);
    return this.setHSL(n, r, i), this;
  }
  equals(e) {
    return e.r === this.r && e.g === this.g && e.b === this.b;
  }
  fromArray(e, t) {
    return (
      void 0 === t && (t = 0),
      (this.r = e[t]),
      (this.g = e[t + 1]),
      (this.b = e[t + 2]),
      this
    );
  }
  toArray(e, t) {
    return (
      void 0 === e && (e = []),
      void 0 === t && (t = 0),
      (e[t] = this.r),
      (e[t + 1] = this.g),
      (e[t + 2] = this.b),
      e
    );
  }
  fromBufferAttribute(e, t) {
    return (
      (this.r = e.getX(t)),
      (this.g = e.getY(t)),
      (this.b = e.getZ(t)),
      !0 === e.normalized &&
        ((this.r /= 255), (this.g /= 255), (this.b /= 255)),
      this
    );
  }
  toJSON() {
    return this.getHex();
  }
}
(Color.NAMES = _colorKeywords),
  (Color.prototype.r = 1),
  (Color.prototype.g = 1),
  (Color.prototype.b = 1);
class Face3 {
  constructor(e, t, n, r, i, o) {
    (this.a = e),
      (this.b = t),
      (this.c = n),
      (this.normal = r && r.isVector3 ? r : new Vector3()),
      (this.vertexNormals = Array.isArray(r) ? r : []),
      (this.color = i && i.isColor ? i : new Color()),
      (this.vertexColors = Array.isArray(i) ? i : []),
      (this.materialIndex = void 0 !== o ? o : 0);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    (this.a = e.a),
      (this.b = e.b),
      (this.c = e.c),
      this.normal.copy(e.normal),
      this.color.copy(e.color),
      (this.materialIndex = e.materialIndex);
    for (let t = 0, n = e.vertexNormals.length; t < n; t++)
      this.vertexNormals[t] = e.vertexNormals[t].clone();
    for (let t = 0, n = e.vertexColors.length; t < n; t++)
      this.vertexColors[t] = e.vertexColors[t].clone();
    return this;
  }
}
let materialId = 0;
function Material() {
  Object.defineProperty(this, "id", { value: materialId++ }),
    (this.uuid = MathUtils.generateUUID()),
    (this.name = ""),
    (this.type = "Material"),
    (this.fog = !0),
    (this.blending = NormalBlending),
    (this.side = FrontSide),
    (this.flatShading = !1),
    (this.vertexColors = !1),
    (this.opacity = 1),
    (this.transparent = !1),
    (this.blendSrc = SrcAlphaFactor),
    (this.blendDst = OneMinusSrcAlphaFactor),
    (this.blendEquation = AddEquation),
    (this.blendSrcAlpha = null),
    (this.blendDstAlpha = null),
    (this.blendEquationAlpha = null),
    (this.depthFunc = LessEqualDepth),
    (this.depthTest = !0),
    (this.depthWrite = !0),
    (this.stencilWriteMask = 255),
    (this.stencilFunc = AlwaysStencilFunc),
    (this.stencilRef = 0),
    (this.stencilFuncMask = 255),
    (this.stencilFail = KeepStencilOp),
    (this.stencilZFail = KeepStencilOp),
    (this.stencilZPass = KeepStencilOp),
    (this.stencilWrite = !1),
    (this.clippingPlanes = null),
    (this.clipIntersection = !1),
    (this.clipShadows = !1),
    (this.shadowSide = null),
    (this.colorWrite = !0),
    (this.precision = null),
    (this.polygonOffset = !1),
    (this.polygonOffsetFactor = 0),
    (this.polygonOffsetUnits = 0),
    (this.dithering = !1),
    (this.alphaTest = 0),
    (this.premultipliedAlpha = !1),
    (this.visible = !0),
    (this.toneMapped = !0),
    (this.userData = {}),
    (this.version = 0);
}
function MeshBasicMaterial(e) {
  Material.call(this),
    (this.type = "MeshBasicMaterial"),
    (this.color = new Color(16777215)),
    (this.map = null),
    (this.lightMap = null),
    (this.lightMapIntensity = 1),
    (this.aoMap = null),
    (this.aoMapIntensity = 1),
    (this.specularMap = null),
    (this.alphaMap = null),
    (this.envMap = null),
    (this.combine = MultiplyOperation),
    (this.reflectivity = 1),
    (this.refractionRatio = 0.98),
    (this.wireframe = !1),
    (this.wireframeLinewidth = 1),
    (this.wireframeLinecap = "round"),
    (this.wireframeLinejoin = "round"),
    (this.skinning = !1),
    (this.morphTargets = !1),
    this.setValues(e);
}
(Material.prototype = Object.assign(Object.create(EventDispatcher.prototype), {
  constructor: Material,
  isMaterial: !0,
  onBeforeCompile: function () {},
  customProgramCacheKey: function () {
    return this.onBeforeCompile.toString();
  },
  setValues: function (e) {
    if (void 0 !== e)
      for (const t in e) {
        const n = e[t];
        if (void 0 === n) {
          console.warn("THREE.Material: '" + t + "' parameter is undefined.");
          continue;
        }
        if ("shading" === t) {
          console.warn(
            "THREE." +
              this.type +
              ": .shading has been removed. Use the boolean .flatShading instead."
          ),
            (this.flatShading = 1 === n);
          continue;
        }
        const r = this[t];
        void 0 !== r
          ? r && r.isColor
            ? r.set(n)
            : r && r.isVector3 && n && n.isVector3
            ? r.copy(n)
            : (this[t] = n)
          : console.warn(
              "THREE." +
                this.type +
                ": '" +
                t +
                "' is not a property of this material."
            );
      }
  },
  toJSON: function (e) {
    const t = void 0 === e || "string" == typeof e;
    t && (e = { textures: {}, images: {} });
    const n = {
      metadata: { version: 4.5, type: "Material", generator: "Material.toJSON" }
    };
    function r(e) {
      const t = [];
      for (const n in e) {
        const r = e[n];
        delete r.metadata, t.push(r);
      }
      return t;
    }
    if (
      ((n.uuid = this.uuid),
      (n.type = this.type),
      "" !== this.name && (n.name = this.name),
      this.color && this.color.isColor && (n.color = this.color.getHex()),
      void 0 !== this.roughness && (n.roughness = this.roughness),
      void 0 !== this.metalness && (n.metalness = this.metalness),
      this.sheen && this.sheen.isColor && (n.sheen = this.sheen.getHex()),
      this.emissive &&
        this.emissive.isColor &&
        (n.emissive = this.emissive.getHex()),
      this.emissiveIntensity &&
        1 !== this.emissiveIntensity &&
        (n.emissiveIntensity = this.emissiveIntensity),
      this.specular &&
        this.specular.isColor &&
        (n.specular = this.specular.getHex()),
      void 0 !== this.shininess && (n.shininess = this.shininess),
      void 0 !== this.clearcoat && (n.clearcoat = this.clearcoat),
      void 0 !== this.clearcoatRoughness &&
        (n.clearcoatRoughness = this.clearcoatRoughness),
      this.clearcoatMap &&
        this.clearcoatMap.isTexture &&
        (n.clearcoatMap = this.clearcoatMap.toJSON(e).uuid),
      this.clearcoatRoughnessMap &&
        this.clearcoatRoughnessMap.isTexture &&
        (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e).uuid),
      this.clearcoatNormalMap &&
        this.clearcoatNormalMap.isTexture &&
        ((n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e).uuid),
        (n.clearcoatNormalScale = this.clearcoatNormalScale.toArray())),
      this.map && this.map.isTexture && (n.map = this.map.toJSON(e).uuid),
      this.matcap &&
        this.matcap.isTexture &&
        (n.matcap = this.matcap.toJSON(e).uuid),
      this.alphaMap &&
        this.alphaMap.isTexture &&
        (n.alphaMap = this.alphaMap.toJSON(e).uuid),
      this.lightMap &&
        this.lightMap.isTexture &&
        (n.lightMap = this.lightMap.toJSON(e).uuid),
      this.aoMap &&
        this.aoMap.isTexture &&
        ((n.aoMap = this.aoMap.toJSON(e).uuid),
        (n.aoMapIntensity = this.aoMapIntensity)),
      this.bumpMap &&
        this.bumpMap.isTexture &&
        ((n.bumpMap = this.bumpMap.toJSON(e).uuid),
        (n.bumpScale = this.bumpScale)),
      this.normalMap &&
        this.normalMap.isTexture &&
        ((n.normalMap = this.normalMap.toJSON(e).uuid),
        (n.normalMapType = this.normalMapType),
        (n.normalScale = this.normalScale.toArray())),
      this.displacementMap &&
        this.displacementMap.isTexture &&
        ((n.displacementMap = this.displacementMap.toJSON(e).uuid),
        (n.displacementScale = this.displacementScale),
        (n.displacementBias = this.displacementBias)),
      this.roughnessMap &&
        this.roughnessMap.isTexture &&
        (n.roughnessMap = this.roughnessMap.toJSON(e).uuid),
      this.metalnessMap &&
        this.metalnessMap.isTexture &&
        (n.metalnessMap = this.metalnessMap.toJSON(e).uuid),
      this.emissiveMap &&
        this.emissiveMap.isTexture &&
        (n.emissiveMap = this.emissiveMap.toJSON(e).uuid),
      this.specularMap &&
        this.specularMap.isTexture &&
        (n.specularMap = this.specularMap.toJSON(e).uuid),
      this.envMap &&
        this.envMap.isTexture &&
        ((n.envMap = this.envMap.toJSON(e).uuid),
        (n.reflectivity = this.reflectivity),
        (n.refractionRatio = this.refractionRatio),
        void 0 !== this.combine && (n.combine = this.combine),
        void 0 !== this.envMapIntensity &&
          (n.envMapIntensity = this.envMapIntensity)),
      this.gradientMap &&
        this.gradientMap.isTexture &&
        (n.gradientMap = this.gradientMap.toJSON(e).uuid),
      void 0 !== this.size && (n.size = this.size),
      void 0 !== this.sizeAttenuation &&
        (n.sizeAttenuation = this.sizeAttenuation),
      this.blending !== NormalBlending && (n.blending = this.blending),
      !0 === this.flatShading && (n.flatShading = this.flatShading),
      this.side !== FrontSide && (n.side = this.side),
      this.vertexColors && (n.vertexColors = !0),
      this.opacity < 1 && (n.opacity = this.opacity),
      !0 === this.transparent && (n.transparent = this.transparent),
      (n.depthFunc = this.depthFunc),
      (n.depthTest = this.depthTest),
      (n.depthWrite = this.depthWrite),
      (n.stencilWrite = this.stencilWrite),
      (n.stencilWriteMask = this.stencilWriteMask),
      (n.stencilFunc = this.stencilFunc),
      (n.stencilRef = this.stencilRef),
      (n.stencilFuncMask = this.stencilFuncMask),
      (n.stencilFail = this.stencilFail),
      (n.stencilZFail = this.stencilZFail),
      (n.stencilZPass = this.stencilZPass),
      this.rotation && 0 !== this.rotation && (n.rotation = this.rotation),
      !0 === this.polygonOffset && (n.polygonOffset = !0),
      0 !== this.polygonOffsetFactor &&
        (n.polygonOffsetFactor = this.polygonOffsetFactor),
      0 !== this.polygonOffsetUnits &&
        (n.polygonOffsetUnits = this.polygonOffsetUnits),
      this.linewidth && 1 !== this.linewidth && (n.linewidth = this.linewidth),
      void 0 !== this.dashSize && (n.dashSize = this.dashSize),
      void 0 !== this.gapSize && (n.gapSize = this.gapSize),
      void 0 !== this.scale && (n.scale = this.scale),
      !0 === this.dithering && (n.dithering = !0),
      this.alphaTest > 0 && (n.alphaTest = this.alphaTest),
      !0 === this.premultipliedAlpha &&
        (n.premultipliedAlpha = this.premultipliedAlpha),
      !0 === this.wireframe && (n.wireframe = this.wireframe),
      this.wireframeLinewidth > 1 &&
        (n.wireframeLinewidth = this.wireframeLinewidth),
      "round" !== this.wireframeLinecap &&
        (n.wireframeLinecap = this.wireframeLinecap),
      "round" !== this.wireframeLinejoin &&
        (n.wireframeLinejoin = this.wireframeLinejoin),
      !0 === this.morphTargets && (n.morphTargets = !0),
      !0 === this.morphNormals && (n.morphNormals = !0),
      !0 === this.skinning && (n.skinning = !0),
      !1 === this.visible && (n.visible = !1),
      !1 === this.toneMapped && (n.toneMapped = !1),
      "{}" !== JSON.stringify(this.userData) && (n.userData = this.userData),
      t)
    ) {
      const t = r(e.textures),
        i = r(e.images);
      t.length > 0 && (n.textures = t), i.length > 0 && (n.images = i);
    }
    return n;
  },
  clone: function () {
    return new this.constructor().copy(this);
  },
  copy: function (e) {
    (this.name = e.name),
      (this.fog = e.fog),
      (this.blending = e.blending),
      (this.side = e.side),
      (this.flatShading = e.flatShading),
      (this.vertexColors = e.vertexColors),
      (this.opacity = e.opacity),
      (this.transparent = e.transparent),
      (this.blendSrc = e.blendSrc),
      (this.blendDst = e.blendDst),
      (this.blendEquation = e.blendEquation),
      (this.blendSrcAlpha = e.blendSrcAlpha),
      (this.blendDstAlpha = e.blendDstAlpha),
      (this.blendEquationAlpha = e.blendEquationAlpha),
      (this.depthFunc = e.depthFunc),
      (this.depthTest = e.depthTest),
      (this.depthWrite = e.depthWrite),
      (this.stencilWriteMask = e.stencilWriteMask),
      (this.stencilFunc = e.stencilFunc),
      (this.stencilRef = e.stencilRef),
      (this.stencilFuncMask = e.stencilFuncMask),
      (this.stencilFail = e.stencilFail),
      (this.stencilZFail = e.stencilZFail),
      (this.stencilZPass = e.stencilZPass),
      (this.stencilWrite = e.stencilWrite);
    const t = e.clippingPlanes;
    let n = null;
    if (null !== t) {
      const e = t.length;
      n = new Array(e);
      for (let r = 0; r !== e; ++r) n[r] = t[r].clone();
    }
    return (
      (this.clippingPlanes = n),
      (this.clipIntersection = e.clipIntersection),
      (this.clipShadows = e.clipShadows),
      (this.shadowSide = e.shadowSide),
      (this.colorWrite = e.colorWrite),
      (this.precision = e.precision),
      (this.polygonOffset = e.polygonOffset),
      (this.polygonOffsetFactor = e.polygonOffsetFactor),
      (this.polygonOffsetUnits = e.polygonOffsetUnits),
      (this.dithering = e.dithering),
      (this.alphaTest = e.alphaTest),
      (this.premultipliedAlpha = e.premultipliedAlpha),
      (this.visible = e.visible),
      (this.toneMapped = e.toneMapped),
      (this.userData = JSON.parse(JSON.stringify(e.userData))),
      this
    );
  },
  dispose: function () {
    this.dispatchEvent({ type: "dispose" });
  }
})),
  Object.defineProperty(Material.prototype, "needsUpdate", {
    set: function (e) {
      !0 === e && this.version++;
    }
  }),
  (MeshBasicMaterial.prototype = Object.create(Material.prototype)),
  (MeshBasicMaterial.prototype.constructor = MeshBasicMaterial),
  (MeshBasicMaterial.prototype.isMeshBasicMaterial = !0),
  (MeshBasicMaterial.prototype.copy = function (e) {
    return (
      Material.prototype.copy.call(this, e),
      this.color.copy(e.color),
      (this.map = e.map),
      (this.lightMap = e.lightMap),
      (this.lightMapIntensity = e.lightMapIntensity),
      (this.aoMap = e.aoMap),
      (this.aoMapIntensity = e.aoMapIntensity),
      (this.specularMap = e.specularMap),
      (this.alphaMap = e.alphaMap),
      (this.envMap = e.envMap),
      (this.combine = e.combine),
      (this.reflectivity = e.reflectivity),
      (this.refractionRatio = e.refractionRatio),
      (this.wireframe = e.wireframe),
      (this.wireframeLinewidth = e.wireframeLinewidth),
      (this.wireframeLinecap = e.wireframeLinecap),
      (this.wireframeLinejoin = e.wireframeLinejoin),
      (this.skinning = e.skinning),
      (this.morphTargets = e.morphTargets),
      this
    );
  });
const _vector$3 = new Vector3(),
  _vector2$1 = new Vector2();
function BufferAttribute(e, t, n) {
  if (Array.isArray(e))
    throw new TypeError(
      "THREE.BufferAttribute: array should be a Typed Array."
    );
  (this.name = ""),
    (this.array = e),
    (this.itemSize = t),
    (this.count = void 0 !== e ? e.length / t : 0),
    (this.normalized = !0 === n),
    (this.usage = StaticDrawUsage),
    (this.updateRange = { offset: 0, count: -1 }),
    (this.version = 0);
}
function Int8BufferAttribute(e, t, n) {
  BufferAttribute.call(this, new Int8Array(e), t, n);
}
function Uint8BufferAttribute(e, t, n) {
  BufferAttribute.call(this, new Uint8Array(e), t, n);
}
function Uint8ClampedBufferAttribute(e, t, n) {
  BufferAttribute.call(this, new Uint8ClampedArray(e), t, n);
}
function Int16BufferAttribute(e, t, n) {
  BufferAttribute.call(this, new Int16Array(e), t, n);
}
function Uint16BufferAttribute(e, t, n) {
  BufferAttribute.call(this, new Uint16Array(e), t, n);
}
function Int32BufferAttribute(e, t, n) {
  BufferAttribute.call(this, new Int32Array(e), t, n);
}
function Uint32BufferAttribute(e, t, n) {
  BufferAttribute.call(this, new Uint32Array(e), t, n);
}
function Float32BufferAttribute(e, t, n) {
  BufferAttribute.call(this, new Float32Array(e), t, n);
}
function Float64BufferAttribute(e, t, n) {
  BufferAttribute.call(this, new Float64Array(e), t, n);
}
Object.defineProperty(BufferAttribute.prototype, "needsUpdate", {
  set: function (e) {
    !0 === e && this.version++;
  }
}),
  Object.assign(BufferAttribute.prototype, {
    isBufferAttribute: !0,
    onUploadCallback: function () {},
    setUsage: function (e) {
      return (this.usage = e), this;
    },
    copy: function (e) {
      return (
        (this.name = e.name),
        (this.array = new e.array.constructor(e.array)),
        (this.itemSize = e.itemSize),
        (this.count = e.count),
        (this.normalized = e.normalized),
        (this.usage = e.usage),
        this
      );
    },
    copyAt: function (e, t, n) {
      (e *= this.itemSize), (n *= t.itemSize);
      for (let r = 0, i = this.itemSize; r < i; r++)
        this.array[e + r] = t.array[n + r];
      return this;
    },
    copyArray: function (e) {
      return this.array.set(e), this;
    },
    copyColorsArray: function (e) {
      const t = this.array;
      let n = 0;
      for (let r = 0, i = e.length; r < i; r++) {
        let i = e[r];
        void 0 === i &&
          (console.warn(
            "THREE.BufferAttribute.copyColorsArray(): color is undefined",
            r
          ),
          (i = new Color())),
          (t[n++] = i.r),
          (t[n++] = i.g),
          (t[n++] = i.b);
      }
      return this;
    },
    copyVector2sArray: function (e) {
      const t = this.array;
      let n = 0;
      for (let r = 0, i = e.length; r < i; r++) {
        let i = e[r];
        void 0 === i &&
          (console.warn(
            "THREE.BufferAttribute.copyVector2sArray(): vector is undefined",
            r
          ),
          (i = new Vector2())),
          (t[n++] = i.x),
          (t[n++] = i.y);
      }
      return this;
    },
    copyVector3sArray: function (e) {
      const t = this.array;
      let n = 0;
      for (let r = 0, i = e.length; r < i; r++) {
        let i = e[r];
        void 0 === i &&
          (console.warn(
            "THREE.BufferAttribute.copyVector3sArray(): vector is undefined",
            r
          ),
          (i = new Vector3())),
          (t[n++] = i.x),
          (t[n++] = i.y),
          (t[n++] = i.z);
      }
      return this;
    },
    copyVector4sArray: function (e) {
      const t = this.array;
      let n = 0;
      for (let r = 0, i = e.length; r < i; r++) {
        let i = e[r];
        void 0 === i &&
          (console.warn(
            "THREE.BufferAttribute.copyVector4sArray(): vector is undefined",
            r
          ),
          (i = new Vector4())),
          (t[n++] = i.x),
          (t[n++] = i.y),
          (t[n++] = i.z),
          (t[n++] = i.w);
      }
      return this;
    },
    applyMatrix3: function (e) {
      if (2 === this.itemSize)
        for (let t = 0, n = this.count; t < n; t++)
          _vector2$1.fromBufferAttribute(this, t),
            _vector2$1.applyMatrix3(e),
            this.setXY(t, _vector2$1.x, _vector2$1.y);
      else if (3 === this.itemSize)
        for (let t = 0, n = this.count; t < n; t++)
          _vector$3.fromBufferAttribute(this, t),
            _vector$3.applyMatrix3(e),
            this.setXYZ(t, _vector$3.x, _vector$3.y, _vector$3.z);
      return this;
    },
    applyMatrix4: function (e) {
      for (let t = 0, n = this.count; t < n; t++)
        (_vector$3.x = this.getX(t)),
          (_vector$3.y = this.getY(t)),
          (_vector$3.z = this.getZ(t)),
          _vector$3.applyMatrix4(e),
          this.setXYZ(t, _vector$3.x, _vector$3.y, _vector$3.z);
      return this;
    },
    applyNormalMatrix: function (e) {
      for (let t = 0, n = this.count; t < n; t++)
        (_vector$3.x = this.getX(t)),
          (_vector$3.y = this.getY(t)),
          (_vector$3.z = this.getZ(t)),
          _vector$3.applyNormalMatrix(e),
          this.setXYZ(t, _vector$3.x, _vector$3.y, _vector$3.z);
      return this;
    },
    transformDirection: function (e) {
      for (let t = 0, n = this.count; t < n; t++)
        (_vector$3.x = this.getX(t)),
          (_vector$3.y = this.getY(t)),
          (_vector$3.z = this.getZ(t)),
          _vector$3.transformDirection(e),
          this.setXYZ(t, _vector$3.x, _vector$3.y, _vector$3.z);
      return this;
    },
    set: function (e, t) {
      return void 0 === t && (t = 0), this.array.set(e, t), this;
    },
    getX: function (e) {
      return this.array[e * this.itemSize];
    },
    setX: function (e, t) {
      return (this.array[e * this.itemSize] = t), this;
    },
    getY: function (e) {
      return this.array[e * this.itemSize + 1];
    },
    setY: function (e, t) {
      return (this.array[e * this.itemSize + 1] = t), this;
    },
    getZ: function (e) {
      return this.array[e * this.itemSize + 2];
    },
    setZ: function (e, t) {
      return (this.array[e * this.itemSize + 2] = t), this;
    },
    getW: function (e) {
      return this.array[e * this.itemSize + 3];
    },
    setW: function (e, t) {
      return (this.array[e * this.itemSize + 3] = t), this;
    },
    setXY: function (e, t, n) {
      return (
        (e *= this.itemSize),
        (this.array[e + 0] = t),
        (this.array[e + 1] = n),
        this
      );
    },
    setXYZ: function (e, t, n, r) {
      return (
        (e *= this.itemSize),
        (this.array[e + 0] = t),
        (this.array[e + 1] = n),
        (this.array[e + 2] = r),
        this
      );
    },
    setXYZW: function (e, t, n, r, i) {
      return (
        (e *= this.itemSize),
        (this.array[e + 0] = t),
        (this.array[e + 1] = n),
        (this.array[e + 2] = r),
        (this.array[e + 3] = i),
        this
      );
    },
    onUpload: function (e) {
      return (this.onUploadCallback = e), this;
    },
    clone: function () {
      return new this.constructor(this.array, this.itemSize).copy(this);
    },
    toJSON: function () {
      return {
        itemSize: this.itemSize,
        type: this.array.constructor.name,
        array: Array.prototype.slice.call(this.array),
        normalized: this.normalized
      };
    }
  }),
  (Int8BufferAttribute.prototype = Object.create(BufferAttribute.prototype)),
  (Int8BufferAttribute.prototype.constructor = Int8BufferAttribute),
  (Uint8BufferAttribute.prototype = Object.create(BufferAttribute.prototype)),
  (Uint8BufferAttribute.prototype.constructor = Uint8BufferAttribute),
  (Uint8ClampedBufferAttribute.prototype = Object.create(
    BufferAttribute.prototype
  )),
  (Uint8ClampedBufferAttribute.prototype.constructor =
    Uint8ClampedBufferAttribute),
  (Int16BufferAttribute.prototype = Object.create(BufferAttribute.prototype)),
  (Int16BufferAttribute.prototype.constructor = Int16BufferAttribute),
  (Uint16BufferAttribute.prototype = Object.create(BufferAttribute.prototype)),
  (Uint16BufferAttribute.prototype.constructor = Uint16BufferAttribute),
  (Int32BufferAttribute.prototype = Object.create(BufferAttribute.prototype)),
  (Int32BufferAttribute.prototype.constructor = Int32BufferAttribute),
  (Uint32BufferAttribute.prototype = Object.create(BufferAttribute.prototype)),
  (Uint32BufferAttribute.prototype.constructor = Uint32BufferAttribute),
  (Float32BufferAttribute.prototype = Object.create(BufferAttribute.prototype)),
  (Float32BufferAttribute.prototype.constructor = Float32BufferAttribute),
  (Float64BufferAttribute.prototype = Object.create(BufferAttribute.prototype)),
  (Float64BufferAttribute.prototype.constructor = Float64BufferAttribute);
class DirectGeometry {
  constructor() {
    (this.vertices = []),
      (this.normals = []),
      (this.colors = []),
      (this.uvs = []),
      (this.uvs2 = []),
      (this.groups = []),
      (this.morphTargets = {}),
      (this.skinWeights = []),
      (this.skinIndices = []),
      (this.boundingBox = null),
      (this.boundingSphere = null),
      (this.verticesNeedUpdate = !1),
      (this.normalsNeedUpdate = !1),
      (this.colorsNeedUpdate = !1),
      (this.uvsNeedUpdate = !1),
      (this.groupsNeedUpdate = !1);
  }
  computeGroups(e) {
    const t = [];
    let n,
      r,
      i = void 0;
    const o = e.faces;
    for (r = 0; r < o.length; r++) {
      const e = o[r];
      e.materialIndex !== i &&
        ((i = e.materialIndex),
        void 0 !== n && ((n.count = 3 * r - n.start), t.push(n)),
        (n = { start: 3 * r, materialIndex: i }));
    }
    void 0 !== n && ((n.count = 3 * r - n.start), t.push(n)), (this.groups = t);
  }
  fromGeometry(e) {
    const t = e.faces,
      n = e.vertices,
      r = e.faceVertexUvs,
      i = r[0] && r[0].length > 0,
      o = r[1] && r[1].length > 0,
      a = e.morphTargets,
      s = a.length;
    let c;
    if (s > 0) {
      c = [];
      for (let e = 0; e < s; e++) c[e] = { name: a[e].name, data: [] };
      this.morphTargets.position = c;
    }
    const l = e.morphNormals,
      h = l.length;
    let u;
    if (h > 0) {
      u = [];
      for (let e = 0; e < h; e++) u[e] = { name: l[e].name, data: [] };
      this.morphTargets.normal = u;
    }
    const d = e.skinIndices,
      p = e.skinWeights,
      m = d.length === n.length,
      f = p.length === n.length;
    n.length > 0 &&
      0 === t.length &&
      console.error(
        "THREE.DirectGeometry: Faceless geometries are not supported."
      );
    for (let e = 0; e < t.length; e++) {
      const g = t[e];
      this.vertices.push(n[g.a], n[g.b], n[g.c]);
      const v = g.vertexNormals;
      if (3 === v.length) this.normals.push(v[0], v[1], v[2]);
      else {
        const e = g.normal;
        this.normals.push(e, e, e);
      }
      const y = g.vertexColors;
      if (3 === y.length) this.colors.push(y[0], y[1], y[2]);
      else {
        const e = g.color;
        this.colors.push(e, e, e);
      }
      if (!0 === i) {
        const t = r[0][e];
        void 0 !== t
          ? this.uvs.push(t[0], t[1], t[2])
          : (console.warn(
              "THREE.DirectGeometry.fromGeometry(): Undefined vertexUv ",
              e
            ),
            this.uvs.push(new Vector2(), new Vector2(), new Vector2()));
      }
      if (!0 === o) {
        const t = r[1][e];
        void 0 !== t
          ? this.uvs2.push(t[0], t[1], t[2])
          : (console.warn(
              "THREE.DirectGeometry.fromGeometry(): Undefined vertexUv2 ",
              e
            ),
            this.uvs2.push(new Vector2(), new Vector2(), new Vector2()));
      }
      for (let e = 0; e < s; e++) {
        const t = a[e].vertices;
        c[e].data.push(t[g.a], t[g.b], t[g.c]);
      }
      for (let t = 0; t < h; t++) {
        const n = l[t].vertexNormals[e];
        u[t].data.push(n.a, n.b, n.c);
      }
      m && this.skinIndices.push(d[g.a], d[g.b], d[g.c]),
        f && this.skinWeights.push(p[g.a], p[g.b], p[g.c]);
    }
    return (
      this.computeGroups(e),
      (this.verticesNeedUpdate = e.verticesNeedUpdate),
      (this.normalsNeedUpdate = e.normalsNeedUpdate),
      (this.colorsNeedUpdate = e.colorsNeedUpdate),
      (this.uvsNeedUpdate = e.uvsNeedUpdate),
      (this.groupsNeedUpdate = e.groupsNeedUpdate),
      null !== e.boundingSphere &&
        (this.boundingSphere = e.boundingSphere.clone()),
      null !== e.boundingBox && (this.boundingBox = e.boundingBox.clone()),
      this
    );
  }
}
function arrayMax(e) {
  if (0 === e.length) return -1 / 0;
  let t = e[0];
  for (let n = 1, r = e.length; n < r; ++n) e[n] > t && (t = e[n]);
  return t;
}
let _bufferGeometryId = 1;
const _m1$2 = new Matrix4(),
  _obj = new Object3D(),
  _offset = new Vector3(),
  _box$2 = new Box3(),
  _boxMorphTargets = new Box3(),
  _vector$4 = new Vector3();
function BufferGeometry() {
  Object.defineProperty(this, "id", { value: (_bufferGeometryId += 2) }),
    (this.uuid = MathUtils.generateUUID()),
    (this.name = ""),
    (this.type = "BufferGeometry"),
    (this.index = null),
    (this.attributes = {}),
    (this.morphAttributes = {}),
    (this.morphTargetsRelative = !1),
    (this.groups = []),
    (this.boundingBox = null),
    (this.boundingSphere = null),
    (this.drawRange = { start: 0, count: 1 / 0 }),
    (this.userData = {});
}
BufferGeometry.prototype = Object.assign(
  Object.create(EventDispatcher.prototype),
  {
    constructor: BufferGeometry,
    isBufferGeometry: !0,
    getIndex: function () {
      return this.index;
    },
    setIndex: function (e) {
      return (
        Array.isArray(e)
          ? (this.index = new (
              arrayMax(e) > 65535
                ? Uint32BufferAttribute
                : Uint16BufferAttribute
            )(e, 1))
          : (this.index = e),
        this
      );
    },
    getAttribute: function (e) {
      return this.attributes[e];
    },
    setAttribute: function (e, t) {
      return (this.attributes[e] = t), this;
    },
    deleteAttribute: function (e) {
      return delete this.attributes[e], this;
    },
    addGroup: function (e, t, n) {
      this.groups.push({
        start: e,
        count: t,
        materialIndex: void 0 !== n ? n : 0
      });
    },
    clearGroups: function () {
      this.groups = [];
    },
    setDrawRange: function (e, t) {
      (this.drawRange.start = e), (this.drawRange.count = t);
    },
    applyMatrix4: function (e) {
      const t = this.attributes.position;
      void 0 !== t && (t.applyMatrix4(e), (t.needsUpdate = !0));
      const n = this.attributes.normal;
      if (void 0 !== n) {
        const t = new Matrix3().getNormalMatrix(e);
        n.applyNormalMatrix(t), (n.needsUpdate = !0);
      }
      const r = this.attributes.tangent;
      return (
        void 0 !== r && (r.transformDirection(e), (r.needsUpdate = !0)),
        null !== this.boundingBox && this.computeBoundingBox(),
        null !== this.boundingSphere && this.computeBoundingSphere(),
        this
      );
    },
    rotateX: function (e) {
      return _m1$2.makeRotationX(e), this.applyMatrix4(_m1$2), this;
    },
    rotateY: function (e) {
      return _m1$2.makeRotationY(e), this.applyMatrix4(_m1$2), this;
    },
    rotateZ: function (e) {
      return _m1$2.makeRotationZ(e), this.applyMatrix4(_m1$2), this;
    },
    translate: function (e, t, n) {
      return _m1$2.makeTranslation(e, t, n), this.applyMatrix4(_m1$2), this;
    },
    scale: function (e, t, n) {
      return _m1$2.makeScale(e, t, n), this.applyMatrix4(_m1$2), this;
    },
    lookAt: function (e) {
      return (
        _obj.lookAt(e),
        _obj.updateMatrix(),
        this.applyMatrix4(_obj.matrix),
        this
      );
    },
    center: function () {
      return (
        this.computeBoundingBox(),
        this.boundingBox.getCenter(_offset).negate(),
        this.translate(_offset.x, _offset.y, _offset.z),
        this
      );
    },
    setFromObject: function (e) {
      const t = e.geometry;
      if (e.isPoints || e.isLine) {
        const e = new Float32BufferAttribute(3 * t.vertices.length, 3),
          n = new Float32BufferAttribute(3 * t.colors.length, 3);
        if (
          (this.setAttribute("position", e.copyVector3sArray(t.vertices)),
          this.setAttribute("color", n.copyColorsArray(t.colors)),
          t.lineDistances && t.lineDistances.length === t.vertices.length)
        ) {
          const e = new Float32BufferAttribute(t.lineDistances.length, 1);
          this.setAttribute("lineDistance", e.copyArray(t.lineDistances));
        }
        null !== t.boundingSphere &&
          (this.boundingSphere = t.boundingSphere.clone()),
          null !== t.boundingBox && (this.boundingBox = t.boundingBox.clone());
      } else e.isMesh && t && t.isGeometry && this.fromGeometry(t);
      return this;
    },
    setFromPoints: function (e) {
      const t = [];
      for (let n = 0, r = e.length; n < r; n++) {
        const r = e[n];
        t.push(r.x, r.y, r.z || 0);
      }
      return (
        this.setAttribute("position", new Float32BufferAttribute(t, 3)), this
      );
    },
    updateFromObject: function (e) {
      let t = e.geometry;
      if (e.isMesh) {
        let e = t.__directGeometry;
        if (
          (!0 === t.elementsNeedUpdate &&
            ((e = void 0), (t.elementsNeedUpdate = !1)),
          void 0 === e)
        )
          return this.fromGeometry(t);
        (e.verticesNeedUpdate = t.verticesNeedUpdate),
          (e.normalsNeedUpdate = t.normalsNeedUpdate),
          (e.colorsNeedUpdate = t.colorsNeedUpdate),
          (e.uvsNeedUpdate = t.uvsNeedUpdate),
          (e.groupsNeedUpdate = t.groupsNeedUpdate),
          (t.verticesNeedUpdate = !1),
          (t.normalsNeedUpdate = !1),
          (t.colorsNeedUpdate = !1),
          (t.uvsNeedUpdate = !1),
          (t.groupsNeedUpdate = !1),
          (t = e);
      }
      if (!0 === t.verticesNeedUpdate) {
        const e = this.attributes.position;
        void 0 !== e && (e.copyVector3sArray(t.vertices), (e.needsUpdate = !0)),
          (t.verticesNeedUpdate = !1);
      }
      if (!0 === t.normalsNeedUpdate) {
        const e = this.attributes.normal;
        void 0 !== e && (e.copyVector3sArray(t.normals), (e.needsUpdate = !0)),
          (t.normalsNeedUpdate = !1);
      }
      if (!0 === t.colorsNeedUpdate) {
        const e = this.attributes.color;
        void 0 !== e && (e.copyColorsArray(t.colors), (e.needsUpdate = !0)),
          (t.colorsNeedUpdate = !1);
      }
      if (t.uvsNeedUpdate) {
        const e = this.attributes.uv;
        void 0 !== e && (e.copyVector2sArray(t.uvs), (e.needsUpdate = !0)),
          (t.uvsNeedUpdate = !1);
      }
      if (t.lineDistancesNeedUpdate) {
        const e = this.attributes.lineDistance;
        void 0 !== e && (e.copyArray(t.lineDistances), (e.needsUpdate = !0)),
          (t.lineDistancesNeedUpdate = !1);
      }
      return (
        t.groupsNeedUpdate &&
          (t.computeGroups(e.geometry),
          (this.groups = t.groups),
          (t.groupsNeedUpdate = !1)),
        this
      );
    },
    fromGeometry: function (e) {
      return (
        (e.__directGeometry = new DirectGeometry().fromGeometry(e)),
        this.fromDirectGeometry(e.__directGeometry)
      );
    },
    fromDirectGeometry: function (e) {
      const t = new Float32Array(3 * e.vertices.length);
      if (
        (this.setAttribute(
          "position",
          new BufferAttribute(t, 3).copyVector3sArray(e.vertices)
        ),
        e.normals.length > 0)
      ) {
        const t = new Float32Array(3 * e.normals.length);
        this.setAttribute(
          "normal",
          new BufferAttribute(t, 3).copyVector3sArray(e.normals)
        );
      }
      if (e.colors.length > 0) {
        const t = new Float32Array(3 * e.colors.length);
        this.setAttribute(
          "color",
          new BufferAttribute(t, 3).copyColorsArray(e.colors)
        );
      }
      if (e.uvs.length > 0) {
        const t = new Float32Array(2 * e.uvs.length);
        this.setAttribute(
          "uv",
          new BufferAttribute(t, 2).copyVector2sArray(e.uvs)
        );
      }
      if (e.uvs2.length > 0) {
        const t = new Float32Array(2 * e.uvs2.length);
        this.setAttribute(
          "uv2",
          new BufferAttribute(t, 2).copyVector2sArray(e.uvs2)
        );
      }
      this.groups = e.groups;
      for (const t in e.morphTargets) {
        const n = [],
          r = e.morphTargets[t];
        for (let e = 0, t = r.length; e < t; e++) {
          const t = r[e],
            i = new Float32BufferAttribute(3 * t.data.length, 3);
          (i.name = t.name), n.push(i.copyVector3sArray(t.data));
        }
        this.morphAttributes[t] = n;
      }
      if (e.skinIndices.length > 0) {
        const t = new Float32BufferAttribute(4 * e.skinIndices.length, 4);
        this.setAttribute("skinIndex", t.copyVector4sArray(e.skinIndices));
      }
      if (e.skinWeights.length > 0) {
        const t = new Float32BufferAttribute(4 * e.skinWeights.length, 4);
        this.setAttribute("skinWeight", t.copyVector4sArray(e.skinWeights));
      }
      return (
        null !== e.boundingSphere &&
          (this.boundingSphere = e.boundingSphere.clone()),
        null !== e.boundingBox && (this.boundingBox = e.boundingBox.clone()),
        this
      );
    },
    computeBoundingBox: function () {
      null === this.boundingBox && (this.boundingBox = new Box3());
      const e = this.attributes.position,
        t = this.morphAttributes.position;
      if (e && e.isGLBufferAttribute)
        return (
          console.error(
            'THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',
            this
          ),
          void this.boundingBox.set(
            new Vector3(-1 / 0, -1 / 0, -1 / 0),
            new Vector3(1 / 0, 1 / 0, 1 / 0)
          )
        );
      if (void 0 !== e) {
        if ((this.boundingBox.setFromBufferAttribute(e), t))
          for (let e = 0, n = t.length; e < n; e++) {
            const n = t[e];
            _box$2.setFromBufferAttribute(n),
              this.morphTargetsRelative
                ? (_vector$4.addVectors(this.boundingBox.min, _box$2.min),
                  this.boundingBox.expandByPoint(_vector$4),
                  _vector$4.addVectors(this.boundingBox.max, _box$2.max),
                  this.boundingBox.expandByPoint(_vector$4))
                : (this.boundingBox.expandByPoint(_box$2.min),
                  this.boundingBox.expandByPoint(_box$2.max));
          }
      } else this.boundingBox.makeEmpty();
      (isNaN(this.boundingBox.min.x) ||
        isNaN(this.boundingBox.min.y) ||
        isNaN(this.boundingBox.min.z)) &&
        console.error(
          'THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',
          this
        );
    },
    computeBoundingSphere: function () {
      null === this.boundingSphere && (this.boundingSphere = new Sphere());
      const e = this.attributes.position,
        t = this.morphAttributes.position;
      if (e && e.isGLBufferAttribute)
        return (
          console.error(
            'THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',
            this
          ),
          void this.boundingSphere.set(new Vector3(), 1 / 0)
        );
      if (e) {
        const n = this.boundingSphere.center;
        if ((_box$2.setFromBufferAttribute(e), t))
          for (let e = 0, n = t.length; e < n; e++) {
            const n = t[e];
            _boxMorphTargets.setFromBufferAttribute(n),
              this.morphTargetsRelative
                ? (_vector$4.addVectors(_box$2.min, _boxMorphTargets.min),
                  _box$2.expandByPoint(_vector$4),
                  _vector$4.addVectors(_box$2.max, _boxMorphTargets.max),
                  _box$2.expandByPoint(_vector$4))
                : (_box$2.expandByPoint(_boxMorphTargets.min),
                  _box$2.expandByPoint(_boxMorphTargets.max));
          }
        _box$2.getCenter(n);
        let r = 0;
        for (let t = 0, i = e.count; t < i; t++)
          _vector$4.fromBufferAttribute(e, t),
            (r = Math.max(r, n.distanceToSquared(_vector$4)));
        if (t)
          for (let i = 0, o = t.length; i < o; i++) {
            const o = t[i],
              a = this.morphTargetsRelative;
            for (let t = 0, i = o.count; t < i; t++)
              _vector$4.fromBufferAttribute(o, t),
                a &&
                  (_offset.fromBufferAttribute(e, t), _vector$4.add(_offset)),
                (r = Math.max(r, n.distanceToSquared(_vector$4)));
          }
        (this.boundingSphere.radius = Math.sqrt(r)),
          isNaN(this.boundingSphere.radius) &&
            console.error(
              'THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',
              this
            );
      }
    },
    computeFaceNormals: function () {},
    computeVertexNormals: function () {
      const e = this.index,
        t = this.getAttribute("position");
      if (void 0 !== t) {
        let n = this.getAttribute("normal");
        if (void 0 === n)
          (n = new BufferAttribute(new Float32Array(3 * t.count), 3)),
            this.setAttribute("normal", n);
        else for (let e = 0, t = n.count; e < t; e++) n.setXYZ(e, 0, 0, 0);
        const r = new Vector3(),
          i = new Vector3(),
          o = new Vector3(),
          a = new Vector3(),
          s = new Vector3(),
          c = new Vector3(),
          l = new Vector3(),
          h = new Vector3();
        if (e)
          for (let u = 0, d = e.count; u < d; u += 3) {
            const d = e.getX(u + 0),
              p = e.getX(u + 1),
              m = e.getX(u + 2);
            r.fromBufferAttribute(t, d),
              i.fromBufferAttribute(t, p),
              o.fromBufferAttribute(t, m),
              l.subVectors(o, i),
              h.subVectors(r, i),
              l.cross(h),
              a.fromBufferAttribute(n, d),
              s.fromBufferAttribute(n, p),
              c.fromBufferAttribute(n, m),
              a.add(l),
              s.add(l),
              c.add(l),
              n.setXYZ(d, a.x, a.y, a.z),
              n.setXYZ(p, s.x, s.y, s.z),
              n.setXYZ(m, c.x, c.y, c.z);
          }
        else
          for (let e = 0, a = t.count; e < a; e += 3)
            r.fromBufferAttribute(t, e + 0),
              i.fromBufferAttribute(t, e + 1),
              o.fromBufferAttribute(t, e + 2),
              l.subVectors(o, i),
              h.subVectors(r, i),
              l.cross(h),
              n.setXYZ(e + 0, l.x, l.y, l.z),
              n.setXYZ(e + 1, l.x, l.y, l.z),
              n.setXYZ(e + 2, l.x, l.y, l.z);
        this.normalizeNormals(), (n.needsUpdate = !0);
      }
    },
    merge: function (e, t) {
      if (!e || !e.isBufferGeometry)
        return void console.error(
          "THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.",
          e
        );
      void 0 === t &&
        ((t = 0),
        console.warn(
          "THREE.BufferGeometry.merge(): Overwriting original geometry, starting at offset=0. Use BufferGeometryUtils.mergeBufferGeometries() for lossless merge."
        ));
      const n = this.attributes;
      for (const r in n) {
        if (void 0 === e.attributes[r]) continue;
        const i = n[r].array,
          o = e.attributes[r],
          a = o.array,
          s = o.itemSize * t,
          c = Math.min(a.length, i.length - s);
        for (let e = 0, t = s; e < c; e++, t++) i[t] = a[e];
      }
      return this;
    },
    normalizeNormals: function () {
      const e = this.attributes.normal;
      for (let t = 0, n = e.count; t < n; t++)
        _vector$4.fromBufferAttribute(e, t),
          _vector$4.normalize(),
          e.setXYZ(t, _vector$4.x, _vector$4.y, _vector$4.z);
    },
    toNonIndexed: function () {
      function e(e, t) {
        const n = e.array,
          r = e.itemSize,
          i = e.normalized,
          o = new n.constructor(t.length * r);
        let a = 0,
          s = 0;
        for (let e = 0, i = t.length; e < i; e++) {
          a = t[e] * r;
          for (let e = 0; e < r; e++) o[s++] = n[a++];
        }
        return new BufferAttribute(o, r, i);
      }
      if (null === this.index)
        return (
          console.warn(
            "THREE.BufferGeometry.toNonIndexed(): Geometry is already non-indexed."
          ),
          this
        );
      const t = new BufferGeometry(),
        n = this.index.array,
        r = this.attributes;
      for (const i in r) {
        const o = e(r[i], n);
        t.setAttribute(i, o);
      }
      const i = this.morphAttributes;
      for (const r in i) {
        const o = [],
          a = i[r];
        for (let t = 0, r = a.length; t < r; t++) {
          const r = e(a[t], n);
          o.push(r);
        }
        t.morphAttributes[r] = o;
      }
      t.morphTargetsRelative = this.morphTargetsRelative;
      const o = this.groups;
      for (let e = 0, n = o.length; e < n; e++) {
        const n = o[e];
        t.addGroup(n.start, n.count, n.materialIndex);
      }
      return t;
    },
    toJSON: function () {
      const e = {
        metadata: {
          version: 4.5,
          type: "BufferGeometry",
          generator: "BufferGeometry.toJSON"
        }
      };
      if (
        ((e.uuid = this.uuid),
        (e.type = this.type),
        "" !== this.name && (e.name = this.name),
        Object.keys(this.userData).length > 0 && (e.userData = this.userData),
        void 0 !== this.parameters)
      ) {
        const t = this.parameters;
        for (const n in t) void 0 !== t[n] && (e[n] = t[n]);
        return e;
      }
      e.data = { attributes: {} };
      const t = this.index;
      null !== t &&
        (e.data.index = {
          type: t.array.constructor.name,
          array: Array.prototype.slice.call(t.array)
        });
      const n = this.attributes;
      for (const t in n) {
        const r = n[t],
          i = r.toJSON(e.data);
        "" !== r.name && (i.name = r.name), (e.data.attributes[t] = i);
      }
      const r = {};
      let i = !1;
      for (const t in this.morphAttributes) {
        const n = this.morphAttributes[t],
          o = [];
        for (let t = 0, r = n.length; t < r; t++) {
          const r = n[t],
            i = r.toJSON(e.data);
          "" !== r.name && (i.name = r.name), o.push(i);
        }
        o.length > 0 && ((r[t] = o), (i = !0));
      }
      i &&
        ((e.data.morphAttributes = r),
        (e.data.morphTargetsRelative = this.morphTargetsRelative));
      const o = this.groups;
      o.length > 0 && (e.data.groups = JSON.parse(JSON.stringify(o)));
      const a = this.boundingSphere;
      return (
        null !== a &&
          (e.data.boundingSphere = {
            center: a.center.toArray(),
            radius: a.radius
          }),
        e
      );
    },
    clone: function () {
      return new BufferGeometry().copy(this);
    },
    copy: function (e) {
      (this.index = null),
        (this.attributes = {}),
        (this.morphAttributes = {}),
        (this.groups = []),
        (this.boundingBox = null),
        (this.boundingSphere = null);
      const t = {};
      this.name = e.name;
      const n = e.index;
      null !== n && this.setIndex(n.clone(t));
      const r = e.attributes;
      for (const e in r) {
        const n = r[e];
        this.setAttribute(e, n.clone(t));
      }
      const i = e.morphAttributes;
      for (const e in i) {
        const n = [],
          r = i[e];
        for (let e = 0, i = r.length; e < i; e++) n.push(r[e].clone(t));
        this.morphAttributes[e] = n;
      }
      this.morphTargetsRelative = e.morphTargetsRelative;
      const o = e.groups;
      for (let e = 0, t = o.length; e < t; e++) {
        const t = o[e];
        this.addGroup(t.start, t.count, t.materialIndex);
      }
      const a = e.boundingBox;
      null !== a && (this.boundingBox = a.clone());
      const s = e.boundingSphere;
      return (
        null !== s && (this.boundingSphere = s.clone()),
        (this.drawRange.start = e.drawRange.start),
        (this.drawRange.count = e.drawRange.count),
        (this.userData = e.userData),
        this
      );
    },
    dispose: function () {
      this.dispatchEvent({ type: "dispose" });
    }
  }
);
const _inverseMatrix = new Matrix4(),
  _ray = new Ray(),
  _sphere = new Sphere(),
  _vA = new Vector3(),
  _vB = new Vector3(),
  _vC = new Vector3(),
  _tempA = new Vector3(),
  _tempB = new Vector3(),
  _tempC = new Vector3(),
  _morphA = new Vector3(),
  _morphB = new Vector3(),
  _morphC = new Vector3(),
  _uvA = new Vector2(),
  _uvB = new Vector2(),
  _uvC = new Vector2(),
  _intersectionPoint = new Vector3(),
  _intersectionPointWorld = new Vector3();
function Mesh(e, t) {
  Object3D.call(this),
    (this.type = "Mesh"),
    (this.geometry = void 0 !== e ? e : new BufferGeometry()),
    (this.material = void 0 !== t ? t : new MeshBasicMaterial()),
    this.updateMorphTargets();
}
function checkIntersection(e, t, n, r, i, o, a, s) {
  let c;
  if (
    null ===
    (c =
      t.side === BackSide
        ? r.intersectTriangle(a, o, i, !0, s)
        : r.intersectTriangle(i, o, a, t.side !== DoubleSide, s))
  )
    return null;
  _intersectionPointWorld.copy(s),
    _intersectionPointWorld.applyMatrix4(e.matrixWorld);
  const l = n.ray.origin.distanceTo(_intersectionPointWorld);
  return l < n.near || l > n.far
    ? null
    : { distance: l, point: _intersectionPointWorld.clone(), object: e };
}
function checkBufferGeometryIntersection(e, t, n, r, i, o, a, s, c, l, h, u) {
  _vA.fromBufferAttribute(i, l),
    _vB.fromBufferAttribute(i, h),
    _vC.fromBufferAttribute(i, u);
  const d = e.morphTargetInfluences;
  if (t.morphTargets && o && d) {
    _morphA.set(0, 0, 0), _morphB.set(0, 0, 0), _morphC.set(0, 0, 0);
    for (let e = 0, t = o.length; e < t; e++) {
      const t = d[e],
        n = o[e];
      0 !== t &&
        (_tempA.fromBufferAttribute(n, l),
        _tempB.fromBufferAttribute(n, h),
        _tempC.fromBufferAttribute(n, u),
        a
          ? (_morphA.addScaledVector(_tempA, t),
            _morphB.addScaledVector(_tempB, t),
            _morphC.addScaledVector(_tempC, t))
          : (_morphA.addScaledVector(_tempA.sub(_vA), t),
            _morphB.addScaledVector(_tempB.sub(_vB), t),
            _morphC.addScaledVector(_tempC.sub(_vC), t)));
    }
    _vA.add(_morphA), _vB.add(_morphB), _vC.add(_morphC);
  }
  e.isSkinnedMesh &&
    (e.boneTransform(l, _vA), e.boneTransform(h, _vB), e.boneTransform(u, _vC));
  const p = checkIntersection(e, t, n, r, _vA, _vB, _vC, _intersectionPoint);
  if (p) {
    s &&
      (_uvA.fromBufferAttribute(s, l),
      _uvB.fromBufferAttribute(s, h),
      _uvC.fromBufferAttribute(s, u),
      (p.uv = Triangle.getUV(
        _intersectionPoint,
        _vA,
        _vB,
        _vC,
        _uvA,
        _uvB,
        _uvC,
        new Vector2()
      ))),
      c &&
        (_uvA.fromBufferAttribute(c, l),
        _uvB.fromBufferAttribute(c, h),
        _uvC.fromBufferAttribute(c, u),
        (p.uv2 = Triangle.getUV(
          _intersectionPoint,
          _vA,
          _vB,
          _vC,
          _uvA,
          _uvB,
          _uvC,
          new Vector2()
        )));
    const e = new Face3(l, h, u);
    Triangle.getNormal(_vA, _vB, _vC, e.normal), (p.face = e);
  }
  return p;
}
Mesh.prototype = Object.assign(Object.create(Object3D.prototype), {
  constructor: Mesh,
  isMesh: !0,
  copy: function (e) {
    return (
      Object3D.prototype.copy.call(this, e),
      void 0 !== e.morphTargetInfluences &&
        (this.morphTargetInfluences = e.morphTargetInfluences.slice()),
      void 0 !== e.morphTargetDictionary &&
        (this.morphTargetDictionary = Object.assign(
          {},
          e.morphTargetDictionary
        )),
      (this.material = e.material),
      (this.geometry = e.geometry),
      this
    );
  },
  updateMorphTargets: function () {
    const e = this.geometry;
    if (e.isBufferGeometry) {
      const t = e.morphAttributes,
        n = Object.keys(t);
      if (n.length > 0) {
        const e = t[n[0]];
        if (void 0 !== e) {
          (this.morphTargetInfluences = []), (this.morphTargetDictionary = {});
          for (let t = 0, n = e.length; t < n; t++) {
            const n = e[t].name || String(t);
            this.morphTargetInfluences.push(0),
              (this.morphTargetDictionary[n] = t);
          }
        }
      }
    } else {
      const t = e.morphTargets;
      void 0 !== t &&
        t.length > 0 &&
        console.error(
          "THREE.Mesh.updateMorphTargets() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead."
        );
    }
  },
  raycast: function (e, t) {
    const n = this.geometry,
      r = this.material,
      i = this.matrixWorld;
    if (void 0 === r) return;
    if (
      (null === n.boundingSphere && n.computeBoundingSphere(),
      _sphere.copy(n.boundingSphere),
      _sphere.applyMatrix4(i),
      !1 === e.ray.intersectsSphere(_sphere))
    )
      return;
    if (
      (_inverseMatrix.getInverse(i),
      _ray.copy(e.ray).applyMatrix4(_inverseMatrix),
      null !== n.boundingBox && !1 === _ray.intersectsBox(n.boundingBox))
    )
      return;
    let o;
    if (n.isBufferGeometry) {
      const i = n.index,
        a = n.attributes.position,
        s = n.morphAttributes.position,
        c = n.morphTargetsRelative,
        l = n.attributes.uv,
        h = n.attributes.uv2,
        u = n.groups,
        d = n.drawRange;
      if (null !== i)
        if (Array.isArray(r))
          for (let n = 0, p = u.length; n < p; n++) {
            const p = u[n],
              m = r[p.materialIndex];
            for (
              let n = Math.max(p.start, d.start),
                r = Math.min(p.start + p.count, d.start + d.count);
              n < r;
              n += 3
            ) {
              const r = i.getX(n),
                u = i.getX(n + 1),
                d = i.getX(n + 2);
              (o = checkBufferGeometryIntersection(
                this,
                m,
                e,
                _ray,
                a,
                s,
                c,
                l,
                h,
                r,
                u,
                d
              )) &&
                ((o.faceIndex = Math.floor(n / 3)),
                (o.face.materialIndex = p.materialIndex),
                t.push(o));
            }
          }
        else {
          for (
            let n = Math.max(0, d.start),
              u = Math.min(i.count, d.start + d.count);
            n < u;
            n += 3
          ) {
            const u = i.getX(n),
              d = i.getX(n + 1),
              p = i.getX(n + 2);
            (o = checkBufferGeometryIntersection(
              this,
              r,
              e,
              _ray,
              a,
              s,
              c,
              l,
              h,
              u,
              d,
              p
            )) && ((o.faceIndex = Math.floor(n / 3)), t.push(o));
          }
        }
      else if (void 0 !== a)
        if (Array.isArray(r))
          for (let n = 0, i = u.length; n < i; n++) {
            const i = u[n],
              p = r[i.materialIndex];
            for (
              let n = Math.max(i.start, d.start),
                r = Math.min(i.start + i.count, d.start + d.count);
              n < r;
              n += 3
            ) {
              (o = checkBufferGeometryIntersection(
                this,
                p,
                e,
                _ray,
                a,
                s,
                c,
                l,
                h,
                n,
                n + 1,
                n + 2
              )) &&
                ((o.faceIndex = Math.floor(n / 3)),
                (o.face.materialIndex = i.materialIndex),
                t.push(o));
            }
          }
        else {
          for (
            let n = Math.max(0, d.start),
              i = Math.min(a.count, d.start + d.count);
            n < i;
            n += 3
          ) {
            (o = checkBufferGeometryIntersection(
              this,
              r,
              e,
              _ray,
              a,
              s,
              c,
              l,
              h,
              n,
              n + 1,
              n + 2
            )) && ((o.faceIndex = Math.floor(n / 3)), t.push(o));
          }
        }
    } else if (n.isGeometry) {
      const i = Array.isArray(r),
        a = n.vertices,
        s = n.faces;
      let c;
      const l = n.faceVertexUvs[0];
      l.length > 0 && (c = l);
      for (let n = 0, l = s.length; n < l; n++) {
        const l = s[n],
          h = i ? r[l.materialIndex] : r;
        if (void 0 === h) continue;
        const u = a[l.a],
          d = a[l.b],
          p = a[l.c];
        if (
          (o = checkIntersection(this, h, e, _ray, u, d, p, _intersectionPoint))
        ) {
          if (c && c[n]) {
            const e = c[n];
            _uvA.copy(e[0]),
              _uvB.copy(e[1]),
              _uvC.copy(e[2]),
              (o.uv = Triangle.getUV(
                _intersectionPoint,
                u,
                d,
                p,
                _uvA,
                _uvB,
                _uvC,
                new Vector2()
              ));
          }
          (o.face = l), (o.faceIndex = n), t.push(o);
        }
      }
    }
  }
});
class BoxBufferGeometry extends BufferGeometry {
  constructor(e = 1, t = 1, n = 1, r = 1, i = 1, o = 1) {
    super(),
      (this.type = "BoxBufferGeometry"),
      (this.parameters = {
        width: e,
        height: t,
        depth: n,
        widthSegments: r,
        heightSegments: i,
        depthSegments: o
      });
    const a = this;
    (r = Math.floor(r)), (i = Math.floor(i)), (o = Math.floor(o));
    const s = [],
      c = [],
      l = [],
      h = [];
    let u = 0,
      d = 0;
    function p(e, t, n, r, i, o, p, m, f, g, v) {
      const y = o / f,
        _ = p / g,
        x = o / 2,
        b = p / 2,
        M = m / 2,
        w = f + 1,
        S = g + 1;
      let T = 0,
        E = 0;
      const A = new Vector3();
      for (let o = 0; o < S; o++) {
        const a = o * _ - b;
        for (let s = 0; s < w; s++) {
          const u = s * y - x;
          (A[e] = u * r),
            (A[t] = a * i),
            (A[n] = M),
            c.push(A.x, A.y, A.z),
            (A[e] = 0),
            (A[t] = 0),
            (A[n] = m > 0 ? 1 : -1),
            l.push(A.x, A.y, A.z),
            h.push(s / f),
            h.push(1 - o / g),
            (T += 1);
        }
      }
      for (let e = 0; e < g; e++)
        for (let t = 0; t < f; t++) {
          const n = u + t + w * e,
            r = u + t + w * (e + 1),
            i = u + (t + 1) + w * (e + 1),
            o = u + (t + 1) + w * e;
          s.push(n, r, o), s.push(r, i, o), (E += 6);
        }
      a.addGroup(d, E, v), (d += E), (u += T);
    }
    p("z", "y", "x", -1, -1, n, t, e, o, i, 0),
      p("z", "y", "x", 1, -1, n, t, -e, o, i, 1),
      p("x", "z", "y", 1, 1, e, n, t, r, o, 2),
      p("x", "z", "y", 1, -1, e, n, -t, r, o, 3),
      p("x", "y", "z", 1, -1, e, t, n, r, i, 4),
      p("x", "y", "z", -1, -1, e, t, -n, r, i, 5),
      this.setIndex(s),
      this.setAttribute("position", new Float32BufferAttribute(c, 3)),
      this.setAttribute("normal", new Float32BufferAttribute(l, 3)),
      this.setAttribute("uv", new Float32BufferAttribute(h, 2));
  }
}
function cloneUniforms(e) {
  const t = {};
  for (const n in e) {
    t[n] = {};
    for (const r in e[n]) {
      const i = e[n][r];
      i &&
      (i.isColor ||
        i.isMatrix3 ||
        i.isMatrix4 ||
        i.isVector2 ||
        i.isVector3 ||
        i.isVector4 ||
        i.isTexture)
        ? (t[n][r] = i.clone())
        : Array.isArray(i)
        ? (t[n][r] = i.slice())
        : (t[n][r] = i);
    }
  }
  return t;
}
function mergeUniforms(e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const r = cloneUniforms(e[n]);
    for (const e in r) t[e] = r[e];
  }
  return t;
}
const UniformsUtils = { clone: cloneUniforms, merge: mergeUniforms };
var default_vertex =
    "void main() {\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
  default_fragment =
    "void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}";
function ShaderMaterial(e) {
  Material.call(this),
    (this.type = "ShaderMaterial"),
    (this.defines = {}),
    (this.uniforms = {}),
    (this.vertexShader = default_vertex),
    (this.fragmentShader = default_fragment),
    (this.linewidth = 1),
    (this.wireframe = !1),
    (this.wireframeLinewidth = 1),
    (this.fog = !1),
    (this.lights = !1),
    (this.clipping = !1),
    (this.skinning = !1),
    (this.morphTargets = !1),
    (this.morphNormals = !1),
    (this.extensions = {
      derivatives: !1,
      fragDepth: !1,
      drawBuffers: !1,
      shaderTextureLOD: !1
    }),
    (this.defaultAttributeValues = {
      color: [1, 1, 1],
      uv: [0, 0],
      uv2: [0, 0]
    }),
    (this.index0AttributeName = void 0),
    (this.uniformsNeedUpdate = !1),
    (this.glslVersion = null),
    void 0 !== e &&
      (void 0 !== e.attributes &&
        console.error(
          "THREE.ShaderMaterial: attributes should now be defined in THREE.BufferGeometry instead."
        ),
      this.setValues(e));
}
function Camera() {
  Object3D.call(this),
    (this.type = "Camera"),
    (this.matrixWorldInverse = new Matrix4()),
    (this.projectionMatrix = new Matrix4()),
    (this.projectionMatrixInverse = new Matrix4());
}
function PerspectiveCamera(e, t, n, r) {
  Camera.call(this),
    (this.type = "PerspectiveCamera"),
    (this.fov = void 0 !== e ? e : 50),
    (this.zoom = 1),
    (this.near = void 0 !== n ? n : 0.1),
    (this.far = void 0 !== r ? r : 2e3),
    (this.focus = 10),
    (this.aspect = void 0 !== t ? t : 1),
    (this.view = null),
    (this.filmGauge = 35),
    (this.filmOffset = 0),
    this.updateProjectionMatrix();
}
(ShaderMaterial.prototype = Object.create(Material.prototype)),
  (ShaderMaterial.prototype.constructor = ShaderMaterial),
  (ShaderMaterial.prototype.isShaderMaterial = !0),
  (ShaderMaterial.prototype.copy = function (e) {
    return (
      Material.prototype.copy.call(this, e),
      (this.fragmentShader = e.fragmentShader),
      (this.vertexShader = e.vertexShader),
      (this.uniforms = cloneUniforms(e.uniforms)),
      (this.defines = Object.assign({}, e.defines)),
      (this.wireframe = e.wireframe),
      (this.wireframeLinewidth = e.wireframeLinewidth),
      (this.lights = e.lights),
      (this.clipping = e.clipping),
      (this.skinning = e.skinning),
      (this.morphTargets = e.morphTargets),
      (this.morphNormals = e.morphNormals),
      (this.extensions = Object.assign({}, e.extensions)),
      (this.glslVersion = e.glslVersion),
      this
    );
  }),
  (ShaderMaterial.prototype.toJSON = function (e) {
    const t = Material.prototype.toJSON.call(this, e);
    (t.glslVersion = this.glslVersion), (t.uniforms = {});
    for (const n in this.uniforms) {
      const r = this.uniforms[n].value;
      r && r.isTexture
        ? (t.uniforms[n] = { type: "t", value: r.toJSON(e).uuid })
        : r && r.isColor
        ? (t.uniforms[n] = { type: "c", value: r.getHex() })
        : r && r.isVector2
        ? (t.uniforms[n] = { type: "v2", value: r.toArray() })
        : r && r.isVector3
        ? (t.uniforms[n] = { type: "v3", value: r.toArray() })
        : r && r.isVector4
        ? (t.uniforms[n] = { type: "v4", value: r.toArray() })
        : r && r.isMatrix3
        ? (t.uniforms[n] = { type: "m3", value: r.toArray() })
        : r && r.isMatrix4
        ? (t.uniforms[n] = { type: "m4", value: r.toArray() })
        : (t.uniforms[n] = { value: r });
    }
    Object.keys(this.defines).length > 0 && (t.defines = this.defines),
      (t.vertexShader = this.vertexShader),
      (t.fragmentShader = this.fragmentShader);
    const n = {};
    for (const e in this.extensions) !0 === this.extensions[e] && (n[e] = !0);
    return Object.keys(n).length > 0 && (t.extensions = n), t;
  }),
  (Camera.prototype = Object.assign(Object.create(Object3D.prototype), {
    constructor: Camera,
    isCamera: !0,
    copy: function (e, t) {
      return (
        Object3D.prototype.copy.call(this, e, t),
        this.matrixWorldInverse.copy(e.matrixWorldInverse),
        this.projectionMatrix.copy(e.projectionMatrix),
        this.projectionMatrixInverse.copy(e.projectionMatrixInverse),
        this
      );
    },
    getWorldDirection: function (e) {
      void 0 === e &&
        (console.warn(
          "THREE.Camera: .getWorldDirection() target is now required"
        ),
        (e = new Vector3())),
        this.updateMatrixWorld(!0);
      const t = this.matrixWorld.elements;
      return e.set(-t[8], -t[9], -t[10]).normalize();
    },
    updateMatrixWorld: function (e) {
      Object3D.prototype.updateMatrixWorld.call(this, e),
        this.matrixWorldInverse.getInverse(this.matrixWorld);
    },
    updateWorldMatrix: function (e, t) {
      Object3D.prototype.updateWorldMatrix.call(this, e, t),
        this.matrixWorldInverse.getInverse(this.matrixWorld);
    },
    clone: function () {
      return new this.constructor().copy(this);
    }
  })),
  (PerspectiveCamera.prototype = Object.assign(
    Object.create(Camera.prototype),
    {
      constructor: PerspectiveCamera,
      isPerspectiveCamera: !0,
      copy: function (e, t) {
        return (
          Camera.prototype.copy.call(this, e, t),
          (this.fov = e.fov),
          (this.zoom = e.zoom),
          (this.near = e.near),
          (this.far = e.far),
          (this.focus = e.focus),
          (this.aspect = e.aspect),
          (this.view = null === e.view ? null : Object.assign({}, e.view)),
          (this.filmGauge = e.filmGauge),
          (this.filmOffset = e.filmOffset),
          this
        );
      },
      setFocalLength: function (e) {
        const t = (0.5 * this.getFilmHeight()) / e;
        (this.fov = 2 * MathUtils.RAD2DEG * Math.atan(t)),
          this.updateProjectionMatrix();
      },
      getFocalLength: function () {
        const e = Math.tan(0.5 * MathUtils.DEG2RAD * this.fov);
        return (0.5 * this.getFilmHeight()) / e;
      },
      getEffectiveFOV: function () {
        return (
          2 *
          MathUtils.RAD2DEG *
          Math.atan(Math.tan(0.5 * MathUtils.DEG2RAD * this.fov) / this.zoom)
        );
      },
      getFilmWidth: function () {
        return this.filmGauge * Math.min(this.aspect, 1);
      },
      getFilmHeight: function () {
        return this.filmGauge / Math.max(this.aspect, 1);
      },
      setViewOffset: function (e, t, n, r, i, o) {
        (this.aspect = e / t),
          null === this.view &&
            (this.view = {
              enabled: !0,
              fullWidth: 1,
              fullHeight: 1,
              offsetX: 0,
              offsetY: 0,
              width: 1,
              height: 1
            }),
          (this.view.enabled = !0),
          (this.view.fullWidth = e),
          (this.view.fullHeight = t),
          (this.view.offsetX = n),
          (this.view.offsetY = r),
          (this.view.width = i),
          (this.view.height = o),
          this.updateProjectionMatrix();
      },
      clearViewOffset: function () {
        null !== this.view && (this.view.enabled = !1),
          this.updateProjectionMatrix();
      },
      updateProjectionMatrix: function () {
        const e = this.near;
        let t = (e * Math.tan(0.5 * MathUtils.DEG2RAD * this.fov)) / this.zoom,
          n = 2 * t,
          r = this.aspect * n,
          i = -0.5 * r;
        const o = this.view;
        if (null !== this.view && this.view.enabled) {
          const e = o.fullWidth,
            a = o.fullHeight;
          (i += (o.offsetX * r) / e),
            (t -= (o.offsetY * n) / a),
            (r *= o.width / e),
            (n *= o.height / a);
        }
        const a = this.filmOffset;
        0 !== a && (i += (e * a) / this.getFilmWidth()),
          this.projectionMatrix.makePerspective(
            i,
            i + r,
            t,
            t - n,
            e,
            this.far
          ),
          this.projectionMatrixInverse.getInverse(this.projectionMatrix);
      },
      toJSON: function (e) {
        const t = Object3D.prototype.toJSON.call(this, e);
        return (
          (t.object.fov = this.fov),
          (t.object.zoom = this.zoom),
          (t.object.near = this.near),
          (t.object.far = this.far),
          (t.object.focus = this.focus),
          (t.object.aspect = this.aspect),
          null !== this.view && (t.object.view = Object.assign({}, this.view)),
          (t.object.filmGauge = this.filmGauge),
          (t.object.filmOffset = this.filmOffset),
          t
        );
      }
    }
  ));
const fov = 90,
  aspect = 1;
function CubeCamera(e, t, n) {
  if (
    (Object3D.call(this),
    (this.type = "CubeCamera"),
    !0 !== n.isWebGLCubeRenderTarget)
  )
    return void console.error(
      "THREE.CubeCamera: The constructor now expects an instance of WebGLCubeRenderTarget as third parameter."
    );
  this.renderTarget = n;
  const r = new PerspectiveCamera(fov, aspect, e, t);
  (r.layers = this.layers),
    r.up.set(0, -1, 0),
    r.lookAt(new Vector3(1, 0, 0)),
    this.add(r);
  const i = new PerspectiveCamera(fov, aspect, e, t);
  (i.layers = this.layers),
    i.up.set(0, -1, 0),
    i.lookAt(new Vector3(-1, 0, 0)),
    this.add(i);
  const o = new PerspectiveCamera(fov, aspect, e, t);
  (o.layers = this.layers),
    o.up.set(0, 0, 1),
    o.lookAt(new Vector3(0, 1, 0)),
    this.add(o);
  const a = new PerspectiveCamera(fov, aspect, e, t);
  (a.layers = this.layers),
    a.up.set(0, 0, -1),
    a.lookAt(new Vector3(0, -1, 0)),
    this.add(a);
  const s = new PerspectiveCamera(fov, aspect, e, t);
  (s.layers = this.layers),
    s.up.set(0, -1, 0),
    s.lookAt(new Vector3(0, 0, 1)),
    this.add(s);
  const c = new PerspectiveCamera(fov, aspect, e, t);
  (c.layers = this.layers),
    c.up.set(0, -1, 0),
    c.lookAt(new Vector3(0, 0, -1)),
    this.add(c),
    (this.update = function (e, t) {
      null === this.parent && this.updateMatrixWorld();
      const l = e.xr.enabled,
        h = e.getRenderTarget();
      e.xr.enabled = !1;
      const u = n.texture.generateMipmaps;
      (n.texture.generateMipmaps = !1),
        e.setRenderTarget(n, 0),
        e.render(t, r),
        e.setRenderTarget(n, 1),
        e.render(t, i),
        e.setRenderTarget(n, 2),
        e.render(t, o),
        e.setRenderTarget(n, 3),
        e.render(t, a),
        e.setRenderTarget(n, 4),
        e.render(t, s),
        (n.texture.generateMipmaps = u),
        e.setRenderTarget(n, 5),
        e.render(t, c),
        e.setRenderTarget(h),
        (e.xr.enabled = l);
    }),
    (this.clear = function (e, t, r, i) {
      const o = e.getRenderTarget();
      for (let o = 0; o < 6; o++) e.setRenderTarget(n, o), e.clear(t, r, i);
      e.setRenderTarget(o);
    });
}
function CubeTexture(e, t, n, r, i, o, a, s, c, l) {
  (e = void 0 !== e ? e : []),
    (t = void 0 !== t ? t : CubeReflectionMapping),
    (a = void 0 !== a ? a : RGBFormat),
    Texture.call(this, e, t, n, r, i, o, a, s, c, l),
    (this.flipY = !1),
    (this._needsFlipEnvMap = !0);
}
function WebGLCubeRenderTarget(e, t, n) {
  Number.isInteger(t) &&
    (console.warn(
      "THREE.WebGLCubeRenderTarget: constructor signature is now WebGLCubeRenderTarget( size, options )"
    ),
    (t = n)),
    WebGLRenderTarget.call(this, e, e, t),
    (t = t || {}),
    (this.texture = new CubeTexture(
      void 0,
      t.mapping,
      t.wrapS,
      t.wrapT,
      t.magFilter,
      t.minFilter,
      t.format,
      t.type,
      t.anisotropy,
      t.encoding
    )),
    (this.texture._needsFlipEnvMap = !1);
}
function DataTexture(e, t, n, r, i, o, a, s, c, l, h, u) {
  Texture.call(this, null, o, a, s, c, l, r, i, h, u),
    (this.image = { data: e || null, width: t || 1, height: n || 1 }),
    (this.magFilter = void 0 !== c ? c : NearestFilter),
    (this.minFilter = void 0 !== l ? l : NearestFilter),
    (this.generateMipmaps = !1),
    (this.flipY = !1),
    (this.unpackAlignment = 1),
    (this.needsUpdate = !0);
}
(CubeCamera.prototype = Object.create(Object3D.prototype)),
  (CubeCamera.prototype.constructor = CubeCamera),
  (CubeTexture.prototype = Object.create(Texture.prototype)),
  (CubeTexture.prototype.constructor = CubeTexture),
  (CubeTexture.prototype.isCubeTexture = !0),
  Object.defineProperty(CubeTexture.prototype, "images", {
    get: function () {
      return this.image;
    },
    set: function (e) {
      this.image = e;
    }
  }),
  (WebGLCubeRenderTarget.prototype = Object.create(
    WebGLRenderTarget.prototype
  )),
  (WebGLCubeRenderTarget.prototype.constructor = WebGLCubeRenderTarget),
  (WebGLCubeRenderTarget.prototype.isWebGLCubeRenderTarget = !0),
  (WebGLCubeRenderTarget.prototype.fromEquirectangularTexture = function (
    e,
    t
  ) {
    (this.texture.type = t.type),
      (this.texture.format = RGBAFormat),
      (this.texture.encoding = t.encoding),
      (this.texture.generateMipmaps = t.generateMipmaps),
      (this.texture.minFilter = t.minFilter),
      (this.texture.magFilter = t.magFilter);
    const n = {
        uniforms: { tEquirect: { value: null } },
        vertexShader:
          "\n\n\t\t\tvarying vec3 vWorldDirection;\n\n\t\t\tvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\n\t\t\t\treturn normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n\n\t\t\t}\n\n\t\t\tvoid main() {\n\n\t\t\t\tvWorldDirection = transformDirection( position, modelMatrix );\n\n\t\t\t\t#include <begin_vertex>\n\t\t\t\t#include <project_vertex>\n\n\t\t\t}\n\t\t",
        fragmentShader:
          "\n\n\t\t\tuniform sampler2D tEquirect;\n\n\t\t\tvarying vec3 vWorldDirection;\n\n\t\t\t#include <common>\n\n\t\t\tvoid main() {\n\n\t\t\t\tvec3 direction = normalize( vWorldDirection );\n\n\t\t\t\tvec2 sampleUV = equirectUv( direction );\n\n\t\t\t\tgl_FragColor = texture2D( tEquirect, sampleUV );\n\n\t\t\t}\n\t\t"
      },
      r = new BoxBufferGeometry(5, 5, 5),
      i = new ShaderMaterial({
        name: "CubemapFromEquirect",
        uniforms: cloneUniforms(n.uniforms),
        vertexShader: n.vertexShader,
        fragmentShader: n.fragmentShader,
        side: BackSide,
        blending: NoBlending
      });
    i.uniforms.tEquirect.value = t;
    const o = new Mesh(r, i),
      a = t.minFilter;
    return (
      t.minFilter === LinearMipmapLinearFilter && (t.minFilter = LinearFilter),
      new CubeCamera(1, 10, this).update(e, o),
      (t.minFilter = a),
      o.geometry.dispose(),
      o.material.dispose(),
      this
    );
  }),
  (DataTexture.prototype = Object.create(Texture.prototype)),
  (DataTexture.prototype.constructor = DataTexture),
  (DataTexture.prototype.isDataTexture = !0);
const _sphere$1 = new Sphere(),
  _vector$5 = new Vector3();
class Frustum {
  constructor(e, t, n, r, i, o) {
    this.planes = [
      void 0 !== e ? e : new Plane(),
      void 0 !== t ? t : new Plane(),
      void 0 !== n ? n : new Plane(),
      void 0 !== r ? r : new Plane(),
      void 0 !== i ? i : new Plane(),
      void 0 !== o ? o : new Plane()
    ];
  }
  set(e, t, n, r, i, o) {
    const a = this.planes;
    return (
      a[0].copy(e),
      a[1].copy(t),
      a[2].copy(n),
      a[3].copy(r),
      a[4].copy(i),
      a[5].copy(o),
      this
    );
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    const t = this.planes;
    for (let n = 0; n < 6; n++) t[n].copy(e.planes[n]);
    return this;
  }
  setFromProjectionMatrix(e) {
    const t = this.planes,
      n = e.elements,
      r = n[0],
      i = n[1],
      o = n[2],
      a = n[3],
      s = n[4],
      c = n[5],
      l = n[6],
      h = n[7],
      u = n[8],
      d = n[9],
      p = n[10],
      m = n[11],
      f = n[12],
      g = n[13],
      v = n[14],
      y = n[15];
    return (
      t[0].setComponents(a - r, h - s, m - u, y - f).normalize(),
      t[1].setComponents(a + r, h + s, m + u, y + f).normalize(),
      t[2].setComponents(a + i, h + c, m + d, y + g).normalize(),
      t[3].setComponents(a - i, h - c, m - d, y - g).normalize(),
      t[4].setComponents(a - o, h - l, m - p, y - v).normalize(),
      t[5].setComponents(a + o, h + l, m + p, y + v).normalize(),
      this
    );
  }
  intersectsObject(e) {
    const t = e.geometry;
    return (
      null === t.boundingSphere && t.computeBoundingSphere(),
      _sphere$1.copy(t.boundingSphere).applyMatrix4(e.matrixWorld),
      this.intersectsSphere(_sphere$1)
    );
  }
  intersectsSprite(e) {
    return (
      _sphere$1.center.set(0, 0, 0),
      (_sphere$1.radius = 0.7071067811865476),
      _sphere$1.applyMatrix4(e.matrixWorld),
      this.intersectsSphere(_sphere$1)
    );
  }
  intersectsSphere(e) {
    const t = this.planes,
      n = e.center,
      r = -e.radius;
    for (let e = 0; e < 6; e++) {
      if (t[e].distanceToPoint(n) < r) return !1;
    }
    return !0;
  }
  intersectsBox(e) {
    const t = this.planes;
    for (let n = 0; n < 6; n++) {
      const r = t[n];
      if (
        ((_vector$5.x = r.normal.x > 0 ? e.max.x : e.min.x),
        (_vector$5.y = r.normal.y > 0 ? e.max.y : e.min.y),
        (_vector$5.z = r.normal.z > 0 ? e.max.z : e.min.z),
        r.distanceToPoint(_vector$5) < 0)
      )
        return !1;
    }
    return !0;
  }
  containsPoint(e) {
    const t = this.planes;
    for (let n = 0; n < 6; n++) if (t[n].distanceToPoint(e) < 0) return !1;
    return !0;
  }
}
function WebGLAnimation() {
  let e = null,
    t = !1,
    n = null,
    r = null;
  function i(t, o) {
    n(t, o), (r = e.requestAnimationFrame(i));
  }
  return {
    start: function () {
      !0 !== t && null !== n && ((r = e.requestAnimationFrame(i)), (t = !0));
    },
    stop: function () {
      e.cancelAnimationFrame(r), (t = !1);
    },
    setAnimationLoop: function (e) {
      n = e;
    },
    setContext: function (t) {
      e = t;
    }
  };
}
function WebGLAttributes(e, t) {
  const n = t.isWebGL2,
    r = new WeakMap();
  return {
    get: function (e) {
      return e.isInterleavedBufferAttribute && (e = e.data), r.get(e);
    },
    remove: function (t) {
      t.isInterleavedBufferAttribute && (t = t.data);
      const n = r.get(t);
      n && (e.deleteBuffer(n.buffer), r.delete(t));
    },
    update: function (t, i) {
      if (t.isGLBufferAttribute) {
        var o = r.get(t);
        return void (
          (!o || o.version < t.version) &&
          r.set(t, {
            buffer: t.buffer,
            type: t.type,
            bytesPerElement: t.elementSize,
            version: t.version
          })
        );
      }
      t.isInterleavedBufferAttribute && (t = t.data);
      const a = r.get(t);
      void 0 === a
        ? r.set(
            t,
            (function (t, n) {
              const r = t.array,
                i = t.usage,
                o = e.createBuffer();
              e.bindBuffer(n, o), e.bufferData(n, r, i), t.onUploadCallback();
              let a = 5126;
              return (
                r instanceof Float32Array
                  ? (a = 5126)
                  : r instanceof Float64Array
                  ? console.warn(
                      "THREE.WebGLAttributes: Unsupported data buffer format: Float64Array."
                    )
                  : r instanceof Uint16Array
                  ? (a = 5123)
                  : r instanceof Int16Array
                  ? (a = 5122)
                  : r instanceof Uint32Array
                  ? (a = 5125)
                  : r instanceof Int32Array
                  ? (a = 5124)
                  : r instanceof Int8Array
                  ? (a = 5120)
                  : r instanceof Uint8Array && (a = 5121),
                {
                  buffer: o,
                  type: a,
                  bytesPerElement: r.BYTES_PER_ELEMENT,
                  version: t.version
                }
              );
            })(t, i)
          )
        : a.version < t.version &&
          ((function (t, r, i) {
            const o = r.array,
              a = r.updateRange;
            e.bindBuffer(i, t),
              -1 === a.count
                ? e.bufferSubData(i, 0, o)
                : (n
                    ? e.bufferSubData(
                        i,
                        a.offset * o.BYTES_PER_ELEMENT,
                        o,
                        a.offset,
                        a.count
                      )
                    : e.bufferSubData(
                        i,
                        a.offset * o.BYTES_PER_ELEMENT,
                        o.subarray(a.offset, a.offset + a.count)
                      ),
                  (a.count = -1));
          })(a.buffer, t, i),
          (a.version = t.version));
    }
  };
}
class PlaneBufferGeometry extends BufferGeometry {
  constructor(e, t, n, r) {
    super(),
      (this.type = "PlaneBufferGeometry"),
      (this.parameters = {
        width: e,
        height: t,
        widthSegments: n,
        heightSegments: r
      });
    const i = (e = e || 1) / 2,
      o = (t = t || 1) / 2,
      a = Math.floor(n) || 1,
      s = Math.floor(r) || 1,
      c = a + 1,
      l = s + 1,
      h = e / a,
      u = t / s,
      d = [],
      p = [],
      m = [],
      f = [];
    for (let e = 0; e < l; e++) {
      const t = e * u - o;
      for (let n = 0; n < c; n++) {
        const r = n * h - i;
        p.push(r, -t, 0), m.push(0, 0, 1), f.push(n / a), f.push(1 - e / s);
      }
    }
    for (let e = 0; e < s; e++)
      for (let t = 0; t < a; t++) {
        const n = t + c * e,
          r = t + c * (e + 1),
          i = t + 1 + c * (e + 1),
          o = t + 1 + c * e;
        d.push(n, r, o), d.push(r, i, o);
      }
    this.setIndex(d),
      this.setAttribute("position", new Float32BufferAttribute(p, 3)),
      this.setAttribute("normal", new Float32BufferAttribute(m, 3)),
      this.setAttribute("uv", new Float32BufferAttribute(f, 2));
  }
}
var alphamap_fragment =
    "#ifdef USE_ALPHAMAP\n\tdiffuseColor.a *= texture2D( alphaMap, vUv ).g;\n#endif",
  alphamap_pars_fragment =
    "#ifdef USE_ALPHAMAP\n\tuniform sampler2D alphaMap;\n#endif",
  alphatest_fragment =
    "#ifdef ALPHATEST\n\tif ( diffuseColor.a < ALPHATEST ) discard;\n#endif",
  aomap_fragment =
    "#ifdef USE_AOMAP\n\tfloat ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;\n\treflectedLight.indirectDiffuse *= ambientOcclusion;\n\t#if defined( USE_ENVMAP ) && defined( STANDARD )\n\t\tfloat dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n\t\treflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.specularRoughness );\n\t#endif\n#endif",
  aomap_pars_fragment =
    "#ifdef USE_AOMAP\n\tuniform sampler2D aoMap;\n\tuniform float aoMapIntensity;\n#endif",
  begin_vertex = "vec3 transformed = vec3( position );",
  beginnormal_vertex =
    "vec3 objectNormal = vec3( normal );\n#ifdef USE_TANGENT\n\tvec3 objectTangent = vec3( tangent.xyz );\n#endif",
  bsdfs =
    "vec2 integrateSpecularBRDF( const in float dotNV, const in float roughness ) {\n\tconst vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );\n\tconst vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );\n\tvec4 r = roughness * c0 + c1;\n\tfloat a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;\n\treturn vec2( -1.04, 1.04 ) * a004 + r.zw;\n}\nfloat punctualLightIntensityToIrradianceFactor( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {\n#if defined ( PHYSICALLY_CORRECT_LIGHTS )\n\tfloat distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );\n\tif( cutoffDistance > 0.0 ) {\n\t\tdistanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );\n\t}\n\treturn distanceFalloff;\n#else\n\tif( cutoffDistance > 0.0 && decayExponent > 0.0 ) {\n\t\treturn pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );\n\t}\n\treturn 1.0;\n#endif\n}\nvec3 BRDF_Diffuse_Lambert( const in vec3 diffuseColor ) {\n\treturn RECIPROCAL_PI * diffuseColor;\n}\nvec3 F_Schlick( const in vec3 specularColor, const in float dotLH ) {\n\tfloat fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );\n\treturn ( 1.0 - specularColor ) * fresnel + specularColor;\n}\nvec3 F_Schlick_RoughnessDependent( const in vec3 F0, const in float dotNV, const in float roughness ) {\n\tfloat fresnel = exp2( ( -5.55473 * dotNV - 6.98316 ) * dotNV );\n\tvec3 Fr = max( vec3( 1.0 - roughness ), F0 ) - F0;\n\treturn Fr * fresnel + F0;\n}\nfloat G_GGX_Smith( const in float alpha, const in float dotNL, const in float dotNV ) {\n\tfloat a2 = pow2( alpha );\n\tfloat gl = dotNL + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n\tfloat gv = dotNV + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n\treturn 1.0 / ( gl * gv );\n}\nfloat G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\n\tfloat a2 = pow2( alpha );\n\tfloat gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n\tfloat gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n\treturn 0.5 / max( gv + gl, EPSILON );\n}\nfloat D_GGX( const in float alpha, const in float dotNH ) {\n\tfloat a2 = pow2( alpha );\n\tfloat denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;\n\treturn RECIPROCAL_PI * a2 / pow2( denom );\n}\nvec3 BRDF_Specular_GGX( const in IncidentLight incidentLight, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float roughness ) {\n\tfloat alpha = pow2( roughness );\n\tvec3 halfDir = normalize( incidentLight.direction + viewDir );\n\tfloat dotNL = saturate( dot( normal, incidentLight.direction ) );\n\tfloat dotNV = saturate( dot( normal, viewDir ) );\n\tfloat dotNH = saturate( dot( normal, halfDir ) );\n\tfloat dotLH = saturate( dot( incidentLight.direction, halfDir ) );\n\tvec3 F = F_Schlick( specularColor, dotLH );\n\tfloat G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n\tfloat D = D_GGX( alpha, dotNH );\n\treturn F * ( G * D );\n}\nvec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {\n\tconst float LUT_SIZE = 64.0;\n\tconst float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;\n\tconst float LUT_BIAS = 0.5 / LUT_SIZE;\n\tfloat dotNV = saturate( dot( N, V ) );\n\tvec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );\n\tuv = uv * LUT_SCALE + LUT_BIAS;\n\treturn uv;\n}\nfloat LTC_ClippedSphereFormFactor( const in vec3 f ) {\n\tfloat l = length( f );\n\treturn max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );\n}\nvec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {\n\tfloat x = dot( v1, v2 );\n\tfloat y = abs( x );\n\tfloat a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;\n\tfloat b = 3.4175940 + ( 4.1616724 + y ) * y;\n\tfloat v = a / b;\n\tfloat theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;\n\treturn cross( v1, v2 ) * theta_sintheta;\n}\nvec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {\n\tvec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];\n\tvec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];\n\tvec3 lightNormal = cross( v1, v2 );\n\tif( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );\n\tvec3 T1, T2;\n\tT1 = normalize( V - N * dot( V, N ) );\n\tT2 = - cross( N, T1 );\n\tmat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );\n\tvec3 coords[ 4 ];\n\tcoords[ 0 ] = mat * ( rectCoords[ 0 ] - P );\n\tcoords[ 1 ] = mat * ( rectCoords[ 1 ] - P );\n\tcoords[ 2 ] = mat * ( rectCoords[ 2 ] - P );\n\tcoords[ 3 ] = mat * ( rectCoords[ 3 ] - P );\n\tcoords[ 0 ] = normalize( coords[ 0 ] );\n\tcoords[ 1 ] = normalize( coords[ 1 ] );\n\tcoords[ 2 ] = normalize( coords[ 2 ] );\n\tcoords[ 3 ] = normalize( coords[ 3 ] );\n\tvec3 vectorFormFactor = vec3( 0.0 );\n\tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );\n\tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );\n\tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );\n\tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );\n\tfloat result = LTC_ClippedSphereFormFactor( vectorFormFactor );\n\treturn vec3( result );\n}\nvec3 BRDF_Specular_GGX_Environment( const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float roughness ) {\n\tfloat dotNV = saturate( dot( normal, viewDir ) );\n\tvec2 brdf = integrateSpecularBRDF( dotNV, roughness );\n\treturn specularColor * brdf.x + brdf.y;\n}\nvoid BRDF_Specular_Multiscattering_Environment( const in GeometricContext geometry, const in vec3 specularColor, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {\n\tfloat dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n\tvec3 F = F_Schlick_RoughnessDependent( specularColor, dotNV, roughness );\n\tvec2 brdf = integrateSpecularBRDF( dotNV, roughness );\n\tvec3 FssEss = F * brdf.x + brdf.y;\n\tfloat Ess = brdf.x + brdf.y;\n\tfloat Ems = 1.0 - Ess;\n\tvec3 Favg = specularColor + ( 1.0 - specularColor ) * 0.047619;\tvec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );\n\tsingleScatter += FssEss;\n\tmultiScatter += Fms * Ems;\n}\nfloat G_BlinnPhong_Implicit( ) {\n\treturn 0.25;\n}\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\n\treturn RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n}\nvec3 BRDF_Specular_BlinnPhong( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float shininess ) {\n\tvec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );\n\tfloat dotNH = saturate( dot( geometry.normal, halfDir ) );\n\tfloat dotLH = saturate( dot( incidentLight.direction, halfDir ) );\n\tvec3 F = F_Schlick( specularColor, dotLH );\n\tfloat G = G_BlinnPhong_Implicit( );\n\tfloat D = D_BlinnPhong( shininess, dotNH );\n\treturn F * ( G * D );\n}\nfloat GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {\n\treturn ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );\n}\nfloat BlinnExponentToGGXRoughness( const in float blinnExponent ) {\n\treturn sqrt( 2.0 / ( blinnExponent + 2.0 ) );\n}\n#if defined( USE_SHEEN )\nfloat D_Charlie(float roughness, float NoH) {\n\tfloat invAlpha = 1.0 / roughness;\n\tfloat cos2h = NoH * NoH;\n\tfloat sin2h = max(1.0 - cos2h, 0.0078125);\treturn (2.0 + invAlpha) * pow(sin2h, invAlpha * 0.5) / (2.0 * PI);\n}\nfloat V_Neubelt(float NoV, float NoL) {\n\treturn saturate(1.0 / (4.0 * (NoL + NoV - NoL * NoV)));\n}\nvec3 BRDF_Specular_Sheen( const in float roughness, const in vec3 L, const in GeometricContext geometry, vec3 specularColor ) {\n\tvec3 N = geometry.normal;\n\tvec3 V = geometry.viewDir;\n\tvec3 H = normalize( V + L );\n\tfloat dotNH = saturate( dot( N, H ) );\n\treturn specularColor * D_Charlie( roughness, dotNH ) * V_Neubelt( dot(N, V), dot(N, L) );\n}\n#endif",
  bumpmap_pars_fragment =
    "#ifdef USE_BUMPMAP\n\tuniform sampler2D bumpMap;\n\tuniform float bumpScale;\n\tvec2 dHdxy_fwd() {\n\t\tvec2 dSTdx = dFdx( vUv );\n\t\tvec2 dSTdy = dFdy( vUv );\n\t\tfloat Hll = bumpScale * texture2D( bumpMap, vUv ).x;\n\t\tfloat dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;\n\t\tfloat dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;\n\t\treturn vec2( dBx, dBy );\n\t}\n\tvec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {\n\t\tvec3 vSigmaX = vec3( dFdx( surf_pos.x ), dFdx( surf_pos.y ), dFdx( surf_pos.z ) );\n\t\tvec3 vSigmaY = vec3( dFdy( surf_pos.x ), dFdy( surf_pos.y ), dFdy( surf_pos.z ) );\n\t\tvec3 vN = surf_norm;\n\t\tvec3 R1 = cross( vSigmaY, vN );\n\t\tvec3 R2 = cross( vN, vSigmaX );\n\t\tfloat fDet = dot( vSigmaX, R1 );\n\t\tfDet *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n\t\tvec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n\t\treturn normalize( abs( fDet ) * surf_norm - vGrad );\n\t}\n#endif",
  clipping_planes_fragment =
    "#if NUM_CLIPPING_PLANES > 0\n\tvec4 plane;\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {\n\t\tplane = clippingPlanes[ i ];\n\t\tif ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;\n\t}\n\t#pragma unroll_loop_end\n\t#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n\t\tbool clipped = true;\n\t\t#pragma unroll_loop_start\n\t\tfor ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {\n\t\t\tplane = clippingPlanes[ i ];\n\t\t\tclipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;\n\t\t}\n\t\t#pragma unroll_loop_end\n\t\tif ( clipped ) discard;\n\t#endif\n#endif",
  clipping_planes_pars_fragment =
    "#if NUM_CLIPPING_PLANES > 0\n\tvarying vec3 vClipPosition;\n\tuniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];\n#endif",
  clipping_planes_pars_vertex =
    "#if NUM_CLIPPING_PLANES > 0\n\tvarying vec3 vClipPosition;\n#endif",
  clipping_planes_vertex =
    "#if NUM_CLIPPING_PLANES > 0\n\tvClipPosition = - mvPosition.xyz;\n#endif",
  color_fragment = "#ifdef USE_COLOR\n\tdiffuseColor.rgb *= vColor;\n#endif",
  color_pars_fragment = "#ifdef USE_COLOR\n\tvarying vec3 vColor;\n#endif",
  color_pars_vertex =
    "#if defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )\n\tvarying vec3 vColor;\n#endif",
  color_vertex =
    "#if defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )\n\tvColor = vec3( 1.0 );\n#endif\n#ifdef USE_COLOR\n\tvColor.xyz *= color.xyz;\n#endif\n#ifdef USE_INSTANCING_COLOR\n\tvColor.xyz *= instanceColor.xyz;\n#endif",
  common =
    "#define PI 3.141592653589793\n#define PI2 6.283185307179586\n#define PI_HALF 1.5707963267948966\n#define RECIPROCAL_PI 0.3183098861837907\n#define RECIPROCAL_PI2 0.15915494309189535\n#define EPSILON 1e-6\n#ifndef saturate\n#define saturate(a) clamp( a, 0.0, 1.0 )\n#endif\n#define whiteComplement(a) ( 1.0 - saturate( a ) )\nfloat pow2( const in float x ) { return x*x; }\nfloat pow3( const in float x ) { return x*x*x; }\nfloat pow4( const in float x ) { float x2 = x*x; return x2*x2; }\nfloat average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }\nhighp float rand( const in vec2 uv ) {\n\tconst highp float a = 12.9898, b = 78.233, c = 43758.5453;\n\thighp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n\treturn fract(sin(sn) * c);\n}\n#ifdef HIGH_PRECISION\n\tfloat precisionSafeLength( vec3 v ) { return length( v ); }\n#else\n\tfloat max3( vec3 v ) { return max( max( v.x, v.y ), v.z ); }\n\tfloat precisionSafeLength( vec3 v ) {\n\t\tfloat maxComponent = max3( abs( v ) );\n\t\treturn length( v / maxComponent ) * maxComponent;\n\t}\n#endif\nstruct IncidentLight {\n\tvec3 color;\n\tvec3 direction;\n\tbool visible;\n};\nstruct ReflectedLight {\n\tvec3 directDiffuse;\n\tvec3 directSpecular;\n\tvec3 indirectDiffuse;\n\tvec3 indirectSpecular;\n};\nstruct GeometricContext {\n\tvec3 position;\n\tvec3 normal;\n\tvec3 viewDir;\n#ifdef CLEARCOAT\n\tvec3 clearcoatNormal;\n#endif\n};\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\treturn normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n}\nvec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {\n\treturn normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );\n}\nvec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\tfloat distance = dot( planeNormal, point - pointOnPlane );\n\treturn - distance * planeNormal + point;\n}\nfloat sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\treturn sign( dot( point - pointOnPlane, planeNormal ) );\n}\nvec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\treturn lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;\n}\nmat3 transposeMat3( const in mat3 m ) {\n\tmat3 tmp;\n\ttmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );\n\ttmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );\n\ttmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );\n\treturn tmp;\n}\nfloat linearToRelativeLuminance( const in vec3 color ) {\n\tvec3 weights = vec3( 0.2126, 0.7152, 0.0722 );\n\treturn dot( weights, color.rgb );\n}\nbool isPerspectiveMatrix( mat4 m ) {\n\treturn m[ 2 ][ 3 ] == - 1.0;\n}\nvec2 equirectUv( in vec3 dir ) {\n\tfloat u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;\n\tfloat v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;\n\treturn vec2( u, v );\n}",
  cube_uv_reflection_fragment =
    "#ifdef ENVMAP_TYPE_CUBE_UV\n\t#define cubeUV_maxMipLevel 8.0\n\t#define cubeUV_minMipLevel 4.0\n\t#define cubeUV_maxTileSize 256.0\n\t#define cubeUV_minTileSize 16.0\n\tfloat getFace( vec3 direction ) {\n\t\tvec3 absDirection = abs( direction );\n\t\tfloat face = - 1.0;\n\t\tif ( absDirection.x > absDirection.z ) {\n\t\t\tif ( absDirection.x > absDirection.y )\n\t\t\t\tface = direction.x > 0.0 ? 0.0 : 3.0;\n\t\t\telse\n\t\t\t\tface = direction.y > 0.0 ? 1.0 : 4.0;\n\t\t} else {\n\t\t\tif ( absDirection.z > absDirection.y )\n\t\t\t\tface = direction.z > 0.0 ? 2.0 : 5.0;\n\t\t\telse\n\t\t\t\tface = direction.y > 0.0 ? 1.0 : 4.0;\n\t\t}\n\t\treturn face;\n\t}\n\tvec2 getUV( vec3 direction, float face ) {\n\t\tvec2 uv;\n\t\tif ( face == 0.0 ) {\n\t\t\tuv = vec2( direction.z, direction.y ) / abs( direction.x );\n\t\t} else if ( face == 1.0 ) {\n\t\t\tuv = vec2( - direction.x, - direction.z ) / abs( direction.y );\n\t\t} else if ( face == 2.0 ) {\n\t\t\tuv = vec2( - direction.x, direction.y ) / abs( direction.z );\n\t\t} else if ( face == 3.0 ) {\n\t\t\tuv = vec2( - direction.z, direction.y ) / abs( direction.x );\n\t\t} else if ( face == 4.0 ) {\n\t\t\tuv = vec2( - direction.x, direction.z ) / abs( direction.y );\n\t\t} else {\n\t\t\tuv = vec2( direction.x, direction.y ) / abs( direction.z );\n\t\t}\n\t\treturn 0.5 * ( uv + 1.0 );\n\t}\n\tvec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {\n\t\tfloat face = getFace( direction );\n\t\tfloat filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );\n\t\tmipInt = max( mipInt, cubeUV_minMipLevel );\n\t\tfloat faceSize = exp2( mipInt );\n\t\tfloat texelSize = 1.0 / ( 3.0 * cubeUV_maxTileSize );\n\t\tvec2 uv = getUV( direction, face ) * ( faceSize - 1.0 );\n\t\tvec2 f = fract( uv );\n\t\tuv += 0.5 - f;\n\t\tif ( face > 2.0 ) {\n\t\t\tuv.y += faceSize;\n\t\t\tface -= 3.0;\n\t\t}\n\t\tuv.x += face * faceSize;\n\t\tif ( mipInt < cubeUV_maxMipLevel ) {\n\t\t\tuv.y += 2.0 * cubeUV_maxTileSize;\n\t\t}\n\t\tuv.y += filterInt * 2.0 * cubeUV_minTileSize;\n\t\tuv.x += 3.0 * max( 0.0, cubeUV_maxTileSize - 2.0 * faceSize );\n\t\tuv *= texelSize;\n\t\tvec3 tl = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;\n\t\tuv.x += texelSize;\n\t\tvec3 tr = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;\n\t\tuv.y += texelSize;\n\t\tvec3 br = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;\n\t\tuv.x -= texelSize;\n\t\tvec3 bl = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;\n\t\tvec3 tm = mix( tl, tr, f.x );\n\t\tvec3 bm = mix( bl, br, f.x );\n\t\treturn mix( tm, bm, f.y );\n\t}\n\t#define r0 1.0\n\t#define v0 0.339\n\t#define m0 - 2.0\n\t#define r1 0.8\n\t#define v1 0.276\n\t#define m1 - 1.0\n\t#define r4 0.4\n\t#define v4 0.046\n\t#define m4 2.0\n\t#define r5 0.305\n\t#define v5 0.016\n\t#define m5 3.0\n\t#define r6 0.21\n\t#define v6 0.0038\n\t#define m6 4.0\n\tfloat roughnessToMip( float roughness ) {\n\t\tfloat mip = 0.0;\n\t\tif ( roughness >= r1 ) {\n\t\t\tmip = ( r0 - roughness ) * ( m1 - m0 ) / ( r0 - r1 ) + m0;\n\t\t} else if ( roughness >= r4 ) {\n\t\t\tmip = ( r1 - roughness ) * ( m4 - m1 ) / ( r1 - r4 ) + m1;\n\t\t} else if ( roughness >= r5 ) {\n\t\t\tmip = ( r4 - roughness ) * ( m5 - m4 ) / ( r4 - r5 ) + m4;\n\t\t} else if ( roughness >= r6 ) {\n\t\t\tmip = ( r5 - roughness ) * ( m6 - m5 ) / ( r5 - r6 ) + m5;\n\t\t} else {\n\t\t\tmip = - 2.0 * log2( 1.16 * roughness );\t\t}\n\t\treturn mip;\n\t}\n\tvec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {\n\t\tfloat mip = clamp( roughnessToMip( roughness ), m0, cubeUV_maxMipLevel );\n\t\tfloat mipF = fract( mip );\n\t\tfloat mipInt = floor( mip );\n\t\tvec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );\n\t\tif ( mipF == 0.0 ) {\n\t\t\treturn vec4( color0, 1.0 );\n\t\t} else {\n\t\t\tvec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );\n\t\t\treturn vec4( mix( color0, color1, mipF ), 1.0 );\n\t\t}\n\t}\n#endif",
  defaultnormal_vertex =
    "vec3 transformedNormal = objectNormal;\n#ifdef USE_INSTANCING\n\tmat3 m = mat3( instanceMatrix );\n\ttransformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );\n\ttransformedNormal = m * transformedNormal;\n#endif\ntransformedNormal = normalMatrix * transformedNormal;\n#ifdef FLIP_SIDED\n\ttransformedNormal = - transformedNormal;\n#endif\n#ifdef USE_TANGENT\n\tvec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;\n\t#ifdef FLIP_SIDED\n\t\ttransformedTangent = - transformedTangent;\n\t#endif\n#endif",
  displacementmap_pars_vertex =
    "#ifdef USE_DISPLACEMENTMAP\n\tuniform sampler2D displacementMap;\n\tuniform float displacementScale;\n\tuniform float displacementBias;\n#endif",
  displacementmap_vertex =
    "#ifdef USE_DISPLACEMENTMAP\n\ttransformed += normalize( objectNormal ) * ( texture2D( displacementMap, vUv ).x * displacementScale + displacementBias );\n#endif",
  emissivemap_fragment =
    "#ifdef USE_EMISSIVEMAP\n\tvec4 emissiveColor = texture2D( emissiveMap, vUv );\n\temissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;\n\ttotalEmissiveRadiance *= emissiveColor.rgb;\n#endif",
  emissivemap_pars_fragment =
    "#ifdef USE_EMISSIVEMAP\n\tuniform sampler2D emissiveMap;\n#endif",
  encodings_fragment = "gl_FragColor = linearToOutputTexel( gl_FragColor );",
  encodings_pars_fragment =
    "\nvec4 LinearToLinear( in vec4 value ) {\n\treturn value;\n}\nvec4 GammaToLinear( in vec4 value, in float gammaFactor ) {\n\treturn vec4( pow( value.rgb, vec3( gammaFactor ) ), value.a );\n}\nvec4 LinearToGamma( in vec4 value, in float gammaFactor ) {\n\treturn vec4( pow( value.rgb, vec3( 1.0 / gammaFactor ) ), value.a );\n}\nvec4 sRGBToLinear( in vec4 value ) {\n\treturn vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );\n}\nvec4 LinearTosRGB( in vec4 value ) {\n\treturn vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );\n}\nvec4 RGBEToLinear( in vec4 value ) {\n\treturn vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );\n}\nvec4 LinearToRGBE( in vec4 value ) {\n\tfloat maxComponent = max( max( value.r, value.g ), value.b );\n\tfloat fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );\n\treturn vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );\n}\nvec4 RGBMToLinear( in vec4 value, in float maxRange ) {\n\treturn vec4( value.rgb * value.a * maxRange, 1.0 );\n}\nvec4 LinearToRGBM( in vec4 value, in float maxRange ) {\n\tfloat maxRGB = max( value.r, max( value.g, value.b ) );\n\tfloat M = clamp( maxRGB / maxRange, 0.0, 1.0 );\n\tM = ceil( M * 255.0 ) / 255.0;\n\treturn vec4( value.rgb / ( M * maxRange ), M );\n}\nvec4 RGBDToLinear( in vec4 value, in float maxRange ) {\n\treturn vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );\n}\nvec4 LinearToRGBD( in vec4 value, in float maxRange ) {\n\tfloat maxRGB = max( value.r, max( value.g, value.b ) );\n\tfloat D = max( maxRange / maxRGB, 1.0 );\n\tD = clamp( floor( D ) / 255.0, 0.0, 1.0 );\n\treturn vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );\n}\nconst mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );\nvec4 LinearToLogLuv( in vec4 value ) {\n\tvec3 Xp_Y_XYZp = cLogLuvM * value.rgb;\n\tXp_Y_XYZp = max( Xp_Y_XYZp, vec3( 1e-6, 1e-6, 1e-6 ) );\n\tvec4 vResult;\n\tvResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;\n\tfloat Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;\n\tvResult.w = fract( Le );\n\tvResult.z = ( Le - ( floor( vResult.w * 255.0 ) ) / 255.0 ) / 255.0;\n\treturn vResult;\n}\nconst mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );\nvec4 LogLuvToLinear( in vec4 value ) {\n\tfloat Le = value.z * 255.0 + value.w;\n\tvec3 Xp_Y_XYZp;\n\tXp_Y_XYZp.y = exp2( ( Le - 127.0 ) / 2.0 );\n\tXp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;\n\tXp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;\n\tvec3 vRGB = cLogLuvInverseM * Xp_Y_XYZp.rgb;\n\treturn vec4( max( vRGB, 0.0 ), 1.0 );\n}",
  envmap_fragment =
    "#ifdef USE_ENVMAP\n\t#ifdef ENV_WORLDPOS\n\t\tvec3 cameraToFrag;\n\t\tif ( isOrthographic ) {\n\t\t\tcameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n\t\t} else {\n\t\t\tcameraToFrag = normalize( vWorldPosition - cameraPosition );\n\t\t}\n\t\tvec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n\t\t#ifdef ENVMAP_MODE_REFLECTION\n\t\t\tvec3 reflectVec = reflect( cameraToFrag, worldNormal );\n\t\t#else\n\t\t\tvec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );\n\t\t#endif\n\t#else\n\t\tvec3 reflectVec = vReflect;\n\t#endif\n\t#ifdef ENVMAP_TYPE_CUBE\n\t\tvec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n\t#elif defined( ENVMAP_TYPE_CUBE_UV )\n\t\tvec4 envColor = textureCubeUV( envMap, reflectVec, 0.0 );\n\t#else\n\t\tvec4 envColor = vec4( 0.0 );\n\t#endif\n\t#ifndef ENVMAP_TYPE_CUBE_UV\n\t\tenvColor = envMapTexelToLinear( envColor );\n\t#endif\n\t#ifdef ENVMAP_BLENDING_MULTIPLY\n\t\toutgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );\n\t#elif defined( ENVMAP_BLENDING_MIX )\n\t\toutgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );\n\t#elif defined( ENVMAP_BLENDING_ADD )\n\t\toutgoingLight += envColor.xyz * specularStrength * reflectivity;\n\t#endif\n#endif",
  envmap_common_pars_fragment =
    "#ifdef USE_ENVMAP\n\tuniform float envMapIntensity;\n\tuniform float flipEnvMap;\n\tuniform int maxMipLevel;\n\t#ifdef ENVMAP_TYPE_CUBE\n\t\tuniform samplerCube envMap;\n\t#else\n\t\tuniform sampler2D envMap;\n\t#endif\n\t\n#endif",
  envmap_pars_fragment =
    "#ifdef USE_ENVMAP\n\tuniform float reflectivity;\n\t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\t\t#define ENV_WORLDPOS\n\t#endif\n\t#ifdef ENV_WORLDPOS\n\t\tvarying vec3 vWorldPosition;\n\t\tuniform float refractionRatio;\n\t#else\n\t\tvarying vec3 vReflect;\n\t#endif\n#endif",
  envmap_pars_vertex =
    "#ifdef USE_ENVMAP\n\t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) ||defined( PHONG )\n\t\t#define ENV_WORLDPOS\n\t#endif\n\t#ifdef ENV_WORLDPOS\n\t\t\n\t\tvarying vec3 vWorldPosition;\n\t#else\n\t\tvarying vec3 vReflect;\n\t\tuniform float refractionRatio;\n\t#endif\n#endif",
  envmap_vertex =
    "#ifdef USE_ENVMAP\n\t#ifdef ENV_WORLDPOS\n\t\tvWorldPosition = worldPosition.xyz;\n\t#else\n\t\tvec3 cameraToVertex;\n\t\tif ( isOrthographic ) {\n\t\t\tcameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n\t\t} else {\n\t\t\tcameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n\t\t}\n\t\tvec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );\n\t\t#ifdef ENVMAP_MODE_REFLECTION\n\t\t\tvReflect = reflect( cameraToVertex, worldNormal );\n\t\t#else\n\t\t\tvReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n\t\t#endif\n\t#endif\n#endif",
  fog_vertex = "#ifdef USE_FOG\n\tfogDepth = - mvPosition.z;\n#endif",
  fog_pars_vertex = "#ifdef USE_FOG\n\tvarying float fogDepth;\n#endif",
  fog_fragment =
    "#ifdef USE_FOG\n\t#ifdef FOG_EXP2\n\t\tfloat fogFactor = 1.0 - exp( - fogDensity * fogDensity * fogDepth * fogDepth );\n\t#else\n\t\tfloat fogFactor = smoothstep( fogNear, fogFar, fogDepth );\n\t#endif\n\tgl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );\n#endif",
  fog_pars_fragment =
    "#ifdef USE_FOG\n\tuniform vec3 fogColor;\n\tvarying float fogDepth;\n\t#ifdef FOG_EXP2\n\t\tuniform float fogDensity;\n\t#else\n\t\tuniform float fogNear;\n\t\tuniform float fogFar;\n\t#endif\n#endif",
  gradientmap_pars_fragment =
    "#ifdef USE_GRADIENTMAP\n\tuniform sampler2D gradientMap;\n#endif\nvec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {\n\tfloat dotNL = dot( normal, lightDirection );\n\tvec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );\n\t#ifdef USE_GRADIENTMAP\n\t\treturn texture2D( gradientMap, coord ).rgb;\n\t#else\n\t\treturn ( coord.x < 0.7 ) ? vec3( 0.7 ) : vec3( 1.0 );\n\t#endif\n}",
  lightmap_fragment =
    "#ifdef USE_LIGHTMAP\n\tvec4 lightMapTexel= texture2D( lightMap, vUv2 );\n\treflectedLight.indirectDiffuse += PI * lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;\n#endif",
  lightmap_pars_fragment =
    "#ifdef USE_LIGHTMAP\n\tuniform sampler2D lightMap;\n\tuniform float lightMapIntensity;\n#endif",
  lights_lambert_vertex =
    "vec3 diffuse = vec3( 1.0 );\nGeometricContext geometry;\ngeometry.position = mvPosition.xyz;\ngeometry.normal = normalize( transformedNormal );\ngeometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( -mvPosition.xyz );\nGeometricContext backGeometry;\nbackGeometry.position = geometry.position;\nbackGeometry.normal = -geometry.normal;\nbackGeometry.viewDir = geometry.viewDir;\nvLightFront = vec3( 0.0 );\nvIndirectFront = vec3( 0.0 );\n#ifdef DOUBLE_SIDED\n\tvLightBack = vec3( 0.0 );\n\tvIndirectBack = vec3( 0.0 );\n#endif\nIncidentLight directLight;\nfloat dotNL;\nvec3 directLightColor_Diffuse;\nvIndirectFront += getAmbientLightIrradiance( ambientLightColor );\nvIndirectFront += getLightProbeIrradiance( lightProbe, geometry );\n#ifdef DOUBLE_SIDED\n\tvIndirectBack += getAmbientLightIrradiance( ambientLightColor );\n\tvIndirectBack += getLightProbeIrradiance( lightProbe, backGeometry );\n#endif\n#if NUM_POINT_LIGHTS > 0\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n\t\tgetPointDirectLightIrradiance( pointLights[ i ], geometry, directLight );\n\t\tdotNL = dot( geometry.normal, directLight.direction );\n\t\tdirectLightColor_Diffuse = PI * directLight.color;\n\t\tvLightFront += saturate( dotNL ) * directLightColor_Diffuse;\n\t\t#ifdef DOUBLE_SIDED\n\t\t\tvLightBack += saturate( -dotNL ) * directLightColor_Diffuse;\n\t\t#endif\n\t}\n\t#pragma unroll_loop_end\n#endif\n#if NUM_SPOT_LIGHTS > 0\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n\t\tgetSpotDirectLightIrradiance( spotLights[ i ], geometry, directLight );\n\t\tdotNL = dot( geometry.normal, directLight.direction );\n\t\tdirectLightColor_Diffuse = PI * directLight.color;\n\t\tvLightFront += saturate( dotNL ) * directLightColor_Diffuse;\n\t\t#ifdef DOUBLE_SIDED\n\t\t\tvLightBack += saturate( -dotNL ) * directLightColor_Diffuse;\n\t\t#endif\n\t}\n\t#pragma unroll_loop_end\n#endif\n#if NUM_DIR_LIGHTS > 0\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n\t\tgetDirectionalDirectLightIrradiance( directionalLights[ i ], geometry, directLight );\n\t\tdotNL = dot( geometry.normal, directLight.direction );\n\t\tdirectLightColor_Diffuse = PI * directLight.color;\n\t\tvLightFront += saturate( dotNL ) * directLightColor_Diffuse;\n\t\t#ifdef DOUBLE_SIDED\n\t\t\tvLightBack += saturate( -dotNL ) * directLightColor_Diffuse;\n\t\t#endif\n\t}\n\t#pragma unroll_loop_end\n#endif\n#if NUM_HEMI_LIGHTS > 0\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n\t\tvIndirectFront += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );\n\t\t#ifdef DOUBLE_SIDED\n\t\t\tvIndirectBack += getHemisphereLightIrradiance( hemisphereLights[ i ], backGeometry );\n\t\t#endif\n\t}\n\t#pragma unroll_loop_end\n#endif",
  lights_pars_begin =
    "uniform bool receiveShadow;\nuniform vec3 ambientLightColor;\nuniform vec3 lightProbe[ 9 ];\nvec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {\n\tfloat x = normal.x, y = normal.y, z = normal.z;\n\tvec3 result = shCoefficients[ 0 ] * 0.886227;\n\tresult += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;\n\tresult += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;\n\tresult += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;\n\tresult += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;\n\tresult += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;\n\tresult += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );\n\tresult += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;\n\tresult += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );\n\treturn result;\n}\nvec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in GeometricContext geometry ) {\n\tvec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );\n\tvec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );\n\treturn irradiance;\n}\nvec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {\n\tvec3 irradiance = ambientLightColor;\n\t#ifndef PHYSICALLY_CORRECT_LIGHTS\n\t\tirradiance *= PI;\n\t#endif\n\treturn irradiance;\n}\n#if NUM_DIR_LIGHTS > 0\n\tstruct DirectionalLight {\n\t\tvec3 direction;\n\t\tvec3 color;\n\t};\n\tuniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];\n\tvoid getDirectionalDirectLightIrradiance( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight directLight ) {\n\t\tdirectLight.color = directionalLight.color;\n\t\tdirectLight.direction = directionalLight.direction;\n\t\tdirectLight.visible = true;\n\t}\n#endif\n#if NUM_POINT_LIGHTS > 0\n\tstruct PointLight {\n\t\tvec3 position;\n\t\tvec3 color;\n\t\tfloat distance;\n\t\tfloat decay;\n\t};\n\tuniform PointLight pointLights[ NUM_POINT_LIGHTS ];\n\tvoid getPointDirectLightIrradiance( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight directLight ) {\n\t\tvec3 lVector = pointLight.position - geometry.position;\n\t\tdirectLight.direction = normalize( lVector );\n\t\tfloat lightDistance = length( lVector );\n\t\tdirectLight.color = pointLight.color;\n\t\tdirectLight.color *= punctualLightIntensityToIrradianceFactor( lightDistance, pointLight.distance, pointLight.decay );\n\t\tdirectLight.visible = ( directLight.color != vec3( 0.0 ) );\n\t}\n#endif\n#if NUM_SPOT_LIGHTS > 0\n\tstruct SpotLight {\n\t\tvec3 position;\n\t\tvec3 direction;\n\t\tvec3 color;\n\t\tfloat distance;\n\t\tfloat decay;\n\t\tfloat coneCos;\n\t\tfloat penumbraCos;\n\t};\n\tuniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];\n\tvoid getSpotDirectLightIrradiance( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight directLight ) {\n\t\tvec3 lVector = spotLight.position - geometry.position;\n\t\tdirectLight.direction = normalize( lVector );\n\t\tfloat lightDistance = length( lVector );\n\t\tfloat angleCos = dot( directLight.direction, spotLight.direction );\n\t\tif ( angleCos > spotLight.coneCos ) {\n\t\t\tfloat spotEffect = smoothstep( spotLight.coneCos, spotLight.penumbraCos, angleCos );\n\t\t\tdirectLight.color = spotLight.color;\n\t\t\tdirectLight.color *= spotEffect * punctualLightIntensityToIrradianceFactor( lightDistance, spotLight.distance, spotLight.decay );\n\t\t\tdirectLight.visible = true;\n\t\t} else {\n\t\t\tdirectLight.color = vec3( 0.0 );\n\t\t\tdirectLight.visible = false;\n\t\t}\n\t}\n#endif\n#if NUM_RECT_AREA_LIGHTS > 0\n\tstruct RectAreaLight {\n\t\tvec3 color;\n\t\tvec3 position;\n\t\tvec3 halfWidth;\n\t\tvec3 halfHeight;\n\t};\n\tuniform sampler2D ltc_1;\tuniform sampler2D ltc_2;\n\tuniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];\n#endif\n#if NUM_HEMI_LIGHTS > 0\n\tstruct HemisphereLight {\n\t\tvec3 direction;\n\t\tvec3 skyColor;\n\t\tvec3 groundColor;\n\t};\n\tuniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];\n\tvec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in GeometricContext geometry ) {\n\t\tfloat dotNL = dot( geometry.normal, hemiLight.direction );\n\t\tfloat hemiDiffuseWeight = 0.5 * dotNL + 0.5;\n\t\tvec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );\n\t\t#ifndef PHYSICALLY_CORRECT_LIGHTS\n\t\t\tirradiance *= PI;\n\t\t#endif\n\t\treturn irradiance;\n\t}\n#endif",
  envmap_physical_pars_fragment =
    "#if defined( USE_ENVMAP )\n\t#ifdef ENVMAP_MODE_REFRACTION\n\t\tuniform float refractionRatio;\n\t#endif\n\tvec3 getLightProbeIndirectIrradiance( const in GeometricContext geometry, const in int maxMIPLevel ) {\n\t\tvec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );\n\t\t#ifdef ENVMAP_TYPE_CUBE\n\t\t\tvec3 queryVec = vec3( flipEnvMap * worldNormal.x, worldNormal.yz );\n\t\t\t#ifdef TEXTURE_LOD_EXT\n\t\t\t\tvec4 envMapColor = textureCubeLodEXT( envMap, queryVec, float( maxMIPLevel ) );\n\t\t\t#else\n\t\t\t\tvec4 envMapColor = textureCube( envMap, queryVec, float( maxMIPLevel ) );\n\t\t\t#endif\n\t\t\tenvMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n\t\t#elif defined( ENVMAP_TYPE_CUBE_UV )\n\t\t\tvec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );\n\t\t#else\n\t\t\tvec4 envMapColor = vec4( 0.0 );\n\t\t#endif\n\t\treturn PI * envMapColor.rgb * envMapIntensity;\n\t}\n\tfloat getSpecularMIPLevel( const in float roughness, const in int maxMIPLevel ) {\n\t\tfloat maxMIPLevelScalar = float( maxMIPLevel );\n\t\tfloat sigma = PI * roughness * roughness / ( 1.0 + roughness );\n\t\tfloat desiredMIPLevel = maxMIPLevelScalar + log2( sigma );\n\t\treturn clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );\n\t}\n\tvec3 getLightProbeIndirectRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in int maxMIPLevel ) {\n\t\t#ifdef ENVMAP_MODE_REFLECTION\n\t\t\tvec3 reflectVec = reflect( -viewDir, normal );\n\t\t\treflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );\n\t\t#else\n\t\t\tvec3 reflectVec = refract( -viewDir, normal, refractionRatio );\n\t\t#endif\n\t\treflectVec = inverseTransformDirection( reflectVec, viewMatrix );\n\t\tfloat specularMIPLevel = getSpecularMIPLevel( roughness, maxMIPLevel );\n\t\t#ifdef ENVMAP_TYPE_CUBE\n\t\t\tvec3 queryReflectVec = vec3( flipEnvMap * reflectVec.x, reflectVec.yz );\n\t\t\t#ifdef TEXTURE_LOD_EXT\n\t\t\t\tvec4 envMapColor = textureCubeLodEXT( envMap, queryReflectVec, specularMIPLevel );\n\t\t\t#else\n\t\t\t\tvec4 envMapColor = textureCube( envMap, queryReflectVec, specularMIPLevel );\n\t\t\t#endif\n\t\t\tenvMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n\t\t#elif defined( ENVMAP_TYPE_CUBE_UV )\n\t\t\tvec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );\n\t\t#endif\n\t\treturn envMapColor.rgb * envMapIntensity;\n\t}\n#endif",
  lights_toon_fragment =
    "ToonMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;",
  lights_toon_pars_fragment =
    "varying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n#endif\nstruct ToonMaterial {\n\tvec3 diffuseColor;\n};\nvoid RE_Direct_Toon( const in IncidentLight directLight, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {\n\tvec3 irradiance = getGradientIrradiance( geometry.normal, directLight.direction ) * directLight.color;\n\t#ifndef PHYSICALLY_CORRECT_LIGHTS\n\t\tirradiance *= PI;\n\t#endif\n\treflectedLight.directDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {\n\treflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n}\n#define RE_Direct\t\t\t\tRE_Direct_Toon\n#define RE_IndirectDiffuse\t\tRE_IndirectDiffuse_Toon\n#define Material_LightProbeLOD( material )\t(0)",
  lights_phong_fragment =
    "BlinnPhongMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularColor = specular;\nmaterial.specularShininess = shininess;\nmaterial.specularStrength = specularStrength;",
  lights_phong_pars_fragment =
    "varying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n#endif\nstruct BlinnPhongMaterial {\n\tvec3 diffuseColor;\n\tvec3 specularColor;\n\tfloat specularShininess;\n\tfloat specularStrength;\n};\nvoid RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n\tfloat dotNL = saturate( dot( geometry.normal, directLight.direction ) );\n\tvec3 irradiance = dotNL * directLight.color;\n\t#ifndef PHYSICALLY_CORRECT_LIGHTS\n\t\tirradiance *= PI;\n\t#endif\n\treflectedLight.directDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n\treflectedLight.directSpecular += irradiance * BRDF_Specular_BlinnPhong( directLight, geometry, material.specularColor, material.specularShininess ) * material.specularStrength;\n}\nvoid RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n\treflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n}\n#define RE_Direct\t\t\t\tRE_Direct_BlinnPhong\n#define RE_IndirectDiffuse\t\tRE_IndirectDiffuse_BlinnPhong\n#define Material_LightProbeLOD( material )\t(0)",
  lights_physical_fragment =
    "PhysicalMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );\nvec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );\nfloat geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );\nmaterial.specularRoughness = max( roughnessFactor, 0.0525 );material.specularRoughness += geometryRoughness;\nmaterial.specularRoughness = min( material.specularRoughness, 1.0 );\n#ifdef REFLECTIVITY\n\tmaterial.specularColor = mix( vec3( MAXIMUM_SPECULAR_COEFFICIENT * pow2( reflectivity ) ), diffuseColor.rgb, metalnessFactor );\n#else\n\tmaterial.specularColor = mix( vec3( DEFAULT_SPECULAR_COEFFICIENT ), diffuseColor.rgb, metalnessFactor );\n#endif\n#ifdef CLEARCOAT\n\tmaterial.clearcoat = clearcoat;\n\tmaterial.clearcoatRoughness = clearcoatRoughness;\n\t#ifdef USE_CLEARCOATMAP\n\t\tmaterial.clearcoat *= texture2D( clearcoatMap, vUv ).x;\n\t#endif\n\t#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n\t\tmaterial.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vUv ).y;\n\t#endif\n\tmaterial.clearcoat = saturate( material.clearcoat );\tmaterial.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );\n\tmaterial.clearcoatRoughness += geometryRoughness;\n\tmaterial.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );\n#endif\n#ifdef USE_SHEEN\n\tmaterial.sheenColor = sheen;\n#endif",
  lights_physical_pars_fragment =
    "struct PhysicalMaterial {\n\tvec3 diffuseColor;\n\tfloat specularRoughness;\n\tvec3 specularColor;\n#ifdef CLEARCOAT\n\tfloat clearcoat;\n\tfloat clearcoatRoughness;\n#endif\n#ifdef USE_SHEEN\n\tvec3 sheenColor;\n#endif\n};\n#define MAXIMUM_SPECULAR_COEFFICIENT 0.16\n#define DEFAULT_SPECULAR_COEFFICIENT 0.04\nfloat clearcoatDHRApprox( const in float roughness, const in float dotNL ) {\n\treturn DEFAULT_SPECULAR_COEFFICIENT + ( 1.0 - DEFAULT_SPECULAR_COEFFICIENT ) * ( pow( 1.0 - dotNL, 5.0 ) * pow( 1.0 - roughness, 2.0 ) );\n}\n#if NUM_RECT_AREA_LIGHTS > 0\n\tvoid RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n\t\tvec3 normal = geometry.normal;\n\t\tvec3 viewDir = geometry.viewDir;\n\t\tvec3 position = geometry.position;\n\t\tvec3 lightPos = rectAreaLight.position;\n\t\tvec3 halfWidth = rectAreaLight.halfWidth;\n\t\tvec3 halfHeight = rectAreaLight.halfHeight;\n\t\tvec3 lightColor = rectAreaLight.color;\n\t\tfloat roughness = material.specularRoughness;\n\t\tvec3 rectCoords[ 4 ];\n\t\trectCoords[ 0 ] = lightPos + halfWidth - halfHeight;\t\trectCoords[ 1 ] = lightPos - halfWidth - halfHeight;\n\t\trectCoords[ 2 ] = lightPos - halfWidth + halfHeight;\n\t\trectCoords[ 3 ] = lightPos + halfWidth + halfHeight;\n\t\tvec2 uv = LTC_Uv( normal, viewDir, roughness );\n\t\tvec4 t1 = texture2D( ltc_1, uv );\n\t\tvec4 t2 = texture2D( ltc_2, uv );\n\t\tmat3 mInv = mat3(\n\t\t\tvec3( t1.x, 0, t1.y ),\n\t\t\tvec3(    0, 1,    0 ),\n\t\t\tvec3( t1.z, 0, t1.w )\n\t\t);\n\t\tvec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );\n\t\treflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );\n\t\treflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );\n\t}\n#endif\nvoid RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n\tfloat dotNL = saturate( dot( geometry.normal, directLight.direction ) );\n\tvec3 irradiance = dotNL * directLight.color;\n\t#ifndef PHYSICALLY_CORRECT_LIGHTS\n\t\tirradiance *= PI;\n\t#endif\n\t#ifdef CLEARCOAT\n\t\tfloat ccDotNL = saturate( dot( geometry.clearcoatNormal, directLight.direction ) );\n\t\tvec3 ccIrradiance = ccDotNL * directLight.color;\n\t\t#ifndef PHYSICALLY_CORRECT_LIGHTS\n\t\t\tccIrradiance *= PI;\n\t\t#endif\n\t\tfloat clearcoatDHR = material.clearcoat * clearcoatDHRApprox( material.clearcoatRoughness, ccDotNL );\n\t\treflectedLight.directSpecular += ccIrradiance * material.clearcoat * BRDF_Specular_GGX( directLight, geometry.viewDir, geometry.clearcoatNormal, vec3( DEFAULT_SPECULAR_COEFFICIENT ), material.clearcoatRoughness );\n\t#else\n\t\tfloat clearcoatDHR = 0.0;\n\t#endif\n\t#ifdef USE_SHEEN\n\t\treflectedLight.directSpecular += ( 1.0 - clearcoatDHR ) * irradiance * BRDF_Specular_Sheen(\n\t\t\tmaterial.specularRoughness,\n\t\t\tdirectLight.direction,\n\t\t\tgeometry,\n\t\t\tmaterial.sheenColor\n\t\t);\n\t#else\n\t\treflectedLight.directSpecular += ( 1.0 - clearcoatDHR ) * irradiance * BRDF_Specular_GGX( directLight, geometry.viewDir, geometry.normal, material.specularColor, material.specularRoughness);\n\t#endif\n\treflectedLight.directDiffuse += ( 1.0 - clearcoatDHR ) * irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n\treflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {\n\t#ifdef CLEARCOAT\n\t\tfloat ccDotNV = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );\n\t\treflectedLight.indirectSpecular += clearcoatRadiance * material.clearcoat * BRDF_Specular_GGX_Environment( geometry.viewDir, geometry.clearcoatNormal, vec3( DEFAULT_SPECULAR_COEFFICIENT ), material.clearcoatRoughness );\n\t\tfloat ccDotNL = ccDotNV;\n\t\tfloat clearcoatDHR = material.clearcoat * clearcoatDHRApprox( material.clearcoatRoughness, ccDotNL );\n\t#else\n\t\tfloat clearcoatDHR = 0.0;\n\t#endif\n\tfloat clearcoatInv = 1.0 - clearcoatDHR;\n\tvec3 singleScattering = vec3( 0.0 );\n\tvec3 multiScattering = vec3( 0.0 );\n\tvec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;\n\tBRDF_Specular_Multiscattering_Environment( geometry, material.specularColor, material.specularRoughness, singleScattering, multiScattering );\n\tvec3 diffuse = material.diffuseColor * ( 1.0 - ( singleScattering + multiScattering ) );\n\treflectedLight.indirectSpecular += clearcoatInv * radiance * singleScattering;\n\treflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;\n\treflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;\n}\n#define RE_Direct\t\t\t\tRE_Direct_Physical\n#define RE_Direct_RectArea\t\tRE_Direct_RectArea_Physical\n#define RE_IndirectDiffuse\t\tRE_IndirectDiffuse_Physical\n#define RE_IndirectSpecular\t\tRE_IndirectSpecular_Physical\nfloat computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {\n\treturn saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );\n}",
  lights_fragment_begin =
    "\nGeometricContext geometry;\ngeometry.position = - vViewPosition;\ngeometry.normal = normal;\ngeometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );\n#ifdef CLEARCOAT\n\tgeometry.clearcoatNormal = clearcoatNormal;\n#endif\nIncidentLight directLight;\n#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )\n\tPointLight pointLight;\n\t#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0\n\tPointLightShadow pointLightShadow;\n\t#endif\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n\t\tpointLight = pointLights[ i ];\n\t\tgetPointDirectLightIrradiance( pointLight, geometry, directLight );\n\t\t#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )\n\t\tpointLightShadow = pointLightShadows[ i ];\n\t\tdirectLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;\n\t\t#endif\n\t\tRE_Direct( directLight, geometry, material, reflectedLight );\n\t}\n\t#pragma unroll_loop_end\n#endif\n#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )\n\tSpotLight spotLight;\n\t#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0\n\tSpotLightShadow spotLightShadow;\n\t#endif\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n\t\tspotLight = spotLights[ i ];\n\t\tgetSpotDirectLightIrradiance( spotLight, geometry, directLight );\n\t\t#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n\t\tspotLightShadow = spotLightShadows[ i ];\n\t\tdirectLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;\n\t\t#endif\n\t\tRE_Direct( directLight, geometry, material, reflectedLight );\n\t}\n\t#pragma unroll_loop_end\n#endif\n#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )\n\tDirectionalLight directionalLight;\n\t#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0\n\tDirectionalLightShadow directionalLightShadow;\n\t#endif\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n\t\tdirectionalLight = directionalLights[ i ];\n\t\tgetDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );\n\t\t#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )\n\t\tdirectionalLightShadow = directionalLightShadows[ i ];\n\t\tdirectLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n\t\t#endif\n\t\tRE_Direct( directLight, geometry, material, reflectedLight );\n\t}\n\t#pragma unroll_loop_end\n#endif\n#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )\n\tRectAreaLight rectAreaLight;\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {\n\t\trectAreaLight = rectAreaLights[ i ];\n\t\tRE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );\n\t}\n\t#pragma unroll_loop_end\n#endif\n#if defined( RE_IndirectDiffuse )\n\tvec3 iblIrradiance = vec3( 0.0 );\n\tvec3 irradiance = getAmbientLightIrradiance( ambientLightColor );\n\tirradiance += getLightProbeIrradiance( lightProbe, geometry );\n\t#if ( NUM_HEMI_LIGHTS > 0 )\n\t\t#pragma unroll_loop_start\n\t\tfor ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n\t\t\tirradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );\n\t\t}\n\t\t#pragma unroll_loop_end\n\t#endif\n#endif\n#if defined( RE_IndirectSpecular )\n\tvec3 radiance = vec3( 0.0 );\n\tvec3 clearcoatRadiance = vec3( 0.0 );\n#endif",
  lights_fragment_maps =
    "#if defined( RE_IndirectDiffuse )\n\t#ifdef USE_LIGHTMAP\n\t\tvec4 lightMapTexel= texture2D( lightMap, vUv2 );\n\t\tvec3 lightMapIrradiance = lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;\n\t\t#ifndef PHYSICALLY_CORRECT_LIGHTS\n\t\t\tlightMapIrradiance *= PI;\n\t\t#endif\n\t\tirradiance += lightMapIrradiance;\n\t#endif\n\t#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )\n\t\tiblIrradiance += getLightProbeIndirectIrradiance( geometry, maxMipLevel );\n\t#endif\n#endif\n#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )\n\tradiance += getLightProbeIndirectRadiance( geometry.viewDir, geometry.normal, material.specularRoughness, maxMipLevel );\n\t#ifdef CLEARCOAT\n\t\tclearcoatRadiance += getLightProbeIndirectRadiance( geometry.viewDir, geometry.clearcoatNormal, material.clearcoatRoughness, maxMipLevel );\n\t#endif\n#endif",
  lights_fragment_end =
    "#if defined( RE_IndirectDiffuse )\n\tRE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );\n#endif\n#if defined( RE_IndirectSpecular )\n\tRE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );\n#endif",
  logdepthbuf_fragment =
    "#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )\n\tgl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;\n#endif",
  logdepthbuf_pars_fragment =
    "#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )\n\tuniform float logDepthBufFC;\n\tvarying float vFragDepth;\n\tvarying float vIsPerspective;\n#endif",
  logdepthbuf_pars_vertex =
    "#ifdef USE_LOGDEPTHBUF\n\t#ifdef USE_LOGDEPTHBUF_EXT\n\t\tvarying float vFragDepth;\n\t\tvarying float vIsPerspective;\n\t#else\n\t\tuniform float logDepthBufFC;\n\t#endif\n#endif",
  logdepthbuf_vertex =
    "#ifdef USE_LOGDEPTHBUF\n\t#ifdef USE_LOGDEPTHBUF_EXT\n\t\tvFragDepth = 1.0 + gl_Position.w;\n\t\tvIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );\n\t#else\n\t\tif ( isPerspectiveMatrix( projectionMatrix ) ) {\n\t\t\tgl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;\n\t\t\tgl_Position.z *= gl_Position.w;\n\t\t}\n\t#endif\n#endif",
  map_fragment =
    "#ifdef USE_MAP\n\tvec4 texelColor = texture2D( map, vUv );\n\ttexelColor = mapTexelToLinear( texelColor );\n\tdiffuseColor *= texelColor;\n#endif",
  map_pars_fragment = "#ifdef USE_MAP\n\tuniform sampler2D map;\n#endif",
  map_particle_fragment =
    "#if defined( USE_MAP ) || defined( USE_ALPHAMAP )\n\tvec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;\n#endif\n#ifdef USE_MAP\n\tvec4 mapTexel = texture2D( map, uv );\n\tdiffuseColor *= mapTexelToLinear( mapTexel );\n#endif\n#ifdef USE_ALPHAMAP\n\tdiffuseColor.a *= texture2D( alphaMap, uv ).g;\n#endif",
  map_particle_pars_fragment =
    "#if defined( USE_MAP ) || defined( USE_ALPHAMAP )\n\tuniform mat3 uvTransform;\n#endif\n#ifdef USE_MAP\n\tuniform sampler2D map;\n#endif\n#ifdef USE_ALPHAMAP\n\tuniform sampler2D alphaMap;\n#endif",
  metalnessmap_fragment =
    "float metalnessFactor = metalness;\n#ifdef USE_METALNESSMAP\n\tvec4 texelMetalness = texture2D( metalnessMap, vUv );\n\tmetalnessFactor *= texelMetalness.b;\n#endif",
  metalnessmap_pars_fragment =
    "#ifdef USE_METALNESSMAP\n\tuniform sampler2D metalnessMap;\n#endif",
  morphnormal_vertex =
    "#ifdef USE_MORPHNORMALS\n\tobjectNormal *= morphTargetBaseInfluence;\n\tobjectNormal += morphNormal0 * morphTargetInfluences[ 0 ];\n\tobjectNormal += morphNormal1 * morphTargetInfluences[ 1 ];\n\tobjectNormal += morphNormal2 * morphTargetInfluences[ 2 ];\n\tobjectNormal += morphNormal3 * morphTargetInfluences[ 3 ];\n#endif",
  morphtarget_pars_vertex =
    "#ifdef USE_MORPHTARGETS\n\tuniform float morphTargetBaseInfluence;\n\t#ifndef USE_MORPHNORMALS\n\t\tuniform float morphTargetInfluences[ 8 ];\n\t#else\n\t\tuniform float morphTargetInfluences[ 4 ];\n\t#endif\n#endif",
  morphtarget_vertex =
    "#ifdef USE_MORPHTARGETS\n\ttransformed *= morphTargetBaseInfluence;\n\ttransformed += morphTarget0 * morphTargetInfluences[ 0 ];\n\ttransformed += morphTarget1 * morphTargetInfluences[ 1 ];\n\ttransformed += morphTarget2 * morphTargetInfluences[ 2 ];\n\ttransformed += morphTarget3 * morphTargetInfluences[ 3 ];\n\t#ifndef USE_MORPHNORMALS\n\t\ttransformed += morphTarget4 * morphTargetInfluences[ 4 ];\n\t\ttransformed += morphTarget5 * morphTargetInfluences[ 5 ];\n\t\ttransformed += morphTarget6 * morphTargetInfluences[ 6 ];\n\t\ttransformed += morphTarget7 * morphTargetInfluences[ 7 ];\n\t#endif\n#endif",
  normal_fragment_begin =
    "#ifdef FLAT_SHADED\n\tvec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );\n\tvec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );\n\tvec3 normal = normalize( cross( fdx, fdy ) );\n#else\n\tvec3 normal = normalize( vNormal );\n\t#ifdef DOUBLE_SIDED\n\t\tnormal = normal * ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n\t#endif\n\t#ifdef USE_TANGENT\n\t\tvec3 tangent = normalize( vTangent );\n\t\tvec3 bitangent = normalize( vBitangent );\n\t\t#ifdef DOUBLE_SIDED\n\t\t\ttangent = tangent * ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n\t\t\tbitangent = bitangent * ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n\t\t#endif\n\t\t#if defined( TANGENTSPACE_NORMALMAP ) || defined( USE_CLEARCOAT_NORMALMAP )\n\t\t\tmat3 vTBN = mat3( tangent, bitangent, normal );\n\t\t#endif\n\t#endif\n#endif\nvec3 geometryNormal = normal;",
  normal_fragment_maps =
    "#ifdef OBJECTSPACE_NORMALMAP\n\tnormal = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;\n\t#ifdef FLIP_SIDED\n\t\tnormal = - normal;\n\t#endif\n\t#ifdef DOUBLE_SIDED\n\t\tnormal = normal * ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n\t#endif\n\tnormal = normalize( normalMatrix * normal );\n#elif defined( TANGENTSPACE_NORMALMAP )\n\tvec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;\n\tmapN.xy *= normalScale;\n\t#ifdef USE_TANGENT\n\t\tnormal = normalize( vTBN * mapN );\n\t#else\n\t\tnormal = perturbNormal2Arb( -vViewPosition, normal, mapN );\n\t#endif\n#elif defined( USE_BUMPMAP )\n\tnormal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n#endif",
  normalmap_pars_fragment =
    "#ifdef USE_NORMALMAP\n\tuniform sampler2D normalMap;\n\tuniform vec2 normalScale;\n#endif\n#ifdef OBJECTSPACE_NORMALMAP\n\tuniform mat3 normalMatrix;\n#endif\n#if ! defined ( USE_TANGENT ) && ( defined ( TANGENTSPACE_NORMALMAP ) || defined ( USE_CLEARCOAT_NORMALMAP ) )\n\tvec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 mapN ) {\n\t\tvec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );\n\t\tvec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );\n\t\tvec2 st0 = dFdx( vUv.st );\n\t\tvec2 st1 = dFdy( vUv.st );\n\t\tfloat scale = sign( st1.t * st0.s - st0.t * st1.s );\n\t\tvec3 S = normalize( ( q0 * st1.t - q1 * st0.t ) * scale );\n\t\tvec3 T = normalize( ( - q0 * st1.s + q1 * st0.s ) * scale );\n\t\tvec3 N = normalize( surf_norm );\n\t\tmat3 tsn = mat3( S, T, N );\n\t\tmapN.xy *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n\t\treturn normalize( tsn * mapN );\n\t}\n#endif",
  clearcoat_normal_fragment_begin =
    "#ifdef CLEARCOAT\n\tvec3 clearcoatNormal = geometryNormal;\n#endif",
  clearcoat_normal_fragment_maps =
    "#ifdef USE_CLEARCOAT_NORMALMAP\n\tvec3 clearcoatMapN = texture2D( clearcoatNormalMap, vUv ).xyz * 2.0 - 1.0;\n\tclearcoatMapN.xy *= clearcoatNormalScale;\n\t#ifdef USE_TANGENT\n\t\tclearcoatNormal = normalize( vTBN * clearcoatMapN );\n\t#else\n\t\tclearcoatNormal = perturbNormal2Arb( - vViewPosition, clearcoatNormal, clearcoatMapN );\n\t#endif\n#endif",
  clearcoat_pars_fragment =
    "#ifdef USE_CLEARCOATMAP\n\tuniform sampler2D clearcoatMap;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n\tuniform sampler2D clearcoatRoughnessMap;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n\tuniform sampler2D clearcoatNormalMap;\n\tuniform vec2 clearcoatNormalScale;\n#endif",
  packing =
    "vec3 packNormalToRGB( const in vec3 normal ) {\n\treturn normalize( normal ) * 0.5 + 0.5;\n}\nvec3 unpackRGBToNormal( const in vec3 rgb ) {\n\treturn 2.0 * rgb.xyz - 1.0;\n}\nconst float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\nconst float ShiftRight8 = 1. / 256.;\nvec4 packDepthToRGBA( const in float v ) {\n\tvec4 r = vec4( fract( v * PackFactors ), v );\n\tr.yzw -= r.xyz * ShiftRight8;\treturn r * PackUpscale;\n}\nfloat unpackRGBAToDepth( const in vec4 v ) {\n\treturn dot( v, UnpackFactors );\n}\nvec4 pack2HalfToRGBA( vec2 v ) {\n\tvec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ));\n\treturn vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w);\n}\nvec2 unpackRGBATo2Half( vec4 v ) {\n\treturn vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );\n}\nfloat viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {\n\treturn ( viewZ + near ) / ( near - far );\n}\nfloat orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {\n\treturn linearClipZ * ( near - far ) - near;\n}\nfloat viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {\n\treturn (( near + viewZ ) * far ) / (( far - near ) * viewZ );\n}\nfloat perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {\n\treturn ( near * far ) / ( ( far - near ) * invClipZ - far );\n}",
  premultiplied_alpha_fragment =
    "#ifdef PREMULTIPLIED_ALPHA\n\tgl_FragColor.rgb *= gl_FragColor.a;\n#endif",
  project_vertex =
    "vec4 mvPosition = vec4( transformed, 1.0 );\n#ifdef USE_INSTANCING\n\tmvPosition = instanceMatrix * mvPosition;\n#endif\nmvPosition = modelViewMatrix * mvPosition;\ngl_Position = projectionMatrix * mvPosition;",
  dithering_fragment =
    "#ifdef DITHERING\n\tgl_FragColor.rgb = dithering( gl_FragColor.rgb );\n#endif",
  dithering_pars_fragment =
    "#ifdef DITHERING\n\tvec3 dithering( vec3 color ) {\n\t\tfloat grid_position = rand( gl_FragCoord.xy );\n\t\tvec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );\n\t\tdither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );\n\t\treturn color + dither_shift_RGB;\n\t}\n#endif",
  roughnessmap_fragment =
    "float roughnessFactor = roughness;\n#ifdef USE_ROUGHNESSMAP\n\tvec4 texelRoughness = texture2D( roughnessMap, vUv );\n\troughnessFactor *= texelRoughness.g;\n#endif",
  roughnessmap_pars_fragment =
    "#ifdef USE_ROUGHNESSMAP\n\tuniform sampler2D roughnessMap;\n#endif",
  shadowmap_pars_fragment =
    "#ifdef USE_SHADOWMAP\n\t#if NUM_DIR_LIGHT_SHADOWS > 0\n\t\tuniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];\n\t\tvarying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];\n\t\tstruct DirectionalLightShadow {\n\t\t\tfloat shadowBias;\n\t\t\tfloat shadowNormalBias;\n\t\t\tfloat shadowRadius;\n\t\t\tvec2 shadowMapSize;\n\t\t};\n\t\tuniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];\n\t#endif\n\t#if NUM_SPOT_LIGHT_SHADOWS > 0\n\t\tuniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];\n\t\tvarying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHT_SHADOWS ];\n\t\tstruct SpotLightShadow {\n\t\t\tfloat shadowBias;\n\t\t\tfloat shadowNormalBias;\n\t\t\tfloat shadowRadius;\n\t\t\tvec2 shadowMapSize;\n\t\t};\n\t\tuniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];\n\t#endif\n\t#if NUM_POINT_LIGHT_SHADOWS > 0\n\t\tuniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];\n\t\tvarying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];\n\t\tstruct PointLightShadow {\n\t\t\tfloat shadowBias;\n\t\t\tfloat shadowNormalBias;\n\t\t\tfloat shadowRadius;\n\t\t\tvec2 shadowMapSize;\n\t\t\tfloat shadowCameraNear;\n\t\t\tfloat shadowCameraFar;\n\t\t};\n\t\tuniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];\n\t#endif\n\tfloat texture2DCompare( sampler2D depths, vec2 uv, float compare ) {\n\t\treturn step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );\n\t}\n\tvec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {\n\t\treturn unpackRGBATo2Half( texture2D( shadow, uv ) );\n\t}\n\tfloat VSMShadow (sampler2D shadow, vec2 uv, float compare ){\n\t\tfloat occlusion = 1.0;\n\t\tvec2 distribution = texture2DDistribution( shadow, uv );\n\t\tfloat hard_shadow = step( compare , distribution.x );\n\t\tif (hard_shadow != 1.0 ) {\n\t\t\tfloat distance = compare - distribution.x ;\n\t\t\tfloat variance = max( 0.00000, distribution.y * distribution.y );\n\t\t\tfloat softness_probability = variance / (variance + distance * distance );\t\t\tsoftness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );\t\t\tocclusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );\n\t\t}\n\t\treturn occlusion;\n\t}\n\tfloat getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n\t\tfloat shadow = 1.0;\n\t\tshadowCoord.xyz /= shadowCoord.w;\n\t\tshadowCoord.z += shadowBias;\n\t\tbvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n\t\tbool inFrustum = all( inFrustumVec );\n\t\tbvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n\t\tbool frustumTest = all( frustumTestVec );\n\t\tif ( frustumTest ) {\n\t\t#if defined( SHADOWMAP_TYPE_PCF )\n\t\t\tvec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n\t\t\tfloat dx0 = - texelSize.x * shadowRadius;\n\t\t\tfloat dy0 = - texelSize.y * shadowRadius;\n\t\t\tfloat dx1 = + texelSize.x * shadowRadius;\n\t\t\tfloat dy1 = + texelSize.y * shadowRadius;\n\t\t\tfloat dx2 = dx0 / 2.0;\n\t\t\tfloat dy2 = dy0 / 2.0;\n\t\t\tfloat dx3 = dx1 / 2.0;\n\t\t\tfloat dy3 = dy1 / 2.0;\n\t\t\tshadow = (\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n\t\t\t) * ( 1.0 / 17.0 );\n\t\t#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n\t\t\tvec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n\t\t\tfloat dx = texelSize.x;\n\t\t\tfloat dy = texelSize.y;\n\t\t\tvec2 uv = shadowCoord.xy;\n\t\t\tvec2 f = fract( uv * shadowMapSize + 0.5 );\n\t\t\tuv -= f * texelSize;\n\t\t\tshadow = (\n\t\t\t\ttexture2DCompare( shadowMap, uv, shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +\n\t\t\t\tmix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ), \n\t\t\t\t\t texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),\n\t\t\t\t\t f.x ) +\n\t\t\t\tmix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ), \n\t\t\t\t\t texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),\n\t\t\t\t\t f.x ) +\n\t\t\t\tmix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ), \n\t\t\t\t\t texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),\n\t\t\t\t\t f.y ) +\n\t\t\t\tmix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ), \n\t\t\t\t\t texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),\n\t\t\t\t\t f.y ) +\n\t\t\t\tmix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ), \n\t\t\t\t\t\t  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),\n\t\t\t\t\t\t  f.x ),\n\t\t\t\t\t mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ), \n\t\t\t\t\t\t  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),\n\t\t\t\t\t\t  f.x ),\n\t\t\t\t\t f.y )\n\t\t\t) * ( 1.0 / 9.0 );\n\t\t#elif defined( SHADOWMAP_TYPE_VSM )\n\t\t\tshadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );\n\t\t#else\n\t\t\tshadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );\n\t\t#endif\n\t\t}\n\t\treturn shadow;\n\t}\n\tvec2 cubeToUV( vec3 v, float texelSizeY ) {\n\t\tvec3 absV = abs( v );\n\t\tfloat scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );\n\t\tabsV *= scaleToCube;\n\t\tv *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );\n\t\tvec2 planar = v.xy;\n\t\tfloat almostATexel = 1.5 * texelSizeY;\n\t\tfloat almostOne = 1.0 - almostATexel;\n\t\tif ( absV.z >= almostOne ) {\n\t\t\tif ( v.z > 0.0 )\n\t\t\t\tplanar.x = 4.0 - v.x;\n\t\t} else if ( absV.x >= almostOne ) {\n\t\t\tfloat signX = sign( v.x );\n\t\t\tplanar.x = v.z * signX + 2.0 * signX;\n\t\t} else if ( absV.y >= almostOne ) {\n\t\t\tfloat signY = sign( v.y );\n\t\t\tplanar.x = v.x + 2.0 * signY + 2.0;\n\t\t\tplanar.y = v.z * signY - 2.0;\n\t\t}\n\t\treturn vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );\n\t}\n\tfloat getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {\n\t\tvec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );\n\t\tvec3 lightToPosition = shadowCoord.xyz;\n\t\tfloat dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );\t\tdp += shadowBias;\n\t\tvec3 bd3D = normalize( lightToPosition );\n\t\t#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )\n\t\t\tvec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;\n\t\t\treturn (\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )\n\t\t\t) * ( 1.0 / 9.0 );\n\t\t#else\n\t\t\treturn texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );\n\t\t#endif\n\t}\n#endif",
  shadowmap_pars_vertex =
    "#ifdef USE_SHADOWMAP\n\t#if NUM_DIR_LIGHT_SHADOWS > 0\n\t\tuniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];\n\t\tvarying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];\n\t\tstruct DirectionalLightShadow {\n\t\t\tfloat shadowBias;\n\t\t\tfloat shadowNormalBias;\n\t\t\tfloat shadowRadius;\n\t\t\tvec2 shadowMapSize;\n\t\t};\n\t\tuniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];\n\t#endif\n\t#if NUM_SPOT_LIGHT_SHADOWS > 0\n\t\tuniform mat4 spotShadowMatrix[ NUM_SPOT_LIGHT_SHADOWS ];\n\t\tvarying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHT_SHADOWS ];\n\t\tstruct SpotLightShadow {\n\t\t\tfloat shadowBias;\n\t\t\tfloat shadowNormalBias;\n\t\t\tfloat shadowRadius;\n\t\t\tvec2 shadowMapSize;\n\t\t};\n\t\tuniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];\n\t#endif\n\t#if NUM_POINT_LIGHT_SHADOWS > 0\n\t\tuniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];\n\t\tvarying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];\n\t\tstruct PointLightShadow {\n\t\t\tfloat shadowBias;\n\t\t\tfloat shadowNormalBias;\n\t\t\tfloat shadowRadius;\n\t\t\tvec2 shadowMapSize;\n\t\t\tfloat shadowCameraNear;\n\t\t\tfloat shadowCameraFar;\n\t\t};\n\t\tuniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];\n\t#endif\n#endif",
  shadowmap_vertex =
    "#ifdef USE_SHADOWMAP\n\t#if NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SPOT_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0\n\t\tvec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );\n\t\tvec4 shadowWorldPosition;\n\t#endif\n\t#if NUM_DIR_LIGHT_SHADOWS > 0\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {\n\t\tshadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );\n\t\tvDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;\n\t}\n\t#pragma unroll_loop_end\n\t#endif\n\t#if NUM_SPOT_LIGHT_SHADOWS > 0\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {\n\t\tshadowWorldPosition = worldPosition + vec4( shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias, 0 );\n\t\tvSpotShadowCoord[ i ] = spotShadowMatrix[ i ] * shadowWorldPosition;\n\t}\n\t#pragma unroll_loop_end\n\t#endif\n\t#if NUM_POINT_LIGHT_SHADOWS > 0\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {\n\t\tshadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );\n\t\tvPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;\n\t}\n\t#pragma unroll_loop_end\n\t#endif\n#endif",
  shadowmask_pars_fragment =
    "float getShadowMask() {\n\tfloat shadow = 1.0;\n\t#ifdef USE_SHADOWMAP\n\t#if NUM_DIR_LIGHT_SHADOWS > 0\n\tDirectionalLightShadow directionalLight;\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {\n\t\tdirectionalLight = directionalLightShadows[ i ];\n\t\tshadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n\t}\n\t#pragma unroll_loop_end\n\t#endif\n\t#if NUM_SPOT_LIGHT_SHADOWS > 0\n\tSpotLightShadow spotLight;\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {\n\t\tspotLight = spotLightShadows[ i ];\n\t\tshadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;\n\t}\n\t#pragma unroll_loop_end\n\t#endif\n\t#if NUM_POINT_LIGHT_SHADOWS > 0\n\tPointLightShadow pointLight;\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {\n\t\tpointLight = pointLightShadows[ i ];\n\t\tshadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;\n\t}\n\t#pragma unroll_loop_end\n\t#endif\n\t#endif\n\treturn shadow;\n}",
  skinbase_vertex =
    "#ifdef USE_SKINNING\n\tmat4 boneMatX = getBoneMatrix( skinIndex.x );\n\tmat4 boneMatY = getBoneMatrix( skinIndex.y );\n\tmat4 boneMatZ = getBoneMatrix( skinIndex.z );\n\tmat4 boneMatW = getBoneMatrix( skinIndex.w );\n#endif",
  skinning_pars_vertex =
    "#ifdef USE_SKINNING\n\tuniform mat4 bindMatrix;\n\tuniform mat4 bindMatrixInverse;\n\t#ifdef BONE_TEXTURE\n\t\tuniform highp sampler2D boneTexture;\n\t\tuniform int boneTextureSize;\n\t\tmat4 getBoneMatrix( const in float i ) {\n\t\t\tfloat j = i * 4.0;\n\t\t\tfloat x = mod( j, float( boneTextureSize ) );\n\t\t\tfloat y = floor( j / float( boneTextureSize ) );\n\t\t\tfloat dx = 1.0 / float( boneTextureSize );\n\t\t\tfloat dy = 1.0 / float( boneTextureSize );\n\t\t\ty = dy * ( y + 0.5 );\n\t\t\tvec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n\t\t\tvec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n\t\t\tvec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n\t\t\tvec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n\t\t\tmat4 bone = mat4( v1, v2, v3, v4 );\n\t\t\treturn bone;\n\t\t}\n\t#else\n\t\tuniform mat4 boneMatrices[ MAX_BONES ];\n\t\tmat4 getBoneMatrix( const in float i ) {\n\t\t\tmat4 bone = boneMatrices[ int(i) ];\n\t\t\treturn bone;\n\t\t}\n\t#endif\n#endif",
  skinning_vertex =
    "#ifdef USE_SKINNING\n\tvec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );\n\tvec4 skinned = vec4( 0.0 );\n\tskinned += boneMatX * skinVertex * skinWeight.x;\n\tskinned += boneMatY * skinVertex * skinWeight.y;\n\tskinned += boneMatZ * skinVertex * skinWeight.z;\n\tskinned += boneMatW * skinVertex * skinWeight.w;\n\ttransformed = ( bindMatrixInverse * skinned ).xyz;\n#endif",
  skinnormal_vertex =
    "#ifdef USE_SKINNING\n\tmat4 skinMatrix = mat4( 0.0 );\n\tskinMatrix += skinWeight.x * boneMatX;\n\tskinMatrix += skinWeight.y * boneMatY;\n\tskinMatrix += skinWeight.z * boneMatZ;\n\tskinMatrix += skinWeight.w * boneMatW;\n\tskinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;\n\tobjectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n\t#ifdef USE_TANGENT\n\t\tobjectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;\n\t#endif\n#endif",
  specularmap_fragment =
    "float specularStrength;\n#ifdef USE_SPECULARMAP\n\tvec4 texelSpecular = texture2D( specularMap, vUv );\n\tspecularStrength = texelSpecular.r;\n#else\n\tspecularStrength = 1.0;\n#endif",
  specularmap_pars_fragment =
    "#ifdef USE_SPECULARMAP\n\tuniform sampler2D specularMap;\n#endif",
  tonemapping_fragment =
    "#if defined( TONE_MAPPING )\n\tgl_FragColor.rgb = toneMapping( gl_FragColor.rgb );\n#endif",
  tonemapping_pars_fragment =
    "#ifndef saturate\n#define saturate(a) clamp( a, 0.0, 1.0 )\n#endif\nuniform float toneMappingExposure;\nvec3 LinearToneMapping( vec3 color ) {\n\treturn toneMappingExposure * color;\n}\nvec3 ReinhardToneMapping( vec3 color ) {\n\tcolor *= toneMappingExposure;\n\treturn saturate( color / ( vec3( 1.0 ) + color ) );\n}\nvec3 OptimizedCineonToneMapping( vec3 color ) {\n\tcolor *= toneMappingExposure;\n\tcolor = max( vec3( 0.0 ), color - 0.004 );\n\treturn pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );\n}\nvec3 RRTAndODTFit( vec3 v ) {\n\tvec3 a = v * ( v + 0.0245786 ) - 0.000090537;\n\tvec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;\n\treturn a / b;\n}\nvec3 ACESFilmicToneMapping( vec3 color ) {\n\tconst mat3 ACESInputMat = mat3(\n\t\tvec3( 0.59719, 0.07600, 0.02840 ),\t\tvec3( 0.35458, 0.90834, 0.13383 ),\n\t\tvec3( 0.04823, 0.01566, 0.83777 )\n\t);\n\tconst mat3 ACESOutputMat = mat3(\n\t\tvec3(  1.60475, -0.10208, -0.00327 ),\t\tvec3( -0.53108,  1.10813, -0.07276 ),\n\t\tvec3( -0.07367, -0.00605,  1.07602 )\n\t);\n\tcolor *= toneMappingExposure / 0.6;\n\tcolor = ACESInputMat * color;\n\tcolor = RRTAndODTFit( color );\n\tcolor = ACESOutputMat * color;\n\treturn saturate( color );\n}\nvec3 CustomToneMapping( vec3 color ) { return color; }",
  transmissionmap_fragment =
    "#ifdef USE_TRANSMISSIONMAP\n\ttotalTransmission *= texture2D( transmissionMap, vUv ).r;\n#endif",
  transmissionmap_pars_fragment =
    "#ifdef USE_TRANSMISSIONMAP\n\tuniform sampler2D transmissionMap;\n#endif",
  uv_pars_fragment =
    "#if ( defined( USE_UV ) && ! defined( UVS_VERTEX_ONLY ) )\n\tvarying vec2 vUv;\n#endif",
  uv_pars_vertex =
    "#ifdef USE_UV\n\t#ifdef UVS_VERTEX_ONLY\n\t\tvec2 vUv;\n\t#else\n\t\tvarying vec2 vUv;\n\t#endif\n\tuniform mat3 uvTransform;\n#endif",
  uv_vertex =
    "#ifdef USE_UV\n\tvUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n#endif",
  uv2_pars_fragment =
    "#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n\tvarying vec2 vUv2;\n#endif",
  uv2_pars_vertex =
    "#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n\tattribute vec2 uv2;\n\tvarying vec2 vUv2;\n\tuniform mat3 uv2Transform;\n#endif",
  uv2_vertex =
    "#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n\tvUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;\n#endif",
  worldpos_vertex =
    "#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP )\n\tvec4 worldPosition = vec4( transformed, 1.0 );\n\t#ifdef USE_INSTANCING\n\t\tworldPosition = instanceMatrix * worldPosition;\n\t#endif\n\tworldPosition = modelMatrix * worldPosition;\n#endif",
  background_frag =
    "uniform sampler2D t2D;\nvarying vec2 vUv;\nvoid main() {\n\tvec4 texColor = texture2D( t2D, vUv );\n\tgl_FragColor = mapTexelToLinear( texColor );\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n}",
  background_vert =
    "varying vec2 vUv;\nuniform mat3 uvTransform;\nvoid main() {\n\tvUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n\tgl_Position = vec4( position.xy, 1.0, 1.0 );\n}",
  cube_frag =
    "#include <envmap_common_pars_fragment>\nuniform float opacity;\nvarying vec3 vWorldDirection;\n#include <cube_uv_reflection_fragment>\nvoid main() {\n\tvec3 vReflect = vWorldDirection;\n\t#include <envmap_fragment>\n\tgl_FragColor = envColor;\n\tgl_FragColor.a *= opacity;\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n}",
  cube_vert =
    "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n\tvWorldDirection = transformDirection( position, modelMatrix );\n\t#include <begin_vertex>\n\t#include <project_vertex>\n\tgl_Position.z = gl_Position.w;\n}",
  depth_frag =
    "#if DEPTH_PACKING == 3200\n\tuniform float opacity;\n#endif\n#include <common>\n#include <packing>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvarying vec2 vHighPrecisionZW;\nvoid main() {\n\t#include <clipping_planes_fragment>\n\tvec4 diffuseColor = vec4( 1.0 );\n\t#if DEPTH_PACKING == 3200\n\t\tdiffuseColor.a = opacity;\n\t#endif\n\t#include <map_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <logdepthbuf_fragment>\n\tfloat fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;\n\t#if DEPTH_PACKING == 3200\n\t\tgl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );\n\t#elif DEPTH_PACKING == 3201\n\t\tgl_FragColor = packDepthToRGBA( fragCoordZ );\n\t#endif\n}",
  depth_vert =
    "#include <common>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvarying vec2 vHighPrecisionZW;\nvoid main() {\n\t#include <uv_vertex>\n\t#include <skinbase_vertex>\n\t#ifdef USE_DISPLACEMENTMAP\n\t\t#include <beginnormal_vertex>\n\t\t#include <morphnormal_vertex>\n\t\t#include <skinnormal_vertex>\n\t#endif\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\tvHighPrecisionZW = gl_Position.zw;\n}",
  distanceRGBA_frag =
    "#define DISTANCE\nuniform vec3 referencePosition;\nuniform float nearDistance;\nuniform float farDistance;\nvarying vec3 vWorldPosition;\n#include <common>\n#include <packing>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main () {\n\t#include <clipping_planes_fragment>\n\tvec4 diffuseColor = vec4( 1.0 );\n\t#include <map_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\tfloat dist = length( vWorldPosition - referencePosition );\n\tdist = ( dist - nearDistance ) / ( farDistance - nearDistance );\n\tdist = saturate( dist );\n\tgl_FragColor = packDepthToRGBA( dist );\n}",
  distanceRGBA_vert =
    "#define DISTANCE\nvarying vec3 vWorldPosition;\n#include <common>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <skinbase_vertex>\n\t#ifdef USE_DISPLACEMENTMAP\n\t\t#include <beginnormal_vertex>\n\t\t#include <morphnormal_vertex>\n\t\t#include <skinnormal_vertex>\n\t#endif\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <worldpos_vertex>\n\t#include <clipping_planes_vertex>\n\tvWorldPosition = worldPosition.xyz;\n}",
  equirect_frag =
    "uniform sampler2D tEquirect;\nvarying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n\tvec3 direction = normalize( vWorldDirection );\n\tvec2 sampleUV = equirectUv( direction );\n\tvec4 texColor = texture2D( tEquirect, sampleUV );\n\tgl_FragColor = mapTexelToLinear( texColor );\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n}",
  equirect_vert =
    "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n\tvWorldDirection = transformDirection( position, modelMatrix );\n\t#include <begin_vertex>\n\t#include <project_vertex>\n}",
  linedashed_frag =
    "uniform vec3 diffuse;\nuniform float opacity;\nuniform float dashSize;\nuniform float totalSize;\nvarying float vLineDistance;\n#include <common>\n#include <color_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\t#include <clipping_planes_fragment>\n\tif ( mod( vLineDistance, totalSize ) > dashSize ) {\n\t\tdiscard;\n\t}\n\tvec3 outgoingLight = vec3( 0.0 );\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\t#include <logdepthbuf_fragment>\n\t#include <color_fragment>\n\toutgoingLight = diffuseColor.rgb;\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n}",
  linedashed_vert =
    "uniform float scale;\nattribute float lineDistance;\nvarying float vLineDistance;\n#include <common>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\tvLineDistance = scale * lineDistance;\n\t#include <color_vertex>\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\t#include <fog_vertex>\n}",
  meshbasic_frag =
    "uniform vec3 diffuse;\nuniform float opacity;\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n#endif\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <cube_uv_reflection_fragment>\n#include <fog_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\t#include <clipping_planes_fragment>\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <specularmap_fragment>\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\t#ifdef USE_LIGHTMAP\n\t\n\t\tvec4 lightMapTexel= texture2D( lightMap, vUv2 );\n\t\treflectedLight.indirectDiffuse += lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;\n\t#else\n\t\treflectedLight.indirectDiffuse += vec3( 1.0 );\n\t#endif\n\t#include <aomap_fragment>\n\treflectedLight.indirectDiffuse *= diffuseColor.rgb;\n\tvec3 outgoingLight = reflectedLight.indirectDiffuse;\n\t#include <envmap_fragment>\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\t#include <dithering_fragment>\n}",
  meshbasic_vert =
    "#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <uv2_vertex>\n\t#include <color_vertex>\n\t#include <skinbase_vertex>\n\t#ifdef USE_ENVMAP\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\t#endif\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <worldpos_vertex>\n\t#include <clipping_planes_vertex>\n\t#include <envmap_vertex>\n\t#include <fog_vertex>\n}",
  meshlambert_frag =
    "uniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\nvarying vec3 vLightFront;\nvarying vec3 vIndirectFront;\n#ifdef DOUBLE_SIDED\n\tvarying vec3 vLightBack;\n\tvarying vec3 vIndirectBack;\n#endif\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <cube_uv_reflection_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <fog_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\t#include <clipping_planes_fragment>\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\tvec3 totalEmissiveRadiance = emissive;\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <specularmap_fragment>\n\t#include <emissivemap_fragment>\n\t#ifdef DOUBLE_SIDED\n\t\treflectedLight.indirectDiffuse += ( gl_FrontFacing ) ? vIndirectFront : vIndirectBack;\n\t#else\n\t\treflectedLight.indirectDiffuse += vIndirectFront;\n\t#endif\n\t#include <lightmap_fragment>\n\treflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb );\n\t#ifdef DOUBLE_SIDED\n\t\treflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;\n\t#else\n\t\treflectedLight.directDiffuse = vLightFront;\n\t#endif\n\treflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb ) * getShadowMask();\n\t#include <aomap_fragment>\n\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n\t#include <envmap_fragment>\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\t#include <dithering_fragment>\n}",
  meshlambert_vert =
    "#define LAMBERT\nvarying vec3 vLightFront;\nvarying vec3 vIndirectFront;\n#ifdef DOUBLE_SIDED\n\tvarying vec3 vLightBack;\n\tvarying vec3 vIndirectBack;\n#endif\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <envmap_pars_vertex>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <uv2_vertex>\n\t#include <color_vertex>\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\t#include <worldpos_vertex>\n\t#include <envmap_vertex>\n\t#include <lights_lambert_vertex>\n\t#include <shadowmap_vertex>\n\t#include <fog_vertex>\n}",
  meshmatcap_frag =
    "#define MATCAP\nuniform vec3 diffuse;\nuniform float opacity;\nuniform sampler2D matcap;\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n#endif\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\t#include <clipping_planes_fragment>\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <normal_fragment_begin>\n\t#include <normal_fragment_maps>\n\tvec3 viewDir = normalize( vViewPosition );\n\tvec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );\n\tvec3 y = cross( viewDir, x );\n\tvec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;\n\t#ifdef USE_MATCAP\n\t\tvec4 matcapColor = texture2D( matcap, uv );\n\t\tmatcapColor = matcapTexelToLinear( matcapColor );\n\t#else\n\t\tvec4 matcapColor = vec4( 1.0 );\n\t#endif\n\tvec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\t#include <dithering_fragment>\n}",
  meshmatcap_vert =
    "#define MATCAP\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n#endif\n#include <common>\n#include <uv_pars_vertex>\n#include <color_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <color_vertex>\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\t#ifndef FLAT_SHADED\n\t\tvNormal = normalize( transformedNormal );\n\t#endif\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\t#include <fog_vertex>\n\tvViewPosition = - mvPosition.xyz;\n}",
  meshtoon_frag =
    "#define TOON\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <gradientmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <lights_toon_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\t#include <clipping_planes_fragment>\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\tvec3 totalEmissiveRadiance = emissive;\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <normal_fragment_begin>\n\t#include <normal_fragment_maps>\n\t#include <emissivemap_fragment>\n\t#include <lights_toon_fragment>\n\t#include <lights_fragment_begin>\n\t#include <lights_fragment_maps>\n\t#include <lights_fragment_end>\n\t#include <aomap_fragment>\n\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\t#include <dithering_fragment>\n}",
  meshtoon_vert =
    "#define TOON\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n#endif\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <uv2_vertex>\n\t#include <color_vertex>\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n#ifndef FLAT_SHADED\n\tvNormal = normalize( transformedNormal );\n#endif\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\tvViewPosition = - mvPosition.xyz;\n\t#include <worldpos_vertex>\n\t#include <shadowmap_vertex>\n\t#include <fog_vertex>\n}",
  meshphong_frag =
    "#define PHONG\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <cube_uv_reflection_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <lights_phong_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\t#include <clipping_planes_fragment>\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\tvec3 totalEmissiveRadiance = emissive;\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <specularmap_fragment>\n\t#include <normal_fragment_begin>\n\t#include <normal_fragment_maps>\n\t#include <emissivemap_fragment>\n\t#include <lights_phong_fragment>\n\t#include <lights_fragment_begin>\n\t#include <lights_fragment_maps>\n\t#include <lights_fragment_end>\n\t#include <aomap_fragment>\n\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n\t#include <envmap_fragment>\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\t#include <dithering_fragment>\n}",
  meshphong_vert =
    "#define PHONG\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n#endif\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <uv2_vertex>\n\t#include <color_vertex>\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n#ifndef FLAT_SHADED\n\tvNormal = normalize( transformedNormal );\n#endif\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\tvViewPosition = - mvPosition.xyz;\n\t#include <worldpos_vertex>\n\t#include <envmap_vertex>\n\t#include <shadowmap_vertex>\n\t#include <fog_vertex>\n}",
  meshphysical_frag =
    "#define STANDARD\n#ifdef PHYSICAL\n\t#define REFLECTIVITY\n\t#define CLEARCOAT\n\t#define TRANSMISSION\n#endif\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float roughness;\nuniform float metalness;\nuniform float opacity;\n#ifdef TRANSMISSION\n\tuniform float transmission;\n#endif\n#ifdef REFLECTIVITY\n\tuniform float reflectivity;\n#endif\n#ifdef CLEARCOAT\n\tuniform float clearcoat;\n\tuniform float clearcoatRoughness;\n#endif\n#ifdef USE_SHEEN\n\tuniform vec3 sheen;\n#endif\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n\t#ifdef USE_TANGENT\n\t\tvarying vec3 vTangent;\n\t\tvarying vec3 vBitangent;\n\t#endif\n#endif\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <transmissionmap_pars_fragment>\n#include <bsdfs>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <lights_pars_begin>\n#include <lights_physical_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <clearcoat_pars_fragment>\n#include <roughnessmap_pars_fragment>\n#include <metalnessmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\t#include <clipping_planes_fragment>\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\tvec3 totalEmissiveRadiance = emissive;\n\t#ifdef TRANSMISSION\n\t\tfloat totalTransmission = transmission;\n\t#endif\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <roughnessmap_fragment>\n\t#include <metalnessmap_fragment>\n\t#include <normal_fragment_begin>\n\t#include <normal_fragment_maps>\n\t#include <clearcoat_normal_fragment_begin>\n\t#include <clearcoat_normal_fragment_maps>\n\t#include <emissivemap_fragment>\n\t#include <transmissionmap_fragment>\n\t#include <lights_physical_fragment>\n\t#include <lights_fragment_begin>\n\t#include <lights_fragment_maps>\n\t#include <lights_fragment_end>\n\t#include <aomap_fragment>\n\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n\t#ifdef TRANSMISSION\n\t\tdiffuseColor.a *= mix( saturate( 1. - totalTransmission + linearToRelativeLuminance( reflectedLight.directSpecular + reflectedLight.indirectSpecular ) ), 1.0, metalness );\n\t#endif\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\t#include <dithering_fragment>\n}",
  meshphysical_vert =
    "#define STANDARD\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n\t#ifdef USE_TANGENT\n\t\tvarying vec3 vTangent;\n\t\tvarying vec3 vBitangent;\n\t#endif\n#endif\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <uv2_vertex>\n\t#include <color_vertex>\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n#ifndef FLAT_SHADED\n\tvNormal = normalize( transformedNormal );\n\t#ifdef USE_TANGENT\n\t\tvTangent = normalize( transformedTangent );\n\t\tvBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );\n\t#endif\n#endif\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\tvViewPosition = - mvPosition.xyz;\n\t#include <worldpos_vertex>\n\t#include <shadowmap_vertex>\n\t#include <fog_vertex>\n}",
  normal_frag =
    "#define NORMAL\nuniform float opacity;\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )\n\tvarying vec3 vViewPosition;\n#endif\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n\t#ifdef USE_TANGENT\n\t\tvarying vec3 vTangent;\n\t\tvarying vec3 vBitangent;\n\t#endif\n#endif\n#include <packing>\n#include <uv_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\t#include <clipping_planes_fragment>\n\t#include <logdepthbuf_fragment>\n\t#include <normal_fragment_begin>\n\t#include <normal_fragment_maps>\n\tgl_FragColor = vec4( packNormalToRGB( normal ), opacity );\n}",
  normal_vert =
    "#define NORMAL\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )\n\tvarying vec3 vViewPosition;\n#endif\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n\t#ifdef USE_TANGENT\n\t\tvarying vec3 vTangent;\n\t\tvarying vec3 vBitangent;\n\t#endif\n#endif\n#include <common>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n#ifndef FLAT_SHADED\n\tvNormal = normalize( transformedNormal );\n\t#ifdef USE_TANGENT\n\t\tvTangent = normalize( transformedTangent );\n\t\tvBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );\n\t#endif\n#endif\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )\n\tvViewPosition = - mvPosition.xyz;\n#endif\n}",
  points_frag =
    "uniform vec3 diffuse;\nuniform float opacity;\n#include <common>\n#include <color_pars_fragment>\n#include <map_particle_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\t#include <clipping_planes_fragment>\n\tvec3 outgoingLight = vec3( 0.0 );\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\t#include <logdepthbuf_fragment>\n\t#include <map_particle_fragment>\n\t#include <color_fragment>\n\t#include <alphatest_fragment>\n\toutgoingLight = diffuseColor.rgb;\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n}",
  points_vert =
    "uniform float size;\nuniform float scale;\n#include <common>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <color_vertex>\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <project_vertex>\n\tgl_PointSize = size;\n\t#ifdef USE_SIZEATTENUATION\n\t\tbool isPerspective = isPerspectiveMatrix( projectionMatrix );\n\t\tif ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );\n\t#endif\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\t#include <worldpos_vertex>\n\t#include <fog_vertex>\n}",
  shadow_frag =
    "uniform vec3 color;\nuniform float opacity;\n#include <common>\n#include <packing>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>\nvoid main() {\n\tgl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n\t#include <fog_fragment>\n}",
  shadow_vert =
    "#include <common>\n#include <fog_pars_vertex>\n#include <shadowmap_pars_vertex>\nvoid main() {\n\t#include <begin_vertex>\n\t#include <project_vertex>\n\t#include <worldpos_vertex>\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\t#include <shadowmap_vertex>\n\t#include <fog_vertex>\n}",
  sprite_frag =
    "uniform vec3 diffuse;\nuniform float opacity;\n#include <common>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\t#include <clipping_planes_fragment>\n\tvec3 outgoingLight = vec3( 0.0 );\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\toutgoingLight = diffuseColor.rgb;\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n\t#include <fog_fragment>\n}",
  sprite_vert =
    "uniform float rotation;\nuniform vec2 center;\n#include <common>\n#include <uv_pars_vertex>\n#include <fog_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\tvec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );\n\tvec2 scale;\n\tscale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );\n\tscale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );\n\t#ifndef USE_SIZEATTENUATION\n\t\tbool isPerspective = isPerspectiveMatrix( projectionMatrix );\n\t\tif ( isPerspective ) scale *= - mvPosition.z;\n\t#endif\n\tvec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;\n\tvec2 rotatedPosition;\n\trotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;\n\trotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;\n\tmvPosition.xy += rotatedPosition;\n\tgl_Position = projectionMatrix * mvPosition;\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\t#include <fog_vertex>\n}";
const ShaderChunk = {
    alphamap_fragment: alphamap_fragment,
    alphamap_pars_fragment: alphamap_pars_fragment,
    alphatest_fragment: alphatest_fragment,
    aomap_fragment: aomap_fragment,
    aomap_pars_fragment: aomap_pars_fragment,
    begin_vertex: begin_vertex,
    beginnormal_vertex: beginnormal_vertex,
    bsdfs: bsdfs,
    bumpmap_pars_fragment: bumpmap_pars_fragment,
    clipping_planes_fragment: clipping_planes_fragment,
    clipping_planes_pars_fragment: clipping_planes_pars_fragment,
    clipping_planes_pars_vertex: clipping_planes_pars_vertex,
    clipping_planes_vertex: clipping_planes_vertex,
    color_fragment: color_fragment,
    color_pars_fragment: color_pars_fragment,
    color_pars_vertex: color_pars_vertex,
    color_vertex: color_vertex,
    common: common,
    cube_uv_reflection_fragment: cube_uv_reflection_fragment,
    defaultnormal_vertex: defaultnormal_vertex,
    displacementmap_pars_vertex: displacementmap_pars_vertex,
    displacementmap_vertex: displacementmap_vertex,
    emissivemap_fragment: emissivemap_fragment,
    emissivemap_pars_fragment: emissivemap_pars_fragment,
    encodings_fragment: encodings_fragment,
    encodings_pars_fragment: encodings_pars_fragment,
    envmap_fragment: envmap_fragment,
    envmap_common_pars_fragment: envmap_common_pars_fragment,
    envmap_pars_fragment: envmap_pars_fragment,
    envmap_pars_vertex: envmap_pars_vertex,
    envmap_physical_pars_fragment: envmap_physical_pars_fragment,
    envmap_vertex: envmap_vertex,
    fog_vertex: fog_vertex,
    fog_pars_vertex: fog_pars_vertex,
    fog_fragment: fog_fragment,
    fog_pars_fragment: fog_pars_fragment,
    gradientmap_pars_fragment: gradientmap_pars_fragment,
    lightmap_fragment: lightmap_fragment,
    lightmap_pars_fragment: lightmap_pars_fragment,
    lights_lambert_vertex: lights_lambert_vertex,
    lights_pars_begin: lights_pars_begin,
    lights_toon_fragment: lights_toon_fragment,
    lights_toon_pars_fragment: lights_toon_pars_fragment,
    lights_phong_fragment: lights_phong_fragment,
    lights_phong_pars_fragment: lights_phong_pars_fragment,
    lights_physical_fragment: lights_physical_fragment,
    lights_physical_pars_fragment: lights_physical_pars_fragment,
    lights_fragment_begin: lights_fragment_begin,
    lights_fragment_maps: lights_fragment_maps,
    lights_fragment_end: lights_fragment_end,
    logdepthbuf_fragment: logdepthbuf_fragment,
    logdepthbuf_pars_fragment: logdepthbuf_pars_fragment,
    logdepthbuf_pars_vertex: logdepthbuf_pars_vertex,
    logdepthbuf_vertex: logdepthbuf_vertex,
    map_fragment: map_fragment,
    map_pars_fragment: map_pars_fragment,
    map_particle_fragment: map_particle_fragment,
    map_particle_pars_fragment: map_particle_pars_fragment,
    metalnessmap_fragment: metalnessmap_fragment,
    metalnessmap_pars_fragment: metalnessmap_pars_fragment,
    morphnormal_vertex: morphnormal_vertex,
    morphtarget_pars_vertex: morphtarget_pars_vertex,
    morphtarget_vertex: morphtarget_vertex,
    normal_fragment_begin: normal_fragment_begin,
    normal_fragment_maps: normal_fragment_maps,
    normalmap_pars_fragment: normalmap_pars_fragment,
    clearcoat_normal_fragment_begin: clearcoat_normal_fragment_begin,
    clearcoat_normal_fragment_maps: clearcoat_normal_fragment_maps,
    clearcoat_pars_fragment: clearcoat_pars_fragment,
    packing: packing,
    premultiplied_alpha_fragment: premultiplied_alpha_fragment,
    project_vertex: project_vertex,
    dithering_fragment: dithering_fragment,
    dithering_pars_fragment: dithering_pars_fragment,
    roughnessmap_fragment: roughnessmap_fragment,
    roughnessmap_pars_fragment: roughnessmap_pars_fragment,
    shadowmap_pars_fragment: shadowmap_pars_fragment,
    shadowmap_pars_vertex: shadowmap_pars_vertex,
    shadowmap_vertex: shadowmap_vertex,
    shadowmask_pars_fragment: shadowmask_pars_fragment,
    skinbase_vertex: skinbase_vertex,
    skinning_pars_vertex: skinning_pars_vertex,
    skinning_vertex: skinning_vertex,
    skinnormal_vertex: skinnormal_vertex,
    specularmap_fragment: specularmap_fragment,
    specularmap_pars_fragment: specularmap_pars_fragment,
    tonemapping_fragment: tonemapping_fragment,
    tonemapping_pars_fragment: tonemapping_pars_fragment,
    transmissionmap_fragment: transmissionmap_fragment,
    transmissionmap_pars_fragment: transmissionmap_pars_fragment,
    uv_pars_fragment: uv_pars_fragment,
    uv_pars_vertex: uv_pars_vertex,
    uv_vertex: uv_vertex,
    uv2_pars_fragment: uv2_pars_fragment,
    uv2_pars_vertex: uv2_pars_vertex,
    uv2_vertex: uv2_vertex,
    worldpos_vertex: worldpos_vertex,
    background_frag: background_frag,
    background_vert: background_vert,
    cube_frag: cube_frag,
    cube_vert: cube_vert,
    depth_frag: depth_frag,
    depth_vert: depth_vert,
    distanceRGBA_frag: distanceRGBA_frag,
    distanceRGBA_vert: distanceRGBA_vert,
    equirect_frag: equirect_frag,
    equirect_vert: equirect_vert,
    linedashed_frag: linedashed_frag,
    linedashed_vert: linedashed_vert,
    meshbasic_frag: meshbasic_frag,
    meshbasic_vert: meshbasic_vert,
    meshlambert_frag: meshlambert_frag,
    meshlambert_vert: meshlambert_vert,
    meshmatcap_frag: meshmatcap_frag,
    meshmatcap_vert: meshmatcap_vert,
    meshtoon_frag: meshtoon_frag,
    meshtoon_vert: meshtoon_vert,
    meshphong_frag: meshphong_frag,
    meshphong_vert: meshphong_vert,
    meshphysical_frag: meshphysical_frag,
    meshphysical_vert: meshphysical_vert,
    normal_frag: normal_frag,
    normal_vert: normal_vert,
    points_frag: points_frag,
    points_vert: points_vert,
    shadow_frag: shadow_frag,
    shadow_vert: shadow_vert,
    sprite_frag: sprite_frag,
    sprite_vert: sprite_vert
  },
  UniformsLib = {
    common: {
      diffuse: { value: new Color(15658734) },
      opacity: { value: 1 },
      map: { value: null },
      uvTransform: { value: new Matrix3() },
      uv2Transform: { value: new Matrix3() },
      alphaMap: { value: null }
    },
    specularmap: { specularMap: { value: null } },
    envmap: {
      envMap: { value: null },
      flipEnvMap: { value: -1 },
      reflectivity: { value: 1 },
      refractionRatio: { value: 0.98 },
      maxMipLevel: { value: 0 }
    },
    aomap: { aoMap: { value: null }, aoMapIntensity: { value: 1 } },
    lightmap: { lightMap: { value: null }, lightMapIntensity: { value: 1 } },
    emissivemap: { emissiveMap: { value: null } },
    bumpmap: { bumpMap: { value: null }, bumpScale: { value: 1 } },
    normalmap: {
      normalMap: { value: null },
      normalScale: { value: new Vector2(1, 1) }
    },
    displacementmap: {
      displacementMap: { value: null },
      displacementScale: { value: 1 },
      displacementBias: { value: 0 }
    },
    roughnessmap: { roughnessMap: { value: null } },
    metalnessmap: { metalnessMap: { value: null } },
    gradientmap: { gradientMap: { value: null } },
    fog: {
      fogDensity: { value: 25e-5 },
      fogNear: { value: 1 },
      fogFar: { value: 2e3 },
      fogColor: { value: new Color(16777215) }
    },
    lights: {
      ambientLightColor: { value: [] },
      lightProbe: { value: [] },
      directionalLights: {
        value: [],
        properties: { direction: {}, color: {} }
      },
      directionalLightShadows: {
        value: [],
        properties: {
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {}
        }
      },
      directionalShadowMap: { value: [] },
      directionalShadowMatrix: { value: [] },
      spotLights: {
        value: [],
        properties: {
          color: {},
          position: {},
          direction: {},
          distance: {},
          coneCos: {},
          penumbraCos: {},
          decay: {}
        }
      },
      spotLightShadows: {
        value: [],
        properties: {
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {}
        }
      },
      spotShadowMap: { value: [] },
      spotShadowMatrix: { value: [] },
      pointLights: {
        value: [],
        properties: { color: {}, position: {}, decay: {}, distance: {} }
      },
      pointLightShadows: {
        value: [],
        properties: {
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {},
          shadowCameraNear: {},
          shadowCameraFar: {}
        }
      },
      pointShadowMap: { value: [] },
      pointShadowMatrix: { value: [] },
      hemisphereLights: {
        value: [],
        properties: { direction: {}, skyColor: {}, groundColor: {} }
      },
      rectAreaLights: {
        value: [],
        properties: { color: {}, position: {}, width: {}, height: {} }
      },
      ltc_1: { value: null },
      ltc_2: { value: null }
    },
    points: {
      diffuse: { value: new Color(15658734) },
      opacity: { value: 1 },
      size: { value: 1 },
      scale: { value: 1 },
      map: { value: null },
      alphaMap: { value: null },
      uvTransform: { value: new Matrix3() }
    },
    sprite: {
      diffuse: { value: new Color(15658734) },
      opacity: { value: 1 },
      center: { value: new Vector2(0.5, 0.5) },
      rotation: { value: 0 },
      map: { value: null },
      alphaMap: { value: null },
      uvTransform: { value: new Matrix3() }
    }
  },
  ShaderLib = {
    basic: {
      uniforms: mergeUniforms([
        UniformsLib.common,
        UniformsLib.specularmap,
        UniformsLib.envmap,
        UniformsLib.aomap,
        UniformsLib.lightmap,
        UniformsLib.fog
      ]),
      vertexShader: ShaderChunk.meshbasic_vert,
      fragmentShader: ShaderChunk.meshbasic_frag
    },
    lambert: {
      uniforms: mergeUniforms([
        UniformsLib.common,
        UniformsLib.specularmap,
        UniformsLib.envmap,
        UniformsLib.aomap,
        UniformsLib.lightmap,
        UniformsLib.emissivemap,
        UniformsLib.fog,
        UniformsLib.lights,
        { emissive: { value: new Color(0) } }
      ]),
      vertexShader: ShaderChunk.meshlambert_vert,
      fragmentShader: ShaderChunk.meshlambert_frag
    },
    phong: {
      uniforms: mergeUniforms([
        UniformsLib.common,
        UniformsLib.specularmap,
        UniformsLib.envmap,
        UniformsLib.aomap,
        UniformsLib.lightmap,
        UniformsLib.emissivemap,
        UniformsLib.bumpmap,
        UniformsLib.normalmap,
        UniformsLib.displacementmap,
        UniformsLib.fog,
        UniformsLib.lights,
        {
          emissive: { value: new Color(0) },
          specular: { value: new Color(1118481) },
          shininess: { value: 30 }
        }
      ]),
      vertexShader: ShaderChunk.meshphong_vert,
      fragmentShader: ShaderChunk.meshphong_frag
    },
    standard: {
      uniforms: mergeUniforms([
        UniformsLib.common,
        UniformsLib.envmap,
        UniformsLib.aomap,
        UniformsLib.lightmap,
        UniformsLib.emissivemap,
        UniformsLib.bumpmap,
        UniformsLib.normalmap,
        UniformsLib.displacementmap,
        UniformsLib.roughnessmap,
        UniformsLib.metalnessmap,
        UniformsLib.fog,
        UniformsLib.lights,
        {
          emissive: { value: new Color(0) },
          roughness: { value: 1 },
          metalness: { value: 0 },
          envMapIntensity: { value: 1 }
        }
      ]),
      vertexShader: ShaderChunk.meshphysical_vert,
      fragmentShader: ShaderChunk.meshphysical_frag
    },
    toon: {
      uniforms: mergeUniforms([
        UniformsLib.common,
        UniformsLib.aomap,
        UniformsLib.lightmap,
        UniformsLib.emissivemap,
        UniformsLib.bumpmap,
        UniformsLib.normalmap,
        UniformsLib.displacementmap,
        UniformsLib.gradientmap,
        UniformsLib.fog,
        UniformsLib.lights,
        { emissive: { value: new Color(0) } }
      ]),
      vertexShader: ShaderChunk.meshtoon_vert,
      fragmentShader: ShaderChunk.meshtoon_frag
    },
    matcap: {
      uniforms: mergeUniforms([
        UniformsLib.common,
        UniformsLib.bumpmap,
        UniformsLib.normalmap,
        UniformsLib.displacementmap,
        UniformsLib.fog,
        { matcap: { value: null } }
      ]),
      vertexShader: ShaderChunk.meshmatcap_vert,
      fragmentShader: ShaderChunk.meshmatcap_frag
    },
    points: {
      uniforms: mergeUniforms([UniformsLib.points, UniformsLib.fog]),
      vertexShader: ShaderChunk.points_vert,
      fragmentShader: ShaderChunk.points_frag
    },
    dashed: {
      uniforms: mergeUniforms([
        UniformsLib.common,
        UniformsLib.fog,
        { scale: { value: 1 }, dashSize: { value: 1 }, totalSize: { value: 2 } }
      ]),
      vertexShader: ShaderChunk.linedashed_vert,
      fragmentShader: ShaderChunk.linedashed_frag
    },
    depth: {
      uniforms: mergeUniforms([
        UniformsLib.common,
        UniformsLib.displacementmap
      ]),
      vertexShader: ShaderChunk.depth_vert,
      fragmentShader: ShaderChunk.depth_frag
    },
    normal: {
      uniforms: mergeUniforms([
        UniformsLib.common,
        UniformsLib.bumpmap,
        UniformsLib.normalmap,
        UniformsLib.displacementmap,
        { opacity: { value: 1 } }
      ]),
      vertexShader: ShaderChunk.normal_vert,
      fragmentShader: ShaderChunk.normal_frag
    },
    sprite: {
      uniforms: mergeUniforms([UniformsLib.sprite, UniformsLib.fog]),
      vertexShader: ShaderChunk.sprite_vert,
      fragmentShader: ShaderChunk.sprite_frag
    },
    background: {
      uniforms: { uvTransform: { value: new Matrix3() }, t2D: { value: null } },
      vertexShader: ShaderChunk.background_vert,
      fragmentShader: ShaderChunk.background_frag
    },
    cube: {
      uniforms: mergeUniforms([UniformsLib.envmap, { opacity: { value: 1 } }]),
      vertexShader: ShaderChunk.cube_vert,
      fragmentShader: ShaderChunk.cube_frag
    },
    equirect: {
      uniforms: { tEquirect: { value: null } },
      vertexShader: ShaderChunk.equirect_vert,
      fragmentShader: ShaderChunk.equirect_frag
    },
    distanceRGBA: {
      uniforms: mergeUniforms([
        UniformsLib.common,
        UniformsLib.displacementmap,
        {
          referencePosition: { value: new Vector3() },
          nearDistance: { value: 1 },
          farDistance: { value: 1e3 }
        }
      ]),
      vertexShader: ShaderChunk.distanceRGBA_vert,
      fragmentShader: ShaderChunk.distanceRGBA_frag
    },
    shadow: {
      uniforms: mergeUniforms([
        UniformsLib.lights,
        UniformsLib.fog,
        { color: { value: new Color(0) }, opacity: { value: 1 } }
      ]),
      vertexShader: ShaderChunk.shadow_vert,
      fragmentShader: ShaderChunk.shadow_frag
    }
  };
function WebGLBackground(e, t, n, r, i) {
  const o = new Color(0);
  let a,
    s,
    c = 0,
    l = null,
    h = 0,
    u = null;
  function d(e, t) {
    n.buffers.color.setClear(e.r, e.g, e.b, t, i);
  }
  return {
    getClearColor: function () {
      return o;
    },
    setClearColor: function (e, t) {
      o.set(e), d(o, (c = void 0 !== t ? t : 1));
    },
    getClearAlpha: function () {
      return c;
    },
    setClearAlpha: function (e) {
      d(o, (c = e));
    },
    render: function (n, i, p, m) {
      let f = !0 === i.isScene ? i.background : null;
      f && f.isTexture && (f = t.get(f));
      const g = e.xr,
        v = g.getSession && g.getSession();
      v && "additive" === v.environmentBlendMode && (f = null),
        null === f ? d(o, c) : f && f.isColor && (d(f, 1), (m = !0)),
        (e.autoClear || m) &&
          e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil),
        f &&
        (f.isCubeTexture ||
          f.isWebGLCubeRenderTarget ||
          f.mapping === CubeUVReflectionMapping)
          ? (void 0 === s &&
              ((s = new Mesh(
                new BoxBufferGeometry(1, 1, 1),
                new ShaderMaterial({
                  name: "BackgroundCubeMaterial",
                  uniforms: cloneUniforms(ShaderLib.cube.uniforms),
                  vertexShader: ShaderLib.cube.vertexShader,
                  fragmentShader: ShaderLib.cube.fragmentShader,
                  side: BackSide,
                  depthTest: !1,
                  depthWrite: !1,
                  fog: !1
                })
              )).geometry.deleteAttribute("normal"),
              s.geometry.deleteAttribute("uv"),
              (s.onBeforeRender = function (e, t, n) {
                this.matrixWorld.copyPosition(n.matrixWorld);
              }),
              Object.defineProperty(s.material, "envMap", {
                get: function () {
                  return this.uniforms.envMap.value;
                }
              }),
              r.update(s)),
            f.isWebGLCubeRenderTarget && (f = f.texture),
            (s.material.uniforms.envMap.value = f),
            (s.material.uniforms.flipEnvMap.value =
              f.isCubeTexture && f._needsFlipEnvMap ? -1 : 1),
            (l === f && h === f.version && u === e.toneMapping) ||
              ((s.material.needsUpdate = !0),
              (l = f),
              (h = f.version),
              (u = e.toneMapping)),
            n.unshift(s, s.geometry, s.material, 0, 0, null))
          : f &&
            f.isTexture &&
            (void 0 === a &&
              ((a = new Mesh(
                new PlaneBufferGeometry(2, 2),
                new ShaderMaterial({
                  name: "BackgroundMaterial",
                  uniforms: cloneUniforms(ShaderLib.background.uniforms),
                  vertexShader: ShaderLib.background.vertexShader,
                  fragmentShader: ShaderLib.background.fragmentShader,
                  side: FrontSide,
                  depthTest: !1,
                  depthWrite: !1,
                  fog: !1
                })
              )).geometry.deleteAttribute("normal"),
              Object.defineProperty(a.material, "map", {
                get: function () {
                  return this.uniforms.t2D.value;
                }
              }),
              r.update(a)),
            (a.material.uniforms.t2D.value = f),
            !0 === f.matrixAutoUpdate && f.updateMatrix(),
            a.material.uniforms.uvTransform.value.copy(f.matrix),
            (l === f && h === f.version && u === e.toneMapping) ||
              ((a.material.needsUpdate = !0),
              (l = f),
              (h = f.version),
              (u = e.toneMapping)),
            n.unshift(a, a.geometry, a.material, 0, 0, null));
    }
  };
}
function WebGLBindingStates(e, t, n, r) {
  const i = e.getParameter(34921),
    o = r.isWebGL2 ? null : t.get("OES_vertex_array_object"),
    a = r.isWebGL2 || null !== o,
    s = {},
    c = d(null);
  let l = c;
  function h(t) {
    return r.isWebGL2 ? e.bindVertexArray(t) : o.bindVertexArrayOES(t);
  }
  function u(t) {
    return r.isWebGL2 ? e.deleteVertexArray(t) : o.deleteVertexArrayOES(t);
  }
  function d(e) {
    const t = [],
      n = [],
      r = [];
    for (let e = 0; e < i; e++) (t[e] = 0), (n[e] = 0), (r[e] = 0);
    return {
      geometry: null,
      program: null,
      wireframe: !1,
      newAttributes: t,
      enabledAttributes: n,
      attributeDivisors: r,
      object: e,
      attributes: {},
      index: null
    };
  }
  function p() {
    const e = l.newAttributes;
    for (let t = 0, n = e.length; t < n; t++) e[t] = 0;
  }
  function m(e) {
    f(e, 0);
  }
  function f(n, i) {
    const o = l.newAttributes,
      a = l.enabledAttributes,
      s = l.attributeDivisors;
    if (
      ((o[n] = 1),
      0 === a[n] && (e.enableVertexAttribArray(n), (a[n] = 1)),
      s[n] !== i)
    ) {
      (r.isWebGL2 ? e : t.get("ANGLE_instanced_arrays"))[
        r.isWebGL2 ? "vertexAttribDivisor" : "vertexAttribDivisorANGLE"
      ](n, i),
        (s[n] = i);
    }
  }
  function g() {
    const t = l.newAttributes,
      n = l.enabledAttributes;
    for (let r = 0, i = n.length; r < i; r++)
      n[r] !== t[r] && (e.disableVertexAttribArray(r), (n[r] = 0));
  }
  function v(t, n, i, o, a, s) {
    !0 !== r.isWebGL2 || (5124 !== i && 5125 !== i)
      ? e.vertexAttribPointer(t, n, i, o, a, s)
      : e.vertexAttribIPointer(t, n, i, a, s);
  }
  function y() {
    _(), l !== c && h((l = c).object);
  }
  function _() {
    (c.geometry = null), (c.program = null), (c.wireframe = !1);
  }
  return {
    setup: function (i, c, u, y, _) {
      let x = !1;
      if (a) {
        const t = (function (t, n, i) {
          const a = !0 === i.wireframe;
          let c = s[t.id];
          void 0 === c && ((c = {}), (s[t.id] = c));
          let l = c[n.id];
          void 0 === l && ((l = {}), (c[n.id] = l));
          let h = l[a];
          return (
            void 0 === h &&
              ((h = d(
                r.isWebGL2 ? e.createVertexArray() : o.createVertexArrayOES()
              )),
              (l[a] = h)),
            h
          );
        })(y, u, c);
        l !== t && h((l = t).object),
          (x = (function (e, t) {
            const n = l.attributes,
              r = e.attributes;
            if (Object.keys(n).length !== Object.keys(r).length) return !0;
            for (const e in r) {
              const t = n[e],
                i = r[e];
              if (void 0 === t) return !0;
              if (t.attribute !== i) return !0;
              if (t.data !== i.data) return !0;
            }
            return l.index !== t;
          })(y, _)) &&
            (function (e, t) {
              const n = {},
                r = e.attributes;
              for (const e in r) {
                const t = r[e],
                  i = {};
                (i.attribute = t), t.data && (i.data = t.data), (n[e] = i);
              }
              (l.attributes = n), (l.index = t);
            })(y, _);
      } else {
        const e = !0 === c.wireframe;
        (l.geometry === y.id && l.program === u.id && l.wireframe === e) ||
          ((l.geometry = y.id),
          (l.program = u.id),
          (l.wireframe = e),
          (x = !0));
      }
      !0 === i.isInstancedMesh && (x = !0),
        null !== _ && n.update(_, 34963),
        x &&
          ((function (i, o, a, s) {
            if (
              !1 === r.isWebGL2 &&
              (i.isInstancedMesh || s.isInstancedBufferGeometry) &&
              null === t.get("ANGLE_instanced_arrays")
            )
              return;
            p();
            const c = s.attributes,
              l = a.getAttributes(),
              h = o.defaultAttributeValues;
            for (const t in l) {
              const r = l[t];
              if (r >= 0) {
                const o = c[t];
                if (void 0 !== o) {
                  const t = o.normalized,
                    i = o.itemSize,
                    a = n.get(o);
                  if (void 0 === a) continue;
                  const c = a.buffer,
                    l = a.type,
                    h = a.bytesPerElement;
                  if (o.isInterleavedBufferAttribute) {
                    const n = o.data,
                      a = n.stride,
                      u = o.offset;
                    n && n.isInstancedInterleavedBuffer
                      ? (f(r, n.meshPerAttribute),
                        void 0 === s._maxInstanceCount &&
                          (s._maxInstanceCount = n.meshPerAttribute * n.count))
                      : m(r),
                      e.bindBuffer(34962, c),
                      v(r, i, l, t, a * h, u * h);
                  } else
                    o.isInstancedBufferAttribute
                      ? (f(r, o.meshPerAttribute),
                        void 0 === s._maxInstanceCount &&
                          (s._maxInstanceCount = o.meshPerAttribute * o.count))
                      : m(r),
                      e.bindBuffer(34962, c),
                      v(r, i, l, t, 0, 0);
                } else if ("instanceMatrix" === t) {
                  const t = n.get(i.instanceMatrix);
                  if (void 0 === t) continue;
                  const o = t.buffer,
                    a = t.type;
                  f(r + 0, 1),
                    f(r + 1, 1),
                    f(r + 2, 1),
                    f(r + 3, 1),
                    e.bindBuffer(34962, o),
                    e.vertexAttribPointer(r + 0, 4, a, !1, 64, 0),
                    e.vertexAttribPointer(r + 1, 4, a, !1, 64, 16),
                    e.vertexAttribPointer(r + 2, 4, a, !1, 64, 32),
                    e.vertexAttribPointer(r + 3, 4, a, !1, 64, 48);
                } else if ("instanceColor" === t) {
                  const t = n.get(i.instanceColor);
                  if (void 0 === t) continue;
                  const o = t.buffer,
                    a = t.type;
                  f(r, 1),
                    e.bindBuffer(34962, o),
                    e.vertexAttribPointer(r, 3, a, !1, 12, 0);
                } else if (void 0 !== h) {
                  const n = h[t];
                  if (void 0 !== n)
                    switch (n.length) {
                      case 2:
                        e.vertexAttrib2fv(r, n);
                        break;
                      case 3:
                        e.vertexAttrib3fv(r, n);
                        break;
                      case 4:
                        e.vertexAttrib4fv(r, n);
                        break;
                      default:
                        e.vertexAttrib1fv(r, n);
                    }
                }
              }
            }
            g();
          })(i, c, u, y),
          null !== _ && e.bindBuffer(34963, n.get(_).buffer));
    },
    reset: y,
    resetDefaultState: _,
    dispose: function () {
      y();
      for (const e in s) {
        const t = s[e];
        for (const e in t) {
          const n = t[e];
          for (const e in n) u(n[e].object), delete n[e];
          delete t[e];
        }
        delete s[e];
      }
    },
    releaseStatesOfGeometry: function (e) {
      if (void 0 === s[e.id]) return;
      const t = s[e.id];
      for (const e in t) {
        const n = t[e];
        for (const e in n) u(n[e].object), delete n[e];
        delete t[e];
      }
      delete s[e.id];
    },
    releaseStatesOfProgram: function (e) {
      for (const t in s) {
        const n = s[t];
        if (void 0 === n[e.id]) continue;
        const r = n[e.id];
        for (const e in r) u(r[e].object), delete r[e];
        delete n[e.id];
      }
    },
    initAttributes: p,
    enableAttribute: m,
    disableUnusedAttributes: g
  };
}
function WebGLBufferRenderer(e, t, n, r) {
  const i = r.isWebGL2;
  let o;
  (this.setMode = function (e) {
    o = e;
  }),
    (this.render = function (t, r) {
      e.drawArrays(o, t, r), n.update(r, o, 1);
    }),
    (this.renderInstances = function (r, a, s) {
      if (0 === s) return;
      let c, l;
      if (i) (c = e), (l = "drawArraysInstanced");
      else if (
        ((l = "drawArraysInstancedANGLE"),
        null === (c = t.get("ANGLE_instanced_arrays")))
      )
        return void console.error(
          "THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays."
        );
      c[l](o, r, a, s), n.update(a, o, s);
    });
}
function WebGLCapabilities(e, t, n) {
  let r;
  function i(t) {
    if ("highp" === t) {
      if (
        e.getShaderPrecisionFormat(35633, 36338).precision > 0 &&
        e.getShaderPrecisionFormat(35632, 36338).precision > 0
      )
        return "highp";
      t = "mediump";
    }
    return "mediump" === t &&
      e.getShaderPrecisionFormat(35633, 36337).precision > 0 &&
      e.getShaderPrecisionFormat(35632, 36337).precision > 0
      ? "mediump"
      : "lowp";
  }
  const o =
    ("undefined" != typeof WebGL2RenderingContext &&
      e instanceof WebGL2RenderingContext) ||
    ("undefined" != typeof WebGL2ComputeRenderingContext &&
      e instanceof WebGL2ComputeRenderingContext);
  let a = void 0 !== n.precision ? n.precision : "highp";
  const s = i(a);
  s !== a &&
    (console.warn(
      "THREE.WebGLRenderer:",
      a,
      "not supported, using",
      s,
      "instead."
    ),
    (a = s));
  const c = !0 === n.logarithmicDepthBuffer,
    l = e.getParameter(34930),
    h = e.getParameter(35660),
    u = e.getParameter(3379),
    d = e.getParameter(34076),
    p = e.getParameter(34921),
    m = e.getParameter(36347),
    f = e.getParameter(36348),
    g = e.getParameter(36349),
    v = h > 0,
    y = o || !!t.get("OES_texture_float");
  return {
    isWebGL2: o,
    getMaxAnisotropy: function () {
      if (void 0 !== r) return r;
      const n = t.get("EXT_texture_filter_anisotropic");
      return (r =
        null !== n ? e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0);
    },
    getMaxPrecision: i,
    precision: a,
    logarithmicDepthBuffer: c,
    maxTextures: l,
    maxVertexTextures: h,
    maxTextureSize: u,
    maxCubemapSize: d,
    maxAttributes: p,
    maxVertexUniforms: m,
    maxVaryings: f,
    maxFragmentUniforms: g,
    vertexTextures: v,
    floatFragmentTextures: y,
    floatVertexTextures: v && y,
    maxSamples: o ? e.getParameter(36183) : 0
  };
}
function WebGLClipping(e) {
  const t = this;
  let n = null,
    r = 0,
    i = !1,
    o = !1;
  const a = new Plane(),
    s = new Matrix3(),
    c = { value: null, needsUpdate: !1 };
  function l() {
    c.value !== n && ((c.value = n), (c.needsUpdate = r > 0)),
      (t.numPlanes = r),
      (t.numIntersection = 0);
  }
  function h(e, n, r, i) {
    const o = null !== e ? e.length : 0;
    let l = null;
    if (0 !== o) {
      if (((l = c.value), !0 !== i || null === l)) {
        const t = r + 4 * o,
          i = n.matrixWorldInverse;
        s.getNormalMatrix(i),
          (null === l || l.length < t) && (l = new Float32Array(t));
        for (let t = 0, n = r; t !== o; ++t, n += 4)
          a.copy(e[t]).applyMatrix4(i, s),
            a.normal.toArray(l, n),
            (l[n + 3] = a.constant);
      }
      (c.value = l), (c.needsUpdate = !0);
    }
    return (t.numPlanes = o), (t.numIntersection = 0), l;
  }
  (this.uniform = c),
    (this.numPlanes = 0),
    (this.numIntersection = 0),
    (this.init = function (e, t, o) {
      const a = 0 !== e.length || t || 0 !== r || i;
      return (i = t), (n = h(e, o, 0)), (r = e.length), a;
    }),
    (this.beginShadows = function () {
      (o = !0), h(null);
    }),
    (this.endShadows = function () {
      (o = !1), l();
    }),
    (this.setState = function (t, a, s) {
      const u = t.clippingPlanes,
        d = t.clipIntersection,
        p = t.clipShadows,
        m = e.get(t);
      if (!i || null === u || 0 === u.length || (o && !p)) o ? h(null) : l();
      else {
        const e = o ? 0 : r,
          t = 4 * e;
        let i = m.clippingState || null;
        (c.value = i), (i = h(u, a, t, s));
        for (let e = 0; e !== t; ++e) i[e] = n[e];
        (m.clippingState = i),
          (this.numIntersection = d ? this.numPlanes : 0),
          (this.numPlanes += e);
      }
    });
}
function WebGLCubeMaps(e) {
  let t = new WeakMap();
  function n(e, t) {
    return (
      t === EquirectangularReflectionMapping
        ? (e.mapping = CubeReflectionMapping)
        : t === EquirectangularRefractionMapping &&
          (e.mapping = CubeRefractionMapping),
      e
    );
  }
  return {
    get: function (r) {
      if (r && r.isTexture) {
        const i = r.mapping;
        if (
          i === EquirectangularReflectionMapping ||
          i === EquirectangularRefractionMapping
        ) {
          if (t.has(r)) return n(t.get(r).texture, r.mapping);
          {
            const i = r.image;
            if (i && i.height > 0) {
              const o = e.getRenderList(),
                a = e.getRenderTarget(),
                s = e.getRenderState(),
                c = new WebGLCubeRenderTarget(i.height / 2);
              return (
                c.fromEquirectangularTexture(e, r),
                t.set(r, c),
                e.setRenderTarget(a),
                e.setRenderList(o),
                e.setRenderState(s),
                n(c.texture, r.mapping)
              );
            }
            return null;
          }
        }
      }
      return r;
    },
    dispose: function () {
      t = new WeakMap();
    }
  };
}
function WebGLExtensions(e) {
  const t = {};
  return {
    has: function (n) {
      if (void 0 !== t[n]) return null !== t[n];
      let r;
      switch (n) {
        case "WEBGL_depth_texture":
          r =
            e.getExtension("WEBGL_depth_texture") ||
            e.getExtension("MOZ_WEBGL_depth_texture") ||
            e.getExtension("WEBKIT_WEBGL_depth_texture");
          break;
        case "EXT_texture_filter_anisotropic":
          r =
            e.getExtension("EXT_texture_filter_anisotropic") ||
            e.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
            e.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
          break;
        case "WEBGL_compressed_texture_s3tc":
          r =
            e.getExtension("WEBGL_compressed_texture_s3tc") ||
            e.getExtension("MOZ_WEBGL_compressed_texture_s3tc") ||
            e.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
          break;
        case "WEBGL_compressed_texture_pvrtc":
          r =
            e.getExtension("WEBGL_compressed_texture_pvrtc") ||
            e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
          break;
        default:
          r = e.getExtension(n);
      }
      return (t[n] = r), null !== r;
    },
    get: function (e) {
      return (
        this.has(e) ||
          console.warn(
            "THREE.WebGLRenderer: " + e + " extension not supported."
          ),
        t[e]
      );
    }
  };
}
function WebGLGeometries(e, t, n, r) {
  const i = new WeakMap(),
    o = new WeakMap();
  function a(e) {
    const s = e.target,
      c = i.get(s);
    null !== c.index && t.remove(c.index);
    for (const e in c.attributes) t.remove(c.attributes[e]);
    s.removeEventListener("dispose", a), i.delete(s);
    const l = o.get(c);
    l && (t.remove(l), o.delete(c)),
      r.releaseStatesOfGeometry(s),
      !0 === s.isInstancedBufferGeometry && delete s._maxInstanceCount,
      n.memory.geometries--;
  }
  function s(e) {
    const n = [],
      r = e.index,
      i = e.attributes.position;
    let a = 0;
    if (null !== r) {
      const e = r.array;
      a = r.version;
      for (let t = 0, r = e.length; t < r; t += 3) {
        const r = e[t + 0],
          i = e[t + 1],
          o = e[t + 2];
        n.push(r, i, i, o, o, r);
      }
    } else {
      const e = i.array;
      a = i.version;
      for (let t = 0, r = e.length / 3 - 1; t < r; t += 3) {
        const e = t + 0,
          r = t + 1,
          i = t + 2;
        n.push(e, r, r, i, i, e);
      }
    }
    const s = new (
      arrayMax(n) > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute
    )(n, 1);
    s.version = a;
    const c = o.get(e);
    c && t.remove(c), o.set(e, s);
  }
  return {
    get: function (e, t) {
      let r = i.get(t);
      return (
        r ||
        (t.addEventListener("dispose", a),
        t.isBufferGeometry
          ? (r = t)
          : t.isGeometry &&
            (void 0 === t._bufferGeometry &&
              (t._bufferGeometry = new BufferGeometry().setFromObject(e)),
            (r = t._bufferGeometry)),
        i.set(t, r),
        n.memory.geometries++,
        r)
      );
    },
    update: function (e) {
      const n = e.attributes;
      for (const e in n) t.update(n[e], 34962);
      const r = e.morphAttributes;
      for (const e in r) {
        const n = r[e];
        for (let e = 0, r = n.length; e < r; e++) t.update(n[e], 34962);
      }
    },
    getWireframeAttribute: function (e) {
      const t = o.get(e);
      if (t) {
        const n = e.index;
        null !== n && t.version < n.version && s(e);
      } else s(e);
      return o.get(e);
    }
  };
}
function WebGLIndexedBufferRenderer(e, t, n, r) {
  const i = r.isWebGL2;
  let o, a, s;
  (this.setMode = function (e) {
    o = e;
  }),
    (this.setIndex = function (e) {
      (a = e.type), (s = e.bytesPerElement);
    }),
    (this.render = function (t, r) {
      e.drawElements(o, r, a, t * s), n.update(r, o, 1);
    }),
    (this.renderInstances = function (r, c, l) {
      if (0 === l) return;
      let h, u;
      if (i) (h = e), (u = "drawElementsInstanced");
      else if (
        ((u = "drawElementsInstancedANGLE"),
        null === (h = t.get("ANGLE_instanced_arrays")))
      )
        return void console.error(
          "THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays."
        );
      h[u](o, c, a, r * s, l), n.update(c, o, l);
    });
}
function WebGLInfo(e) {
  const t = { frame: 0, calls: 0, triangles: 0, points: 0, lines: 0 };
  return {
    memory: { geometries: 0, textures: 0 },
    render: t,
    programs: null,
    autoReset: !0,
    reset: function () {
      t.frame++,
        (t.calls = 0),
        (t.triangles = 0),
        (t.points = 0),
        (t.lines = 0);
    },
    update: function (e, n, r) {
      switch ((t.calls++, n)) {
        case 4:
          t.triangles += r * (e / 3);
          break;
        case 1:
          t.lines += r * (e / 2);
          break;
        case 3:
          t.lines += r * (e - 1);
          break;
        case 2:
          t.lines += r * e;
          break;
        case 0:
          t.points += r * e;
          break;
        default:
          console.error("THREE.WebGLInfo: Unknown draw mode:", n);
      }
    }
  };
}
function numericalSort(e, t) {
  return e[0] - t[0];
}
function absNumericalSort(e, t) {
  return Math.abs(t[1]) - Math.abs(e[1]);
}
function WebGLMorphtargets(e) {
  const t = {},
    n = new Float32Array(8),
    r = [];
  for (let e = 0; e < 8; e++) r[e] = [e, 0];
  return {
    update: function (i, o, a, s) {
      const c = i.morphTargetInfluences,
        l = void 0 === c ? 0 : c.length;
      let h = t[o.id];
      if (void 0 === h) {
        h = [];
        for (let e = 0; e < l; e++) h[e] = [e, 0];
        t[o.id] = h;
      }
      for (let e = 0; e < l; e++) {
        const t = h[e];
        (t[0] = e), (t[1] = c[e]);
      }
      h.sort(absNumericalSort);
      for (let e = 0; e < 8; e++)
        e < l && h[e][1]
          ? ((r[e][0] = h[e][0]), (r[e][1] = h[e][1]))
          : ((r[e][0] = Number.MAX_SAFE_INTEGER), (r[e][1] = 0));
      r.sort(numericalSort);
      const u = a.morphTargets && o.morphAttributes.position,
        d = a.morphNormals && o.morphAttributes.normal;
      let p = 0;
      for (let e = 0; e < 8; e++) {
        const t = r[e],
          i = t[0],
          a = t[1];
        i !== Number.MAX_SAFE_INTEGER && a
          ? (u &&
              o.getAttribute("morphTarget" + e) !== u[i] &&
              o.setAttribute("morphTarget" + e, u[i]),
            d &&
              o.getAttribute("morphNormal" + e) !== d[i] &&
              o.setAttribute("morphNormal" + e, d[i]),
            (n[e] = a),
            (p += a))
          : (u &&
              void 0 !== o.getAttribute("morphTarget" + e) &&
              o.deleteAttribute("morphTarget" + e),
            d &&
              void 0 !== o.getAttribute("morphNormal" + e) &&
              o.deleteAttribute("morphNormal" + e),
            (n[e] = 0));
      }
      const m = o.morphTargetsRelative ? 1 : 1 - p;
      s.getUniforms().setValue(e, "morphTargetBaseInfluence", m),
        s.getUniforms().setValue(e, "morphTargetInfluences", n);
    }
  };
}
function WebGLObjects(e, t, n, r) {
  let i = new WeakMap();
  return {
    update: function (e) {
      const o = r.render.frame,
        a = e.geometry,
        s = t.get(e, a);
      return (
        i.get(s) !== o &&
          (a.isGeometry && s.updateFromObject(e), t.update(s), i.set(s, o)),
        e.isInstancedMesh &&
          (n.update(e.instanceMatrix, 34962),
          null !== e.instanceColor && n.update(e.instanceColor, 34962)),
        s
      );
    },
    dispose: function () {
      i = new WeakMap();
    }
  };
}
function DataTexture2DArray(e, t, n, r) {
  Texture.call(this, null),
    (this.image = {
      data: e || null,
      width: t || 1,
      height: n || 1,
      depth: r || 1
    }),
    (this.magFilter = NearestFilter),
    (this.minFilter = NearestFilter),
    (this.wrapR = ClampToEdgeWrapping),
    (this.generateMipmaps = !1),
    (this.flipY = !1),
    (this.needsUpdate = !0);
}
function DataTexture3D(e, t, n, r) {
  Texture.call(this, null),
    (this.image = {
      data: e || null,
      width: t || 1,
      height: n || 1,
      depth: r || 1
    }),
    (this.magFilter = NearestFilter),
    (this.minFilter = NearestFilter),
    (this.wrapR = ClampToEdgeWrapping),
    (this.generateMipmaps = !1),
    (this.flipY = !1),
    (this.needsUpdate = !0);
}
(ShaderLib.physical = {
  uniforms: mergeUniforms([
    ShaderLib.standard.uniforms,
    {
      clearcoat: { value: 0 },
      clearcoatMap: { value: null },
      clearcoatRoughness: { value: 0 },
      clearcoatRoughnessMap: { value: null },
      clearcoatNormalScale: { value: new Vector2(1, 1) },
      clearcoatNormalMap: { value: null },
      sheen: { value: new Color(0) },
      transmission: { value: 0 },
      transmissionMap: { value: null }
    }
  ]),
  vertexShader: ShaderChunk.meshphysical_vert,
  fragmentShader: ShaderChunk.meshphysical_frag
}),
  (DataTexture2DArray.prototype = Object.create(Texture.prototype)),
  (DataTexture2DArray.prototype.constructor = DataTexture2DArray),
  (DataTexture2DArray.prototype.isDataTexture2DArray = !0),
  (DataTexture3D.prototype = Object.create(Texture.prototype)),
  (DataTexture3D.prototype.constructor = DataTexture3D),
  (DataTexture3D.prototype.isDataTexture3D = !0);
const emptyTexture = new Texture(),
  emptyTexture2dArray = new DataTexture2DArray(),
  emptyTexture3d = new DataTexture3D(),
  emptyCubeTexture = new CubeTexture(),
  arrayCacheF32 = [],
  arrayCacheI32 = [],
  mat4array = new Float32Array(16),
  mat3array = new Float32Array(9),
  mat2array = new Float32Array(4);
function flatten(e, t, n) {
  const r = e[0];
  if (r <= 0 || r > 0) return e;
  const i = t * n;
  let o = arrayCacheF32[i];
  if (
    (void 0 === o && ((o = new Float32Array(i)), (arrayCacheF32[i] = o)),
    0 !== t)
  ) {
    r.toArray(o, 0);
    for (let r = 1, i = 0; r !== t; ++r) (i += n), e[r].toArray(o, i);
  }
  return o;
}
function arraysEqual(e, t) {
  if (e.length !== t.length) return !1;
  for (let n = 0, r = e.length; n < r; n++) if (e[n] !== t[n]) return !1;
  return !0;
}
function copyArray(e, t) {
  for (let n = 0, r = t.length; n < r; n++) e[n] = t[n];
}
function allocTexUnits(e, t) {
  let n = arrayCacheI32[t];
  void 0 === n && ((n = new Int32Array(t)), (arrayCacheI32[t] = n));
  for (let r = 0; r !== t; ++r) n[r] = e.allocateTextureUnit();
  return n;
}
function setValueV1f(e, t) {
  const n = this.cache;
  n[0] !== t && (e.uniform1f(this.addr, t), (n[0] = t));
}
function setValueV2f(e, t) {
  const n = this.cache;
  if (void 0 !== t.x)
    (n[0] === t.x && n[1] === t.y) ||
      (e.uniform2f(this.addr, t.x, t.y), (n[0] = t.x), (n[1] = t.y));
  else {
    if (arraysEqual(n, t)) return;
    e.uniform2fv(this.addr, t), copyArray(n, t);
  }
}
function setValueV3f(e, t) {
  const n = this.cache;
  if (void 0 !== t.x)
    (n[0] === t.x && n[1] === t.y && n[2] === t.z) ||
      (e.uniform3f(this.addr, t.x, t.y, t.z),
      (n[0] = t.x),
      (n[1] = t.y),
      (n[2] = t.z));
  else if (void 0 !== t.r)
    (n[0] === t.r && n[1] === t.g && n[2] === t.b) ||
      (e.uniform3f(this.addr, t.r, t.g, t.b),
      (n[0] = t.r),
      (n[1] = t.g),
      (n[2] = t.b));
  else {
    if (arraysEqual(n, t)) return;
    e.uniform3fv(this.addr, t), copyArray(n, t);
  }
}
function setValueV4f(e, t) {
  const n = this.cache;
  if (void 0 !== t.x)
    (n[0] === t.x && n[1] === t.y && n[2] === t.z && n[3] === t.w) ||
      (e.uniform4f(this.addr, t.x, t.y, t.z, t.w),
      (n[0] = t.x),
      (n[1] = t.y),
      (n[2] = t.z),
      (n[3] = t.w));
  else {
    if (arraysEqual(n, t)) return;
    e.uniform4fv(this.addr, t), copyArray(n, t);
  }
}
function setValueM2(e, t) {
  const n = this.cache,
    r = t.elements;
  if (void 0 === r) {
    if (arraysEqual(n, t)) return;
    e.uniformMatrix2fv(this.addr, !1, t), copyArray(n, t);
  } else {
    if (arraysEqual(n, r)) return;
    mat2array.set(r),
      e.uniformMatrix2fv(this.addr, !1, mat2array),
      copyArray(n, r);
  }
}
function setValueM3(e, t) {
  const n = this.cache,
    r = t.elements;
  if (void 0 === r) {
    if (arraysEqual(n, t)) return;
    e.uniformMatrix3fv(this.addr, !1, t), copyArray(n, t);
  } else {
    if (arraysEqual(n, r)) return;
    mat3array.set(r),
      e.uniformMatrix3fv(this.addr, !1, mat3array),
      copyArray(n, r);
  }
}
function setValueM4(e, t) {
  const n = this.cache,
    r = t.elements;
  if (void 0 === r) {
    if (arraysEqual(n, t)) return;
    e.uniformMatrix4fv(this.addr, !1, t), copyArray(n, t);
  } else {
    if (arraysEqual(n, r)) return;
    mat4array.set(r),
      e.uniformMatrix4fv(this.addr, !1, mat4array),
      copyArray(n, r);
  }
}
function setValueT1(e, t, n) {
  const r = this.cache,
    i = n.allocateTextureUnit();
  r[0] !== i && (e.uniform1i(this.addr, i), (r[0] = i)),
    n.safeSetTexture2D(t || emptyTexture, i);
}
function setValueT2DArray1(e, t, n) {
  const r = this.cache,
    i = n.allocateTextureUnit();
  r[0] !== i && (e.uniform1i(this.addr, i), (r[0] = i)),
    n.setTexture2DArray(t || emptyTexture2dArray, i);
}
function setValueT3D1(e, t, n) {
  const r = this.cache,
    i = n.allocateTextureUnit();
  r[0] !== i && (e.uniform1i(this.addr, i), (r[0] = i)),
    n.setTexture3D(t || emptyTexture3d, i);
}
function setValueT6(e, t, n) {
  const r = this.cache,
    i = n.allocateTextureUnit();
  r[0] !== i && (e.uniform1i(this.addr, i), (r[0] = i)),
    n.safeSetTextureCube(t || emptyCubeTexture, i);
}
function setValueV1i(e, t) {
  const n = this.cache;
  n[0] !== t && (e.uniform1i(this.addr, t), (n[0] = t));
}
function setValueV2i(e, t) {
  const n = this.cache;
  arraysEqual(n, t) || (e.uniform2iv(this.addr, t), copyArray(n, t));
}
function setValueV3i(e, t) {
  const n = this.cache;
  arraysEqual(n, t) || (e.uniform3iv(this.addr, t), copyArray(n, t));
}
function setValueV4i(e, t) {
  const n = this.cache;
  arraysEqual(n, t) || (e.uniform4iv(this.addr, t), copyArray(n, t));
}
function setValueV1ui(e, t) {
  const n = this.cache;
  n[0] !== t && (e.uniform1ui(this.addr, t), (n[0] = t));
}
function getSingularSetter(e) {
  switch (e) {
    case 5126:
      return setValueV1f;
    case 35664:
      return setValueV2f;
    case 35665:
      return setValueV3f;
    case 35666:
      return setValueV4f;
    case 35674:
      return setValueM2;
    case 35675:
      return setValueM3;
    case 35676:
      return setValueM4;
    case 5124:
    case 35670:
      return setValueV1i;
    case 35667:
    case 35671:
      return setValueV2i;
    case 35668:
    case 35672:
      return setValueV3i;
    case 35669:
    case 35673:
      return setValueV4i;
    case 5125:
      return setValueV1ui;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return setValueT1;
    case 35679:
    case 36299:
    case 36307:
      return setValueT3D1;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return setValueT6;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
      return setValueT2DArray1;
  }
}
function setValueV1fArray(e, t) {
  e.uniform1fv(this.addr, t);
}
function setValueV1iArray(e, t) {
  e.uniform1iv(this.addr, t);
}
function setValueV2iArray(e, t) {
  e.uniform2iv(this.addr, t);
}
function setValueV3iArray(e, t) {
  e.uniform3iv(this.addr, t);
}
function setValueV4iArray(e, t) {
  e.uniform4iv(this.addr, t);
}
function setValueV2fArray(e, t) {
  const n = flatten(t, this.size, 2);
  e.uniform2fv(this.addr, n);
}
function setValueV3fArray(e, t) {
  const n = flatten(t, this.size, 3);
  e.uniform3fv(this.addr, n);
}
function setValueV4fArray(e, t) {
  const n = flatten(t, this.size, 4);
  e.uniform4fv(this.addr, n);
}
function setValueM2Array(e, t) {
  const n = flatten(t, this.size, 4);
  e.uniformMatrix2fv(this.addr, !1, n);
}
function setValueM3Array(e, t) {
  const n = flatten(t, this.size, 9);
  e.uniformMatrix3fv(this.addr, !1, n);
}
function setValueM4Array(e, t) {
  const n = flatten(t, this.size, 16);
  e.uniformMatrix4fv(this.addr, !1, n);
}
function setValueT1Array(e, t, n) {
  const r = t.length,
    i = allocTexUnits(n, r);
  e.uniform1iv(this.addr, i);
  for (let e = 0; e !== r; ++e) n.safeSetTexture2D(t[e] || emptyTexture, i[e]);
}
function setValueT6Array(e, t, n) {
  const r = t.length,
    i = allocTexUnits(n, r);
  e.uniform1iv(this.addr, i);
  for (let e = 0; e !== r; ++e)
    n.safeSetTextureCube(t[e] || emptyCubeTexture, i[e]);
}
function getPureArraySetter(e) {
  switch (e) {
    case 5126:
      return setValueV1fArray;
    case 35664:
      return setValueV2fArray;
    case 35665:
      return setValueV3fArray;
    case 35666:
      return setValueV4fArray;
    case 35674:
      return setValueM2Array;
    case 35675:
      return setValueM3Array;
    case 35676:
      return setValueM4Array;
    case 5124:
    case 35670:
      return setValueV1iArray;
    case 35667:
    case 35671:
      return setValueV2iArray;
    case 35668:
    case 35672:
      return setValueV3iArray;
    case 35669:
    case 35673:
      return setValueV4iArray;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return setValueT1Array;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return setValueT6Array;
  }
}
function SingleUniform(e, t, n) {
  (this.id = e),
    (this.addr = n),
    (this.cache = []),
    (this.setValue = getSingularSetter(t.type));
}
function PureArrayUniform(e, t, n) {
  (this.id = e),
    (this.addr = n),
    (this.cache = []),
    (this.size = t.size),
    (this.setValue = getPureArraySetter(t.type));
}
function StructuredUniform(e) {
  (this.id = e), (this.seq = []), (this.map = {});
}
(PureArrayUniform.prototype.updateCache = function (e) {
  const t = this.cache;
  e instanceof Float32Array &&
    t.length !== e.length &&
    (this.cache = new Float32Array(e.length)),
    copyArray(t, e);
}),
  (StructuredUniform.prototype.setValue = function (e, t, n) {
    const r = this.seq;
    for (let i = 0, o = r.length; i !== o; ++i) {
      const o = r[i];
      o.setValue(e, t[o.id], n);
    }
  });
const RePathPart = /([\w\d_]+)(\])?(\[|\.)?/g;
function addUniform(e, t) {
  e.seq.push(t), (e.map[t.id] = t);
}
function parseUniform(e, t, n) {
  const r = e.name,
    i = r.length;
  for (RePathPart.lastIndex = 0; ; ) {
    const o = RePathPart.exec(r),
      a = RePathPart.lastIndex;
    let s = o[1];
    const c = "]" === o[2],
      l = o[3];
    if ((c && (s |= 0), void 0 === l || ("[" === l && a + 2 === i))) {
      addUniform(
        n,
        void 0 === l
          ? new SingleUniform(s, e, t)
          : new PureArrayUniform(s, e, t)
      );
      break;
    }
    {
      let e = n.map[s];
      void 0 === e && addUniform(n, (e = new StructuredUniform(s))), (n = e);
    }
  }
}
function WebGLUniforms(e, t) {
  (this.seq = []), (this.map = {});
  const n = e.getProgramParameter(t, 35718);
  for (let r = 0; r < n; ++r) {
    const n = e.getActiveUniform(t, r);
    parseUniform(n, e.getUniformLocation(t, n.name), this);
  }
}
function WebGLShader(e, t, n) {
  const r = e.createShader(t);
  return e.shaderSource(r, n), e.compileShader(r), r;
}
(WebGLUniforms.prototype.setValue = function (e, t, n, r) {
  const i = this.map[t];
  void 0 !== i && i.setValue(e, n, r);
}),
  (WebGLUniforms.prototype.setOptional = function (e, t, n) {
    const r = t[n];
    void 0 !== r && this.setValue(e, n, r);
  }),
  (WebGLUniforms.upload = function (e, t, n, r) {
    for (let i = 0, o = t.length; i !== o; ++i) {
      const o = t[i],
        a = n[o.id];
      !1 !== a.needsUpdate && o.setValue(e, a.value, r);
    }
  }),
  (WebGLUniforms.seqWithValue = function (e, t) {
    const n = [];
    for (let r = 0, i = e.length; r !== i; ++r) {
      const i = e[r];
      i.id in t && n.push(i);
    }
    return n;
  });
let programIdCount = 0;
function addLineNumbers(e) {
  const t = e.split("\n");
  for (let e = 0; e < t.length; e++) t[e] = e + 1 + ": " + t[e];
  return t.join("\n");
}
function getEncodingComponents(e) {
  switch (e) {
    case LinearEncoding:
      return ["Linear", "( value )"];
    case sRGBEncoding:
      return ["sRGB", "( value )"];
    case RGBEEncoding:
      return ["RGBE", "( value )"];
    case RGBM7Encoding:
      return ["RGBM", "( value, 7.0 )"];
    case RGBM16Encoding:
      return ["RGBM", "( value, 16.0 )"];
    case RGBDEncoding:
      return ["RGBD", "( value, 256.0 )"];
    case GammaEncoding:
      return ["Gamma", "( value, float( GAMMA_FACTOR ) )"];
    case LogLuvEncoding:
      return ["LogLuv", "( value )"];
    default:
      return (
        console.warn("THREE.WebGLProgram: Unsupported encoding:", e),
        ["Linear", "( value )"]
      );
  }
}
function getShaderErrors(e, t, n) {
  const r = e.getShaderParameter(t, 35713),
    i = e.getShaderInfoLog(t).trim();
  return r && "" === i
    ? ""
    : "THREE.WebGLShader: gl.getShaderInfoLog() " +
        n +
        "\n" +
        i +
        addLineNumbers(e.getShaderSource(t));
}
function getTexelDecodingFunction(e, t) {
  const n = getEncodingComponents(t);
  return (
    "vec4 " + e + "( vec4 value ) { return " + n[0] + "ToLinear" + n[1] + "; }"
  );
}
function getTexelEncodingFunction(e, t) {
  const n = getEncodingComponents(t);
  return "vec4 " + e + "( vec4 value ) { return LinearTo" + n[0] + n[1] + "; }";
}
function getToneMappingFunction(e, t) {
  let n;
  switch (t) {
    case LinearToneMapping:
      n = "Linear";
      break;
    case ReinhardToneMapping:
      n = "Reinhard";
      break;
    case CineonToneMapping:
      n = "OptimizedCineon";
      break;
    case ACESFilmicToneMapping:
      n = "ACESFilmic";
      break;
    case CustomToneMapping:
      n = "Custom";
      break;
    default:
      console.warn("THREE.WebGLProgram: Unsupported toneMapping:", t),
        (n = "Linear");
  }
  return (
    "vec3 " + e + "( vec3 color ) { return " + n + "ToneMapping( color ); }"
  );
}
function generateExtensions(e) {
  return [
    e.extensionDerivatives ||
    e.envMapCubeUV ||
    e.bumpMap ||
    e.tangentSpaceNormalMap ||
    e.clearcoatNormalMap ||
    e.flatShading ||
    "physical" === e.shaderID
      ? "#extension GL_OES_standard_derivatives : enable"
      : "",
    (e.extensionFragDepth || e.logarithmicDepthBuffer) &&
    e.rendererExtensionFragDepth
      ? "#extension GL_EXT_frag_depth : enable"
      : "",
    e.extensionDrawBuffers && e.rendererExtensionDrawBuffers
      ? "#extension GL_EXT_draw_buffers : require"
      : "",
    (e.extensionShaderTextureLOD || e.envMap) &&
    e.rendererExtensionShaderTextureLod
      ? "#extension GL_EXT_shader_texture_lod : enable"
      : ""
  ]
    .filter(filterEmptyLine)
    .join("\n");
}
function generateDefines(e) {
  const t = [];
  for (const n in e) {
    const r = e[n];
    !1 !== r && t.push("#define " + n + " " + r);
  }
  return t.join("\n");
}
function fetchAttributeLocations(e, t) {
  const n = {},
    r = e.getProgramParameter(t, 35721);
  for (let i = 0; i < r; i++) {
    const r = e.getActiveAttrib(t, i).name;
    n[r] = e.getAttribLocation(t, r);
  }
  return n;
}
function filterEmptyLine(e) {
  return "" !== e;
}
function replaceLightNums(e, t) {
  return e
    .replace(/NUM_DIR_LIGHTS/g, t.numDirLights)
    .replace(/NUM_SPOT_LIGHTS/g, t.numSpotLights)
    .replace(/NUM_RECT_AREA_LIGHTS/g, t.numRectAreaLights)
    .replace(/NUM_POINT_LIGHTS/g, t.numPointLights)
    .replace(/NUM_HEMI_LIGHTS/g, t.numHemiLights)
    .replace(/NUM_DIR_LIGHT_SHADOWS/g, t.numDirLightShadows)
    .replace(/NUM_SPOT_LIGHT_SHADOWS/g, t.numSpotLightShadows)
    .replace(/NUM_POINT_LIGHT_SHADOWS/g, t.numPointLightShadows);
}
function replaceClippingPlaneNums(e, t) {
  return e
    .replace(/NUM_CLIPPING_PLANES/g, t.numClippingPlanes)
    .replace(
      /UNION_CLIPPING_PLANES/g,
      t.numClippingPlanes - t.numClipIntersection
    );
}
const includePattern = /^[ \t]*#include +<([\w\d.\/]+)>/gm;
function resolveIncludes(e) {
  return e.replace(includePattern, includeReplacer);
}
function includeReplacer(e, t) {
  const n = ShaderChunk[t];
  if (void 0 === n) throw new Error("Can not resolve #include <" + t + ">");
  return resolveIncludes(n);
}
const deprecatedUnrollLoopPattern =
    /#pragma unroll_loop[\s]+?for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g,
  unrollLoopPattern =
    /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function unrollLoops(e) {
  return e
    .replace(unrollLoopPattern, loopReplacer)
    .replace(deprecatedUnrollLoopPattern, deprecatedLoopReplacer);
}
function deprecatedLoopReplacer(e, t, n, r) {
  return (
    console.warn(
      "WebGLProgram: #pragma unroll_loop shader syntax is deprecated. Please use #pragma unroll_loop_start syntax instead."
    ),
    loopReplacer(e, t, n, r)
  );
}
function loopReplacer(e, t, n, r) {
  let i = "";
  for (let e = parseInt(t); e < parseInt(n); e++)
    i += r
      .replace(/\[\s*i\s*\]/g, "[ " + e + " ]")
      .replace(/UNROLLED_LOOP_INDEX/g, e);
  return i;
}
function generatePrecision(e) {
  let t =
    "precision " + e.precision + " float;\nprecision " + e.precision + " int;";
  return (
    "highp" === e.precision
      ? (t += "\n#define HIGH_PRECISION")
      : "mediump" === e.precision
      ? (t += "\n#define MEDIUM_PRECISION")
      : "lowp" === e.precision && (t += "\n#define LOW_PRECISION"),
    t
  );
}
function generateShadowMapTypeDefine(e) {
  let t = "SHADOWMAP_TYPE_BASIC";
  return (
    e.shadowMapType === PCFShadowMap
      ? (t = "SHADOWMAP_TYPE_PCF")
      : e.shadowMapType === PCFSoftShadowMap
      ? (t = "SHADOWMAP_TYPE_PCF_SOFT")
      : e.shadowMapType === VSMShadowMap && (t = "SHADOWMAP_TYPE_VSM"),
    t
  );
}
function generateEnvMapTypeDefine(e) {
  let t = "ENVMAP_TYPE_CUBE";
  if (e.envMap)
    switch (e.envMapMode) {
      case CubeReflectionMapping:
      case CubeRefractionMapping:
        t = "ENVMAP_TYPE_CUBE";
        break;
      case CubeUVReflectionMapping:
      case CubeUVRefractionMapping:
        t = "ENVMAP_TYPE_CUBE_UV";
    }
  return t;
}
function generateEnvMapModeDefine(e) {
  let t = "ENVMAP_MODE_REFLECTION";
  if (e.envMap)
    switch (e.envMapMode) {
      case CubeRefractionMapping:
      case CubeUVRefractionMapping:
        t = "ENVMAP_MODE_REFRACTION";
    }
  return t;
}
function generateEnvMapBlendingDefine(e) {
  let t = "ENVMAP_BLENDING_NONE";
  if (e.envMap)
    switch (e.combine) {
      case MultiplyOperation:
        t = "ENVMAP_BLENDING_MULTIPLY";
        break;
      case MixOperation:
        t = "ENVMAP_BLENDING_MIX";
        break;
      case AddOperation:
        t = "ENVMAP_BLENDING_ADD";
    }
  return t;
}
function WebGLProgram(e, t, n, r) {
  const i = e.getContext(),
    o = n.defines;
  let a = n.vertexShader,
    s = n.fragmentShader;
  const c = generateShadowMapTypeDefine(n),
    l = generateEnvMapTypeDefine(n),
    h = generateEnvMapModeDefine(n),
    u = generateEnvMapBlendingDefine(n),
    d = e.gammaFactor > 0 ? e.gammaFactor : 1,
    p = n.isWebGL2 ? "" : generateExtensions(n),
    m = generateDefines(o),
    f = i.createProgram();
  let g,
    v,
    y = n.glslVersion ? "#version " + n.glslVersion + "\n" : "";
  n.isRawShaderMaterial
    ? ((g = [m].filter(filterEmptyLine).join("\n")).length > 0 && (g += "\n"),
      (v = [p, m].filter(filterEmptyLine).join("\n")).length > 0 && (v += "\n"))
    : ((g = [
        generatePrecision(n),
        "#define SHADER_NAME " + n.shaderName,
        m,
        n.instancing ? "#define USE_INSTANCING" : "",
        n.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
        n.supportsVertexTextures ? "#define VERTEX_TEXTURES" : "",
        "#define GAMMA_FACTOR " + d,
        "#define MAX_BONES " + n.maxBones,
        n.useFog && n.fog ? "#define USE_FOG" : "",
        n.useFog && n.fogExp2 ? "#define FOG_EXP2" : "",
        n.map ? "#define USE_MAP" : "",
        n.envMap ? "#define USE_ENVMAP" : "",
        n.envMap ? "#define " + h : "",
        n.lightMap ? "#define USE_LIGHTMAP" : "",
        n.aoMap ? "#define USE_AOMAP" : "",
        n.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
        n.bumpMap ? "#define USE_BUMPMAP" : "",
        n.normalMap ? "#define USE_NORMALMAP" : "",
        n.normalMap && n.objectSpaceNormalMap
          ? "#define OBJECTSPACE_NORMALMAP"
          : "",
        n.normalMap && n.tangentSpaceNormalMap
          ? "#define TANGENTSPACE_NORMALMAP"
          : "",
        n.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
        n.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
        n.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
        n.displacementMap && n.supportsVertexTextures
          ? "#define USE_DISPLACEMENTMAP"
          : "",
        n.specularMap ? "#define USE_SPECULARMAP" : "",
        n.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
        n.metalnessMap ? "#define USE_METALNESSMAP" : "",
        n.alphaMap ? "#define USE_ALPHAMAP" : "",
        n.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
        n.vertexTangents ? "#define USE_TANGENT" : "",
        n.vertexColors ? "#define USE_COLOR" : "",
        n.vertexUvs ? "#define USE_UV" : "",
        n.uvsVertexOnly ? "#define UVS_VERTEX_ONLY" : "",
        n.flatShading ? "#define FLAT_SHADED" : "",
        n.skinning ? "#define USE_SKINNING" : "",
        n.useVertexTexture ? "#define BONE_TEXTURE" : "",
        n.morphTargets ? "#define USE_MORPHTARGETS" : "",
        n.morphNormals && !1 === n.flatShading
          ? "#define USE_MORPHNORMALS"
          : "",
        n.doubleSided ? "#define DOUBLE_SIDED" : "",
        n.flipSided ? "#define FLIP_SIDED" : "",
        n.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
        n.shadowMapEnabled ? "#define " + c : "",
        n.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
        n.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
        n.logarithmicDepthBuffer && n.rendererExtensionFragDepth
          ? "#define USE_LOGDEPTHBUF_EXT"
          : "",
        "uniform mat4 modelMatrix;",
        "uniform mat4 modelViewMatrix;",
        "uniform mat4 projectionMatrix;",
        "uniform mat4 viewMatrix;",
        "uniform mat3 normalMatrix;",
        "uniform vec3 cameraPosition;",
        "uniform bool isOrthographic;",
        "#ifdef USE_INSTANCING",
        "\tattribute mat4 instanceMatrix;",
        "#endif",
        "#ifdef USE_INSTANCING_COLOR",
        "\tattribute vec3 instanceColor;",
        "#endif",
        "attribute vec3 position;",
        "attribute vec3 normal;",
        "attribute vec2 uv;",
        "#ifdef USE_TANGENT",
        "\tattribute vec4 tangent;",
        "#endif",
        "#ifdef USE_COLOR",
        "\tattribute vec3 color;",
        "#endif",
        "#ifdef USE_MORPHTARGETS",
        "\tattribute vec3 morphTarget0;",
        "\tattribute vec3 morphTarget1;",
        "\tattribute vec3 morphTarget2;",
        "\tattribute vec3 morphTarget3;",
        "\t#ifdef USE_MORPHNORMALS",
        "\t\tattribute vec3 morphNormal0;",
        "\t\tattribute vec3 morphNormal1;",
        "\t\tattribute vec3 morphNormal2;",
        "\t\tattribute vec3 morphNormal3;",
        "\t#else",
        "\t\tattribute vec3 morphTarget4;",
        "\t\tattribute vec3 morphTarget5;",
        "\t\tattribute vec3 morphTarget6;",
        "\t\tattribute vec3 morphTarget7;",
        "\t#endif",
        "#endif",
        "#ifdef USE_SKINNING",
        "\tattribute vec4 skinIndex;",
        "\tattribute vec4 skinWeight;",
        "#endif",
        "\n"
      ]
        .filter(filterEmptyLine)
        .join("\n")),
      (v = [
        p,
        generatePrecision(n),
        "#define SHADER_NAME " + n.shaderName,
        m,
        n.alphaTest
          ? "#define ALPHATEST " + n.alphaTest + (n.alphaTest % 1 ? "" : ".0")
          : "",
        "#define GAMMA_FACTOR " + d,
        n.useFog && n.fog ? "#define USE_FOG" : "",
        n.useFog && n.fogExp2 ? "#define FOG_EXP2" : "",
        n.map ? "#define USE_MAP" : "",
        n.matcap ? "#define USE_MATCAP" : "",
        n.envMap ? "#define USE_ENVMAP" : "",
        n.envMap ? "#define " + l : "",
        n.envMap ? "#define " + h : "",
        n.envMap ? "#define " + u : "",
        n.lightMap ? "#define USE_LIGHTMAP" : "",
        n.aoMap ? "#define USE_AOMAP" : "",
        n.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
        n.bumpMap ? "#define USE_BUMPMAP" : "",
        n.normalMap ? "#define USE_NORMALMAP" : "",
        n.normalMap && n.objectSpaceNormalMap
          ? "#define OBJECTSPACE_NORMALMAP"
          : "",
        n.normalMap && n.tangentSpaceNormalMap
          ? "#define TANGENTSPACE_NORMALMAP"
          : "",
        n.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
        n.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
        n.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
        n.specularMap ? "#define USE_SPECULARMAP" : "",
        n.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
        n.metalnessMap ? "#define USE_METALNESSMAP" : "",
        n.alphaMap ? "#define USE_ALPHAMAP" : "",
        n.sheen ? "#define USE_SHEEN" : "",
        n.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
        n.vertexTangents ? "#define USE_TANGENT" : "",
        n.vertexColors || n.instancingColor ? "#define USE_COLOR" : "",
        n.vertexUvs ? "#define USE_UV" : "",
        n.uvsVertexOnly ? "#define UVS_VERTEX_ONLY" : "",
        n.gradientMap ? "#define USE_GRADIENTMAP" : "",
        n.flatShading ? "#define FLAT_SHADED" : "",
        n.doubleSided ? "#define DOUBLE_SIDED" : "",
        n.flipSided ? "#define FLIP_SIDED" : "",
        n.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
        n.shadowMapEnabled ? "#define " + c : "",
        n.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
        n.physicallyCorrectLights ? "#define PHYSICALLY_CORRECT_LIGHTS" : "",
        n.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
        n.logarithmicDepthBuffer && n.rendererExtensionFragDepth
          ? "#define USE_LOGDEPTHBUF_EXT"
          : "",
        (n.extensionShaderTextureLOD || n.envMap) &&
        n.rendererExtensionShaderTextureLod
          ? "#define TEXTURE_LOD_EXT"
          : "",
        "uniform mat4 viewMatrix;",
        "uniform vec3 cameraPosition;",
        "uniform bool isOrthographic;",
        n.toneMapping !== NoToneMapping ? "#define TONE_MAPPING" : "",
        n.toneMapping !== NoToneMapping
          ? ShaderChunk.tonemapping_pars_fragment
          : "",
        n.toneMapping !== NoToneMapping
          ? getToneMappingFunction("toneMapping", n.toneMapping)
          : "",
        n.dithering ? "#define DITHERING" : "",
        ShaderChunk.encodings_pars_fragment,
        n.map
          ? getTexelDecodingFunction("mapTexelToLinear", n.mapEncoding)
          : "",
        n.matcap
          ? getTexelDecodingFunction("matcapTexelToLinear", n.matcapEncoding)
          : "",
        n.envMap
          ? getTexelDecodingFunction("envMapTexelToLinear", n.envMapEncoding)
          : "",
        n.emissiveMap
          ? getTexelDecodingFunction(
              "emissiveMapTexelToLinear",
              n.emissiveMapEncoding
            )
          : "",
        n.lightMap
          ? getTexelDecodingFunction(
              "lightMapTexelToLinear",
              n.lightMapEncoding
            )
          : "",
        getTexelEncodingFunction("linearToOutputTexel", n.outputEncoding),
        n.depthPacking ? "#define DEPTH_PACKING " + n.depthPacking : "",
        "\n"
      ]
        .filter(filterEmptyLine)
        .join("\n"))),
    (a = replaceClippingPlaneNums(
      (a = replaceLightNums((a = resolveIncludes(a)), n)),
      n
    )),
    (s = replaceClippingPlaneNums(
      (s = replaceLightNums((s = resolveIncludes(s)), n)),
      n
    )),
    (a = unrollLoops(a)),
    (s = unrollLoops(s)),
    n.isWebGL2 &&
      !0 !== n.isRawShaderMaterial &&
      ((y = "#version 300 es\n"),
      (g =
        [
          "#define attribute in",
          "#define varying out",
          "#define texture2D texture"
        ].join("\n") +
        "\n" +
        g),
      (v =
        [
          "#define varying in",
          n.glslVersion === GLSL3 ? "" : "out highp vec4 pc_fragColor;",
          n.glslVersion === GLSL3 ? "" : "#define gl_FragColor pc_fragColor",
          "#define gl_FragDepthEXT gl_FragDepth",
          "#define texture2D texture",
          "#define textureCube texture",
          "#define texture2DProj textureProj",
          "#define texture2DLodEXT textureLod",
          "#define texture2DProjLodEXT textureProjLod",
          "#define textureCubeLodEXT textureLod",
          "#define texture2DGradEXT textureGrad",
          "#define texture2DProjGradEXT textureProjGrad",
          "#define textureCubeGradEXT textureGrad"
        ].join("\n") +
        "\n" +
        v));
  const _ = y + v + s,
    x = WebGLShader(i, 35633, y + g + a),
    b = WebGLShader(i, 35632, _);
  if (
    (i.attachShader(f, x),
    i.attachShader(f, b),
    void 0 !== n.index0AttributeName
      ? i.bindAttribLocation(f, 0, n.index0AttributeName)
      : !0 === n.morphTargets && i.bindAttribLocation(f, 0, "position"),
    i.linkProgram(f),
    e.debug.checkShaderErrors)
  ) {
    const e = i.getProgramInfoLog(f).trim(),
      t = i.getShaderInfoLog(x).trim(),
      n = i.getShaderInfoLog(b).trim();
    let r = !0,
      o = !0;
    if (!1 === i.getProgramParameter(f, 35714)) {
      r = !1;
      const t = getShaderErrors(i, x, "vertex"),
        n = getShaderErrors(i, b, "fragment");
      console.error(
        "THREE.WebGLProgram: shader error: ",
        i.getError(),
        "35715",
        i.getProgramParameter(f, 35715),
        "gl.getProgramInfoLog",
        e,
        t,
        n
      );
    } else
      "" !== e
        ? console.warn("THREE.WebGLProgram: gl.getProgramInfoLog()", e)
        : ("" !== t && "" !== n) || (o = !1);
    o &&
      (this.diagnostics = {
        runnable: r,
        programLog: e,
        vertexShader: { log: t, prefix: g },
        fragmentShader: { log: n, prefix: v }
      });
  }
  let M, w;
  return (
    i.deleteShader(x),
    i.deleteShader(b),
    (this.getUniforms = function () {
      return void 0 === M && (M = new WebGLUniforms(i, f)), M;
    }),
    (this.getAttributes = function () {
      return void 0 === w && (w = fetchAttributeLocations(i, f)), w;
    }),
    (this.destroy = function () {
      r.releaseStatesOfProgram(this),
        i.deleteProgram(f),
        (this.program = void 0);
    }),
    (this.name = n.shaderName),
    (this.id = programIdCount++),
    (this.cacheKey = t),
    (this.usedTimes = 1),
    (this.program = f),
    (this.vertexShader = x),
    (this.fragmentShader = b),
    this
  );
}
function WebGLPrograms(e, t, n, r, i, o) {
  const a = [],
    s = r.isWebGL2,
    c = r.logarithmicDepthBuffer,
    l = r.floatVertexTextures,
    h = r.maxVertexUniforms,
    u = r.vertexTextures;
  let d = r.precision;
  const p = {
      MeshDepthMaterial: "depth",
      MeshDistanceMaterial: "distanceRGBA",
      MeshNormalMaterial: "normal",
      MeshBasicMaterial: "basic",
      MeshLambertMaterial: "lambert",
      MeshPhongMaterial: "phong",
      MeshToonMaterial: "toon",
      MeshStandardMaterial: "physical",
      MeshPhysicalMaterial: "physical",
      MeshMatcapMaterial: "matcap",
      LineBasicMaterial: "basic",
      LineDashedMaterial: "dashed",
      PointsMaterial: "points",
      ShadowMaterial: "shadow",
      SpriteMaterial: "sprite"
    },
    m = [
      "precision",
      "isWebGL2",
      "supportsVertexTextures",
      "outputEncoding",
      "instancing",
      "instancingColor",
      "map",
      "mapEncoding",
      "matcap",
      "matcapEncoding",
      "envMap",
      "envMapMode",
      "envMapEncoding",
      "envMapCubeUV",
      "lightMap",
      "lightMapEncoding",
      "aoMap",
      "emissiveMap",
      "emissiveMapEncoding",
      "bumpMap",
      "normalMap",
      "objectSpaceNormalMap",
      "tangentSpaceNormalMap",
      "clearcoatMap",
      "clearcoatRoughnessMap",
      "clearcoatNormalMap",
      "displacementMap",
      "specularMap",
      "roughnessMap",
      "metalnessMap",
      "gradientMap",
      "alphaMap",
      "combine",
      "vertexColors",
      "vertexTangents",
      "vertexUvs",
      "uvsVertexOnly",
      "fog",
      "useFog",
      "fogExp2",
      "flatShading",
      "sizeAttenuation",
      "logarithmicDepthBuffer",
      "skinning",
      "maxBones",
      "useVertexTexture",
      "morphTargets",
      "morphNormals",
      "maxMorphTargets",
      "maxMorphNormals",
      "premultipliedAlpha",
      "numDirLights",
      "numPointLights",
      "numSpotLights",
      "numHemiLights",
      "numRectAreaLights",
      "numDirLightShadows",
      "numPointLightShadows",
      "numSpotLightShadows",
      "shadowMapEnabled",
      "shadowMapType",
      "toneMapping",
      "physicallyCorrectLights",
      "alphaTest",
      "doubleSided",
      "flipSided",
      "numClippingPlanes",
      "numClipIntersection",
      "depthPacking",
      "dithering",
      "sheen",
      "transmissionMap"
    ];
  function f(e) {
    let t;
    return (
      e
        ? e.isTexture
          ? (t = e.encoding)
          : e.isWebGLRenderTarget &&
            (console.warn(
              "THREE.WebGLPrograms.getTextureEncodingFromMap: don't use render targets as textures. Use their .texture property instead."
            ),
            (t = e.texture.encoding))
        : (t = LinearEncoding),
      t
    );
  }
  return {
    getParameters: function (i, a, m, g, v) {
      const y = g.fog,
        _ = i.isMeshStandardMaterial ? g.environment : null,
        x = t.get(i.envMap || _),
        b = p[i.type],
        M = v.isSkinnedMesh
          ? (function (e) {
              const t = e.skeleton.bones;
              if (l) return 1024;
              {
                const e = h,
                  n = Math.floor((e - 20) / 4),
                  r = Math.min(n, t.length);
                return r < t.length
                  ? (console.warn(
                      "THREE.WebGLRenderer: Skeleton has " +
                        t.length +
                        " bones. This GPU supports " +
                        r +
                        "."
                    ),
                    0)
                  : r;
              }
            })(v)
          : 0;
      let w, S;
      if (
        (null !== i.precision &&
          (d = r.getMaxPrecision(i.precision)) !== i.precision &&
          console.warn(
            "THREE.WebGLProgram.getParameters:",
            i.precision,
            "not supported, using",
            d,
            "instead."
          ),
        b)
      ) {
        const e = ShaderLib[b];
        (w = e.vertexShader), (S = e.fragmentShader);
      } else (w = i.vertexShader), (S = i.fragmentShader);
      const T = e.getRenderTarget();
      return {
        isWebGL2: s,
        shaderID: b,
        shaderName: i.type,
        vertexShader: w,
        fragmentShader: S,
        defines: i.defines,
        isRawShaderMaterial: !0 === i.isRawShaderMaterial,
        glslVersion: i.glslVersion,
        precision: d,
        instancing: !0 === v.isInstancedMesh,
        instancingColor: !0 === v.isInstancedMesh && null !== v.instanceColor,
        supportsVertexTextures: u,
        outputEncoding: null !== T ? f(T.texture) : e.outputEncoding,
        map: !!i.map,
        mapEncoding: f(i.map),
        matcap: !!i.matcap,
        matcapEncoding: f(i.matcap),
        envMap: !!x,
        envMapMode: x && x.mapping,
        envMapEncoding: f(x),
        envMapCubeUV:
          !!x &&
          (x.mapping === CubeUVReflectionMapping ||
            x.mapping === CubeUVRefractionMapping),
        lightMap: !!i.lightMap,
        lightMapEncoding: f(i.lightMap),
        aoMap: !!i.aoMap,
        emissiveMap: !!i.emissiveMap,
        emissiveMapEncoding: f(i.emissiveMap),
        bumpMap: !!i.bumpMap,
        normalMap: !!i.normalMap,
        objectSpaceNormalMap: i.normalMapType === ObjectSpaceNormalMap,
        tangentSpaceNormalMap: i.normalMapType === TangentSpaceNormalMap,
        clearcoatMap: !!i.clearcoatMap,
        clearcoatRoughnessMap: !!i.clearcoatRoughnessMap,
        clearcoatNormalMap: !!i.clearcoatNormalMap,
        displacementMap: !!i.displacementMap,
        roughnessMap: !!i.roughnessMap,
        metalnessMap: !!i.metalnessMap,
        specularMap: !!i.specularMap,
        alphaMap: !!i.alphaMap,
        gradientMap: !!i.gradientMap,
        sheen: !!i.sheen,
        transmissionMap: !!i.transmissionMap,
        combine: i.combine,
        vertexTangents: i.normalMap && i.vertexTangents,
        vertexColors: i.vertexColors,
        vertexUvs: !!(
          i.map ||
          i.bumpMap ||
          i.normalMap ||
          i.specularMap ||
          i.alphaMap ||
          i.emissiveMap ||
          i.roughnessMap ||
          i.metalnessMap ||
          i.clearcoatMap ||
          i.clearcoatRoughnessMap ||
          i.clearcoatNormalMap ||
          i.displacementMap ||
          i.transmissionMap
        ),
        uvsVertexOnly: !(
          i.map ||
          i.bumpMap ||
          i.normalMap ||
          i.specularMap ||
          i.alphaMap ||
          i.emissiveMap ||
          i.roughnessMap ||
          i.metalnessMap ||
          i.clearcoatNormalMap ||
          i.transmissionMap ||
          !i.displacementMap
        ),
        fog: !!y,
        useFog: i.fog,
        fogExp2: y && y.isFogExp2,
        flatShading: i.flatShading,
        sizeAttenuation: i.sizeAttenuation,
        logarithmicDepthBuffer: c,
        skinning: i.skinning && M > 0,
        maxBones: M,
        useVertexTexture: l,
        morphTargets: i.morphTargets,
        morphNormals: i.morphNormals,
        maxMorphTargets: e.maxMorphTargets,
        maxMorphNormals: e.maxMorphNormals,
        numDirLights: a.directional.length,
        numPointLights: a.point.length,
        numSpotLights: a.spot.length,
        numRectAreaLights: a.rectArea.length,
        numHemiLights: a.hemi.length,
        numDirLightShadows: a.directionalShadowMap.length,
        numPointLightShadows: a.pointShadowMap.length,
        numSpotLightShadows: a.spotShadowMap.length,
        numClippingPlanes: o.numPlanes,
        numClipIntersection: o.numIntersection,
        dithering: i.dithering,
        shadowMapEnabled: e.shadowMap.enabled && m.length > 0,
        shadowMapType: e.shadowMap.type,
        toneMapping: i.toneMapped ? e.toneMapping : NoToneMapping,
        physicallyCorrectLights: e.physicallyCorrectLights,
        premultipliedAlpha: i.premultipliedAlpha,
        alphaTest: i.alphaTest,
        doubleSided: i.side === DoubleSide,
        flipSided: i.side === BackSide,
        depthPacking: void 0 !== i.depthPacking && i.depthPacking,
        index0AttributeName: i.index0AttributeName,
        extensionDerivatives: i.extensions && i.extensions.derivatives,
        extensionFragDepth: i.extensions && i.extensions.fragDepth,
        extensionDrawBuffers: i.extensions && i.extensions.drawBuffers,
        extensionShaderTextureLOD:
          i.extensions && i.extensions.shaderTextureLOD,
        rendererExtensionFragDepth: s || n.has("EXT_frag_depth"),
        rendererExtensionDrawBuffers: s || n.has("WEBGL_draw_buffers"),
        rendererExtensionShaderTextureLod: s || n.has("EXT_shader_texture_lod"),
        customProgramCacheKey: i.customProgramCacheKey()
      };
    },
    getProgramCacheKey: function (t) {
      const n = [];
      if (
        (t.shaderID
          ? n.push(t.shaderID)
          : (n.push(t.fragmentShader), n.push(t.vertexShader)),
        void 0 !== t.defines)
      )
        for (const e in t.defines) n.push(e), n.push(t.defines[e]);
      if (!1 === t.isRawShaderMaterial) {
        for (let e = 0; e < m.length; e++) n.push(t[m[e]]);
        n.push(e.outputEncoding), n.push(e.gammaFactor);
      }
      return n.push(t.customProgramCacheKey), n.join();
    },
    getUniforms: function (e) {
      const t = p[e.type];
      let n;
      if (t) {
        const e = ShaderLib[t];
        n = UniformsUtils.clone(e.uniforms);
      } else n = e.uniforms;
      return n;
    },
    acquireProgram: function (t, n) {
      let r;
      for (let e = 0, t = a.length; e < t; e++) {
        const t = a[e];
        if (t.cacheKey === n) {
          ++(r = t).usedTimes;
          break;
        }
      }
      return void 0 === r && ((r = new WebGLProgram(e, n, t, i)), a.push(r)), r;
    },
    releaseProgram: function (e) {
      if (0 == --e.usedTimes) {
        const t = a.indexOf(e);
        (a[t] = a[a.length - 1]), a.pop(), e.destroy();
      }
    },
    programs: a
  };
}
function WebGLProperties() {
  let e = new WeakMap();
  return {
    get: function (t) {
      let n = e.get(t);
      return void 0 === n && ((n = {}), e.set(t, n)), n;
    },
    remove: function (t) {
      e.delete(t);
    },
    update: function (t, n, r) {
      e.get(t)[n] = r;
    },
    dispose: function () {
      e = new WeakMap();
    }
  };
}
function painterSortStable(e, t) {
  return e.groupOrder !== t.groupOrder
    ? e.groupOrder - t.groupOrder
    : e.renderOrder !== t.renderOrder
    ? e.renderOrder - t.renderOrder
    : e.program !== t.program
    ? e.program.id - t.program.id
    : e.material.id !== t.material.id
    ? e.material.id - t.material.id
    : e.z !== t.z
    ? e.z - t.z
    : e.id - t.id;
}
function reversePainterSortStable(e, t) {
  return e.groupOrder !== t.groupOrder
    ? e.groupOrder - t.groupOrder
    : e.renderOrder !== t.renderOrder
    ? e.renderOrder - t.renderOrder
    : e.z !== t.z
    ? t.z - e.z
    : e.id - t.id;
}
function WebGLRenderList(e) {
  const t = [];
  let n = 0;
  const r = [],
    i = [],
    o = { id: -1 };
  function a(r, i, a, s, c, l) {
    let h = t[n];
    const u = e.get(a);
    return (
      void 0 === h
        ? ((h = {
            id: r.id,
            object: r,
            geometry: i,
            material: a,
            program: u.program || o,
            groupOrder: s,
            renderOrder: r.renderOrder,
            z: c,
            group: l
          }),
          (t[n] = h))
        : ((h.id = r.id),
          (h.object = r),
          (h.geometry = i),
          (h.material = a),
          (h.program = u.program || o),
          (h.groupOrder = s),
          (h.renderOrder = r.renderOrder),
          (h.z = c),
          (h.group = l)),
      n++,
      h
    );
  }
  return {
    opaque: r,
    transparent: i,
    init: function () {
      (n = 0), (r.length = 0), (i.length = 0);
    },
    push: function (e, t, n, o, s, c) {
      const l = a(e, t, n, o, s, c);
      (!0 === n.transparent ? i : r).push(l);
    },
    unshift: function (e, t, n, o, s, c) {
      const l = a(e, t, n, o, s, c);
      (!0 === n.transparent ? i : r).unshift(l);
    },
    finish: function () {
      for (let e = n, r = t.length; e < r; e++) {
        const n = t[e];
        if (null === n.id) break;
        (n.id = null),
          (n.object = null),
          (n.geometry = null),
          (n.material = null),
          (n.program = null),
          (n.group = null);
      }
    },
    sort: function (e, t) {
      r.length > 1 && r.sort(e || painterSortStable),
        i.length > 1 && i.sort(t || reversePainterSortStable);
    }
  };
}
function WebGLRenderLists(e) {
  let t = new WeakMap();
  return {
    get: function (n, r) {
      const i = t.get(n);
      let o;
      return (
        void 0 === i
          ? ((o = new WebGLRenderList(e)),
            t.set(n, new WeakMap()),
            t.get(n).set(r, o))
          : void 0 === (o = i.get(r)) &&
            ((o = new WebGLRenderList(e)), i.set(r, o)),
        o
      );
    },
    dispose: function () {
      t = new WeakMap();
    }
  };
}
function UniformsCache() {
  const e = {};
  return {
    get: function (t) {
      if (void 0 !== e[t.id]) return e[t.id];
      let n;
      switch (t.type) {
        case "DirectionalLight":
          n = { direction: new Vector3(), color: new Color() };
          break;
        case "SpotLight":
          n = {
            position: new Vector3(),
            direction: new Vector3(),
            color: new Color(),
            distance: 0,
            coneCos: 0,
            penumbraCos: 0,
            decay: 0
          };
          break;
        case "PointLight":
          n = {
            position: new Vector3(),
            color: new Color(),
            distance: 0,
            decay: 0
          };
          break;
        case "HemisphereLight":
          n = {
            direction: new Vector3(),
            skyColor: new Color(),
            groundColor: new Color()
          };
          break;
        case "RectAreaLight":
          n = {
            color: new Color(),
            position: new Vector3(),
            halfWidth: new Vector3(),
            halfHeight: new Vector3()
          };
      }
      return (e[t.id] = n), n;
    }
  };
}
function ShadowUniformsCache() {
  const e = {};
  return {
    get: function (t) {
      if (void 0 !== e[t.id]) return e[t.id];
      let n;
      switch (t.type) {
        case "DirectionalLight":
        case "SpotLight":
          n = {
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Vector2()
          };
          break;
        case "PointLight":
          n = {
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Vector2(),
            shadowCameraNear: 1,
            shadowCameraFar: 1e3
          };
      }
      return (e[t.id] = n), n;
    }
  };
}
let nextVersion = 0;
function shadowCastingLightsFirst(e, t) {
  return (t.castShadow ? 1 : 0) - (e.castShadow ? 1 : 0);
}
function WebGLLights() {
  const e = new UniformsCache(),
    t = ShadowUniformsCache(),
    n = {
      version: 0,
      hash: {
        directionalLength: -1,
        pointLength: -1,
        spotLength: -1,
        rectAreaLength: -1,
        hemiLength: -1,
        numDirectionalShadows: -1,
        numPointShadows: -1,
        numSpotShadows: -1
      },
      ambient: [0, 0, 0],
      probe: [],
      directional: [],
      directionalShadow: [],
      directionalShadowMap: [],
      directionalShadowMatrix: [],
      spot: [],
      spotShadow: [],
      spotShadowMap: [],
      spotShadowMatrix: [],
      rectArea: [],
      rectAreaLTC1: null,
      rectAreaLTC2: null,
      point: [],
      pointShadow: [],
      pointShadowMap: [],
      pointShadowMatrix: [],
      hemi: []
    };
  for (let e = 0; e < 9; e++) n.probe.push(new Vector3());
  const r = new Vector3(),
    i = new Matrix4(),
    o = new Matrix4();
  return {
    setup: function (a, s, c) {
      let l = 0,
        h = 0,
        u = 0;
      for (let e = 0; e < 9; e++) n.probe[e].set(0, 0, 0);
      let d = 0,
        p = 0,
        m = 0,
        f = 0,
        g = 0,
        v = 0,
        y = 0,
        _ = 0;
      const x = c.matrixWorldInverse;
      a.sort(shadowCastingLightsFirst);
      for (let s = 0, c = a.length; s < c; s++) {
        const c = a[s],
          b = c.color,
          M = c.intensity,
          w = c.distance,
          S = c.shadow && c.shadow.map ? c.shadow.map.texture : null;
        if (c.isAmbientLight) (l += b.r * M), (h += b.g * M), (u += b.b * M);
        else if (c.isLightProbe)
          for (let e = 0; e < 9; e++)
            n.probe[e].addScaledVector(c.sh.coefficients[e], M);
        else if (c.isDirectionalLight) {
          const i = e.get(c);
          if (
            (i.color.copy(c.color).multiplyScalar(c.intensity),
            i.direction.setFromMatrixPosition(c.matrixWorld),
            r.setFromMatrixPosition(c.target.matrixWorld),
            i.direction.sub(r),
            i.direction.transformDirection(x),
            c.castShadow)
          ) {
            const e = c.shadow,
              r = t.get(c);
            (r.shadowBias = e.bias),
              (r.shadowNormalBias = e.normalBias),
              (r.shadowRadius = e.radius),
              (r.shadowMapSize = e.mapSize),
              (n.directionalShadow[d] = r),
              (n.directionalShadowMap[d] = S),
              (n.directionalShadowMatrix[d] = c.shadow.matrix),
              v++;
          }
          (n.directional[d] = i), d++;
        } else if (c.isSpotLight) {
          const i = e.get(c);
          if (
            (i.position.setFromMatrixPosition(c.matrixWorld),
            i.position.applyMatrix4(x),
            i.color.copy(b).multiplyScalar(M),
            (i.distance = w),
            i.direction.setFromMatrixPosition(c.matrixWorld),
            r.setFromMatrixPosition(c.target.matrixWorld),
            i.direction.sub(r),
            i.direction.transformDirection(x),
            (i.coneCos = Math.cos(c.angle)),
            (i.penumbraCos = Math.cos(c.angle * (1 - c.penumbra))),
            (i.decay = c.decay),
            c.castShadow)
          ) {
            const e = c.shadow,
              r = t.get(c);
            (r.shadowBias = e.bias),
              (r.shadowNormalBias = e.normalBias),
              (r.shadowRadius = e.radius),
              (r.shadowMapSize = e.mapSize),
              (n.spotShadow[m] = r),
              (n.spotShadowMap[m] = S),
              (n.spotShadowMatrix[m] = c.shadow.matrix),
              _++;
          }
          (n.spot[m] = i), m++;
        } else if (c.isRectAreaLight) {
          const t = e.get(c);
          t.color.copy(b).multiplyScalar(M),
            t.position.setFromMatrixPosition(c.matrixWorld),
            t.position.applyMatrix4(x),
            o.identity(),
            i.copy(c.matrixWorld),
            i.premultiply(x),
            o.extractRotation(i),
            t.halfWidth.set(0.5 * c.width, 0, 0),
            t.halfHeight.set(0, 0.5 * c.height, 0),
            t.halfWidth.applyMatrix4(o),
            t.halfHeight.applyMatrix4(o),
            (n.rectArea[f] = t),
            f++;
        } else if (c.isPointLight) {
          const r = e.get(c);
          if (
            (r.position.setFromMatrixPosition(c.matrixWorld),
            r.position.applyMatrix4(x),
            r.color.copy(c.color).multiplyScalar(c.intensity),
            (r.distance = c.distance),
            (r.decay = c.decay),
            c.castShadow)
          ) {
            const e = c.shadow,
              r = t.get(c);
            (r.shadowBias = e.bias),
              (r.shadowNormalBias = e.normalBias),
              (r.shadowRadius = e.radius),
              (r.shadowMapSize = e.mapSize),
              (r.shadowCameraNear = e.camera.near),
              (r.shadowCameraFar = e.camera.far),
              (n.pointShadow[p] = r),
              (n.pointShadowMap[p] = S),
              (n.pointShadowMatrix[p] = c.shadow.matrix),
              y++;
          }
          (n.point[p] = r), p++;
        } else if (c.isHemisphereLight) {
          const t = e.get(c);
          t.direction.setFromMatrixPosition(c.matrixWorld),
            t.direction.transformDirection(x),
            t.direction.normalize(),
            t.skyColor.copy(c.color).multiplyScalar(M),
            t.groundColor.copy(c.groundColor).multiplyScalar(M),
            (n.hemi[g] = t),
            g++;
        }
      }
      f > 0 &&
        ((n.rectAreaLTC1 = UniformsLib.LTC_1),
        (n.rectAreaLTC2 = UniformsLib.LTC_2)),
        (n.ambient[0] = l),
        (n.ambient[1] = h),
        (n.ambient[2] = u);
      const b = n.hash;
      (b.directionalLength === d &&
        b.pointLength === p &&
        b.spotLength === m &&
        b.rectAreaLength === f &&
        b.hemiLength === g &&
        b.numDirectionalShadows === v &&
        b.numPointShadows === y &&
        b.numSpotShadows === _) ||
        ((n.directional.length = d),
        (n.spot.length = m),
        (n.rectArea.length = f),
        (n.point.length = p),
        (n.hemi.length = g),
        (n.directionalShadow.length = v),
        (n.directionalShadowMap.length = v),
        (n.pointShadow.length = y),
        (n.pointShadowMap.length = y),
        (n.spotShadow.length = _),
        (n.spotShadowMap.length = _),
        (n.directionalShadowMatrix.length = v),
        (n.pointShadowMatrix.length = y),
        (n.spotShadowMatrix.length = _),
        (b.directionalLength = d),
        (b.pointLength = p),
        (b.spotLength = m),
        (b.rectAreaLength = f),
        (b.hemiLength = g),
        (b.numDirectionalShadows = v),
        (b.numPointShadows = y),
        (b.numSpotShadows = _),
        (n.version = nextVersion++));
    },
    state: n
  };
}
function WebGLRenderState() {
  const e = new WebGLLights(),
    t = [],
    n = [];
  return {
    init: function () {
      (t.length = 0), (n.length = 0);
    },
    state: { lightsArray: t, shadowsArray: n, lights: e },
    setupLights: function (r) {
      e.setup(t, n, r);
    },
    pushLight: function (e) {
      t.push(e);
    },
    pushShadow: function (e) {
      n.push(e);
    }
  };
}
function WebGLRenderStates() {
  let e = new WeakMap();
  return {
    get: function (t, n) {
      let r;
      return (
        !1 === e.has(t)
          ? ((r = new WebGLRenderState()),
            e.set(t, new WeakMap()),
            e.get(t).set(n, r))
          : !1 === e.get(t).has(n)
          ? ((r = new WebGLRenderState()), e.get(t).set(n, r))
          : (r = e.get(t).get(n)),
        r
      );
    },
    dispose: function () {
      e = new WeakMap();
    }
  };
}
function MeshDepthMaterial(e) {
  Material.call(this),
    (this.type = "MeshDepthMaterial"),
    (this.depthPacking = BasicDepthPacking),
    (this.skinning = !1),
    (this.morphTargets = !1),
    (this.map = null),
    (this.alphaMap = null),
    (this.displacementMap = null),
    (this.displacementScale = 1),
    (this.displacementBias = 0),
    (this.wireframe = !1),
    (this.wireframeLinewidth = 1),
    (this.fog = !1),
    this.setValues(e);
}
function MeshDistanceMaterial(e) {
  Material.call(this),
    (this.type = "MeshDistanceMaterial"),
    (this.referencePosition = new Vector3()),
    (this.nearDistance = 1),
    (this.farDistance = 1e3),
    (this.skinning = !1),
    (this.morphTargets = !1),
    (this.map = null),
    (this.alphaMap = null),
    (this.displacementMap = null),
    (this.displacementScale = 1),
    (this.displacementBias = 0),
    (this.fog = !1),
    this.setValues(e);
}
(MeshDepthMaterial.prototype = Object.create(Material.prototype)),
  (MeshDepthMaterial.prototype.constructor = MeshDepthMaterial),
  (MeshDepthMaterial.prototype.isMeshDepthMaterial = !0),
  (MeshDepthMaterial.prototype.copy = function (e) {
    return (
      Material.prototype.copy.call(this, e),
      (this.depthPacking = e.depthPacking),
      (this.skinning = e.skinning),
      (this.morphTargets = e.morphTargets),
      (this.map = e.map),
      (this.alphaMap = e.alphaMap),
      (this.displacementMap = e.displacementMap),
      (this.displacementScale = e.displacementScale),
      (this.displacementBias = e.displacementBias),
      (this.wireframe = e.wireframe),
      (this.wireframeLinewidth = e.wireframeLinewidth),
      this
    );
  }),
  (MeshDistanceMaterial.prototype = Object.create(Material.prototype)),
  (MeshDistanceMaterial.prototype.constructor = MeshDistanceMaterial),
  (MeshDistanceMaterial.prototype.isMeshDistanceMaterial = !0),
  (MeshDistanceMaterial.prototype.copy = function (e) {
    return (
      Material.prototype.copy.call(this, e),
      this.referencePosition.copy(e.referencePosition),
      (this.nearDistance = e.nearDistance),
      (this.farDistance = e.farDistance),
      (this.skinning = e.skinning),
      (this.morphTargets = e.morphTargets),
      (this.map = e.map),
      (this.alphaMap = e.alphaMap),
      (this.displacementMap = e.displacementMap),
      (this.displacementScale = e.displacementScale),
      (this.displacementBias = e.displacementBias),
      this
    );
  });
var vsm_frag =
    "uniform sampler2D shadow_pass;\nuniform vec2 resolution;\nuniform float radius;\n#include <packing>\nvoid main() {\n\tfloat mean = 0.0;\n\tfloat squared_mean = 0.0;\n\tfloat depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy ) / resolution ) );\n\tfor ( float i = -1.0; i < 1.0 ; i += SAMPLE_RATE) {\n\t\t#ifdef HORIZONAL_PASS\n\t\t\tvec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( i, 0.0 ) * radius ) / resolution ) );\n\t\t\tmean += distribution.x;\n\t\t\tsquared_mean += distribution.y * distribution.y + distribution.x * distribution.x;\n\t\t#else\n\t\t\tfloat depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, i ) * radius ) / resolution ) );\n\t\t\tmean += depth;\n\t\t\tsquared_mean += depth * depth;\n\t\t#endif\n\t}\n\tmean = mean * HALF_SAMPLE_RATE;\n\tsquared_mean = squared_mean * HALF_SAMPLE_RATE;\n\tfloat std_dev = sqrt( squared_mean - mean * mean );\n\tgl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );\n}",
  vsm_vert = "void main() {\n\tgl_Position = vec4( position, 1.0 );\n}";
function WebGLShadowMap(e, t, n) {
  let r = new Frustum();
  const i = new Vector2(),
    o = new Vector2(),
    a = new Vector4(),
    s = [],
    c = [],
    l = {},
    h = { 0: BackSide, 1: FrontSide, 2: DoubleSide },
    u = new ShaderMaterial({
      defines: { SAMPLE_RATE: 0.25, HALF_SAMPLE_RATE: 1 / 8 },
      uniforms: {
        shadow_pass: { value: null },
        resolution: { value: new Vector2() },
        radius: { value: 4 }
      },
      vertexShader: vsm_vert,
      fragmentShader: vsm_frag
    }),
    d = u.clone();
  d.defines.HORIZONAL_PASS = 1;
  const p = new BufferGeometry();
  p.setAttribute(
    "position",
    new BufferAttribute(
      new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]),
      3
    )
  );
  const m = new Mesh(p, u),
    f = this;
  function g(n, r) {
    const i = t.update(m);
    (u.uniforms.shadow_pass.value = n.map.texture),
      (u.uniforms.resolution.value = n.mapSize),
      (u.uniforms.radius.value = n.radius),
      e.setRenderTarget(n.mapPass),
      e.clear(),
      e.renderBufferDirect(r, null, i, u, m, null),
      (d.uniforms.shadow_pass.value = n.mapPass.texture),
      (d.uniforms.resolution.value = n.mapSize),
      (d.uniforms.radius.value = n.radius),
      e.setRenderTarget(n.map),
      e.clear(),
      e.renderBufferDirect(r, null, i, d, m, null);
  }
  function v(e, t, n) {
    const r = (e << 0) | (t << 1) | (n << 2);
    let i = s[r];
    return (
      void 0 === i &&
        ((i = new MeshDepthMaterial({
          depthPacking: RGBADepthPacking,
          morphTargets: e,
          skinning: t
        })),
        (s[r] = i)),
      i
    );
  }
  function y(e, t, n) {
    const r = (e << 0) | (t << 1) | (n << 2);
    let i = c[r];
    return (
      void 0 === i &&
        ((i = new MeshDistanceMaterial({ morphTargets: e, skinning: t })),
        (c[r] = i)),
      i
    );
  }
  function _(t, n, r, i, o, a, s) {
    let c = null,
      u = v,
      d = t.customDepthMaterial;
    if (
      (!0 === i.isPointLight && ((u = y), (d = t.customDistanceMaterial)),
      void 0 === d)
    ) {
      let e = !1;
      !0 === r.morphTargets &&
        (e =
          n.morphAttributes &&
          n.morphAttributes.position &&
          n.morphAttributes.position.length > 0);
      let i = !1;
      !0 === t.isSkinnedMesh &&
        (!0 === r.skinning
          ? (i = !0)
          : console.warn(
              "THREE.WebGLShadowMap: THREE.SkinnedMesh with material.skinning set to false:",
              t
            )),
        (c = u(e, i, !0 === t.isInstancedMesh));
    } else c = d;
    if (
      e.localClippingEnabled &&
      !0 === r.clipShadows &&
      0 !== r.clippingPlanes.length
    ) {
      const e = c.uuid,
        t = r.uuid;
      let n = l[e];
      void 0 === n && ((n = {}), (l[e] = n));
      let i = n[t];
      void 0 === i && ((i = c.clone()), (n[t] = i)), (c = i);
    }
    return (
      (c.visible = r.visible),
      (c.wireframe = r.wireframe),
      (c.side =
        s === VSMShadowMap
          ? null !== r.shadowSide
            ? r.shadowSide
            : r.side
          : null !== r.shadowSide
          ? r.shadowSide
          : h[r.side]),
      (c.clipShadows = r.clipShadows),
      (c.clippingPlanes = r.clippingPlanes),
      (c.clipIntersection = r.clipIntersection),
      (c.wireframeLinewidth = r.wireframeLinewidth),
      (c.linewidth = r.linewidth),
      !0 === i.isPointLight &&
        !0 === c.isMeshDistanceMaterial &&
        (c.referencePosition.setFromMatrixPosition(i.matrixWorld),
        (c.nearDistance = o),
        (c.farDistance = a)),
      c
    );
  }
  function x(n, i, o, a, s) {
    if (!1 === n.visible) return;
    if (
      n.layers.test(i.layers) &&
      (n.isMesh || n.isLine || n.isPoints) &&
      (n.castShadow || (n.receiveShadow && s === VSMShadowMap)) &&
      (!n.frustumCulled || r.intersectsObject(n))
    ) {
      n.modelViewMatrix.multiplyMatrices(o.matrixWorldInverse, n.matrixWorld);
      const r = t.update(n),
        i = n.material;
      if (Array.isArray(i)) {
        const t = r.groups;
        for (let c = 0, l = t.length; c < l; c++) {
          const l = t[c],
            h = i[l.materialIndex];
          if (h && h.visible) {
            const t = _(n, r, h, a, o.near, o.far, s);
            e.renderBufferDirect(o, null, r, t, n, l);
          }
        }
      } else if (i.visible) {
        const t = _(n, r, i, a, o.near, o.far, s);
        e.renderBufferDirect(o, null, r, t, n, null);
      }
    }
    const c = n.children;
    for (let e = 0, t = c.length; e < t; e++) x(c[e], i, o, a, s);
  }
  (this.enabled = !1),
    (this.autoUpdate = !0),
    (this.needsUpdate = !1),
    (this.type = PCFShadowMap),
    (this.render = function (t, s, c) {
      if (!1 === f.enabled) return;
      if (!1 === f.autoUpdate && !1 === f.needsUpdate) return;
      if (0 === t.length) return;
      const l = e.getRenderTarget(),
        h = e.getActiveCubeFace(),
        u = e.getActiveMipmapLevel(),
        d = e.state;
      d.setBlending(NoBlending),
        d.buffers.color.setClear(1, 1, 1, 1),
        d.buffers.depth.setTest(!0),
        d.setScissorTest(!1);
      for (let l = 0, h = t.length; l < h; l++) {
        const h = t[l],
          u = h.shadow;
        if (void 0 === u) {
          console.warn("THREE.WebGLShadowMap:", h, "has no shadow.");
          continue;
        }
        if (!1 === u.autoUpdate && !1 === u.needsUpdate) continue;
        i.copy(u.mapSize);
        const p = u.getFrameExtents();
        if (
          (i.multiply(p),
          o.copy(u.mapSize),
          (i.x > n || i.y > n) &&
            (i.x > n &&
              ((o.x = Math.floor(n / p.x)),
              (i.x = o.x * p.x),
              (u.mapSize.x = o.x)),
            i.y > n &&
              ((o.y = Math.floor(n / p.y)),
              (i.y = o.y * p.y),
              (u.mapSize.y = o.y))),
          null === u.map && !u.isPointLightShadow && this.type === VSMShadowMap)
        ) {
          const e = {
            minFilter: LinearFilter,
            magFilter: LinearFilter,
            format: RGBAFormat
          };
          (u.map = new WebGLRenderTarget(i.x, i.y, e)),
            (u.map.texture.name = h.name + ".shadowMap"),
            (u.mapPass = new WebGLRenderTarget(i.x, i.y, e)),
            u.camera.updateProjectionMatrix();
        }
        if (null === u.map) {
          const e = {
            minFilter: NearestFilter,
            magFilter: NearestFilter,
            format: RGBAFormat
          };
          (u.map = new WebGLRenderTarget(i.x, i.y, e)),
            (u.map.texture.name = h.name + ".shadowMap"),
            u.camera.updateProjectionMatrix();
        }
        e.setRenderTarget(u.map), e.clear();
        const m = u.getViewportCount();
        for (let e = 0; e < m; e++) {
          const t = u.getViewport(e);
          a.set(o.x * t.x, o.y * t.y, o.x * t.z, o.y * t.w),
            d.viewport(a),
            u.updateMatrices(h, e),
            (r = u.getFrustum()),
            x(s, c, u.camera, h, this.type);
        }
        u.isPointLightShadow || this.type !== VSMShadowMap || g(u, c),
          (u.needsUpdate = !1);
      }
      (f.needsUpdate = !1), e.setRenderTarget(l, h, u);
    });
}
function WebGLState(e, t, n) {
  const r = n.isWebGL2;
  const i = new (function () {
      let t = !1;
      const n = new Vector4();
      let r = null;
      const i = new Vector4(0, 0, 0, 0);
      return {
        setMask: function (n) {
          r === n || t || (e.colorMask(n, n, n, n), (r = n));
        },
        setLocked: function (e) {
          t = e;
        },
        setClear: function (t, r, o, a, s) {
          !0 === s && ((t *= a), (r *= a), (o *= a)),
            n.set(t, r, o, a),
            !1 === i.equals(n) && (e.clearColor(t, r, o, a), i.copy(n));
        },
        reset: function () {
          (t = !1), (r = null), i.set(-1, 0, 0, 0);
        }
      };
    })(),
    o = new (function () {
      let t = !1,
        n = null,
        r = null,
        i = null;
      return {
        setTest: function (e) {
          e ? D(2929) : G(2929);
        },
        setMask: function (r) {
          n === r || t || (e.depthMask(r), (n = r));
        },
        setFunc: function (t) {
          if (r !== t) {
            if (t)
              switch (t) {
                case NeverDepth:
                  e.depthFunc(512);
                  break;
                case AlwaysDepth:
                  e.depthFunc(519);
                  break;
                case LessDepth:
                  e.depthFunc(513);
                  break;
                case LessEqualDepth:
                  e.depthFunc(515);
                  break;
                case EqualDepth:
                  e.depthFunc(514);
                  break;
                case GreaterEqualDepth:
                  e.depthFunc(518);
                  break;
                case GreaterDepth:
                  e.depthFunc(516);
                  break;
                case NotEqualDepth:
                  e.depthFunc(517);
                  break;
                default:
                  e.depthFunc(515);
              }
            else e.depthFunc(515);
            r = t;
          }
        },
        setLocked: function (e) {
          t = e;
        },
        setClear: function (t) {
          i !== t && (e.clearDepth(t), (i = t));
        },
        reset: function () {
          (t = !1), (n = null), (r = null), (i = null);
        }
      };
    })(),
    a = new (function () {
      let t = !1,
        n = null,
        r = null,
        i = null,
        o = null,
        a = null,
        s = null,
        c = null,
        l = null;
      return {
        setTest: function (e) {
          t || (e ? D(2960) : G(2960));
        },
        setMask: function (r) {
          n === r || t || (e.stencilMask(r), (n = r));
        },
        setFunc: function (t, n, a) {
          (r === t && i === n && o === a) ||
            (e.stencilFunc(t, n, a), (r = t), (i = n), (o = a));
        },
        setOp: function (t, n, r) {
          (a === t && s === n && c === r) ||
            (e.stencilOp(t, n, r), (a = t), (s = n), (c = r));
        },
        setLocked: function (e) {
          t = e;
        },
        setClear: function (t) {
          l !== t && (e.clearStencil(t), (l = t));
        },
        reset: function () {
          (t = !1),
            (n = null),
            (r = null),
            (i = null),
            (o = null),
            (a = null),
            (s = null),
            (c = null),
            (l = null);
        }
      };
    })();
  let s = {},
    c = null,
    l = null,
    h = null,
    u = null,
    d = null,
    p = null,
    m = null,
    f = null,
    g = null,
    v = !1,
    y = null,
    _ = null,
    x = null,
    b = null,
    M = null;
  const w = e.getParameter(35661);
  let S = !1,
    T = 0;
  const E = e.getParameter(7938);
  -1 !== E.indexOf("WebGL")
    ? ((T = parseFloat(/^WebGL\ ([0-9])/.exec(E)[1])), (S = T >= 1))
    : -1 !== E.indexOf("OpenGL ES") &&
      ((T = parseFloat(/^OpenGL\ ES\ ([0-9])/.exec(E)[1])), (S = T >= 2));
  let A = null,
    L = {};
  const C = new Vector4(),
    R = new Vector4();
  function P(t, n, r) {
    const i = new Uint8Array(4),
      o = e.createTexture();
    e.bindTexture(t, o),
      e.texParameteri(t, 10241, 9728),
      e.texParameteri(t, 10240, 9728);
    for (let t = 0; t < r; t++)
      e.texImage2D(n + t, 0, 6408, 1, 1, 0, 6408, 5121, i);
    return o;
  }
  const B = {};
  function D(t) {
    !0 !== s[t] && (e.enable(t), (s[t] = !0));
  }
  function G(t) {
    !1 !== s[t] && (e.disable(t), (s[t] = !1));
  }
  (B[3553] = P(3553, 3553, 1)),
    (B[34067] = P(34067, 34069, 6)),
    i.setClear(0, 0, 0, 1),
    o.setClear(1),
    a.setClear(0),
    D(2929),
    o.setFunc(LessEqualDepth),
    O(!1),
    U(CullFaceBack),
    D(2884),
    F(NoBlending);
  const I = {
    [AddEquation]: 32774,
    [SubtractEquation]: 32778,
    [ReverseSubtractEquation]: 32779
  };
  if (r) (I[MinEquation] = 32775), (I[MaxEquation] = 32776);
  else {
    const e = t.get("EXT_blend_minmax");
    null !== e && ((I[MinEquation] = e.MIN_EXT), (I[MaxEquation] = e.MAX_EXT));
  }
  const N = {
    [ZeroFactor]: 0,
    [OneFactor]: 1,
    [SrcColorFactor]: 768,
    [SrcAlphaFactor]: 770,
    [SrcAlphaSaturateFactor]: 776,
    [DstColorFactor]: 774,
    [DstAlphaFactor]: 772,
    [OneMinusSrcColorFactor]: 769,
    [OneMinusSrcAlphaFactor]: 771,
    [OneMinusDstColorFactor]: 775,
    [OneMinusDstAlphaFactor]: 773
  };
  function F(t, n, r, i, o, a, s, c) {
    if (t !== NoBlending) {
      if ((l || (D(3042), (l = !0)), t === CustomBlending))
        (o = o || n),
          (a = a || r),
          (s = s || i),
          (n === u && o === m) ||
            (e.blendEquationSeparate(I[n], I[o]), (u = n), (m = o)),
          (r === d && i === p && a === f && s === g) ||
            (e.blendFuncSeparate(N[r], N[i], N[a], N[s]),
            (d = r),
            (p = i),
            (f = a),
            (g = s)),
          (h = t),
          (v = null);
      else if (t !== h || c !== v) {
        if (
          ((u === AddEquation && m === AddEquation) ||
            (e.blendEquation(32774), (u = AddEquation), (m = AddEquation)),
          c)
        )
          switch (t) {
            case NormalBlending:
              e.blendFuncSeparate(1, 771, 1, 771);
              break;
            case AdditiveBlending:
              e.blendFunc(1, 1);
              break;
            case SubtractiveBlending:
              e.blendFuncSeparate(0, 0, 769, 771);
              break;
            case MultiplyBlending:
              e.blendFuncSeparate(0, 768, 0, 770);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", t);
          }
        else
          switch (t) {
            case NormalBlending:
              e.blendFuncSeparate(770, 771, 1, 771);
              break;
            case AdditiveBlending:
              e.blendFunc(770, 1);
              break;
            case SubtractiveBlending:
              e.blendFunc(0, 769);
              break;
            case MultiplyBlending:
              e.blendFunc(0, 768);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", t);
          }
        (d = null), (p = null), (f = null), (g = null), (h = t), (v = c);
      }
    } else l && (G(3042), (l = !1));
  }
  function O(t) {
    y !== t && (t ? e.frontFace(2304) : e.frontFace(2305), (y = t));
  }
  function U(t) {
    t !== CullFaceNone
      ? (D(2884),
        t !== _ &&
          (t === CullFaceBack
            ? e.cullFace(1029)
            : t === CullFaceFront
            ? e.cullFace(1028)
            : e.cullFace(1032)))
      : G(2884),
      (_ = t);
  }
  function V(t, n, r) {
    t
      ? (D(32823),
        (b === n && M === r) || (e.polygonOffset(n, r), (b = n), (M = r)))
      : G(32823);
  }
  function z(t) {
    void 0 === t && (t = 33984 + w - 1),
      A !== t && (e.activeTexture(t), (A = t));
  }
  return {
    buffers: { color: i, depth: o, stencil: a },
    enable: D,
    disable: G,
    useProgram: function (t) {
      return c !== t && (e.useProgram(t), (c = t), !0);
    },
    setBlending: F,
    setMaterial: function (e, t) {
      e.side === DoubleSide ? G(2884) : D(2884);
      let n = e.side === BackSide;
      t && (n = !n),
        O(n),
        e.blending === NormalBlending && !1 === e.transparent
          ? F(NoBlending)
          : F(
              e.blending,
              e.blendEquation,
              e.blendSrc,
              e.blendDst,
              e.blendEquationAlpha,
              e.blendSrcAlpha,
              e.blendDstAlpha,
              e.premultipliedAlpha
            ),
        o.setFunc(e.depthFunc),
        o.setTest(e.depthTest),
        o.setMask(e.depthWrite),
        i.setMask(e.colorWrite);
      const r = e.stencilWrite;
      a.setTest(r),
        r &&
          (a.setMask(e.stencilWriteMask),
          a.setFunc(e.stencilFunc, e.stencilRef, e.stencilFuncMask),
          a.setOp(e.stencilFail, e.stencilZFail, e.stencilZPass)),
        V(e.polygonOffset, e.polygonOffsetFactor, e.polygonOffsetUnits);
    },
    setFlipSided: O,
    setCullFace: U,
    setLineWidth: function (t) {
      t !== x && (S && e.lineWidth(t), (x = t));
    },
    setPolygonOffset: V,
    setScissorTest: function (e) {
      e ? D(3089) : G(3089);
    },
    activeTexture: z,
    bindTexture: function (t, n) {
      null === A && z();
      let r = L[A];
      void 0 === r && ((r = { type: void 0, texture: void 0 }), (L[A] = r)),
        (r.type === t && r.texture === n) ||
          (e.bindTexture(t, n || B[t]), (r.type = t), (r.texture = n));
    },
    unbindTexture: function () {
      const t = L[A];
      void 0 !== t &&
        void 0 !== t.type &&
        (e.bindTexture(t.type, null), (t.type = void 0), (t.texture = void 0));
    },
    compressedTexImage2D: function () {
      try {
        e.compressedTexImage2D.apply(e, arguments);
      } catch (e) {
        console.error("THREE.WebGLState:", e);
      }
    },
    texImage2D: function () {
      try {
        e.texImage2D.apply(e, arguments);
      } catch (e) {
        console.error("THREE.WebGLState:", e);
      }
    },
    texImage3D: function () {
      try {
        e.texImage3D.apply(e, arguments);
      } catch (e) {
        console.error("THREE.WebGLState:", e);
      }
    },
    scissor: function (t) {
      !1 === C.equals(t) && (e.scissor(t.x, t.y, t.z, t.w), C.copy(t));
    },
    viewport: function (t) {
      !1 === R.equals(t) && (e.viewport(t.x, t.y, t.z, t.w), R.copy(t));
    },
    reset: function () {
      (s = {}),
        (A = null),
        (L = {}),
        (c = null),
        (h = null),
        (y = null),
        (_ = null),
        i.reset(),
        o.reset(),
        a.reset();
    }
  };
}
function WebGLTextures(e, t, n, r, i, o, a) {
  const s = i.isWebGL2,
    c = i.maxTextures,
    l = i.maxCubemapSize,
    h = i.maxTextureSize,
    u = i.maxSamples,
    d = new WeakMap();
  let p,
    m = !1;
  try {
    m =
      "undefined" != typeof OffscreenCanvas &&
      null !== new OffscreenCanvas(1, 1).getContext("2d");
  } catch (e) {}
  function f(e, t) {
    return m
      ? new OffscreenCanvas(e, t)
      : document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
  }
  function g(e, t, n, r) {
    let i = 1;
    if (
      ((e.width > r || e.height > r) && (i = r / Math.max(e.width, e.height)),
      i < 1 || !0 === t)
    ) {
      if (
        ("undefined" != typeof HTMLImageElement &&
          e instanceof HTMLImageElement) ||
        ("undefined" != typeof HTMLCanvasElement &&
          e instanceof HTMLCanvasElement) ||
        ("undefined" != typeof ImageBitmap && e instanceof ImageBitmap)
      ) {
        const r = t ? MathUtils.floorPowerOfTwo : Math.floor,
          o = r(i * e.width),
          a = r(i * e.height);
        void 0 === p && (p = f(o, a));
        const s = n ? f(o, a) : p;
        return (
          (s.width = o),
          (s.height = a),
          s.getContext("2d").drawImage(e, 0, 0, o, a),
          console.warn(
            "THREE.WebGLRenderer: Texture has been resized from (" +
              e.width +
              "x" +
              e.height +
              ") to (" +
              o +
              "x" +
              a +
              ")."
          ),
          s
        );
      }
      return (
        "data" in e &&
          console.warn(
            "THREE.WebGLRenderer: Image in DataTexture is too big (" +
              e.width +
              "x" +
              e.height +
              ")."
          ),
        e
      );
    }
    return e;
  }
  function v(e) {
    return MathUtils.isPowerOfTwo(e.width) && MathUtils.isPowerOfTwo(e.height);
  }
  function y(e, t) {
    return (
      e.generateMipmaps &&
      t &&
      e.minFilter !== NearestFilter &&
      e.minFilter !== LinearFilter
    );
  }
  function _(t, n, i, o) {
    e.generateMipmap(t),
      (r.get(n).__maxMipLevel = Math.log(Math.max(i, o)) * Math.LOG2E);
  }
  function x(n, r, i) {
    if (!1 === s) return r;
    if (null !== n) {
      if (void 0 !== e[n]) return e[n];
      console.warn(
        "THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" +
          n +
          "'"
      );
    }
    let o = r;
    return (
      6403 === r &&
        (5126 === i && (o = 33326),
        5131 === i && (o = 33325),
        5121 === i && (o = 33321)),
      6407 === r &&
        (5126 === i && (o = 34837),
        5131 === i && (o = 34843),
        5121 === i && (o = 32849)),
      6408 === r &&
        (5126 === i && (o = 34836),
        5131 === i && (o = 34842),
        5121 === i && (o = 32856)),
      (33325 !== o && 33326 !== o && 34842 !== o && 34836 !== o) ||
        t.get("EXT_color_buffer_float"),
      o
    );
  }
  function b(e) {
    return e === NearestFilter ||
      e === NearestMipmapNearestFilter ||
      e === NearestMipmapLinearFilter
      ? 9728
      : 9729;
  }
  function M(t) {
    const n = t.target;
    n.removeEventListener("dispose", M),
      (function (t) {
        const n = r.get(t);
        if (void 0 === n.__webglInit) return;
        e.deleteTexture(n.__webglTexture), r.remove(t);
      })(n),
      n.isVideoTexture && d.delete(n),
      a.memory.textures--;
  }
  function w(t) {
    const n = t.target;
    n.removeEventListener("dispose", w),
      (function (t) {
        const n = r.get(t),
          i = r.get(t.texture);
        if (!t) return;
        void 0 !== i.__webglTexture && e.deleteTexture(i.__webglTexture);
        t.depthTexture && t.depthTexture.dispose();
        if (t.isWebGLCubeRenderTarget)
          for (let t = 0; t < 6; t++)
            e.deleteFramebuffer(n.__webglFramebuffer[t]),
              n.__webglDepthbuffer &&
                e.deleteRenderbuffer(n.__webglDepthbuffer[t]);
        else
          e.deleteFramebuffer(n.__webglFramebuffer),
            n.__webglDepthbuffer && e.deleteRenderbuffer(n.__webglDepthbuffer),
            n.__webglMultisampledFramebuffer &&
              e.deleteFramebuffer(n.__webglMultisampledFramebuffer),
            n.__webglColorRenderbuffer &&
              e.deleteRenderbuffer(n.__webglColorRenderbuffer),
            n.__webglDepthRenderbuffer &&
              e.deleteRenderbuffer(n.__webglDepthRenderbuffer);
        r.remove(t.texture), r.remove(t);
      })(n),
      a.memory.textures--;
  }
  let S = 0;
  function T(e, t) {
    const i = r.get(e);
    if (
      (e.isVideoTexture &&
        (function (e) {
          const t = a.render.frame;
          d.get(e) !== t && (d.set(e, t), e.update());
        })(e),
      e.version > 0 && i.__version !== e.version)
    ) {
      const n = e.image;
      if (void 0 === n)
        console.warn(
          "THREE.WebGLRenderer: Texture marked for update but image is undefined"
        );
      else {
        if (!1 !== n.complete) return void P(i, e, t);
        console.warn(
          "THREE.WebGLRenderer: Texture marked for update but image is incomplete"
        );
      }
    }
    n.activeTexture(33984 + t), n.bindTexture(3553, i.__webglTexture);
  }
  function E(t, i) {
    const a = r.get(t);
    t.version > 0 && a.__version !== t.version
      ? (function (t, r, i) {
          if (6 !== r.image.length) return;
          R(t, r),
            n.activeTexture(33984 + i),
            n.bindTexture(34067, t.__webglTexture),
            e.pixelStorei(37440, r.flipY);
          const a =
              r && (r.isCompressedTexture || r.image[0].isCompressedTexture),
            c = r.image[0] && r.image[0].isDataTexture,
            h = [];
          for (let e = 0; e < 6; e++)
            h[e] =
              a || c
                ? c
                  ? r.image[e].image
                  : r.image[e]
                : g(r.image[e], !1, !0, l);
          const u = h[0],
            d = v(u) || s,
            p = o.convert(r.format),
            m = o.convert(r.type),
            f = x(r.internalFormat, p, m);
          let b;
          if ((C(34067, r, d), a)) {
            for (let e = 0; e < 6; e++) {
              b = h[e].mipmaps;
              for (let t = 0; t < b.length; t++) {
                const i = b[t];
                r.format !== RGBAFormat && r.format !== RGBFormat
                  ? null !== p
                    ? n.compressedTexImage2D(
                        34069 + e,
                        t,
                        f,
                        i.width,
                        i.height,
                        0,
                        i.data
                      )
                    : console.warn(
                        "THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"
                      )
                  : n.texImage2D(
                      34069 + e,
                      t,
                      f,
                      i.width,
                      i.height,
                      0,
                      p,
                      m,
                      i.data
                    );
              }
            }
            t.__maxMipLevel = b.length - 1;
          } else {
            b = r.mipmaps;
            for (let e = 0; e < 6; e++)
              if (c) {
                n.texImage2D(
                  34069 + e,
                  0,
                  f,
                  h[e].width,
                  h[e].height,
                  0,
                  p,
                  m,
                  h[e].data
                );
                for (let t = 0; t < b.length; t++) {
                  const r = b[t],
                    i = r.image[e].image;
                  n.texImage2D(
                    34069 + e,
                    t + 1,
                    f,
                    i.width,
                    i.height,
                    0,
                    p,
                    m,
                    i.data
                  );
                }
              } else {
                n.texImage2D(34069 + e, 0, f, p, m, h[e]);
                for (let t = 0; t < b.length; t++) {
                  const r = b[t];
                  n.texImage2D(34069 + e, t + 1, f, p, m, r.image[e]);
                }
              }
            t.__maxMipLevel = b.length;
          }
          y(r, d) && _(34067, r, u.width, u.height);
          (t.__version = r.version), r.onUpdate && r.onUpdate(r);
        })(a, t, i)
      : (n.activeTexture(33984 + i), n.bindTexture(34067, a.__webglTexture));
  }
  const A = {
      [RepeatWrapping]: 10497,
      [ClampToEdgeWrapping]: 33071,
      [MirroredRepeatWrapping]: 33648
    },
    L = {
      [NearestFilter]: 9728,
      [NearestMipmapNearestFilter]: 9984,
      [NearestMipmapLinearFilter]: 9986,
      [LinearFilter]: 9729,
      [LinearMipmapNearestFilter]: 9985,
      [LinearMipmapLinearFilter]: 9987
    };
  function C(n, o, a) {
    a
      ? (e.texParameteri(n, 10242, A[o.wrapS]),
        e.texParameteri(n, 10243, A[o.wrapT]),
        (32879 !== n && 35866 !== n) || e.texParameteri(n, 32882, A[o.wrapR]),
        e.texParameteri(n, 10240, L[o.magFilter]),
        e.texParameteri(n, 10241, L[o.minFilter]))
      : (e.texParameteri(n, 10242, 33071),
        e.texParameteri(n, 10243, 33071),
        (32879 !== n && 35866 !== n) || e.texParameteri(n, 32882, 33071),
        (o.wrapS === ClampToEdgeWrapping && o.wrapT === ClampToEdgeWrapping) ||
          console.warn(
            "THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."
          ),
        e.texParameteri(n, 10240, b(o.magFilter)),
        e.texParameteri(n, 10241, b(o.minFilter)),
        o.minFilter !== NearestFilter &&
          o.minFilter !== LinearFilter &&
          console.warn(
            "THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter."
          ));
    const c = t.get("EXT_texture_filter_anisotropic");
    if (c) {
      if (o.type === FloatType && null === t.get("OES_texture_float_linear"))
        return;
      if (
        o.type === HalfFloatType &&
        null === (s || t.get("OES_texture_half_float_linear"))
      )
        return;
      (o.anisotropy > 1 || r.get(o).__currentAnisotropy) &&
        (e.texParameterf(
          n,
          c.TEXTURE_MAX_ANISOTROPY_EXT,
          Math.min(o.anisotropy, i.getMaxAnisotropy())
        ),
        (r.get(o).__currentAnisotropy = o.anisotropy));
    }
  }
  function R(t, n) {
    void 0 === t.__webglInit &&
      ((t.__webglInit = !0),
      n.addEventListener("dispose", M),
      (t.__webglTexture = e.createTexture()),
      a.memory.textures++);
  }
  function P(t, r, i) {
    let a = 3553;
    r.isDataTexture2DArray && (a = 35866),
      r.isDataTexture3D && (a = 32879),
      R(t, r),
      n.activeTexture(33984 + i),
      n.bindTexture(a, t.__webglTexture),
      e.pixelStorei(37440, r.flipY),
      e.pixelStorei(37441, r.premultiplyAlpha),
      e.pixelStorei(3317, r.unpackAlignment);
    const c =
        (function (e) {
          return (
            !s &&
            (e.wrapS !== ClampToEdgeWrapping ||
              e.wrapT !== ClampToEdgeWrapping ||
              (e.minFilter !== NearestFilter && e.minFilter !== LinearFilter))
          );
        })(r) && !1 === v(r.image),
      l = g(r.image, c, !1, h),
      u = v(l) || s,
      d = o.convert(r.format);
    let p,
      m = o.convert(r.type),
      f = x(r.internalFormat, d, m);
    C(a, r, u);
    const b = r.mipmaps;
    if (r.isDepthTexture)
      (f = 6402),
        s
          ? (f =
              r.type === FloatType
                ? 36012
                : r.type === UnsignedIntType
                ? 33190
                : r.type === UnsignedInt248Type
                ? 35056
                : 33189)
          : r.type === FloatType &&
            console.error(
              "WebGLRenderer: Floating point depth texture requires WebGL2."
            ),
        r.format === DepthFormat &&
          6402 === f &&
          r.type !== UnsignedShortType &&
          r.type !== UnsignedIntType &&
          (console.warn(
            "THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."
          ),
          (r.type = UnsignedShortType),
          (m = o.convert(r.type))),
        r.format === DepthStencilFormat &&
          6402 === f &&
          ((f = 34041),
          r.type !== UnsignedInt248Type &&
            (console.warn(
              "THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."
            ),
            (r.type = UnsignedInt248Type),
            (m = o.convert(r.type)))),
        n.texImage2D(3553, 0, f, l.width, l.height, 0, d, m, null);
    else if (r.isDataTexture)
      if (b.length > 0 && u) {
        for (let e = 0, t = b.length; e < t; e++)
          (p = b[e]),
            n.texImage2D(3553, e, f, p.width, p.height, 0, d, m, p.data);
        (r.generateMipmaps = !1), (t.__maxMipLevel = b.length - 1);
      } else
        n.texImage2D(3553, 0, f, l.width, l.height, 0, d, m, l.data),
          (t.__maxMipLevel = 0);
    else if (r.isCompressedTexture) {
      for (let e = 0, t = b.length; e < t; e++)
        (p = b[e]),
          r.format !== RGBAFormat && r.format !== RGBFormat
            ? null !== d
              ? n.compressedTexImage2D(3553, e, f, p.width, p.height, 0, p.data)
              : console.warn(
                  "THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"
                )
            : n.texImage2D(3553, e, f, p.width, p.height, 0, d, m, p.data);
      t.__maxMipLevel = b.length - 1;
    } else if (r.isDataTexture2DArray)
      n.texImage3D(35866, 0, f, l.width, l.height, l.depth, 0, d, m, l.data),
        (t.__maxMipLevel = 0);
    else if (r.isDataTexture3D)
      n.texImage3D(32879, 0, f, l.width, l.height, l.depth, 0, d, m, l.data),
        (t.__maxMipLevel = 0);
    else if (b.length > 0 && u) {
      for (let e = 0, t = b.length; e < t; e++)
        (p = b[e]), n.texImage2D(3553, e, f, d, m, p);
      (r.generateMipmaps = !1), (t.__maxMipLevel = b.length - 1);
    } else n.texImage2D(3553, 0, f, d, m, l), (t.__maxMipLevel = 0);
    y(r, u) && _(a, r, l.width, l.height),
      (t.__version = r.version),
      r.onUpdate && r.onUpdate(r);
  }
  function B(t, i, a, s) {
    const c = o.convert(i.texture.format),
      l = o.convert(i.texture.type),
      h = x(i.texture.internalFormat, c, l);
    n.texImage2D(s, 0, h, i.width, i.height, 0, c, l, null),
      e.bindFramebuffer(36160, t),
      e.framebufferTexture2D(36160, a, s, r.get(i.texture).__webglTexture, 0),
      e.bindFramebuffer(36160, null);
  }
  function D(t, n, r) {
    if ((e.bindRenderbuffer(36161, t), n.depthBuffer && !n.stencilBuffer)) {
      let i = 33189;
      if (r) {
        const t = n.depthTexture;
        t &&
          t.isDepthTexture &&
          (t.type === FloatType
            ? (i = 36012)
            : t.type === UnsignedIntType && (i = 33190));
        const r = I(n);
        e.renderbufferStorageMultisample(36161, r, i, n.width, n.height);
      } else e.renderbufferStorage(36161, i, n.width, n.height);
      e.framebufferRenderbuffer(36160, 36096, 36161, t);
    } else if (n.depthBuffer && n.stencilBuffer) {
      if (r) {
        const t = I(n);
        e.renderbufferStorageMultisample(36161, t, 35056, n.width, n.height);
      } else e.renderbufferStorage(36161, 34041, n.width, n.height);
      e.framebufferRenderbuffer(36160, 33306, 36161, t);
    } else {
      const t = o.convert(n.texture.format),
        i = o.convert(n.texture.type),
        a = x(n.texture.internalFormat, t, i);
      if (r) {
        const t = I(n);
        e.renderbufferStorageMultisample(36161, t, a, n.width, n.height);
      } else e.renderbufferStorage(36161, a, n.width, n.height);
    }
    e.bindRenderbuffer(36161, null);
  }
  function G(t) {
    const n = r.get(t),
      i = !0 === t.isWebGLCubeRenderTarget;
    if (t.depthTexture) {
      if (i)
        throw new Error(
          "target.depthTexture not supported in Cube render targets"
        );
      !(function (t, n) {
        if (n && n.isWebGLCubeRenderTarget)
          throw new Error(
            "Depth Texture with cube render targets is not supported"
          );
        if (
          (e.bindFramebuffer(36160, t),
          !n.depthTexture || !n.depthTexture.isDepthTexture)
        )
          throw new Error(
            "renderTarget.depthTexture must be an instance of THREE.DepthTexture"
          );
        (r.get(n.depthTexture).__webglTexture &&
          n.depthTexture.image.width === n.width &&
          n.depthTexture.image.height === n.height) ||
          ((n.depthTexture.image.width = n.width),
          (n.depthTexture.image.height = n.height),
          (n.depthTexture.needsUpdate = !0)),
          T(n.depthTexture, 0);
        const i = r.get(n.depthTexture).__webglTexture;
        if (n.depthTexture.format === DepthFormat)
          e.framebufferTexture2D(36160, 36096, 3553, i, 0);
        else {
          if (n.depthTexture.format !== DepthStencilFormat)
            throw new Error("Unknown depthTexture format");
          e.framebufferTexture2D(36160, 33306, 3553, i, 0);
        }
      })(n.__webglFramebuffer, t);
    } else if (i) {
      n.__webglDepthbuffer = [];
      for (let r = 0; r < 6; r++)
        e.bindFramebuffer(36160, n.__webglFramebuffer[r]),
          (n.__webglDepthbuffer[r] = e.createRenderbuffer()),
          D(n.__webglDepthbuffer[r], t, !1);
    } else
      e.bindFramebuffer(36160, n.__webglFramebuffer),
        (n.__webglDepthbuffer = e.createRenderbuffer()),
        D(n.__webglDepthbuffer, t, !1);
    e.bindFramebuffer(36160, null);
  }
  function I(e) {
    return s && e.isWebGLMultisampleRenderTarget ? Math.min(u, e.samples) : 0;
  }
  let N = !1,
    F = !1;
  (this.allocateTextureUnit = function () {
    const e = S;
    return (
      e >= c &&
        console.warn(
          "THREE.WebGLTextures: Trying to use " +
            e +
            " texture units while this GPU supports only " +
            c
        ),
      (S += 1),
      e
    );
  }),
    (this.resetTextureUnits = function () {
      S = 0;
    }),
    (this.setTexture2D = T),
    (this.setTexture2DArray = function (e, t) {
      const i = r.get(e);
      e.version > 0 && i.__version !== e.version
        ? P(i, e, t)
        : (n.activeTexture(33984 + t), n.bindTexture(35866, i.__webglTexture));
    }),
    (this.setTexture3D = function (e, t) {
      const i = r.get(e);
      e.version > 0 && i.__version !== e.version
        ? P(i, e, t)
        : (n.activeTexture(33984 + t), n.bindTexture(32879, i.__webglTexture));
    }),
    (this.setTextureCube = E),
    (this.setupRenderTarget = function (t) {
      const i = r.get(t),
        c = r.get(t.texture);
      t.addEventListener("dispose", w),
        (c.__webglTexture = e.createTexture()),
        a.memory.textures++;
      const l = !0 === t.isWebGLCubeRenderTarget,
        h = !0 === t.isWebGLMultisampleRenderTarget,
        u = v(t) || s;
      if (
        (!s ||
          t.texture.format !== RGBFormat ||
          (t.texture.type !== FloatType && t.texture.type !== HalfFloatType) ||
          ((t.texture.format = RGBAFormat),
          console.warn(
            "THREE.WebGLRenderer: Rendering to textures with RGB format is not supported. Using RGBA format instead."
          )),
        l)
      ) {
        i.__webglFramebuffer = [];
        for (let t = 0; t < 6; t++)
          i.__webglFramebuffer[t] = e.createFramebuffer();
      } else if (((i.__webglFramebuffer = e.createFramebuffer()), h))
        if (s) {
          (i.__webglMultisampledFramebuffer = e.createFramebuffer()),
            (i.__webglColorRenderbuffer = e.createRenderbuffer()),
            e.bindRenderbuffer(36161, i.__webglColorRenderbuffer);
          const n = o.convert(t.texture.format),
            r = o.convert(t.texture.type),
            a = x(t.texture.internalFormat, n, r),
            s = I(t);
          e.renderbufferStorageMultisample(36161, s, a, t.width, t.height),
            e.bindFramebuffer(36160, i.__webglMultisampledFramebuffer),
            e.framebufferRenderbuffer(
              36160,
              36064,
              36161,
              i.__webglColorRenderbuffer
            ),
            e.bindRenderbuffer(36161, null),
            t.depthBuffer &&
              ((i.__webglDepthRenderbuffer = e.createRenderbuffer()),
              D(i.__webglDepthRenderbuffer, t, !0)),
            e.bindFramebuffer(36160, null);
        } else
          console.warn(
            "THREE.WebGLRenderer: WebGLMultisampleRenderTarget can only be used with WebGL2."
          );
      if (l) {
        n.bindTexture(34067, c.__webglTexture), C(34067, t.texture, u);
        for (let e = 0; e < 6; e++)
          B(i.__webglFramebuffer[e], t, 36064, 34069 + e);
        y(t.texture, u) && _(34067, t.texture, t.width, t.height),
          n.bindTexture(34067, null);
      } else
        n.bindTexture(3553, c.__webglTexture),
          C(3553, t.texture, u),
          B(i.__webglFramebuffer, t, 36064, 3553),
          y(t.texture, u) && _(3553, t.texture, t.width, t.height),
          n.bindTexture(3553, null);
      t.depthBuffer && G(t);
    }),
    (this.updateRenderTargetMipmap = function (e) {
      const t = e.texture;
      if (y(t, v(e) || s)) {
        const i = e.isWebGLCubeRenderTarget ? 34067 : 3553,
          o = r.get(t).__webglTexture;
        n.bindTexture(i, o), _(i, t, e.width, e.height), n.bindTexture(i, null);
      }
    }),
    (this.updateMultisampleRenderTarget = function (t) {
      if (t.isWebGLMultisampleRenderTarget)
        if (s) {
          const n = r.get(t);
          e.bindFramebuffer(36008, n.__webglMultisampledFramebuffer),
            e.bindFramebuffer(36009, n.__webglFramebuffer);
          const i = t.width,
            o = t.height;
          let a = 16384;
          t.depthBuffer && (a |= 256),
            t.stencilBuffer && (a |= 1024),
            e.blitFramebuffer(0, 0, i, o, 0, 0, i, o, a, 9728),
            e.bindFramebuffer(36160, n.__webglMultisampledFramebuffer);
        } else
          console.warn(
            "THREE.WebGLRenderer: WebGLMultisampleRenderTarget can only be used with WebGL2."
          );
    }),
    (this.safeSetTexture2D = function (e, t) {
      e &&
        e.isWebGLRenderTarget &&
        (!1 === N &&
          (console.warn(
            "THREE.WebGLTextures.safeSetTexture2D: don't use render targets as textures. Use their .texture property instead."
          ),
          (N = !0)),
        (e = e.texture)),
        T(e, t);
    }),
    (this.safeSetTextureCube = function (e, t) {
      e &&
        e.isWebGLCubeRenderTarget &&
        (!1 === F &&
          (console.warn(
            "THREE.WebGLTextures.safeSetTextureCube: don't use cube render targets as textures. Use their .texture property instead."
          ),
          (F = !0)),
        (e = e.texture)),
        E(e, t);
    });
}
function WebGLUtils(e, t, n) {
  const r = n.isWebGL2;
  return {
    convert: function (e) {
      let n;
      if (e === UnsignedByteType) return 5121;
      if (e === UnsignedShort4444Type) return 32819;
      if (e === UnsignedShort5551Type) return 32820;
      if (e === UnsignedShort565Type) return 33635;
      if (e === ByteType) return 5120;
      if (e === ShortType) return 5122;
      if (e === UnsignedShortType) return 5123;
      if (e === IntType) return 5124;
      if (e === UnsignedIntType) return 5125;
      if (e === FloatType) return 5126;
      if (e === HalfFloatType)
        return r
          ? 5131
          : null !== (n = t.get("OES_texture_half_float"))
          ? n.HALF_FLOAT_OES
          : null;
      if (e === AlphaFormat) return 6406;
      if (e === RGBFormat) return 6407;
      if (e === RGBAFormat) return 6408;
      if (e === LuminanceFormat) return 6409;
      if (e === LuminanceAlphaFormat) return 6410;
      if (e === DepthFormat) return 6402;
      if (e === DepthStencilFormat) return 34041;
      if (e === RedFormat) return 6403;
      if (e === RedIntegerFormat) return 36244;
      if (e === RGFormat) return 33319;
      if (e === RGIntegerFormat) return 33320;
      if (e === RGBIntegerFormat) return 36248;
      if (e === RGBAIntegerFormat) return 36249;
      if (
        e === RGB_S3TC_DXT1_Format ||
        e === RGBA_S3TC_DXT1_Format ||
        e === RGBA_S3TC_DXT3_Format ||
        e === RGBA_S3TC_DXT5_Format
      ) {
        if (null === (n = t.get("WEBGL_compressed_texture_s3tc"))) return null;
        if (e === RGB_S3TC_DXT1_Format) return n.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (e === RGBA_S3TC_DXT1_Format) return n.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (e === RGBA_S3TC_DXT3_Format) return n.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (e === RGBA_S3TC_DXT5_Format) return n.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      }
      if (
        e === RGB_PVRTC_4BPPV1_Format ||
        e === RGB_PVRTC_2BPPV1_Format ||
        e === RGBA_PVRTC_4BPPV1_Format ||
        e === RGBA_PVRTC_2BPPV1_Format
      ) {
        if (null === (n = t.get("WEBGL_compressed_texture_pvrtc"))) return null;
        if (e === RGB_PVRTC_4BPPV1_Format)
          return n.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (e === RGB_PVRTC_2BPPV1_Format)
          return n.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (e === RGBA_PVRTC_4BPPV1_Format)
          return n.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (e === RGBA_PVRTC_2BPPV1_Format)
          return n.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      }
      if (e === RGB_ETC1_Format)
        return null !== (n = t.get("WEBGL_compressed_texture_etc1"))
          ? n.COMPRESSED_RGB_ETC1_WEBGL
          : null;
      if (
        (e === RGB_ETC2_Format || e === RGBA_ETC2_EAC_Format) &&
        null !== (n = t.get("WEBGL_compressed_texture_etc"))
      ) {
        if (e === RGB_ETC2_Format) return n.COMPRESSED_RGB8_ETC2;
        if (e === RGBA_ETC2_EAC_Format) return n.COMPRESSED_RGBA8_ETC2_EAC;
      }
      return e === RGBA_ASTC_4x4_Format ||
        e === RGBA_ASTC_5x4_Format ||
        e === RGBA_ASTC_5x5_Format ||
        e === RGBA_ASTC_6x5_Format ||
        e === RGBA_ASTC_6x6_Format ||
        e === RGBA_ASTC_8x5_Format ||
        e === RGBA_ASTC_8x6_Format ||
        e === RGBA_ASTC_8x8_Format ||
        e === RGBA_ASTC_10x5_Format ||
        e === RGBA_ASTC_10x6_Format ||
        e === RGBA_ASTC_10x8_Format ||
        e === RGBA_ASTC_10x10_Format ||
        e === RGBA_ASTC_12x10_Format ||
        e === RGBA_ASTC_12x12_Format ||
        e === SRGB8_ALPHA8_ASTC_4x4_Format ||
        e === SRGB8_ALPHA8_ASTC_5x4_Format ||
        e === SRGB8_ALPHA8_ASTC_5x5_Format ||
        e === SRGB8_ALPHA8_ASTC_6x5_Format ||
        e === SRGB8_ALPHA8_ASTC_6x6_Format ||
        e === SRGB8_ALPHA8_ASTC_8x5_Format ||
        e === SRGB8_ALPHA8_ASTC_8x6_Format ||
        e === SRGB8_ALPHA8_ASTC_8x8_Format ||
        e === SRGB8_ALPHA8_ASTC_10x5_Format ||
        e === SRGB8_ALPHA8_ASTC_10x6_Format ||
        e === SRGB8_ALPHA8_ASTC_10x8_Format ||
        e === SRGB8_ALPHA8_ASTC_10x10_Format ||
        e === SRGB8_ALPHA8_ASTC_12x10_Format ||
        e === SRGB8_ALPHA8_ASTC_12x12_Format
        ? null !== (n = t.get("WEBGL_compressed_texture_astc"))
          ? e
          : null
        : e === RGBA_BPTC_Format
        ? null !== (n = t.get("EXT_texture_compression_bptc"))
          ? e
          : null
        : e === UnsignedInt248Type
        ? r
          ? 34042
          : null !== (n = t.get("WEBGL_depth_texture"))
          ? n.UNSIGNED_INT_24_8_WEBGL
          : null
        : void 0;
    }
  };
}
function ArrayCamera(e) {
  PerspectiveCamera.call(this), (this.cameras = e || []);
}
function Group() {
  Object3D.call(this), (this.type = "Group");
}
function WebXRController() {
  (this._targetRay = null), (this._grip = null), (this._hand = null);
}
function WebXRManager(e, t) {
  const n = this;
  let r = null,
    i = 1,
    o = null,
    a = "local-floor",
    s = null;
  const c = [],
    l = new Map(),
    h = new PerspectiveCamera();
  h.layers.enable(1), (h.viewport = new Vector4());
  const u = new PerspectiveCamera();
  u.layers.enable(2), (u.viewport = new Vector4());
  const d = [h, u],
    p = new ArrayCamera();
  p.layers.enable(1), p.layers.enable(2);
  let m = null,
    f = null;
  function g(e) {
    const t = l.get(e.inputSource);
    t && t.dispatchEvent({ type: e.type, data: e.inputSource });
  }
  function v() {
    l.forEach(function (e, t) {
      e.disconnect(t);
    }),
      l.clear(),
      e.setFramebuffer(null),
      e.setRenderTarget(e.getRenderTarget()),
      S.stop(),
      (n.isPresenting = !1),
      n.dispatchEvent({ type: "sessionend" });
  }
  function y(e) {
    (o = e),
      S.setContext(r),
      S.start(),
      (n.isPresenting = !0),
      n.dispatchEvent({ type: "sessionstart" });
  }
  function _(e) {
    const t = r.inputSources;
    for (let e = 0; e < c.length; e++) l.set(t[e], c[e]);
    for (let t = 0; t < e.removed.length; t++) {
      const n = e.removed[t],
        r = l.get(n);
      r && (r.dispatchEvent({ type: "disconnected", data: n }), l.delete(n));
    }
    for (let t = 0; t < e.added.length; t++) {
      const n = e.added[t],
        r = l.get(n);
      r && r.dispatchEvent({ type: "connected", data: n });
    }
  }
  (this.enabled = !1),
    (this.isPresenting = !1),
    (this.getController = function (e) {
      let t = c[e];
      return (
        void 0 === t && ((t = new WebXRController()), (c[e] = t)),
        t.getTargetRaySpace()
      );
    }),
    (this.getControllerGrip = function (e) {
      let t = c[e];
      return (
        void 0 === t && ((t = new WebXRController()), (c[e] = t)),
        t.getGripSpace()
      );
    }),
    (this.getHand = function (e) {
      let t = c[e];
      return (
        void 0 === t && ((t = new WebXRController()), (c[e] = t)),
        t.getHandSpace()
      );
    }),
    (this.setFramebufferScaleFactor = function (e) {
      (i = e),
        !0 === n.isPresenting &&
          console.warn(
            "THREE.WebXRManager: Cannot change framebuffer scale while presenting."
          );
    }),
    (this.setReferenceSpaceType = function (e) {
      (a = e),
        !0 === n.isPresenting &&
          console.warn(
            "THREE.WebXRManager: Cannot change reference space type while presenting."
          );
    }),
    (this.getReferenceSpace = function () {
      return o;
    }),
    (this.getSession = function () {
      return r;
    }),
    (this.setSession = function (e) {
      if (null !== (r = e)) {
        r.addEventListener("select", g),
          r.addEventListener("selectstart", g),
          r.addEventListener("selectend", g),
          r.addEventListener("squeeze", g),
          r.addEventListener("squeezestart", g),
          r.addEventListener("squeezeend", g),
          r.addEventListener("end", v);
        const e = t.getContextAttributes();
        !0 !== e.xrCompatible && t.makeXRCompatible();
        const n = {
            antialias: e.antialias,
            alpha: e.alpha,
            depth: e.depth,
            stencil: e.stencil,
            framebufferScaleFactor: i
          },
          o = new XRWebGLLayer(r, t, n);
        r.updateRenderState({ baseLayer: o }),
          r.requestReferenceSpace(a).then(y),
          r.addEventListener("inputsourceschange", _);
      }
    });
  const x = new Vector3(),
    b = new Vector3();
  function M(e, t) {
    null === t
      ? e.matrixWorld.copy(e.matrix)
      : e.matrixWorld.multiplyMatrices(t.matrixWorld, e.matrix),
      e.matrixWorldInverse.getInverse(e.matrixWorld);
  }
  this.getCamera = function (e) {
    (p.near = u.near = h.near = e.near),
      (p.far = u.far = h.far = e.far),
      (m === p.near && f === p.far) ||
        (r.updateRenderState({ depthNear: p.near, depthFar: p.far }),
        (m = p.near),
        (f = p.far));
    const t = e.parent,
      n = p.cameras;
    M(p, t);
    for (let e = 0; e < n.length; e++) M(n[e], t);
    e.matrixWorld.copy(p.matrixWorld);
    const i = e.children;
    for (let e = 0, t = i.length; e < t; e++) i[e].updateMatrixWorld(!0);
    return (
      2 === n.length
        ? (function (e, t, n) {
            x.setFromMatrixPosition(t.matrixWorld),
              b.setFromMatrixPosition(n.matrixWorld);
            const r = x.distanceTo(b),
              i = t.projectionMatrix.elements,
              o = n.projectionMatrix.elements,
              a = i[14] / (i[10] - 1),
              s = i[14] / (i[10] + 1),
              c = (i[9] + 1) / i[5],
              l = (i[9] - 1) / i[5],
              h = (i[8] - 1) / i[0],
              u = (o[8] + 1) / o[0],
              d = a * h,
              p = a * u,
              m = r / (-h + u),
              f = m * -h;
            t.matrixWorld.decompose(e.position, e.quaternion, e.scale),
              e.translateX(f),
              e.translateZ(m),
              e.matrixWorld.compose(e.position, e.quaternion, e.scale),
              e.matrixWorldInverse.getInverse(e.matrixWorld);
            const g = a + m,
              v = s + m,
              y = d - f,
              _ = p + (r - f),
              M = ((c * s) / v) * g,
              w = ((l * s) / v) * g;
            e.projectionMatrix.makePerspective(y, _, M, w, g, v);
          })(p, h, u)
        : p.projectionMatrix.copy(h.projectionMatrix),
      p
    );
  };
  let w = null;
  const S = new WebGLAnimation();
  S.setAnimationLoop(function (t, n) {
    if (null !== (s = n.getViewerPose(o))) {
      const t = s.views,
        n = r.renderState.baseLayer;
      e.setFramebuffer(n.framebuffer);
      let i = !1;
      t.length !== p.cameras.length && ((p.cameras.length = 0), (i = !0));
      for (let e = 0; e < t.length; e++) {
        const r = t[e],
          o = n.getViewport(r),
          a = d[e];
        a.matrix.fromArray(r.transform.matrix),
          a.projectionMatrix.fromArray(r.projectionMatrix),
          a.viewport.set(o.x, o.y, o.width, o.height),
          0 === e && p.matrix.copy(a.matrix),
          !0 === i && p.cameras.push(a);
      }
    }
    const i = r.inputSources;
    for (let e = 0; e < c.length; e++) {
      const t = c[e],
        r = i[e];
      t.update(r, n, o);
    }
    w && w(t, n);
  }),
    (this.setAnimationLoop = function (e) {
      w = e;
    }),
    (this.dispose = function () {});
}
function WebGLMaterials(e) {
  function t(t, n) {
    (t.opacity.value = n.opacity),
      n.color && t.diffuse.value.copy(n.color),
      n.emissive &&
        t.emissive.value.copy(n.emissive).multiplyScalar(n.emissiveIntensity),
      n.map && (t.map.value = n.map),
      n.alphaMap && (t.alphaMap.value = n.alphaMap),
      n.specularMap && (t.specularMap.value = n.specularMap);
    const r = e.get(n).envMap;
    if (r) {
      (t.envMap.value = r),
        (t.flipEnvMap.value = r.isCubeTexture && r._needsFlipEnvMap ? -1 : 1),
        (t.reflectivity.value = n.reflectivity),
        (t.refractionRatio.value = n.refractionRatio);
      const i = e.get(r).__maxMipLevel;
      void 0 !== i && (t.maxMipLevel.value = i);
    }
    let i, o;
    n.lightMap &&
      ((t.lightMap.value = n.lightMap),
      (t.lightMapIntensity.value = n.lightMapIntensity)),
      n.aoMap &&
        ((t.aoMap.value = n.aoMap),
        (t.aoMapIntensity.value = n.aoMapIntensity)),
      n.map
        ? (i = n.map)
        : n.specularMap
        ? (i = n.specularMap)
        : n.displacementMap
        ? (i = n.displacementMap)
        : n.normalMap
        ? (i = n.normalMap)
        : n.bumpMap
        ? (i = n.bumpMap)
        : n.roughnessMap
        ? (i = n.roughnessMap)
        : n.metalnessMap
        ? (i = n.metalnessMap)
        : n.alphaMap
        ? (i = n.alphaMap)
        : n.emissiveMap
        ? (i = n.emissiveMap)
        : n.clearcoatMap
        ? (i = n.clearcoatMap)
        : n.clearcoatNormalMap
        ? (i = n.clearcoatNormalMap)
        : n.clearcoatRoughnessMap && (i = n.clearcoatRoughnessMap),
      void 0 !== i &&
        (i.isWebGLRenderTarget && (i = i.texture),
        !0 === i.matrixAutoUpdate && i.updateMatrix(),
        t.uvTransform.value.copy(i.matrix)),
      n.aoMap ? (o = n.aoMap) : n.lightMap && (o = n.lightMap),
      void 0 !== o &&
        (o.isWebGLRenderTarget && (o = o.texture),
        !0 === o.matrixAutoUpdate && o.updateMatrix(),
        t.uv2Transform.value.copy(o.matrix));
  }
  function n(t, n) {
    (t.roughness.value = n.roughness),
      (t.metalness.value = n.metalness),
      n.roughnessMap && (t.roughnessMap.value = n.roughnessMap),
      n.metalnessMap && (t.metalnessMap.value = n.metalnessMap),
      n.emissiveMap && (t.emissiveMap.value = n.emissiveMap),
      n.bumpMap &&
        ((t.bumpMap.value = n.bumpMap),
        (t.bumpScale.value = n.bumpScale),
        n.side === BackSide && (t.bumpScale.value *= -1)),
      n.normalMap &&
        ((t.normalMap.value = n.normalMap),
        t.normalScale.value.copy(n.normalScale),
        n.side === BackSide && t.normalScale.value.negate()),
      n.displacementMap &&
        ((t.displacementMap.value = n.displacementMap),
        (t.displacementScale.value = n.displacementScale),
        (t.displacementBias.value = n.displacementBias)),
      e.get(n).envMap && (t.envMapIntensity.value = n.envMapIntensity);
  }
  return {
    refreshFogUniforms: function (e, t) {
      e.fogColor.value.copy(t.color),
        t.isFog
          ? ((e.fogNear.value = t.near), (e.fogFar.value = t.far))
          : t.isFogExp2 && (e.fogDensity.value = t.density);
    },
    refreshMaterialUniforms: function (e, r, i, o) {
      r.isMeshBasicMaterial
        ? t(e, r)
        : r.isMeshLambertMaterial
        ? (t(e, r),
          (function (e, t) {
            t.emissiveMap && (e.emissiveMap.value = t.emissiveMap);
          })(e, r))
        : r.isMeshToonMaterial
        ? (t(e, r),
          (function (e, t) {
            t.gradientMap && (e.gradientMap.value = t.gradientMap),
              t.emissiveMap && (e.emissiveMap.value = t.emissiveMap),
              t.bumpMap &&
                ((e.bumpMap.value = t.bumpMap),
                (e.bumpScale.value = t.bumpScale),
                t.side === BackSide && (e.bumpScale.value *= -1)),
              t.normalMap &&
                ((e.normalMap.value = t.normalMap),
                e.normalScale.value.copy(t.normalScale),
                t.side === BackSide && e.normalScale.value.negate()),
              t.displacementMap &&
                ((e.displacementMap.value = t.displacementMap),
                (e.displacementScale.value = t.displacementScale),
                (e.displacementBias.value = t.displacementBias));
          })(e, r))
        : r.isMeshPhongMaterial
        ? (t(e, r),
          (function (e, t) {
            e.specular.value.copy(t.specular),
              (e.shininess.value = Math.max(t.shininess, 1e-4)),
              t.emissiveMap && (e.emissiveMap.value = t.emissiveMap),
              t.bumpMap &&
                ((e.bumpMap.value = t.bumpMap),
                (e.bumpScale.value = t.bumpScale),
                t.side === BackSide && (e.bumpScale.value *= -1)),
              t.normalMap &&
                ((e.normalMap.value = t.normalMap),
                e.normalScale.value.copy(t.normalScale),
                t.side === BackSide && e.normalScale.value.negate()),
              t.displacementMap &&
                ((e.displacementMap.value = t.displacementMap),
                (e.displacementScale.value = t.displacementScale),
                (e.displacementBias.value = t.displacementBias));
          })(e, r))
        : r.isMeshStandardMaterial
        ? (t(e, r),
          r.isMeshPhysicalMaterial
            ? (function (e, t) {
                n(e, t),
                  (e.reflectivity.value = t.reflectivity),
                  (e.clearcoat.value = t.clearcoat),
                  (e.clearcoatRoughness.value = t.clearcoatRoughness),
                  t.sheen && e.sheen.value.copy(t.sheen),
                  t.clearcoatMap && (e.clearcoatMap.value = t.clearcoatMap),
                  t.clearcoatRoughnessMap &&
                    (e.clearcoatRoughnessMap.value = t.clearcoatRoughnessMap),
                  t.clearcoatNormalMap &&
                    (e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),
                    (e.clearcoatNormalMap.value = t.clearcoatNormalMap),
                    t.side === BackSide &&
                      e.clearcoatNormalScale.value.negate()),
                  (e.transmission.value = t.transmission),
                  t.transmissionMap &&
                    (e.transmissionMap.value = t.transmissionMap);
              })(e, r)
            : n(e, r))
        : r.isMeshMatcapMaterial
        ? (t(e, r),
          (function (e, t) {
            t.matcap && (e.matcap.value = t.matcap),
              t.bumpMap &&
                ((e.bumpMap.value = t.bumpMap),
                (e.bumpScale.value = t.bumpScale),
                t.side === BackSide && (e.bumpScale.value *= -1)),
              t.normalMap &&
                ((e.normalMap.value = t.normalMap),
                e.normalScale.value.copy(t.normalScale),
                t.side === BackSide && e.normalScale.value.negate()),
              t.displacementMap &&
                ((e.displacementMap.value = t.displacementMap),
                (e.displacementScale.value = t.displacementScale),
                (e.displacementBias.value = t.displacementBias));
          })(e, r))
        : r.isMeshDepthMaterial
        ? (t(e, r),
          (function (e, t) {
            t.displacementMap &&
              ((e.displacementMap.value = t.displacementMap),
              (e.displacementScale.value = t.displacementScale),
              (e.displacementBias.value = t.displacementBias));
          })(e, r))
        : r.isMeshDistanceMaterial
        ? (t(e, r),
          (function (e, t) {
            t.displacementMap &&
              ((e.displacementMap.value = t.displacementMap),
              (e.displacementScale.value = t.displacementScale),
              (e.displacementBias.value = t.displacementBias)),
              e.referencePosition.value.copy(t.referencePosition),
              (e.nearDistance.value = t.nearDistance),
              (e.farDistance.value = t.farDistance);
          })(e, r))
        : r.isMeshNormalMaterial
        ? (t(e, r),
          (function (e, t) {
            t.bumpMap &&
              ((e.bumpMap.value = t.bumpMap),
              (e.bumpScale.value = t.bumpScale),
              t.side === BackSide && (e.bumpScale.value *= -1)),
              t.normalMap &&
                ((e.normalMap.value = t.normalMap),
                e.normalScale.value.copy(t.normalScale),
                t.side === BackSide && e.normalScale.value.negate()),
              t.displacementMap &&
                ((e.displacementMap.value = t.displacementMap),
                (e.displacementScale.value = t.displacementScale),
                (e.displacementBias.value = t.displacementBias));
          })(e, r))
        : r.isLineBasicMaterial
        ? ((function (e, t) {
            e.diffuse.value.copy(t.color), (e.opacity.value = t.opacity);
          })(e, r),
          r.isLineDashedMaterial &&
            (function (e, t) {
              (e.dashSize.value = t.dashSize),
                (e.totalSize.value = t.dashSize + t.gapSize),
                (e.scale.value = t.scale);
            })(e, r))
        : r.isPointsMaterial
        ? (function (e, t, n, r) {
            let i;
            e.diffuse.value.copy(t.color),
              (e.opacity.value = t.opacity),
              (e.size.value = t.size * n),
              (e.scale.value = 0.5 * r),
              t.map && (e.map.value = t.map),
              t.alphaMap && (e.alphaMap.value = t.alphaMap),
              t.map ? (i = t.map) : t.alphaMap && (i = t.alphaMap),
              void 0 !== i &&
                (!0 === i.matrixAutoUpdate && i.updateMatrix(),
                e.uvTransform.value.copy(i.matrix));
          })(e, r, i, o)
        : r.isSpriteMaterial
        ? (function (e, t) {
            let n;
            e.diffuse.value.copy(t.color),
              (e.opacity.value = t.opacity),
              (e.rotation.value = t.rotation),
              t.map && (e.map.value = t.map),
              t.alphaMap && (e.alphaMap.value = t.alphaMap),
              t.map ? (n = t.map) : t.alphaMap && (n = t.alphaMap),
              void 0 !== n &&
                (!0 === n.matrixAutoUpdate && n.updateMatrix(),
                e.uvTransform.value.copy(n.matrix));
          })(e, r)
        : r.isShadowMaterial
        ? (e.color.value.copy(r.color), (e.opacity.value = r.opacity))
        : r.isShaderMaterial && (r.uniformsNeedUpdate = !1);
    }
  };
}
function WebGLRenderer(e) {
  const t =
      void 0 !== (e = e || {}).canvas
        ? e.canvas
        : document.createElementNS("http://www.w3.org/1999/xhtml", "canvas"),
    n = void 0 !== e.context ? e.context : null,
    r = void 0 !== e.alpha && e.alpha,
    i = void 0 === e.depth || e.depth,
    o = void 0 === e.stencil || e.stencil,
    a = void 0 !== e.antialias && e.antialias,
    s = void 0 === e.premultipliedAlpha || e.premultipliedAlpha,
    c = void 0 !== e.preserveDrawingBuffer && e.preserveDrawingBuffer,
    l = void 0 !== e.powerPreference ? e.powerPreference : "default",
    h =
      void 0 !== e.failIfMajorPerformanceCaveat &&
      e.failIfMajorPerformanceCaveat;
  let u = null,
    d = null;
  (this.domElement = t),
    (this.debug = { checkShaderErrors: !0 }),
    (this.autoClear = !0),
    (this.autoClearColor = !0),
    (this.autoClearDepth = !0),
    (this.autoClearStencil = !0),
    (this.sortObjects = !0),
    (this.clippingPlanes = []),
    (this.localClippingEnabled = !1),
    (this.gammaFactor = 2),
    (this.outputEncoding = LinearEncoding),
    (this.physicallyCorrectLights = !1),
    (this.toneMapping = NoToneMapping),
    (this.toneMappingExposure = 1),
    (this.maxMorphTargets = 8),
    (this.maxMorphNormals = 4);
  const p = this;
  let m = !1,
    f = null,
    g = 0,
    v = 0,
    y = null,
    _ = null,
    x = -1,
    b = null,
    M = null;
  const w = new Vector4(),
    S = new Vector4();
  let T = null,
    E = t.width,
    A = t.height,
    L = 1,
    C = null,
    R = null;
  const P = new Vector4(0, 0, E, A),
    B = new Vector4(0, 0, E, A);
  let D = !1;
  const G = new Frustum();
  let I = !1,
    N = !1;
  const F = new Matrix4(),
    O = new Vector3(),
    U = {
      background: null,
      fog: null,
      environment: null,
      overrideMaterial: null,
      isScene: !0
    };
  function V() {
    return null === y ? L : 1;
  }
  let z,
    H,
    k,
    W,
    j,
    q,
    $,
    X,
    Y,
    Z,
    J,
    Q,
    K,
    ee,
    te,
    ne,
    re,
    ie,
    oe,
    ae,
    se,
    ce = n;
  function le(e, n) {
    for (let r = 0; r < e.length; r++) {
      const i = e[r],
        o = t.getContext(i, n);
      if (null !== o) return o;
    }
    return null;
  }
  try {
    const e = {
      alpha: r,
      depth: i,
      stencil: o,
      antialias: a,
      premultipliedAlpha: s,
      preserveDrawingBuffer: c,
      powerPreference: l,
      failIfMajorPerformanceCaveat: h
    };
    if (
      (t.addEventListener("webglcontextlost", pe, !1),
      t.addEventListener("webglcontextrestored", me, !1),
      null === ce)
    ) {
      const t = ["webgl2", "webgl", "experimental-webgl"];
      if ((!0 === p.isWebGL1Renderer && t.shift(), null === (ce = le(t, e))))
        throw le(t)
          ? new Error(
              "Error creating WebGL context with your selected attributes."
            )
          : new Error("Error creating WebGL context.");
    }
    void 0 === ce.getShaderPrecisionFormat &&
      (ce.getShaderPrecisionFormat = function () {
        return { rangeMin: 1, rangeMax: 1, precision: 1 };
      });
  } catch (e) {
    throw (console.error("THREE.WebGLRenderer: " + e.message), e);
  }
  function he() {
    (z = new WebGLExtensions(ce)),
      !1 === (H = new WebGLCapabilities(ce, z, e)).isWebGL2 &&
        (z.get("WEBGL_depth_texture"),
        z.get("OES_texture_float"),
        z.get("OES_texture_half_float"),
        z.get("OES_texture_half_float_linear"),
        z.get("OES_standard_derivatives"),
        z.get("OES_element_index_uint"),
        z.get("OES_vertex_array_object"),
        z.get("ANGLE_instanced_arrays")),
      z.get("OES_texture_float_linear"),
      (ae = new WebGLUtils(ce, z, H)),
      (k = new WebGLState(ce, z, H)).scissor(
        S.copy(B).multiplyScalar(L).floor()
      ),
      k.viewport(w.copy(P).multiplyScalar(L).floor()),
      (W = new WebGLInfo(ce)),
      (j = new WebGLProperties()),
      (q = new WebGLTextures(ce, z, k, j, H, ae, W)),
      ($ = new WebGLCubeMaps(p)),
      (X = new WebGLAttributes(ce, H)),
      (se = new WebGLBindingStates(ce, z, X, H)),
      (Y = new WebGLGeometries(ce, X, W, se)),
      (Z = new WebGLObjects(ce, Y, X, W)),
      (re = new WebGLMorphtargets(ce)),
      (te = new WebGLClipping(j)),
      (J = new WebGLPrograms(p, $, z, H, se, te)),
      (Q = new WebGLMaterials(j)),
      (K = new WebGLRenderLists(j)),
      (ee = new WebGLRenderStates()),
      (ne = new WebGLBackground(p, $, k, Z, s)),
      (ie = new WebGLBufferRenderer(ce, z, W, H)),
      (oe = new WebGLIndexedBufferRenderer(ce, z, W, H)),
      (W.programs = J.programs),
      (p.capabilities = H),
      (p.extensions = z),
      (p.properties = j),
      (p.renderLists = K),
      (p.state = k),
      (p.info = W);
  }
  he();
  const ue = new WebXRManager(p, ce);
  this.xr = ue;
  const de = new WebGLShadowMap(p, Z, H.maxTextureSize);
  function pe(e) {
    e.preventDefault(),
      console.log("THREE.WebGLRenderer: Context Lost."),
      (m = !0);
  }
  function me() {
    console.log("THREE.WebGLRenderer: Context Restored."), (m = !1), he();
  }
  function fe(e) {
    const t = e.target;
    t.removeEventListener("dispose", fe),
      (function (e) {
        ge(e), j.remove(e);
      })(t);
  }
  function ge(e) {
    const t = j.get(e).program;
    void 0 !== t && J.releaseProgram(t);
  }
  (this.shadowMap = de),
    (this.getContext = function () {
      return ce;
    }),
    (this.getContextAttributes = function () {
      return ce.getContextAttributes();
    }),
    (this.forceContextLoss = function () {
      const e = z.get("WEBGL_lose_context");
      e && e.loseContext();
    }),
    (this.forceContextRestore = function () {
      const e = z.get("WEBGL_lose_context");
      e && e.restoreContext();
    }),
    (this.getPixelRatio = function () {
      return L;
    }),
    (this.setPixelRatio = function (e) {
      void 0 !== e && ((L = e), this.setSize(E, A, !1));
    }),
    (this.getSize = function (e) {
      return (
        void 0 === e &&
          (console.warn(
            "WebGLRenderer: .getsize() now requires a Vector2 as an argument"
          ),
          (e = new Vector2())),
        e.set(E, A)
      );
    }),
    (this.setSize = function (e, n, r) {
      ue.isPresenting
        ? console.warn(
            "THREE.WebGLRenderer: Can't change size while VR device is presenting."
          )
        : ((E = e),
          (A = n),
          (t.width = Math.floor(e * L)),
          (t.height = Math.floor(n * L)),
          !1 !== r && ((t.style.width = e + "px"), (t.style.height = n + "px")),
          this.setViewport(0, 0, e, n));
    }),
    (this.getDrawingBufferSize = function (e) {
      return (
        void 0 === e &&
          (console.warn(
            "WebGLRenderer: .getdrawingBufferSize() now requires a Vector2 as an argument"
          ),
          (e = new Vector2())),
        e.set(E * L, A * L).floor()
      );
    }),
    (this.setDrawingBufferSize = function (e, n, r) {
      (E = e),
        (A = n),
        (L = r),
        (t.width = Math.floor(e * r)),
        (t.height = Math.floor(n * r)),
        this.setViewport(0, 0, e, n);
    }),
    (this.getCurrentViewport = function (e) {
      return (
        void 0 === e &&
          (console.warn(
            "WebGLRenderer: .getCurrentViewport() now requires a Vector4 as an argument"
          ),
          (e = new Vector4())),
        e.copy(w)
      );
    }),
    (this.getViewport = function (e) {
      return e.copy(P);
    }),
    (this.setViewport = function (e, t, n, r) {
      e.isVector4 ? P.set(e.x, e.y, e.z, e.w) : P.set(e, t, n, r),
        k.viewport(w.copy(P).multiplyScalar(L).floor());
    }),
    (this.getScissor = function (e) {
      return e.copy(B);
    }),
    (this.setScissor = function (e, t, n, r) {
      e.isVector4 ? B.set(e.x, e.y, e.z, e.w) : B.set(e, t, n, r),
        k.scissor(S.copy(B).multiplyScalar(L).floor());
    }),
    (this.getScissorTest = function () {
      return D;
    }),
    (this.setScissorTest = function (e) {
      k.setScissorTest((D = e));
    }),
    (this.setOpaqueSort = function (e) {
      C = e;
    }),
    (this.setTransparentSort = function (e) {
      R = e;
    }),
    (this.getClearColor = function () {
      return ne.getClearColor();
    }),
    (this.setClearColor = function () {
      ne.setClearColor.apply(ne, arguments);
    }),
    (this.getClearAlpha = function () {
      return ne.getClearAlpha();
    }),
    (this.setClearAlpha = function () {
      ne.setClearAlpha.apply(ne, arguments);
    }),
    (this.clear = function (e, t, n) {
      let r = 0;
      (void 0 === e || e) && (r |= 16384),
        (void 0 === t || t) && (r |= 256),
        (void 0 === n || n) && (r |= 1024),
        ce.clear(r);
    }),
    (this.clearColor = function () {
      this.clear(!0, !1, !1);
    }),
    (this.clearDepth = function () {
      this.clear(!1, !0, !1);
    }),
    (this.clearStencil = function () {
      this.clear(!1, !1, !0);
    }),
    (this.dispose = function () {
      t.removeEventListener("webglcontextlost", pe, !1),
        t.removeEventListener("webglcontextrestored", me, !1),
        K.dispose(),
        ee.dispose(),
        j.dispose(),
        $.dispose(),
        Z.dispose(),
        se.dispose(),
        ue.dispose(),
        ye.stop();
    }),
    (this.renderBufferImmediate = function (e, t) {
      se.initAttributes();
      const n = j.get(e);
      e.hasPositions && !n.position && (n.position = ce.createBuffer()),
        e.hasNormals && !n.normal && (n.normal = ce.createBuffer()),
        e.hasUvs && !n.uv && (n.uv = ce.createBuffer()),
        e.hasColors && !n.color && (n.color = ce.createBuffer());
      const r = t.getAttributes();
      e.hasPositions &&
        (ce.bindBuffer(34962, n.position),
        ce.bufferData(34962, e.positionArray, 35048),
        se.enableAttribute(r.position),
        ce.vertexAttribPointer(r.position, 3, 5126, !1, 0, 0)),
        e.hasNormals &&
          (ce.bindBuffer(34962, n.normal),
          ce.bufferData(34962, e.normalArray, 35048),
          se.enableAttribute(r.normal),
          ce.vertexAttribPointer(r.normal, 3, 5126, !1, 0, 0)),
        e.hasUvs &&
          (ce.bindBuffer(34962, n.uv),
          ce.bufferData(34962, e.uvArray, 35048),
          se.enableAttribute(r.uv),
          ce.vertexAttribPointer(r.uv, 2, 5126, !1, 0, 0)),
        e.hasColors &&
          (ce.bindBuffer(34962, n.color),
          ce.bufferData(34962, e.colorArray, 35048),
          se.enableAttribute(r.color),
          ce.vertexAttribPointer(r.color, 3, 5126, !1, 0, 0)),
        se.disableUnusedAttributes(),
        ce.drawArrays(4, 0, e.count),
        (e.count = 0);
    }),
    (this.renderBufferDirect = function (e, t, n, r, i, o) {
      null === t && (t = U);
      const a = i.isMesh && i.matrixWorld.determinant() < 0,
        s = Me(e, t, r, i);
      k.setMaterial(r, a);
      let c = n.index;
      const l = n.attributes.position;
      if (null === c) {
        if (void 0 === l || 0 === l.count) return;
      } else if (0 === c.count) return;
      let h,
        u = 1;
      !0 === r.wireframe && ((c = Y.getWireframeAttribute(n)), (u = 2)),
        (r.morphTargets || r.morphNormals) && re.update(i, n, r, s),
        se.setup(i, r, s, n, c);
      let d = ie;
      null !== c && ((h = X.get(c)), (d = oe).setIndex(h));
      const p = null !== c ? c.count : l.count,
        m = n.drawRange.start * u,
        f = n.drawRange.count * u,
        g = null !== o ? o.start * u : 0,
        v = null !== o ? o.count * u : 1 / 0,
        y = Math.max(m, g),
        _ = Math.min(p, m + f, g + v) - 1,
        x = Math.max(0, _ - y + 1);
      if (0 !== x) {
        if (i.isMesh)
          !0 === r.wireframe
            ? (k.setLineWidth(r.wireframeLinewidth * V()), d.setMode(1))
            : d.setMode(4);
        else if (i.isLine) {
          let e = r.linewidth;
          void 0 === e && (e = 1),
            k.setLineWidth(e * V()),
            i.isLineSegments
              ? d.setMode(1)
              : i.isLineLoop
              ? d.setMode(2)
              : d.setMode(3);
        } else i.isPoints ? d.setMode(0) : i.isSprite && d.setMode(4);
        if (i.isInstancedMesh) d.renderInstances(y, x, i.count);
        else if (n.isInstancedBufferGeometry) {
          const e = Math.min(n.instanceCount, n._maxInstanceCount);
          d.renderInstances(y, x, e);
        } else d.render(y, x);
      }
    }),
    (this.compile = function (e, t) {
      (d = ee.get(e, t)).init(),
        e.traverse(function (e) {
          e.isLight && (d.pushLight(e), e.castShadow && d.pushShadow(e));
        }),
        d.setupLights(t);
      const n = new WeakMap();
      e.traverse(function (t) {
        const r = t.material;
        if (r)
          if (Array.isArray(r))
            for (let i = 0; i < r.length; i++) {
              const o = r[i];
              !1 === n.has(o) && (be(o, e, t), n.set(o));
            }
          else !1 === n.has(r) && (be(r, e, t), n.set(r));
      });
    });
  let ve = null;
  const ye = new WebGLAnimation();
  function _e(e, t, n) {
    const r = !0 === t.isScene ? t.overrideMaterial : null;
    for (let i = 0, o = e.length; i < o; i++) {
      const o = e[i],
        a = o.object,
        s = o.geometry,
        c = null === r ? o.material : r,
        l = o.group;
      if (n.isArrayCamera) {
        M = n;
        const e = n.cameras;
        for (let n = 0, r = e.length; n < r; n++) {
          const r = e[n];
          a.layers.test(r.layers) &&
            (k.viewport(w.copy(r.viewport)),
            d.setupLights(r),
            xe(a, t, r, s, c, l));
        }
      } else (M = null), xe(a, t, n, s, c, l);
    }
  }
  function xe(e, t, n, r, i, o) {
    if (
      (e.onBeforeRender(p, t, n, r, i, o),
      (d = ee.get(t, M || n)),
      e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse, e.matrixWorld),
      e.normalMatrix.getNormalMatrix(e.modelViewMatrix),
      e.isImmediateRenderObject)
    ) {
      const r = Me(n, t, i, e);
      k.setMaterial(i),
        se.reset(),
        (function (e, t) {
          e.render(function (e) {
            p.renderBufferImmediate(e, t);
          });
        })(e, r);
    } else p.renderBufferDirect(n, t, r, i, e, o);
    e.onAfterRender(p, t, n, r, i, o), (d = ee.get(t, M || n));
  }
  function be(e, t, n) {
    !0 !== t.isScene && (t = U);
    const r = j.get(e),
      i = d.state.lights,
      o = d.state.shadowsArray,
      a = i.state.version,
      s = J.getParameters(e, i.state, o, t, n),
      c = J.getProgramCacheKey(s);
    let l = r.program,
      h = !0;
    if (void 0 === l) e.addEventListener("dispose", fe);
    else if (l.cacheKey !== c) ge(e);
    else if (r.lightsStateVersion !== a) h = !1;
    else {
      if (void 0 !== s.shaderID) {
        const n = e.isMeshStandardMaterial ? t.environment : null;
        return void (r.envMap = $.get(e.envMap || n));
      }
      h = !1;
    }
    h &&
      ((s.uniforms = J.getUniforms(e)),
      e.onBeforeCompile(s, p),
      (l = J.acquireProgram(s, c)),
      (r.program = l),
      (r.uniforms = s.uniforms),
      (r.outputEncoding = s.outputEncoding));
    const u = r.uniforms;
    ((e.isShaderMaterial || e.isRawShaderMaterial) && !0 !== e.clipping) ||
      ((r.numClippingPlanes = te.numPlanes),
      (r.numIntersection = te.numIntersection),
      (u.clippingPlanes = te.uniform)),
      (r.environment = e.isMeshStandardMaterial ? t.environment : null),
      (r.fog = t.fog),
      (r.envMap = $.get(e.envMap || r.environment)),
      (r.needsLights = (function (e) {
        return (
          e.isMeshLambertMaterial ||
          e.isMeshToonMaterial ||
          e.isMeshPhongMaterial ||
          e.isMeshStandardMaterial ||
          e.isShadowMaterial ||
          (e.isShaderMaterial && !0 === e.lights)
        );
      })(e)),
      (r.lightsStateVersion = a),
      r.needsLights &&
        ((u.ambientLightColor.value = i.state.ambient),
        (u.lightProbe.value = i.state.probe),
        (u.directionalLights.value = i.state.directional),
        (u.directionalLightShadows.value = i.state.directionalShadow),
        (u.spotLights.value = i.state.spot),
        (u.spotLightShadows.value = i.state.spotShadow),
        (u.rectAreaLights.value = i.state.rectArea),
        (u.ltc_1.value = i.state.rectAreaLTC1),
        (u.ltc_2.value = i.state.rectAreaLTC2),
        (u.pointLights.value = i.state.point),
        (u.pointLightShadows.value = i.state.pointShadow),
        (u.hemisphereLights.value = i.state.hemi),
        (u.directionalShadowMap.value = i.state.directionalShadowMap),
        (u.directionalShadowMatrix.value = i.state.directionalShadowMatrix),
        (u.spotShadowMap.value = i.state.spotShadowMap),
        (u.spotShadowMatrix.value = i.state.spotShadowMatrix),
        (u.pointShadowMap.value = i.state.pointShadowMap),
        (u.pointShadowMatrix.value = i.state.pointShadowMatrix));
    const m = r.program.getUniforms(),
      f = WebGLUniforms.seqWithValue(m.seq, u);
    r.uniformsList = f;
  }
  function Me(e, t, n, r) {
    !0 !== t.isScene && (t = U), q.resetTextureUnits();
    const i = t.fog,
      o = n.isMeshStandardMaterial ? t.environment : null,
      a = null === y ? p.outputEncoding : y.texture.encoding,
      s = $.get(n.envMap || o),
      c = j.get(n),
      l = d.state.lights;
    if (!0 === I && (!0 === N || e !== b)) {
      const t = e === b && n.id === x;
      te.setState(n, e, t);
    }
    n.version === c.__version
      ? n.fog && c.fog !== i
        ? be(n, t, r)
        : c.environment !== o
        ? be(n, t, r)
        : c.needsLights && c.lightsStateVersion !== l.state.version
        ? be(n, t, r)
        : void 0 === c.numClippingPlanes ||
          (c.numClippingPlanes === te.numPlanes &&
            c.numIntersection === te.numIntersection)
        ? c.outputEncoding !== a
          ? be(n, t, r)
          : c.envMap !== s && be(n, t, r)
        : be(n, t, r)
      : (be(n, t, r), (c.__version = n.version));
    let h = !1,
      u = !1,
      m = !1;
    const f = c.program,
      g = f.getUniforms(),
      v = c.uniforms;
    if (
      (k.useProgram(f.program) && ((h = !0), (u = !0), (m = !0)),
      n.id !== x && ((x = n.id), (u = !0)),
      h || b !== e)
    ) {
      if (
        (g.setValue(ce, "projectionMatrix", e.projectionMatrix),
        H.logarithmicDepthBuffer &&
          g.setValue(ce, "logDepthBufFC", 2 / (Math.log(e.far + 1) / Math.LN2)),
        b !== e && ((b = e), (u = !0), (m = !0)),
        n.isShaderMaterial ||
          n.isMeshPhongMaterial ||
          n.isMeshToonMaterial ||
          n.isMeshStandardMaterial ||
          n.envMap)
      ) {
        const t = g.map.cameraPosition;
        void 0 !== t && t.setValue(ce, O.setFromMatrixPosition(e.matrixWorld));
      }
      (n.isMeshPhongMaterial ||
        n.isMeshToonMaterial ||
        n.isMeshLambertMaterial ||
        n.isMeshBasicMaterial ||
        n.isMeshStandardMaterial ||
        n.isShaderMaterial) &&
        g.setValue(ce, "isOrthographic", !0 === e.isOrthographicCamera),
        (n.isMeshPhongMaterial ||
          n.isMeshToonMaterial ||
          n.isMeshLambertMaterial ||
          n.isMeshBasicMaterial ||
          n.isMeshStandardMaterial ||
          n.isShaderMaterial ||
          n.isShadowMaterial ||
          n.skinning) &&
          g.setValue(ce, "viewMatrix", e.matrixWorldInverse);
    }
    if (n.skinning) {
      g.setOptional(ce, r, "bindMatrix"),
        g.setOptional(ce, r, "bindMatrixInverse");
      const e = r.skeleton;
      if (e) {
        const t = e.bones;
        if (H.floatVertexTextures) {
          if (void 0 === e.boneTexture) {
            let n = Math.sqrt(4 * t.length);
            (n = MathUtils.ceilPowerOfTwo(n)), (n = Math.max(n, 4));
            const r = new Float32Array(n * n * 4);
            r.set(e.boneMatrices);
            const i = new DataTexture(r, n, n, RGBAFormat, FloatType);
            (e.boneMatrices = r), (e.boneTexture = i), (e.boneTextureSize = n);
          }
          g.setValue(ce, "boneTexture", e.boneTexture, q),
            g.setValue(ce, "boneTextureSize", e.boneTextureSize);
        } else g.setOptional(ce, e, "boneMatrices");
      }
    }
    var _, M;
    return (
      (u || c.receiveShadow !== r.receiveShadow) &&
        ((c.receiveShadow = r.receiveShadow),
        g.setValue(ce, "receiveShadow", r.receiveShadow)),
      u &&
        (g.setValue(ce, "toneMappingExposure", p.toneMappingExposure),
        c.needsLights &&
          ((M = m),
          ((_ = v).ambientLightColor.needsUpdate = M),
          (_.lightProbe.needsUpdate = M),
          (_.directionalLights.needsUpdate = M),
          (_.directionalLightShadows.needsUpdate = M),
          (_.pointLights.needsUpdate = M),
          (_.pointLightShadows.needsUpdate = M),
          (_.spotLights.needsUpdate = M),
          (_.spotLightShadows.needsUpdate = M),
          (_.rectAreaLights.needsUpdate = M),
          (_.hemisphereLights.needsUpdate = M)),
        i && n.fog && Q.refreshFogUniforms(v, i),
        Q.refreshMaterialUniforms(v, n, L, A),
        WebGLUniforms.upload(ce, c.uniformsList, v, q)),
      n.isShaderMaterial &&
        !0 === n.uniformsNeedUpdate &&
        (WebGLUniforms.upload(ce, c.uniformsList, v, q),
        (n.uniformsNeedUpdate = !1)),
      n.isSpriteMaterial && g.setValue(ce, "center", r.center),
      g.setValue(ce, "modelViewMatrix", r.modelViewMatrix),
      g.setValue(ce, "normalMatrix", r.normalMatrix),
      g.setValue(ce, "modelMatrix", r.matrixWorld),
      f
    );
  }
  ye.setAnimationLoop(function (e) {
    ue.isPresenting || (ve && ve(e));
  }),
    "undefined" != typeof window && ye.setContext(window),
    (this.setAnimationLoop = function (e) {
      (ve = e), ue.setAnimationLoop(e), null === e ? ye.stop() : ye.start();
    }),
    (this.render = function (e, t) {
      let n, r;
      if (
        (void 0 !== arguments[2] &&
          (console.warn(
            "THREE.WebGLRenderer.render(): the renderTarget argument has been removed. Use .setRenderTarget() instead."
          ),
          (n = arguments[2])),
        void 0 !== arguments[3] &&
          (console.warn(
            "THREE.WebGLRenderer.render(): the forceClear argument has been removed. Use .clear() instead."
          ),
          (r = arguments[3])),
        void 0 !== t && !0 !== t.isCamera)
      )
        return void console.error(
          "THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera."
        );
      if (!0 === m) return;
      se.resetDefaultState(),
        (x = -1),
        (b = null),
        !0 === e.autoUpdate && e.updateMatrixWorld(),
        null === t.parent && t.updateMatrixWorld(),
        !0 === ue.enabled && !0 === ue.isPresenting && (t = ue.getCamera(t)),
        !0 === e.isScene && e.onBeforeRender(p, e, t, n || y),
        (d = ee.get(e, t)).init(),
        F.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse),
        G.setFromProjectionMatrix(F),
        (N = this.localClippingEnabled),
        (I = te.init(this.clippingPlanes, N, t)),
        (u = K.get(e, t)).init(),
        (function e(t, n, r, i) {
          if (!1 === t.visible) return;
          const o = t.layers.test(n.layers);
          if (o)
            if (t.isGroup) r = t.renderOrder;
            else if (t.isLOD) !0 === t.autoUpdate && t.update(n);
            else if (t.isLight) d.pushLight(t), t.castShadow && d.pushShadow(t);
            else if (t.isSprite) {
              if (!t.frustumCulled || G.intersectsSprite(t)) {
                i && O.setFromMatrixPosition(t.matrixWorld).applyMatrix4(F);
                const e = Z.update(t),
                  n = t.material;
                n.visible && u.push(t, e, n, r, O.z, null);
              }
            } else if (t.isImmediateRenderObject)
              i && O.setFromMatrixPosition(t.matrixWorld).applyMatrix4(F),
                u.push(t, null, t.material, r, O.z, null);
            else if (
              (t.isMesh || t.isLine || t.isPoints) &&
              (t.isSkinnedMesh &&
                t.skeleton.frame !== W.render.frame &&
                (t.skeleton.update(), (t.skeleton.frame = W.render.frame)),
              !t.frustumCulled || G.intersectsObject(t))
            ) {
              i && O.setFromMatrixPosition(t.matrixWorld).applyMatrix4(F);
              const e = Z.update(t),
                n = t.material;
              if (Array.isArray(n)) {
                const i = e.groups;
                for (let o = 0, a = i.length; o < a; o++) {
                  const a = i[o],
                    s = n[a.materialIndex];
                  s && s.visible && u.push(t, e, s, r, O.z, a);
                }
              } else n.visible && u.push(t, e, n, r, O.z, null);
            }
          const a = t.children;
          for (let t = 0, o = a.length; t < o; t++) e(a[t], n, r, i);
        })(e, t, 0, p.sortObjects),
        u.finish(),
        !0 === p.sortObjects && u.sort(C, R),
        !0 === I && te.beginShadows();
      const i = d.state.shadowsArray;
      de.render(i, e, t),
        d.setupLights(t),
        !0 === I && te.endShadows(),
        !0 === this.info.autoReset && this.info.reset(),
        void 0 !== n && this.setRenderTarget(n),
        ne.render(u, e, t, r);
      const o = u.opaque,
        a = u.transparent;
      o.length > 0 && _e(o, e, t),
        a.length > 0 && _e(a, e, t),
        !0 === e.isScene && e.onAfterRender(p, e, t),
        null !== y &&
          (q.updateRenderTargetMipmap(y), q.updateMultisampleRenderTarget(y)),
        k.buffers.depth.setTest(!0),
        k.buffers.depth.setMask(!0),
        k.buffers.color.setMask(!0),
        k.setPolygonOffset(!1),
        (u = null),
        (d = null);
    }),
    (this.setFramebuffer = function (e) {
      f !== e && null === y && ce.bindFramebuffer(36160, e), (f = e);
    }),
    (this.getActiveCubeFace = function () {
      return g;
    }),
    (this.getActiveMipmapLevel = function () {
      return v;
    }),
    (this.getRenderList = function () {
      return u;
    }),
    (this.setRenderList = function (e) {
      u = e;
    }),
    (this.getRenderState = function () {
      return d;
    }),
    (this.setRenderState = function (e) {
      d = e;
    }),
    (this.getRenderTarget = function () {
      return y;
    }),
    (this.setRenderTarget = function (e, t = 0, n = 0) {
      (y = e),
        (g = t),
        (v = n),
        e && void 0 === j.get(e).__webglFramebuffer && q.setupRenderTarget(e);
      let r = f,
        i = !1;
      if (e) {
        const n = j.get(e).__webglFramebuffer;
        e.isWebGLCubeRenderTarget
          ? ((r = n[t]), (i = !0))
          : (r = e.isWebGLMultisampleRenderTarget
              ? j.get(e).__webglMultisampledFramebuffer
              : n),
          w.copy(e.viewport),
          S.copy(e.scissor),
          (T = e.scissorTest);
      } else
        w.copy(P).multiplyScalar(L).floor(),
          S.copy(B).multiplyScalar(L).floor(),
          (T = D);
      if (
        (_ !== r && (ce.bindFramebuffer(36160, r), (_ = r)),
        k.viewport(w),
        k.scissor(S),
        k.setScissorTest(T),
        i)
      ) {
        const r = j.get(e.texture);
        ce.framebufferTexture2D(36160, 36064, 34069 + t, r.__webglTexture, n);
      }
    }),
    (this.readRenderTargetPixels = function (e, t, n, r, i, o, a) {
      if (!e || !e.isWebGLRenderTarget)
        return void console.error(
          "THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget."
        );
      let s = j.get(e).__webglFramebuffer;
      if ((e.isWebGLCubeRenderTarget && void 0 !== a && (s = s[a]), s)) {
        let a = !1;
        s !== _ && (ce.bindFramebuffer(36160, s), (a = !0));
        try {
          const s = e.texture,
            c = s.format,
            l = s.type;
          if (c !== RGBAFormat && ae.convert(c) !== ce.getParameter(35739))
            return void console.error(
              "THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format."
            );
          if (
            !(
              l === UnsignedByteType ||
              ae.convert(l) === ce.getParameter(35738) ||
              (l === FloatType &&
                (H.isWebGL2 ||
                  z.get("OES_texture_float") ||
                  z.get("WEBGL_color_buffer_float"))) ||
              (l === HalfFloatType &&
                (H.isWebGL2
                  ? z.get("EXT_color_buffer_float")
                  : z.get("EXT_color_buffer_half_float")))
            )
          )
            return void console.error(
              "THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type."
            );
          36053 === ce.checkFramebufferStatus(36160)
            ? t >= 0 &&
              t <= e.width - r &&
              n >= 0 &&
              n <= e.height - i &&
              ce.readPixels(t, n, r, i, ae.convert(c), ae.convert(l), o)
            : console.error(
                "THREE.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete."
              );
        } finally {
          a && ce.bindFramebuffer(36160, _);
        }
      }
    }),
    (this.copyFramebufferToTexture = function (e, t, n) {
      void 0 === n && (n = 0);
      const r = Math.pow(2, -n),
        i = Math.floor(t.image.width * r),
        o = Math.floor(t.image.height * r),
        a = ae.convert(t.format);
      q.setTexture2D(t, 0),
        ce.copyTexImage2D(3553, n, a, e.x, e.y, i, o, 0),
        k.unbindTexture();
    }),
    (this.copyTextureToTexture = function (e, t, n, r) {
      void 0 === r && (r = 0);
      const i = t.image.width,
        o = t.image.height,
        a = ae.convert(n.format),
        s = ae.convert(n.type);
      q.setTexture2D(n, 0),
        ce.pixelStorei(37440, n.flipY),
        ce.pixelStorei(37441, n.premultiplyAlpha),
        ce.pixelStorei(3317, n.unpackAlignment),
        t.isDataTexture
          ? ce.texSubImage2D(3553, r, e.x, e.y, i, o, a, s, t.image.data)
          : t.isCompressedTexture
          ? ce.compressedTexSubImage2D(
              3553,
              r,
              e.x,
              e.y,
              t.mipmaps[0].width,
              t.mipmaps[0].height,
              a,
              t.mipmaps[0].data
            )
          : ce.texSubImage2D(3553, r, e.x, e.y, a, s, t.image),
        0 === r && n.generateMipmaps && ce.generateMipmap(3553),
        k.unbindTexture();
    }),
    (this.initTexture = function (e) {
      q.setTexture2D(e, 0), k.unbindTexture();
    }),
    "undefined" != typeof __THREE_DEVTOOLS__ &&
      __THREE_DEVTOOLS__.dispatchEvent(
        new CustomEvent("observe", { detail: this })
      );
}
function WebGL1Renderer(e) {
  WebGLRenderer.call(this, e);
}
(ArrayCamera.prototype = Object.assign(
  Object.create(PerspectiveCamera.prototype),
  { constructor: ArrayCamera, isArrayCamera: !0 }
)),
  (Group.prototype = Object.assign(Object.create(Object3D.prototype), {
    constructor: Group,
    isGroup: !0
  })),
  Object.assign(WebXRController.prototype, {
    constructor: WebXRController,
    getHandSpace: function () {
      if (
        null === this._hand &&
        ((this._hand = new Group()),
        (this._hand.matrixAutoUpdate = !1),
        (this._hand.visible = !1),
        (this._hand.joints = []),
        (this._hand.inputState = { pinching: !1 }),
        window.XRHand)
      )
        for (let e = 0; e <= window.XRHand.LITTLE_PHALANX_TIP; e++) {
          const e = new Group();
          (e.matrixAutoUpdate = !1),
            (e.visible = !1),
            this._hand.joints.push(e),
            this._hand.add(e);
        }
      return this._hand;
    },
    getTargetRaySpace: function () {
      return (
        null === this._targetRay &&
          ((this._targetRay = new Group()),
          (this._targetRay.matrixAutoUpdate = !1),
          (this._targetRay.visible = !1)),
        this._targetRay
      );
    },
    getGripSpace: function () {
      return (
        null === this._grip &&
          ((this._grip = new Group()),
          (this._grip.matrixAutoUpdate = !1),
          (this._grip.visible = !1)),
        this._grip
      );
    },
    dispatchEvent: function (e) {
      return (
        null !== this._targetRay && this._targetRay.dispatchEvent(e),
        null !== this._grip && this._grip.dispatchEvent(e),
        null !== this._hand && this._hand.dispatchEvent(e),
        this
      );
    },
    disconnect: function (e) {
      return (
        this.dispatchEvent({ type: "disconnected", data: e }),
        null !== this._targetRay && (this._targetRay.visible = !1),
        null !== this._grip && (this._grip.visible = !1),
        null !== this._hand && (this._hand.visible = !1),
        this
      );
    },
    update: function (e, t, n) {
      let r = null,
        i = null,
        o = null;
      const a = this._targetRay,
        s = this._grip,
        c = this._hand;
      if (e)
        if (c && e.hand) {
          o = !0;
          for (let r = 0; r <= window.XRHand.LITTLE_PHALANX_TIP; r++)
            if (e.hand[r]) {
              const i = t.getJointPose(e.hand[r], n),
                o = c.joints[r];
              null !== i &&
                (o.matrix.fromArray(i.transform.matrix),
                o.matrix.decompose(o.position, o.rotation, o.scale),
                (o.jointRadius = i.radius)),
                (o.visible = null !== i);
              const a = c.joints[window.XRHand.INDEX_PHALANX_TIP],
                s = c.joints[window.XRHand.THUMB_PHALANX_TIP],
                l = a.position.distanceTo(s.position),
                h = 0.02,
                u = 0.005;
              c.inputState.pinching && l > h + u
                ? ((c.inputState.pinching = !1),
                  this.dispatchEvent({
                    type: "pinchend",
                    handedness: e.handedness,
                    target: this
                  }))
                : !c.inputState.pinching &&
                  l <= h - u &&
                  ((c.inputState.pinching = !0),
                  this.dispatchEvent({
                    type: "pinchstart",
                    handedness: e.handedness,
                    target: this
                  }));
            }
        } else
          null !== a &&
            null !== (r = t.getPose(e.targetRaySpace, n)) &&
            (a.matrix.fromArray(r.transform.matrix),
            a.matrix.decompose(a.position, a.rotation, a.scale)),
            null !== s &&
              e.gripSpace &&
              null !== (i = t.getPose(e.gripSpace, n)) &&
              (s.matrix.fromArray(i.transform.matrix),
              s.matrix.decompose(s.position, s.rotation, s.scale));
      return (
        null !== a && (a.visible = null !== r),
        null !== s && (s.visible = null !== i),
        null !== c && (c.visible = null !== o),
        this
      );
    }
  }),
  Object.assign(WebXRManager.prototype, EventDispatcher.prototype),
  (WebGL1Renderer.prototype = Object.assign(
    Object.create(WebGLRenderer.prototype),
    { constructor: WebGL1Renderer, isWebGL1Renderer: !0 }
  ));
class FogExp2 {
  constructor(e, t) {
    Object.defineProperty(this, "isFogExp2", { value: !0 }),
      (this.name = ""),
      (this.color = new Color(e)),
      (this.density = void 0 !== t ? t : 25e-5);
  }
  clone() {
    return new FogExp2(this.color, this.density);
  }
  toJSON() {
    return {
      type: "FogExp2",
      color: this.color.getHex(),
      density: this.density
    };
  }
}
class Fog {
  constructor(e, t, n) {
    Object.defineProperty(this, "isFog", { value: !0 }),
      (this.name = ""),
      (this.color = new Color(e)),
      (this.near = void 0 !== t ? t : 1),
      (this.far = void 0 !== n ? n : 1e3);
  }
  clone() {
    return new Fog(this.color, this.near, this.far);
  }
  toJSON() {
    return {
      type: "Fog",
      color: this.color.getHex(),
      near: this.near,
      far: this.far
    };
  }
}
class Scene extends Object3D {
  constructor() {
    super(),
      Object.defineProperty(this, "isScene", { value: !0 }),
      (this.type = "Scene"),
      (this.background = null),
      (this.environment = null),
      (this.fog = null),
      (this.overrideMaterial = null),
      (this.autoUpdate = !0),
      "undefined" != typeof __THREE_DEVTOOLS__ &&
        __THREE_DEVTOOLS__.dispatchEvent(
          new CustomEvent("observe", { detail: this })
        );
  }
  copy(e, t) {
    return (
      super.copy(e, t),
      null !== e.background && (this.background = e.background.clone()),
      null !== e.environment && (this.environment = e.environment.clone()),
      null !== e.fog && (this.fog = e.fog.clone()),
      null !== e.overrideMaterial &&
        (this.overrideMaterial = e.overrideMaterial.clone()),
      (this.autoUpdate = e.autoUpdate),
      (this.matrixAutoUpdate = e.matrixAutoUpdate),
      this
    );
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return (
      null !== this.background &&
        (t.object.background = this.background.toJSON(e)),
      null !== this.environment &&
        (t.object.environment = this.environment.toJSON(e)),
      null !== this.fog && (t.object.fog = this.fog.toJSON()),
      t
    );
  }
}
function InterleavedBuffer(e, t) {
  (this.array = e),
    (this.stride = t),
    (this.count = void 0 !== e ? e.length / t : 0),
    (this.usage = StaticDrawUsage),
    (this.updateRange = { offset: 0, count: -1 }),
    (this.version = 0),
    (this.uuid = MathUtils.generateUUID());
}
Object.defineProperty(InterleavedBuffer.prototype, "needsUpdate", {
  set: function (e) {
    !0 === e && this.version++;
  }
}),
  Object.assign(InterleavedBuffer.prototype, {
    isInterleavedBuffer: !0,
    onUploadCallback: function () {},
    setUsage: function (e) {
      return (this.usage = e), this;
    },
    copy: function (e) {
      return (
        (this.array = new e.array.constructor(e.array)),
        (this.count = e.count),
        (this.stride = e.stride),
        (this.usage = e.usage),
        this
      );
    },
    copyAt: function (e, t, n) {
      (e *= this.stride), (n *= t.stride);
      for (let r = 0, i = this.stride; r < i; r++)
        this.array[e + r] = t.array[n + r];
      return this;
    },
    set: function (e, t) {
      return void 0 === t && (t = 0), this.array.set(e, t), this;
    },
    clone: function (e) {
      void 0 === e.arrayBuffers && (e.arrayBuffers = {}),
        void 0 === this.array.buffer._uuid &&
          (this.array.buffer._uuid = MathUtils.generateUUID()),
        void 0 === e.arrayBuffers[this.array.buffer._uuid] &&
          (e.arrayBuffers[this.array.buffer._uuid] =
            this.array.slice(0).buffer);
      const t = new InterleavedBuffer(
        new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),
        this.stride
      );
      return t.setUsage(this.usage), t;
    },
    onUpload: function (e) {
      return (this.onUploadCallback = e), this;
    },
    toJSON: function (e) {
      return (
        void 0 === e.arrayBuffers && (e.arrayBuffers = {}),
        void 0 === this.array.buffer._uuid &&
          (this.array.buffer._uuid = MathUtils.generateUUID()),
        void 0 === e.arrayBuffers[this.array.buffer._uuid] &&
          (e.arrayBuffers[this.array.buffer._uuid] = Array.prototype.slice.call(
            new Uint32Array(this.array.buffer)
          )),
        {
          uuid: this.uuid,
          buffer: this.array.buffer._uuid,
          type: this.array.constructor.name,
          stride: this.stride
        }
      );
    }
  });
const _vector$6 = new Vector3();
function InterleavedBufferAttribute(e, t, n, r) {
  (this.name = ""),
    (this.data = e),
    (this.itemSize = t),
    (this.offset = n),
    (this.normalized = !0 === r);
}
function SpriteMaterial(e) {
  Material.call(this),
    (this.type = "SpriteMaterial"),
    (this.color = new Color(16777215)),
    (this.map = null),
    (this.alphaMap = null),
    (this.rotation = 0),
    (this.sizeAttenuation = !0),
    (this.transparent = !0),
    this.setValues(e);
}
let _geometry;
Object.defineProperties(InterleavedBufferAttribute.prototype, {
  count: {
    get: function () {
      return this.data.count;
    }
  },
  array: {
    get: function () {
      return this.data.array;
    }
  },
  needsUpdate: {
    set: function (e) {
      this.data.needsUpdate = e;
    }
  }
}),
  Object.assign(InterleavedBufferAttribute.prototype, {
    isInterleavedBufferAttribute: !0,
    applyMatrix4: function (e) {
      for (let t = 0, n = this.data.count; t < n; t++)
        (_vector$6.x = this.getX(t)),
          (_vector$6.y = this.getY(t)),
          (_vector$6.z = this.getZ(t)),
          _vector$6.applyMatrix4(e),
          this.setXYZ(t, _vector$6.x, _vector$6.y, _vector$6.z);
      return this;
    },
    setX: function (e, t) {
      return (this.data.array[e * this.data.stride + this.offset] = t), this;
    },
    setY: function (e, t) {
      return (
        (this.data.array[e * this.data.stride + this.offset + 1] = t), this
      );
    },
    setZ: function (e, t) {
      return (
        (this.data.array[e * this.data.stride + this.offset + 2] = t), this
      );
    },
    setW: function (e, t) {
      return (
        (this.data.array[e * this.data.stride + this.offset + 3] = t), this
      );
    },
    getX: function (e) {
      return this.data.array[e * this.data.stride + this.offset];
    },
    getY: function (e) {
      return this.data.array[e * this.data.stride + this.offset + 1];
    },
    getZ: function (e) {
      return this.data.array[e * this.data.stride + this.offset + 2];
    },
    getW: function (e) {
      return this.data.array[e * this.data.stride + this.offset + 3];
    },
    setXY: function (e, t, n) {
      return (
        (e = e * this.data.stride + this.offset),
        (this.data.array[e + 0] = t),
        (this.data.array[e + 1] = n),
        this
      );
    },
    setXYZ: function (e, t, n, r) {
      return (
        (e = e * this.data.stride + this.offset),
        (this.data.array[e + 0] = t),
        (this.data.array[e + 1] = n),
        (this.data.array[e + 2] = r),
        this
      );
    },
    setXYZW: function (e, t, n, r, i) {
      return (
        (e = e * this.data.stride + this.offset),
        (this.data.array[e + 0] = t),
        (this.data.array[e + 1] = n),
        (this.data.array[e + 2] = r),
        (this.data.array[e + 3] = i),
        this
      );
    },
    clone: function (e) {
      if (void 0 === e) {
        console.log(
          "THREE.InterleavedBufferAttribute.clone(): Cloning an interlaved buffer attribute will deinterleave buffer data."
        );
        const e = [];
        for (let t = 0; t < this.count; t++) {
          const n = t * this.data.stride + this.offset;
          for (let t = 0; t < this.itemSize; t++)
            e.push(this.data.array[n + t]);
        }
        return new BufferAttribute(
          new this.array.constructor(e),
          this.itemSize,
          this.normalized
        );
      }
      return (
        void 0 === e.interleavedBuffers && (e.interleavedBuffers = {}),
        void 0 === e.interleavedBuffers[this.data.uuid] &&
          (e.interleavedBuffers[this.data.uuid] = this.data.clone(e)),
        new InterleavedBufferAttribute(
          e.interleavedBuffers[this.data.uuid],
          this.itemSize,
          this.offset,
          this.normalized
        )
      );
    },
    toJSON: function (e) {
      if (void 0 === e) {
        console.log(
          "THREE.InterleavedBufferAttribute.toJSON(): Serializing an interlaved buffer attribute will deinterleave buffer data."
        );
        const e = [];
        for (let t = 0; t < this.count; t++) {
          const n = t * this.data.stride + this.offset;
          for (let t = 0; t < this.itemSize; t++)
            e.push(this.data.array[n + t]);
        }
        return {
          itemSize: this.itemSize,
          type: this.array.constructor.name,
          array: e,
          normalized: this.normalized
        };
      }
      return (
        void 0 === e.interleavedBuffers && (e.interleavedBuffers = {}),
        void 0 === e.interleavedBuffers[this.data.uuid] &&
          (e.interleavedBuffers[this.data.uuid] = this.data.toJSON(e)),
        {
          isInterleavedBufferAttribute: !0,
          itemSize: this.itemSize,
          data: this.data.uuid,
          offset: this.offset,
          normalized: this.normalized
        }
      );
    }
  }),
  (SpriteMaterial.prototype = Object.create(Material.prototype)),
  (SpriteMaterial.prototype.constructor = SpriteMaterial),
  (SpriteMaterial.prototype.isSpriteMaterial = !0),
  (SpriteMaterial.prototype.copy = function (e) {
    return (
      Material.prototype.copy.call(this, e),
      this.color.copy(e.color),
      (this.map = e.map),
      (this.alphaMap = e.alphaMap),
      (this.rotation = e.rotation),
      (this.sizeAttenuation = e.sizeAttenuation),
      this
    );
  });
const _intersectPoint = new Vector3(),
  _worldScale = new Vector3(),
  _mvPosition = new Vector3(),
  _alignedPosition = new Vector2(),
  _rotatedPosition = new Vector2(),
  _viewWorldMatrix = new Matrix4(),
  _vA$1 = new Vector3(),
  _vB$1 = new Vector3(),
  _vC$1 = new Vector3(),
  _uvA$1 = new Vector2(),
  _uvB$1 = new Vector2(),
  _uvC$1 = new Vector2();
function Sprite(e) {
  if ((Object3D.call(this), (this.type = "Sprite"), void 0 === _geometry)) {
    _geometry = new BufferGeometry();
    const e = new InterleavedBuffer(
      new Float32Array([
        -0.5, -0.5, 0, 0, 0, 0.5, -0.5, 0, 1, 0, 0.5, 0.5, 0, 1, 1, -0.5, 0.5,
        0, 0, 1
      ]),
      5
    );
    _geometry.setIndex([0, 1, 2, 0, 2, 3]),
      _geometry.setAttribute(
        "position",
        new InterleavedBufferAttribute(e, 3, 0, !1)
      ),
      _geometry.setAttribute("uv", new InterleavedBufferAttribute(e, 2, 3, !1));
  }
  (this.geometry = _geometry),
    (this.material = void 0 !== e ? e : new SpriteMaterial()),
    (this.center = new Vector2(0.5, 0.5));
}
function transformVertex(e, t, n, r, i, o) {
  _alignedPosition.subVectors(e, n).addScalar(0.5).multiply(r),
    void 0 !== i
      ? ((_rotatedPosition.x = o * _alignedPosition.x - i * _alignedPosition.y),
        (_rotatedPosition.y = i * _alignedPosition.x + o * _alignedPosition.y))
      : _rotatedPosition.copy(_alignedPosition),
    e.copy(t),
    (e.x += _rotatedPosition.x),
    (e.y += _rotatedPosition.y),
    e.applyMatrix4(_viewWorldMatrix);
}
Sprite.prototype = Object.assign(Object.create(Object3D.prototype), {
  constructor: Sprite,
  isSprite: !0,
  raycast: function (e, t) {
    null === e.camera &&
      console.error(
        'THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'
      ),
      _worldScale.setFromMatrixScale(this.matrixWorld),
      _viewWorldMatrix.copy(e.camera.matrixWorld),
      this.modelViewMatrix.multiplyMatrices(
        e.camera.matrixWorldInverse,
        this.matrixWorld
      ),
      _mvPosition.setFromMatrixPosition(this.modelViewMatrix),
      e.camera.isPerspectiveCamera &&
        !1 === this.material.sizeAttenuation &&
        _worldScale.multiplyScalar(-_mvPosition.z);
    const n = this.material.rotation;
    let r, i;
    0 !== n && ((i = Math.cos(n)), (r = Math.sin(n)));
    const o = this.center;
    transformVertex(
      _vA$1.set(-0.5, -0.5, 0),
      _mvPosition,
      o,
      _worldScale,
      r,
      i
    ),
      transformVertex(
        _vB$1.set(0.5, -0.5, 0),
        _mvPosition,
        o,
        _worldScale,
        r,
        i
      ),
      transformVertex(
        _vC$1.set(0.5, 0.5, 0),
        _mvPosition,
        o,
        _worldScale,
        r,
        i
      ),
      _uvA$1.set(0, 0),
      _uvB$1.set(1, 0),
      _uvC$1.set(1, 1);
    let a = e.ray.intersectTriangle(_vA$1, _vB$1, _vC$1, !1, _intersectPoint);
    if (
      null === a &&
      (transformVertex(
        _vB$1.set(-0.5, 0.5, 0),
        _mvPosition,
        o,
        _worldScale,
        r,
        i
      ),
      _uvB$1.set(0, 1),
      null ===
        (a = e.ray.intersectTriangle(_vA$1, _vC$1, _vB$1, !1, _intersectPoint)))
    )
      return;
    const s = e.ray.origin.distanceTo(_intersectPoint);
    s < e.near ||
      s > e.far ||
      t.push({
        distance: s,
        point: _intersectPoint.clone(),
        uv: Triangle.getUV(
          _intersectPoint,
          _vA$1,
          _vB$1,
          _vC$1,
          _uvA$1,
          _uvB$1,
          _uvC$1,
          new Vector2()
        ),
        face: null,
        object: this
      });
  },
  copy: function (e) {
    return (
      Object3D.prototype.copy.call(this, e),
      void 0 !== e.center && this.center.copy(e.center),
      (this.material = e.material),
      this
    );
  }
});
const _v1$4 = new Vector3(),
  _v2$2 = new Vector3();
function LOD() {
  Object3D.call(this),
    (this._currentLevel = 0),
    (this.type = "LOD"),
    Object.defineProperties(this, { levels: { enumerable: !0, value: [] } }),
    (this.autoUpdate = !0);
}
function SkinnedMesh(e, t) {
  e &&
    e.isGeometry &&
    console.error(
      "THREE.SkinnedMesh no longer supports THREE.Geometry. Use THREE.BufferGeometry instead."
    ),
    Mesh.call(this, e, t),
    (this.type = "SkinnedMesh"),
    (this.bindMode = "attached"),
    (this.bindMatrix = new Matrix4()),
    (this.bindMatrixInverse = new Matrix4());
}
(LOD.prototype = Object.assign(Object.create(Object3D.prototype), {
  constructor: LOD,
  isLOD: !0,
  copy: function (e) {
    Object3D.prototype.copy.call(this, e, !1);
    const t = e.levels;
    for (let e = 0, n = t.length; e < n; e++) {
      const n = t[e];
      this.addLevel(n.object.clone(), n.distance);
    }
    return (this.autoUpdate = e.autoUpdate), this;
  },
  addLevel: function (e, t) {
    void 0 === t && (t = 0), (t = Math.abs(t));
    const n = this.levels;
    let r;
    for (r = 0; r < n.length && !(t < n[r].distance); r++);
    return n.splice(r, 0, { distance: t, object: e }), this.add(e), this;
  },
  getCurrentLevel: function () {
    return this._currentLevel;
  },
  getObjectForDistance: function (e) {
    const t = this.levels;
    if (t.length > 0) {
      let n, r;
      for (n = 1, r = t.length; n < r && !(e < t[n].distance); n++);
      return t[n - 1].object;
    }
    return null;
  },
  raycast: function (e, t) {
    if (this.levels.length > 0) {
      _v1$4.setFromMatrixPosition(this.matrixWorld);
      const n = e.ray.origin.distanceTo(_v1$4);
      this.getObjectForDistance(n).raycast(e, t);
    }
  },
  update: function (e) {
    const t = this.levels;
    if (t.length > 1) {
      _v1$4.setFromMatrixPosition(e.matrixWorld),
        _v2$2.setFromMatrixPosition(this.matrixWorld);
      const n = _v1$4.distanceTo(_v2$2) / e.zoom;
      let r, i;
      for (
        t[0].object.visible = !0, r = 1, i = t.length;
        r < i && n >= t[r].distance;
        r++
      )
        (t[r - 1].object.visible = !1), (t[r].object.visible = !0);
      for (this._currentLevel = r - 1; r < i; r++) t[r].object.visible = !1;
    }
  },
  toJSON: function (e) {
    const t = Object3D.prototype.toJSON.call(this, e);
    !1 === this.autoUpdate && (t.object.autoUpdate = !1),
      (t.object.levels = []);
    const n = this.levels;
    for (let e = 0, r = n.length; e < r; e++) {
      const r = n[e];
      t.object.levels.push({ object: r.object.uuid, distance: r.distance });
    }
    return t;
  }
})),
  (SkinnedMesh.prototype = Object.assign(Object.create(Mesh.prototype), {
    constructor: SkinnedMesh,
    isSkinnedMesh: !0,
    copy: function (e) {
      return (
        Mesh.prototype.copy.call(this, e),
        (this.bindMode = e.bindMode),
        this.bindMatrix.copy(e.bindMatrix),
        this.bindMatrixInverse.copy(e.bindMatrixInverse),
        (this.skeleton = e.skeleton),
        this
      );
    },
    bind: function (e, t) {
      (this.skeleton = e),
        void 0 === t &&
          (this.updateMatrixWorld(!0),
          this.skeleton.calculateInverses(),
          (t = this.matrixWorld)),
        this.bindMatrix.copy(t),
        this.bindMatrixInverse.getInverse(t);
    },
    pose: function () {
      this.skeleton.pose();
    },
    normalizeSkinWeights: function () {
      const e = new Vector4(),
        t = this.geometry.attributes.skinWeight;
      for (let n = 0, r = t.count; n < r; n++) {
        (e.x = t.getX(n)),
          (e.y = t.getY(n)),
          (e.z = t.getZ(n)),
          (e.w = t.getW(n));
        const r = 1 / e.manhattanLength();
        r !== 1 / 0 ? e.multiplyScalar(r) : e.set(1, 0, 0, 0),
          t.setXYZW(n, e.x, e.y, e.z, e.w);
      }
    },
    updateMatrixWorld: function (e) {
      Mesh.prototype.updateMatrixWorld.call(this, e),
        "attached" === this.bindMode
          ? this.bindMatrixInverse.getInverse(this.matrixWorld)
          : "detached" === this.bindMode
          ? this.bindMatrixInverse.getInverse(this.bindMatrix)
          : console.warn(
              "THREE.SkinnedMesh: Unrecognized bindMode: " + this.bindMode
            );
    },
    boneTransform: (function () {
      const e = new Vector3(),
        t = new Vector4(),
        n = new Vector4(),
        r = new Vector3(),
        i = new Matrix4();
      return function (o, a) {
        const s = this.skeleton,
          c = this.geometry;
        t.fromBufferAttribute(c.attributes.skinIndex, o),
          n.fromBufferAttribute(c.attributes.skinWeight, o),
          e
            .fromBufferAttribute(c.attributes.position, o)
            .applyMatrix4(this.bindMatrix),
          a.set(0, 0, 0);
        for (let o = 0; o < 4; o++) {
          const c = n.getComponent(o);
          if (0 !== c) {
            const n = t.getComponent(o);
            i.multiplyMatrices(s.bones[n].matrixWorld, s.boneInverses[n]),
              a.addScaledVector(r.copy(e).applyMatrix4(i), c);
          }
        }
        return a.applyMatrix4(this.bindMatrixInverse);
      };
    })()
  }));
const _offsetMatrix = new Matrix4(),
  _identityMatrix = new Matrix4();
function Skeleton(e, t) {
  if (
    ((e = e || []),
    (this.bones = e.slice(0)),
    (this.boneMatrices = new Float32Array(16 * this.bones.length)),
    (this.frame = -1),
    void 0 === t)
  )
    this.calculateInverses();
  else if (this.bones.length === t.length) this.boneInverses = t.slice(0);
  else {
    console.warn("THREE.Skeleton boneInverses is the wrong length."),
      (this.boneInverses = []);
    for (let e = 0, t = this.bones.length; e < t; e++)
      this.boneInverses.push(new Matrix4());
  }
}
function Bone() {
  Object3D.call(this), (this.type = "Bone");
}
Object.assign(Skeleton.prototype, {
  calculateInverses: function () {
    this.boneInverses = [];
    for (let e = 0, t = this.bones.length; e < t; e++) {
      const t = new Matrix4();
      this.bones[e] && t.getInverse(this.bones[e].matrixWorld),
        this.boneInverses.push(t);
    }
  },
  pose: function () {
    for (let e = 0, t = this.bones.length; e < t; e++) {
      const t = this.bones[e];
      t && t.matrixWorld.getInverse(this.boneInverses[e]);
    }
    for (let e = 0, t = this.bones.length; e < t; e++) {
      const t = this.bones[e];
      t &&
        (t.parent && t.parent.isBone
          ? (t.matrix.getInverse(t.parent.matrixWorld),
            t.matrix.multiply(t.matrixWorld))
          : t.matrix.copy(t.matrixWorld),
        t.matrix.decompose(t.position, t.quaternion, t.scale));
    }
  },
  update: function () {
    const e = this.bones,
      t = this.boneInverses,
      n = this.boneMatrices,
      r = this.boneTexture;
    for (let r = 0, i = e.length; r < i; r++) {
      const i = e[r] ? e[r].matrixWorld : _identityMatrix;
      _offsetMatrix.multiplyMatrices(i, t[r]), _offsetMatrix.toArray(n, 16 * r);
    }
    void 0 !== r && (r.needsUpdate = !0);
  },
  clone: function () {
    return new Skeleton(this.bones, this.boneInverses);
  },
  getBoneByName: function (e) {
    for (let t = 0, n = this.bones.length; t < n; t++) {
      const n = this.bones[t];
      if (n.name === e) return n;
    }
  },
  dispose: function () {
    this.boneTexture &&
      (this.boneTexture.dispose(), (this.boneTexture = void 0));
  }
}),
  (Bone.prototype = Object.assign(Object.create(Object3D.prototype), {
    constructor: Bone,
    isBone: !0
  }));
const _instanceLocalMatrix = new Matrix4(),
  _instanceWorldMatrix = new Matrix4(),
  _instanceIntersects = [],
  _mesh = new Mesh();
function InstancedMesh(e, t, n) {
  Mesh.call(this, e, t),
    (this.instanceMatrix = new BufferAttribute(new Float32Array(16 * n), 16)),
    (this.instanceColor = null),
    (this.count = n),
    (this.frustumCulled = !1);
}
function LineBasicMaterial(e) {
  Material.call(this),
    (this.type = "LineBasicMaterial"),
    (this.color = new Color(16777215)),
    (this.linewidth = 1),
    (this.linecap = "round"),
    (this.linejoin = "round"),
    (this.morphTargets = !1),
    this.setValues(e);
}
(InstancedMesh.prototype = Object.assign(Object.create(Mesh.prototype), {
  constructor: InstancedMesh,
  isInstancedMesh: !0,
  copy: function (e) {
    return (
      Mesh.prototype.copy.call(this, e),
      this.instanceMatrix.copy(e.instanceMatrix),
      (this.count = e.count),
      this
    );
  },
  setColorAt: function (e, t) {
    null === this.instanceColor &&
      (this.instanceColor = new BufferAttribute(
        new Float32Array(3 * this.count),
        3
      )),
      t.toArray(this.instanceColor.array, 3 * e);
  },
  getMatrixAt: function (e, t) {
    t.fromArray(this.instanceMatrix.array, 16 * e);
  },
  raycast: function (e, t) {
    const n = this.matrixWorld,
      r = this.count;
    if (
      ((_mesh.geometry = this.geometry),
      (_mesh.material = this.material),
      void 0 !== _mesh.material)
    )
      for (let i = 0; i < r; i++) {
        this.getMatrixAt(i, _instanceLocalMatrix),
          _instanceWorldMatrix.multiplyMatrices(n, _instanceLocalMatrix),
          (_mesh.matrixWorld = _instanceWorldMatrix),
          _mesh.raycast(e, _instanceIntersects);
        for (let e = 0, n = _instanceIntersects.length; e < n; e++) {
          const n = _instanceIntersects[e];
          (n.instanceId = i), (n.object = this), t.push(n);
        }
        _instanceIntersects.length = 0;
      }
  },
  setMatrixAt: function (e, t) {
    t.toArray(this.instanceMatrix.array, 16 * e);
  },
  updateMorphTargets: function () {}
})),
  (LineBasicMaterial.prototype = Object.create(Material.prototype)),
  (LineBasicMaterial.prototype.constructor = LineBasicMaterial),
  (LineBasicMaterial.prototype.isLineBasicMaterial = !0),
  (LineBasicMaterial.prototype.copy = function (e) {
    return (
      Material.prototype.copy.call(this, e),
      this.color.copy(e.color),
      (this.linewidth = e.linewidth),
      (this.linecap = e.linecap),
      (this.linejoin = e.linejoin),
      (this.morphTargets = e.morphTargets),
      this
    );
  });
const _start = new Vector3(),
  _end = new Vector3(),
  _inverseMatrix$1 = new Matrix4(),
  _ray$1 = new Ray(),
  _sphere$2 = new Sphere();
function Line(e, t, n) {
  1 === n &&
    console.error(
      "THREE.Line: parameter THREE.LinePieces no longer supported. Use THREE.LineSegments instead."
    ),
    Object3D.call(this),
    (this.type = "Line"),
    (this.geometry = void 0 !== e ? e : new BufferGeometry()),
    (this.material = void 0 !== t ? t : new LineBasicMaterial()),
    this.updateMorphTargets();
}
Line.prototype = Object.assign(Object.create(Object3D.prototype), {
  constructor: Line,
  isLine: !0,
  copy: function (e) {
    return (
      Object3D.prototype.copy.call(this, e),
      (this.material = e.material),
      (this.geometry = e.geometry),
      this
    );
  },
  computeLineDistances: function () {
    const e = this.geometry;
    if (e.isBufferGeometry)
      if (null === e.index) {
        const t = e.attributes.position,
          n = [0];
        for (let e = 1, r = t.count; e < r; e++)
          _start.fromBufferAttribute(t, e - 1),
            _end.fromBufferAttribute(t, e),
            (n[e] = n[e - 1]),
            (n[e] += _start.distanceTo(_end));
        e.setAttribute("lineDistance", new Float32BufferAttribute(n, 1));
      } else
        console.warn(
          "THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry."
        );
    else if (e.isGeometry) {
      const t = e.vertices,
        n = e.lineDistances;
      n[0] = 0;
      for (let e = 1, r = t.length; e < r; e++)
        (n[e] = n[e - 1]), (n[e] += t[e - 1].distanceTo(t[e]));
    }
    return this;
  },
  raycast: function (e, t) {
    const n = this.geometry,
      r = this.matrixWorld,
      i = e.params.Line.threshold;
    if (
      (null === n.boundingSphere && n.computeBoundingSphere(),
      _sphere$2.copy(n.boundingSphere),
      _sphere$2.applyMatrix4(r),
      (_sphere$2.radius += i),
      !1 === e.ray.intersectsSphere(_sphere$2))
    )
      return;
    _inverseMatrix$1.getInverse(r),
      _ray$1.copy(e.ray).applyMatrix4(_inverseMatrix$1);
    const o = i / ((this.scale.x + this.scale.y + this.scale.z) / 3),
      a = o * o,
      s = new Vector3(),
      c = new Vector3(),
      l = new Vector3(),
      h = new Vector3(),
      u = this.isLineSegments ? 2 : 1;
    if (n.isBufferGeometry) {
      const r = n.index,
        i = n.attributes.position;
      if (null !== r) {
        const n = r.array;
        for (let r = 0, o = n.length - 1; r < o; r += u) {
          const o = n[r],
            u = n[r + 1];
          if (
            (s.fromBufferAttribute(i, o),
            c.fromBufferAttribute(i, u),
            _ray$1.distanceSqToSegment(s, c, h, l) > a)
          )
            continue;
          h.applyMatrix4(this.matrixWorld);
          const d = e.ray.origin.distanceTo(h);
          d < e.near ||
            d > e.far ||
            t.push({
              distance: d,
              point: l.clone().applyMatrix4(this.matrixWorld),
              index: r,
              face: null,
              faceIndex: null,
              object: this
            });
        }
      } else
        for (let n = 0, r = i.count - 1; n < r; n += u) {
          if (
            (s.fromBufferAttribute(i, n),
            c.fromBufferAttribute(i, n + 1),
            _ray$1.distanceSqToSegment(s, c, h, l) > a)
          )
            continue;
          h.applyMatrix4(this.matrixWorld);
          const r = e.ray.origin.distanceTo(h);
          r < e.near ||
            r > e.far ||
            t.push({
              distance: r,
              point: l.clone().applyMatrix4(this.matrixWorld),
              index: n,
              face: null,
              faceIndex: null,
              object: this
            });
        }
    } else if (n.isGeometry) {
      const r = n.vertices,
        i = r.length;
      for (let n = 0; n < i - 1; n += u) {
        if (_ray$1.distanceSqToSegment(r[n], r[n + 1], h, l) > a) continue;
        h.applyMatrix4(this.matrixWorld);
        const i = e.ray.origin.distanceTo(h);
        i < e.near ||
          i > e.far ||
          t.push({
            distance: i,
            point: l.clone().applyMatrix4(this.matrixWorld),
            index: n,
            face: null,
            faceIndex: null,
            object: this
          });
      }
    }
  },
  updateMorphTargets: function () {
    const e = this.geometry;
    if (e.isBufferGeometry) {
      const t = e.morphAttributes,
        n = Object.keys(t);
      if (n.length > 0) {
        const e = t[n[0]];
        if (void 0 !== e) {
          (this.morphTargetInfluences = []), (this.morphTargetDictionary = {});
          for (let t = 0, n = e.length; t < n; t++) {
            const n = e[t].name || String(t);
            this.morphTargetInfluences.push(0),
              (this.morphTargetDictionary[n] = t);
          }
        }
      }
    } else {
      const t = e.morphTargets;
      void 0 !== t &&
        t.length > 0 &&
        console.error(
          "THREE.Line.updateMorphTargets() does not support THREE.Geometry. Use THREE.BufferGeometry instead."
        );
    }
  }
});
const _start$1 = new Vector3(),
  _end$1 = new Vector3();
function LineSegments(e, t) {
  Line.call(this, e, t), (this.type = "LineSegments");
}
function LineLoop(e, t) {
  Line.call(this, e, t), (this.type = "LineLoop");
}
function PointsMaterial(e) {
  Material.call(this),
    (this.type = "PointsMaterial"),
    (this.color = new Color(16777215)),
    (this.map = null),
    (this.alphaMap = null),
    (this.size = 1),
    (this.sizeAttenuation = !0),
    (this.morphTargets = !1),
    this.setValues(e);
}
(LineSegments.prototype = Object.assign(Object.create(Line.prototype), {
  constructor: LineSegments,
  isLineSegments: !0,
  computeLineDistances: function () {
    const e = this.geometry;
    if (e.isBufferGeometry)
      if (null === e.index) {
        const t = e.attributes.position,
          n = [];
        for (let e = 0, r = t.count; e < r; e += 2)
          _start$1.fromBufferAttribute(t, e),
            _end$1.fromBufferAttribute(t, e + 1),
            (n[e] = 0 === e ? 0 : n[e - 1]),
            (n[e + 1] = n[e] + _start$1.distanceTo(_end$1));
        e.setAttribute("lineDistance", new Float32BufferAttribute(n, 1));
      } else
        console.warn(
          "THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry."
        );
    else if (e.isGeometry) {
      const t = e.vertices,
        n = e.lineDistances;
      for (let e = 0, r = t.length; e < r; e += 2)
        _start$1.copy(t[e]),
          _end$1.copy(t[e + 1]),
          (n[e] = 0 === e ? 0 : n[e - 1]),
          (n[e + 1] = n[e] + _start$1.distanceTo(_end$1));
    }
    return this;
  }
})),
  (LineLoop.prototype = Object.assign(Object.create(Line.prototype), {
    constructor: LineLoop,
    isLineLoop: !0
  })),
  (PointsMaterial.prototype = Object.create(Material.prototype)),
  (PointsMaterial.prototype.constructor = PointsMaterial),
  (PointsMaterial.prototype.isPointsMaterial = !0),
  (PointsMaterial.prototype.copy = function (e) {
    return (
      Material.prototype.copy.call(this, e),
      this.color.copy(e.color),
      (this.map = e.map),
      (this.alphaMap = e.alphaMap),
      (this.size = e.size),
      (this.sizeAttenuation = e.sizeAttenuation),
      (this.morphTargets = e.morphTargets),
      this
    );
  });
const _inverseMatrix$2 = new Matrix4(),
  _ray$2 = new Ray(),
  _sphere$3 = new Sphere(),
  _position$1 = new Vector3();
function Points(e, t) {
  Object3D.call(this),
    (this.type = "Points"),
    (this.geometry = void 0 !== e ? e : new BufferGeometry()),
    (this.material = void 0 !== t ? t : new PointsMaterial()),
    this.updateMorphTargets();
}
function testPoint(e, t, n, r, i, o, a) {
  const s = _ray$2.distanceSqToPoint(e);
  if (s < n) {
    const n = new Vector3();
    _ray$2.closestPointToPoint(e, n), n.applyMatrix4(r);
    const c = i.ray.origin.distanceTo(n);
    if (c < i.near || c > i.far) return;
    o.push({
      distance: c,
      distanceToRay: Math.sqrt(s),
      point: n,
      index: t,
      face: null,
      object: a
    });
  }
}
function VideoTexture(e, t, n, r, i, o, a, s, c) {
  Texture.call(this, e, t, n, r, i, o, a, s, c),
    (this.format = void 0 !== a ? a : RGBFormat),
    (this.minFilter = void 0 !== o ? o : LinearFilter),
    (this.magFilter = void 0 !== i ? i : LinearFilter),
    (this.generateMipmaps = !1);
  const l = this;
  "requestVideoFrameCallback" in e &&
    e.requestVideoFrameCallback(function t() {
      (l.needsUpdate = !0), e.requestVideoFrameCallback(t);
    });
}
function CompressedTexture(e, t, n, r, i, o, a, s, c, l, h, u) {
  Texture.call(this, null, o, a, s, c, l, r, i, h, u),
    (this.image = { width: t, height: n }),
    (this.mipmaps = e),
    (this.flipY = !1),
    (this.generateMipmaps = !1);
}
function CanvasTexture(e, t, n, r, i, o, a, s, c) {
  Texture.call(this, e, t, n, r, i, o, a, s, c), (this.needsUpdate = !0);
}
function DepthTexture(e, t, n, r, i, o, a, s, c, l) {
  if (
    (l = void 0 !== l ? l : DepthFormat) !== DepthFormat &&
    l !== DepthStencilFormat
  )
    throw new Error(
      "DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat"
    );
  void 0 === n && l === DepthFormat && (n = UnsignedShortType),
    void 0 === n && l === DepthStencilFormat && (n = UnsignedInt248Type),
    Texture.call(this, null, r, i, o, a, s, l, n, c),
    (this.image = { width: e, height: t }),
    (this.magFilter = void 0 !== a ? a : NearestFilter),
    (this.minFilter = void 0 !== s ? s : NearestFilter),
    (this.flipY = !1),
    (this.generateMipmaps = !1);
}
(Points.prototype = Object.assign(Object.create(Object3D.prototype), {
  constructor: Points,
  isPoints: !0,
  copy: function (e) {
    return (
      Object3D.prototype.copy.call(this, e),
      (this.material = e.material),
      (this.geometry = e.geometry),
      this
    );
  },
  raycast: function (e, t) {
    const n = this.geometry,
      r = this.matrixWorld,
      i = e.params.Points.threshold;
    if (
      (null === n.boundingSphere && n.computeBoundingSphere(),
      _sphere$3.copy(n.boundingSphere),
      _sphere$3.applyMatrix4(r),
      (_sphere$3.radius += i),
      !1 === e.ray.intersectsSphere(_sphere$3))
    )
      return;
    _inverseMatrix$2.getInverse(r),
      _ray$2.copy(e.ray).applyMatrix4(_inverseMatrix$2);
    const o = i / ((this.scale.x + this.scale.y + this.scale.z) / 3),
      a = o * o;
    if (n.isBufferGeometry) {
      const i = n.index,
        o = n.attributes.position;
      if (null !== i) {
        const n = i.array;
        for (let i = 0, s = n.length; i < s; i++) {
          const s = n[i];
          _position$1.fromBufferAttribute(o, s),
            testPoint(_position$1, s, a, r, e, t, this);
        }
      } else
        for (let n = 0, i = o.count; n < i; n++)
          _position$1.fromBufferAttribute(o, n),
            testPoint(_position$1, n, a, r, e, t, this);
    } else {
      const i = n.vertices;
      for (let n = 0, o = i.length; n < o; n++)
        testPoint(i[n], n, a, r, e, t, this);
    }
  },
  updateMorphTargets: function () {
    const e = this.geometry;
    if (e.isBufferGeometry) {
      const t = e.morphAttributes,
        n = Object.keys(t);
      if (n.length > 0) {
        const e = t[n[0]];
        if (void 0 !== e) {
          (this.morphTargetInfluences = []), (this.morphTargetDictionary = {});
          for (let t = 0, n = e.length; t < n; t++) {
            const n = e[t].name || String(t);
            this.morphTargetInfluences.push(0),
              (this.morphTargetDictionary[n] = t);
          }
        }
      }
    } else {
      const t = e.morphTargets;
      void 0 !== t &&
        t.length > 0 &&
        console.error(
          "THREE.Points.updateMorphTargets() does not support THREE.Geometry. Use THREE.BufferGeometry instead."
        );
    }
  }
})),
  (VideoTexture.prototype = Object.assign(Object.create(Texture.prototype), {
    constructor: VideoTexture,
    isVideoTexture: !0,
    update: function () {
      const e = this.image;
      !1 === "requestVideoFrameCallback" in e &&
        e.readyState >= e.HAVE_CURRENT_DATA &&
        (this.needsUpdate = !0);
    }
  })),
  (CompressedTexture.prototype = Object.create(Texture.prototype)),
  (CompressedTexture.prototype.constructor = CompressedTexture),
  (CompressedTexture.prototype.isCompressedTexture = !0),
  (CanvasTexture.prototype = Object.create(Texture.prototype)),
  (CanvasTexture.prototype.constructor = CanvasTexture),
  (CanvasTexture.prototype.isCanvasTexture = !0),
  (DepthTexture.prototype = Object.create(Texture.prototype)),
  (DepthTexture.prototype.constructor = DepthTexture),
  (DepthTexture.prototype.isDepthTexture = !0);
let _geometryId = 0;
const _m1$3 = new Matrix4(),
  _obj$1 = new Object3D(),
  _offset$1 = new Vector3();
function Geometry() {
  Object.defineProperty(this, "id", { value: (_geometryId += 2) }),
    (this.uuid = MathUtils.generateUUID()),
    (this.name = ""),
    (this.type = "Geometry"),
    (this.vertices = []),
    (this.colors = []),
    (this.faces = []),
    (this.faceVertexUvs = [[]]),
    (this.morphTargets = []),
    (this.morphNormals = []),
    (this.skinWeights = []),
    (this.skinIndices = []),
    (this.lineDistances = []),
    (this.boundingBox = null),
    (this.boundingSphere = null),
    (this.elementsNeedUpdate = !1),
    (this.verticesNeedUpdate = !1),
    (this.uvsNeedUpdate = !1),
    (this.normalsNeedUpdate = !1),
    (this.colorsNeedUpdate = !1),
    (this.lineDistancesNeedUpdate = !1),
    (this.groupsNeedUpdate = !1);
}
Geometry.prototype = Object.assign(Object.create(EventDispatcher.prototype), {
  constructor: Geometry,
  isGeometry: !0,
  applyMatrix4: function (e) {
    const t = new Matrix3().getNormalMatrix(e);
    for (let t = 0, n = this.vertices.length; t < n; t++) {
      this.vertices[t].applyMatrix4(e);
    }
    for (let e = 0, n = this.faces.length; e < n; e++) {
      const n = this.faces[e];
      n.normal.applyMatrix3(t).normalize();
      for (let e = 0, r = n.vertexNormals.length; e < r; e++)
        n.vertexNormals[e].applyMatrix3(t).normalize();
    }
    return (
      null !== this.boundingBox && this.computeBoundingBox(),
      null !== this.boundingSphere && this.computeBoundingSphere(),
      (this.verticesNeedUpdate = !0),
      (this.normalsNeedUpdate = !0),
      this
    );
  },
  rotateX: function (e) {
    return _m1$3.makeRotationX(e), this.applyMatrix4(_m1$3), this;
  },
  rotateY: function (e) {
    return _m1$3.makeRotationY(e), this.applyMatrix4(_m1$3), this;
  },
  rotateZ: function (e) {
    return _m1$3.makeRotationZ(e), this.applyMatrix4(_m1$3), this;
  },
  translate: function (e, t, n) {
    return _m1$3.makeTranslation(e, t, n), this.applyMatrix4(_m1$3), this;
  },
  scale: function (e, t, n) {
    return _m1$3.makeScale(e, t, n), this.applyMatrix4(_m1$3), this;
  },
  lookAt: function (e) {
    return (
      _obj$1.lookAt(e),
      _obj$1.updateMatrix(),
      this.applyMatrix4(_obj$1.matrix),
      this
    );
  },
  fromBufferGeometry: function (e) {
    const t = this,
      n = null !== e.index ? e.index : void 0,
      r = e.attributes;
    if (void 0 === r.position)
      return (
        console.error(
          "THREE.Geometry.fromBufferGeometry(): Position attribute required for conversion."
        ),
        this
      );
    const i = r.position,
      o = r.normal,
      a = r.color,
      s = r.uv,
      c = r.uv2;
    void 0 !== c && (this.faceVertexUvs[1] = []);
    for (let e = 0; e < i.count; e++)
      t.vertices.push(new Vector3().fromBufferAttribute(i, e)),
        void 0 !== a && t.colors.push(new Color().fromBufferAttribute(a, e));
    function l(e, n, r, i) {
      const l =
          void 0 === a
            ? []
            : [t.colors[e].clone(), t.colors[n].clone(), t.colors[r].clone()],
        h =
          void 0 === o
            ? []
            : [
                new Vector3().fromBufferAttribute(o, e),
                new Vector3().fromBufferAttribute(o, n),
                new Vector3().fromBufferAttribute(o, r)
              ],
        u = new Face3(e, n, r, h, l, i);
      t.faces.push(u),
        void 0 !== s &&
          t.faceVertexUvs[0].push([
            new Vector2().fromBufferAttribute(s, e),
            new Vector2().fromBufferAttribute(s, n),
            new Vector2().fromBufferAttribute(s, r)
          ]),
        void 0 !== c &&
          t.faceVertexUvs[1].push([
            new Vector2().fromBufferAttribute(c, e),
            new Vector2().fromBufferAttribute(c, n),
            new Vector2().fromBufferAttribute(c, r)
          ]);
    }
    const h = e.groups;
    if (h.length > 0)
      for (let e = 0; e < h.length; e++) {
        const t = h[e],
          r = t.start;
        for (let e = r, i = r + t.count; e < i; e += 3)
          void 0 !== n
            ? l(n.getX(e), n.getX(e + 1), n.getX(e + 2), t.materialIndex)
            : l(e, e + 1, e + 2, t.materialIndex);
      }
    else if (void 0 !== n)
      for (let e = 0; e < n.count; e += 3)
        l(n.getX(e), n.getX(e + 1), n.getX(e + 2));
    else for (let e = 0; e < i.count; e += 3) l(e, e + 1, e + 2);
    return (
      this.computeFaceNormals(),
      null !== e.boundingBox && (this.boundingBox = e.boundingBox.clone()),
      null !== e.boundingSphere &&
        (this.boundingSphere = e.boundingSphere.clone()),
      this
    );
  },
  center: function () {
    return (
      this.computeBoundingBox(),
      this.boundingBox.getCenter(_offset$1).negate(),
      this.translate(_offset$1.x, _offset$1.y, _offset$1.z),
      this
    );
  },
  normalize: function () {
    this.computeBoundingSphere();
    const e = this.boundingSphere.center,
      t = this.boundingSphere.radius,
      n = 0 === t ? 1 : 1 / t,
      r = new Matrix4();
    return (
      r.set(
        n,
        0,
        0,
        -n * e.x,
        0,
        n,
        0,
        -n * e.y,
        0,
        0,
        n,
        -n * e.z,
        0,
        0,
        0,
        1
      ),
      this.applyMatrix4(r),
      this
    );
  },
  computeFaceNormals: function () {
    const e = new Vector3(),
      t = new Vector3();
    for (let n = 0, r = this.faces.length; n < r; n++) {
      const r = this.faces[n],
        i = this.vertices[r.a],
        o = this.vertices[r.b],
        a = this.vertices[r.c];
      e.subVectors(a, o),
        t.subVectors(i, o),
        e.cross(t),
        e.normalize(),
        r.normal.copy(e);
    }
  },
  computeVertexNormals: function (e) {
    void 0 === e && (e = !0);
    const t = new Array(this.vertices.length);
    for (let e = 0, n = this.vertices.length; e < n; e++) t[e] = new Vector3();
    if (e) {
      const e = new Vector3(),
        n = new Vector3();
      for (let r = 0, i = this.faces.length; r < i; r++) {
        const i = this.faces[r],
          o = this.vertices[i.a],
          a = this.vertices[i.b],
          s = this.vertices[i.c];
        e.subVectors(s, a),
          n.subVectors(o, a),
          e.cross(n),
          t[i.a].add(e),
          t[i.b].add(e),
          t[i.c].add(e);
      }
    } else {
      this.computeFaceNormals();
      for (let e = 0, n = this.faces.length; e < n; e++) {
        const n = this.faces[e];
        t[n.a].add(n.normal), t[n.b].add(n.normal), t[n.c].add(n.normal);
      }
    }
    for (let e = 0, n = this.vertices.length; e < n; e++) t[e].normalize();
    for (let e = 0, n = this.faces.length; e < n; e++) {
      const n = this.faces[e],
        r = n.vertexNormals;
      3 === r.length
        ? (r[0].copy(t[n.a]), r[1].copy(t[n.b]), r[2].copy(t[n.c]))
        : ((r[0] = t[n.a].clone()),
          (r[1] = t[n.b].clone()),
          (r[2] = t[n.c].clone()));
    }
    this.faces.length > 0 && (this.normalsNeedUpdate = !0);
  },
  computeFlatVertexNormals: function () {
    this.computeFaceNormals();
    for (let e = 0, t = this.faces.length; e < t; e++) {
      const t = this.faces[e],
        n = t.vertexNormals;
      3 === n.length
        ? (n[0].copy(t.normal), n[1].copy(t.normal), n[2].copy(t.normal))
        : ((n[0] = t.normal.clone()),
          (n[1] = t.normal.clone()),
          (n[2] = t.normal.clone()));
    }
    this.faces.length > 0 && (this.normalsNeedUpdate = !0);
  },
  computeMorphNormals: function () {
    for (let e = 0, t = this.faces.length; e < t; e++) {
      const t = this.faces[e];
      t.__originalFaceNormal
        ? t.__originalFaceNormal.copy(t.normal)
        : (t.__originalFaceNormal = t.normal.clone()),
        t.__originalVertexNormals || (t.__originalVertexNormals = []);
      for (let e = 0, n = t.vertexNormals.length; e < n; e++)
        t.__originalVertexNormals[e]
          ? t.__originalVertexNormals[e].copy(t.vertexNormals[e])
          : (t.__originalVertexNormals[e] = t.vertexNormals[e].clone());
    }
    const e = new Geometry();
    e.faces = this.faces;
    for (let t = 0, n = this.morphTargets.length; t < n; t++) {
      if (!this.morphNormals[t]) {
        (this.morphNormals[t] = {}),
          (this.morphNormals[t].faceNormals = []),
          (this.morphNormals[t].vertexNormals = []);
        const e = this.morphNormals[t].faceNormals,
          n = this.morphNormals[t].vertexNormals;
        for (let t = 0, r = this.faces.length; t < r; t++) {
          const t = new Vector3(),
            r = { a: new Vector3(), b: new Vector3(), c: new Vector3() };
          e.push(t), n.push(r);
        }
      }
      const n = this.morphNormals[t];
      (e.vertices = this.morphTargets[t].vertices),
        e.computeFaceNormals(),
        e.computeVertexNormals();
      for (let e = 0, t = this.faces.length; e < t; e++) {
        const t = this.faces[e],
          r = n.faceNormals[e],
          i = n.vertexNormals[e];
        r.copy(t.normal),
          i.a.copy(t.vertexNormals[0]),
          i.b.copy(t.vertexNormals[1]),
          i.c.copy(t.vertexNormals[2]);
      }
    }
    for (let e = 0, t = this.faces.length; e < t; e++) {
      const t = this.faces[e];
      (t.normal = t.__originalFaceNormal),
        (t.vertexNormals = t.__originalVertexNormals);
    }
  },
  computeBoundingBox: function () {
    null === this.boundingBox && (this.boundingBox = new Box3()),
      this.boundingBox.setFromPoints(this.vertices);
  },
  computeBoundingSphere: function () {
    null === this.boundingSphere && (this.boundingSphere = new Sphere()),
      this.boundingSphere.setFromPoints(this.vertices);
  },
  merge: function (e, t, n) {
    if (!e || !e.isGeometry)
      return void console.error(
        "THREE.Geometry.merge(): geometry not an instance of THREE.Geometry.",
        e
      );
    let r;
    const i = this.vertices.length,
      o = this.vertices,
      a = e.vertices,
      s = this.faces,
      c = e.faces,
      l = this.colors,
      h = e.colors;
    void 0 === n && (n = 0),
      void 0 !== t && (r = new Matrix3().getNormalMatrix(t));
    for (let e = 0, n = a.length; e < n; e++) {
      const n = a[e].clone();
      void 0 !== t && n.applyMatrix4(t), o.push(n);
    }
    for (let e = 0, t = h.length; e < t; e++) l.push(h[e].clone());
    for (let e = 0, t = c.length; e < t; e++) {
      const t = c[e];
      let o, a;
      const l = t.vertexNormals,
        h = t.vertexColors,
        u = new Face3(t.a + i, t.b + i, t.c + i);
      u.normal.copy(t.normal),
        void 0 !== r && u.normal.applyMatrix3(r).normalize();
      for (let e = 0, t = l.length; e < t; e++)
        (o = l[e].clone()),
          void 0 !== r && o.applyMatrix3(r).normalize(),
          u.vertexNormals.push(o);
      u.color.copy(t.color);
      for (let e = 0, t = h.length; e < t; e++)
        (a = h[e]), u.vertexColors.push(a.clone());
      (u.materialIndex = t.materialIndex + n), s.push(u);
    }
    for (let t = 0, n = e.faceVertexUvs.length; t < n; t++) {
      const n = e.faceVertexUvs[t];
      void 0 === this.faceVertexUvs[t] && (this.faceVertexUvs[t] = []);
      for (let e = 0, r = n.length; e < r; e++) {
        const r = n[e],
          i = [];
        for (let e = 0, t = r.length; e < t; e++) i.push(r[e].clone());
        this.faceVertexUvs[t].push(i);
      }
    }
  },
  mergeMesh: function (e) {
    e && e.isMesh
      ? (e.matrixAutoUpdate && e.updateMatrix(),
        this.merge(e.geometry, e.matrix))
      : console.error(
          "THREE.Geometry.mergeMesh(): mesh not an instance of THREE.Mesh.",
          e
        );
  },
  mergeVertices: function () {
    const e = {},
      t = [],
      n = [],
      r = Math.pow(10, 4);
    for (let i = 0, o = this.vertices.length; i < o; i++) {
      const o = this.vertices[i],
        a =
          Math.round(o.x * r) +
          "_" +
          Math.round(o.y * r) +
          "_" +
          Math.round(o.z * r);
      void 0 === e[a]
        ? ((e[a] = i), t.push(this.vertices[i]), (n[i] = t.length - 1))
        : (n[i] = n[e[a]]);
    }
    const i = [];
    for (let e = 0, t = this.faces.length; e < t; e++) {
      const t = this.faces[e];
      (t.a = n[t.a]), (t.b = n[t.b]), (t.c = n[t.c]);
      const r = [t.a, t.b, t.c];
      for (let t = 0; t < 3; t++)
        if (r[t] === r[(t + 1) % 3]) {
          i.push(e);
          break;
        }
    }
    for (let e = i.length - 1; e >= 0; e--) {
      const t = i[e];
      this.faces.splice(t, 1);
      for (let e = 0, n = this.faceVertexUvs.length; e < n; e++)
        this.faceVertexUvs[e].splice(t, 1);
    }
    const o = this.vertices.length - t.length;
    return (this.vertices = t), o;
  },
  setFromPoints: function (e) {
    this.vertices = [];
    for (let t = 0, n = e.length; t < n; t++) {
      const n = e[t];
      this.vertices.push(new Vector3(n.x, n.y, n.z || 0));
    }
    return this;
  },
  sortFacesByMaterialIndex: function () {
    const e = this.faces,
      t = e.length;
    for (let n = 0; n < t; n++) e[n]._id = n;
    e.sort(function (e, t) {
      return e.materialIndex - t.materialIndex;
    });
    const n = this.faceVertexUvs[0],
      r = this.faceVertexUvs[1];
    let i, o;
    n && n.length === t && (i = []), r && r.length === t && (o = []);
    for (let a = 0; a < t; a++) {
      const t = e[a]._id;
      i && i.push(n[t]), o && o.push(r[t]);
    }
    i && (this.faceVertexUvs[0] = i), o && (this.faceVertexUvs[1] = o);
  },
  toJSON: function () {
    const e = {
      metadata: { version: 4.5, type: "Geometry", generator: "Geometry.toJSON" }
    };
    if (
      ((e.uuid = this.uuid),
      (e.type = this.type),
      "" !== this.name && (e.name = this.name),
      void 0 !== this.parameters)
    ) {
      const t = this.parameters;
      for (const n in t) void 0 !== t[n] && (e[n] = t[n]);
      return e;
    }
    const t = [];
    for (let e = 0; e < this.vertices.length; e++) {
      const n = this.vertices[e];
      t.push(n.x, n.y, n.z);
    }
    const n = [],
      r = [],
      i = {},
      o = [],
      a = {},
      s = [],
      c = {};
    for (let e = 0; e < this.faces.length; e++) {
      const t = this.faces[e],
        r = !0,
        i = !1,
        o = void 0 !== this.faceVertexUvs[0][e],
        a = t.normal.length() > 0,
        s = t.vertexNormals.length > 0,
        c = 1 !== t.color.r || 1 !== t.color.g || 1 !== t.color.b,
        p = t.vertexColors.length > 0;
      let m = 0;
      if (
        ((m = l(m, 0, 0)),
        (m = l(m, 1, r)),
        (m = l(m, 2, i)),
        (m = l(m, 3, o)),
        (m = l(m, 4, a)),
        (m = l(m, 5, s)),
        (m = l(m, 6, c)),
        (m = l(m, 7, p)),
        n.push(m),
        n.push(t.a, t.b, t.c),
        n.push(t.materialIndex),
        o)
      ) {
        const t = this.faceVertexUvs[0][e];
        n.push(d(t[0]), d(t[1]), d(t[2]));
      }
      if ((a && n.push(h(t.normal)), s)) {
        const e = t.vertexNormals;
        n.push(h(e[0]), h(e[1]), h(e[2]));
      }
      if ((c && n.push(u(t.color)), p)) {
        const e = t.vertexColors;
        n.push(u(e[0]), u(e[1]), u(e[2]));
      }
    }
    function l(e, t, n) {
      return n ? e | (1 << t) : e & ~(1 << t);
    }
    function h(e) {
      const t = e.x.toString() + e.y.toString() + e.z.toString();
      return void 0 !== i[t]
        ? i[t]
        : ((i[t] = r.length / 3), r.push(e.x, e.y, e.z), i[t]);
    }
    function u(e) {
      const t = e.r.toString() + e.g.toString() + e.b.toString();
      return void 0 !== a[t]
        ? a[t]
        : ((a[t] = o.length), o.push(e.getHex()), a[t]);
    }
    function d(e) {
      const t = e.x.toString() + e.y.toString();
      return void 0 !== c[t]
        ? c[t]
        : ((c[t] = s.length / 2), s.push(e.x, e.y), c[t]);
    }
    return (
      (e.data = {}),
      (e.data.vertices = t),
      (e.data.normals = r),
      o.length > 0 && (e.data.colors = o),
      s.length > 0 && (e.data.uvs = [s]),
      (e.data.faces = n),
      e
    );
  },
  clone: function () {
    return new Geometry().copy(this);
  },
  copy: function (e) {
    (this.vertices = []),
      (this.colors = []),
      (this.faces = []),
      (this.faceVertexUvs = [[]]),
      (this.morphTargets = []),
      (this.morphNormals = []),
      (this.skinWeights = []),
      (this.skinIndices = []),
      (this.lineDistances = []),
      (this.boundingBox = null),
      (this.boundingSphere = null),
      (this.name = e.name);
    const t = e.vertices;
    for (let e = 0, n = t.length; e < n; e++) this.vertices.push(t[e].clone());
    const n = e.colors;
    for (let e = 0, t = n.length; e < t; e++) this.colors.push(n[e].clone());
    const r = e.faces;
    for (let e = 0, t = r.length; e < t; e++) this.faces.push(r[e].clone());
    for (let t = 0, n = e.faceVertexUvs.length; t < n; t++) {
      const n = e.faceVertexUvs[t];
      void 0 === this.faceVertexUvs[t] && (this.faceVertexUvs[t] = []);
      for (let e = 0, r = n.length; e < r; e++) {
        const r = n[e],
          i = [];
        for (let e = 0, t = r.length; e < t; e++) {
          const t = r[e];
          i.push(t.clone());
        }
        this.faceVertexUvs[t].push(i);
      }
    }
    const i = e.morphTargets;
    for (let e = 0, t = i.length; e < t; e++) {
      const t = {};
      if (((t.name = i[e].name), void 0 !== i[e].vertices)) {
        t.vertices = [];
        for (let n = 0, r = i[e].vertices.length; n < r; n++)
          t.vertices.push(i[e].vertices[n].clone());
      }
      if (void 0 !== i[e].normals) {
        t.normals = [];
        for (let n = 0, r = i[e].normals.length; n < r; n++)
          t.normals.push(i[e].normals[n].clone());
      }
      this.morphTargets.push(t);
    }
    const o = e.morphNormals;
    for (let e = 0, t = o.length; e < t; e++) {
      const t = {};
      if (void 0 !== o[e].vertexNormals) {
        t.vertexNormals = [];
        for (let n = 0, r = o[e].vertexNormals.length; n < r; n++) {
          const r = o[e].vertexNormals[n],
            i = {};
          (i.a = r.a.clone()),
            (i.b = r.b.clone()),
            (i.c = r.c.clone()),
            t.vertexNormals.push(i);
        }
      }
      if (void 0 !== o[e].faceNormals) {
        t.faceNormals = [];
        for (let n = 0, r = o[e].faceNormals.length; n < r; n++)
          t.faceNormals.push(o[e].faceNormals[n].clone());
      }
      this.morphNormals.push(t);
    }
    const a = e.skinWeights;
    for (let e = 0, t = a.length; e < t; e++)
      this.skinWeights.push(a[e].clone());
    const s = e.skinIndices;
    for (let e = 0, t = s.length; e < t; e++)
      this.skinIndices.push(s[e].clone());
    const c = e.lineDistances;
    for (let e = 0, t = c.length; e < t; e++) this.lineDistances.push(c[e]);
    const l = e.boundingBox;
    null !== l && (this.boundingBox = l.clone());
    const h = e.boundingSphere;
    return (
      null !== h && (this.boundingSphere = h.clone()),
      (this.elementsNeedUpdate = e.elementsNeedUpdate),
      (this.verticesNeedUpdate = e.verticesNeedUpdate),
      (this.uvsNeedUpdate = e.uvsNeedUpdate),
      (this.normalsNeedUpdate = e.normalsNeedUpdate),
      (this.colorsNeedUpdate = e.colorsNeedUpdate),
      (this.lineDistancesNeedUpdate = e.lineDistancesNeedUpdate),
      (this.groupsNeedUpdate = e.groupsNeedUpdate),
      this
    );
  },
  dispose: function () {
    this.dispatchEvent({ type: "dispose" });
  }
});
class BoxGeometry extends Geometry {
  constructor(e, t, n, r, i, o) {
    super(),
      (this.type = "BoxGeometry"),
      (this.parameters = {
        width: e,
        height: t,
        depth: n,
        widthSegments: r,
        heightSegments: i,
        depthSegments: o
      }),
      this.fromBufferGeometry(new BoxBufferGeometry(e, t, n, r, i, o)),
      this.mergeVertices();
  }
}
class CircleBufferGeometry extends BufferGeometry {
  constructor(e, t, n, r) {
    super(),
      (this.type = "CircleBufferGeometry"),
      (this.parameters = {
        radius: e,
        segments: t,
        thetaStart: n,
        thetaLength: r
      }),
      (e = e || 1),
      (t = void 0 !== t ? Math.max(3, t) : 8),
      (n = void 0 !== n ? n : 0),
      (r = void 0 !== r ? r : 2 * Math.PI);
    const i = [],
      o = [],
      a = [],
      s = [],
      c = new Vector3(),
      l = new Vector2();
    o.push(0, 0, 0), a.push(0, 0, 1), s.push(0.5, 0.5);
    for (let i = 0, h = 3; i <= t; i++, h += 3) {
      const u = n + (i / t) * r;
      (c.x = e * Math.cos(u)),
        (c.y = e * Math.sin(u)),
        o.push(c.x, c.y, c.z),
        a.push(0, 0, 1),
        (l.x = (o[h] / e + 1) / 2),
        (l.y = (o[h + 1] / e + 1) / 2),
        s.push(l.x, l.y);
    }
    for (let e = 1; e <= t; e++) i.push(e, e + 1, 0);
    this.setIndex(i),
      this.setAttribute("position", new Float32BufferAttribute(o, 3)),
      this.setAttribute("normal", new Float32BufferAttribute(a, 3)),
      this.setAttribute("uv", new Float32BufferAttribute(s, 2));
  }
}
class CircleGeometry extends Geometry {
  constructor(e, t, n, r) {
    super(),
      (this.type = "CircleGeometry"),
      (this.parameters = {
        radius: e,
        segments: t,
        thetaStart: n,
        thetaLength: r
      }),
      this.fromBufferGeometry(new CircleBufferGeometry(e, t, n, r)),
      this.mergeVertices();
  }
}
class CylinderBufferGeometry extends BufferGeometry {
  constructor(e, t, n, r, i, o, a, s) {
    super(),
      (this.type = "CylinderBufferGeometry"),
      (this.parameters = {
        radiusTop: e,
        radiusBottom: t,
        height: n,
        radialSegments: r,
        heightSegments: i,
        openEnded: o,
        thetaStart: a,
        thetaLength: s
      });
    const c = this;
    (e = void 0 !== e ? e : 1),
      (t = void 0 !== t ? t : 1),
      (n = n || 1),
      (r = Math.floor(r) || 8),
      (i = Math.floor(i) || 1),
      (o = void 0 !== o && o),
      (a = void 0 !== a ? a : 0),
      (s = void 0 !== s ? s : 2 * Math.PI);
    const l = [],
      h = [],
      u = [],
      d = [];
    let p = 0;
    const m = [],
      f = n / 2;
    let g = 0;
    function v(n) {
      const i = p,
        o = new Vector2(),
        m = new Vector3();
      let v = 0;
      const y = !0 === n ? e : t,
        _ = !0 === n ? 1 : -1;
      for (let e = 1; e <= r; e++)
        h.push(0, f * _, 0), u.push(0, _, 0), d.push(0.5, 0.5), p++;
      const x = p;
      for (let e = 0; e <= r; e++) {
        const t = (e / r) * s + a,
          n = Math.cos(t),
          i = Math.sin(t);
        (m.x = y * i),
          (m.y = f * _),
          (m.z = y * n),
          h.push(m.x, m.y, m.z),
          u.push(0, _, 0),
          (o.x = 0.5 * n + 0.5),
          (o.y = 0.5 * i * _ + 0.5),
          d.push(o.x, o.y),
          p++;
      }
      for (let e = 0; e < r; e++) {
        const t = i + e,
          r = x + e;
        !0 === n ? l.push(r, r + 1, t) : l.push(r + 1, r, t), (v += 3);
      }
      c.addGroup(g, v, !0 === n ? 1 : 2), (g += v);
    }
    !(function () {
      const o = new Vector3(),
        v = new Vector3();
      let y = 0;
      const _ = (t - e) / n;
      for (let c = 0; c <= i; c++) {
        const l = [],
          g = c / i,
          y = g * (t - e) + e;
        for (let e = 0; e <= r; e++) {
          const t = e / r,
            i = t * s + a,
            c = Math.sin(i),
            m = Math.cos(i);
          (v.x = y * c),
            (v.y = -g * n + f),
            (v.z = y * m),
            h.push(v.x, v.y, v.z),
            o.set(c, _, m).normalize(),
            u.push(o.x, o.y, o.z),
            d.push(t, 1 - g),
            l.push(p++);
        }
        m.push(l);
      }
      for (let e = 0; e < r; e++)
        for (let t = 0; t < i; t++) {
          const n = m[t][e],
            r = m[t + 1][e],
            i = m[t + 1][e + 1],
            o = m[t][e + 1];
          l.push(n, r, o), l.push(r, i, o), (y += 6);
        }
      c.addGroup(g, y, 0), (g += y);
    })(),
      !1 === o && (e > 0 && v(!0), t > 0 && v(!1)),
      this.setIndex(l),
      this.setAttribute("position", new Float32BufferAttribute(h, 3)),
      this.setAttribute("normal", new Float32BufferAttribute(u, 3)),
      this.setAttribute("uv", new Float32BufferAttribute(d, 2));
  }
}
class CylinderGeometry extends Geometry {
  constructor(e, t, n, r, i, o, a, s) {
    super(),
      (this.type = "CylinderGeometry"),
      (this.parameters = {
        radiusTop: e,
        radiusBottom: t,
        height: n,
        radialSegments: r,
        heightSegments: i,
        openEnded: o,
        thetaStart: a,
        thetaLength: s
      }),
      this.fromBufferGeometry(
        new CylinderBufferGeometry(e, t, n, r, i, o, a, s)
      ),
      this.mergeVertices();
  }
}
class ConeGeometry extends CylinderGeometry {
  constructor(e, t, n, r, i, o, a) {
    super(0, e, t, n, r, i, o, a),
      (this.type = "ConeGeometry"),
      (this.parameters = {
        radius: e,
        height: t,
        radialSegments: n,
        heightSegments: r,
        openEnded: i,
        thetaStart: o,
        thetaLength: a
      });
  }
}
class ConeBufferGeometry extends CylinderBufferGeometry {
  constructor(e, t, n, r, i, o, a) {
    super(0, e, t, n, r, i, o, a),
      (this.type = "ConeBufferGeometry"),
      (this.parameters = {
        radius: e,
        height: t,
        radialSegments: n,
        heightSegments: r,
        openEnded: i,
        thetaStart: o,
        thetaLength: a
      });
  }
}
class PolyhedronBufferGeometry extends BufferGeometry {
  constructor(e, t, n, r) {
    super(),
      (this.type = "PolyhedronBufferGeometry"),
      (this.parameters = { vertices: e, indices: t, radius: n, detail: r }),
      (n = n || 1);
    const i = [],
      o = [];
    function a(e, t, n, r) {
      const i = r + 1,
        o = [];
      for (let r = 0; r <= i; r++) {
        o[r] = [];
        const a = e.clone().lerp(n, r / i),
          s = t.clone().lerp(n, r / i),
          c = i - r;
        for (let e = 0; e <= c; e++)
          o[r][e] = 0 === e && r === i ? a : a.clone().lerp(s, e / c);
      }
      for (let e = 0; e < i; e++)
        for (let t = 0; t < 2 * (i - e) - 1; t++) {
          const n = Math.floor(t / 2);
          t % 2 == 0
            ? (s(o[e][n + 1]), s(o[e + 1][n]), s(o[e][n]))
            : (s(o[e][n + 1]), s(o[e + 1][n + 1]), s(o[e + 1][n]));
        }
    }
    function s(e) {
      i.push(e.x, e.y, e.z);
    }
    function c(t, n) {
      const r = 3 * t;
      (n.x = e[r + 0]), (n.y = e[r + 1]), (n.z = e[r + 2]);
    }
    function l(e, t, n, r) {
      r < 0 && 1 === e.x && (o[t] = e.x - 1),
        0 === n.x && 0 === n.z && (o[t] = r / 2 / Math.PI + 0.5);
    }
    function h(e) {
      return Math.atan2(e.z, -e.x);
    }
    !(function (e) {
      const n = new Vector3(),
        r = new Vector3(),
        i = new Vector3();
      for (let o = 0; o < t.length; o += 3)
        c(t[o + 0], n), c(t[o + 1], r), c(t[o + 2], i), a(n, r, i, e);
    })((r = r || 0)),
      (function (e) {
        const t = new Vector3();
        for (let n = 0; n < i.length; n += 3)
          (t.x = i[n + 0]),
            (t.y = i[n + 1]),
            (t.z = i[n + 2]),
            t.normalize().multiplyScalar(e),
            (i[n + 0] = t.x),
            (i[n + 1] = t.y),
            (i[n + 2] = t.z);
      })(n),
      (function () {
        const e = new Vector3();
        for (let n = 0; n < i.length; n += 3) {
          (e.x = i[n + 0]), (e.y = i[n + 1]), (e.z = i[n + 2]);
          const r = h(e) / 2 / Math.PI + 0.5,
            a =
              ((t = e),
              Math.atan2(-t.y, Math.sqrt(t.x * t.x + t.z * t.z)) / Math.PI +
                0.5);
          o.push(r, 1 - a);
        }
        var t;
        (function () {
          const e = new Vector3(),
            t = new Vector3(),
            n = new Vector3(),
            r = new Vector3(),
            a = new Vector2(),
            s = new Vector2(),
            c = new Vector2();
          for (let u = 0, d = 0; u < i.length; u += 9, d += 6) {
            e.set(i[u + 0], i[u + 1], i[u + 2]),
              t.set(i[u + 3], i[u + 4], i[u + 5]),
              n.set(i[u + 6], i[u + 7], i[u + 8]),
              a.set(o[d + 0], o[d + 1]),
              s.set(o[d + 2], o[d + 3]),
              c.set(o[d + 4], o[d + 5]),
              r.copy(e).add(t).add(n).divideScalar(3);
            const p = h(r);
            l(a, d + 0, e, p), l(s, d + 2, t, p), l(c, d + 4, n, p);
          }
        })(),
          (function () {
            for (let e = 0; e < o.length; e += 6) {
              const t = o[e + 0],
                n = o[e + 2],
                r = o[e + 4],
                i = Math.max(t, n, r),
                a = Math.min(t, n, r);
              i > 0.9 &&
                a < 0.1 &&
                (t < 0.2 && (o[e + 0] += 1),
                n < 0.2 && (o[e + 2] += 1),
                r < 0.2 && (o[e + 4] += 1));
            }
          })();
      })(),
      this.setAttribute("position", new Float32BufferAttribute(i, 3)),
      this.setAttribute("normal", new Float32BufferAttribute(i.slice(), 3)),
      this.setAttribute("uv", new Float32BufferAttribute(o, 2)),
      0 === r ? this.computeVertexNormals() : this.normalizeNormals();
  }
}
class DodecahedronBufferGeometry extends PolyhedronBufferGeometry {
  constructor(e, t) {
    const n = (1 + Math.sqrt(5)) / 2,
      r = 1 / n;
    super(
      [
        -1,
        -1,
        -1,
        -1,
        -1,
        1,
        -1,
        1,
        -1,
        -1,
        1,
        1,
        1,
        -1,
        -1,
        1,
        -1,
        1,
        1,
        1,
        -1,
        1,
        1,
        1,
        0,
        -r,
        -n,
        0,
        -r,
        n,
        0,
        r,
        -n,
        0,
        r,
        n,
        -r,
        -n,
        0,
        -r,
        n,
        0,
        r,
        -n,
        0,
        r,
        n,
        0,
        -n,
        0,
        -r,
        n,
        0,
        -r,
        -n,
        0,
        r,
        n,
        0,
        r
      ],
      [
        3, 11, 7, 3, 7, 15, 3, 15, 13, 7, 19, 17, 7, 17, 6, 7, 6, 15, 17, 4, 8,
        17, 8, 10, 17, 10, 6, 8, 0, 16, 8, 16, 2, 8, 2, 10, 0, 12, 1, 0, 1, 18,
        0, 18, 16, 6, 10, 2, 6, 2, 13, 6, 13, 15, 2, 16, 18, 2, 18, 3, 2, 3, 13,
        18, 1, 9, 18, 9, 11, 18, 11, 3, 4, 14, 12, 4, 12, 0, 4, 0, 8, 11, 9, 5,
        11, 5, 19, 11, 19, 7, 19, 5, 14, 19, 14, 4, 19, 4, 17, 1, 12, 14, 1, 14,
        5, 1, 5, 9
      ],
      e,
      t
    ),
      (this.type = "DodecahedronBufferGeometry"),
      (this.parameters = { radius: e, detail: t });
  }
}
class DodecahedronGeometry extends Geometry {
  constructor(e, t) {
    super(),
      (this.type = "DodecahedronGeometry"),
      (this.parameters = { radius: e, detail: t }),
      this.fromBufferGeometry(new DodecahedronBufferGeometry(e, t)),
      this.mergeVertices();
  }
}
const _v0$2 = new Vector3(),
  _v1$5 = new Vector3(),
  _normal$1 = new Vector3(),
  _triangle = new Triangle();
class EdgesGeometry extends BufferGeometry {
  constructor(e, t) {
    super(),
      (this.type = "EdgesGeometry"),
      (this.parameters = { thresholdAngle: t }),
      (t = void 0 !== t ? t : 1),
      e.isGeometry && (e = new BufferGeometry().fromGeometry(e));
    const n = Math.pow(10, 4),
      r = Math.cos(MathUtils.DEG2RAD * t),
      i = e.getIndex(),
      o = e.getAttribute("position"),
      a = i ? i.count : o.count,
      s = [0, 0, 0],
      c = ["a", "b", "c"],
      l = new Array(3),
      h = {},
      u = [];
    for (let e = 0; e < a; e += 3) {
      i
        ? ((s[0] = i.getX(e)), (s[1] = i.getX(e + 1)), (s[2] = i.getX(e + 2)))
        : ((s[0] = e), (s[1] = e + 1), (s[2] = e + 2));
      const { a: t, b: a, c: d } = _triangle;
      if (
        (t.fromBufferAttribute(o, s[0]),
        a.fromBufferAttribute(o, s[1]),
        d.fromBufferAttribute(o, s[2]),
        _triangle.getNormal(_normal$1),
        (l[0] = `${Math.round(t.x * n)},${Math.round(t.y * n)},${Math.round(
          t.z * n
        )}`),
        (l[1] = `${Math.round(a.x * n)},${Math.round(a.y * n)},${Math.round(
          a.z * n
        )}`),
        (l[2] = `${Math.round(d.x * n)},${Math.round(d.y * n)},${Math.round(
          d.z * n
        )}`),
        l[0] !== l[1] && l[1] !== l[2] && l[2] !== l[0])
      )
        for (let e = 0; e < 3; e++) {
          const t = (e + 1) % 3,
            n = l[e],
            i = l[t],
            o = _triangle[c[e]],
            a = _triangle[c[t]],
            d = `${n}_${i}`,
            p = `${i}_${n}`;
          p in h && h[p]
            ? (_normal$1.dot(h[p].normal) <= r &&
                (u.push(o.x, o.y, o.z), u.push(a.x, a.y, a.z)),
              (h[p] = null))
            : d in h ||
              (h[d] = {
                index0: s[e],
                index1: s[t],
                normal: _normal$1.clone()
              });
        }
    }
    for (const e in h)
      if (h[e]) {
        const { index0: t, index1: n } = h[e];
        _v0$2.fromBufferAttribute(o, t),
          _v1$5.fromBufferAttribute(o, n),
          u.push(_v0$2.x, _v0$2.y, _v0$2.z),
          u.push(_v1$5.x, _v1$5.y, _v1$5.z);
      }
    this.setAttribute("position", new Float32BufferAttribute(u, 3));
  }
}
const Earcut = {
  triangulate: function (e, t, n) {
    n = n || 2;
    const r = t && t.length,
      i = r ? t[0] * n : e.length;
    let o = linkedList(e, 0, i, n, !0);
    const a = [];
    if (!o || o.next === o.prev) return a;
    let s, c, l, h, u, d, p;
    if ((r && (o = eliminateHoles(e, t, o, n)), e.length > 80 * n)) {
      (s = l = e[0]), (c = h = e[1]);
      for (let t = n; t < i; t += n)
        (u = e[t]) < s && (s = u),
          (d = e[t + 1]) < c && (c = d),
          u > l && (l = u),
          d > h && (h = d);
      p = 0 !== (p = Math.max(l - s, h - c)) ? 1 / p : 0;
    }
    return earcutLinked(o, a, n, s, c, p), a;
  }
};
function linkedList(e, t, n, r, i) {
  let o, a;
  if (i === signedArea(e, t, n, r) > 0)
    for (o = t; o < n; o += r) a = insertNode(o, e[o], e[o + 1], a);
  else for (o = n - r; o >= t; o -= r) a = insertNode(o, e[o], e[o + 1], a);
  return a && equals(a, a.next) && (removeNode(a), (a = a.next)), a;
}
function filterPoints(e, t) {
  if (!e) return e;
  t || (t = e);
  let n,
    r = e;
  do {
    if (
      ((n = !1),
      r.steiner || (!equals(r, r.next) && 0 !== area(r.prev, r, r.next)))
    )
      r = r.next;
    else {
      if ((removeNode(r), (r = t = r.prev) === r.next)) break;
      n = !0;
    }
  } while (n || r !== t);
  return t;
}
function earcutLinked(e, t, n, r, i, o, a) {
  if (!e) return;
  !a && o && indexCurve(e, r, i, o);
  let s,
    c,
    l = e;
  for (; e.prev !== e.next; )
    if (((s = e.prev), (c = e.next), o ? isEarHashed(e, r, i, o) : isEar(e)))
      t.push(s.i / n),
        t.push(e.i / n),
        t.push(c.i / n),
        removeNode(e),
        (e = c.next),
        (l = c.next);
    else if ((e = c) === l) {
      a
        ? 1 === a
          ? earcutLinked(
              (e = cureLocalIntersections(filterPoints(e), t, n)),
              t,
              n,
              r,
              i,
              o,
              2
            )
          : 2 === a && splitEarcut(e, t, n, r, i, o)
        : earcutLinked(filterPoints(e), t, n, r, i, o, 1);
      break;
    }
}
function isEar(e) {
  const t = e.prev,
    n = e,
    r = e.next;
  if (area(t, n, r) >= 0) return !1;
  let i = e.next.next;
  for (; i !== e.prev; ) {
    if (
      pointInTriangle(t.x, t.y, n.x, n.y, r.x, r.y, i.x, i.y) &&
      area(i.prev, i, i.next) >= 0
    )
      return !1;
    i = i.next;
  }
  return !0;
}
function isEarHashed(e, t, n, r) {
  const i = e.prev,
    o = e,
    a = e.next;
  if (area(i, o, a) >= 0) return !1;
  const s = i.x < o.x ? (i.x < a.x ? i.x : a.x) : o.x < a.x ? o.x : a.x,
    c = i.y < o.y ? (i.y < a.y ? i.y : a.y) : o.y < a.y ? o.y : a.y,
    l = i.x > o.x ? (i.x > a.x ? i.x : a.x) : o.x > a.x ? o.x : a.x,
    h = i.y > o.y ? (i.y > a.y ? i.y : a.y) : o.y > a.y ? o.y : a.y,
    u = zOrder(s, c, t, n, r),
    d = zOrder(l, h, t, n, r);
  let p = e.prevZ,
    m = e.nextZ;
  for (; p && p.z >= u && m && m.z <= d; ) {
    if (
      p !== e.prev &&
      p !== e.next &&
      pointInTriangle(i.x, i.y, o.x, o.y, a.x, a.y, p.x, p.y) &&
      area(p.prev, p, p.next) >= 0
    )
      return !1;
    if (
      ((p = p.prevZ),
      m !== e.prev &&
        m !== e.next &&
        pointInTriangle(i.x, i.y, o.x, o.y, a.x, a.y, m.x, m.y) &&
        area(m.prev, m, m.next) >= 0)
    )
      return !1;
    m = m.nextZ;
  }
  for (; p && p.z >= u; ) {
    if (
      p !== e.prev &&
      p !== e.next &&
      pointInTriangle(i.x, i.y, o.x, o.y, a.x, a.y, p.x, p.y) &&
      area(p.prev, p, p.next) >= 0
    )
      return !1;
    p = p.prevZ;
  }
  for (; m && m.z <= d; ) {
    if (
      m !== e.prev &&
      m !== e.next &&
      pointInTriangle(i.x, i.y, o.x, o.y, a.x, a.y, m.x, m.y) &&
      area(m.prev, m, m.next) >= 0
    )
      return !1;
    m = m.nextZ;
  }
  return !0;
}
function cureLocalIntersections(e, t, n) {
  let r = e;
  do {
    const i = r.prev,
      o = r.next.next;
    !equals(i, o) &&
      intersects(i, r, r.next, o) &&
      locallyInside(i, o) &&
      locallyInside(o, i) &&
      (t.push(i.i / n),
      t.push(r.i / n),
      t.push(o.i / n),
      removeNode(r),
      removeNode(r.next),
      (r = e = o)),
      (r = r.next);
  } while (r !== e);
  return filterPoints(r);
}
function splitEarcut(e, t, n, r, i, o) {
  let a = e;
  do {
    let e = a.next.next;
    for (; e !== a.prev; ) {
      if (a.i !== e.i && isValidDiagonal(a, e)) {
        let s = splitPolygon(a, e);
        return (
          (a = filterPoints(a, a.next)),
          (s = filterPoints(s, s.next)),
          earcutLinked(a, t, n, r, i, o),
          void earcutLinked(s, t, n, r, i, o)
        );
      }
      e = e.next;
    }
    a = a.next;
  } while (a !== e);
}
function eliminateHoles(e, t, n, r) {
  const i = [];
  let o, a, s, c, l;
  for (o = 0, a = t.length; o < a; o++)
    (l = linkedList(
      e,
      (s = t[o] * r),
      (c = o < a - 1 ? t[o + 1] * r : e.length),
      r,
      !1
    )) === l.next && (l.steiner = !0),
      i.push(getLeftmost(l));
  for (i.sort(compareX), o = 0; o < i.length; o++)
    eliminateHole(i[o], n), (n = filterPoints(n, n.next));
  return n;
}
function compareX(e, t) {
  return e.x - t.x;
}
function eliminateHole(e, t) {
  if ((t = findHoleBridge(e, t))) {
    const n = splitPolygon(t, e);
    filterPoints(t, t.next), filterPoints(n, n.next);
  }
}
function findHoleBridge(e, t) {
  let n = t;
  const r = e.x,
    i = e.y;
  let o,
    a = -1 / 0;
  do {
    if (i <= n.y && i >= n.next.y && n.next.y !== n.y) {
      const e = n.x + ((i - n.y) * (n.next.x - n.x)) / (n.next.y - n.y);
      if (e <= r && e > a) {
        if (((a = e), e === r)) {
          if (i === n.y) return n;
          if (i === n.next.y) return n.next;
        }
        o = n.x < n.next.x ? n : n.next;
      }
    }
    n = n.next;
  } while (n !== t);
  if (!o) return null;
  if (r === a) return o;
  const s = o,
    c = o.x,
    l = o.y;
  let h,
    u = 1 / 0;
  n = o;
  do {
    r >= n.x &&
      n.x >= c &&
      r !== n.x &&
      pointInTriangle(i < l ? r : a, i, c, l, i < l ? a : r, i, n.x, n.y) &&
      ((h = Math.abs(i - n.y) / (r - n.x)),
      locallyInside(n, e) &&
        (h < u ||
          (h === u &&
            (n.x > o.x || (n.x === o.x && sectorContainsSector(o, n))))) &&
        ((o = n), (u = h))),
      (n = n.next);
  } while (n !== s);
  return o;
}
function sectorContainsSector(e, t) {
  return area(e.prev, e, t.prev) < 0 && area(t.next, e, e.next) < 0;
}
function indexCurve(e, t, n, r) {
  let i = e;
  do {
    null === i.z && (i.z = zOrder(i.x, i.y, t, n, r)),
      (i.prevZ = i.prev),
      (i.nextZ = i.next),
      (i = i.next);
  } while (i !== e);
  (i.prevZ.nextZ = null), (i.prevZ = null), sortLinked(i);
}
function sortLinked(e) {
  let t,
    n,
    r,
    i,
    o,
    a,
    s,
    c,
    l = 1;
  do {
    for (n = e, e = null, o = null, a = 0; n; ) {
      for (a++, r = n, s = 0, t = 0; t < l && (s++, (r = r.nextZ)); t++);
      for (c = l; s > 0 || (c > 0 && r); )
        0 !== s && (0 === c || !r || n.z <= r.z)
          ? ((i = n), (n = n.nextZ), s--)
          : ((i = r), (r = r.nextZ), c--),
          o ? (o.nextZ = i) : (e = i),
          (i.prevZ = o),
          (o = i);
      n = r;
    }
    (o.nextZ = null), (l *= 2);
  } while (a > 1);
  return e;
}
function zOrder(e, t, n, r, i) {
  return (
    (e =
      1431655765 &
      ((e =
        858993459 &
        ((e =
          252645135 &
          ((e = 16711935 & ((e = 32767 * (e - n) * i) | (e << 8))) |
            (e << 4))) |
          (e << 2))) |
        (e << 1))) |
    ((t =
      1431655765 &
      ((t =
        858993459 &
        ((t =
          252645135 &
          ((t = 16711935 & ((t = 32767 * (t - r) * i) | (t << 8))) |
            (t << 4))) |
          (t << 2))) |
        (t << 1))) <<
      1)
  );
}
function getLeftmost(e) {
  let t = e,
    n = e;
  do {
    (t.x < n.x || (t.x === n.x && t.y < n.y)) && (n = t), (t = t.next);
  } while (t !== e);
  return n;
}
function pointInTriangle(e, t, n, r, i, o, a, s) {
  return (
    (i - a) * (t - s) - (e - a) * (o - s) >= 0 &&
    (e - a) * (r - s) - (n - a) * (t - s) >= 0 &&
    (n - a) * (o - s) - (i - a) * (r - s) >= 0
  );
}
function isValidDiagonal(e, t) {
  return (
    e.next.i !== t.i &&
    e.prev.i !== t.i &&
    !intersectsPolygon(e, t) &&
    ((locallyInside(e, t) &&
      locallyInside(t, e) &&
      middleInside(e, t) &&
      (area(e.prev, e, t.prev) || area(e, t.prev, t))) ||
      (equals(e, t) &&
        area(e.prev, e, e.next) > 0 &&
        area(t.prev, t, t.next) > 0))
  );
}
function area(e, t, n) {
  return (t.y - e.y) * (n.x - t.x) - (t.x - e.x) * (n.y - t.y);
}
function equals(e, t) {
  return e.x === t.x && e.y === t.y;
}
function intersects(e, t, n, r) {
  const i = sign(area(e, t, n)),
    o = sign(area(e, t, r)),
    a = sign(area(n, r, e)),
    s = sign(area(n, r, t));
  return (
    (i !== o && a !== s) ||
    !(0 !== i || !onSegment(e, n, t)) ||
    !(0 !== o || !onSegment(e, r, t)) ||
    !(0 !== a || !onSegment(n, e, r)) ||
    !(0 !== s || !onSegment(n, t, r))
  );
}
function onSegment(e, t, n) {
  return (
    t.x <= Math.max(e.x, n.x) &&
    t.x >= Math.min(e.x, n.x) &&
    t.y <= Math.max(e.y, n.y) &&
    t.y >= Math.min(e.y, n.y)
  );
}
function sign(e) {
  return e > 0 ? 1 : e < 0 ? -1 : 0;
}
function intersectsPolygon(e, t) {
  let n = e;
  do {
    if (
      n.i !== e.i &&
      n.next.i !== e.i &&
      n.i !== t.i &&
      n.next.i !== t.i &&
      intersects(n, n.next, e, t)
    )
      return !0;
    n = n.next;
  } while (n !== e);
  return !1;
}
function locallyInside(e, t) {
  return area(e.prev, e, e.next) < 0
    ? area(e, t, e.next) >= 0 && area(e, e.prev, t) >= 0
    : area(e, t, e.prev) < 0 || area(e, e.next, t) < 0;
}
function middleInside(e, t) {
  let n = e,
    r = !1;
  const i = (e.x + t.x) / 2,
    o = (e.y + t.y) / 2;
  do {
    n.y > o != n.next.y > o &&
      n.next.y !== n.y &&
      i < ((n.next.x - n.x) * (o - n.y)) / (n.next.y - n.y) + n.x &&
      (r = !r),
      (n = n.next);
  } while (n !== e);
  return r;
}
function splitPolygon(e, t) {
  const n = new Node(e.i, e.x, e.y),
    r = new Node(t.i, t.x, t.y),
    i = e.next,
    o = t.prev;
  return (
    (e.next = t),
    (t.prev = e),
    (n.next = i),
    (i.prev = n),
    (r.next = n),
    (n.prev = r),
    (o.next = r),
    (r.prev = o),
    r
  );
}
function insertNode(e, t, n, r) {
  const i = new Node(e, t, n);
  return (
    r
      ? ((i.next = r.next), (i.prev = r), (r.next.prev = i), (r.next = i))
      : ((i.prev = i), (i.next = i)),
    i
  );
}
function removeNode(e) {
  (e.next.prev = e.prev),
    (e.prev.next = e.next),
    e.prevZ && (e.prevZ.nextZ = e.nextZ),
    e.nextZ && (e.nextZ.prevZ = e.prevZ);
}
function Node(e, t, n) {
  (this.i = e),
    (this.x = t),
    (this.y = n),
    (this.prev = null),
    (this.next = null),
    (this.z = null),
    (this.prevZ = null),
    (this.nextZ = null),
    (this.steiner = !1);
}
function signedArea(e, t, n, r) {
  let i = 0;
  for (let o = t, a = n - r; o < n; o += r)
    (i += (e[a] - e[o]) * (e[o + 1] + e[a + 1])), (a = o);
  return i;
}
const ShapeUtils = {
  area: function (e) {
    const t = e.length;
    let n = 0;
    for (let r = t - 1, i = 0; i < t; r = i++)
      n += e[r].x * e[i].y - e[i].x * e[r].y;
    return 0.5 * n;
  },
  isClockWise: function (e) {
    return ShapeUtils.area(e) < 0;
  },
  triangulateShape: function (e, t) {
    const n = [],
      r = [],
      i = [];
    removeDupEndPts(e), addContour(n, e);
    let o = e.length;
    t.forEach(removeDupEndPts);
    for (let e = 0; e < t.length; e++)
      r.push(o), (o += t[e].length), addContour(n, t[e]);
    const a = Earcut.triangulate(n, r);
    for (let e = 0; e < a.length; e += 3) i.push(a.slice(e, e + 3));
    return i;
  }
};
function removeDupEndPts(e) {
  const t = e.length;
  t > 2 && e[t - 1].equals(e[0]) && e.pop();
}
function addContour(e, t) {
  for (let n = 0; n < t.length; n++) e.push(t[n].x), e.push(t[n].y);
}
class ExtrudeBufferGeometry extends BufferGeometry {
  constructor(e, t) {
    super(),
      (this.type = "ExtrudeBufferGeometry"),
      (this.parameters = { shapes: e, options: t }),
      (e = Array.isArray(e) ? e : [e]);
    const n = this,
      r = [],
      i = [];
    for (let t = 0, n = e.length; t < n; t++) {
      o(e[t]);
    }
    function o(e) {
      const o = [],
        a = void 0 !== t.curveSegments ? t.curveSegments : 12,
        s = void 0 !== t.steps ? t.steps : 1;
      let c = void 0 !== t.depth ? t.depth : 100,
        l = void 0 === t.bevelEnabled || t.bevelEnabled,
        h = void 0 !== t.bevelThickness ? t.bevelThickness : 6,
        u = void 0 !== t.bevelSize ? t.bevelSize : h - 2,
        d = void 0 !== t.bevelOffset ? t.bevelOffset : 0,
        p = void 0 !== t.bevelSegments ? t.bevelSegments : 3;
      const m = t.extrudePath,
        f = void 0 !== t.UVGenerator ? t.UVGenerator : WorldUVGenerator;
      void 0 !== t.amount &&
        (console.warn(
          "THREE.ExtrudeBufferGeometry: amount has been renamed to depth."
        ),
        (c = t.amount));
      let g,
        v,
        y,
        _,
        x,
        b = !1;
      m &&
        ((g = m.getSpacedPoints(s)),
        (b = !0),
        (l = !1),
        (v = m.computeFrenetFrames(s, !1)),
        (y = new Vector3()),
        (_ = new Vector3()),
        (x = new Vector3())),
        l || ((p = 0), (h = 0), (u = 0), (d = 0));
      const M = e.extractPoints(a);
      let w = M.shape;
      const S = M.holes;
      if (!ShapeUtils.isClockWise(w)) {
        w = w.reverse();
        for (let e = 0, t = S.length; e < t; e++) {
          const t = S[e];
          ShapeUtils.isClockWise(t) && (S[e] = t.reverse());
        }
      }
      const T = ShapeUtils.triangulateShape(w, S),
        E = w;
      for (let e = 0, t = S.length; e < t; e++) {
        const t = S[e];
        w = w.concat(t);
      }
      function A(e, t, n) {
        return (
          t || console.error("THREE.ExtrudeGeometry: vec does not exist"),
          t.clone().multiplyScalar(n).add(e)
        );
      }
      const L = w.length,
        C = T.length;
      function R(e, t, n) {
        let r, i, o;
        const a = e.x - t.x,
          s = e.y - t.y,
          c = n.x - e.x,
          l = n.y - e.y,
          h = a * a + s * s,
          u = a * l - s * c;
        if (Math.abs(u) > Number.EPSILON) {
          const u = Math.sqrt(h),
            d = Math.sqrt(c * c + l * l),
            p = t.x - s / u,
            m = t.y + a / u,
            f =
              ((n.x - l / d - p) * l - (n.y + c / d - m) * c) / (a * l - s * c),
            g = (r = p + a * f - e.x) * r + (i = m + s * f - e.y) * i;
          if (g <= 2) return new Vector2(r, i);
          o = Math.sqrt(g / 2);
        } else {
          let e = !1;
          a > Number.EPSILON
            ? c > Number.EPSILON && (e = !0)
            : a < -Number.EPSILON
            ? c < -Number.EPSILON && (e = !0)
            : Math.sign(s) === Math.sign(l) && (e = !0),
            e
              ? ((r = -s), (i = a), (o = Math.sqrt(h)))
              : ((r = a), (i = s), (o = Math.sqrt(h / 2)));
        }
        return new Vector2(r / o, i / o);
      }
      const P = [];
      for (let e = 0, t = E.length, n = t - 1, r = e + 1; e < t; e++, n++, r++)
        n === t && (n = 0), r === t && (r = 0), (P[e] = R(E[e], E[n], E[r]));
      const B = [];
      let D,
        G = P.concat();
      for (let e = 0, t = S.length; e < t; e++) {
        const t = S[e];
        D = [];
        for (
          let e = 0, n = t.length, r = n - 1, i = e + 1;
          e < n;
          e++, r++, i++
        )
          r === n && (r = 0), i === n && (i = 0), (D[e] = R(t[e], t[r], t[i]));
        B.push(D), (G = G.concat(D));
      }
      for (let e = 0; e < p; e++) {
        const t = e / p,
          n = h * Math.cos((t * Math.PI) / 2),
          r = u * Math.sin((t * Math.PI) / 2) + d;
        for (let e = 0, t = E.length; e < t; e++) {
          const t = A(E[e], P[e], r);
          F(t.x, t.y, -n);
        }
        for (let e = 0, t = S.length; e < t; e++) {
          const t = S[e];
          D = B[e];
          for (let e = 0, i = t.length; e < i; e++) {
            const i = A(t[e], D[e], r);
            F(i.x, i.y, -n);
          }
        }
      }
      const I = u + d;
      for (let e = 0; e < L; e++) {
        const t = l ? A(w[e], G[e], I) : w[e];
        b
          ? (_.copy(v.normals[0]).multiplyScalar(t.x),
            y.copy(v.binormals[0]).multiplyScalar(t.y),
            x.copy(g[0]).add(_).add(y),
            F(x.x, x.y, x.z))
          : F(t.x, t.y, 0);
      }
      for (let e = 1; e <= s; e++)
        for (let t = 0; t < L; t++) {
          const n = l ? A(w[t], G[t], I) : w[t];
          b
            ? (_.copy(v.normals[e]).multiplyScalar(n.x),
              y.copy(v.binormals[e]).multiplyScalar(n.y),
              x.copy(g[e]).add(_).add(y),
              F(x.x, x.y, x.z))
            : F(n.x, n.y, (c / s) * e);
        }
      for (let e = p - 1; e >= 0; e--) {
        const t = e / p,
          n = h * Math.cos((t * Math.PI) / 2),
          r = u * Math.sin((t * Math.PI) / 2) + d;
        for (let e = 0, t = E.length; e < t; e++) {
          const t = A(E[e], P[e], r);
          F(t.x, t.y, c + n);
        }
        for (let e = 0, t = S.length; e < t; e++) {
          const t = S[e];
          D = B[e];
          for (let e = 0, i = t.length; e < i; e++) {
            const i = A(t[e], D[e], r);
            b ? F(i.x, i.y + g[s - 1].y, g[s - 1].x + n) : F(i.x, i.y, c + n);
          }
        }
      }
      function N(e, t) {
        let n = e.length;
        for (; --n >= 0; ) {
          const r = n;
          let i = n - 1;
          i < 0 && (i = e.length - 1);
          for (let e = 0, n = s + 2 * p; e < n; e++) {
            const n = L * e,
              o = L * (e + 1);
            U(t + r + n, t + i + n, t + i + o, t + r + o);
          }
        }
      }
      function F(e, t, n) {
        o.push(e), o.push(t), o.push(n);
      }
      function O(e, t, i) {
        V(e), V(t), V(i);
        const o = r.length / 3,
          a = f.generateTopUV(n, r, o - 3, o - 2, o - 1);
        z(a[0]), z(a[1]), z(a[2]);
      }
      function U(e, t, i, o) {
        V(e), V(t), V(o), V(t), V(i), V(o);
        const a = r.length / 3,
          s = f.generateSideWallUV(n, r, a - 6, a - 3, a - 2, a - 1);
        z(s[0]), z(s[1]), z(s[3]), z(s[1]), z(s[2]), z(s[3]);
      }
      function V(e) {
        r.push(o[3 * e + 0]), r.push(o[3 * e + 1]), r.push(o[3 * e + 2]);
      }
      function z(e) {
        i.push(e.x), i.push(e.y);
      }
      !(function () {
        const e = r.length / 3;
        if (l) {
          let e = 0,
            t = L * e;
          for (let e = 0; e < C; e++) {
            const n = T[e];
            O(n[2] + t, n[1] + t, n[0] + t);
          }
          t = L * (e = s + 2 * p);
          for (let e = 0; e < C; e++) {
            const n = T[e];
            O(n[0] + t, n[1] + t, n[2] + t);
          }
        } else {
          for (let e = 0; e < C; e++) {
            const t = T[e];
            O(t[2], t[1], t[0]);
          }
          for (let e = 0; e < C; e++) {
            const t = T[e];
            O(t[0] + L * s, t[1] + L * s, t[2] + L * s);
          }
        }
        n.addGroup(e, r.length / 3 - e, 0);
      })(),
        (function () {
          const e = r.length / 3;
          let t = 0;
          N(E, t), (t += E.length);
          for (let e = 0, n = S.length; e < n; e++) {
            const n = S[e];
            N(n, t), (t += n.length);
          }
          n.addGroup(e, r.length / 3 - e, 1);
        })();
    }
    this.setAttribute("position", new Float32BufferAttribute(r, 3)),
      this.setAttribute("uv", new Float32BufferAttribute(i, 2)),
      this.computeVertexNormals();
  }
  toJSON() {
    const e = BufferGeometry.prototype.toJSON.call(this);
    return toJSON(this.parameters.shapes, this.parameters.options, e);
  }
}
const WorldUVGenerator = {
  generateTopUV: function (e, t, n, r, i) {
    const o = t[3 * n],
      a = t[3 * n + 1],
      s = t[3 * r],
      c = t[3 * r + 1],
      l = t[3 * i],
      h = t[3 * i + 1];
    return [new Vector2(o, a), new Vector2(s, c), new Vector2(l, h)];
  },
  generateSideWallUV: function (e, t, n, r, i, o) {
    const a = t[3 * n],
      s = t[3 * n + 1],
      c = t[3 * n + 2],
      l = t[3 * r],
      h = t[3 * r + 1],
      u = t[3 * r + 2],
      d = t[3 * i],
      p = t[3 * i + 1],
      m = t[3 * i + 2],
      f = t[3 * o],
      g = t[3 * o + 1],
      v = t[3 * o + 2];
    return Math.abs(s - h) < 0.01
      ? [
          new Vector2(a, 1 - c),
          new Vector2(l, 1 - u),
          new Vector2(d, 1 - m),
          new Vector2(f, 1 - v)
        ]
      : [
          new Vector2(s, 1 - c),
          new Vector2(h, 1 - u),
          new Vector2(p, 1 - m),
          new Vector2(g, 1 - v)
        ];
  }
};
function toJSON(e, t, n) {
  if (((n.shapes = []), Array.isArray(e)))
    for (let t = 0, r = e.length; t < r; t++) {
      const r = e[t];
      n.shapes.push(r.uuid);
    }
  else n.shapes.push(e.uuid);
  return (
    void 0 !== t.extrudePath &&
      (n.options.extrudePath = t.extrudePath.toJSON()),
    n
  );
}
class ExtrudeGeometry extends Geometry {
  constructor(e, t) {
    super(),
      (this.type = "ExtrudeGeometry"),
      (this.parameters = { shapes: e, options: t }),
      this.fromBufferGeometry(new ExtrudeBufferGeometry(e, t)),
      this.mergeVertices();
  }
  toJSON() {
    const e = super.toJSON();
    return toJSON$1(this.parameters.shapes, this.parameters.options, e);
  }
}
function toJSON$1(e, t, n) {
  if (((n.shapes = []), Array.isArray(e)))
    for (let t = 0, r = e.length; t < r; t++) {
      const r = e[t];
      n.shapes.push(r.uuid);
    }
  else n.shapes.push(e.uuid);
  return (
    void 0 !== t.extrudePath &&
      (n.options.extrudePath = t.extrudePath.toJSON()),
    n
  );
}
class IcosahedronBufferGeometry extends PolyhedronBufferGeometry {
  constructor(e, t) {
    const n = (1 + Math.sqrt(5)) / 2;
    super(
      [
        -1,
        n,
        0,
        1,
        n,
        0,
        -1,
        -n,
        0,
        1,
        -n,
        0,
        0,
        -1,
        n,
        0,
        1,
        n,
        0,
        -1,
        -n,
        0,
        1,
        -n,
        n,
        0,
        -1,
        n,
        0,
        1,
        -n,
        0,
        -1,
        -n,
        0,
        1
      ],
      [
        0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11,
        10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9,
        4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1
      ],
      e,
      t
    ),
      (this.type = "IcosahedronBufferGeometry"),
      (this.parameters = { radius: e, detail: t });
  }
}
class IcosahedronGeometry extends Geometry {
  constructor(e, t) {
    super(),
      (this.type = "IcosahedronGeometry"),
      (this.parameters = { radius: e, detail: t }),
      this.fromBufferGeometry(new IcosahedronBufferGeometry(e, t)),
      this.mergeVertices();
  }
}
class LatheBufferGeometry extends BufferGeometry {
  constructor(e, t, n, r) {
    super(),
      (this.type = "LatheBufferGeometry"),
      (this.parameters = { points: e, segments: t, phiStart: n, phiLength: r }),
      (t = Math.floor(t) || 12),
      (n = n || 0),
      (r = r || 2 * Math.PI),
      (r = MathUtils.clamp(r, 0, 2 * Math.PI));
    const i = [],
      o = [],
      a = [],
      s = 1 / t,
      c = new Vector3(),
      l = new Vector2();
    for (let i = 0; i <= t; i++) {
      const h = n + i * s * r,
        u = Math.sin(h),
        d = Math.cos(h);
      for (let n = 0; n <= e.length - 1; n++)
        (c.x = e[n].x * u),
          (c.y = e[n].y),
          (c.z = e[n].x * d),
          o.push(c.x, c.y, c.z),
          (l.x = i / t),
          (l.y = n / (e.length - 1)),
          a.push(l.x, l.y);
    }
    for (let n = 0; n < t; n++)
      for (let t = 0; t < e.length - 1; t++) {
        const r = t + n * e.length,
          o = r,
          a = r + e.length,
          s = r + e.length + 1,
          c = r + 1;
        i.push(o, a, c), i.push(a, s, c);
      }
    if (
      (this.setIndex(i),
      this.setAttribute("position", new Float32BufferAttribute(o, 3)),
      this.setAttribute("uv", new Float32BufferAttribute(a, 2)),
      this.computeVertexNormals(),
      r === 2 * Math.PI)
    ) {
      const n = this.attributes.normal.array,
        r = new Vector3(),
        i = new Vector3(),
        o = new Vector3(),
        a = t * e.length * 3;
      for (let t = 0, s = 0; t < e.length; t++, s += 3)
        (r.x = n[s + 0]),
          (r.y = n[s + 1]),
          (r.z = n[s + 2]),
          (i.x = n[a + s + 0]),
          (i.y = n[a + s + 1]),
          (i.z = n[a + s + 2]),
          o.addVectors(r, i).normalize(),
          (n[s + 0] = n[a + s + 0] = o.x),
          (n[s + 1] = n[a + s + 1] = o.y),
          (n[s + 2] = n[a + s + 2] = o.z);
    }
  }
}
class LatheGeometry extends Geometry {
  constructor(e, t, n, r) {
    super(),
      (this.type = "LatheGeometry"),
      (this.parameters = { points: e, segments: t, phiStart: n, phiLength: r }),
      this.fromBufferGeometry(new LatheBufferGeometry(e, t, n, r)),
      this.mergeVertices();
  }
}
class OctahedronBufferGeometry extends PolyhedronBufferGeometry {
  constructor(e, t) {
    super(
      [1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1],
      [0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2],
      e,
      t
    ),
      (this.type = "OctahedronBufferGeometry"),
      (this.parameters = { radius: e, detail: t });
  }
}
class OctahedronGeometry extends Geometry {
  constructor(e, t) {
    super(),
      (this.type = "OctahedronGeometry"),
      (this.parameters = { radius: e, detail: t }),
      this.fromBufferGeometry(new OctahedronBufferGeometry(e, t)),
      this.mergeVertices();
  }
}
function ParametricBufferGeometry(e, t, n) {
  BufferGeometry.call(this),
    (this.type = "ParametricBufferGeometry"),
    (this.parameters = { func: e, slices: t, stacks: n });
  const r = [],
    i = [],
    o = [],
    a = [],
    s = new Vector3(),
    c = new Vector3(),
    l = new Vector3(),
    h = new Vector3(),
    u = new Vector3();
  e.length < 3 &&
    console.error(
      "THREE.ParametricGeometry: Function must now modify a Vector3 as third parameter."
    );
  const d = t + 1;
  for (let r = 0; r <= n; r++) {
    const d = r / n;
    for (let n = 0; n <= t; n++) {
      const r = n / t;
      e(r, d, c),
        i.push(c.x, c.y, c.z),
        r - 1e-5 >= 0
          ? (e(r - 1e-5, d, l), h.subVectors(c, l))
          : (e(r + 1e-5, d, l), h.subVectors(l, c)),
        d - 1e-5 >= 0
          ? (e(r, d - 1e-5, l), u.subVectors(c, l))
          : (e(r, d + 1e-5, l), u.subVectors(l, c)),
        s.crossVectors(h, u).normalize(),
        o.push(s.x, s.y, s.z),
        a.push(r, d);
    }
  }
  for (let e = 0; e < n; e++)
    for (let n = 0; n < t; n++) {
      const t = e * d + n,
        i = e * d + n + 1,
        o = (e + 1) * d + n + 1,
        a = (e + 1) * d + n;
      r.push(t, i, a), r.push(i, o, a);
    }
  this.setIndex(r),
    this.setAttribute("position", new Float32BufferAttribute(i, 3)),
    this.setAttribute("normal", new Float32BufferAttribute(o, 3)),
    this.setAttribute("uv", new Float32BufferAttribute(a, 2));
}
function ParametricGeometry(e, t, n) {
  Geometry.call(this),
    (this.type = "ParametricGeometry"),
    (this.parameters = { func: e, slices: t, stacks: n }),
    this.fromBufferGeometry(new ParametricBufferGeometry(e, t, n)),
    this.mergeVertices();
}
(ParametricBufferGeometry.prototype = Object.create(BufferGeometry.prototype)),
  (ParametricBufferGeometry.prototype.constructor = ParametricBufferGeometry),
  (ParametricGeometry.prototype = Object.create(Geometry.prototype)),
  (ParametricGeometry.prototype.constructor = ParametricGeometry);
class PlaneGeometry extends Geometry {
  constructor(e, t, n, r) {
    super(),
      (this.type = "PlaneGeometry"),
      (this.parameters = {
        width: e,
        height: t,
        widthSegments: n,
        heightSegments: r
      }),
      this.fromBufferGeometry(new PlaneBufferGeometry(e, t, n, r)),
      this.mergeVertices();
  }
}
class PolyhedronGeometry extends Geometry {
  constructor(e, t, n, r) {
    super(),
      (this.type = "PolyhedronGeometry"),
      (this.parameters = { vertices: e, indices: t, radius: n, detail: r }),
      this.fromBufferGeometry(new PolyhedronBufferGeometry(e, t, n, r)),
      this.mergeVertices();
  }
}
class RingBufferGeometry extends BufferGeometry {
  constructor(e, t, n, r, i, o) {
    super(),
      (this.type = "RingBufferGeometry"),
      (this.parameters = {
        innerRadius: e,
        outerRadius: t,
        thetaSegments: n,
        phiSegments: r,
        thetaStart: i,
        thetaLength: o
      }),
      (e = e || 0.5),
      (t = t || 1),
      (i = void 0 !== i ? i : 0),
      (o = void 0 !== o ? o : 2 * Math.PI),
      (n = void 0 !== n ? Math.max(3, n) : 8);
    const a = [],
      s = [],
      c = [],
      l = [];
    let h = e;
    const u = (t - e) / (r = void 0 !== r ? Math.max(1, r) : 1),
      d = new Vector3(),
      p = new Vector2();
    for (let e = 0; e <= r; e++) {
      for (let e = 0; e <= n; e++) {
        const r = i + (e / n) * o;
        (d.x = h * Math.cos(r)),
          (d.y = h * Math.sin(r)),
          s.push(d.x, d.y, d.z),
          c.push(0, 0, 1),
          (p.x = (d.x / t + 1) / 2),
          (p.y = (d.y / t + 1) / 2),
          l.push(p.x, p.y);
      }
      h += u;
    }
    for (let e = 0; e < r; e++) {
      const t = e * (n + 1);
      for (let e = 0; e < n; e++) {
        const r = e + t,
          i = r,
          o = r + n + 1,
          s = r + n + 2,
          c = r + 1;
        a.push(i, o, c), a.push(o, s, c);
      }
    }
    this.setIndex(a),
      this.setAttribute("position", new Float32BufferAttribute(s, 3)),
      this.setAttribute("normal", new Float32BufferAttribute(c, 3)),
      this.setAttribute("uv", new Float32BufferAttribute(l, 2));
  }
}
class RingGeometry extends Geometry {
  constructor(e, t, n, r, i, o) {
    super(),
      (this.type = "RingGeometry"),
      (this.parameters = {
        innerRadius: e,
        outerRadius: t,
        thetaSegments: n,
        phiSegments: r,
        thetaStart: i,
        thetaLength: o
      }),
      this.fromBufferGeometry(new RingBufferGeometry(e, t, n, r, i, o)),
      this.mergeVertices();
  }
}
class ShapeBufferGeometry extends BufferGeometry {
  constructor(e, t) {
    super(),
      (this.type = "ShapeBufferGeometry"),
      (this.parameters = { shapes: e, curveSegments: t }),
      (t = t || 12);
    const n = [],
      r = [],
      i = [],
      o = [];
    let a = 0,
      s = 0;
    if (!1 === Array.isArray(e)) c(e);
    else
      for (let t = 0; t < e.length; t++)
        c(e[t]), this.addGroup(a, s, t), (a += s), (s = 0);
    function c(e) {
      const a = r.length / 3,
        c = e.extractPoints(t);
      let l = c.shape;
      const h = c.holes;
      !1 === ShapeUtils.isClockWise(l) && (l = l.reverse());
      for (let e = 0, t = h.length; e < t; e++) {
        const t = h[e];
        !0 === ShapeUtils.isClockWise(t) && (h[e] = t.reverse());
      }
      const u = ShapeUtils.triangulateShape(l, h);
      for (let e = 0, t = h.length; e < t; e++) {
        const t = h[e];
        l = l.concat(t);
      }
      for (let e = 0, t = l.length; e < t; e++) {
        const t = l[e];
        r.push(t.x, t.y, 0), i.push(0, 0, 1), o.push(t.x, t.y);
      }
      for (let e = 0, t = u.length; e < t; e++) {
        const t = u[e],
          r = t[0] + a,
          i = t[1] + a,
          o = t[2] + a;
        n.push(r, i, o), (s += 3);
      }
    }
    this.setIndex(n),
      this.setAttribute("position", new Float32BufferAttribute(r, 3)),
      this.setAttribute("normal", new Float32BufferAttribute(i, 3)),
      this.setAttribute("uv", new Float32BufferAttribute(o, 2));
  }
  toJSON() {
    const e = BufferGeometry.prototype.toJSON.call(this);
    return toJSON$2(this.parameters.shapes, e);
  }
}
function toJSON$2(e, t) {
  if (((t.shapes = []), Array.isArray(e)))
    for (let n = 0, r = e.length; n < r; n++) {
      const r = e[n];
      t.shapes.push(r.uuid);
    }
  else t.shapes.push(e.uuid);
  return t;
}
class ShapeGeometry extends Geometry {
  constructor(e, t) {
    super(),
      (this.type = "ShapeGeometry"),
      "object" == typeof t &&
        (console.warn(
          "THREE.ShapeGeometry: Options parameter has been removed."
        ),
        (t = t.curveSegments)),
      (this.parameters = { shapes: e, curveSegments: t }),
      this.fromBufferGeometry(new ShapeBufferGeometry(e, t)),
      this.mergeVertices();
  }
  toJSON() {
    const e = Geometry.prototype.toJSON.call(this);
    return toJSON$3(this.parameters.shapes, e);
  }
}
function toJSON$3(e, t) {
  if (((t.shapes = []), Array.isArray(e)))
    for (let n = 0, r = e.length; n < r; n++) {
      const r = e[n];
      t.shapes.push(r.uuid);
    }
  else t.shapes.push(e.uuid);
  return t;
}
class SphereBufferGeometry extends BufferGeometry {
  constructor(e, t, n, r, i, o, a) {
    super(),
      (this.type = "SphereBufferGeometry"),
      (this.parameters = {
        radius: e,
        widthSegments: t,
        heightSegments: n,
        phiStart: r,
        phiLength: i,
        thetaStart: o,
        thetaLength: a
      }),
      (e = e || 1),
      (t = Math.max(3, Math.floor(t) || 8)),
      (n = Math.max(2, Math.floor(n) || 6)),
      (r = void 0 !== r ? r : 0),
      (i = void 0 !== i ? i : 2 * Math.PI),
      (o = void 0 !== o ? o : 0),
      (a = void 0 !== a ? a : Math.PI);
    const s = Math.min(o + a, Math.PI);
    let c = 0;
    const l = [],
      h = new Vector3(),
      u = new Vector3(),
      d = [],
      p = [],
      m = [],
      f = [];
    for (let d = 0; d <= n; d++) {
      const g = [],
        v = d / n;
      let y = 0;
      0 == d && 0 == o
        ? (y = 0.5 / t)
        : d == n && s == Math.PI && (y = -0.5 / t);
      for (let n = 0; n <= t; n++) {
        const s = n / t;
        (h.x = -e * Math.cos(r + s * i) * Math.sin(o + v * a)),
          (h.y = e * Math.cos(o + v * a)),
          (h.z = e * Math.sin(r + s * i) * Math.sin(o + v * a)),
          p.push(h.x, h.y, h.z),
          u.copy(h).normalize(),
          m.push(u.x, u.y, u.z),
          f.push(s + y, 1 - v),
          g.push(c++);
      }
      l.push(g);
    }
    for (let e = 0; e < n; e++)
      for (let r = 0; r < t; r++) {
        const t = l[e][r + 1],
          i = l[e][r],
          a = l[e + 1][r],
          c = l[e + 1][r + 1];
        (0 !== e || o > 0) && d.push(t, i, c),
          (e !== n - 1 || s < Math.PI) && d.push(i, a, c);
      }
    this.setIndex(d),
      this.setAttribute("position", new Float32BufferAttribute(p, 3)),
      this.setAttribute("normal", new Float32BufferAttribute(m, 3)),
      this.setAttribute("uv", new Float32BufferAttribute(f, 2));
  }
}
class SphereGeometry extends Geometry {
  constructor(e, t, n, r, i, o, a) {
    super(),
      (this.type = "SphereGeometry"),
      (this.parameters = {
        radius: e,
        widthSegments: t,
        heightSegments: n,
        phiStart: r,
        phiLength: i,
        thetaStart: o,
        thetaLength: a
      }),
      this.fromBufferGeometry(new SphereBufferGeometry(e, t, n, r, i, o, a)),
      this.mergeVertices();
  }
}
class TetrahedronBufferGeometry extends PolyhedronBufferGeometry {
  constructor(e, t) {
    super(
      [1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1],
      [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1],
      e,
      t
    ),
      (this.type = "TetrahedronBufferGeometry"),
      (this.parameters = { radius: e, detail: t });
  }
}
class TetrahedronGeometry extends Geometry {
  constructor(e, t) {
    super(),
      (this.type = "TetrahedronGeometry"),
      (this.parameters = { radius: e, detail: t }),
      this.fromBufferGeometry(new TetrahedronBufferGeometry(e, t)),
      this.mergeVertices();
  }
}
class TextBufferGeometry extends ExtrudeBufferGeometry {
  constructor(e, t) {
    const n = (t = t || {}).font;
    if (!n || !n.isFont)
      return (
        console.error(
          "THREE.TextGeometry: font parameter is not an instance of THREE.Font."
        ),
        new BufferGeometry()
      );
    const r = n.generateShapes(e, t.size);
    (t.depth = void 0 !== t.height ? t.height : 50),
      void 0 === t.bevelThickness && (t.bevelThickness = 10),
      void 0 === t.bevelSize && (t.bevelSize = 8),
      void 0 === t.bevelEnabled && (t.bevelEnabled = !1),
      super(r, t),
      (this.type = "TextBufferGeometry");
  }
}
class TextGeometry extends Geometry {
  constructor(e, t) {
    super(),
      (this.type = "TextGeometry"),
      (this.parameters = { text: e, parameters: t }),
      this.fromBufferGeometry(new TextBufferGeometry(e, t)),
      this.mergeVertices();
  }
}
class TorusBufferGeometry extends BufferGeometry {
  constructor(e, t, n, r, i) {
    super(),
      (this.type = "TorusBufferGeometry"),
      (this.parameters = {
        radius: e,
        tube: t,
        radialSegments: n,
        tubularSegments: r,
        arc: i
      }),
      (e = e || 1),
      (t = t || 0.4),
      (n = Math.floor(n) || 8),
      (r = Math.floor(r) || 6),
      (i = i || 2 * Math.PI);
    const o = [],
      a = [],
      s = [],
      c = [],
      l = new Vector3(),
      h = new Vector3(),
      u = new Vector3();
    for (let o = 0; o <= n; o++)
      for (let d = 0; d <= r; d++) {
        const p = (d / r) * i,
          m = (o / n) * Math.PI * 2;
        (h.x = (e + t * Math.cos(m)) * Math.cos(p)),
          (h.y = (e + t * Math.cos(m)) * Math.sin(p)),
          (h.z = t * Math.sin(m)),
          a.push(h.x, h.y, h.z),
          (l.x = e * Math.cos(p)),
          (l.y = e * Math.sin(p)),
          u.subVectors(h, l).normalize(),
          s.push(u.x, u.y, u.z),
          c.push(d / r),
          c.push(o / n);
      }
    for (let e = 1; e <= n; e++)
      for (let t = 1; t <= r; t++) {
        const n = (r + 1) * e + t - 1,
          i = (r + 1) * (e - 1) + t - 1,
          a = (r + 1) * (e - 1) + t,
          s = (r + 1) * e + t;
        o.push(n, i, s), o.push(i, a, s);
      }
    this.setIndex(o),
      this.setAttribute("position", new Float32BufferAttribute(a, 3)),
      this.setAttribute("normal", new Float32BufferAttribute(s, 3)),
      this.setAttribute("uv", new Float32BufferAttribute(c, 2));
  }
}
class TorusGeometry extends Geometry {
  constructor(e, t, n, r, i) {
    super(),
      (this.type = "TorusGeometry"),
      (this.parameters = {
        radius: e,
        tube: t,
        radialSegments: n,
        tubularSegments: r,
        arc: i
      }),
      this.fromBufferGeometry(new TorusBufferGeometry(e, t, n, r, i)),
      this.mergeVertices();
  }
}
class TorusKnotBufferGeometry extends BufferGeometry {
  constructor(e, t, n, r, i, o) {
    super(),
      (this.type = "TorusKnotBufferGeometry"),
      (this.parameters = {
        radius: e,
        tube: t,
        tubularSegments: n,
        radialSegments: r,
        p: i,
        q: o
      }),
      (e = e || 1),
      (t = t || 0.4),
      (n = Math.floor(n) || 64),
      (r = Math.floor(r) || 8),
      (i = i || 2),
      (o = o || 3);
    const a = [],
      s = [],
      c = [],
      l = [],
      h = new Vector3(),
      u = new Vector3(),
      d = new Vector3(),
      p = new Vector3(),
      m = new Vector3(),
      f = new Vector3(),
      g = new Vector3();
    for (let a = 0; a <= n; ++a) {
      const y = (a / n) * i * Math.PI * 2;
      v(y, i, o, e, d),
        v(y + 0.01, i, o, e, p),
        f.subVectors(p, d),
        g.addVectors(p, d),
        m.crossVectors(f, g),
        g.crossVectors(m, f),
        m.normalize(),
        g.normalize();
      for (let e = 0; e <= r; ++e) {
        const i = (e / r) * Math.PI * 2,
          o = -t * Math.cos(i),
          p = t * Math.sin(i);
        (h.x = d.x + (o * g.x + p * m.x)),
          (h.y = d.y + (o * g.y + p * m.y)),
          (h.z = d.z + (o * g.z + p * m.z)),
          s.push(h.x, h.y, h.z),
          u.subVectors(h, d).normalize(),
          c.push(u.x, u.y, u.z),
          l.push(a / n),
          l.push(e / r);
      }
    }
    for (let e = 1; e <= n; e++)
      for (let t = 1; t <= r; t++) {
        const n = (r + 1) * (e - 1) + (t - 1),
          i = (r + 1) * e + (t - 1),
          o = (r + 1) * e + t,
          s = (r + 1) * (e - 1) + t;
        a.push(n, i, s), a.push(i, o, s);
      }
    function v(e, t, n, r, i) {
      const o = Math.cos(e),
        a = Math.sin(e),
        s = (n / t) * e,
        c = Math.cos(s);
      (i.x = r * (2 + c) * 0.5 * o),
        (i.y = r * (2 + c) * a * 0.5),
        (i.z = r * Math.sin(s) * 0.5);
    }
    this.setIndex(a),
      this.setAttribute("position", new Float32BufferAttribute(s, 3)),
      this.setAttribute("normal", new Float32BufferAttribute(c, 3)),
      this.setAttribute("uv", new Float32BufferAttribute(l, 2));
  }
}
class TorusKnotGeometry extends Geometry {
  constructor(e, t, n, r, i, o, a) {
    super(),
      (this.type = "TorusKnotGeometry"),
      (this.parameters = {
        radius: e,
        tube: t,
        tubularSegments: n,
        radialSegments: r,
        p: i,
        q: o
      }),
      void 0 !== a &&
        console.warn(
          "THREE.TorusKnotGeometry: heightScale has been deprecated. Use .scale( x, y, z ) instead."
        ),
      this.fromBufferGeometry(new TorusKnotBufferGeometry(e, t, n, r, i, o)),
      this.mergeVertices();
  }
}
class TubeBufferGeometry extends BufferGeometry {
  constructor(e, t, n, r, i) {
    super(),
      (this.type = "TubeBufferGeometry"),
      (this.parameters = {
        path: e,
        tubularSegments: t,
        radius: n,
        radialSegments: r,
        closed: i
      }),
      (t = t || 64),
      (n = n || 1),
      (r = r || 8),
      (i = i || !1);
    const o = e.computeFrenetFrames(t, i);
    (this.tangents = o.tangents),
      (this.normals = o.normals),
      (this.binormals = o.binormals);
    const a = new Vector3(),
      s = new Vector3(),
      c = new Vector2();
    let l = new Vector3();
    const h = [],
      u = [],
      d = [],
      p = [];
    function m(i) {
      l = e.getPointAt(i / t, l);
      const c = o.normals[i],
        d = o.binormals[i];
      for (let e = 0; e <= r; e++) {
        const t = (e / r) * Math.PI * 2,
          i = Math.sin(t),
          o = -Math.cos(t);
        (s.x = o * c.x + i * d.x),
          (s.y = o * c.y + i * d.y),
          (s.z = o * c.z + i * d.z),
          s.normalize(),
          u.push(s.x, s.y, s.z),
          (a.x = l.x + n * s.x),
          (a.y = l.y + n * s.y),
          (a.z = l.z + n * s.z),
          h.push(a.x, a.y, a.z);
      }
    }
    !(function () {
      for (let e = 0; e < t; e++) m(e);
      m(!1 === i ? t : 0),
        (function () {
          for (let e = 0; e <= t; e++)
            for (let n = 0; n <= r; n++)
              (c.x = e / t), (c.y = n / r), d.push(c.x, c.y);
        })(),
        (function () {
          for (let e = 1; e <= t; e++)
            for (let t = 1; t <= r; t++) {
              const n = (r + 1) * (e - 1) + (t - 1),
                i = (r + 1) * e + (t - 1),
                o = (r + 1) * e + t,
                a = (r + 1) * (e - 1) + t;
              p.push(n, i, a), p.push(i, o, a);
            }
        })();
    })(),
      this.setIndex(p),
      this.setAttribute("position", new Float32BufferAttribute(h, 3)),
      this.setAttribute("normal", new Float32BufferAttribute(u, 3)),
      this.setAttribute("uv", new Float32BufferAttribute(d, 2));
  }
  toJSON() {
    const e = BufferGeometry.prototype.toJSON.call(this);
    return (e.path = this.parameters.path.toJSON()), e;
  }
}
class TubeGeometry extends Geometry {
  constructor(e, t, n, r, i, o) {
    super(),
      (this.type = "TubeGeometry"),
      (this.parameters = {
        path: e,
        tubularSegments: t,
        radius: n,
        radialSegments: r,
        closed: i
      }),
      void 0 !== o &&
        console.warn("THREE.TubeGeometry: taper has been removed.");
    const a = new TubeBufferGeometry(e, t, n, r, i);
    (this.tangents = a.tangents),
      (this.normals = a.normals),
      (this.binormals = a.binormals),
      this.fromBufferGeometry(a),
      this.mergeVertices();
  }
}
class WireframeGeometry extends BufferGeometry {
  constructor(e) {
    super(), (this.type = "WireframeGeometry");
    const t = [],
      n = [0, 0],
      r = {},
      i = ["a", "b", "c"];
    if (e && e.isGeometry) {
      const o = e.faces;
      for (let e = 0, t = o.length; e < t; e++) {
        const t = o[e];
        for (let e = 0; e < 3; e++) {
          const o = t[i[e]],
            a = t[i[(e + 1) % 3]];
          (n[0] = Math.min(o, a)), (n[1] = Math.max(o, a));
          const s = n[0] + "," + n[1];
          void 0 === r[s] && (r[s] = { index1: n[0], index2: n[1] });
        }
      }
      for (const n in r) {
        const i = r[n];
        let o = e.vertices[i.index1];
        t.push(o.x, o.y, o.z),
          (o = e.vertices[i.index2]),
          t.push(o.x, o.y, o.z);
      }
    } else if (e && e.isBufferGeometry) {
      const i = new Vector3();
      if (null !== e.index) {
        const o = e.attributes.position,
          a = e.index;
        let s = e.groups;
        0 === s.length &&
          (s = [{ start: 0, count: a.count, materialIndex: 0 }]);
        for (let e = 0, t = s.length; e < t; ++e) {
          const t = s[e],
            i = t.start;
          for (let e = i, o = i + t.count; e < o; e += 3)
            for (let t = 0; t < 3; t++) {
              const i = a.getX(e + t),
                o = a.getX(e + ((t + 1) % 3));
              (n[0] = Math.min(i, o)), (n[1] = Math.max(i, o));
              const s = n[0] + "," + n[1];
              void 0 === r[s] && (r[s] = { index1: n[0], index2: n[1] });
            }
        }
        for (const e in r) {
          const n = r[e];
          i.fromBufferAttribute(o, n.index1),
            t.push(i.x, i.y, i.z),
            i.fromBufferAttribute(o, n.index2),
            t.push(i.x, i.y, i.z);
        }
      } else {
        const n = e.attributes.position;
        for (let e = 0, r = n.count / 3; e < r; e++)
          for (let r = 0; r < 3; r++) {
            const o = 3 * e + r;
            i.fromBufferAttribute(n, o), t.push(i.x, i.y, i.z);
            const a = 3 * e + ((r + 1) % 3);
            i.fromBufferAttribute(n, a), t.push(i.x, i.y, i.z);
          }
      }
    }
    this.setAttribute("position", new Float32BufferAttribute(t, 3));
  }
}
var Geometries = Object.freeze({
  __proto__: null,
  BoxGeometry: BoxGeometry,
  BoxBufferGeometry: BoxBufferGeometry,
  CircleGeometry: CircleGeometry,
  CircleBufferGeometry: CircleBufferGeometry,
  ConeGeometry: ConeGeometry,
  ConeBufferGeometry: ConeBufferGeometry,
  CylinderGeometry: CylinderGeometry,
  CylinderBufferGeometry: CylinderBufferGeometry,
  DodecahedronGeometry: DodecahedronGeometry,
  DodecahedronBufferGeometry: DodecahedronBufferGeometry,
  EdgesGeometry: EdgesGeometry,
  ExtrudeGeometry: ExtrudeGeometry,
  ExtrudeBufferGeometry: ExtrudeBufferGeometry,
  IcosahedronGeometry: IcosahedronGeometry,
  IcosahedronBufferGeometry: IcosahedronBufferGeometry,
  LatheGeometry: LatheGeometry,
  LatheBufferGeometry: LatheBufferGeometry,
  OctahedronGeometry: OctahedronGeometry,
  OctahedronBufferGeometry: OctahedronBufferGeometry,
  ParametricGeometry: ParametricGeometry,
  ParametricBufferGeometry: ParametricBufferGeometry,
  PlaneGeometry: PlaneGeometry,
  PlaneBufferGeometry: PlaneBufferGeometry,
  PolyhedronGeometry: PolyhedronGeometry,
  PolyhedronBufferGeometry: PolyhedronBufferGeometry,
  RingGeometry: RingGeometry,
  RingBufferGeometry: RingBufferGeometry,
  ShapeGeometry: ShapeGeometry,
  ShapeBufferGeometry: ShapeBufferGeometry,
  SphereGeometry: SphereGeometry,
  SphereBufferGeometry: SphereBufferGeometry,
  TetrahedronGeometry: TetrahedronGeometry,
  TetrahedronBufferGeometry: TetrahedronBufferGeometry,
  TextGeometry: TextGeometry,
  TextBufferGeometry: TextBufferGeometry,
  TorusGeometry: TorusGeometry,
  TorusBufferGeometry: TorusBufferGeometry,
  TorusKnotGeometry: TorusKnotGeometry,
  TorusKnotBufferGeometry: TorusKnotBufferGeometry,
  TubeGeometry: TubeGeometry,
  TubeBufferGeometry: TubeBufferGeometry,
  WireframeGeometry: WireframeGeometry
});
function ShadowMaterial(e) {
  Material.call(this),
    (this.type = "ShadowMaterial"),
    (this.color = new Color(0)),
    (this.transparent = !0),
    this.setValues(e);
}
function RawShaderMaterial(e) {
  ShaderMaterial.call(this, e), (this.type = "RawShaderMaterial");
}
function MeshStandardMaterial(e) {
  Material.call(this),
    (this.defines = { STANDARD: "" }),
    (this.type = "MeshStandardMaterial"),
    (this.color = new Color(16777215)),
    (this.roughness = 1),
    (this.metalness = 0),
    (this.map = null),
    (this.lightMap = null),
    (this.lightMapIntensity = 1),
    (this.aoMap = null),
    (this.aoMapIntensity = 1),
    (this.emissive = new Color(0)),
    (this.emissiveIntensity = 1),
    (this.emissiveMap = null),
    (this.bumpMap = null),
    (this.bumpScale = 1),
    (this.normalMap = null),
    (this.normalMapType = TangentSpaceNormalMap),
    (this.normalScale = new Vector2(1, 1)),
    (this.displacementMap = null),
    (this.displacementScale = 1),
    (this.displacementBias = 0),
    (this.roughnessMap = null),
    (this.metalnessMap = null),
    (this.alphaMap = null),
    (this.envMap = null),
    (this.envMapIntensity = 1),
    (this.refractionRatio = 0.98),
    (this.wireframe = !1),
    (this.wireframeLinewidth = 1),
    (this.wireframeLinecap = "round"),
    (this.wireframeLinejoin = "round"),
    (this.skinning = !1),
    (this.morphTargets = !1),
    (this.morphNormals = !1),
    (this.vertexTangents = !1),
    this.setValues(e);
}
function MeshPhysicalMaterial(e) {
  MeshStandardMaterial.call(this),
    (this.defines = { STANDARD: "", PHYSICAL: "" }),
    (this.type = "MeshPhysicalMaterial"),
    (this.clearcoat = 0),
    (this.clearcoatMap = null),
    (this.clearcoatRoughness = 0),
    (this.clearcoatRoughnessMap = null),
    (this.clearcoatNormalScale = new Vector2(1, 1)),
    (this.clearcoatNormalMap = null),
    (this.reflectivity = 0.5),
    Object.defineProperty(this, "ior", {
      get: function () {
        return (1 + 0.4 * this.reflectivity) / (1 - 0.4 * this.reflectivity);
      },
      set: function (e) {
        this.reflectivity = MathUtils.clamp((2.5 * (e - 1)) / (e + 1), 0, 1);
      }
    }),
    (this.sheen = null),
    (this.transmission = 0),
    (this.transmissionMap = null),
    this.setValues(e);
}
function MeshPhongMaterial(e) {
  Material.call(this),
    (this.type = "MeshPhongMaterial"),
    (this.color = new Color(16777215)),
    (this.specular = new Color(1118481)),
    (this.shininess = 30),
    (this.map = null),
    (this.lightMap = null),
    (this.lightMapIntensity = 1),
    (this.aoMap = null),
    (this.aoMapIntensity = 1),
    (this.emissive = new Color(0)),
    (this.emissiveIntensity = 1),
    (this.emissiveMap = null),
    (this.bumpMap = null),
    (this.bumpScale = 1),
    (this.normalMap = null),
    (this.normalMapType = TangentSpaceNormalMap),
    (this.normalScale = new Vector2(1, 1)),
    (this.displacementMap = null),
    (this.displacementScale = 1),
    (this.displacementBias = 0),
    (this.specularMap = null),
    (this.alphaMap = null),
    (this.envMap = null),
    (this.combine = MultiplyOperation),
    (this.reflectivity = 1),
    (this.refractionRatio = 0.98),
    (this.wireframe = !1),
    (this.wireframeLinewidth = 1),
    (this.wireframeLinecap = "round"),
    (this.wireframeLinejoin = "round"),
    (this.skinning = !1),
    (this.morphTargets = !1),
    (this.morphNormals = !1),
    this.setValues(e);
}
function MeshToonMaterial(e) {
  Material.call(this),
    (this.defines = { TOON: "" }),
    (this.type = "MeshToonMaterial"),
    (this.color = new Color(16777215)),
    (this.map = null),
    (this.gradientMap = null),
    (this.lightMap = null),
    (this.lightMapIntensity = 1),
    (this.aoMap = null),
    (this.aoMapIntensity = 1),
    (this.emissive = new Color(0)),
    (this.emissiveIntensity = 1),
    (this.emissiveMap = null),
    (this.bumpMap = null),
    (this.bumpScale = 1),
    (this.normalMap = null),
    (this.normalMapType = TangentSpaceNormalMap),
    (this.normalScale = new Vector2(1, 1)),
    (this.displacementMap = null),
    (this.displacementScale = 1),
    (this.displacementBias = 0),
    (this.alphaMap = null),
    (this.wireframe = !1),
    (this.wireframeLinewidth = 1),
    (this.wireframeLinecap = "round"),
    (this.wireframeLinejoin = "round"),
    (this.skinning = !1),
    (this.morphTargets = !1),
    (this.morphNormals = !1),
    this.setValues(e);
}
function MeshNormalMaterial(e) {
  Material.call(this),
    (this.type = "MeshNormalMaterial"),
    (this.bumpMap = null),
    (this.bumpScale = 1),
    (this.normalMap = null),
    (this.normalMapType = TangentSpaceNormalMap),
    (this.normalScale = new Vector2(1, 1)),
    (this.displacementMap = null),
    (this.displacementScale = 1),
    (this.displacementBias = 0),
    (this.wireframe = !1),
    (this.wireframeLinewidth = 1),
    (this.fog = !1),
    (this.skinning = !1),
    (this.morphTargets = !1),
    (this.morphNormals = !1),
    this.setValues(e);
}
function MeshLambertMaterial(e) {
  Material.call(this),
    (this.type = "MeshLambertMaterial"),
    (this.color = new Color(16777215)),
    (this.map = null),
    (this.lightMap = null),
    (this.lightMapIntensity = 1),
    (this.aoMap = null),
    (this.aoMapIntensity = 1),
    (this.emissive = new Color(0)),
    (this.emissiveIntensity = 1),
    (this.emissiveMap = null),
    (this.specularMap = null),
    (this.alphaMap = null),
    (this.envMap = null),
    (this.combine = MultiplyOperation),
    (this.reflectivity = 1),
    (this.refractionRatio = 0.98),
    (this.wireframe = !1),
    (this.wireframeLinewidth = 1),
    (this.wireframeLinecap = "round"),
    (this.wireframeLinejoin = "round"),
    (this.skinning = !1),
    (this.morphTargets = !1),
    (this.morphNormals = !1),
    this.setValues(e);
}
function MeshMatcapMaterial(e) {
  Material.call(this),
    (this.defines = { MATCAP: "" }),
    (this.type = "MeshMatcapMaterial"),
    (this.color = new Color(16777215)),
    (this.matcap = null),
    (this.map = null),
    (this.bumpMap = null),
    (this.bumpScale = 1),
    (this.normalMap = null),
    (this.normalMapType = TangentSpaceNormalMap),
    (this.normalScale = new Vector2(1, 1)),
    (this.displacementMap = null),
    (this.displacementScale = 1),
    (this.displacementBias = 0),
    (this.alphaMap = null),
    (this.skinning = !1),
    (this.morphTargets = !1),
    (this.morphNormals = !1),
    this.setValues(e);
}
function LineDashedMaterial(e) {
  LineBasicMaterial.call(this),
    (this.type = "LineDashedMaterial"),
    (this.scale = 1),
    (this.dashSize = 3),
    (this.gapSize = 1),
    this.setValues(e);
}
(ShadowMaterial.prototype = Object.create(Material.prototype)),
  (ShadowMaterial.prototype.constructor = ShadowMaterial),
  (ShadowMaterial.prototype.isShadowMaterial = !0),
  (ShadowMaterial.prototype.copy = function (e) {
    return (
      Material.prototype.copy.call(this, e), this.color.copy(e.color), this
    );
  }),
  (RawShaderMaterial.prototype = Object.create(ShaderMaterial.prototype)),
  (RawShaderMaterial.prototype.constructor = RawShaderMaterial),
  (RawShaderMaterial.prototype.isRawShaderMaterial = !0),
  (MeshStandardMaterial.prototype = Object.create(Material.prototype)),
  (MeshStandardMaterial.prototype.constructor = MeshStandardMaterial),
  (MeshStandardMaterial.prototype.isMeshStandardMaterial = !0),
  (MeshStandardMaterial.prototype.copy = function (e) {
    return (
      Material.prototype.copy.call(this, e),
      (this.defines = { STANDARD: "" }),
      this.color.copy(e.color),
      (this.roughness = e.roughness),
      (this.metalness = e.metalness),
      (this.map = e.map),
      (this.lightMap = e.lightMap),
      (this.lightMapIntensity = e.lightMapIntensity),
      (this.aoMap = e.aoMap),
      (this.aoMapIntensity = e.aoMapIntensity),
      this.emissive.copy(e.emissive),
      (this.emissiveMap = e.emissiveMap),
      (this.emissiveIntensity = e.emissiveIntensity),
      (this.bumpMap = e.bumpMap),
      (this.bumpScale = e.bumpScale),
      (this.normalMap = e.normalMap),
      (this.normalMapType = e.normalMapType),
      this.normalScale.copy(e.normalScale),
      (this.displacementMap = e.displacementMap),
      (this.displacementScale = e.displacementScale),
      (this.displacementBias = e.displacementBias),
      (this.roughnessMap = e.roughnessMap),
      (this.metalnessMap = e.metalnessMap),
      (this.alphaMap = e.alphaMap),
      (this.envMap = e.envMap),
      (this.envMapIntensity = e.envMapIntensity),
      (this.refractionRatio = e.refractionRatio),
      (this.wireframe = e.wireframe),
      (this.wireframeLinewidth = e.wireframeLinewidth),
      (this.wireframeLinecap = e.wireframeLinecap),
      (this.wireframeLinejoin = e.wireframeLinejoin),
      (this.skinning = e.skinning),
      (this.morphTargets = e.morphTargets),
      (this.morphNormals = e.morphNormals),
      (this.vertexTangents = e.vertexTangents),
      this
    );
  }),
  (MeshPhysicalMaterial.prototype = Object.create(
    MeshStandardMaterial.prototype
  )),
  (MeshPhysicalMaterial.prototype.constructor = MeshPhysicalMaterial),
  (MeshPhysicalMaterial.prototype.isMeshPhysicalMaterial = !0),
  (MeshPhysicalMaterial.prototype.copy = function (e) {
    return (
      MeshStandardMaterial.prototype.copy.call(this, e),
      (this.defines = { STANDARD: "", PHYSICAL: "" }),
      (this.clearcoat = e.clearcoat),
      (this.clearcoatMap = e.clearcoatMap),
      (this.clearcoatRoughness = e.clearcoatRoughness),
      (this.clearcoatRoughnessMap = e.clearcoatRoughnessMap),
      (this.clearcoatNormalMap = e.clearcoatNormalMap),
      this.clearcoatNormalScale.copy(e.clearcoatNormalScale),
      (this.reflectivity = e.reflectivity),
      e.sheen
        ? (this.sheen = (this.sheen || new Color()).copy(e.sheen))
        : (this.sheen = null),
      (this.transmission = e.transmission),
      (this.transmissionMap = e.transmissionMap),
      this
    );
  }),
  (MeshPhongMaterial.prototype = Object.create(Material.prototype)),
  (MeshPhongMaterial.prototype.constructor = MeshPhongMaterial),
  (MeshPhongMaterial.prototype.isMeshPhongMaterial = !0),
  (MeshPhongMaterial.prototype.copy = function (e) {
    return (
      Material.prototype.copy.call(this, e),
      this.color.copy(e.color),
      this.specular.copy(e.specular),
      (this.shininess = e.shininess),
      (this.map = e.map),
      (this.lightMap = e.lightMap),
      (this.lightMapIntensity = e.lightMapIntensity),
      (this.aoMap = e.aoMap),
      (this.aoMapIntensity = e.aoMapIntensity),
      this.emissive.copy(e.emissive),
      (this.emissiveMap = e.emissiveMap),
      (this.emissiveIntensity = e.emissiveIntensity),
      (this.bumpMap = e.bumpMap),
      (this.bumpScale = e.bumpScale),
      (this.normalMap = e.normalMap),
      (this.normalMapType = e.normalMapType),
      this.normalScale.copy(e.normalScale),
      (this.displacementMap = e.displacementMap),
      (this.displacementScale = e.displacementScale),
      (this.displacementBias = e.displacementBias),
      (this.specularMap = e.specularMap),
      (this.alphaMap = e.alphaMap),
      (this.envMap = e.envMap),
      (this.combine = e.combine),
      (this.reflectivity = e.reflectivity),
      (this.refractionRatio = e.refractionRatio),
      (this.wireframe = e.wireframe),
      (this.wireframeLinewidth = e.wireframeLinewidth),
      (this.wireframeLinecap = e.wireframeLinecap),
      (this.wireframeLinejoin = e.wireframeLinejoin),
      (this.skinning = e.skinning),
      (this.morphTargets = e.morphTargets),
      (this.morphNormals = e.morphNormals),
      this
    );
  }),
  (MeshToonMaterial.prototype = Object.create(Material.prototype)),
  (MeshToonMaterial.prototype.constructor = MeshToonMaterial),
  (MeshToonMaterial.prototype.isMeshToonMaterial = !0),
  (MeshToonMaterial.prototype.copy = function (e) {
    return (
      Material.prototype.copy.call(this, e),
      this.color.copy(e.color),
      (this.map = e.map),
      (this.gradientMap = e.gradientMap),
      (this.lightMap = e.lightMap),
      (this.lightMapIntensity = e.lightMapIntensity),
      (this.aoMap = e.aoMap),
      (this.aoMapIntensity = e.aoMapIntensity),
      this.emissive.copy(e.emissive),
      (this.emissiveMap = e.emissiveMap),
      (this.emissiveIntensity = e.emissiveIntensity),
      (this.bumpMap = e.bumpMap),
      (this.bumpScale = e.bumpScale),
      (this.normalMap = e.normalMap),
      (this.normalMapType = e.normalMapType),
      this.normalScale.copy(e.normalScale),
      (this.displacementMap = e.displacementMap),
      (this.displacementScale = e.displacementScale),
      (this.displacementBias = e.displacementBias),
      (this.alphaMap = e.alphaMap),
      (this.wireframe = e.wireframe),
      (this.wireframeLinewidth = e.wireframeLinewidth),
      (this.wireframeLinecap = e.wireframeLinecap),
      (this.wireframeLinejoin = e.wireframeLinejoin),
      (this.skinning = e.skinning),
      (this.morphTargets = e.morphTargets),
      (this.morphNormals = e.morphNormals),
      this
    );
  }),
  (MeshNormalMaterial.prototype = Object.create(Material.prototype)),
  (MeshNormalMaterial.prototype.constructor = MeshNormalMaterial),
  (MeshNormalMaterial.prototype.isMeshNormalMaterial = !0),
  (MeshNormalMaterial.prototype.copy = function (e) {
    return (
      Material.prototype.copy.call(this, e),
      (this.bumpMap = e.bumpMap),
      (this.bumpScale = e.bumpScale),
      (this.normalMap = e.normalMap),
      (this.normalMapType = e.normalMapType),
      this.normalScale.copy(e.normalScale),
      (this.displacementMap = e.displacementMap),
      (this.displacementScale = e.displacementScale),
      (this.displacementBias = e.displacementBias),
      (this.wireframe = e.wireframe),
      (this.wireframeLinewidth = e.wireframeLinewidth),
      (this.skinning = e.skinning),
      (this.morphTargets = e.morphTargets),
      (this.morphNormals = e.morphNormals),
      this
    );
  }),
  (MeshLambertMaterial.prototype = Object.create(Material.prototype)),
  (MeshLambertMaterial.prototype.constructor = MeshLambertMaterial),
  (MeshLambertMaterial.prototype.isMeshLambertMaterial = !0),
  (MeshLambertMaterial.prototype.copy = function (e) {
    return (
      Material.prototype.copy.call(this, e),
      this.color.copy(e.color),
      (this.map = e.map),
      (this.lightMap = e.lightMap),
      (this.lightMapIntensity = e.lightMapIntensity),
      (this.aoMap = e.aoMap),
      (this.aoMapIntensity = e.aoMapIntensity),
      this.emissive.copy(e.emissive),
      (this.emissiveMap = e.emissiveMap),
      (this.emissiveIntensity = e.emissiveIntensity),
      (this.specularMap = e.specularMap),
      (this.alphaMap = e.alphaMap),
      (this.envMap = e.envMap),
      (this.combine = e.combine),
      (this.reflectivity = e.reflectivity),
      (this.refractionRatio = e.refractionRatio),
      (this.wireframe = e.wireframe),
      (this.wireframeLinewidth = e.wireframeLinewidth),
      (this.wireframeLinecap = e.wireframeLinecap),
      (this.wireframeLinejoin = e.wireframeLinejoin),
      (this.skinning = e.skinning),
      (this.morphTargets = e.morphTargets),
      (this.morphNormals = e.morphNormals),
      this
    );
  }),
  (MeshMatcapMaterial.prototype = Object.create(Material.prototype)),
  (MeshMatcapMaterial.prototype.constructor = MeshMatcapMaterial),
  (MeshMatcapMaterial.prototype.isMeshMatcapMaterial = !0),
  (MeshMatcapMaterial.prototype.copy = function (e) {
    return (
      Material.prototype.copy.call(this, e),
      (this.defines = { MATCAP: "" }),
      this.color.copy(e.color),
      (this.matcap = e.matcap),
      (this.map = e.map),
      (this.bumpMap = e.bumpMap),
      (this.bumpScale = e.bumpScale),
      (this.normalMap = e.normalMap),
      (this.normalMapType = e.normalMapType),
      this.normalScale.copy(e.normalScale),
      (this.displacementMap = e.displacementMap),
      (this.displacementScale = e.displacementScale),
      (this.displacementBias = e.displacementBias),
      (this.alphaMap = e.alphaMap),
      (this.skinning = e.skinning),
      (this.morphTargets = e.morphTargets),
      (this.morphNormals = e.morphNormals),
      this
    );
  }),
  (LineDashedMaterial.prototype = Object.create(LineBasicMaterial.prototype)),
  (LineDashedMaterial.prototype.constructor = LineDashedMaterial),
  (LineDashedMaterial.prototype.isLineDashedMaterial = !0),
  (LineDashedMaterial.prototype.copy = function (e) {
    return (
      LineBasicMaterial.prototype.copy.call(this, e),
      (this.scale = e.scale),
      (this.dashSize = e.dashSize),
      (this.gapSize = e.gapSize),
      this
    );
  });
var Materials = Object.freeze({
  __proto__: null,
  ShadowMaterial: ShadowMaterial,
  SpriteMaterial: SpriteMaterial,
  RawShaderMaterial: RawShaderMaterial,
  ShaderMaterial: ShaderMaterial,
  PointsMaterial: PointsMaterial,
  MeshPhysicalMaterial: MeshPhysicalMaterial,
  MeshStandardMaterial: MeshStandardMaterial,
  MeshPhongMaterial: MeshPhongMaterial,
  MeshToonMaterial: MeshToonMaterial,
  MeshNormalMaterial: MeshNormalMaterial,
  MeshLambertMaterial: MeshLambertMaterial,
  MeshDepthMaterial: MeshDepthMaterial,
  MeshDistanceMaterial: MeshDistanceMaterial,
  MeshBasicMaterial: MeshBasicMaterial,
  MeshMatcapMaterial: MeshMatcapMaterial,
  LineDashedMaterial: LineDashedMaterial,
  LineBasicMaterial: LineBasicMaterial,
  Material: Material
});
const AnimationUtils = {
  arraySlice: function (e, t, n) {
    return AnimationUtils.isTypedArray(e)
      ? new e.constructor(e.subarray(t, void 0 !== n ? n : e.length))
      : e.slice(t, n);
  },
  convertArray: function (e, t, n) {
    return !e || (!n && e.constructor === t)
      ? e
      : "number" == typeof t.BYTES_PER_ELEMENT
      ? new t(e)
      : Array.prototype.slice.call(e);
  },
  isTypedArray: function (e) {
    return ArrayBuffer.isView(e) && !(e instanceof DataView);
  },
  getKeyframeOrder: function (e) {
    const t = e.length,
      n = new Array(t);
    for (let e = 0; e !== t; ++e) n[e] = e;
    return (
      n.sort(function (t, n) {
        return e[t] - e[n];
      }),
      n
    );
  },
  sortedArray: function (e, t, n) {
    const r = e.length,
      i = new e.constructor(r);
    for (let o = 0, a = 0; a !== r; ++o) {
      const r = n[o] * t;
      for (let n = 0; n !== t; ++n) i[a++] = e[r + n];
    }
    return i;
  },
  flattenJSON: function (e, t, n, r) {
    let i = 1,
      o = e[0];
    for (; void 0 !== o && void 0 === o[r]; ) o = e[i++];
    if (void 0 === o) return;
    let a = o[r];
    if (void 0 !== a)
      if (Array.isArray(a))
        do {
          void 0 !== (a = o[r]) && (t.push(o.time), n.push.apply(n, a)),
            (o = e[i++]);
        } while (void 0 !== o);
      else if (void 0 !== a.toArray)
        do {
          void 0 !== (a = o[r]) && (t.push(o.time), a.toArray(n, n.length)),
            (o = e[i++]);
        } while (void 0 !== o);
      else
        do {
          void 0 !== (a = o[r]) && (t.push(o.time), n.push(a)), (o = e[i++]);
        } while (void 0 !== o);
  },
  subclip: function (e, t, n, r, i) {
    i = i || 30;
    const o = e.clone();
    o.name = t;
    const a = [];
    for (let e = 0; e < o.tracks.length; ++e) {
      const t = o.tracks[e],
        s = t.getValueSize(),
        c = [],
        l = [];
      for (let e = 0; e < t.times.length; ++e) {
        const o = t.times[e] * i;
        if (!(o < n || o >= r)) {
          c.push(t.times[e]);
          for (let n = 0; n < s; ++n) l.push(t.values[e * s + n]);
        }
      }
      0 !== c.length &&
        ((t.times = AnimationUtils.convertArray(c, t.times.constructor)),
        (t.values = AnimationUtils.convertArray(l, t.values.constructor)),
        a.push(t));
    }
    o.tracks = a;
    let s = 1 / 0;
    for (let e = 0; e < o.tracks.length; ++e)
      s > o.tracks[e].times[0] && (s = o.tracks[e].times[0]);
    for (let e = 0; e < o.tracks.length; ++e) o.tracks[e].shift(-1 * s);
    return o.resetDuration(), o;
  },
  makeClipAdditive: function (e, t, n, r) {
    void 0 === t && (t = 0),
      void 0 === n && (n = e),
      (void 0 === r || r <= 0) && (r = 30);
    const i = n.tracks.length,
      o = t / r;
    for (let t = 0; t < i; ++t) {
      const r = n.tracks[t],
        i = r.ValueTypeName;
      if ("bool" === i || "string" === i) continue;
      const a = e.tracks.find(function (e) {
        return e.name === r.name && e.ValueTypeName === i;
      });
      if (void 0 === a) continue;
      let s = 0;
      const c = r.getValueSize();
      r.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline &&
        (s = c / 3);
      let l = 0;
      const h = a.getValueSize();
      a.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline &&
        (l = h / 3);
      const u = r.times.length - 1;
      let d;
      if (o <= r.times[0]) {
        const e = s,
          t = c - s;
        d = AnimationUtils.arraySlice(r.values, e, t);
      } else if (o >= r.times[u]) {
        const e = u * c + s,
          t = e + c - s;
        d = AnimationUtils.arraySlice(r.values, e, t);
      } else {
        const e = r.createInterpolant(),
          t = s,
          n = c - s;
        e.evaluate(o), (d = AnimationUtils.arraySlice(e.resultBuffer, t, n));
      }
      if ("quaternion" === i) {
        new Quaternion().fromArray(d).normalize().conjugate().toArray(d);
      }
      const p = a.times.length;
      for (let e = 0; e < p; ++e) {
        const t = e * h + l;
        if ("quaternion" === i)
          Quaternion.multiplyQuaternionsFlat(a.values, t, d, 0, a.values, t);
        else {
          const e = h - 2 * l;
          for (let n = 0; n < e; ++n) a.values[t + n] -= d[n];
        }
      }
    }
    return (e.blendMode = AdditiveAnimationBlendMode), e;
  }
};
function Interpolant(e, t, n, r) {
  (this.parameterPositions = e),
    (this._cachedIndex = 0),
    (this.resultBuffer = void 0 !== r ? r : new t.constructor(n)),
    (this.sampleValues = t),
    (this.valueSize = n);
}
function CubicInterpolant(e, t, n, r) {
  Interpolant.call(this, e, t, n, r),
    (this._weightPrev = -0),
    (this._offsetPrev = -0),
    (this._weightNext = -0),
    (this._offsetNext = -0);
}
function LinearInterpolant(e, t, n, r) {
  Interpolant.call(this, e, t, n, r);
}
function DiscreteInterpolant(e, t, n, r) {
  Interpolant.call(this, e, t, n, r);
}
function KeyframeTrack(e, t, n, r) {
  if (void 0 === e)
    throw new Error("THREE.KeyframeTrack: track name is undefined");
  if (void 0 === t || 0 === t.length)
    throw new Error("THREE.KeyframeTrack: no keyframes in track named " + e);
  (this.name = e),
    (this.times = AnimationUtils.convertArray(t, this.TimeBufferType)),
    (this.values = AnimationUtils.convertArray(n, this.ValueBufferType)),
    this.setInterpolation(r || this.DefaultInterpolation);
}
function BooleanKeyframeTrack(e, t, n) {
  KeyframeTrack.call(this, e, t, n);
}
function ColorKeyframeTrack(e, t, n, r) {
  KeyframeTrack.call(this, e, t, n, r);
}
function NumberKeyframeTrack(e, t, n, r) {
  KeyframeTrack.call(this, e, t, n, r);
}
function QuaternionLinearInterpolant(e, t, n, r) {
  Interpolant.call(this, e, t, n, r);
}
function QuaternionKeyframeTrack(e, t, n, r) {
  KeyframeTrack.call(this, e, t, n, r);
}
function StringKeyframeTrack(e, t, n, r) {
  KeyframeTrack.call(this, e, t, n, r);
}
function VectorKeyframeTrack(e, t, n, r) {
  KeyframeTrack.call(this, e, t, n, r);
}
function AnimationClip(e, t, n, r) {
  (this.name = e),
    (this.tracks = n),
    (this.duration = void 0 !== t ? t : -1),
    (this.blendMode = void 0 !== r ? r : NormalAnimationBlendMode),
    (this.uuid = MathUtils.generateUUID()),
    this.duration < 0 && this.resetDuration();
}
function getTrackTypeForValueTypeName(e) {
  switch (e.toLowerCase()) {
    case "scalar":
    case "double":
    case "float":
    case "number":
    case "integer":
      return NumberKeyframeTrack;
    case "vector":
    case "vector2":
    case "vector3":
    case "vector4":
      return VectorKeyframeTrack;
    case "color":
      return ColorKeyframeTrack;
    case "quaternion":
      return QuaternionKeyframeTrack;
    case "bool":
    case "boolean":
      return BooleanKeyframeTrack;
    case "string":
      return StringKeyframeTrack;
  }
  throw new Error("THREE.KeyframeTrack: Unsupported typeName: " + e);
}
function parseKeyframeTrack(e) {
  if (void 0 === e.type)
    throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");
  const t = getTrackTypeForValueTypeName(e.type);
  if (void 0 === e.times) {
    const t = [],
      n = [];
    AnimationUtils.flattenJSON(e.keys, t, n, "value"),
      (e.times = t),
      (e.values = n);
  }
  return void 0 !== t.parse
    ? t.parse(e)
    : new t(e.name, e.times, e.values, e.interpolation);
}
Object.assign(Interpolant.prototype, {
  evaluate: function (e) {
    const t = this.parameterPositions;
    let n = this._cachedIndex,
      r = t[n],
      i = t[n - 1];
    e: {
      t: {
        let o;
        n: {
          r: if (!(e < r)) {
            for (let o = n + 2; ; ) {
              if (void 0 === r) {
                if (e < i) break r;
                return (
                  (n = t.length),
                  (this._cachedIndex = n),
                  this.afterEnd_(n - 1, e, i)
                );
              }
              if (n === o) break;
              if (((i = r), e < (r = t[++n]))) break t;
            }
            o = t.length;
            break n;
          }
          if (e >= i) break e;
          {
            const a = t[1];
            e < a && ((n = 2), (i = a));
            for (let o = n - 2; ; ) {
              if (void 0 === i)
                return (this._cachedIndex = 0), this.beforeStart_(0, e, r);
              if (n === o) break;
              if (((r = i), e >= (i = t[--n - 1]))) break t;
            }
            (o = n), (n = 0);
          }
        }
        for (; n < o; ) {
          const r = (n + o) >>> 1;
          e < t[r] ? (o = r) : (n = r + 1);
        }
        if (((r = t[n]), void 0 === (i = t[n - 1])))
          return (this._cachedIndex = 0), this.beforeStart_(0, e, r);
        if (void 0 === r)
          return (
            (n = t.length), (this._cachedIndex = n), this.afterEnd_(n - 1, i, e)
          );
      }
      (this._cachedIndex = n), this.intervalChanged_(n, i, r);
    }
    return this.interpolate_(n, i, e, r);
  },
  settings: null,
  DefaultSettings_: {},
  getSettings_: function () {
    return this.settings || this.DefaultSettings_;
  },
  copySampleValue_: function (e) {
    const t = this.resultBuffer,
      n = this.sampleValues,
      r = this.valueSize,
      i = e * r;
    for (let e = 0; e !== r; ++e) t[e] = n[i + e];
    return t;
  },
  interpolate_: function () {
    throw new Error("call to abstract method");
  },
  intervalChanged_: function () {}
}),
  Object.assign(Interpolant.prototype, {
    beforeStart_: Interpolant.prototype.copySampleValue_,
    afterEnd_: Interpolant.prototype.copySampleValue_
  }),
  (CubicInterpolant.prototype = Object.assign(
    Object.create(Interpolant.prototype),
    {
      constructor: CubicInterpolant,
      DefaultSettings_: {
        endingStart: ZeroCurvatureEnding,
        endingEnd: ZeroCurvatureEnding
      },
      intervalChanged_: function (e, t, n) {
        const r = this.parameterPositions;
        let i = e - 2,
          o = e + 1,
          a = r[i],
          s = r[o];
        if (void 0 === a)
          switch (this.getSettings_().endingStart) {
            case ZeroSlopeEnding:
              (i = e), (a = 2 * t - n);
              break;
            case WrapAroundEnding:
              a = t + r[(i = r.length - 2)] - r[i + 1];
              break;
            default:
              (i = e), (a = n);
          }
        if (void 0 === s)
          switch (this.getSettings_().endingEnd) {
            case ZeroSlopeEnding:
              (o = e), (s = 2 * n - t);
              break;
            case WrapAroundEnding:
              (o = 1), (s = n + r[1] - r[0]);
              break;
            default:
              (o = e - 1), (s = t);
          }
        const c = 0.5 * (n - t),
          l = this.valueSize;
        (this._weightPrev = c / (t - a)),
          (this._weightNext = c / (s - n)),
          (this._offsetPrev = i * l),
          (this._offsetNext = o * l);
      },
      interpolate_: function (e, t, n, r) {
        const i = this.resultBuffer,
          o = this.sampleValues,
          a = this.valueSize,
          s = e * a,
          c = s - a,
          l = this._offsetPrev,
          h = this._offsetNext,
          u = this._weightPrev,
          d = this._weightNext,
          p = (n - t) / (r - t),
          m = p * p,
          f = m * p,
          g = -u * f + 2 * u * m - u * p,
          v = (1 + u) * f + (-1.5 - 2 * u) * m + (-0.5 + u) * p + 1,
          y = (-1 - d) * f + (1.5 + d) * m + 0.5 * p,
          _ = d * f - d * m;
        for (let e = 0; e !== a; ++e)
          i[e] = g * o[l + e] + v * o[c + e] + y * o[s + e] + _ * o[h + e];
        return i;
      }
    }
  )),
  (LinearInterpolant.prototype = Object.assign(
    Object.create(Interpolant.prototype),
    {
      constructor: LinearInterpolant,
      interpolate_: function (e, t, n, r) {
        const i = this.resultBuffer,
          o = this.sampleValues,
          a = this.valueSize,
          s = e * a,
          c = s - a,
          l = (n - t) / (r - t),
          h = 1 - l;
        for (let e = 0; e !== a; ++e) i[e] = o[c + e] * h + o[s + e] * l;
        return i;
      }
    }
  )),
  (DiscreteInterpolant.prototype = Object.assign(
    Object.create(Interpolant.prototype),
    {
      constructor: DiscreteInterpolant,
      interpolate_: function (e) {
        return this.copySampleValue_(e - 1);
      }
    }
  )),
  Object.assign(KeyframeTrack, {
    toJSON: function (e) {
      const t = e.constructor;
      let n;
      if (void 0 !== t.toJSON) n = t.toJSON(e);
      else {
        n = {
          name: e.name,
          times: AnimationUtils.convertArray(e.times, Array),
          values: AnimationUtils.convertArray(e.values, Array)
        };
        const t = e.getInterpolation();
        t !== e.DefaultInterpolation && (n.interpolation = t);
      }
      return (n.type = e.ValueTypeName), n;
    }
  }),
  Object.assign(KeyframeTrack.prototype, {
    constructor: KeyframeTrack,
    TimeBufferType: Float32Array,
    ValueBufferType: Float32Array,
    DefaultInterpolation: 2301,
    InterpolantFactoryMethodDiscrete: function (e) {
      return new DiscreteInterpolant(
        this.times,
        this.values,
        this.getValueSize(),
        e
      );
    },
    InterpolantFactoryMethodLinear: function (e) {
      return new LinearInterpolant(
        this.times,
        this.values,
        this.getValueSize(),
        e
      );
    },
    InterpolantFactoryMethodSmooth: function (e) {
      return new CubicInterpolant(
        this.times,
        this.values,
        this.getValueSize(),
        e
      );
    },
    setInterpolation: function (e) {
      let t;
      switch (e) {
        case 2300:
          t = this.InterpolantFactoryMethodDiscrete;
          break;
        case 2301:
          t = this.InterpolantFactoryMethodLinear;
          break;
        case 2302:
          t = this.InterpolantFactoryMethodSmooth;
      }
      if (void 0 === t) {
        const t =
          "unsupported interpolation for " +
          this.ValueTypeName +
          " keyframe track named " +
          this.name;
        if (void 0 === this.createInterpolant) {
          if (e === this.DefaultInterpolation) throw new Error(t);
          this.setInterpolation(this.DefaultInterpolation);
        }
        return console.warn("THREE.KeyframeTrack:", t), this;
      }
      return (this.createInterpolant = t), this;
    },
    getInterpolation: function () {
      switch (this.createInterpolant) {
        case this.InterpolantFactoryMethodDiscrete:
          return 2300;
        case this.InterpolantFactoryMethodLinear:
          return 2301;
        case this.InterpolantFactoryMethodSmooth:
          return 2302;
      }
    },
    getValueSize: function () {
      return this.values.length / this.times.length;
    },
    shift: function (e) {
      if (0 !== e) {
        const t = this.times;
        for (let n = 0, r = t.length; n !== r; ++n) t[n] += e;
      }
      return this;
    },
    scale: function (e) {
      if (1 !== e) {
        const t = this.times;
        for (let n = 0, r = t.length; n !== r; ++n) t[n] *= e;
      }
      return this;
    },
    trim: function (e, t) {
      const n = this.times,
        r = n.length;
      let i = 0,
        o = r - 1;
      for (; i !== r && n[i] < e; ) ++i;
      for (; -1 !== o && n[o] > t; ) --o;
      if ((++o, 0 !== i || o !== r)) {
        i >= o && (i = (o = Math.max(o, 1)) - 1);
        const e = this.getValueSize();
        (this.times = AnimationUtils.arraySlice(n, i, o)),
          (this.values = AnimationUtils.arraySlice(this.values, i * e, o * e));
      }
      return this;
    },
    validate: function () {
      let e = !0;
      const t = this.getValueSize();
      t - Math.floor(t) != 0 &&
        (console.error(
          "THREE.KeyframeTrack: Invalid value size in track.",
          this
        ),
        (e = !1));
      const n = this.times,
        r = this.values,
        i = n.length;
      0 === i &&
        (console.error("THREE.KeyframeTrack: Track is empty.", this), (e = !1));
      let o = null;
      for (let t = 0; t !== i; t++) {
        const r = n[t];
        if ("number" == typeof r && isNaN(r)) {
          console.error(
            "THREE.KeyframeTrack: Time is not a valid number.",
            this,
            t,
            r
          ),
            (e = !1);
          break;
        }
        if (null !== o && o > r) {
          console.error(
            "THREE.KeyframeTrack: Out of order keys.",
            this,
            t,
            r,
            o
          ),
            (e = !1);
          break;
        }
        o = r;
      }
      if (void 0 !== r && AnimationUtils.isTypedArray(r))
        for (let t = 0, n = r.length; t !== n; ++t) {
          const n = r[t];
          if (isNaN(n)) {
            console.error(
              "THREE.KeyframeTrack: Value is not a valid number.",
              this,
              t,
              n
            ),
              (e = !1);
            break;
          }
        }
      return e;
    },
    optimize: function () {
      const e = AnimationUtils.arraySlice(this.times),
        t = AnimationUtils.arraySlice(this.values),
        n = this.getValueSize(),
        r = 2302 === this.getInterpolation(),
        i = e.length - 1;
      let o = 1;
      for (let a = 1; a < i; ++a) {
        let i = !1;
        const s = e[a];
        if (s !== e[a + 1] && (1 !== a || s !== s[0]))
          if (r) i = !0;
          else {
            const e = a * n,
              r = e - n,
              o = e + n;
            for (let a = 0; a !== n; ++a) {
              const n = t[e + a];
              if (n !== t[r + a] || n !== t[o + a]) {
                i = !0;
                break;
              }
            }
          }
        if (i) {
          if (a !== o) {
            e[o] = e[a];
            const r = a * n,
              i = o * n;
            for (let e = 0; e !== n; ++e) t[i + e] = t[r + e];
          }
          ++o;
        }
      }
      if (i > 0) {
        e[o] = e[i];
        for (let e = i * n, r = o * n, a = 0; a !== n; ++a) t[r + a] = t[e + a];
        ++o;
      }
      return (
        o !== e.length
          ? ((this.times = AnimationUtils.arraySlice(e, 0, o)),
            (this.values = AnimationUtils.arraySlice(t, 0, o * n)))
          : ((this.times = e), (this.values = t)),
        this
      );
    },
    clone: function () {
      const e = AnimationUtils.arraySlice(this.times, 0),
        t = AnimationUtils.arraySlice(this.values, 0),
        n = new (0, this.constructor)(this.name, e, t);
      return (n.createInterpolant = this.createInterpolant), n;
    }
  }),
  (BooleanKeyframeTrack.prototype = Object.assign(
    Object.create(KeyframeTrack.prototype),
    {
      constructor: BooleanKeyframeTrack,
      ValueTypeName: "bool",
      ValueBufferType: Array,
      DefaultInterpolation: 2300,
      InterpolantFactoryMethodLinear: void 0,
      InterpolantFactoryMethodSmooth: void 0
    }
  )),
  (ColorKeyframeTrack.prototype = Object.assign(
    Object.create(KeyframeTrack.prototype),
    { constructor: ColorKeyframeTrack, ValueTypeName: "color" }
  )),
  (NumberKeyframeTrack.prototype = Object.assign(
    Object.create(KeyframeTrack.prototype),
    { constructor: NumberKeyframeTrack, ValueTypeName: "number" }
  )),
  (QuaternionLinearInterpolant.prototype = Object.assign(
    Object.create(Interpolant.prototype),
    {
      constructor: QuaternionLinearInterpolant,
      interpolate_: function (e, t, n, r) {
        const i = this.resultBuffer,
          o = this.sampleValues,
          a = this.valueSize,
          s = (n - t) / (r - t);
        let c = e * a;
        for (let e = c + a; c !== e; c += 4)
          Quaternion.slerpFlat(i, 0, o, c - a, o, c, s);
        return i;
      }
    }
  )),
  (QuaternionKeyframeTrack.prototype = Object.assign(
    Object.create(KeyframeTrack.prototype),
    {
      constructor: QuaternionKeyframeTrack,
      ValueTypeName: "quaternion",
      DefaultInterpolation: 2301,
      InterpolantFactoryMethodLinear: function (e) {
        return new QuaternionLinearInterpolant(
          this.times,
          this.values,
          this.getValueSize(),
          e
        );
      },
      InterpolantFactoryMethodSmooth: void 0
    }
  )),
  (StringKeyframeTrack.prototype = Object.assign(
    Object.create(KeyframeTrack.prototype),
    {
      constructor: StringKeyframeTrack,
      ValueTypeName: "string",
      ValueBufferType: Array,
      DefaultInterpolation: 2300,
      InterpolantFactoryMethodLinear: void 0,
      InterpolantFactoryMethodSmooth: void 0
    }
  )),
  (VectorKeyframeTrack.prototype = Object.assign(
    Object.create(KeyframeTrack.prototype),
    { constructor: VectorKeyframeTrack, ValueTypeName: "vector" }
  )),
  Object.assign(AnimationClip, {
    parse: function (e) {
      const t = [],
        n = e.tracks,
        r = 1 / (e.fps || 1);
      for (let e = 0, i = n.length; e !== i; ++e)
        t.push(parseKeyframeTrack(n[e]).scale(r));
      return new AnimationClip(e.name, e.duration, t, e.blendMode);
    },
    toJSON: function (e) {
      const t = [],
        n = e.tracks,
        r = {
          name: e.name,
          duration: e.duration,
          tracks: t,
          uuid: e.uuid,
          blendMode: e.blendMode
        };
      for (let e = 0, r = n.length; e !== r; ++e)
        t.push(KeyframeTrack.toJSON(n[e]));
      return r;
    },
    CreateFromMorphTargetSequence: function (e, t, n, r) {
      const i = t.length,
        o = [];
      for (let e = 0; e < i; e++) {
        let a = [],
          s = [];
        a.push((e + i - 1) % i, e, (e + 1) % i), s.push(0, 1, 0);
        const c = AnimationUtils.getKeyframeOrder(a);
        (a = AnimationUtils.sortedArray(a, 1, c)),
          (s = AnimationUtils.sortedArray(s, 1, c)),
          r || 0 !== a[0] || (a.push(i), s.push(s[0])),
          o.push(
            new NumberKeyframeTrack(
              ".morphTargetInfluences[" + t[e].name + "]",
              a,
              s
            ).scale(1 / n)
          );
      }
      return new AnimationClip(e, -1, o);
    },
    findByName: function (e, t) {
      let n = e;
      if (!Array.isArray(e)) {
        const t = e;
        n = (t.geometry && t.geometry.animations) || t.animations;
      }
      for (let e = 0; e < n.length; e++) if (n[e].name === t) return n[e];
      return null;
    },
    CreateClipsFromMorphTargetSequences: function (e, t, n) {
      const r = {},
        i = /^([\w-]*?)([\d]+)$/;
      for (let t = 0, n = e.length; t < n; t++) {
        const n = e[t],
          o = n.name.match(i);
        if (o && o.length > 1) {
          const e = o[1];
          let t = r[e];
          t || (r[e] = t = []), t.push(n);
        }
      }
      const o = [];
      for (const e in r)
        o.push(AnimationClip.CreateFromMorphTargetSequence(e, r[e], t, n));
      return o;
    },
    parseAnimation: function (e, t) {
      if (!e)
        return (
          console.error(
            "THREE.AnimationClip: No animation in JSONLoader data."
          ),
          null
        );
      const n = function (e, t, n, r, i) {
          if (0 !== n.length) {
            const o = [],
              a = [];
            AnimationUtils.flattenJSON(n, o, a, r),
              0 !== o.length && i.push(new e(t, o, a));
          }
        },
        r = [],
        i = e.name || "default",
        o = e.fps || 30,
        a = e.blendMode;
      let s = e.length || -1;
      const c = e.hierarchy || [];
      for (let e = 0; e < c.length; e++) {
        const i = c[e].keys;
        if (i && 0 !== i.length)
          if (i[0].morphTargets) {
            const e = {};
            let t;
            for (t = 0; t < i.length; t++)
              if (i[t].morphTargets)
                for (let n = 0; n < i[t].morphTargets.length; n++)
                  e[i[t].morphTargets[n]] = -1;
            for (const n in e) {
              const e = [],
                o = [];
              for (let r = 0; r !== i[t].morphTargets.length; ++r) {
                const r = i[t];
                e.push(r.time), o.push(r.morphTarget === n ? 1 : 0);
              }
              r.push(
                new NumberKeyframeTrack(
                  ".morphTargetInfluence[" + n + "]",
                  e,
                  o
                )
              );
            }
            s = e.length * (o || 1);
          } else {
            const o = ".bones[" + t[e].name + "]";
            n(VectorKeyframeTrack, o + ".position", i, "pos", r),
              n(QuaternionKeyframeTrack, o + ".quaternion", i, "rot", r),
              n(VectorKeyframeTrack, o + ".scale", i, "scl", r);
          }
      }
      return 0 === r.length ? null : new AnimationClip(i, s, r, a);
    }
  }),
  Object.assign(AnimationClip.prototype, {
    resetDuration: function () {
      let e = 0;
      for (let t = 0, n = this.tracks.length; t !== n; ++t) {
        const n = this.tracks[t];
        e = Math.max(e, n.times[n.times.length - 1]);
      }
      return (this.duration = e), this;
    },
    trim: function () {
      for (let e = 0; e < this.tracks.length; e++)
        this.tracks[e].trim(0, this.duration);
      return this;
    },
    validate: function () {
      let e = !0;
      for (let t = 0; t < this.tracks.length; t++)
        e = e && this.tracks[t].validate();
      return e;
    },
    optimize: function () {
      for (let e = 0; e < this.tracks.length; e++) this.tracks[e].optimize();
      return this;
    },
    clone: function () {
      const e = [];
      for (let t = 0; t < this.tracks.length; t++)
        e.push(this.tracks[t].clone());
      return new AnimationClip(this.name, this.duration, e, this.blendMode);
    }
  });
const Cache = {
  enabled: !1,
  files: {},
  add: function (e, t) {
    !1 !== this.enabled && (this.files[e] = t);
  },
  get: function (e) {
    if (!1 !== this.enabled) return this.files[e];
  },
  remove: function (e) {
    delete this.files[e];
  },
  clear: function () {
    this.files = {};
  }
};
function LoadingManager(e, t, n) {
  const r = this;
  let i = !1,
    o = 0,
    a = 0,
    s = void 0;
  const c = [];
  (this.onStart = void 0),
    (this.onLoad = e),
    (this.onProgress = t),
    (this.onError = n),
    (this.itemStart = function (e) {
      a++, !1 === i && void 0 !== r.onStart && r.onStart(e, o, a), (i = !0);
    }),
    (this.itemEnd = function (e) {
      o++,
        void 0 !== r.onProgress && r.onProgress(e, o, a),
        o === a && ((i = !1), void 0 !== r.onLoad && r.onLoad());
    }),
    (this.itemError = function (e) {
      void 0 !== r.onError && r.onError(e);
    }),
    (this.resolveURL = function (e) {
      return s ? s(e) : e;
    }),
    (this.setURLModifier = function (e) {
      return (s = e), this;
    }),
    (this.addHandler = function (e, t) {
      return c.push(e, t), this;
    }),
    (this.removeHandler = function (e) {
      const t = c.indexOf(e);
      return -1 !== t && c.splice(t, 2), this;
    }),
    (this.getHandler = function (e) {
      for (let t = 0, n = c.length; t < n; t += 2) {
        const n = c[t],
          r = c[t + 1];
        if ((n.global && (n.lastIndex = 0), n.test(e))) return r;
      }
      return null;
    });
}
const DefaultLoadingManager = new LoadingManager();
function Loader(e) {
  (this.manager = void 0 !== e ? e : DefaultLoadingManager),
    (this.crossOrigin = "anonymous"),
    (this.withCredentials = !1),
    (this.path = ""),
    (this.resourcePath = ""),
    (this.requestHeader = {});
}
Object.assign(Loader.prototype, {
  load: function () {},
  loadAsync: function (e, t) {
    const n = this;
    return new Promise(function (r, i) {
      n.load(e, r, t, i);
    });
  },
  parse: function () {},
  setCrossOrigin: function (e) {
    return (this.crossOrigin = e), this;
  },
  setWithCredentials: function (e) {
    return (this.withCredentials = e), this;
  },
  setPath: function (e) {
    return (this.path = e), this;
  },
  setResourcePath: function (e) {
    return (this.resourcePath = e), this;
  },
  setRequestHeader: function (e) {
    return (this.requestHeader = e), this;
  }
});
const loading = {};
function FileLoader(e) {
  Loader.call(this, e);
}
function AnimationLoader(e) {
  Loader.call(this, e);
}
function CompressedTextureLoader(e) {
  Loader.call(this, e);
}
function ImageLoader(e) {
  Loader.call(this, e);
}
function CubeTextureLoader(e) {
  Loader.call(this, e);
}
function DataTextureLoader(e) {
  Loader.call(this, e);
}
function TextureLoader(e) {
  Loader.call(this, e);
}
function Curve() {
  (this.type = "Curve"), (this.arcLengthDivisions = 200);
}
function EllipseCurve(e, t, n, r, i, o, a, s) {
  Curve.call(this),
    (this.type = "EllipseCurve"),
    (this.aX = e || 0),
    (this.aY = t || 0),
    (this.xRadius = n || 1),
    (this.yRadius = r || 1),
    (this.aStartAngle = i || 0),
    (this.aEndAngle = o || 2 * Math.PI),
    (this.aClockwise = a || !1),
    (this.aRotation = s || 0);
}
function ArcCurve(e, t, n, r, i, o) {
  EllipseCurve.call(this, e, t, n, n, r, i, o), (this.type = "ArcCurve");
}
function CubicPoly() {
  let e = 0,
    t = 0,
    n = 0,
    r = 0;
  function i(i, o, a, s) {
    (e = i),
      (t = a),
      (n = -3 * i + 3 * o - 2 * a - s),
      (r = 2 * i - 2 * o + a + s);
  }
  return {
    initCatmullRom: function (e, t, n, r, o) {
      i(t, n, o * (n - e), o * (r - t));
    },
    initNonuniformCatmullRom: function (e, t, n, r, o, a, s) {
      let c = (t - e) / o - (n - e) / (o + a) + (n - t) / a,
        l = (n - t) / a - (r - t) / (a + s) + (r - n) / s;
      i(t, n, (c *= a), (l *= a));
    },
    calc: function (i) {
      const o = i * i;
      return e + t * i + n * o + r * (o * i);
    }
  };
}
(FileLoader.prototype = Object.assign(Object.create(Loader.prototype), {
  constructor: FileLoader,
  load: function (e, t, n, r) {
    void 0 === e && (e = ""),
      void 0 !== this.path && (e = this.path + e),
      (e = this.manager.resolveURL(e));
    const i = this,
      o = Cache.get(e);
    if (void 0 !== o)
      return (
        i.manager.itemStart(e),
        setTimeout(function () {
          t && t(o), i.manager.itemEnd(e);
        }, 0),
        o
      );
    if (void 0 !== loading[e])
      return void loading[e].push({ onLoad: t, onProgress: n, onError: r });
    const a = e.match(/^data:(.*?)(;base64)?,(.*)$/);
    let s;
    if (a) {
      const n = a[1],
        o = !!a[2];
      let s = a[3];
      (s = decodeURIComponent(s)), o && (s = atob(s));
      try {
        let o;
        const a = (this.responseType || "").toLowerCase();
        switch (a) {
          case "arraybuffer":
          case "blob":
            const e = new Uint8Array(s.length);
            for (let t = 0; t < s.length; t++) e[t] = s.charCodeAt(t);
            o = "blob" === a ? new Blob([e.buffer], { type: n }) : e.buffer;
            break;
          case "document":
            const t = new DOMParser();
            o = t.parseFromString(s, n);
            break;
          case "json":
            o = JSON.parse(s);
            break;
          default:
            o = s;
        }
        setTimeout(function () {
          t && t(o), i.manager.itemEnd(e);
        }, 0);
      } catch (t) {
        setTimeout(function () {
          r && r(t), i.manager.itemError(e), i.manager.itemEnd(e);
        }, 0);
      }
    } else {
      (loading[e] = []),
        loading[e].push({ onLoad: t, onProgress: n, onError: r }),
        (s = new XMLHttpRequest()).open("GET", e, !0),
        s.addEventListener(
          "load",
          function (t) {
            const n = this.response,
              r = loading[e];
            if ((delete loading[e], 200 === this.status || 0 === this.status)) {
              0 === this.status &&
                console.warn("THREE.FileLoader: HTTP Status 0 received."),
                Cache.add(e, n);
              for (let e = 0, t = r.length; e < t; e++) {
                const t = r[e];
                t.onLoad && t.onLoad(n);
              }
              i.manager.itemEnd(e);
            } else {
              for (let e = 0, n = r.length; e < n; e++) {
                const n = r[e];
                n.onError && n.onError(t);
              }
              i.manager.itemError(e), i.manager.itemEnd(e);
            }
          },
          !1
        ),
        s.addEventListener(
          "progress",
          function (t) {
            const n = loading[e];
            for (let e = 0, r = n.length; e < r; e++) {
              const r = n[e];
              r.onProgress && r.onProgress(t);
            }
          },
          !1
        ),
        s.addEventListener(
          "error",
          function (t) {
            const n = loading[e];
            delete loading[e];
            for (let e = 0, r = n.length; e < r; e++) {
              const r = n[e];
              r.onError && r.onError(t);
            }
            i.manager.itemError(e), i.manager.itemEnd(e);
          },
          !1
        ),
        s.addEventListener(
          "abort",
          function (t) {
            const n = loading[e];
            delete loading[e];
            for (let e = 0, r = n.length; e < r; e++) {
              const r = n[e];
              r.onError && r.onError(t);
            }
            i.manager.itemError(e), i.manager.itemEnd(e);
          },
          !1
        ),
        void 0 !== this.responseType && (s.responseType = this.responseType),
        void 0 !== this.withCredentials &&
          (s.withCredentials = this.withCredentials),
        s.overrideMimeType &&
          s.overrideMimeType(
            void 0 !== this.mimeType ? this.mimeType : "text/plain"
          );
      for (const e in this.requestHeader)
        s.setRequestHeader(e, this.requestHeader[e]);
      s.send(null);
    }
    return i.manager.itemStart(e), s;
  },
  setResponseType: function (e) {
    return (this.responseType = e), this;
  },
  setMimeType: function (e) {
    return (this.mimeType = e), this;
  }
})),
  (AnimationLoader.prototype = Object.assign(Object.create(Loader.prototype), {
    constructor: AnimationLoader,
    load: function (e, t, n, r) {
      const i = this,
        o = new FileLoader(i.manager);
      o.setPath(i.path),
        o.setRequestHeader(i.requestHeader),
        o.setWithCredentials(i.withCredentials),
        o.load(
          e,
          function (n) {
            try {
              t(i.parse(JSON.parse(n)));
            } catch (t) {
              r ? r(t) : console.error(t), i.manager.itemError(e);
            }
          },
          n,
          r
        );
    },
    parse: function (e) {
      const t = [];
      for (let n = 0; n < e.length; n++) {
        const r = AnimationClip.parse(e[n]);
        t.push(r);
      }
      return t;
    }
  })),
  (CompressedTextureLoader.prototype = Object.assign(
    Object.create(Loader.prototype),
    {
      constructor: CompressedTextureLoader,
      load: function (e, t, n, r) {
        const i = this,
          o = [],
          a = new CompressedTexture();
        a.image = o;
        const s = new FileLoader(this.manager);
        s.setPath(this.path),
          s.setResponseType("arraybuffer"),
          s.setRequestHeader(this.requestHeader),
          s.setWithCredentials(i.withCredentials);
        let c = 0;
        function l(l) {
          s.load(
            e[l],
            function (e) {
              const n = i.parse(e, !0);
              (o[l] = {
                width: n.width,
                height: n.height,
                format: n.format,
                mipmaps: n.mipmaps
              }),
                6 === (c += 1) &&
                  (1 === n.mipmapCount && (a.minFilter = LinearFilter),
                  (a.format = n.format),
                  (a.needsUpdate = !0),
                  t && t(a));
            },
            n,
            r
          );
        }
        if (Array.isArray(e)) for (let t = 0, n = e.length; t < n; ++t) l(t);
        else
          s.load(
            e,
            function (e) {
              const n = i.parse(e, !0);
              if (n.isCubemap) {
                const e = n.mipmaps.length / n.mipmapCount;
                for (let t = 0; t < e; t++) {
                  o[t] = { mipmaps: [] };
                  for (let e = 0; e < n.mipmapCount; e++)
                    o[t].mipmaps.push(n.mipmaps[t * n.mipmapCount + e]),
                      (o[t].format = n.format),
                      (o[t].width = n.width),
                      (o[t].height = n.height);
                }
              } else
                (a.image.width = n.width),
                  (a.image.height = n.height),
                  (a.mipmaps = n.mipmaps);
              1 === n.mipmapCount && (a.minFilter = LinearFilter),
                (a.format = n.format),
                (a.needsUpdate = !0),
                t && t(a);
            },
            n,
            r
          );
        return a;
      }
    }
  )),
  (ImageLoader.prototype = Object.assign(Object.create(Loader.prototype), {
    constructor: ImageLoader,
    load: function (e, t, n, r) {
      void 0 !== this.path && (e = this.path + e),
        (e = this.manager.resolveURL(e));
      const i = this,
        o = Cache.get(e);
      if (void 0 !== o)
        return (
          i.manager.itemStart(e),
          setTimeout(function () {
            t && t(o), i.manager.itemEnd(e);
          }, 0),
          o
        );
      const a = document.createElementNS("http://www.w3.org/1999/xhtml", "img");
      function s() {
        a.removeEventListener("load", s, !1),
          a.removeEventListener("error", c, !1),
          Cache.add(e, this),
          t && t(this),
          i.manager.itemEnd(e);
      }
      function c(t) {
        a.removeEventListener("load", s, !1),
          a.removeEventListener("error", c, !1),
          r && r(t),
          i.manager.itemError(e),
          i.manager.itemEnd(e);
      }
      return (
        a.addEventListener("load", s, !1),
        a.addEventListener("error", c, !1),
        "data:" !== e.substr(0, 5) &&
          void 0 !== this.crossOrigin &&
          (a.crossOrigin = this.crossOrigin),
        i.manager.itemStart(e),
        (a.src = e),
        a
      );
    }
  })),
  (CubeTextureLoader.prototype = Object.assign(
    Object.create(Loader.prototype),
    {
      constructor: CubeTextureLoader,
      load: function (e, t, n, r) {
        const i = new CubeTexture(),
          o = new ImageLoader(this.manager);
        o.setCrossOrigin(this.crossOrigin), o.setPath(this.path);
        let a = 0;
        function s(n) {
          o.load(
            e[n],
            function (e) {
              (i.images[n] = e), 6 === ++a && ((i.needsUpdate = !0), t && t(i));
            },
            void 0,
            r
          );
        }
        for (let t = 0; t < e.length; ++t) s(t);
        return i;
      }
    }
  )),
  (DataTextureLoader.prototype = Object.assign(
    Object.create(Loader.prototype),
    {
      constructor: DataTextureLoader,
      load: function (e, t, n, r) {
        const i = this,
          o = new DataTexture(),
          a = new FileLoader(this.manager);
        return (
          a.setResponseType("arraybuffer"),
          a.setRequestHeader(this.requestHeader),
          a.setPath(this.path),
          a.setWithCredentials(i.withCredentials),
          a.load(
            e,
            function (e) {
              const n = i.parse(e);
              n &&
                (void 0 !== n.image
                  ? (o.image = n.image)
                  : void 0 !== n.data &&
                    ((o.image.width = n.width),
                    (o.image.height = n.height),
                    (o.image.data = n.data)),
                (o.wrapS = void 0 !== n.wrapS ? n.wrapS : ClampToEdgeWrapping),
                (o.wrapT = void 0 !== n.wrapT ? n.wrapT : ClampToEdgeWrapping),
                (o.magFilter =
                  void 0 !== n.magFilter ? n.magFilter : LinearFilter),
                (o.minFilter =
                  void 0 !== n.minFilter ? n.minFilter : LinearFilter),
                (o.anisotropy = void 0 !== n.anisotropy ? n.anisotropy : 1),
                void 0 !== n.format && (o.format = n.format),
                void 0 !== n.type && (o.type = n.type),
                void 0 !== n.mipmaps &&
                  ((o.mipmaps = n.mipmaps),
                  (o.minFilter = LinearMipmapLinearFilter)),
                1 === n.mipmapCount && (o.minFilter = LinearFilter),
                (o.needsUpdate = !0),
                t && t(o, n));
            },
            n,
            r
          ),
          o
        );
      }
    }
  )),
  (TextureLoader.prototype = Object.assign(Object.create(Loader.prototype), {
    constructor: TextureLoader,
    load: function (e, t, n, r) {
      const i = new Texture(),
        o = new ImageLoader(this.manager);
      return (
        o.setCrossOrigin(this.crossOrigin),
        o.setPath(this.path),
        o.load(
          e,
          function (n) {
            i.image = n;
            const r =
              e.search(/\.jpe?g($|\?)/i) > 0 ||
              0 === e.search(/^data\:image\/jpeg/);
            (i.format = r ? RGBFormat : RGBAFormat),
              (i.needsUpdate = !0),
              void 0 !== t && t(i);
          },
          n,
          r
        ),
        i
      );
    }
  })),
  Object.assign(Curve.prototype, {
    getPoint: function () {
      return console.warn("THREE.Curve: .getPoint() not implemented."), null;
    },
    getPointAt: function (e, t) {
      const n = this.getUtoTmapping(e);
      return this.getPoint(n, t);
    },
    getPoints: function (e) {
      void 0 === e && (e = 5);
      const t = [];
      for (let n = 0; n <= e; n++) t.push(this.getPoint(n / e));
      return t;
    },
    getSpacedPoints: function (e) {
      void 0 === e && (e = 5);
      const t = [];
      for (let n = 0; n <= e; n++) t.push(this.getPointAt(n / e));
      return t;
    },
    getLength: function () {
      const e = this.getLengths();
      return e[e.length - 1];
    },
    getLengths: function (e) {
      if (
        (void 0 === e && (e = this.arcLengthDivisions),
        this.cacheArcLengths &&
          this.cacheArcLengths.length === e + 1 &&
          !this.needsUpdate)
      )
        return this.cacheArcLengths;
      this.needsUpdate = !1;
      const t = [];
      let n,
        r = this.getPoint(0),
        i = 0;
      t.push(0);
      for (let o = 1; o <= e; o++)
        (i += (n = this.getPoint(o / e)).distanceTo(r)), t.push(i), (r = n);
      return (this.cacheArcLengths = t), t;
    },
    updateArcLengths: function () {
      (this.needsUpdate = !0), this.getLengths();
    },
    getUtoTmapping: function (e, t) {
      const n = this.getLengths();
      let r = 0;
      const i = n.length;
      let o;
      o = t || e * n[i - 1];
      let a,
        s = 0,
        c = i - 1;
      for (; s <= c; )
        if ((a = n[(r = Math.floor(s + (c - s) / 2))] - o) < 0) s = r + 1;
        else {
          if (!(a > 0)) {
            c = r;
            break;
          }
          c = r - 1;
        }
      if (n[(r = c)] === o) return r / (i - 1);
      const l = n[r];
      return (r + (o - l) / (n[r + 1] - l)) / (i - 1);
    },
    getTangent: function (e, t) {
      let n = e - 1e-4,
        r = e + 1e-4;
      n < 0 && (n = 0), r > 1 && (r = 1);
      const i = this.getPoint(n),
        o = this.getPoint(r),
        a = t || (i.isVector2 ? new Vector2() : new Vector3());
      return a.copy(o).sub(i).normalize(), a;
    },
    getTangentAt: function (e, t) {
      const n = this.getUtoTmapping(e);
      return this.getTangent(n, t);
    },
    computeFrenetFrames: function (e, t) {
      const n = new Vector3(),
        r = [],
        i = [],
        o = [],
        a = new Vector3(),
        s = new Matrix4();
      for (let t = 0; t <= e; t++) {
        const n = t / e;
        (r[t] = this.getTangentAt(n, new Vector3())), r[t].normalize();
      }
      (i[0] = new Vector3()), (o[0] = new Vector3());
      let c = Number.MAX_VALUE;
      const l = Math.abs(r[0].x),
        h = Math.abs(r[0].y),
        u = Math.abs(r[0].z);
      l <= c && ((c = l), n.set(1, 0, 0)),
        h <= c && ((c = h), n.set(0, 1, 0)),
        u <= c && n.set(0, 0, 1),
        a.crossVectors(r[0], n).normalize(),
        i[0].crossVectors(r[0], a),
        o[0].crossVectors(r[0], i[0]);
      for (let t = 1; t <= e; t++) {
        if (
          ((i[t] = i[t - 1].clone()),
          (o[t] = o[t - 1].clone()),
          a.crossVectors(r[t - 1], r[t]),
          a.length() > Number.EPSILON)
        ) {
          a.normalize();
          const e = Math.acos(MathUtils.clamp(r[t - 1].dot(r[t]), -1, 1));
          i[t].applyMatrix4(s.makeRotationAxis(a, e));
        }
        o[t].crossVectors(r[t], i[t]);
      }
      if (!0 === t) {
        let t = Math.acos(MathUtils.clamp(i[0].dot(i[e]), -1, 1));
        (t /= e), r[0].dot(a.crossVectors(i[0], i[e])) > 0 && (t = -t);
        for (let n = 1; n <= e; n++)
          i[n].applyMatrix4(s.makeRotationAxis(r[n], t * n)),
            o[n].crossVectors(r[n], i[n]);
      }
      return { tangents: r, normals: i, binormals: o };
    },
    clone: function () {
      return new this.constructor().copy(this);
    },
    copy: function (e) {
      return (this.arcLengthDivisions = e.arcLengthDivisions), this;
    },
    toJSON: function () {
      const e = {
        metadata: { version: 4.5, type: "Curve", generator: "Curve.toJSON" }
      };
      return (
        (e.arcLengthDivisions = this.arcLengthDivisions),
        (e.type = this.type),
        e
      );
    },
    fromJSON: function (e) {
      return (this.arcLengthDivisions = e.arcLengthDivisions), this;
    }
  }),
  (EllipseCurve.prototype = Object.create(Curve.prototype)),
  (EllipseCurve.prototype.constructor = EllipseCurve),
  (EllipseCurve.prototype.isEllipseCurve = !0),
  (EllipseCurve.prototype.getPoint = function (e, t) {
    const n = t || new Vector2(),
      r = 2 * Math.PI;
    let i = this.aEndAngle - this.aStartAngle;
    const o = Math.abs(i) < Number.EPSILON;
    for (; i < 0; ) i += r;
    for (; i > r; ) i -= r;
    i < Number.EPSILON && (i = o ? 0 : r),
      !0 !== this.aClockwise || o || (i === r ? (i = -r) : (i -= r));
    const a = this.aStartAngle + e * i;
    let s = this.aX + this.xRadius * Math.cos(a),
      c = this.aY + this.yRadius * Math.sin(a);
    if (0 !== this.aRotation) {
      const e = Math.cos(this.aRotation),
        t = Math.sin(this.aRotation),
        n = s - this.aX,
        r = c - this.aY;
      (s = n * e - r * t + this.aX), (c = n * t + r * e + this.aY);
    }
    return n.set(s, c);
  }),
  (EllipseCurve.prototype.copy = function (e) {
    return (
      Curve.prototype.copy.call(this, e),
      (this.aX = e.aX),
      (this.aY = e.aY),
      (this.xRadius = e.xRadius),
      (this.yRadius = e.yRadius),
      (this.aStartAngle = e.aStartAngle),
      (this.aEndAngle = e.aEndAngle),
      (this.aClockwise = e.aClockwise),
      (this.aRotation = e.aRotation),
      this
    );
  }),
  (EllipseCurve.prototype.toJSON = function () {
    const e = Curve.prototype.toJSON.call(this);
    return (
      (e.aX = this.aX),
      (e.aY = this.aY),
      (e.xRadius = this.xRadius),
      (e.yRadius = this.yRadius),
      (e.aStartAngle = this.aStartAngle),
      (e.aEndAngle = this.aEndAngle),
      (e.aClockwise = this.aClockwise),
      (e.aRotation = this.aRotation),
      e
    );
  }),
  (EllipseCurve.prototype.fromJSON = function (e) {
    return (
      Curve.prototype.fromJSON.call(this, e),
      (this.aX = e.aX),
      (this.aY = e.aY),
      (this.xRadius = e.xRadius),
      (this.yRadius = e.yRadius),
      (this.aStartAngle = e.aStartAngle),
      (this.aEndAngle = e.aEndAngle),
      (this.aClockwise = e.aClockwise),
      (this.aRotation = e.aRotation),
      this
    );
  }),
  (ArcCurve.prototype = Object.create(EllipseCurve.prototype)),
  (ArcCurve.prototype.constructor = ArcCurve),
  (ArcCurve.prototype.isArcCurve = !0);
const tmp = new Vector3(),
  px = new CubicPoly(),
  py = new CubicPoly(),
  pz = new CubicPoly();
function CatmullRomCurve3(e, t, n, r) {
  Curve.call(this),
    (this.type = "CatmullRomCurve3"),
    (this.points = e || []),
    (this.closed = t || !1),
    (this.curveType = n || "centripetal"),
    (this.tension = void 0 !== r ? r : 0.5);
}
function CatmullRom(e, t, n, r, i) {
  const o = 0.5 * (r - t),
    a = 0.5 * (i - n),
    s = e * e;
  return (
    (2 * n - 2 * r + o + a) * (e * s) +
    (-3 * n + 3 * r - 2 * o - a) * s +
    o * e +
    n
  );
}
function QuadraticBezierP0(e, t) {
  const n = 1 - e;
  return n * n * t;
}
function QuadraticBezierP1(e, t) {
  return 2 * (1 - e) * e * t;
}
function QuadraticBezierP2(e, t) {
  return e * e * t;
}
function QuadraticBezier(e, t, n, r) {
  return (
    QuadraticBezierP0(e, t) + QuadraticBezierP1(e, n) + QuadraticBezierP2(e, r)
  );
}
function CubicBezierP0(e, t) {
  const n = 1 - e;
  return n * n * n * t;
}
function CubicBezierP1(e, t) {
  const n = 1 - e;
  return 3 * n * n * e * t;
}
function CubicBezierP2(e, t) {
  return 3 * (1 - e) * e * e * t;
}
function CubicBezierP3(e, t) {
  return e * e * e * t;
}
function CubicBezier(e, t, n, r, i) {
  return (
    CubicBezierP0(e, t) +
    CubicBezierP1(e, n) +
    CubicBezierP2(e, r) +
    CubicBezierP3(e, i)
  );
}
function CubicBezierCurve(e, t, n, r) {
  Curve.call(this),
    (this.type = "CubicBezierCurve"),
    (this.v0 = e || new Vector2()),
    (this.v1 = t || new Vector2()),
    (this.v2 = n || new Vector2()),
    (this.v3 = r || new Vector2());
}
function CubicBezierCurve3(e, t, n, r) {
  Curve.call(this),
    (this.type = "CubicBezierCurve3"),
    (this.v0 = e || new Vector3()),
    (this.v1 = t || new Vector3()),
    (this.v2 = n || new Vector3()),
    (this.v3 = r || new Vector3());
}
function LineCurve(e, t) {
  Curve.call(this),
    (this.type = "LineCurve"),
    (this.v1 = e || new Vector2()),
    (this.v2 = t || new Vector2());
}
function LineCurve3(e, t) {
  Curve.call(this),
    (this.type = "LineCurve3"),
    (this.v1 = e || new Vector3()),
    (this.v2 = t || new Vector3());
}
function QuadraticBezierCurve(e, t, n) {
  Curve.call(this),
    (this.type = "QuadraticBezierCurve"),
    (this.v0 = e || new Vector2()),
    (this.v1 = t || new Vector2()),
    (this.v2 = n || new Vector2());
}
function QuadraticBezierCurve3(e, t, n) {
  Curve.call(this),
    (this.type = "QuadraticBezierCurve3"),
    (this.v0 = e || new Vector3()),
    (this.v1 = t || new Vector3()),
    (this.v2 = n || new Vector3());
}
function SplineCurve(e) {
  Curve.call(this), (this.type = "SplineCurve"), (this.points = e || []);
}
(CatmullRomCurve3.prototype = Object.create(Curve.prototype)),
  (CatmullRomCurve3.prototype.constructor = CatmullRomCurve3),
  (CatmullRomCurve3.prototype.isCatmullRomCurve3 = !0),
  (CatmullRomCurve3.prototype.getPoint = function (e, t) {
    const n = t || new Vector3(),
      r = this.points,
      i = r.length,
      o = (i - (this.closed ? 0 : 1)) * e;
    let a,
      s,
      c = Math.floor(o),
      l = o - c;
    this.closed
      ? (c += c > 0 ? 0 : (Math.floor(Math.abs(c) / i) + 1) * i)
      : 0 === l && c === i - 1 && ((c = i - 2), (l = 1)),
      this.closed || c > 0
        ? (a = r[(c - 1) % i])
        : (tmp.subVectors(r[0], r[1]).add(r[0]), (a = tmp));
    const h = r[c % i],
      u = r[(c + 1) % i];
    if (
      (this.closed || c + 2 < i
        ? (s = r[(c + 2) % i])
        : (tmp.subVectors(r[i - 1], r[i - 2]).add(r[i - 1]), (s = tmp)),
      "centripetal" === this.curveType || "chordal" === this.curveType)
    ) {
      const e = "chordal" === this.curveType ? 0.5 : 0.25;
      let t = Math.pow(a.distanceToSquared(h), e),
        n = Math.pow(h.distanceToSquared(u), e),
        r = Math.pow(u.distanceToSquared(s), e);
      n < 1e-4 && (n = 1),
        t < 1e-4 && (t = n),
        r < 1e-4 && (r = n),
        px.initNonuniformCatmullRom(a.x, h.x, u.x, s.x, t, n, r),
        py.initNonuniformCatmullRom(a.y, h.y, u.y, s.y, t, n, r),
        pz.initNonuniformCatmullRom(a.z, h.z, u.z, s.z, t, n, r);
    } else
      "catmullrom" === this.curveType &&
        (px.initCatmullRom(a.x, h.x, u.x, s.x, this.tension),
        py.initCatmullRom(a.y, h.y, u.y, s.y, this.tension),
        pz.initCatmullRom(a.z, h.z, u.z, s.z, this.tension));
    return n.set(px.calc(l), py.calc(l), pz.calc(l)), n;
  }),
  (CatmullRomCurve3.prototype.copy = function (e) {
    Curve.prototype.copy.call(this, e), (this.points = []);
    for (let t = 0, n = e.points.length; t < n; t++) {
      const n = e.points[t];
      this.points.push(n.clone());
    }
    return (
      (this.closed = e.closed),
      (this.curveType = e.curveType),
      (this.tension = e.tension),
      this
    );
  }),
  (CatmullRomCurve3.prototype.toJSON = function () {
    const e = Curve.prototype.toJSON.call(this);
    e.points = [];
    for (let t = 0, n = this.points.length; t < n; t++) {
      const n = this.points[t];
      e.points.push(n.toArray());
    }
    return (
      (e.closed = this.closed),
      (e.curveType = this.curveType),
      (e.tension = this.tension),
      e
    );
  }),
  (CatmullRomCurve3.prototype.fromJSON = function (e) {
    Curve.prototype.fromJSON.call(this, e), (this.points = []);
    for (let t = 0, n = e.points.length; t < n; t++) {
      const n = e.points[t];
      this.points.push(new Vector3().fromArray(n));
    }
    return (
      (this.closed = e.closed),
      (this.curveType = e.curveType),
      (this.tension = e.tension),
      this
    );
  }),
  (CubicBezierCurve.prototype = Object.create(Curve.prototype)),
  (CubicBezierCurve.prototype.constructor = CubicBezierCurve),
  (CubicBezierCurve.prototype.isCubicBezierCurve = !0),
  (CubicBezierCurve.prototype.getPoint = function (e, t) {
    const n = t || new Vector2(),
      r = this.v0,
      i = this.v1,
      o = this.v2,
      a = this.v3;
    return (
      n.set(
        CubicBezier(e, r.x, i.x, o.x, a.x),
        CubicBezier(e, r.y, i.y, o.y, a.y)
      ),
      n
    );
  }),
  (CubicBezierCurve.prototype.copy = function (e) {
    return (
      Curve.prototype.copy.call(this, e),
      this.v0.copy(e.v0),
      this.v1.copy(e.v1),
      this.v2.copy(e.v2),
      this.v3.copy(e.v3),
      this
    );
  }),
  (CubicBezierCurve.prototype.toJSON = function () {
    const e = Curve.prototype.toJSON.call(this);
    return (
      (e.v0 = this.v0.toArray()),
      (e.v1 = this.v1.toArray()),
      (e.v2 = this.v2.toArray()),
      (e.v3 = this.v3.toArray()),
      e
    );
  }),
  (CubicBezierCurve.prototype.fromJSON = function (e) {
    return (
      Curve.prototype.fromJSON.call(this, e),
      this.v0.fromArray(e.v0),
      this.v1.fromArray(e.v1),
      this.v2.fromArray(e.v2),
      this.v3.fromArray(e.v3),
      this
    );
  }),
  (CubicBezierCurve3.prototype = Object.create(Curve.prototype)),
  (CubicBezierCurve3.prototype.constructor = CubicBezierCurve3),
  (CubicBezierCurve3.prototype.isCubicBezierCurve3 = !0),
  (CubicBezierCurve3.prototype.getPoint = function (e, t) {
    const n = t || new Vector3(),
      r = this.v0,
      i = this.v1,
      o = this.v2,
      a = this.v3;
    return (
      n.set(
        CubicBezier(e, r.x, i.x, o.x, a.x),
        CubicBezier(e, r.y, i.y, o.y, a.y),
        CubicBezier(e, r.z, i.z, o.z, a.z)
      ),
      n
    );
  }),
  (CubicBezierCurve3.prototype.copy = function (e) {
    return (
      Curve.prototype.copy.call(this, e),
      this.v0.copy(e.v0),
      this.v1.copy(e.v1),
      this.v2.copy(e.v2),
      this.v3.copy(e.v3),
      this
    );
  }),
  (CubicBezierCurve3.prototype.toJSON = function () {
    const e = Curve.prototype.toJSON.call(this);
    return (
      (e.v0 = this.v0.toArray()),
      (e.v1 = this.v1.toArray()),
      (e.v2 = this.v2.toArray()),
      (e.v3 = this.v3.toArray()),
      e
    );
  }),
  (CubicBezierCurve3.prototype.fromJSON = function (e) {
    return (
      Curve.prototype.fromJSON.call(this, e),
      this.v0.fromArray(e.v0),
      this.v1.fromArray(e.v1),
      this.v2.fromArray(e.v2),
      this.v3.fromArray(e.v3),
      this
    );
  }),
  (LineCurve.prototype = Object.create(Curve.prototype)),
  (LineCurve.prototype.constructor = LineCurve),
  (LineCurve.prototype.isLineCurve = !0),
  (LineCurve.prototype.getPoint = function (e, t) {
    const n = t || new Vector2();
    return (
      1 === e
        ? n.copy(this.v2)
        : (n.copy(this.v2).sub(this.v1), n.multiplyScalar(e).add(this.v1)),
      n
    );
  }),
  (LineCurve.prototype.getPointAt = function (e, t) {
    return this.getPoint(e, t);
  }),
  (LineCurve.prototype.getTangent = function (e, t) {
    const n = t || new Vector2();
    return n.copy(this.v2).sub(this.v1).normalize(), n;
  }),
  (LineCurve.prototype.copy = function (e) {
    return (
      Curve.prototype.copy.call(this, e),
      this.v1.copy(e.v1),
      this.v2.copy(e.v2),
      this
    );
  }),
  (LineCurve.prototype.toJSON = function () {
    const e = Curve.prototype.toJSON.call(this);
    return (e.v1 = this.v1.toArray()), (e.v2 = this.v2.toArray()), e;
  }),
  (LineCurve.prototype.fromJSON = function (e) {
    return (
      Curve.prototype.fromJSON.call(this, e),
      this.v1.fromArray(e.v1),
      this.v2.fromArray(e.v2),
      this
    );
  }),
  (LineCurve3.prototype = Object.create(Curve.prototype)),
  (LineCurve3.prototype.constructor = LineCurve3),
  (LineCurve3.prototype.isLineCurve3 = !0),
  (LineCurve3.prototype.getPoint = function (e, t) {
    const n = t || new Vector3();
    return (
      1 === e
        ? n.copy(this.v2)
        : (n.copy(this.v2).sub(this.v1), n.multiplyScalar(e).add(this.v1)),
      n
    );
  }),
  (LineCurve3.prototype.getPointAt = function (e, t) {
    return this.getPoint(e, t);
  }),
  (LineCurve3.prototype.copy = function (e) {
    return (
      Curve.prototype.copy.call(this, e),
      this.v1.copy(e.v1),
      this.v2.copy(e.v2),
      this
    );
  }),
  (LineCurve3.prototype.toJSON = function () {
    const e = Curve.prototype.toJSON.call(this);
    return (e.v1 = this.v1.toArray()), (e.v2 = this.v2.toArray()), e;
  }),
  (LineCurve3.prototype.fromJSON = function (e) {
    return (
      Curve.prototype.fromJSON.call(this, e),
      this.v1.fromArray(e.v1),
      this.v2.fromArray(e.v2),
      this
    );
  }),
  (QuadraticBezierCurve.prototype = Object.create(Curve.prototype)),
  (QuadraticBezierCurve.prototype.constructor = QuadraticBezierCurve),
  (QuadraticBezierCurve.prototype.isQuadraticBezierCurve = !0),
  (QuadraticBezierCurve.prototype.getPoint = function (e, t) {
    const n = t || new Vector2(),
      r = this.v0,
      i = this.v1,
      o = this.v2;
    return (
      n.set(
        QuadraticBezier(e, r.x, i.x, o.x),
        QuadraticBezier(e, r.y, i.y, o.y)
      ),
      n
    );
  }),
  (QuadraticBezierCurve.prototype.copy = function (e) {
    return (
      Curve.prototype.copy.call(this, e),
      this.v0.copy(e.v0),
      this.v1.copy(e.v1),
      this.v2.copy(e.v2),
      this
    );
  }),
  (QuadraticBezierCurve.prototype.toJSON = function () {
    const e = Curve.prototype.toJSON.call(this);
    return (
      (e.v0 = this.v0.toArray()),
      (e.v1 = this.v1.toArray()),
      (e.v2 = this.v2.toArray()),
      e
    );
  }),
  (QuadraticBezierCurve.prototype.fromJSON = function (e) {
    return (
      Curve.prototype.fromJSON.call(this, e),
      this.v0.fromArray(e.v0),
      this.v1.fromArray(e.v1),
      this.v2.fromArray(e.v2),
      this
    );
  }),
  (QuadraticBezierCurve3.prototype = Object.create(Curve.prototype)),
  (QuadraticBezierCurve3.prototype.constructor = QuadraticBezierCurve3),
  (QuadraticBezierCurve3.prototype.isQuadraticBezierCurve3 = !0),
  (QuadraticBezierCurve3.prototype.getPoint = function (e, t) {
    const n = t || new Vector3(),
      r = this.v0,
      i = this.v1,
      o = this.v2;
    return (
      n.set(
        QuadraticBezier(e, r.x, i.x, o.x),
        QuadraticBezier(e, r.y, i.y, o.y),
        QuadraticBezier(e, r.z, i.z, o.z)
      ),
      n
    );
  }),
  (QuadraticBezierCurve3.prototype.copy = function (e) {
    return (
      Curve.prototype.copy.call(this, e),
      this.v0.copy(e.v0),
      this.v1.copy(e.v1),
      this.v2.copy(e.v2),
      this
    );
  }),
  (QuadraticBezierCurve3.prototype.toJSON = function () {
    const e = Curve.prototype.toJSON.call(this);
    return (
      (e.v0 = this.v0.toArray()),
      (e.v1 = this.v1.toArray()),
      (e.v2 = this.v2.toArray()),
      e
    );
  }),
  (QuadraticBezierCurve3.prototype.fromJSON = function (e) {
    return (
      Curve.prototype.fromJSON.call(this, e),
      this.v0.fromArray(e.v0),
      this.v1.fromArray(e.v1),
      this.v2.fromArray(e.v2),
      this
    );
  }),
  (SplineCurve.prototype = Object.create(Curve.prototype)),
  (SplineCurve.prototype.constructor = SplineCurve),
  (SplineCurve.prototype.isSplineCurve = !0),
  (SplineCurve.prototype.getPoint = function (e, t) {
    const n = t || new Vector2(),
      r = this.points,
      i = (r.length - 1) * e,
      o = Math.floor(i),
      a = i - o,
      s = r[0 === o ? o : o - 1],
      c = r[o],
      l = r[o > r.length - 2 ? r.length - 1 : o + 1],
      h = r[o > r.length - 3 ? r.length - 1 : o + 2];
    return (
      n.set(
        CatmullRom(a, s.x, c.x, l.x, h.x),
        CatmullRom(a, s.y, c.y, l.y, h.y)
      ),
      n
    );
  }),
  (SplineCurve.prototype.copy = function (e) {
    Curve.prototype.copy.call(this, e), (this.points = []);
    for (let t = 0, n = e.points.length; t < n; t++) {
      const n = e.points[t];
      this.points.push(n.clone());
    }
    return this;
  }),
  (SplineCurve.prototype.toJSON = function () {
    const e = Curve.prototype.toJSON.call(this);
    e.points = [];
    for (let t = 0, n = this.points.length; t < n; t++) {
      const n = this.points[t];
      e.points.push(n.toArray());
    }
    return e;
  }),
  (SplineCurve.prototype.fromJSON = function (e) {
    Curve.prototype.fromJSON.call(this, e), (this.points = []);
    for (let t = 0, n = e.points.length; t < n; t++) {
      const n = e.points[t];
      this.points.push(new Vector2().fromArray(n));
    }
    return this;
  });
var Curves = Object.freeze({
  __proto__: null,
  ArcCurve: ArcCurve,
  CatmullRomCurve3: CatmullRomCurve3,
  CubicBezierCurve: CubicBezierCurve,
  CubicBezierCurve3: CubicBezierCurve3,
  EllipseCurve: EllipseCurve,
  LineCurve: LineCurve,
  LineCurve3: LineCurve3,
  QuadraticBezierCurve: QuadraticBezierCurve,
  QuadraticBezierCurve3: QuadraticBezierCurve3,
  SplineCurve: SplineCurve
});
function CurvePath() {
  Curve.call(this),
    (this.type = "CurvePath"),
    (this.curves = []),
    (this.autoClose = !1);
}
function Path(e) {
  CurvePath.call(this),
    (this.type = "Path"),
    (this.currentPoint = new Vector2()),
    e && this.setFromPoints(e);
}
function Shape(e) {
  Path.call(this, e),
    (this.uuid = MathUtils.generateUUID()),
    (this.type = "Shape"),
    (this.holes = []);
}
function Light(e, t) {
  Object3D.call(this),
    (this.type = "Light"),
    (this.color = new Color(e)),
    (this.intensity = void 0 !== t ? t : 1);
}
function HemisphereLight(e, t, n) {
  Light.call(this, e, n),
    (this.type = "HemisphereLight"),
    this.position.copy(Object3D.DefaultUp),
    this.updateMatrix(),
    (this.groundColor = new Color(t));
}
function LightShadow(e) {
  (this.camera = e),
    (this.bias = 0),
    (this.normalBias = 0),
    (this.radius = 1),
    (this.mapSize = new Vector2(512, 512)),
    (this.map = null),
    (this.mapPass = null),
    (this.matrix = new Matrix4()),
    (this.autoUpdate = !0),
    (this.needsUpdate = !1),
    (this._frustum = new Frustum()),
    (this._frameExtents = new Vector2(1, 1)),
    (this._viewportCount = 1),
    (this._viewports = [new Vector4(0, 0, 1, 1)]);
}
function SpotLightShadow() {
  LightShadow.call(this, new PerspectiveCamera(50, 1, 0.5, 500)),
    (this.focus = 1);
}
function SpotLight(e, t, n, r, i, o) {
  Light.call(this, e, t),
    (this.type = "SpotLight"),
    this.position.copy(Object3D.DefaultUp),
    this.updateMatrix(),
    (this.target = new Object3D()),
    Object.defineProperty(this, "power", {
      get: function () {
        return this.intensity * Math.PI;
      },
      set: function (e) {
        this.intensity = e / Math.PI;
      }
    }),
    (this.distance = void 0 !== n ? n : 0),
    (this.angle = void 0 !== r ? r : Math.PI / 3),
    (this.penumbra = void 0 !== i ? i : 0),
    (this.decay = void 0 !== o ? o : 1),
    (this.shadow = new SpotLightShadow());
}
function PointLightShadow() {
  LightShadow.call(this, new PerspectiveCamera(90, 1, 0.5, 500)),
    (this._frameExtents = new Vector2(4, 2)),
    (this._viewportCount = 6),
    (this._viewports = [
      new Vector4(2, 1, 1, 1),
      new Vector4(0, 1, 1, 1),
      new Vector4(3, 1, 1, 1),
      new Vector4(1, 1, 1, 1),
      new Vector4(3, 0, 1, 1),
      new Vector4(1, 0, 1, 1)
    ]),
    (this._cubeDirections = [
      new Vector3(1, 0, 0),
      new Vector3(-1, 0, 0),
      new Vector3(0, 0, 1),
      new Vector3(0, 0, -1),
      new Vector3(0, 1, 0),
      new Vector3(0, -1, 0)
    ]),
    (this._cubeUps = [
      new Vector3(0, 1, 0),
      new Vector3(0, 1, 0),
      new Vector3(0, 1, 0),
      new Vector3(0, 1, 0),
      new Vector3(0, 0, 1),
      new Vector3(0, 0, -1)
    ]);
}
function PointLight(e, t, n, r) {
  Light.call(this, e, t),
    (this.type = "PointLight"),
    Object.defineProperty(this, "power", {
      get: function () {
        return 4 * this.intensity * Math.PI;
      },
      set: function (e) {
        this.intensity = e / (4 * Math.PI);
      }
    }),
    (this.distance = void 0 !== n ? n : 0),
    (this.decay = void 0 !== r ? r : 1),
    (this.shadow = new PointLightShadow());
}
function OrthographicCamera(e, t, n, r, i, o) {
  Camera.call(this),
    (this.type = "OrthographicCamera"),
    (this.zoom = 1),
    (this.view = null),
    (this.left = void 0 !== e ? e : -1),
    (this.right = void 0 !== t ? t : 1),
    (this.top = void 0 !== n ? n : 1),
    (this.bottom = void 0 !== r ? r : -1),
    (this.near = void 0 !== i ? i : 0.1),
    (this.far = void 0 !== o ? o : 2e3),
    this.updateProjectionMatrix();
}
function DirectionalLightShadow() {
  LightShadow.call(this, new OrthographicCamera(-5, 5, 5, -5, 0.5, 500));
}
function DirectionalLight(e, t) {
  Light.call(this, e, t),
    (this.type = "DirectionalLight"),
    this.position.copy(Object3D.DefaultUp),
    this.updateMatrix(),
    (this.target = new Object3D()),
    (this.shadow = new DirectionalLightShadow());
}
function AmbientLight(e, t) {
  Light.call(this, e, t), (this.type = "AmbientLight");
}
function RectAreaLight(e, t, n, r) {
  Light.call(this, e, t),
    (this.type = "RectAreaLight"),
    (this.width = void 0 !== n ? n : 10),
    (this.height = void 0 !== r ? r : 10);
}
(CurvePath.prototype = Object.assign(Object.create(Curve.prototype), {
  constructor: CurvePath,
  add: function (e) {
    this.curves.push(e);
  },
  closePath: function () {
    const e = this.curves[0].getPoint(0),
      t = this.curves[this.curves.length - 1].getPoint(1);
    e.equals(t) || this.curves.push(new LineCurve(t, e));
  },
  getPoint: function (e) {
    const t = e * this.getLength(),
      n = this.getCurveLengths();
    let r = 0;
    for (; r < n.length; ) {
      if (n[r] >= t) {
        const e = n[r] - t,
          i = this.curves[r],
          o = i.getLength(),
          a = 0 === o ? 0 : 1 - e / o;
        return i.getPointAt(a);
      }
      r++;
    }
    return null;
  },
  getLength: function () {
    const e = this.getCurveLengths();
    return e[e.length - 1];
  },
  updateArcLengths: function () {
    (this.needsUpdate = !0), (this.cacheLengths = null), this.getCurveLengths();
  },
  getCurveLengths: function () {
    if (this.cacheLengths && this.cacheLengths.length === this.curves.length)
      return this.cacheLengths;
    const e = [];
    let t = 0;
    for (let n = 0, r = this.curves.length; n < r; n++)
      (t += this.curves[n].getLength()), e.push(t);
    return (this.cacheLengths = e), e;
  },
  getSpacedPoints: function (e) {
    void 0 === e && (e = 40);
    const t = [];
    for (let n = 0; n <= e; n++) t.push(this.getPoint(n / e));
    return this.autoClose && t.push(t[0]), t;
  },
  getPoints: function (e) {
    e = e || 12;
    const t = [];
    let n;
    for (let r = 0, i = this.curves; r < i.length; r++) {
      const o = i[r],
        a =
          o && o.isEllipseCurve
            ? 2 * e
            : o && (o.isLineCurve || o.isLineCurve3)
            ? 1
            : o && o.isSplineCurve
            ? e * o.points.length
            : e,
        s = o.getPoints(a);
      for (let e = 0; e < s.length; e++) {
        const r = s[e];
        (n && n.equals(r)) || (t.push(r), (n = r));
      }
    }
    return (
      this.autoClose &&
        t.length > 1 &&
        !t[t.length - 1].equals(t[0]) &&
        t.push(t[0]),
      t
    );
  },
  copy: function (e) {
    Curve.prototype.copy.call(this, e), (this.curves = []);
    for (let t = 0, n = e.curves.length; t < n; t++) {
      const n = e.curves[t];
      this.curves.push(n.clone());
    }
    return (this.autoClose = e.autoClose), this;
  },
  toJSON: function () {
    const e = Curve.prototype.toJSON.call(this);
    (e.autoClose = this.autoClose), (e.curves = []);
    for (let t = 0, n = this.curves.length; t < n; t++) {
      const n = this.curves[t];
      e.curves.push(n.toJSON());
    }
    return e;
  },
  fromJSON: function (e) {
    Curve.prototype.fromJSON.call(this, e),
      (this.autoClose = e.autoClose),
      (this.curves = []);
    for (let t = 0, n = e.curves.length; t < n; t++) {
      const n = e.curves[t];
      this.curves.push(new Curves[n.type]().fromJSON(n));
    }
    return this;
  }
})),
  (Path.prototype = Object.assign(Object.create(CurvePath.prototype), {
    constructor: Path,
    setFromPoints: function (e) {
      this.moveTo(e[0].x, e[0].y);
      for (let t = 1, n = e.length; t < n; t++) this.lineTo(e[t].x, e[t].y);
      return this;
    },
    moveTo: function (e, t) {
      return this.currentPoint.set(e, t), this;
    },
    lineTo: function (e, t) {
      const n = new LineCurve(this.currentPoint.clone(), new Vector2(e, t));
      return this.curves.push(n), this.currentPoint.set(e, t), this;
    },
    quadraticCurveTo: function (e, t, n, r) {
      const i = new QuadraticBezierCurve(
        this.currentPoint.clone(),
        new Vector2(e, t),
        new Vector2(n, r)
      );
      return this.curves.push(i), this.currentPoint.set(n, r), this;
    },
    bezierCurveTo: function (e, t, n, r, i, o) {
      const a = new CubicBezierCurve(
        this.currentPoint.clone(),
        new Vector2(e, t),
        new Vector2(n, r),
        new Vector2(i, o)
      );
      return this.curves.push(a), this.currentPoint.set(i, o), this;
    },
    splineThru: function (e) {
      const t = new SplineCurve([this.currentPoint.clone()].concat(e));
      return this.curves.push(t), this.currentPoint.copy(e[e.length - 1]), this;
    },
    arc: function (e, t, n, r, i, o) {
      const a = this.currentPoint.x,
        s = this.currentPoint.y;
      return this.absarc(e + a, t + s, n, r, i, o), this;
    },
    absarc: function (e, t, n, r, i, o) {
      return this.absellipse(e, t, n, n, r, i, o), this;
    },
    ellipse: function (e, t, n, r, i, o, a, s) {
      const c = this.currentPoint.x,
        l = this.currentPoint.y;
      return this.absellipse(e + c, t + l, n, r, i, o, a, s), this;
    },
    absellipse: function (e, t, n, r, i, o, a, s) {
      const c = new EllipseCurve(e, t, n, r, i, o, a, s);
      if (this.curves.length > 0) {
        const e = c.getPoint(0);
        e.equals(this.currentPoint) || this.lineTo(e.x, e.y);
      }
      this.curves.push(c);
      const l = c.getPoint(1);
      return this.currentPoint.copy(l), this;
    },
    copy: function (e) {
      return (
        CurvePath.prototype.copy.call(this, e),
        this.currentPoint.copy(e.currentPoint),
        this
      );
    },
    toJSON: function () {
      const e = CurvePath.prototype.toJSON.call(this);
      return (e.currentPoint = this.currentPoint.toArray()), e;
    },
    fromJSON: function (e) {
      return (
        CurvePath.prototype.fromJSON.call(this, e),
        this.currentPoint.fromArray(e.currentPoint),
        this
      );
    }
  })),
  (Shape.prototype = Object.assign(Object.create(Path.prototype), {
    constructor: Shape,
    getPointsHoles: function (e) {
      const t = [];
      for (let n = 0, r = this.holes.length; n < r; n++)
        t[n] = this.holes[n].getPoints(e);
      return t;
    },
    extractPoints: function (e) {
      return { shape: this.getPoints(e), holes: this.getPointsHoles(e) };
    },
    copy: function (e) {
      Path.prototype.copy.call(this, e), (this.holes = []);
      for (let t = 0, n = e.holes.length; t < n; t++) {
        const n = e.holes[t];
        this.holes.push(n.clone());
      }
      return this;
    },
    toJSON: function () {
      const e = Path.prototype.toJSON.call(this);
      (e.uuid = this.uuid), (e.holes = []);
      for (let t = 0, n = this.holes.length; t < n; t++) {
        const n = this.holes[t];
        e.holes.push(n.toJSON());
      }
      return e;
    },
    fromJSON: function (e) {
      Path.prototype.fromJSON.call(this, e),
        (this.uuid = e.uuid),
        (this.holes = []);
      for (let t = 0, n = e.holes.length; t < n; t++) {
        const n = e.holes[t];
        this.holes.push(new Path().fromJSON(n));
      }
      return this;
    }
  })),
  (Light.prototype = Object.assign(Object.create(Object3D.prototype), {
    constructor: Light,
    isLight: !0,
    copy: function (e) {
      return (
        Object3D.prototype.copy.call(this, e),
        this.color.copy(e.color),
        (this.intensity = e.intensity),
        this
      );
    },
    toJSON: function (e) {
      const t = Object3D.prototype.toJSON.call(this, e);
      return (
        (t.object.color = this.color.getHex()),
        (t.object.intensity = this.intensity),
        void 0 !== this.groundColor &&
          (t.object.groundColor = this.groundColor.getHex()),
        void 0 !== this.distance && (t.object.distance = this.distance),
        void 0 !== this.angle && (t.object.angle = this.angle),
        void 0 !== this.decay && (t.object.decay = this.decay),
        void 0 !== this.penumbra && (t.object.penumbra = this.penumbra),
        void 0 !== this.shadow && (t.object.shadow = this.shadow.toJSON()),
        t
      );
    }
  })),
  (HemisphereLight.prototype = Object.assign(Object.create(Light.prototype), {
    constructor: HemisphereLight,
    isHemisphereLight: !0,
    copy: function (e) {
      return (
        Light.prototype.copy.call(this, e),
        this.groundColor.copy(e.groundColor),
        this
      );
    }
  })),
  Object.assign(LightShadow.prototype, {
    _projScreenMatrix: new Matrix4(),
    _lightPositionWorld: new Vector3(),
    _lookTarget: new Vector3(),
    getViewportCount: function () {
      return this._viewportCount;
    },
    getFrustum: function () {
      return this._frustum;
    },
    updateMatrices: function (e) {
      const t = this.camera,
        n = this.matrix,
        r = this._projScreenMatrix,
        i = this._lookTarget,
        o = this._lightPositionWorld;
      o.setFromMatrixPosition(e.matrixWorld),
        t.position.copy(o),
        i.setFromMatrixPosition(e.target.matrixWorld),
        t.lookAt(i),
        t.updateMatrixWorld(),
        r.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse),
        this._frustum.setFromProjectionMatrix(r),
        n.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1),
        n.multiply(t.projectionMatrix),
        n.multiply(t.matrixWorldInverse);
    },
    getViewport: function (e) {
      return this._viewports[e];
    },
    getFrameExtents: function () {
      return this._frameExtents;
    },
    copy: function (e) {
      return (
        (this.camera = e.camera.clone()),
        (this.bias = e.bias),
        (this.radius = e.radius),
        this.mapSize.copy(e.mapSize),
        this
      );
    },
    clone: function () {
      return new this.constructor().copy(this);
    },
    toJSON: function () {
      const e = {};
      return (
        0 !== this.bias && (e.bias = this.bias),
        0 !== this.normalBias && (e.normalBias = this.normalBias),
        1 !== this.radius && (e.radius = this.radius),
        (512 === this.mapSize.x && 512 === this.mapSize.y) ||
          (e.mapSize = this.mapSize.toArray()),
        (e.camera = this.camera.toJSON(!1).object),
        delete e.camera.matrix,
        e
      );
    }
  }),
  (SpotLightShadow.prototype = Object.assign(
    Object.create(LightShadow.prototype),
    {
      constructor: SpotLightShadow,
      isSpotLightShadow: !0,
      updateMatrices: function (e) {
        const t = this.camera,
          n = 2 * MathUtils.RAD2DEG * e.angle * this.focus,
          r = this.mapSize.width / this.mapSize.height,
          i = e.distance || t.far;
        (n === t.fov && r === t.aspect && i === t.far) ||
          ((t.fov = n),
          (t.aspect = r),
          (t.far = i),
          t.updateProjectionMatrix()),
          LightShadow.prototype.updateMatrices.call(this, e);
      }
    }
  )),
  (SpotLight.prototype = Object.assign(Object.create(Light.prototype), {
    constructor: SpotLight,
    isSpotLight: !0,
    copy: function (e) {
      return (
        Light.prototype.copy.call(this, e),
        (this.distance = e.distance),
        (this.angle = e.angle),
        (this.penumbra = e.penumbra),
        (this.decay = e.decay),
        (this.target = e.target.clone()),
        (this.shadow = e.shadow.clone()),
        this
      );
    }
  })),
  (PointLightShadow.prototype = Object.assign(
    Object.create(LightShadow.prototype),
    {
      constructor: PointLightShadow,
      isPointLightShadow: !0,
      updateMatrices: function (e, t) {
        void 0 === t && (t = 0);
        const n = this.camera,
          r = this.matrix,
          i = this._lightPositionWorld,
          o = this._lookTarget,
          a = this._projScreenMatrix;
        i.setFromMatrixPosition(e.matrixWorld),
          n.position.copy(i),
          o.copy(n.position),
          o.add(this._cubeDirections[t]),
          n.up.copy(this._cubeUps[t]),
          n.lookAt(o),
          n.updateMatrixWorld(),
          r.makeTranslation(-i.x, -i.y, -i.z),
          a.multiplyMatrices(n.projectionMatrix, n.matrixWorldInverse),
          this._frustum.setFromProjectionMatrix(a);
      }
    }
  )),
  (PointLight.prototype = Object.assign(Object.create(Light.prototype), {
    constructor: PointLight,
    isPointLight: !0,
    copy: function (e) {
      return (
        Light.prototype.copy.call(this, e),
        (this.distance = e.distance),
        (this.decay = e.decay),
        (this.shadow = e.shadow.clone()),
        this
      );
    }
  })),
  (OrthographicCamera.prototype = Object.assign(
    Object.create(Camera.prototype),
    {
      constructor: OrthographicCamera,
      isOrthographicCamera: !0,
      copy: function (e, t) {
        return (
          Camera.prototype.copy.call(this, e, t),
          (this.left = e.left),
          (this.right = e.right),
          (this.top = e.top),
          (this.bottom = e.bottom),
          (this.near = e.near),
          (this.far = e.far),
          (this.zoom = e.zoom),
          (this.view = null === e.view ? null : Object.assign({}, e.view)),
          this
        );
      },
      setViewOffset: function (e, t, n, r, i, o) {
        null === this.view &&
          (this.view = {
            enabled: !0,
            fullWidth: 1,
            fullHeight: 1,
            offsetX: 0,
            offsetY: 0,
            width: 1,
            height: 1
          }),
          (this.view.enabled = !0),
          (this.view.fullWidth = e),
          (this.view.fullHeight = t),
          (this.view.offsetX = n),
          (this.view.offsetY = r),
          (this.view.width = i),
          (this.view.height = o),
          this.updateProjectionMatrix();
      },
      clearViewOffset: function () {
        null !== this.view && (this.view.enabled = !1),
          this.updateProjectionMatrix();
      },
      updateProjectionMatrix: function () {
        const e = (this.right - this.left) / (2 * this.zoom),
          t = (this.top - this.bottom) / (2 * this.zoom),
          n = (this.right + this.left) / 2,
          r = (this.top + this.bottom) / 2;
        let i = n - e,
          o = n + e,
          a = r + t,
          s = r - t;
        if (null !== this.view && this.view.enabled) {
          const e = (this.right - this.left) / this.view.fullWidth / this.zoom,
            t = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
          (o = (i += e * this.view.offsetX) + e * this.view.width),
            (s = (a -= t * this.view.offsetY) - t * this.view.height);
        }
        this.projectionMatrix.makeOrthographic(i, o, a, s, this.near, this.far),
          this.projectionMatrixInverse.getInverse(this.projectionMatrix);
      },
      toJSON: function (e) {
        const t = Object3D.prototype.toJSON.call(this, e);
        return (
          (t.object.zoom = this.zoom),
          (t.object.left = this.left),
          (t.object.right = this.right),
          (t.object.top = this.top),
          (t.object.bottom = this.bottom),
          (t.object.near = this.near),
          (t.object.far = this.far),
          null !== this.view && (t.object.view = Object.assign({}, this.view)),
          t
        );
      }
    }
  )),
  (DirectionalLightShadow.prototype = Object.assign(
    Object.create(LightShadow.prototype),
    {
      constructor: DirectionalLightShadow,
      isDirectionalLightShadow: !0,
      updateMatrices: function (e) {
        LightShadow.prototype.updateMatrices.call(this, e);
      }
    }
  )),
  (DirectionalLight.prototype = Object.assign(Object.create(Light.prototype), {
    constructor: DirectionalLight,
    isDirectionalLight: !0,
    copy: function (e) {
      return (
        Light.prototype.copy.call(this, e),
        (this.target = e.target.clone()),
        (this.shadow = e.shadow.clone()),
        this
      );
    }
  })),
  (AmbientLight.prototype = Object.assign(Object.create(Light.prototype), {
    constructor: AmbientLight,
    isAmbientLight: !0
  })),
  (RectAreaLight.prototype = Object.assign(Object.create(Light.prototype), {
    constructor: RectAreaLight,
    isRectAreaLight: !0,
    copy: function (e) {
      return (
        Light.prototype.copy.call(this, e),
        (this.width = e.width),
        (this.height = e.height),
        this
      );
    },
    toJSON: function (e) {
      const t = Light.prototype.toJSON.call(this, e);
      return (t.object.width = this.width), (t.object.height = this.height), t;
    }
  }));
class SphericalHarmonics3 {
  constructor() {
    Object.defineProperty(this, "isSphericalHarmonics3", { value: !0 }),
      (this.coefficients = []);
    for (let e = 0; e < 9; e++) this.coefficients.push(new Vector3());
  }
  set(e) {
    for (let t = 0; t < 9; t++) this.coefficients[t].copy(e[t]);
    return this;
  }
  zero() {
    for (let e = 0; e < 9; e++) this.coefficients[e].set(0, 0, 0);
    return this;
  }
  getAt(e, t) {
    const n = e.x,
      r = e.y,
      i = e.z,
      o = this.coefficients;
    return (
      t.copy(o[0]).multiplyScalar(0.282095),
      t.addScaledVector(o[1], 0.488603 * r),
      t.addScaledVector(o[2], 0.488603 * i),
      t.addScaledVector(o[3], 0.488603 * n),
      t.addScaledVector(o[4], n * r * 1.092548),
      t.addScaledVector(o[5], r * i * 1.092548),
      t.addScaledVector(o[6], 0.315392 * (3 * i * i - 1)),
      t.addScaledVector(o[7], n * i * 1.092548),
      t.addScaledVector(o[8], 0.546274 * (n * n - r * r)),
      t
    );
  }
  getIrradianceAt(e, t) {
    const n = e.x,
      r = e.y,
      i = e.z,
      o = this.coefficients;
    return (
      t.copy(o[0]).multiplyScalar(0.886227),
      t.addScaledVector(o[1], 1.023328 * r),
      t.addScaledVector(o[2], 1.023328 * i),
      t.addScaledVector(o[3], 1.023328 * n),
      t.addScaledVector(o[4], 0.858086 * n * r),
      t.addScaledVector(o[5], 0.858086 * r * i),
      t.addScaledVector(o[6], 0.743125 * i * i - 0.247708),
      t.addScaledVector(o[7], 0.858086 * n * i),
      t.addScaledVector(o[8], 0.429043 * (n * n - r * r)),
      t
    );
  }
  add(e) {
    for (let t = 0; t < 9; t++) this.coefficients[t].add(e.coefficients[t]);
    return this;
  }
  addScaledSH(e, t) {
    for (let n = 0; n < 9; n++)
      this.coefficients[n].addScaledVector(e.coefficients[n], t);
    return this;
  }
  scale(e) {
    for (let t = 0; t < 9; t++) this.coefficients[t].multiplyScalar(e);
    return this;
  }
  lerp(e, t) {
    for (let n = 0; n < 9; n++) this.coefficients[n].lerp(e.coefficients[n], t);
    return this;
  }
  equals(e) {
    for (let t = 0; t < 9; t++)
      if (!this.coefficients[t].equals(e.coefficients[t])) return !1;
    return !0;
  }
  copy(e) {
    return this.set(e.coefficients);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  fromArray(e, t) {
    void 0 === t && (t = 0);
    const n = this.coefficients;
    for (let r = 0; r < 9; r++) n[r].fromArray(e, t + 3 * r);
    return this;
  }
  toArray(e, t) {
    void 0 === e && (e = []), void 0 === t && (t = 0);
    const n = this.coefficients;
    for (let r = 0; r < 9; r++) n[r].toArray(e, t + 3 * r);
    return e;
  }
  static getBasisAt(e, t) {
    const n = e.x,
      r = e.y,
      i = e.z;
    (t[0] = 0.282095),
      (t[1] = 0.488603 * r),
      (t[2] = 0.488603 * i),
      (t[3] = 0.488603 * n),
      (t[4] = 1.092548 * n * r),
      (t[5] = 1.092548 * r * i),
      (t[6] = 0.315392 * (3 * i * i - 1)),
      (t[7] = 1.092548 * n * i),
      (t[8] = 0.546274 * (n * n - r * r));
  }
}
function LightProbe(e, t) {
  Light.call(this, void 0, t),
    (this.type = "LightProbe"),
    (this.sh = void 0 !== e ? e : new SphericalHarmonics3());
}
function MaterialLoader(e) {
  Loader.call(this, e), (this.textures = {});
}
(LightProbe.prototype = Object.assign(Object.create(Light.prototype), {
  constructor: LightProbe,
  isLightProbe: !0,
  copy: function (e) {
    return Light.prototype.copy.call(this, e), this.sh.copy(e.sh), this;
  },
  fromJSON: function (e) {
    return (this.intensity = e.intensity), this.sh.fromArray(e.sh), this;
  },
  toJSON: function (e) {
    const t = Light.prototype.toJSON.call(this, e);
    return (t.object.sh = this.sh.toArray()), t;
  }
})),
  (MaterialLoader.prototype = Object.assign(Object.create(Loader.prototype), {
    constructor: MaterialLoader,
    load: function (e, t, n, r) {
      const i = this,
        o = new FileLoader(i.manager);
      o.setPath(i.path),
        o.setRequestHeader(i.requestHeader),
        o.setWithCredentials(i.withCredentials),
        o.load(
          e,
          function (n) {
            try {
              t(i.parse(JSON.parse(n)));
            } catch (t) {
              r ? r(t) : console.error(t), i.manager.itemError(e);
            }
          },
          n,
          r
        );
    },
    parse: function (e) {
      const t = this.textures;
      function n(e) {
        return (
          void 0 === t[e] &&
            console.warn("THREE.MaterialLoader: Undefined texture", e),
          t[e]
        );
      }
      const r = new Materials[e.type]();
      if (
        (void 0 !== e.uuid && (r.uuid = e.uuid),
        void 0 !== e.name && (r.name = e.name),
        void 0 !== e.color && r.color.setHex(e.color),
        void 0 !== e.roughness && (r.roughness = e.roughness),
        void 0 !== e.metalness && (r.metalness = e.metalness),
        void 0 !== e.sheen && (r.sheen = new Color().setHex(e.sheen)),
        void 0 !== e.emissive && r.emissive.setHex(e.emissive),
        void 0 !== e.specular && r.specular.setHex(e.specular),
        void 0 !== e.shininess && (r.shininess = e.shininess),
        void 0 !== e.clearcoat && (r.clearcoat = e.clearcoat),
        void 0 !== e.clearcoatRoughness &&
          (r.clearcoatRoughness = e.clearcoatRoughness),
        void 0 !== e.fog && (r.fog = e.fog),
        void 0 !== e.flatShading && (r.flatShading = e.flatShading),
        void 0 !== e.blending && (r.blending = e.blending),
        void 0 !== e.combine && (r.combine = e.combine),
        void 0 !== e.side && (r.side = e.side),
        void 0 !== e.opacity && (r.opacity = e.opacity),
        void 0 !== e.transparent && (r.transparent = e.transparent),
        void 0 !== e.alphaTest && (r.alphaTest = e.alphaTest),
        void 0 !== e.depthTest && (r.depthTest = e.depthTest),
        void 0 !== e.depthWrite && (r.depthWrite = e.depthWrite),
        void 0 !== e.colorWrite && (r.colorWrite = e.colorWrite),
        void 0 !== e.stencilWrite && (r.stencilWrite = e.stencilWrite),
        void 0 !== e.stencilWriteMask &&
          (r.stencilWriteMask = e.stencilWriteMask),
        void 0 !== e.stencilFunc && (r.stencilFunc = e.stencilFunc),
        void 0 !== e.stencilRef && (r.stencilRef = e.stencilRef),
        void 0 !== e.stencilFuncMask && (r.stencilFuncMask = e.stencilFuncMask),
        void 0 !== e.stencilFail && (r.stencilFail = e.stencilFail),
        void 0 !== e.stencilZFail && (r.stencilZFail = e.stencilZFail),
        void 0 !== e.stencilZPass && (r.stencilZPass = e.stencilZPass),
        void 0 !== e.wireframe && (r.wireframe = e.wireframe),
        void 0 !== e.wireframeLinewidth &&
          (r.wireframeLinewidth = e.wireframeLinewidth),
        void 0 !== e.wireframeLinecap &&
          (r.wireframeLinecap = e.wireframeLinecap),
        void 0 !== e.wireframeLinejoin &&
          (r.wireframeLinejoin = e.wireframeLinejoin),
        void 0 !== e.rotation && (r.rotation = e.rotation),
        1 !== e.linewidth && (r.linewidth = e.linewidth),
        void 0 !== e.dashSize && (r.dashSize = e.dashSize),
        void 0 !== e.gapSize && (r.gapSize = e.gapSize),
        void 0 !== e.scale && (r.scale = e.scale),
        void 0 !== e.polygonOffset && (r.polygonOffset = e.polygonOffset),
        void 0 !== e.polygonOffsetFactor &&
          (r.polygonOffsetFactor = e.polygonOffsetFactor),
        void 0 !== e.polygonOffsetUnits &&
          (r.polygonOffsetUnits = e.polygonOffsetUnits),
        void 0 !== e.skinning && (r.skinning = e.skinning),
        void 0 !== e.morphTargets && (r.morphTargets = e.morphTargets),
        void 0 !== e.morphNormals && (r.morphNormals = e.morphNormals),
        void 0 !== e.dithering && (r.dithering = e.dithering),
        void 0 !== e.vertexTangents && (r.vertexTangents = e.vertexTangents),
        void 0 !== e.visible && (r.visible = e.visible),
        void 0 !== e.toneMapped && (r.toneMapped = e.toneMapped),
        void 0 !== e.userData && (r.userData = e.userData),
        void 0 !== e.vertexColors &&
          ("number" == typeof e.vertexColors
            ? (r.vertexColors = e.vertexColors > 0)
            : (r.vertexColors = e.vertexColors)),
        void 0 !== e.uniforms)
      )
        for (const t in e.uniforms) {
          const i = e.uniforms[t];
          switch (((r.uniforms[t] = {}), i.type)) {
            case "t":
              r.uniforms[t].value = n(i.value);
              break;
            case "c":
              r.uniforms[t].value = new Color().setHex(i.value);
              break;
            case "v2":
              r.uniforms[t].value = new Vector2().fromArray(i.value);
              break;
            case "v3":
              r.uniforms[t].value = new Vector3().fromArray(i.value);
              break;
            case "v4":
              r.uniforms[t].value = new Vector4().fromArray(i.value);
              break;
            case "m3":
              r.uniforms[t].value = new Matrix3().fromArray(i.value);
              break;
            case "m4":
              r.uniforms[t].value = new Matrix4().fromArray(i.value);
              break;
            default:
              r.uniforms[t].value = i.value;
          }
        }
      if (
        (void 0 !== e.defines && (r.defines = e.defines),
        void 0 !== e.vertexShader && (r.vertexShader = e.vertexShader),
        void 0 !== e.fragmentShader && (r.fragmentShader = e.fragmentShader),
        void 0 !== e.extensions)
      )
        for (const t in e.extensions) r.extensions[t] = e.extensions[t];
      if (
        (void 0 !== e.shading && (r.flatShading = 1 === e.shading),
        void 0 !== e.size && (r.size = e.size),
        void 0 !== e.sizeAttenuation && (r.sizeAttenuation = e.sizeAttenuation),
        void 0 !== e.map && (r.map = n(e.map)),
        void 0 !== e.matcap && (r.matcap = n(e.matcap)),
        void 0 !== e.alphaMap && (r.alphaMap = n(e.alphaMap)),
        void 0 !== e.bumpMap && (r.bumpMap = n(e.bumpMap)),
        void 0 !== e.bumpScale && (r.bumpScale = e.bumpScale),
        void 0 !== e.normalMap && (r.normalMap = n(e.normalMap)),
        void 0 !== e.normalMapType && (r.normalMapType = e.normalMapType),
        void 0 !== e.normalScale)
      ) {
        let t = e.normalScale;
        !1 === Array.isArray(t) && (t = [t, t]),
          (r.normalScale = new Vector2().fromArray(t));
      }
      return (
        void 0 !== e.displacementMap &&
          (r.displacementMap = n(e.displacementMap)),
        void 0 !== e.displacementScale &&
          (r.displacementScale = e.displacementScale),
        void 0 !== e.displacementBias &&
          (r.displacementBias = e.displacementBias),
        void 0 !== e.roughnessMap && (r.roughnessMap = n(e.roughnessMap)),
        void 0 !== e.metalnessMap && (r.metalnessMap = n(e.metalnessMap)),
        void 0 !== e.emissiveMap && (r.emissiveMap = n(e.emissiveMap)),
        void 0 !== e.emissiveIntensity &&
          (r.emissiveIntensity = e.emissiveIntensity),
        void 0 !== e.specularMap && (r.specularMap = n(e.specularMap)),
        void 0 !== e.envMap && (r.envMap = n(e.envMap)),
        void 0 !== e.envMapIntensity && (r.envMapIntensity = e.envMapIntensity),
        void 0 !== e.reflectivity && (r.reflectivity = e.reflectivity),
        void 0 !== e.refractionRatio && (r.refractionRatio = e.refractionRatio),
        void 0 !== e.lightMap && (r.lightMap = n(e.lightMap)),
        void 0 !== e.lightMapIntensity &&
          (r.lightMapIntensity = e.lightMapIntensity),
        void 0 !== e.aoMap && (r.aoMap = n(e.aoMap)),
        void 0 !== e.aoMapIntensity && (r.aoMapIntensity = e.aoMapIntensity),
        void 0 !== e.gradientMap && (r.gradientMap = n(e.gradientMap)),
        void 0 !== e.clearcoatMap && (r.clearcoatMap = n(e.clearcoatMap)),
        void 0 !== e.clearcoatRoughnessMap &&
          (r.clearcoatRoughnessMap = n(e.clearcoatRoughnessMap)),
        void 0 !== e.clearcoatNormalMap &&
          (r.clearcoatNormalMap = n(e.clearcoatNormalMap)),
        void 0 !== e.clearcoatNormalScale &&
          (r.clearcoatNormalScale = new Vector2().fromArray(
            e.clearcoatNormalScale
          )),
        void 0 !== e.transmission && (r.transmission = e.transmission),
        void 0 !== e.transmissionMap &&
          (r.transmissionMap = n(e.transmissionMap)),
        r
      );
    },
    setTextures: function (e) {
      return (this.textures = e), this;
    }
  }));
const LoaderUtils = {
  decodeText: function (e) {
    if ("undefined" != typeof TextDecoder) return new TextDecoder().decode(e);
    let t = "";
    for (let n = 0, r = e.length; n < r; n++) t += String.fromCharCode(e[n]);
    try {
      return decodeURIComponent(escape(t));
    } catch (e) {
      return t;
    }
  },
  extractUrlBase: function (e) {
    const t = e.lastIndexOf("/");
    return -1 === t ? "./" : e.substr(0, t + 1);
  }
};
function InstancedBufferGeometry() {
  BufferGeometry.call(this),
    (this.type = "InstancedBufferGeometry"),
    (this.instanceCount = 1 / 0);
}
function InstancedBufferAttribute(e, t, n, r) {
  "number" == typeof n &&
    ((r = n),
    (n = !1),
    console.error(
      "THREE.InstancedBufferAttribute: The constructor now expects normalized as the third argument."
    )),
    BufferAttribute.call(this, e, t, n),
    (this.meshPerAttribute = r || 1);
}
function BufferGeometryLoader(e) {
  Loader.call(this, e);
}
(InstancedBufferGeometry.prototype = Object.assign(
  Object.create(BufferGeometry.prototype),
  {
    constructor: InstancedBufferGeometry,
    isInstancedBufferGeometry: !0,
    copy: function (e) {
      return (
        BufferGeometry.prototype.copy.call(this, e),
        (this.instanceCount = e.instanceCount),
        this
      );
    },
    clone: function () {
      return new this.constructor().copy(this);
    },
    toJSON: function () {
      const e = BufferGeometry.prototype.toJSON.call(this);
      return (
        (e.instanceCount = this.instanceCount),
        (e.isInstancedBufferGeometry = !0),
        e
      );
    }
  }
)),
  (InstancedBufferAttribute.prototype = Object.assign(
    Object.create(BufferAttribute.prototype),
    {
      constructor: InstancedBufferAttribute,
      isInstancedBufferAttribute: !0,
      copy: function (e) {
        return (
          BufferAttribute.prototype.copy.call(this, e),
          (this.meshPerAttribute = e.meshPerAttribute),
          this
        );
      },
      toJSON: function () {
        const e = BufferAttribute.prototype.toJSON.call(this);
        return (
          (e.meshPerAttribute = this.meshPerAttribute),
          (e.isInstancedBufferAttribute = !0),
          e
        );
      }
    }
  )),
  (BufferGeometryLoader.prototype = Object.assign(
    Object.create(Loader.prototype),
    {
      constructor: BufferGeometryLoader,
      load: function (e, t, n, r) {
        const i = this,
          o = new FileLoader(i.manager);
        o.setPath(i.path),
          o.setRequestHeader(i.requestHeader),
          o.setWithCredentials(i.withCredentials),
          o.load(
            e,
            function (n) {
              try {
                t(i.parse(JSON.parse(n)));
              } catch (t) {
                r ? r(t) : console.error(t), i.manager.itemError(e);
              }
            },
            n,
            r
          );
      },
      parse: function (e) {
        const t = {},
          n = {};
        function r(e, r) {
          if (void 0 !== t[r]) return t[r];
          const i = e.interleavedBuffers[r],
            o = (function (e, t) {
              if (void 0 !== n[t]) return n[t];
              const r = e.arrayBuffers[t],
                i = new Uint32Array(r).buffer;
              return (n[t] = i), i;
            })(e, i.buffer),
            a = new InterleavedBuffer(new TYPED_ARRAYS[i.type](o), i.stride);
          return (a.uuid = i.uuid), (t[r] = a), a;
        }
        const i = e.isInstancedBufferGeometry
            ? new InstancedBufferGeometry()
            : new BufferGeometry(),
          o = e.data.index;
        if (void 0 !== o) {
          const e = new TYPED_ARRAYS[o.type](o.array);
          i.setIndex(new BufferAttribute(e, 1));
        }
        const a = e.data.attributes;
        for (const t in a) {
          const n = a[t];
          let o;
          if (n.isInterleavedBufferAttribute) {
            o = new InterleavedBufferAttribute(
              r(e.data, n.data),
              n.itemSize,
              n.offset,
              n.normalized
            );
          } else {
            const e = new TYPED_ARRAYS[n.type](n.array);
            o = new (
              n.isInstancedBufferAttribute
                ? InstancedBufferAttribute
                : BufferAttribute
            )(e, n.itemSize, n.normalized);
          }
          void 0 !== n.name && (o.name = n.name), i.setAttribute(t, o);
        }
        const s = e.data.morphAttributes;
        if (s)
          for (const t in s) {
            const n = s[t],
              o = [];
            for (let t = 0, i = n.length; t < i; t++) {
              const i = n[t];
              let a;
              if (i.isInterleavedBufferAttribute) {
                a = new InterleavedBufferAttribute(
                  r(e.data, i.data),
                  i.itemSize,
                  i.offset,
                  i.normalized
                );
              } else {
                a = new BufferAttribute(
                  new TYPED_ARRAYS[i.type](i.array),
                  i.itemSize,
                  i.normalized
                );
              }
              void 0 !== i.name && (a.name = i.name), o.push(a);
            }
            i.morphAttributes[t] = o;
          }
        e.data.morphTargetsRelative && (i.morphTargetsRelative = !0);
        const c = e.data.groups || e.data.drawcalls || e.data.offsets;
        if (void 0 !== c)
          for (let e = 0, t = c.length; e !== t; ++e) {
            const t = c[e];
            i.addGroup(t.start, t.count, t.materialIndex);
          }
        const l = e.data.boundingSphere;
        if (void 0 !== l) {
          const e = new Vector3();
          void 0 !== l.center && e.fromArray(l.center),
            (i.boundingSphere = new Sphere(e, l.radius));
        }
        return (
          e.name && (i.name = e.name),
          e.userData && (i.userData = e.userData),
          i
        );
      }
    }
  ));
const TYPED_ARRAYS = {
  Int8Array: Int8Array,
  Uint8Array: Uint8Array,
  Uint8ClampedArray:
    "undefined" != typeof Uint8ClampedArray ? Uint8ClampedArray : Uint8Array,
  Int16Array: Int16Array,
  Uint16Array: Uint16Array,
  Int32Array: Int32Array,
  Uint32Array: Uint32Array,
  Float32Array: Float32Array,
  Float64Array: Float64Array
};
class ObjectLoader extends Loader {
  constructor(e) {
    super(e);
  }
  load(e, t, n, r) {
    const i = this,
      o = "" === this.path ? LoaderUtils.extractUrlBase(e) : this.path;
    this.resourcePath = this.resourcePath || o;
    const a = new FileLoader(this.manager);
    a.setPath(this.path),
      a.setRequestHeader(this.requestHeader),
      a.setWithCredentials(this.withCredentials),
      a.load(
        e,
        function (n) {
          let o = null;
          try {
            o = JSON.parse(n);
          } catch (t) {
            return (
              void 0 !== r && r(t),
              void console.error(
                "THREE:ObjectLoader: Can't parse " + e + ".",
                t.message
              )
            );
          }
          const a = o.metadata;
          void 0 !== a &&
          void 0 !== a.type &&
          "geometry" !== a.type.toLowerCase()
            ? i.parse(o, t)
            : console.error("THREE.ObjectLoader: Can't load " + e);
        },
        n,
        r
      );
  }
  parse(e, t) {
    const n = this.parseShape(e.shapes),
      r = this.parseGeometries(e.geometries, n),
      i = this.parseImages(e.images, function () {
        void 0 !== t && t(s);
      }),
      o = this.parseTextures(e.textures, i),
      a = this.parseMaterials(e.materials, o),
      s = this.parseObject(e.object, r, a);
    return (
      e.animations && (s.animations = this.parseAnimations(e.animations)),
      (void 0 !== e.images && 0 !== e.images.length) || (void 0 !== t && t(s)),
      s
    );
  }
  parseShape(e) {
    const t = {};
    if (void 0 !== e)
      for (let n = 0, r = e.length; n < r; n++) {
        const r = new Shape().fromJSON(e[n]);
        t[r.uuid] = r;
      }
    return t;
  }
  parseGeometries(e, t) {
    const n = {};
    let r;
    if (void 0 !== e) {
      const i = new BufferGeometryLoader();
      for (let o = 0, a = e.length; o < a; o++) {
        let a;
        const s = e[o];
        switch (s.type) {
          case "PlaneGeometry":
          case "PlaneBufferGeometry":
            a = new Geometries[s.type](
              s.width,
              s.height,
              s.widthSegments,
              s.heightSegments
            );
            break;
          case "BoxGeometry":
          case "BoxBufferGeometry":
          case "CubeGeometry":
            a = new Geometries[s.type](
              s.width,
              s.height,
              s.depth,
              s.widthSegments,
              s.heightSegments,
              s.depthSegments
            );
            break;
          case "CircleGeometry":
          case "CircleBufferGeometry":
            a = new Geometries[s.type](
              s.radius,
              s.segments,
              s.thetaStart,
              s.thetaLength
            );
            break;
          case "CylinderGeometry":
          case "CylinderBufferGeometry":
            a = new Geometries[s.type](
              s.radiusTop,
              s.radiusBottom,
              s.height,
              s.radialSegments,
              s.heightSegments,
              s.openEnded,
              s.thetaStart,
              s.thetaLength
            );
            break;
          case "ConeGeometry":
          case "ConeBufferGeometry":
            a = new Geometries[s.type](
              s.radius,
              s.height,
              s.radialSegments,
              s.heightSegments,
              s.openEnded,
              s.thetaStart,
              s.thetaLength
            );
            break;
          case "SphereGeometry":
          case "SphereBufferGeometry":
            a = new Geometries[s.type](
              s.radius,
              s.widthSegments,
              s.heightSegments,
              s.phiStart,
              s.phiLength,
              s.thetaStart,
              s.thetaLength
            );
            break;
          case "DodecahedronGeometry":
          case "DodecahedronBufferGeometry":
          case "IcosahedronGeometry":
          case "IcosahedronBufferGeometry":
          case "OctahedronGeometry":
          case "OctahedronBufferGeometry":
          case "TetrahedronGeometry":
          case "TetrahedronBufferGeometry":
            a = new Geometries[s.type](s.radius, s.detail);
            break;
          case "RingGeometry":
          case "RingBufferGeometry":
            a = new Geometries[s.type](
              s.innerRadius,
              s.outerRadius,
              s.thetaSegments,
              s.phiSegments,
              s.thetaStart,
              s.thetaLength
            );
            break;
          case "TorusGeometry":
          case "TorusBufferGeometry":
            a = new Geometries[s.type](
              s.radius,
              s.tube,
              s.radialSegments,
              s.tubularSegments,
              s.arc
            );
            break;
          case "TorusKnotGeometry":
          case "TorusKnotBufferGeometry":
            a = new Geometries[s.type](
              s.radius,
              s.tube,
              s.tubularSegments,
              s.radialSegments,
              s.p,
              s.q
            );
            break;
          case "TubeGeometry":
          case "TubeBufferGeometry":
            a = new Geometries[s.type](
              new Curves[s.path.type]().fromJSON(s.path),
              s.tubularSegments,
              s.radius,
              s.radialSegments,
              s.closed
            );
            break;
          case "LatheGeometry":
          case "LatheBufferGeometry":
            a = new Geometries[s.type](
              s.points,
              s.segments,
              s.phiStart,
              s.phiLength
            );
            break;
          case "PolyhedronGeometry":
          case "PolyhedronBufferGeometry":
            a = new Geometries[s.type](
              s.vertices,
              s.indices,
              s.radius,
              s.details
            );
            break;
          case "ShapeGeometry":
          case "ShapeBufferGeometry":
            r = [];
            for (let e = 0, n = s.shapes.length; e < n; e++) {
              const n = t[s.shapes[e]];
              r.push(n);
            }
            a = new Geometries[s.type](r, s.curveSegments);
            break;
          case "ExtrudeGeometry":
          case "ExtrudeBufferGeometry":
            r = [];
            for (let e = 0, n = s.shapes.length; e < n; e++) {
              const n = t[s.shapes[e]];
              r.push(n);
            }
            const e = s.options.extrudePath;
            void 0 !== e &&
              (s.options.extrudePath = new Curves[e.type]().fromJSON(e)),
              (a = new Geometries[s.type](r, s.options));
            break;
          case "BufferGeometry":
          case "InstancedBufferGeometry":
            a = i.parse(s);
            break;
          case "Geometry":
            console.error(
              'THREE.ObjectLoader: Loading "Geometry" is not supported anymore.'
            );
            break;
          default:
            console.warn(
              'THREE.ObjectLoader: Unsupported geometry type "' + s.type + '"'
            );
            continue;
        }
        (a.uuid = s.uuid),
          void 0 !== s.name && (a.name = s.name),
          !0 === a.isBufferGeometry &&
            void 0 !== s.userData &&
            (a.userData = s.userData),
          (n[s.uuid] = a);
      }
    }
    return n;
  }
  parseMaterials(e, t) {
    const n = {},
      r = {};
    if (void 0 !== e) {
      const i = new MaterialLoader();
      i.setTextures(t);
      for (let t = 0, o = e.length; t < o; t++) {
        const o = e[t];
        if ("MultiMaterial" === o.type) {
          const e = [];
          for (let t = 0; t < o.materials.length; t++) {
            const r = o.materials[t];
            void 0 === n[r.uuid] && (n[r.uuid] = i.parse(r)), e.push(n[r.uuid]);
          }
          r[o.uuid] = e;
        } else
          void 0 === n[o.uuid] && (n[o.uuid] = i.parse(o)),
            (r[o.uuid] = n[o.uuid]);
      }
    }
    return r;
  }
  parseAnimations(e) {
    const t = [];
    for (let n = 0; n < e.length; n++) {
      const r = e[n],
        i = AnimationClip.parse(r);
      void 0 !== r.uuid && (i.uuid = r.uuid), t.push(i);
    }
    return t;
  }
  parseImages(e, t) {
    const n = this,
      r = {};
    let i;
    function o(e) {
      return (
        n.manager.itemStart(e),
        i.load(
          e,
          function () {
            n.manager.itemEnd(e);
          },
          void 0,
          function () {
            n.manager.itemError(e), n.manager.itemEnd(e);
          }
        )
      );
    }
    if (void 0 !== e && e.length > 0) {
      const a = new LoadingManager(t);
      (i = new ImageLoader(a)).setCrossOrigin(this.crossOrigin);
      for (let t = 0, i = e.length; t < i; t++) {
        const i = e[t],
          a = i.url;
        if (Array.isArray(a)) {
          r[i.uuid] = [];
          for (let e = 0, t = a.length; e < t; e++) {
            const t = a[e],
              s = /^(\/\/)|([a-z]+:(\/\/)?)/i.test(t) ? t : n.resourcePath + t;
            r[i.uuid].push(o(s));
          }
        } else {
          const e = /^(\/\/)|([a-z]+:(\/\/)?)/i.test(i.url)
            ? i.url
            : n.resourcePath + i.url;
          r[i.uuid] = o(e);
        }
      }
    }
    return r;
  }
  parseTextures(e, t) {
    function n(e, t) {
      return "number" == typeof e
        ? e
        : (console.warn(
            "THREE.ObjectLoader.parseTexture: Constant should be in numeric form.",
            e
          ),
          t[e]);
    }
    const r = {};
    if (void 0 !== e)
      for (let i = 0, o = e.length; i < o; i++) {
        const o = e[i];
        let a;
        void 0 === o.image &&
          console.warn('THREE.ObjectLoader: No "image" specified for', o.uuid),
          void 0 === t[o.image] &&
            console.warn("THREE.ObjectLoader: Undefined image", o.image),
          ((a = Array.isArray(t[o.image])
            ? new CubeTexture(t[o.image])
            : new Texture(t[o.image])).needsUpdate = !0),
          (a.uuid = o.uuid),
          void 0 !== o.name && (a.name = o.name),
          void 0 !== o.mapping && (a.mapping = n(o.mapping, TEXTURE_MAPPING)),
          void 0 !== o.offset && a.offset.fromArray(o.offset),
          void 0 !== o.repeat && a.repeat.fromArray(o.repeat),
          void 0 !== o.center && a.center.fromArray(o.center),
          void 0 !== o.rotation && (a.rotation = o.rotation),
          void 0 !== o.wrap &&
            ((a.wrapS = n(o.wrap[0], TEXTURE_WRAPPING)),
            (a.wrapT = n(o.wrap[1], TEXTURE_WRAPPING))),
          void 0 !== o.format && (a.format = o.format),
          void 0 !== o.type && (a.type = o.type),
          void 0 !== o.encoding && (a.encoding = o.encoding),
          void 0 !== o.minFilter &&
            (a.minFilter = n(o.minFilter, TEXTURE_FILTER)),
          void 0 !== o.magFilter &&
            (a.magFilter = n(o.magFilter, TEXTURE_FILTER)),
          void 0 !== o.anisotropy && (a.anisotropy = o.anisotropy),
          void 0 !== o.flipY && (a.flipY = o.flipY),
          void 0 !== o.premultiplyAlpha &&
            (a.premultiplyAlpha = o.premultiplyAlpha),
          void 0 !== o.unpackAlignment &&
            (a.unpackAlignment = o.unpackAlignment),
          (r[o.uuid] = a);
      }
    return r;
  }
  parseObject(e, t, n) {
    let r, i, o;
    function a(e) {
      return (
        void 0 === t[e] &&
          console.warn("THREE.ObjectLoader: Undefined geometry", e),
        t[e]
      );
    }
    function s(e) {
      if (void 0 !== e) {
        if (Array.isArray(e)) {
          const t = [];
          for (let r = 0, i = e.length; r < i; r++) {
            const i = e[r];
            void 0 === n[i] &&
              console.warn("THREE.ObjectLoader: Undefined material", i),
              t.push(n[i]);
          }
          return t;
        }
        return (
          void 0 === n[e] &&
            console.warn("THREE.ObjectLoader: Undefined material", e),
          n[e]
        );
      }
    }
    switch (e.type) {
      case "Scene":
        (r = new Scene()),
          void 0 !== e.background &&
            Number.isInteger(e.background) &&
            (r.background = new Color(e.background)),
          void 0 !== e.fog &&
            ("Fog" === e.fog.type
              ? (r.fog = new Fog(e.fog.color, e.fog.near, e.fog.far))
              : "FogExp2" === e.fog.type &&
                (r.fog = new FogExp2(e.fog.color, e.fog.density)));
        break;
      case "PerspectiveCamera":
        (r = new PerspectiveCamera(e.fov, e.aspect, e.near, e.far)),
          void 0 !== e.focus && (r.focus = e.focus),
          void 0 !== e.zoom && (r.zoom = e.zoom),
          void 0 !== e.filmGauge && (r.filmGauge = e.filmGauge),
          void 0 !== e.filmOffset && (r.filmOffset = e.filmOffset),
          void 0 !== e.view && (r.view = Object.assign({}, e.view));
        break;
      case "OrthographicCamera":
        (r = new OrthographicCamera(
          e.left,
          e.right,
          e.top,
          e.bottom,
          e.near,
          e.far
        )),
          void 0 !== e.zoom && (r.zoom = e.zoom),
          void 0 !== e.view && (r.view = Object.assign({}, e.view));
        break;
      case "AmbientLight":
        r = new AmbientLight(e.color, e.intensity);
        break;
      case "DirectionalLight":
        r = new DirectionalLight(e.color, e.intensity);
        break;
      case "PointLight":
        r = new PointLight(e.color, e.intensity, e.distance, e.decay);
        break;
      case "RectAreaLight":
        r = new RectAreaLight(e.color, e.intensity, e.width, e.height);
        break;
      case "SpotLight":
        r = new SpotLight(
          e.color,
          e.intensity,
          e.distance,
          e.angle,
          e.penumbra,
          e.decay
        );
        break;
      case "HemisphereLight":
        r = new HemisphereLight(e.color, e.groundColor, e.intensity);
        break;
      case "LightProbe":
        r = new LightProbe().fromJSON(e);
        break;
      case "SkinnedMesh":
        console.warn(
          "THREE.ObjectLoader.parseObject() does not support SkinnedMesh yet."
        );
      case "Mesh":
        r = new Mesh((i = a(e.geometry)), (o = s(e.material)));
        break;
      case "InstancedMesh":
        (i = a(e.geometry)), (o = s(e.material));
        const t = e.count,
          n = e.instanceMatrix;
        (r = new InstancedMesh(i, o, t)).instanceMatrix = new BufferAttribute(
          new Float32Array(n.array),
          16
        );
        break;
      case "LOD":
        r = new LOD();
        break;
      case "Line":
        r = new Line(a(e.geometry), s(e.material), e.mode);
        break;
      case "LineLoop":
        r = new LineLoop(a(e.geometry), s(e.material));
        break;
      case "LineSegments":
        r = new LineSegments(a(e.geometry), s(e.material));
        break;
      case "PointCloud":
      case "Points":
        r = new Points(a(e.geometry), s(e.material));
        break;
      case "Sprite":
        r = new Sprite(s(e.material));
        break;
      case "Group":
        r = new Group();
        break;
      default:
        r = new Object3D();
    }
    if (
      ((r.uuid = e.uuid),
      void 0 !== e.name && (r.name = e.name),
      void 0 !== e.matrix
        ? (r.matrix.fromArray(e.matrix),
          void 0 !== e.matrixAutoUpdate &&
            (r.matrixAutoUpdate = e.matrixAutoUpdate),
          r.matrixAutoUpdate &&
            r.matrix.decompose(r.position, r.quaternion, r.scale))
        : (void 0 !== e.position && r.position.fromArray(e.position),
          void 0 !== e.rotation && r.rotation.fromArray(e.rotation),
          void 0 !== e.quaternion && r.quaternion.fromArray(e.quaternion),
          void 0 !== e.scale && r.scale.fromArray(e.scale)),
      void 0 !== e.castShadow && (r.castShadow = e.castShadow),
      void 0 !== e.receiveShadow && (r.receiveShadow = e.receiveShadow),
      e.shadow &&
        (void 0 !== e.shadow.bias && (r.shadow.bias = e.shadow.bias),
        void 0 !== e.shadow.normalBias &&
          (r.shadow.normalBias = e.shadow.normalBias),
        void 0 !== e.shadow.radius && (r.shadow.radius = e.shadow.radius),
        void 0 !== e.shadow.mapSize &&
          r.shadow.mapSize.fromArray(e.shadow.mapSize),
        void 0 !== e.shadow.camera &&
          (r.shadow.camera = this.parseObject(e.shadow.camera))),
      void 0 !== e.visible && (r.visible = e.visible),
      void 0 !== e.frustumCulled && (r.frustumCulled = e.frustumCulled),
      void 0 !== e.renderOrder && (r.renderOrder = e.renderOrder),
      void 0 !== e.userData && (r.userData = e.userData),
      void 0 !== e.layers && (r.layers.mask = e.layers),
      void 0 !== e.children)
    ) {
      const i = e.children;
      for (let e = 0; e < i.length; e++) r.add(this.parseObject(i[e], t, n));
    }
    if ("LOD" === e.type) {
      void 0 !== e.autoUpdate && (r.autoUpdate = e.autoUpdate);
      const t = e.levels;
      for (let e = 0; e < t.length; e++) {
        const n = t[e],
          i = r.getObjectByProperty("uuid", n.object);
        void 0 !== i && r.addLevel(i, n.distance);
      }
    }
    return r;
  }
  setTexturePath(e) {
    return (
      console.warn(
        "THREE.ObjectLoader: .setTexturePath() has been renamed to .setResourcePath()."
      ),
      this.setResourcePath(e)
    );
  }
}
const TEXTURE_MAPPING = {
    UVMapping: 300,
    CubeReflectionMapping: CubeReflectionMapping,
    CubeRefractionMapping: CubeRefractionMapping,
    EquirectangularReflectionMapping: EquirectangularReflectionMapping,
    EquirectangularRefractionMapping: EquirectangularRefractionMapping,
    CubeUVReflectionMapping: CubeUVReflectionMapping,
    CubeUVRefractionMapping: CubeUVRefractionMapping
  },
  TEXTURE_WRAPPING = {
    RepeatWrapping: RepeatWrapping,
    ClampToEdgeWrapping: ClampToEdgeWrapping,
    MirroredRepeatWrapping: MirroredRepeatWrapping
  },
  TEXTURE_FILTER = {
    NearestFilter: NearestFilter,
    NearestMipmapNearestFilter: NearestMipmapNearestFilter,
    NearestMipmapLinearFilter: NearestMipmapLinearFilter,
    LinearFilter: LinearFilter,
    LinearMipmapNearestFilter: LinearMipmapNearestFilter,
    LinearMipmapLinearFilter: LinearMipmapLinearFilter
  };
function ImageBitmapLoader(e) {
  "undefined" == typeof createImageBitmap &&
    console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),
    "undefined" == typeof fetch &&
      console.warn("THREE.ImageBitmapLoader: fetch() not supported."),
    Loader.call(this, e),
    (this.options = { premultiplyAlpha: "none" });
}
function ShapePath() {
  (this.type = "ShapePath"),
    (this.color = new Color()),
    (this.subPaths = []),
    (this.currentPath = null);
}
function Font(e) {
  (this.type = "Font"), (this.data = e);
}
function createPaths(e, t, n) {
  const r = Array.from ? Array.from(e) : String(e).split(""),
    i = t / n.resolution,
    o = (n.boundingBox.yMax - n.boundingBox.yMin + n.underlineThickness) * i,
    a = [];
  let s = 0,
    c = 0;
  for (let e = 0; e < r.length; e++) {
    const t = r[e];
    if ("\n" === t) (s = 0), (c -= o);
    else {
      const e = createPath(t, i, s, c, n);
      (s += e.offsetX), a.push(e.path);
    }
  }
  return a;
}
function createPath(e, t, n, r, i) {
  const o = i.glyphs[e] || i.glyphs["?"];
  if (!o)
    return void console.error(
      'THREE.Font: character "' +
        e +
        '" does not exists in font family ' +
        i.familyName +
        "."
    );
  const a = new ShapePath();
  let s, c, l, h, u, d, p, m;
  if (o.o) {
    const e = o._cachedOutline || (o._cachedOutline = o.o.split(" "));
    for (let i = 0, o = e.length; i < o; ) {
      switch (e[i++]) {
        case "m":
          (s = e[i++] * t + n), (c = e[i++] * t + r), a.moveTo(s, c);
          break;
        case "l":
          (s = e[i++] * t + n), (c = e[i++] * t + r), a.lineTo(s, c);
          break;
        case "q":
          (l = e[i++] * t + n),
            (h = e[i++] * t + r),
            (u = e[i++] * t + n),
            (d = e[i++] * t + r),
            a.quadraticCurveTo(u, d, l, h);
          break;
        case "b":
          (l = e[i++] * t + n),
            (h = e[i++] * t + r),
            (u = e[i++] * t + n),
            (d = e[i++] * t + r),
            (p = e[i++] * t + n),
            (m = e[i++] * t + r),
            a.bezierCurveTo(u, d, p, m, l, h);
      }
    }
  }
  return { offsetX: o.ha * t, path: a };
}
function FontLoader(e) {
  Loader.call(this, e);
}
let _context;
(ImageBitmapLoader.prototype = Object.assign(Object.create(Loader.prototype), {
  constructor: ImageBitmapLoader,
  isImageBitmapLoader: !0,
  setOptions: function (e) {
    return (this.options = e), this;
  },
  load: function (e, t, n, r) {
    void 0 === e && (e = ""),
      void 0 !== this.path && (e = this.path + e),
      (e = this.manager.resolveURL(e));
    const i = this,
      o = Cache.get(e);
    if (void 0 !== o)
      return (
        i.manager.itemStart(e),
        setTimeout(function () {
          t && t(o), i.manager.itemEnd(e);
        }, 0),
        o
      );
    const a = {};
    (a.credentials =
      "anonymous" === this.crossOrigin ? "same-origin" : "include"),
      fetch(e, a)
        .then(function (e) {
          return e.blob();
        })
        .then(function (e) {
          return createImageBitmap(e, i.options);
        })
        .then(function (n) {
          Cache.add(e, n), t && t(n), i.manager.itemEnd(e);
        })
        .catch(function (t) {
          r && r(t), i.manager.itemError(e), i.manager.itemEnd(e);
        }),
      i.manager.itemStart(e);
  }
})),
  Object.assign(ShapePath.prototype, {
    moveTo: function (e, t) {
      return (
        (this.currentPath = new Path()),
        this.subPaths.push(this.currentPath),
        this.currentPath.moveTo(e, t),
        this
      );
    },
    lineTo: function (e, t) {
      return this.currentPath.lineTo(e, t), this;
    },
    quadraticCurveTo: function (e, t, n, r) {
      return this.currentPath.quadraticCurveTo(e, t, n, r), this;
    },
    bezierCurveTo: function (e, t, n, r, i, o) {
      return this.currentPath.bezierCurveTo(e, t, n, r, i, o), this;
    },
    splineThru: function (e) {
      return this.currentPath.splineThru(e), this;
    },
    toShapes: function (e, t) {
      function n(e) {
        const t = [];
        for (let n = 0, r = e.length; n < r; n++) {
          const r = e[n],
            i = new Shape();
          (i.curves = r.curves), t.push(i);
        }
        return t;
      }
      function r(e, t) {
        const n = t.length;
        let r = !1;
        for (let i = n - 1, o = 0; o < n; i = o++) {
          let n = t[i],
            a = t[o],
            s = a.x - n.x,
            c = a.y - n.y;
          if (Math.abs(c) > Number.EPSILON) {
            if (
              (c < 0 && ((n = t[o]), (s = -s), (a = t[i]), (c = -c)),
              e.y < n.y || e.y > a.y)
            )
              continue;
            if (e.y === n.y) {
              if (e.x === n.x) return !0;
            } else {
              const t = c * (e.x - n.x) - s * (e.y - n.y);
              if (0 === t) return !0;
              if (t < 0) continue;
              r = !r;
            }
          } else {
            if (e.y !== n.y) continue;
            if ((a.x <= e.x && e.x <= n.x) || (n.x <= e.x && e.x <= a.x))
              return !0;
          }
        }
        return r;
      }
      const i = ShapeUtils.isClockWise,
        o = this.subPaths;
      if (0 === o.length) return [];
      if (!0 === t) return n(o);
      let a, s, c;
      const l = [];
      if (1 === o.length)
        return (s = o[0]), ((c = new Shape()).curves = s.curves), l.push(c), l;
      let h = !i(o[0].getPoints());
      h = e ? !h : h;
      const u = [],
        d = [];
      let p,
        m,
        f = [],
        g = 0;
      (d[g] = void 0), (f[g] = []);
      for (let t = 0, n = o.length; t < n; t++)
        (a = i((p = (s = o[t]).getPoints()))),
          (a = e ? !a : a)
            ? (!h && d[g] && g++,
              (d[g] = { s: new Shape(), p: p }),
              (d[g].s.curves = s.curves),
              h && g++,
              (f[g] = []))
            : f[g].push({ h: s, p: p[0] });
      if (!d[0]) return n(o);
      if (d.length > 1) {
        let e = !1;
        const t = [];
        for (let e = 0, t = d.length; e < t; e++) u[e] = [];
        for (let n = 0, i = d.length; n < i; n++) {
          const i = f[n];
          for (let o = 0; o < i.length; o++) {
            const a = i[o];
            let s = !0;
            for (let i = 0; i < d.length; i++)
              r(a.p, d[i].p) &&
                (n !== i && t.push({ froms: n, tos: i, hole: o }),
                s ? ((s = !1), u[i].push(a)) : (e = !0));
            s && u[n].push(a);
          }
        }
        t.length > 0 && (e || (f = u));
      }
      for (let e = 0, t = d.length; e < t; e++) {
        (c = d[e].s), l.push(c);
        for (let t = 0, n = (m = f[e]).length; t < n; t++) c.holes.push(m[t].h);
      }
      return l;
    }
  }),
  Object.assign(Font.prototype, {
    isFont: !0,
    generateShapes: function (e, t) {
      void 0 === t && (t = 100);
      const n = [],
        r = createPaths(e, t, this.data);
      for (let e = 0, t = r.length; e < t; e++)
        Array.prototype.push.apply(n, r[e].toShapes());
      return n;
    }
  }),
  (FontLoader.prototype = Object.assign(Object.create(Loader.prototype), {
    constructor: FontLoader,
    load: function (e, t, n, r) {
      const i = this,
        o = new FileLoader(this.manager);
      o.setPath(this.path),
        o.setRequestHeader(this.requestHeader),
        o.setWithCredentials(i.withCredentials),
        o.load(
          e,
          function (e) {
            let n;
            try {
              n = JSON.parse(e);
            } catch (t) {
              console.warn(
                "THREE.FontLoader: typeface.js support is being deprecated. Use typeface.json instead."
              ),
                (n = JSON.parse(e.substring(65, e.length - 2)));
            }
            const r = i.parse(n);
            t && t(r);
          },
          n,
          r
        );
    },
    parse: function (e) {
      return new Font(e);
    }
  }));
const AudioContext = {
  getContext: function () {
    return (
      void 0 === _context &&
        (_context = new (window.AudioContext || window.webkitAudioContext)()),
      _context
    );
  },
  setContext: function (e) {
    _context = e;
  }
};
function AudioLoader(e) {
  Loader.call(this, e);
}
function HemisphereLightProbe(e, t, n) {
  LightProbe.call(this, void 0, n);
  const r = new Color().set(e),
    i = new Color().set(t),
    o = new Vector3(r.r, r.g, r.b),
    a = new Vector3(i.r, i.g, i.b),
    s = Math.sqrt(Math.PI),
    c = s * Math.sqrt(0.75);
  this.sh.coefficients[0].copy(o).add(a).multiplyScalar(s),
    this.sh.coefficients[1].copy(o).sub(a).multiplyScalar(c);
}
function AmbientLightProbe(e, t) {
  LightProbe.call(this, void 0, t);
  const n = new Color().set(e);
  this.sh.coefficients[0]
    .set(n.r, n.g, n.b)
    .multiplyScalar(2 * Math.sqrt(Math.PI));
}
(AudioLoader.prototype = Object.assign(Object.create(Loader.prototype), {
  constructor: AudioLoader,
  load: function (e, t, n, r) {
    const i = this,
      o = new FileLoader(i.manager);
    o.setResponseType("arraybuffer"),
      o.setPath(i.path),
      o.setRequestHeader(i.requestHeader),
      o.setWithCredentials(i.withCredentials),
      o.load(
        e,
        function (n) {
          try {
            const o = n.slice(0);
            AudioContext.getContext().decodeAudioData(o, function (e) {
              t(e);
            });
          } catch (t) {
            r ? r(t) : console.error(t), i.manager.itemError(e);
          }
        },
        n,
        r
      );
  }
})),
  (HemisphereLightProbe.prototype = Object.assign(
    Object.create(LightProbe.prototype),
    {
      constructor: HemisphereLightProbe,
      isHemisphereLightProbe: !0,
      copy: function (e) {
        return LightProbe.prototype.copy.call(this, e), this;
      },
      toJSON: function (e) {
        return LightProbe.prototype.toJSON.call(this, e);
      }
    }
  )),
  (AmbientLightProbe.prototype = Object.assign(
    Object.create(LightProbe.prototype),
    {
      constructor: AmbientLightProbe,
      isAmbientLightProbe: !0,
      copy: function (e) {
        return LightProbe.prototype.copy.call(this, e), this;
      },
      toJSON: function (e) {
        return LightProbe.prototype.toJSON.call(this, e);
      }
    }
  ));
const _eyeRight = new Matrix4(),
  _eyeLeft = new Matrix4();
function StereoCamera() {
  (this.type = "StereoCamera"),
    (this.aspect = 1),
    (this.eyeSep = 0.064),
    (this.cameraL = new PerspectiveCamera()),
    this.cameraL.layers.enable(1),
    (this.cameraL.matrixAutoUpdate = !1),
    (this.cameraR = new PerspectiveCamera()),
    this.cameraR.layers.enable(2),
    (this.cameraR.matrixAutoUpdate = !1),
    (this._cache = {
      focus: null,
      fov: null,
      aspect: null,
      near: null,
      far: null,
      zoom: null,
      eyeSep: null
    });
}
Object.assign(StereoCamera.prototype, {
  update: function (e) {
    const t = this._cache;
    if (
      t.focus !== e.focus ||
      t.fov !== e.fov ||
      t.aspect !== e.aspect * this.aspect ||
      t.near !== e.near ||
      t.far !== e.far ||
      t.zoom !== e.zoom ||
      t.eyeSep !== this.eyeSep
    ) {
      (t.focus = e.focus),
        (t.fov = e.fov),
        (t.aspect = e.aspect * this.aspect),
        (t.near = e.near),
        (t.far = e.far),
        (t.zoom = e.zoom),
        (t.eyeSep = this.eyeSep);
      const n = e.projectionMatrix.clone(),
        r = t.eyeSep / 2,
        i = (r * t.near) / t.focus,
        o = (t.near * Math.tan(MathUtils.DEG2RAD * t.fov * 0.5)) / t.zoom;
      let a, s;
      (_eyeLeft.elements[12] = -r),
        (_eyeRight.elements[12] = r),
        (a = -o * t.aspect + i),
        (s = o * t.aspect + i),
        (n.elements[0] = (2 * t.near) / (s - a)),
        (n.elements[8] = (s + a) / (s - a)),
        this.cameraL.projectionMatrix.copy(n),
        (a = -o * t.aspect - i),
        (s = o * t.aspect - i),
        (n.elements[0] = (2 * t.near) / (s - a)),
        (n.elements[8] = (s + a) / (s - a)),
        this.cameraR.projectionMatrix.copy(n);
    }
    this.cameraL.matrixWorld.copy(e.matrixWorld).multiply(_eyeLeft),
      this.cameraR.matrixWorld.copy(e.matrixWorld).multiply(_eyeRight);
  }
});
class Clock {
  constructor(e) {
    (this.autoStart = void 0 === e || e),
      (this.startTime = 0),
      (this.oldTime = 0),
      (this.elapsedTime = 0),
      (this.running = !1);
  }
  start() {
    (this.startTime = (
      "undefined" == typeof performance ? Date : performance
    ).now()),
      (this.oldTime = this.startTime),
      (this.elapsedTime = 0),
      (this.running = !0);
  }
  stop() {
    this.getElapsedTime(), (this.running = !1), (this.autoStart = !1);
  }
  getElapsedTime() {
    return this.getDelta(), this.elapsedTime;
  }
  getDelta() {
    let e = 0;
    if (this.autoStart && !this.running) return this.start(), 0;
    if (this.running) {
      const t = ("undefined" == typeof performance ? Date : performance).now();
      (e = (t - this.oldTime) / 1e3),
        (this.oldTime = t),
        (this.elapsedTime += e);
    }
    return e;
  }
}
const _position$2 = new Vector3(),
  _quaternion$3 = new Quaternion(),
  _scale$1 = new Vector3(),
  _orientation = new Vector3();
class AudioListener extends Object3D {
  constructor() {
    super(),
      (this.type = "AudioListener"),
      (this.context = AudioContext.getContext()),
      (this.gain = this.context.createGain()),
      this.gain.connect(this.context.destination),
      (this.filter = null),
      (this.timeDelta = 0),
      (this._clock = new Clock());
  }
  getInput() {
    return this.gain;
  }
  removeFilter() {
    return (
      null !== this.filter &&
        (this.gain.disconnect(this.filter),
        this.filter.disconnect(this.context.destination),
        this.gain.connect(this.context.destination),
        (this.filter = null)),
      this
    );
  }
  getFilter() {
    return this.filter;
  }
  setFilter(e) {
    return (
      null !== this.filter
        ? (this.gain.disconnect(this.filter),
          this.filter.disconnect(this.context.destination))
        : this.gain.disconnect(this.context.destination),
      (this.filter = e),
      this.gain.connect(this.filter),
      this.filter.connect(this.context.destination),
      this
    );
  }
  getMasterVolume() {
    return this.gain.gain.value;
  }
  setMasterVolume(e) {
    return (
      this.gain.gain.setTargetAtTime(e, this.context.currentTime, 0.01), this
    );
  }
  updateMatrixWorld(e) {
    super.updateMatrixWorld(e);
    const t = this.context.listener,
      n = this.up;
    if (
      ((this.timeDelta = this._clock.getDelta()),
      this.matrixWorld.decompose(_position$2, _quaternion$3, _scale$1),
      _orientation.set(0, 0, -1).applyQuaternion(_quaternion$3),
      t.positionX)
    ) {
      const e = this.context.currentTime + this.timeDelta;
      t.positionX.linearRampToValueAtTime(_position$2.x, e),
        t.positionY.linearRampToValueAtTime(_position$2.y, e),
        t.positionZ.linearRampToValueAtTime(_position$2.z, e),
        t.forwardX.linearRampToValueAtTime(_orientation.x, e),
        t.forwardY.linearRampToValueAtTime(_orientation.y, e),
        t.forwardZ.linearRampToValueAtTime(_orientation.z, e),
        t.upX.linearRampToValueAtTime(n.x, e),
        t.upY.linearRampToValueAtTime(n.y, e),
        t.upZ.linearRampToValueAtTime(n.z, e);
    } else
      t.setPosition(_position$2.x, _position$2.y, _position$2.z),
        t.setOrientation(
          _orientation.x,
          _orientation.y,
          _orientation.z,
          n.x,
          n.y,
          n.z
        );
  }
}
class Audio extends Object3D {
  constructor(e) {
    super(),
      (this.type = "Audio"),
      (this.listener = e),
      (this.context = e.context),
      (this.gain = this.context.createGain()),
      this.gain.connect(e.getInput()),
      (this.autoplay = !1),
      (this.buffer = null),
      (this.detune = 0),
      (this.loop = !1),
      (this.loopStart = 0),
      (this.loopEnd = 0),
      (this.offset = 0),
      (this.duration = void 0),
      (this.playbackRate = 1),
      (this.isPlaying = !1),
      (this.hasPlaybackControl = !0),
      (this.source = null),
      (this.sourceType = "empty"),
      (this._startedAt = 0),
      (this._progress = 0),
      (this._connected = !1),
      (this.filters = []);
  }
  getOutput() {
    return this.gain;
  }
  setNodeSource(e) {
    return (
      (this.hasPlaybackControl = !1),
      (this.sourceType = "audioNode"),
      (this.source = e),
      this.connect(),
      this
    );
  }
  setMediaElementSource(e) {
    return (
      (this.hasPlaybackControl = !1),
      (this.sourceType = "mediaNode"),
      (this.source = this.context.createMediaElementSource(e)),
      this.connect(),
      this
    );
  }
  setMediaStreamSource(e) {
    return (
      (this.hasPlaybackControl = !1),
      (this.sourceType = "mediaStreamNode"),
      (this.source = this.context.createMediaStreamSource(e)),
      this.connect(),
      this
    );
  }
  setBuffer(e) {
    return (
      (this.buffer = e),
      (this.sourceType = "buffer"),
      this.autoplay && this.play(),
      this
    );
  }
  play(e) {
    if ((void 0 === e && (e = 0), !0 === this.isPlaying))
      return void console.warn("THREE.Audio: Audio is already playing.");
    if (!1 === this.hasPlaybackControl)
      return void console.warn(
        "THREE.Audio: this Audio has no playback control."
      );
    this._startedAt = this.context.currentTime + e;
    const t = this.context.createBufferSource();
    return (
      (t.buffer = this.buffer),
      (t.loop = this.loop),
      (t.loopStart = this.loopStart),
      (t.loopEnd = this.loopEnd),
      (t.onended = this.onEnded.bind(this)),
      t.start(this._startedAt, this._progress + this.offset, this.duration),
      (this.isPlaying = !0),
      (this.source = t),
      this.setDetune(this.detune),
      this.setPlaybackRate(this.playbackRate),
      this.connect()
    );
  }
  pause() {
    if (!1 !== this.hasPlaybackControl)
      return (
        !0 === this.isPlaying &&
          ((this._progress +=
            Math.max(this.context.currentTime - this._startedAt, 0) *
            this.playbackRate),
          !0 === this.loop &&
            (this._progress =
              this._progress % (this.duration || this.buffer.duration)),
          this.source.stop(),
          (this.source.onended = null),
          (this.isPlaying = !1)),
        this
      );
    console.warn("THREE.Audio: this Audio has no playback control.");
  }
  stop() {
    if (!1 !== this.hasPlaybackControl)
      return (
        (this._progress = 0),
        this.source.stop(),
        (this.source.onended = null),
        (this.isPlaying = !1),
        this
      );
    console.warn("THREE.Audio: this Audio has no playback control.");
  }
  connect() {
    if (this.filters.length > 0) {
      this.source.connect(this.filters[0]);
      for (let e = 1, t = this.filters.length; e < t; e++)
        this.filters[e - 1].connect(this.filters[e]);
      this.filters[this.filters.length - 1].connect(this.getOutput());
    } else this.source.connect(this.getOutput());
    return (this._connected = !0), this;
  }
  disconnect() {
    if (this.filters.length > 0) {
      this.source.disconnect(this.filters[0]);
      for (let e = 1, t = this.filters.length; e < t; e++)
        this.filters[e - 1].disconnect(this.filters[e]);
      this.filters[this.filters.length - 1].disconnect(this.getOutput());
    } else this.source.disconnect(this.getOutput());
    return (this._connected = !1), this;
  }
  getFilters() {
    return this.filters;
  }
  setFilters(e) {
    return (
      e || (e = []),
      !0 === this._connected
        ? (this.disconnect(), (this.filters = e), this.connect())
        : (this.filters = e),
      this
    );
  }
  setDetune(e) {
    if (((this.detune = e), void 0 !== this.source.detune))
      return (
        !0 === this.isPlaying &&
          this.source.detune.setTargetAtTime(
            this.detune,
            this.context.currentTime,
            0.01
          ),
        this
      );
  }
  getDetune() {
    return this.detune;
  }
  getFilter() {
    return this.getFilters()[0];
  }
  setFilter(e) {
    return this.setFilters(e ? [e] : []);
  }
  setPlaybackRate(e) {
    if (!1 !== this.hasPlaybackControl)
      return (
        (this.playbackRate = e),
        !0 === this.isPlaying &&
          this.source.playbackRate.setTargetAtTime(
            this.playbackRate,
            this.context.currentTime,
            0.01
          ),
        this
      );
    console.warn("THREE.Audio: this Audio has no playback control.");
  }
  getPlaybackRate() {
    return this.playbackRate;
  }
  onEnded() {
    this.isPlaying = !1;
  }
  getLoop() {
    return !1 === this.hasPlaybackControl
      ? (console.warn("THREE.Audio: this Audio has no playback control."), !1)
      : this.loop;
  }
  setLoop(e) {
    if (!1 !== this.hasPlaybackControl)
      return (
        (this.loop = e),
        !0 === this.isPlaying && (this.source.loop = this.loop),
        this
      );
    console.warn("THREE.Audio: this Audio has no playback control.");
  }
  setLoopStart(e) {
    return (this.loopStart = e), this;
  }
  setLoopEnd(e) {
    return (this.loopEnd = e), this;
  }
  getVolume() {
    return this.gain.gain.value;
  }
  setVolume(e) {
    return (
      this.gain.gain.setTargetAtTime(e, this.context.currentTime, 0.01), this
    );
  }
}
const _position$3 = new Vector3(),
  _quaternion$4 = new Quaternion(),
  _scale$2 = new Vector3(),
  _orientation$1 = new Vector3();
class PositionalAudio extends Audio {
  constructor(e) {
    super(e),
      (this.panner = this.context.createPanner()),
      (this.panner.panningModel = "HRTF"),
      this.panner.connect(this.gain);
  }
  getOutput() {
    return this.panner;
  }
  getRefDistance() {
    return this.panner.refDistance;
  }
  setRefDistance(e) {
    return (this.panner.refDistance = e), this;
  }
  getRolloffFactor() {
    return this.panner.rolloffFactor;
  }
  setRolloffFactor(e) {
    return (this.panner.rolloffFactor = e), this;
  }
  getDistanceModel() {
    return this.panner.distanceModel;
  }
  setDistanceModel(e) {
    return (this.panner.distanceModel = e), this;
  }
  getMaxDistance() {
    return this.panner.maxDistance;
  }
  setMaxDistance(e) {
    return (this.panner.maxDistance = e), this;
  }
  setDirectionalCone(e, t, n) {
    return (
      (this.panner.coneInnerAngle = e),
      (this.panner.coneOuterAngle = t),
      (this.panner.coneOuterGain = n),
      this
    );
  }
  updateMatrixWorld(e) {
    if (
      (super.updateMatrixWorld(e),
      !0 === this.hasPlaybackControl && !1 === this.isPlaying)
    )
      return;
    this.matrixWorld.decompose(_position$3, _quaternion$4, _scale$2),
      _orientation$1.set(0, 0, 1).applyQuaternion(_quaternion$4);
    const t = this.panner;
    if (t.positionX) {
      const e = this.context.currentTime + this.listener.timeDelta;
      t.positionX.linearRampToValueAtTime(_position$3.x, e),
        t.positionY.linearRampToValueAtTime(_position$3.y, e),
        t.positionZ.linearRampToValueAtTime(_position$3.z, e),
        t.orientationX.linearRampToValueAtTime(_orientation$1.x, e),
        t.orientationY.linearRampToValueAtTime(_orientation$1.y, e),
        t.orientationZ.linearRampToValueAtTime(_orientation$1.z, e);
    } else
      t.setPosition(_position$3.x, _position$3.y, _position$3.z),
        t.setOrientation(_orientation$1.x, _orientation$1.y, _orientation$1.z);
  }
}
class AudioAnalyser {
  constructor(e, t) {
    (this.analyser = e.context.createAnalyser()),
      (this.analyser.fftSize = void 0 !== t ? t : 2048),
      (this.data = new Uint8Array(this.analyser.frequencyBinCount)),
      e.getOutput().connect(this.analyser);
  }
  getFrequencyData() {
    return this.analyser.getByteFrequencyData(this.data), this.data;
  }
  getAverageFrequency() {
    let e = 0;
    const t = this.getFrequencyData();
    for (let n = 0; n < t.length; n++) e += t[n];
    return e / t.length;
  }
}
function PropertyMixer(e, t, n) {
  let r, i, o;
  switch (((this.binding = e), (this.valueSize = n), t)) {
    case "quaternion":
      (r = this._slerp),
        (i = this._slerpAdditive),
        (o = this._setAdditiveIdentityQuaternion),
        (this.buffer = new Float64Array(6 * n)),
        (this._workIndex = 5);
      break;
    case "string":
    case "bool":
      (r = this._select),
        (i = this._select),
        (o = this._setAdditiveIdentityOther),
        (this.buffer = new Array(5 * n));
      break;
    default:
      (r = this._lerp),
        (i = this._lerpAdditive),
        (o = this._setAdditiveIdentityNumeric),
        (this.buffer = new Float64Array(5 * n));
  }
  (this._mixBufferRegion = r),
    (this._mixBufferRegionAdditive = i),
    (this._setIdentity = o),
    (this._origIndex = 3),
    (this._addIndex = 4),
    (this.cumulativeWeight = 0),
    (this.cumulativeWeightAdditive = 0),
    (this.useCount = 0),
    (this.referenceCount = 0);
}
Object.assign(PropertyMixer.prototype, {
  accumulate: function (e, t) {
    const n = this.buffer,
      r = this.valueSize,
      i = e * r + r;
    let o = this.cumulativeWeight;
    if (0 === o) {
      for (let e = 0; e !== r; ++e) n[i + e] = n[e];
      o = t;
    } else {
      const e = t / (o += t);
      this._mixBufferRegion(n, i, 0, e, r);
    }
    this.cumulativeWeight = o;
  },
  accumulateAdditive: function (e) {
    const t = this.buffer,
      n = this.valueSize,
      r = n * this._addIndex;
    0 === this.cumulativeWeightAdditive && this._setIdentity(),
      this._mixBufferRegionAdditive(t, r, 0, e, n),
      (this.cumulativeWeightAdditive += e);
  },
  apply: function (e) {
    const t = this.valueSize,
      n = this.buffer,
      r = e * t + t,
      i = this.cumulativeWeight,
      o = this.cumulativeWeightAdditive,
      a = this.binding;
    if (
      ((this.cumulativeWeight = 0), (this.cumulativeWeightAdditive = 0), i < 1)
    ) {
      const e = t * this._origIndex;
      this._mixBufferRegion(n, r, e, 1 - i, t);
    }
    o > 0 && this._mixBufferRegionAdditive(n, r, this._addIndex * t, 1, t);
    for (let e = t, i = t + t; e !== i; ++e)
      if (n[e] !== n[e + t]) {
        a.setValue(n, r);
        break;
      }
  },
  saveOriginalState: function () {
    const e = this.binding,
      t = this.buffer,
      n = this.valueSize,
      r = n * this._origIndex;
    e.getValue(t, r);
    for (let e = n, i = r; e !== i; ++e) t[e] = t[r + (e % n)];
    this._setIdentity(),
      (this.cumulativeWeight = 0),
      (this.cumulativeWeightAdditive = 0);
  },
  restoreOriginalState: function () {
    const e = 3 * this.valueSize;
    this.binding.setValue(this.buffer, e);
  },
  _setAdditiveIdentityNumeric: function () {
    const e = this._addIndex * this.valueSize,
      t = e + this.valueSize;
    for (let n = e; n < t; n++) this.buffer[n] = 0;
  },
  _setAdditiveIdentityQuaternion: function () {
    this._setAdditiveIdentityNumeric(),
      (this.buffer[this._addIndex * this.valueSize + 3] = 1);
  },
  _setAdditiveIdentityOther: function () {
    const e = this._origIndex * this.valueSize,
      t = this._addIndex * this.valueSize;
    for (let n = 0; n < this.valueSize; n++)
      this.buffer[t + n] = this.buffer[e + n];
  },
  _select: function (e, t, n, r, i) {
    if (r >= 0.5) for (let r = 0; r !== i; ++r) e[t + r] = e[n + r];
  },
  _slerp: function (e, t, n, r) {
    Quaternion.slerpFlat(e, t, e, t, e, n, r);
  },
  _slerpAdditive: function (e, t, n, r, i) {
    const o = this._workIndex * i;
    Quaternion.multiplyQuaternionsFlat(e, o, e, t, e, n),
      Quaternion.slerpFlat(e, t, e, t, e, o, r);
  },
  _lerp: function (e, t, n, r, i) {
    const o = 1 - r;
    for (let a = 0; a !== i; ++a) {
      const i = t + a;
      e[i] = e[i] * o + e[n + a] * r;
    }
  },
  _lerpAdditive: function (e, t, n, r, i) {
    for (let o = 0; o !== i; ++o) {
      const i = t + o;
      e[i] = e[i] + e[n + o] * r;
    }
  }
});
const _RESERVED_CHARS_RE = "\\[\\]\\.:\\/",
  _reservedRe = new RegExp("[\\[\\]\\.:\\/]", "g"),
  _wordChar = "[^\\[\\]\\.:\\/]",
  _wordCharOrDot = "[^" + "\\[\\]\\.:\\/".replace("\\.", "") + "]",
  _directoryRe = /((?:WC+[\/:])*)/.source.replace("WC", _wordChar),
  _nodeRe = /(WCOD+)?/.source.replace("WCOD", _wordCharOrDot),
  _objectRe = /(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC", _wordChar),
  _propertyRe = /\.(WC+)(?:\[(.+)\])?/.source.replace("WC", _wordChar),
  _trackRe = new RegExp(
    "^" + _directoryRe + _nodeRe + _objectRe + _propertyRe + "$"
  ),
  _supportedObjectNames = ["material", "materials", "bones"];
function Composite(e, t, n) {
  const r = n || PropertyBinding.parseTrackName(t);
  (this._targetGroup = e), (this._bindings = e.subscribe_(t, r));
}
function PropertyBinding(e, t, n) {
  (this.path = t),
    (this.parsedPath = n || PropertyBinding.parseTrackName(t)),
    (this.node = PropertyBinding.findNode(e, this.parsedPath.nodeName) || e),
    (this.rootNode = e);
}
function AnimationObjectGroup() {
  (this.uuid = MathUtils.generateUUID()),
    (this._objects = Array.prototype.slice.call(arguments)),
    (this.nCachedObjects_ = 0);
  const e = {};
  this._indicesByUUID = e;
  for (let t = 0, n = arguments.length; t !== n; ++t) e[arguments[t].uuid] = t;
  (this._paths = []),
    (this._parsedPaths = []),
    (this._bindings = []),
    (this._bindingsIndicesByPath = {});
  const t = this;
  this.stats = {
    objects: {
      get total() {
        return t._objects.length;
      },
      get inUse() {
        return this.total - t.nCachedObjects_;
      }
    },
    get bindingsPerObject() {
      return t._bindings.length;
    }
  };
}
Object.assign(Composite.prototype, {
  getValue: function (e, t) {
    this.bind();
    const n = this._targetGroup.nCachedObjects_,
      r = this._bindings[n];
    void 0 !== r && r.getValue(e, t);
  },
  setValue: function (e, t) {
    const n = this._bindings;
    for (let r = this._targetGroup.nCachedObjects_, i = n.length; r !== i; ++r)
      n[r].setValue(e, t);
  },
  bind: function () {
    const e = this._bindings;
    for (let t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t)
      e[t].bind();
  },
  unbind: function () {
    const e = this._bindings;
    for (let t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t)
      e[t].unbind();
  }
}),
  Object.assign(PropertyBinding, {
    Composite: Composite,
    create: function (e, t, n) {
      return e && e.isAnimationObjectGroup
        ? new PropertyBinding.Composite(e, t, n)
        : new PropertyBinding(e, t, n);
    },
    sanitizeNodeName: function (e) {
      return e.replace(/\s/g, "_").replace(_reservedRe, "");
    },
    parseTrackName: function (e) {
      const t = _trackRe.exec(e);
      if (!t) throw new Error("PropertyBinding: Cannot parse trackName: " + e);
      const n = {
          nodeName: t[2],
          objectName: t[3],
          objectIndex: t[4],
          propertyName: t[5],
          propertyIndex: t[6]
        },
        r = n.nodeName && n.nodeName.lastIndexOf(".");
      if (void 0 !== r && -1 !== r) {
        const e = n.nodeName.substring(r + 1);
        -1 !== _supportedObjectNames.indexOf(e) &&
          ((n.nodeName = n.nodeName.substring(0, r)), (n.objectName = e));
      }
      if (null === n.propertyName || 0 === n.propertyName.length)
        throw new Error(
          "PropertyBinding: can not parse propertyName from trackName: " + e
        );
      return n;
    },
    findNode: function (e, t) {
      if (
        !t ||
        "" === t ||
        "." === t ||
        -1 === t ||
        t === e.name ||
        t === e.uuid
      )
        return e;
      if (e.skeleton) {
        const n = e.skeleton.getBoneByName(t);
        if (void 0 !== n) return n;
      }
      if (e.children) {
        const n = function (e) {
            for (let r = 0; r < e.length; r++) {
              const i = e[r];
              if (i.name === t || i.uuid === t) return i;
              const o = n(i.children);
              if (o) return o;
            }
            return null;
          },
          r = n(e.children);
        if (r) return r;
      }
      return null;
    }
  }),
  Object.assign(PropertyBinding.prototype, {
    _getValue_unavailable: function () {},
    _setValue_unavailable: function () {},
    BindingType: {
      Direct: 0,
      EntireArray: 1,
      ArrayElement: 2,
      HasFromToArray: 3
    },
    Versioning: { None: 0, NeedsUpdate: 1, MatrixWorldNeedsUpdate: 2 },
    GetterByBindingType: [
      function (e, t) {
        e[t] = this.node[this.propertyName];
      },
      function (e, t) {
        const n = this.resolvedProperty;
        for (let r = 0, i = n.length; r !== i; ++r) e[t++] = n[r];
      },
      function (e, t) {
        e[t] = this.resolvedProperty[this.propertyIndex];
      },
      function (e, t) {
        this.resolvedProperty.toArray(e, t);
      }
    ],
    SetterByBindingTypeAndVersioning: [
      [
        function (e, t) {
          this.targetObject[this.propertyName] = e[t];
        },
        function (e, t) {
          (this.targetObject[this.propertyName] = e[t]),
            (this.targetObject.needsUpdate = !0);
        },
        function (e, t) {
          (this.targetObject[this.propertyName] = e[t]),
            (this.targetObject.matrixWorldNeedsUpdate = !0);
        }
      ],
      [
        function (e, t) {
          const n = this.resolvedProperty;
          for (let r = 0, i = n.length; r !== i; ++r) n[r] = e[t++];
        },
        function (e, t) {
          const n = this.resolvedProperty;
          for (let r = 0, i = n.length; r !== i; ++r) n[r] = e[t++];
          this.targetObject.needsUpdate = !0;
        },
        function (e, t) {
          const n = this.resolvedProperty;
          for (let r = 0, i = n.length; r !== i; ++r) n[r] = e[t++];
          this.targetObject.matrixWorldNeedsUpdate = !0;
        }
      ],
      [
        function (e, t) {
          this.resolvedProperty[this.propertyIndex] = e[t];
        },
        function (e, t) {
          (this.resolvedProperty[this.propertyIndex] = e[t]),
            (this.targetObject.needsUpdate = !0);
        },
        function (e, t) {
          (this.resolvedProperty[this.propertyIndex] = e[t]),
            (this.targetObject.matrixWorldNeedsUpdate = !0);
        }
      ],
      [
        function (e, t) {
          this.resolvedProperty.fromArray(e, t);
        },
        function (e, t) {
          this.resolvedProperty.fromArray(e, t),
            (this.targetObject.needsUpdate = !0);
        },
        function (e, t) {
          this.resolvedProperty.fromArray(e, t),
            (this.targetObject.matrixWorldNeedsUpdate = !0);
        }
      ]
    ],
    getValue: function (e, t) {
      this.bind(), this.getValue(e, t);
    },
    setValue: function (e, t) {
      this.bind(), this.setValue(e, t);
    },
    bind: function () {
      let e = this.node;
      const t = this.parsedPath,
        n = t.objectName,
        r = t.propertyName;
      let i = t.propertyIndex;
      if (
        (e ||
          ((e =
            PropertyBinding.findNode(this.rootNode, t.nodeName) ||
            this.rootNode),
          (this.node = e)),
        (this.getValue = this._getValue_unavailable),
        (this.setValue = this._setValue_unavailable),
        !e)
      )
        return void console.error(
          "THREE.PropertyBinding: Trying to update node for track: " +
            this.path +
            " but it wasn't found."
        );
      if (n) {
        let r = t.objectIndex;
        switch (n) {
          case "materials":
            if (!e.material)
              return void console.error(
                "THREE.PropertyBinding: Can not bind to material as node does not have a material.",
                this
              );
            if (!e.material.materials)
              return void console.error(
                "THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",
                this
              );
            e = e.material.materials;
            break;
          case "bones":
            if (!e.skeleton)
              return void console.error(
                "THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",
                this
              );
            e = e.skeleton.bones;
            for (let t = 0; t < e.length; t++)
              if (e[t].name === r) {
                r = t;
                break;
              }
            break;
          default:
            if (void 0 === e[n])
              return void console.error(
                "THREE.PropertyBinding: Can not bind to objectName of node undefined.",
                this
              );
            e = e[n];
        }
        if (void 0 !== r) {
          if (void 0 === e[r])
            return void console.error(
              "THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",
              this,
              e
            );
          e = e[r];
        }
      }
      const o = e[r];
      if (void 0 === o) {
        const n = t.nodeName;
        return void console.error(
          "THREE.PropertyBinding: Trying to update property for track: " +
            n +
            "." +
            r +
            " but it wasn't found.",
          e
        );
      }
      let a = this.Versioning.None;
      (this.targetObject = e),
        void 0 !== e.needsUpdate
          ? (a = this.Versioning.NeedsUpdate)
          : void 0 !== e.matrixWorldNeedsUpdate &&
            (a = this.Versioning.MatrixWorldNeedsUpdate);
      let s = this.BindingType.Direct;
      if (void 0 !== i) {
        if ("morphTargetInfluences" === r) {
          if (!e.geometry)
            return void console.error(
              "THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",
              this
            );
          if (!e.geometry.isBufferGeometry)
            return void console.error(
              "THREE.PropertyBinding: Can not bind to morphTargetInfluences on THREE.Geometry. Use THREE.BufferGeometry instead.",
              this
            );
          if (!e.geometry.morphAttributes)
            return void console.error(
              "THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",
              this
            );
          void 0 !== e.morphTargetDictionary[i] &&
            (i = e.morphTargetDictionary[i]);
        }
        (s = this.BindingType.ArrayElement),
          (this.resolvedProperty = o),
          (this.propertyIndex = i);
      } else
        void 0 !== o.fromArray && void 0 !== o.toArray
          ? ((s = this.BindingType.HasFromToArray), (this.resolvedProperty = o))
          : Array.isArray(o)
          ? ((s = this.BindingType.EntireArray), (this.resolvedProperty = o))
          : (this.propertyName = r);
      (this.getValue = this.GetterByBindingType[s]),
        (this.setValue = this.SetterByBindingTypeAndVersioning[s][a]);
    },
    unbind: function () {
      (this.node = null),
        (this.getValue = this._getValue_unbound),
        (this.setValue = this._setValue_unbound);
    }
  }),
  Object.assign(PropertyBinding.prototype, {
    _getValue_unbound: PropertyBinding.prototype.getValue,
    _setValue_unbound: PropertyBinding.prototype.setValue
  }),
  Object.assign(AnimationObjectGroup.prototype, {
    isAnimationObjectGroup: !0,
    add: function () {
      const e = this._objects,
        t = this._indicesByUUID,
        n = this._paths,
        r = this._parsedPaths,
        i = this._bindings,
        o = i.length;
      let a = void 0,
        s = e.length,
        c = this.nCachedObjects_;
      for (let l = 0, h = arguments.length; l !== h; ++l) {
        const h = arguments[l],
          u = h.uuid;
        let d = t[u];
        if (void 0 === d) {
          (d = s++), (t[u] = d), e.push(h);
          for (let e = 0, t = o; e !== t; ++e)
            i[e].push(new PropertyBinding(h, n[e], r[e]));
        } else if (d < c) {
          a = e[d];
          const s = --c,
            l = e[s];
          (t[l.uuid] = d), (e[d] = l), (t[u] = s), (e[s] = h);
          for (let e = 0, t = o; e !== t; ++e) {
            const t = i[e],
              o = t[s];
            let a = t[d];
            (t[d] = o),
              void 0 === a && (a = new PropertyBinding(h, n[e], r[e])),
              (t[s] = a);
          }
        } else
          e[d] !== a &&
            console.error(
              "THREE.AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes."
            );
      }
      this.nCachedObjects_ = c;
    },
    remove: function () {
      const e = this._objects,
        t = this._indicesByUUID,
        n = this._bindings,
        r = n.length;
      let i = this.nCachedObjects_;
      for (let o = 0, a = arguments.length; o !== a; ++o) {
        const a = arguments[o],
          s = a.uuid,
          c = t[s];
        if (void 0 !== c && c >= i) {
          const o = i++,
            l = e[o];
          (t[l.uuid] = c), (e[c] = l), (t[s] = o), (e[o] = a);
          for (let e = 0, t = r; e !== t; ++e) {
            const t = n[e],
              r = t[o],
              i = t[c];
            (t[c] = r), (t[o] = i);
          }
        }
      }
      this.nCachedObjects_ = i;
    },
    uncache: function () {
      const e = this._objects,
        t = this._indicesByUUID,
        n = this._bindings,
        r = n.length;
      let i = this.nCachedObjects_,
        o = e.length;
      for (let a = 0, s = arguments.length; a !== s; ++a) {
        const s = arguments[a].uuid,
          c = t[s];
        if (void 0 !== c)
          if ((delete t[s], c < i)) {
            const a = --i,
              s = e[a],
              l = --o,
              h = e[l];
            (t[s.uuid] = c), (e[c] = s), (t[h.uuid] = a), (e[a] = h), e.pop();
            for (let e = 0, t = r; e !== t; ++e) {
              const t = n[e],
                r = t[a],
                i = t[l];
              (t[c] = r), (t[a] = i), t.pop();
            }
          } else {
            const i = --o,
              a = e[i];
            (t[a.uuid] = c), (e[c] = a), e.pop();
            for (let e = 0, t = r; e !== t; ++e) {
              const t = n[e];
              (t[c] = t[i]), t.pop();
            }
          }
      }
      this.nCachedObjects_ = i;
    },
    subscribe_: function (e, t) {
      const n = this._bindingsIndicesByPath;
      let r = n[e];
      const i = this._bindings;
      if (void 0 !== r) return i[r];
      const o = this._paths,
        a = this._parsedPaths,
        s = this._objects,
        c = s.length,
        l = this.nCachedObjects_,
        h = new Array(c);
      (r = i.length), (n[e] = r), o.push(e), a.push(t), i.push(h);
      for (let n = l, r = s.length; n !== r; ++n) {
        const r = s[n];
        h[n] = new PropertyBinding(r, e, t);
      }
      return h;
    },
    unsubscribe_: function (e) {
      const t = this._bindingsIndicesByPath,
        n = t[e];
      if (void 0 !== n) {
        const r = this._paths,
          i = this._parsedPaths,
          o = this._bindings,
          a = o.length - 1,
          s = o[a];
        (t[e[a]] = n),
          (o[n] = s),
          o.pop(),
          (i[n] = i[a]),
          i.pop(),
          (r[n] = r[a]),
          r.pop();
      }
    }
  });
class AnimationAction {
  constructor(e, t, n, r) {
    (this._mixer = e),
      (this._clip = t),
      (this._localRoot = n || null),
      (this.blendMode = r || t.blendMode);
    const i = t.tracks,
      o = i.length,
      a = new Array(o),
      s = { endingStart: ZeroCurvatureEnding, endingEnd: ZeroCurvatureEnding };
    for (let e = 0; e !== o; ++e) {
      const t = i[e].createInterpolant(null);
      (a[e] = t), (t.settings = s);
    }
    (this._interpolantSettings = s),
      (this._interpolants = a),
      (this._propertyBindings = new Array(o)),
      (this._cacheIndex = null),
      (this._byClipCacheIndex = null),
      (this._timeScaleInterpolant = null),
      (this._weightInterpolant = null),
      (this.loop = LoopRepeat),
      (this._loopCount = -1),
      (this._startTime = null),
      (this.time = 0),
      (this.timeScale = 1),
      (this._effectiveTimeScale = 1),
      (this.weight = 1),
      (this._effectiveWeight = 1),
      (this.repetitions = 1 / 0),
      (this.paused = !1),
      (this.enabled = !0),
      (this.clampWhenFinished = !1),
      (this.zeroSlopeAtStart = !0),
      (this.zeroSlopeAtEnd = !0);
  }
  play() {
    return this._mixer._activateAction(this), this;
  }
  stop() {
    return this._mixer._deactivateAction(this), this.reset();
  }
  reset() {
    return (
      (this.paused = !1),
      (this.enabled = !0),
      (this.time = 0),
      (this._loopCount = -1),
      (this._startTime = null),
      this.stopFading().stopWarping()
    );
  }
  isRunning() {
    return (
      this.enabled &&
      !this.paused &&
      0 !== this.timeScale &&
      null === this._startTime &&
      this._mixer._isActiveAction(this)
    );
  }
  isScheduled() {
    return this._mixer._isActiveAction(this);
  }
  startAt(e) {
    return (this._startTime = e), this;
  }
  setLoop(e, t) {
    return (this.loop = e), (this.repetitions = t), this;
  }
  setEffectiveWeight(e) {
    return (
      (this.weight = e),
      (this._effectiveWeight = this.enabled ? e : 0),
      this.stopFading()
    );
  }
  getEffectiveWeight() {
    return this._effectiveWeight;
  }
  fadeIn(e) {
    return this._scheduleFading(e, 0, 1);
  }
  fadeOut(e) {
    return this._scheduleFading(e, 1, 0);
  }
  crossFadeFrom(e, t, n) {
    if ((e.fadeOut(t), this.fadeIn(t), n)) {
      const n = this._clip.duration,
        r = e._clip.duration,
        i = r / n,
        o = n / r;
      e.warp(1, i, t), this.warp(o, 1, t);
    }
    return this;
  }
  crossFadeTo(e, t, n) {
    return e.crossFadeFrom(this, t, n);
  }
  stopFading() {
    const e = this._weightInterpolant;
    return (
      null !== e &&
        ((this._weightInterpolant = null),
        this._mixer._takeBackControlInterpolant(e)),
      this
    );
  }
  setEffectiveTimeScale(e) {
    return (
      (this.timeScale = e),
      (this._effectiveTimeScale = this.paused ? 0 : e),
      this.stopWarping()
    );
  }
  getEffectiveTimeScale() {
    return this._effectiveTimeScale;
  }
  setDuration(e) {
    return (this.timeScale = this._clip.duration / e), this.stopWarping();
  }
  syncWith(e) {
    return (
      (this.time = e.time), (this.timeScale = e.timeScale), this.stopWarping()
    );
  }
  halt(e) {
    return this.warp(this._effectiveTimeScale, 0, e);
  }
  warp(e, t, n) {
    const r = this._mixer,
      i = r.time,
      o = this.timeScale;
    let a = this._timeScaleInterpolant;
    null === a &&
      ((a = r._lendControlInterpolant()), (this._timeScaleInterpolant = a));
    const s = a.parameterPositions,
      c = a.sampleValues;
    return (s[0] = i), (s[1] = i + n), (c[0] = e / o), (c[1] = t / o), this;
  }
  stopWarping() {
    const e = this._timeScaleInterpolant;
    return (
      null !== e &&
        ((this._timeScaleInterpolant = null),
        this._mixer._takeBackControlInterpolant(e)),
      this
    );
  }
  getMixer() {
    return this._mixer;
  }
  getClip() {
    return this._clip;
  }
  getRoot() {
    return this._localRoot || this._mixer._root;
  }
  _update(e, t, n, r) {
    if (!this.enabled) return void this._updateWeight(e);
    const i = this._startTime;
    if (null !== i) {
      const r = (e - i) * n;
      if (r < 0 || 0 === n) return;
      (this._startTime = null), (t = n * r);
    }
    t *= this._updateTimeScale(e);
    const o = this._updateTime(t),
      a = this._updateWeight(e);
    if (a > 0) {
      const e = this._interpolants,
        t = this._propertyBindings;
      switch (this.blendMode) {
        case AdditiveAnimationBlendMode:
          for (let n = 0, r = e.length; n !== r; ++n)
            e[n].evaluate(o), t[n].accumulateAdditive(a);
          break;
        case NormalAnimationBlendMode:
        default:
          for (let n = 0, i = e.length; n !== i; ++n)
            e[n].evaluate(o), t[n].accumulate(r, a);
      }
    }
  }
  _updateWeight(e) {
    let t = 0;
    if (this.enabled) {
      t = this.weight;
      const n = this._weightInterpolant;
      if (null !== n) {
        const r = n.evaluate(e)[0];
        (t *= r),
          e > n.parameterPositions[1] &&
            (this.stopFading(), 0 === r && (this.enabled = !1));
      }
    }
    return (this._effectiveWeight = t), t;
  }
  _updateTimeScale(e) {
    let t = 0;
    if (!this.paused) {
      t = this.timeScale;
      const n = this._timeScaleInterpolant;
      if (null !== n) {
        (t *= n.evaluate(e)[0]),
          e > n.parameterPositions[1] &&
            (this.stopWarping(),
            0 === t ? (this.paused = !0) : (this.timeScale = t));
      }
    }
    return (this._effectiveTimeScale = t), t;
  }
  _updateTime(e) {
    const t = this._clip.duration,
      n = this.loop;
    let r = this.time + e,
      i = this._loopCount;
    const o = n === LoopPingPong;
    if (0 === e) return -1 === i ? r : o && 1 == (1 & i) ? t - r : r;
    if (n === LoopOnce) {
      -1 === i && ((this._loopCount = 0), this._setEndings(!0, !0, !1));
      e: {
        if (r >= t) r = t;
        else {
          if (!(r < 0)) {
            this.time = r;
            break e;
          }
          r = 0;
        }
        this.clampWhenFinished ? (this.paused = !0) : (this.enabled = !1),
          (this.time = r),
          this._mixer.dispatchEvent({
            type: "finished",
            action: this,
            direction: e < 0 ? -1 : 1
          });
      }
    } else {
      if (
        (-1 === i &&
          (e >= 0
            ? ((i = 0), this._setEndings(!0, 0 === this.repetitions, o))
            : this._setEndings(0 === this.repetitions, !0, o)),
        r >= t || r < 0)
      ) {
        const n = Math.floor(r / t);
        (r -= t * n), (i += Math.abs(n));
        const a = this.repetitions - i;
        if (a <= 0)
          this.clampWhenFinished ? (this.paused = !0) : (this.enabled = !1),
            (r = e > 0 ? t : 0),
            (this.time = r),
            this._mixer.dispatchEvent({
              type: "finished",
              action: this,
              direction: e > 0 ? 1 : -1
            });
        else {
          if (1 === a) {
            const t = e < 0;
            this._setEndings(t, !t, o);
          } else this._setEndings(!1, !1, o);
          (this._loopCount = i),
            (this.time = r),
            this._mixer.dispatchEvent({
              type: "loop",
              action: this,
              loopDelta: n
            });
        }
      } else this.time = r;
      if (o && 1 == (1 & i)) return t - r;
    }
    return r;
  }
  _setEndings(e, t, n) {
    const r = this._interpolantSettings;
    n
      ? ((r.endingStart = ZeroSlopeEnding), (r.endingEnd = ZeroSlopeEnding))
      : ((r.endingStart = e
          ? this.zeroSlopeAtStart
            ? ZeroSlopeEnding
            : ZeroCurvatureEnding
          : WrapAroundEnding),
        (r.endingEnd = t
          ? this.zeroSlopeAtEnd
            ? ZeroSlopeEnding
            : ZeroCurvatureEnding
          : WrapAroundEnding));
  }
  _scheduleFading(e, t, n) {
    const r = this._mixer,
      i = r.time;
    let o = this._weightInterpolant;
    null === o &&
      ((o = r._lendControlInterpolant()), (this._weightInterpolant = o));
    const a = o.parameterPositions,
      s = o.sampleValues;
    return (a[0] = i), (s[0] = t), (a[1] = i + e), (s[1] = n), this;
  }
}
function AnimationMixer(e) {
  (this._root = e),
    this._initMemoryManager(),
    (this._accuIndex = 0),
    (this.time = 0),
    (this.timeScale = 1);
}
AnimationMixer.prototype = Object.assign(
  Object.create(EventDispatcher.prototype),
  {
    constructor: AnimationMixer,
    _bindAction: function (e, t) {
      const n = e._localRoot || this._root,
        r = e._clip.tracks,
        i = r.length,
        o = e._propertyBindings,
        a = e._interpolants,
        s = n.uuid,
        c = this._bindingsByRootAndName;
      let l = c[s];
      void 0 === l && ((l = {}), (c[s] = l));
      for (let e = 0; e !== i; ++e) {
        const i = r[e],
          c = i.name;
        let h = l[c];
        if (void 0 !== h) o[e] = h;
        else {
          if (void 0 !== (h = o[e])) {
            null === h._cacheIndex &&
              (++h.referenceCount, this._addInactiveBinding(h, s, c));
            continue;
          }
          const r = t && t._propertyBindings[e].binding.parsedPath;
          ++(h = new PropertyMixer(
            PropertyBinding.create(n, c, r),
            i.ValueTypeName,
            i.getValueSize()
          )).referenceCount,
            this._addInactiveBinding(h, s, c),
            (o[e] = h);
        }
        a[e].resultBuffer = h.buffer;
      }
    },
    _activateAction: function (e) {
      if (!this._isActiveAction(e)) {
        if (null === e._cacheIndex) {
          const t = (e._localRoot || this._root).uuid,
            n = e._clip.uuid,
            r = this._actionsByClip[n];
          this._bindAction(e, r && r.knownActions[0]),
            this._addInactiveAction(e, n, t);
        }
        const t = e._propertyBindings;
        for (let e = 0, n = t.length; e !== n; ++e) {
          const n = t[e];
          0 == n.useCount++ && (this._lendBinding(n), n.saveOriginalState());
        }
        this._lendAction(e);
      }
    },
    _deactivateAction: function (e) {
      if (this._isActiveAction(e)) {
        const t = e._propertyBindings;
        for (let e = 0, n = t.length; e !== n; ++e) {
          const n = t[e];
          0 == --n.useCount &&
            (n.restoreOriginalState(), this._takeBackBinding(n));
        }
        this._takeBackAction(e);
      }
    },
    _initMemoryManager: function () {
      (this._actions = []),
        (this._nActiveActions = 0),
        (this._actionsByClip = {}),
        (this._bindings = []),
        (this._nActiveBindings = 0),
        (this._bindingsByRootAndName = {}),
        (this._controlInterpolants = []),
        (this._nActiveControlInterpolants = 0);
      const e = this;
      this.stats = {
        actions: {
          get total() {
            return e._actions.length;
          },
          get inUse() {
            return e._nActiveActions;
          }
        },
        bindings: {
          get total() {
            return e._bindings.length;
          },
          get inUse() {
            return e._nActiveBindings;
          }
        },
        controlInterpolants: {
          get total() {
            return e._controlInterpolants.length;
          },
          get inUse() {
            return e._nActiveControlInterpolants;
          }
        }
      };
    },
    _isActiveAction: function (e) {
      const t = e._cacheIndex;
      return null !== t && t < this._nActiveActions;
    },
    _addInactiveAction: function (e, t, n) {
      const r = this._actions,
        i = this._actionsByClip;
      let o = i[t];
      if (void 0 === o)
        (o = { knownActions: [e], actionByRoot: {} }),
          (e._byClipCacheIndex = 0),
          (i[t] = o);
      else {
        const t = o.knownActions;
        (e._byClipCacheIndex = t.length), t.push(e);
      }
      (e._cacheIndex = r.length), r.push(e), (o.actionByRoot[n] = e);
    },
    _removeInactiveAction: function (e) {
      const t = this._actions,
        n = t[t.length - 1],
        r = e._cacheIndex;
      (n._cacheIndex = r), (t[r] = n), t.pop(), (e._cacheIndex = null);
      const i = e._clip.uuid,
        o = this._actionsByClip,
        a = o[i],
        s = a.knownActions,
        c = s[s.length - 1],
        l = e._byClipCacheIndex;
      (c._byClipCacheIndex = l),
        (s[l] = c),
        s.pop(),
        (e._byClipCacheIndex = null),
        delete a.actionByRoot[(e._localRoot || this._root).uuid],
        0 === s.length && delete o[i],
        this._removeInactiveBindingsForAction(e);
    },
    _removeInactiveBindingsForAction: function (e) {
      const t = e._propertyBindings;
      for (let e = 0, n = t.length; e !== n; ++e) {
        const n = t[e];
        0 == --n.referenceCount && this._removeInactiveBinding(n);
      }
    },
    _lendAction: function (e) {
      const t = this._actions,
        n = e._cacheIndex,
        r = this._nActiveActions++,
        i = t[r];
      (e._cacheIndex = r), (t[r] = e), (i._cacheIndex = n), (t[n] = i);
    },
    _takeBackAction: function (e) {
      const t = this._actions,
        n = e._cacheIndex,
        r = --this._nActiveActions,
        i = t[r];
      (e._cacheIndex = r), (t[r] = e), (i._cacheIndex = n), (t[n] = i);
    },
    _addInactiveBinding: function (e, t, n) {
      const r = this._bindingsByRootAndName,
        i = this._bindings;
      let o = r[t];
      void 0 === o && ((o = {}), (r[t] = o)),
        (o[n] = e),
        (e._cacheIndex = i.length),
        i.push(e);
    },
    _removeInactiveBinding: function (e) {
      const t = this._bindings,
        n = e.binding,
        r = n.rootNode.uuid,
        i = n.path,
        o = this._bindingsByRootAndName,
        a = o[r],
        s = t[t.length - 1],
        c = e._cacheIndex;
      (s._cacheIndex = c),
        (t[c] = s),
        t.pop(),
        delete a[i],
        0 === Object.keys(a).length && delete o[r];
    },
    _lendBinding: function (e) {
      const t = this._bindings,
        n = e._cacheIndex,
        r = this._nActiveBindings++,
        i = t[r];
      (e._cacheIndex = r), (t[r] = e), (i._cacheIndex = n), (t[n] = i);
    },
    _takeBackBinding: function (e) {
      const t = this._bindings,
        n = e._cacheIndex,
        r = --this._nActiveBindings,
        i = t[r];
      (e._cacheIndex = r), (t[r] = e), (i._cacheIndex = n), (t[n] = i);
    },
    _lendControlInterpolant: function () {
      const e = this._controlInterpolants,
        t = this._nActiveControlInterpolants++;
      let n = e[t];
      return (
        void 0 === n &&
          (((n = new LinearInterpolant(
            new Float32Array(2),
            new Float32Array(2),
            1,
            this._controlInterpolantsResultBuffer
          )).__cacheIndex = t),
          (e[t] = n)),
        n
      );
    },
    _takeBackControlInterpolant: function (e) {
      const t = this._controlInterpolants,
        n = e.__cacheIndex,
        r = --this._nActiveControlInterpolants,
        i = t[r];
      (e.__cacheIndex = r), (t[r] = e), (i.__cacheIndex = n), (t[n] = i);
    },
    _controlInterpolantsResultBuffer: new Float32Array(1),
    clipAction: function (e, t, n) {
      const r = t || this._root,
        i = r.uuid;
      let o = "string" == typeof e ? AnimationClip.findByName(r, e) : e;
      const a = null !== o ? o.uuid : e,
        s = this._actionsByClip[a];
      let c = null;
      if (
        (void 0 === n &&
          (n = null !== o ? o.blendMode : NormalAnimationBlendMode),
        void 0 !== s)
      ) {
        const e = s.actionByRoot[i];
        if (void 0 !== e && e.blendMode === n) return e;
        (c = s.knownActions[0]), null === o && (o = c._clip);
      }
      if (null === o) return null;
      const l = new AnimationAction(this, o, t, n);
      return this._bindAction(l, c), this._addInactiveAction(l, a, i), l;
    },
    existingAction: function (e, t) {
      const n = t || this._root,
        r = n.uuid,
        i = "string" == typeof e ? AnimationClip.findByName(n, e) : e,
        o = i ? i.uuid : e,
        a = this._actionsByClip[o];
      return (void 0 !== a && a.actionByRoot[r]) || null;
    },
    stopAllAction: function () {
      const e = this._actions;
      for (let t = this._nActiveActions - 1; t >= 0; --t) e[t].stop();
      return this;
    },
    update: function (e) {
      e *= this.timeScale;
      const t = this._actions,
        n = this._nActiveActions,
        r = (this.time += e),
        i = Math.sign(e),
        o = (this._accuIndex ^= 1);
      for (let a = 0; a !== n; ++a) {
        t[a]._update(r, e, i, o);
      }
      const a = this._bindings,
        s = this._nActiveBindings;
      for (let e = 0; e !== s; ++e) a[e].apply(o);
      return this;
    },
    setTime: function (e) {
      this.time = 0;
      for (let e = 0; e < this._actions.length; e++) this._actions[e].time = 0;
      return this.update(e);
    },
    getRoot: function () {
      return this._root;
    },
    uncacheClip: function (e) {
      const t = this._actions,
        n = e.uuid,
        r = this._actionsByClip,
        i = r[n];
      if (void 0 !== i) {
        const e = i.knownActions;
        for (let n = 0, r = e.length; n !== r; ++n) {
          const r = e[n];
          this._deactivateAction(r);
          const i = r._cacheIndex,
            o = t[t.length - 1];
          (r._cacheIndex = null),
            (r._byClipCacheIndex = null),
            (o._cacheIndex = i),
            (t[i] = o),
            t.pop(),
            this._removeInactiveBindingsForAction(r);
        }
        delete r[n];
      }
    },
    uncacheRoot: function (e) {
      const t = e.uuid,
        n = this._actionsByClip;
      for (const e in n) {
        const r = n[e].actionByRoot[t];
        void 0 !== r &&
          (this._deactivateAction(r), this._removeInactiveAction(r));
      }
      const r = this._bindingsByRootAndName[t];
      if (void 0 !== r)
        for (const e in r) {
          const t = r[e];
          t.restoreOriginalState(), this._removeInactiveBinding(t);
        }
    },
    uncacheAction: function (e, t) {
      const n = this.existingAction(e, t);
      null !== n && (this._deactivateAction(n), this._removeInactiveAction(n));
    }
  }
);
class Uniform {
  constructor(e) {
    "string" == typeof e &&
      (console.warn("THREE.Uniform: Type parameter is no longer needed."),
      (e = arguments[1])),
      (this.value = e);
  }
  clone() {
    return new Uniform(
      void 0 === this.value.clone ? this.value : this.value.clone()
    );
  }
}
function InstancedInterleavedBuffer(e, t, n) {
  InterleavedBuffer.call(this, e, t), (this.meshPerAttribute = n || 1);
}
function GLBufferAttribute(e, t, n, r, i) {
  (this.buffer = e),
    (this.type = t),
    (this.itemSize = n),
    (this.elementSize = r),
    (this.count = i),
    (this.version = 0);
}
function Raycaster(e, t, n, r) {
  (this.ray = new Ray(e, t)),
    (this.near = n || 0),
    (this.far = r || 1 / 0),
    (this.camera = null),
    (this.layers = new Layers()),
    (this.params = {
      Mesh: {},
      Line: { threshold: 1 },
      LOD: {},
      Points: { threshold: 1 },
      Sprite: {}
    }),
    Object.defineProperties(this.params, {
      PointCloud: {
        get: function () {
          return (
            console.warn(
              "THREE.Raycaster: params.PointCloud has been renamed to params.Points."
            ),
            this.Points
          );
        }
      }
    });
}
function ascSort(e, t) {
  return e.distance - t.distance;
}
function intersectObject(e, t, n, r) {
  if ((e.layers.test(t.layers) && e.raycast(t, n), !0 === r)) {
    const r = e.children;
    for (let e = 0, i = r.length; e < i; e++) intersectObject(r[e], t, n, !0);
  }
}
(InstancedInterleavedBuffer.prototype = Object.assign(
  Object.create(InterleavedBuffer.prototype),
  {
    constructor: InstancedInterleavedBuffer,
    isInstancedInterleavedBuffer: !0,
    copy: function (e) {
      return (
        InterleavedBuffer.prototype.copy.call(this, e),
        (this.meshPerAttribute = e.meshPerAttribute),
        this
      );
    },
    clone: function (e) {
      const t = InterleavedBuffer.prototype.clone.call(this, e);
      return (t.meshPerAttribute = this.meshPerAttribute), t;
    },
    toJSON: function (e) {
      const t = InterleavedBuffer.prototype.toJSON.call(this, e);
      return (
        (t.isInstancedInterleavedBuffer = !0),
        (t.meshPerAttribute = this.meshPerAttribute),
        t
      );
    }
  }
)),
  Object.defineProperty(GLBufferAttribute.prototype, "needsUpdate", {
    set: function (e) {
      !0 === e && this.version++;
    }
  }),
  Object.assign(GLBufferAttribute.prototype, {
    isGLBufferAttribute: !0,
    setBuffer: function (e) {
      return (this.buffer = e), this;
    },
    setType: function (e, t) {
      return (this.type = e), (this.elementSize = t), this;
    },
    setItemSize: function (e) {
      return (this.itemSize = e), this;
    },
    setCount: function (e) {
      return (this.count = e), this;
    }
  }),
  Object.assign(Raycaster.prototype, {
    set: function (e, t) {
      this.ray.set(e, t);
    },
    setFromCamera: function (e, t) {
      t && t.isPerspectiveCamera
        ? (this.ray.origin.setFromMatrixPosition(t.matrixWorld),
          this.ray.direction
            .set(e.x, e.y, 0.5)
            .unproject(t)
            .sub(this.ray.origin)
            .normalize(),
          (this.camera = t))
        : t && t.isOrthographicCamera
        ? (this.ray.origin
            .set(e.x, e.y, (t.near + t.far) / (t.near - t.far))
            .unproject(t),
          this.ray.direction.set(0, 0, -1).transformDirection(t.matrixWorld),
          (this.camera = t))
        : console.error("THREE.Raycaster: Unsupported camera type.");
    },
    intersectObject: function (e, t, n) {
      const r = n || [];
      return intersectObject(e, this, r, t), r.sort(ascSort), r;
    },
    intersectObjects: function (e, t, n) {
      const r = n || [];
      if (!1 === Array.isArray(e))
        return (
          console.warn(
            "THREE.Raycaster.intersectObjects: objects is not an Array."
          ),
          r
        );
      for (let n = 0, i = e.length; n < i; n++)
        intersectObject(e[n], this, r, t);
      return r.sort(ascSort), r;
    }
  });
class Spherical {
  constructor(e = 1, t = 0, n = 0) {
    return (this.radius = e), (this.phi = t), (this.theta = n), this;
  }
  set(e, t, n) {
    return (this.radius = e), (this.phi = t), (this.theta = n), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return (
      (this.radius = e.radius), (this.phi = e.phi), (this.theta = e.theta), this
    );
  }
  makeSafe() {
    return (
      (this.phi = Math.max(1e-6, Math.min(Math.PI - 1e-6, this.phi))), this
    );
  }
  setFromVector3(e) {
    return this.setFromCartesianCoords(e.x, e.y, e.z);
  }
  setFromCartesianCoords(e, t, n) {
    return (
      (this.radius = Math.sqrt(e * e + t * t + n * n)),
      0 === this.radius
        ? ((this.theta = 0), (this.phi = 0))
        : ((this.theta = Math.atan2(e, n)),
          (this.phi = Math.acos(MathUtils.clamp(t / this.radius, -1, 1)))),
      this
    );
  }
}
class Cylindrical {
  constructor(e, t, n) {
    return (
      (this.radius = void 0 !== e ? e : 1),
      (this.theta = void 0 !== t ? t : 0),
      (this.y = void 0 !== n ? n : 0),
      this
    );
  }
  set(e, t, n) {
    return (this.radius = e), (this.theta = t), (this.y = n), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return (
      (this.radius = e.radius), (this.theta = e.theta), (this.y = e.y), this
    );
  }
  setFromVector3(e) {
    return this.setFromCartesianCoords(e.x, e.y, e.z);
  }
  setFromCartesianCoords(e, t, n) {
    return (
      (this.radius = Math.sqrt(e * e + n * n)),
      (this.theta = Math.atan2(e, n)),
      (this.y = t),
      this
    );
  }
}
const _vector$7 = new Vector2();
class Box2 {
  constructor(e, t) {
    Object.defineProperty(this, "isBox2", { value: !0 }),
      (this.min = void 0 !== e ? e : new Vector2(1 / 0, 1 / 0)),
      (this.max = void 0 !== t ? t : new Vector2(-1 / 0, -1 / 0));
  }
  set(e, t) {
    return this.min.copy(e), this.max.copy(t), this;
  }
  setFromPoints(e) {
    this.makeEmpty();
    for (let t = 0, n = e.length; t < n; t++) this.expandByPoint(e[t]);
    return this;
  }
  setFromCenterAndSize(e, t) {
    const n = _vector$7.copy(t).multiplyScalar(0.5);
    return this.min.copy(e).sub(n), this.max.copy(e).add(n), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.min.copy(e.min), this.max.copy(e.max), this;
  }
  makeEmpty() {
    return (
      (this.min.x = this.min.y = 1 / 0),
      (this.max.x = this.max.y = -1 / 0),
      this
    );
  }
  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y;
  }
  getCenter(e) {
    return (
      void 0 === e &&
        (console.warn("THREE.Box2: .getCenter() target is now required"),
        (e = new Vector2())),
      this.isEmpty()
        ? e.set(0, 0)
        : e.addVectors(this.min, this.max).multiplyScalar(0.5)
    );
  }
  getSize(e) {
    return (
      void 0 === e &&
        (console.warn("THREE.Box2: .getSize() target is now required"),
        (e = new Vector2())),
      this.isEmpty() ? e.set(0, 0) : e.subVectors(this.max, this.min)
    );
  }
  expandByPoint(e) {
    return this.min.min(e), this.max.max(e), this;
  }
  expandByVector(e) {
    return this.min.sub(e), this.max.add(e), this;
  }
  expandByScalar(e) {
    return this.min.addScalar(-e), this.max.addScalar(e), this;
  }
  containsPoint(e) {
    return !(
      e.x < this.min.x ||
      e.x > this.max.x ||
      e.y < this.min.y ||
      e.y > this.max.y
    );
  }
  containsBox(e) {
    return (
      this.min.x <= e.min.x &&
      e.max.x <= this.max.x &&
      this.min.y <= e.min.y &&
      e.max.y <= this.max.y
    );
  }
  getParameter(e, t) {
    return (
      void 0 === t &&
        (console.warn("THREE.Box2: .getParameter() target is now required"),
        (t = new Vector2())),
      t.set(
        (e.x - this.min.x) / (this.max.x - this.min.x),
        (e.y - this.min.y) / (this.max.y - this.min.y)
      )
    );
  }
  intersectsBox(e) {
    return !(
      e.max.x < this.min.x ||
      e.min.x > this.max.x ||
      e.max.y < this.min.y ||
      e.min.y > this.max.y
    );
  }
  clampPoint(e, t) {
    return (
      void 0 === t &&
        (console.warn("THREE.Box2: .clampPoint() target is now required"),
        (t = new Vector2())),
      t.copy(e).clamp(this.min, this.max)
    );
  }
  distanceToPoint(e) {
    return _vector$7.copy(e).clamp(this.min, this.max).sub(e).length();
  }
  intersect(e) {
    return this.min.max(e.min), this.max.min(e.max), this;
  }
  union(e) {
    return this.min.min(e.min), this.max.max(e.max), this;
  }
  translate(e) {
    return this.min.add(e), this.max.add(e), this;
  }
  equals(e) {
    return e.min.equals(this.min) && e.max.equals(this.max);
  }
}
const _startP = new Vector3(),
  _startEnd = new Vector3();
class Line3 {
  constructor(e, t) {
    (this.start = void 0 !== e ? e : new Vector3()),
      (this.end = void 0 !== t ? t : new Vector3());
  }
  set(e, t) {
    return this.start.copy(e), this.end.copy(t), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.start.copy(e.start), this.end.copy(e.end), this;
  }
  getCenter(e) {
    return (
      void 0 === e &&
        (console.warn("THREE.Line3: .getCenter() target is now required"),
        (e = new Vector3())),
      e.addVectors(this.start, this.end).multiplyScalar(0.5)
    );
  }
  delta(e) {
    return (
      void 0 === e &&
        (console.warn("THREE.Line3: .delta() target is now required"),
        (e = new Vector3())),
      e.subVectors(this.end, this.start)
    );
  }
  distanceSq() {
    return this.start.distanceToSquared(this.end);
  }
  distance() {
    return this.start.distanceTo(this.end);
  }
  at(e, t) {
    return (
      void 0 === t &&
        (console.warn("THREE.Line3: .at() target is now required"),
        (t = new Vector3())),
      this.delta(t).multiplyScalar(e).add(this.start)
    );
  }
  closestPointToPointParameter(e, t) {
    _startP.subVectors(e, this.start),
      _startEnd.subVectors(this.end, this.start);
    const n = _startEnd.dot(_startEnd);
    let r = _startEnd.dot(_startP) / n;
    return t && (r = MathUtils.clamp(r, 0, 1)), r;
  }
  closestPointToPoint(e, t, n) {
    const r = this.closestPointToPointParameter(e, t);
    return (
      void 0 === n &&
        (console.warn(
          "THREE.Line3: .closestPointToPoint() target is now required"
        ),
        (n = new Vector3())),
      this.delta(n).multiplyScalar(r).add(this.start)
    );
  }
  applyMatrix4(e) {
    return this.start.applyMatrix4(e), this.end.applyMatrix4(e), this;
  }
  equals(e) {
    return e.start.equals(this.start) && e.end.equals(this.end);
  }
}
function ImmediateRenderObject(e) {
  Object3D.call(this),
    (this.material = e),
    (this.render = function () {}),
    (this.hasPositions = !1),
    (this.hasNormals = !1),
    (this.hasColors = !1),
    (this.hasUvs = !1),
    (this.positionArray = null),
    (this.normalArray = null),
    (this.colorArray = null),
    (this.uvArray = null),
    (this.count = 0);
}
(ImmediateRenderObject.prototype = Object.create(Object3D.prototype)),
  (ImmediateRenderObject.prototype.constructor = ImmediateRenderObject),
  (ImmediateRenderObject.prototype.isImmediateRenderObject = !0);
const _vector$8 = new Vector3();
class SpotLightHelper extends Object3D {
  constructor(e, t) {
    super(),
      (this.light = e),
      this.light.updateMatrixWorld(),
      (this.matrix = e.matrixWorld),
      (this.matrixAutoUpdate = !1),
      (this.color = t);
    const n = new BufferGeometry(),
      r = [
        0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, -1, 0, 1, 0, 0, 0, 0, 1, 1,
        0, 0, 0, 0, -1, 1
      ];
    for (let e = 0, t = 1, n = 32; e < n; e++, t++) {
      const i = (e / n) * Math.PI * 2,
        o = (t / n) * Math.PI * 2;
      r.push(Math.cos(i), Math.sin(i), 1, Math.cos(o), Math.sin(o), 1);
    }
    n.setAttribute("position", new Float32BufferAttribute(r, 3));
    const i = new LineBasicMaterial({ fog: !1, toneMapped: !1 });
    (this.cone = new LineSegments(n, i)), this.add(this.cone), this.update();
  }
  dispose() {
    this.cone.geometry.dispose(), this.cone.material.dispose();
  }
  update() {
    this.light.updateMatrixWorld();
    const e = this.light.distance ? this.light.distance : 1e3,
      t = e * Math.tan(this.light.angle);
    this.cone.scale.set(t, t, e),
      _vector$8.setFromMatrixPosition(this.light.target.matrixWorld),
      this.cone.lookAt(_vector$8),
      void 0 !== this.color
        ? this.cone.material.color.set(this.color)
        : this.cone.material.color.copy(this.light.color);
  }
}
const _vector$9 = new Vector3(),
  _boneMatrix = new Matrix4(),
  _matrixWorldInv = new Matrix4();
class SkeletonHelper extends LineSegments {
  constructor(e) {
    const t = getBoneList(e),
      n = new BufferGeometry(),
      r = [],
      i = [],
      o = new Color(0, 0, 1),
      a = new Color(0, 1, 0);
    for (let e = 0; e < t.length; e++) {
      const n = t[e];
      n.parent &&
        n.parent.isBone &&
        (r.push(0, 0, 0),
        r.push(0, 0, 0),
        i.push(o.r, o.g, o.b),
        i.push(a.r, a.g, a.b));
    }
    n.setAttribute("position", new Float32BufferAttribute(r, 3)),
      n.setAttribute("color", new Float32BufferAttribute(i, 3)),
      super(
        n,
        new LineBasicMaterial({
          vertexColors: !0,
          depthTest: !1,
          depthWrite: !1,
          toneMapped: !1,
          transparent: !0
        })
      ),
      (this.type = "SkeletonHelper"),
      (this.isSkeletonHelper = !0),
      (this.root = e),
      (this.bones = t),
      (this.matrix = e.matrixWorld),
      (this.matrixAutoUpdate = !1);
  }
  updateMatrixWorld(e) {
    const t = this.bones,
      n = this.geometry,
      r = n.getAttribute("position");
    _matrixWorldInv.getInverse(this.root.matrixWorld);
    for (let e = 0, n = 0; e < t.length; e++) {
      const i = t[e];
      i.parent &&
        i.parent.isBone &&
        (_boneMatrix.multiplyMatrices(_matrixWorldInv, i.matrixWorld),
        _vector$9.setFromMatrixPosition(_boneMatrix),
        r.setXYZ(n, _vector$9.x, _vector$9.y, _vector$9.z),
        _boneMatrix.multiplyMatrices(_matrixWorldInv, i.parent.matrixWorld),
        _vector$9.setFromMatrixPosition(_boneMatrix),
        r.setXYZ(n + 1, _vector$9.x, _vector$9.y, _vector$9.z),
        (n += 2));
    }
    (n.getAttribute("position").needsUpdate = !0), super.updateMatrixWorld(e);
  }
}
function getBoneList(e) {
  const t = [];
  e && e.isBone && t.push(e);
  for (let n = 0; n < e.children.length; n++)
    t.push.apply(t, getBoneList(e.children[n]));
  return t;
}
class PointLightHelper extends Mesh {
  constructor(e, t, n) {
    super(
      new SphereBufferGeometry(t, 4, 2),
      new MeshBasicMaterial({ wireframe: !0, fog: !1, toneMapped: !1 })
    ),
      (this.light = e),
      this.light.updateMatrixWorld(),
      (this.color = n),
      (this.type = "PointLightHelper"),
      (this.matrix = this.light.matrixWorld),
      (this.matrixAutoUpdate = !1),
      this.update();
  }
  dispose() {
    this.geometry.dispose(), this.material.dispose();
  }
  update() {
    void 0 !== this.color
      ? this.material.color.set(this.color)
      : this.material.color.copy(this.light.color);
  }
}
const _vector$a = new Vector3(),
  _color1 = new Color(),
  _color2 = new Color();
class HemisphereLightHelper extends Object3D {
  constructor(e, t, n) {
    super(),
      (this.light = e),
      this.light.updateMatrixWorld(),
      (this.matrix = e.matrixWorld),
      (this.matrixAutoUpdate = !1),
      (this.color = n);
    const r = new OctahedronBufferGeometry(t);
    r.rotateY(0.5 * Math.PI),
      (this.material = new MeshBasicMaterial({
        wireframe: !0,
        fog: !1,
        toneMapped: !1
      })),
      void 0 === this.color && (this.material.vertexColors = !0);
    const i = r.getAttribute("position"),
      o = new Float32Array(3 * i.count);
    r.setAttribute("color", new BufferAttribute(o, 3)),
      this.add(new Mesh(r, this.material)),
      this.update();
  }
  dispose() {
    this.children[0].geometry.dispose(), this.children[0].material.dispose();
  }
  update() {
    const e = this.children[0];
    if (void 0 !== this.color) this.material.color.set(this.color);
    else {
      const t = e.geometry.getAttribute("color");
      _color1.copy(this.light.color), _color2.copy(this.light.groundColor);
      for (let e = 0, n = t.count; e < n; e++) {
        const r = e < n / 2 ? _color1 : _color2;
        t.setXYZ(e, r.r, r.g, r.b);
      }
      t.needsUpdate = !0;
    }
    e.lookAt(_vector$a.setFromMatrixPosition(this.light.matrixWorld).negate());
  }
}
class GridHelper extends LineSegments {
  constructor(e, t, n, r) {
    (e = e || 10),
      (t = t || 10),
      (n = new Color(void 0 !== n ? n : 4473924)),
      (r = new Color(void 0 !== r ? r : 8947848));
    const i = t / 2,
      o = e / t,
      a = e / 2,
      s = [],
      c = [];
    for (let e = 0, l = 0, h = -a; e <= t; e++, h += o) {
      s.push(-a, 0, h, a, 0, h), s.push(h, 0, -a, h, 0, a);
      const t = e === i ? n : r;
      t.toArray(c, l),
        (l += 3),
        t.toArray(c, l),
        (l += 3),
        t.toArray(c, l),
        (l += 3),
        t.toArray(c, l),
        (l += 3);
    }
    const l = new BufferGeometry();
    l.setAttribute("position", new Float32BufferAttribute(s, 3)),
      l.setAttribute("color", new Float32BufferAttribute(c, 3)),
      super(l, new LineBasicMaterial({ vertexColors: !0, toneMapped: !1 })),
      (this.type = "GridHelper");
  }
}
class PolarGridHelper extends LineSegments {
  constructor(e, t, n, r, i, o) {
    (e = e || 10),
      (t = t || 16),
      (n = n || 8),
      (r = r || 64),
      (i = new Color(void 0 !== i ? i : 4473924)),
      (o = new Color(void 0 !== o ? o : 8947848));
    const a = [],
      s = [];
    for (let n = 0; n <= t; n++) {
      const r = (n / t) * (2 * Math.PI),
        c = Math.sin(r) * e,
        l = Math.cos(r) * e;
      a.push(0, 0, 0), a.push(c, 0, l);
      const h = 1 & n ? i : o;
      s.push(h.r, h.g, h.b), s.push(h.r, h.g, h.b);
    }
    for (let t = 0; t <= n; t++) {
      const c = 1 & t ? i : o,
        l = e - (e / n) * t;
      for (let e = 0; e < r; e++) {
        let t = (e / r) * (2 * Math.PI),
          n = Math.sin(t) * l,
          i = Math.cos(t) * l;
        a.push(n, 0, i),
          s.push(c.r, c.g, c.b),
          (t = ((e + 1) / r) * (2 * Math.PI)),
          (n = Math.sin(t) * l),
          (i = Math.cos(t) * l),
          a.push(n, 0, i),
          s.push(c.r, c.g, c.b);
      }
    }
    const c = new BufferGeometry();
    c.setAttribute("position", new Float32BufferAttribute(a, 3)),
      c.setAttribute("color", new Float32BufferAttribute(s, 3)),
      super(c, new LineBasicMaterial({ vertexColors: !0, toneMapped: !1 })),
      (this.type = "PolarGridHelper");
  }
}
const _v1$6 = new Vector3(),
  _v2$3 = new Vector3(),
  _v3$1 = new Vector3();
class DirectionalLightHelper extends Object3D {
  constructor(e, t, n) {
    super(),
      (this.light = e),
      this.light.updateMatrixWorld(),
      (this.matrix = e.matrixWorld),
      (this.matrixAutoUpdate = !1),
      (this.color = n),
      void 0 === t && (t = 1);
    let r = new BufferGeometry();
    r.setAttribute(
      "position",
      new Float32BufferAttribute(
        [-t, t, 0, t, t, 0, t, -t, 0, -t, -t, 0, -t, t, 0],
        3
      )
    );
    const i = new LineBasicMaterial({ fog: !1, toneMapped: !1 });
    (this.lightPlane = new Line(r, i)),
      this.add(this.lightPlane),
      (r = new BufferGeometry()).setAttribute(
        "position",
        new Float32BufferAttribute([0, 0, 0, 0, 0, 1], 3)
      ),
      (this.targetLine = new Line(r, i)),
      this.add(this.targetLine),
      this.update();
  }
  dispose() {
    this.lightPlane.geometry.dispose(),
      this.lightPlane.material.dispose(),
      this.targetLine.geometry.dispose(),
      this.targetLine.material.dispose();
  }
  update() {
    _v1$6.setFromMatrixPosition(this.light.matrixWorld),
      _v2$3.setFromMatrixPosition(this.light.target.matrixWorld),
      _v3$1.subVectors(_v2$3, _v1$6),
      this.lightPlane.lookAt(_v2$3),
      void 0 !== this.color
        ? (this.lightPlane.material.color.set(this.color),
          this.targetLine.material.color.set(this.color))
        : (this.lightPlane.material.color.copy(this.light.color),
          this.targetLine.material.color.copy(this.light.color)),
      this.targetLine.lookAt(_v2$3),
      (this.targetLine.scale.z = _v3$1.length());
  }
}
const _vector$b = new Vector3(),
  _camera = new Camera();
class CameraHelper extends LineSegments {
  constructor(e) {
    const t = new BufferGeometry(),
      n = new LineBasicMaterial({
        color: 16777215,
        vertexColors: !0,
        toneMapped: !1
      }),
      r = [],
      i = [],
      o = {},
      a = new Color(16755200),
      s = new Color(16711680),
      c = new Color(43775),
      l = new Color(16777215),
      h = new Color(3355443);
    function u(e, t, n) {
      d(e, n), d(t, n);
    }
    function d(e, t) {
      r.push(0, 0, 0),
        i.push(t.r, t.g, t.b),
        void 0 === o[e] && (o[e] = []),
        o[e].push(r.length / 3 - 1);
    }
    u("n1", "n2", a),
      u("n2", "n4", a),
      u("n4", "n3", a),
      u("n3", "n1", a),
      u("f1", "f2", a),
      u("f2", "f4", a),
      u("f4", "f3", a),
      u("f3", "f1", a),
      u("n1", "f1", a),
      u("n2", "f2", a),
      u("n3", "f3", a),
      u("n4", "f4", a),
      u("p", "n1", s),
      u("p", "n2", s),
      u("p", "n3", s),
      u("p", "n4", s),
      u("u1", "u2", c),
      u("u2", "u3", c),
      u("u3", "u1", c),
      u("c", "t", l),
      u("p", "c", h),
      u("cn1", "cn2", h),
      u("cn3", "cn4", h),
      u("cf1", "cf2", h),
      u("cf3", "cf4", h),
      t.setAttribute("position", new Float32BufferAttribute(r, 3)),
      t.setAttribute("color", new Float32BufferAttribute(i, 3)),
      super(t, n),
      (this.type = "CameraHelper"),
      (this.camera = e),
      this.camera.updateProjectionMatrix &&
        this.camera.updateProjectionMatrix(),
      (this.matrix = e.matrixWorld),
      (this.matrixAutoUpdate = !1),
      (this.pointMap = o),
      this.update();
  }
  update() {
    const e = this.geometry,
      t = this.pointMap;
    _camera.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),
      setPoint("c", t, e, _camera, 0, 0, -1),
      setPoint("t", t, e, _camera, 0, 0, 1),
      setPoint("n1", t, e, _camera, -1, -1, -1),
      setPoint("n2", t, e, _camera, 1, -1, -1),
      setPoint("n3", t, e, _camera, -1, 1, -1),
      setPoint("n4", t, e, _camera, 1, 1, -1),
      setPoint("f1", t, e, _camera, -1, -1, 1),
      setPoint("f2", t, e, _camera, 1, -1, 1),
      setPoint("f3", t, e, _camera, -1, 1, 1),
      setPoint("f4", t, e, _camera, 1, 1, 1),
      setPoint("u1", t, e, _camera, 0.7, 1.1, -1),
      setPoint("u2", t, e, _camera, -0.7, 1.1, -1),
      setPoint("u3", t, e, _camera, 0, 2, -1),
      setPoint("cf1", t, e, _camera, -1, 0, 1),
      setPoint("cf2", t, e, _camera, 1, 0, 1),
      setPoint("cf3", t, e, _camera, 0, -1, 1),
      setPoint("cf4", t, e, _camera, 0, 1, 1),
      setPoint("cn1", t, e, _camera, -1, 0, -1),
      setPoint("cn2", t, e, _camera, 1, 0, -1),
      setPoint("cn3", t, e, _camera, 0, -1, -1),
      setPoint("cn4", t, e, _camera, 0, 1, -1),
      (e.getAttribute("position").needsUpdate = !0);
  }
}
function setPoint(e, t, n, r, i, o, a) {
  _vector$b.set(i, o, a).unproject(r);
  const s = t[e];
  if (void 0 !== s) {
    const e = n.getAttribute("position");
    for (let t = 0, n = s.length; t < n; t++)
      e.setXYZ(s[t], _vector$b.x, _vector$b.y, _vector$b.z);
  }
}
const _box$3 = new Box3();
class BoxHelper extends LineSegments {
  constructor(e, t = 16776960) {
    const n = new Uint16Array([
        0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7
      ]),
      r = new Float32Array(24),
      i = new BufferGeometry();
    i.setIndex(new BufferAttribute(n, 1)),
      i.setAttribute("position", new BufferAttribute(r, 3)),
      super(i, new LineBasicMaterial({ color: t, toneMapped: !1 })),
      (this.object = e),
      (this.type = "BoxHelper"),
      (this.matrixAutoUpdate = !1),
      this.update();
  }
  update(e) {
    if (
      (void 0 !== e &&
        console.warn("THREE.BoxHelper: .update() has no longer arguments."),
      void 0 !== this.object && _box$3.setFromObject(this.object),
      _box$3.isEmpty())
    )
      return;
    const t = _box$3.min,
      n = _box$3.max,
      r = this.geometry.attributes.position,
      i = r.array;
    (i[0] = n.x),
      (i[1] = n.y),
      (i[2] = n.z),
      (i[3] = t.x),
      (i[4] = n.y),
      (i[5] = n.z),
      (i[6] = t.x),
      (i[7] = t.y),
      (i[8] = n.z),
      (i[9] = n.x),
      (i[10] = t.y),
      (i[11] = n.z),
      (i[12] = n.x),
      (i[13] = n.y),
      (i[14] = t.z),
      (i[15] = t.x),
      (i[16] = n.y),
      (i[17] = t.z),
      (i[18] = t.x),
      (i[19] = t.y),
      (i[20] = t.z),
      (i[21] = n.x),
      (i[22] = t.y),
      (i[23] = t.z),
      (r.needsUpdate = !0),
      this.geometry.computeBoundingSphere();
  }
  setFromObject(e) {
    return (this.object = e), this.update(), this;
  }
  copy(e) {
    return (
      LineSegments.prototype.copy.call(this, e), (this.object = e.object), this
    );
  }
}
class Box3Helper extends LineSegments {
  constructor(e, t = 16776960) {
    const n = new Uint16Array([
        0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7
      ]),
      r = new BufferGeometry();
    r.setIndex(new BufferAttribute(n, 1)),
      r.setAttribute(
        "position",
        new Float32BufferAttribute(
          [
            1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, -1, -1, 1, -1, -1, -1,
            -1, 1, -1, -1
          ],
          3
        )
      ),
      super(r, new LineBasicMaterial({ color: t, toneMapped: !1 })),
      (this.box = e),
      (this.type = "Box3Helper"),
      this.geometry.computeBoundingSphere();
  }
  updateMatrixWorld(e) {
    const t = this.box;
    t.isEmpty() ||
      (t.getCenter(this.position),
      t.getSize(this.scale),
      this.scale.multiplyScalar(0.5),
      super.updateMatrixWorld(e));
  }
}
class PlaneHelper extends Line {
  constructor(e, t, n) {
    const r = void 0 !== n ? n : 16776960,
      i = new BufferGeometry();
    i.setAttribute(
      "position",
      new Float32BufferAttribute(
        [
          1, -1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1,
          1, 1, 1, 0, 0, 1, 0, 0, 0
        ],
        3
      )
    ),
      i.computeBoundingSphere(),
      super(i, new LineBasicMaterial({ color: r, toneMapped: !1 })),
      (this.type = "PlaneHelper"),
      (this.plane = e),
      (this.size = void 0 === t ? 1 : t);
    const o = new BufferGeometry();
    o.setAttribute(
      "position",
      new Float32BufferAttribute(
        [1, 1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1],
        3
      )
    ),
      o.computeBoundingSphere(),
      this.add(
        new Mesh(
          o,
          new MeshBasicMaterial({
            color: r,
            opacity: 0.2,
            transparent: !0,
            depthWrite: !1,
            toneMapped: !1
          })
        )
      );
  }
  updateMatrixWorld(e) {
    let t = -this.plane.constant;
    Math.abs(t) < 1e-8 && (t = 1e-8),
      this.scale.set(0.5 * this.size, 0.5 * this.size, t),
      (this.children[0].material.side = t < 0 ? BackSide : FrontSide),
      this.lookAt(this.plane.normal),
      super.updateMatrixWorld(e);
  }
}
const _axis = new Vector3();
let _lineGeometry, _coneGeometry;
class ArrowHelper extends Object3D {
  constructor(e, t, n, r, i, o) {
    super(),
      (this.type = "ArrowHelper"),
      void 0 === e && (e = new Vector3(0, 0, 1)),
      void 0 === t && (t = new Vector3(0, 0, 0)),
      void 0 === n && (n = 1),
      void 0 === r && (r = 16776960),
      void 0 === i && (i = 0.2 * n),
      void 0 === o && (o = 0.2 * i),
      void 0 === _lineGeometry &&
        ((_lineGeometry = new BufferGeometry()).setAttribute(
          "position",
          new Float32BufferAttribute([0, 0, 0, 0, 1, 0], 3)
        ),
        (_coneGeometry = new CylinderBufferGeometry(0, 0.5, 1, 5, 1)).translate(
          0,
          -0.5,
          0
        )),
      this.position.copy(t),
      (this.line = new Line(
        _lineGeometry,
        new LineBasicMaterial({ color: r, toneMapped: !1 })
      )),
      (this.line.matrixAutoUpdate = !1),
      this.add(this.line),
      (this.cone = new Mesh(
        _coneGeometry,
        new MeshBasicMaterial({ color: r, toneMapped: !1 })
      )),
      (this.cone.matrixAutoUpdate = !1),
      this.add(this.cone),
      this.setDirection(e),
      this.setLength(n, i, o);
  }
  setDirection(e) {
    if (e.y > 0.99999) this.quaternion.set(0, 0, 0, 1);
    else if (e.y < -0.99999) this.quaternion.set(1, 0, 0, 0);
    else {
      _axis.set(e.z, 0, -e.x).normalize();
      const t = Math.acos(e.y);
      this.quaternion.setFromAxisAngle(_axis, t);
    }
  }
  setLength(e, t, n) {
    void 0 === t && (t = 0.2 * e),
      void 0 === n && (n = 0.2 * t),
      this.line.scale.set(1, Math.max(1e-4, e - t), 1),
      this.line.updateMatrix(),
      this.cone.scale.set(n, t, n),
      (this.cone.position.y = e),
      this.cone.updateMatrix();
  }
  setColor(e) {
    this.line.material.color.set(e), this.cone.material.color.set(e);
  }
  copy(e) {
    return (
      super.copy(e, !1), this.line.copy(e.line), this.cone.copy(e.cone), this
    );
  }
}
class AxesHelper extends LineSegments {
  constructor(e = 1) {
    const t = [0, 0, 0, e, 0, 0, 0, 0, 0, 0, e, 0, 0, 0, 0, 0, 0, e],
      n = new BufferGeometry();
    n.setAttribute("position", new Float32BufferAttribute(t, 3)),
      n.setAttribute(
        "color",
        new Float32BufferAttribute(
          [1, 0, 0, 1, 0.6, 0, 0, 1, 0, 0.6, 1, 0, 0, 0, 1, 0, 0.6, 1],
          3
        )
      ),
      super(n, new LineBasicMaterial({ vertexColors: !0, toneMapped: !1 })),
      (this.type = "AxesHelper");
  }
}
const LOD_MIN = 4,
  LOD_MAX = 8,
  SIZE_MAX = Math.pow(2, LOD_MAX),
  EXTRA_LOD_SIGMA = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582],
  TOTAL_LODS = LOD_MAX - LOD_MIN + 1 + EXTRA_LOD_SIGMA.length,
  MAX_SAMPLES = 20,
  ENCODINGS = {
    [LinearEncoding]: 0,
    [sRGBEncoding]: 1,
    [RGBEEncoding]: 2,
    [RGBM7Encoding]: 3,
    [RGBM16Encoding]: 4,
    [RGBDEncoding]: 5,
    [GammaEncoding]: 6
  },
  _flatCamera = new OrthographicCamera(),
  {
    _lodPlanes: _lodPlanes,
    _sizeLods: _sizeLods,
    _sigmas: _sigmas
  } = _createPlanes();
let _oldTarget = null;
const PHI = (1 + Math.sqrt(5)) / 2,
  INV_PHI = 1 / PHI,
  _axisDirections = [
    new Vector3(1, 1, 1),
    new Vector3(-1, 1, 1),
    new Vector3(1, 1, -1),
    new Vector3(-1, 1, -1),
    new Vector3(0, PHI, INV_PHI),
    new Vector3(0, PHI, -INV_PHI),
    new Vector3(INV_PHI, 0, PHI),
    new Vector3(-INV_PHI, 0, PHI),
    new Vector3(PHI, INV_PHI, 0),
    new Vector3(-PHI, INV_PHI, 0)
  ];
class PMREMGenerator {
  constructor(e) {
    (this._renderer = e),
      (this._pingPongRenderTarget = null),
      (this._blurMaterial = _getBlurShader(MAX_SAMPLES)),
      (this._equirectShader = null),
      (this._cubemapShader = null),
      this._compileMaterial(this._blurMaterial);
  }
  fromScene(e, t = 0, n = 0.1, r = 100) {
    _oldTarget = this._renderer.getRenderTarget();
    const i = this._allocateTargets();
    return (
      this._sceneToCubeUV(e, n, r, i),
      t > 0 && this._blur(i, 0, 0, t),
      this._applyPMREM(i),
      this._cleanup(i),
      i
    );
  }
  fromEquirectangular(e) {
    return this._fromTexture(e);
  }
  fromCubemap(e) {
    return this._fromTexture(e);
  }
  compileCubemapShader() {
    null === this._cubemapShader &&
      ((this._cubemapShader = _getCubemapShader()),
      this._compileMaterial(this._cubemapShader));
  }
  compileEquirectangularShader() {
    null === this._equirectShader &&
      ((this._equirectShader = _getEquirectShader()),
      this._compileMaterial(this._equirectShader));
  }
  dispose() {
    this._blurMaterial.dispose(),
      null !== this._cubemapShader && this._cubemapShader.dispose(),
      null !== this._equirectShader && this._equirectShader.dispose();
    for (let e = 0; e < _lodPlanes.length; e++) _lodPlanes[e].dispose();
  }
  _cleanup(e) {
    this._pingPongRenderTarget.dispose(),
      this._renderer.setRenderTarget(_oldTarget),
      (e.scissorTest = !1),
      _setViewport(e, 0, 0, e.width, e.height);
  }
  _fromTexture(e) {
    _oldTarget = this._renderer.getRenderTarget();
    const t = this._allocateTargets(e);
    return (
      this._textureToCubeUV(e, t), this._applyPMREM(t), this._cleanup(t), t
    );
  }
  _allocateTargets(e) {
    const t = {
        magFilter: NearestFilter,
        minFilter: NearestFilter,
        generateMipmaps: !1,
        type: UnsignedByteType,
        format: RGBEFormat,
        encoding: _isLDR(e) ? e.encoding : RGBEEncoding,
        depthBuffer: !1
      },
      n = _createRenderTarget(t);
    return (
      (n.depthBuffer = !e),
      (this._pingPongRenderTarget = _createRenderTarget(t)),
      n
    );
  }
  _compileMaterial(e) {
    const t = new Mesh(_lodPlanes[0], e);
    this._renderer.compile(t, _flatCamera);
  }
  _sceneToCubeUV(e, t, n, r) {
    const i = new PerspectiveCamera(90, 1, t, n),
      o = [1, -1, 1, 1, 1, 1],
      a = [1, 1, 1, -1, -1, -1],
      s = this._renderer,
      c = s.outputEncoding,
      l = s.toneMapping,
      h = s.getClearColor(),
      u = s.getClearAlpha();
    (s.toneMapping = NoToneMapping), (s.outputEncoding = LinearEncoding);
    let d = e.background;
    if (d && d.isColor) {
      d.convertSRGBToLinear();
      const t = Math.max(d.r, d.g, d.b),
        n = Math.min(Math.max(Math.ceil(Math.log2(t)), -128), 127);
      d = d.multiplyScalar(Math.pow(2, -n));
      const r = (n + 128) / 255;
      s.setClearColor(d, r), (e.background = null);
    }
    for (let t = 0; t < 6; t++) {
      const n = t % 3;
      0 == n
        ? (i.up.set(0, o[t], 0), i.lookAt(a[t], 0, 0))
        : 1 == n
        ? (i.up.set(0, 0, o[t]), i.lookAt(0, a[t], 0))
        : (i.up.set(0, o[t], 0), i.lookAt(0, 0, a[t])),
        _setViewport(r, n * SIZE_MAX, t > 2 ? SIZE_MAX : 0, SIZE_MAX, SIZE_MAX),
        s.setRenderTarget(r),
        s.render(e, i);
    }
    (s.toneMapping = l), (s.outputEncoding = c), s.setClearColor(h, u);
  }
  _textureToCubeUV(e, t) {
    const n = this._renderer;
    e.isCubeTexture
      ? null == this._cubemapShader &&
        (this._cubemapShader = _getCubemapShader())
      : null == this._equirectShader &&
        (this._equirectShader = _getEquirectShader());
    const r = e.isCubeTexture ? this._cubemapShader : this._equirectShader,
      i = new Mesh(_lodPlanes[0], r),
      o = r.uniforms;
    (o.envMap.value = e),
      e.isCubeTexture ||
        o.texelSize.value.set(1 / e.image.width, 1 / e.image.height),
      (o.inputEncoding.value = ENCODINGS[e.encoding]),
      (o.outputEncoding.value = ENCODINGS[t.texture.encoding]),
      _setViewport(t, 0, 0, 3 * SIZE_MAX, 2 * SIZE_MAX),
      n.setRenderTarget(t),
      n.render(i, _flatCamera);
  }
  _applyPMREM(e) {
    const t = this._renderer,
      n = t.autoClear;
    t.autoClear = !1;
    for (let t = 1; t < TOTAL_LODS; t++) {
      const n = Math.sqrt(
          _sigmas[t] * _sigmas[t] - _sigmas[t - 1] * _sigmas[t - 1]
        ),
        r = _axisDirections[(t - 1) % _axisDirections.length];
      this._blur(e, t - 1, t, n, r);
    }
    t.autoClear = n;
  }
  _blur(e, t, n, r, i) {
    const o = this._pingPongRenderTarget;
    this._halfBlur(e, o, t, n, r, "latitudinal", i),
      this._halfBlur(o, e, n, n, r, "longitudinal", i);
  }
  _halfBlur(e, t, n, r, i, o, a) {
    const s = this._renderer,
      c = this._blurMaterial;
    "latitudinal" !== o &&
      "longitudinal" !== o &&
      console.error(
        "blur direction must be either latitudinal or longitudinal!"
      );
    const l = new Mesh(_lodPlanes[r], c),
      h = c.uniforms,
      u = _sizeLods[n] - 1,
      d = isFinite(i)
        ? Math.PI / (2 * u)
        : (2 * Math.PI) / (2 * MAX_SAMPLES - 1),
      p = i / d,
      m = isFinite(i) ? 1 + Math.floor(3 * p) : MAX_SAMPLES;
    m > MAX_SAMPLES &&
      console.warn(
        `sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${MAX_SAMPLES}`
      );
    const f = [];
    let g = 0;
    for (let e = 0; e < MAX_SAMPLES; ++e) {
      const t = e / p,
        n = Math.exp((-t * t) / 2);
      f.push(n), 0 == e ? (g += n) : e < m && (g += 2 * n);
    }
    for (let e = 0; e < f.length; e++) f[e] = f[e] / g;
    (h.envMap.value = e.texture),
      (h.samples.value = m),
      (h.weights.value = f),
      (h.latitudinal.value = "latitudinal" === o),
      a && (h.poleAxis.value = a),
      (h.dTheta.value = d),
      (h.mipInt.value = LOD_MAX - n),
      (h.inputEncoding.value = ENCODINGS[e.texture.encoding]),
      (h.outputEncoding.value = ENCODINGS[e.texture.encoding]);
    const v = _sizeLods[r];
    _setViewport(
      t,
      3 * Math.max(0, SIZE_MAX - 2 * v),
      (0 === r ? 0 : 2 * SIZE_MAX) +
        2 * v * (r > LOD_MAX - LOD_MIN ? r - LOD_MAX + LOD_MIN : 0),
      3 * v,
      2 * v
    ),
      s.setRenderTarget(t),
      s.render(l, _flatCamera);
  }
}
function _isLDR(e) {
  return (
    void 0 !== e &&
    e.type === UnsignedByteType &&
    (e.encoding === LinearEncoding ||
      e.encoding === sRGBEncoding ||
      e.encoding === GammaEncoding)
  );
}
function _createPlanes() {
  const e = [],
    t = [],
    n = [];
  let r = LOD_MAX;
  for (let i = 0; i < TOTAL_LODS; i++) {
    const o = Math.pow(2, r);
    t.push(o);
    let a = 1 / o;
    i > LOD_MAX - LOD_MIN
      ? (a = EXTRA_LOD_SIGMA[i - LOD_MAX + LOD_MIN - 1])
      : 0 == i && (a = 0),
      n.push(a);
    const s = 1 / (o - 1),
      c = -s / 2,
      l = 1 + s / 2,
      h = [c, c, l, c, l, l, c, c, l, l, c, l],
      u = 6,
      d = 6,
      p = 3,
      m = 2,
      f = 1,
      g = new Float32Array(p * d * u),
      v = new Float32Array(m * d * u),
      y = new Float32Array(f * d * u);
    for (let e = 0; e < u; e++) {
      const t = ((e % 3) * 2) / 3 - 1,
        n = e > 2 ? 0 : -1,
        r = [
          t,
          n,
          0,
          t + 2 / 3,
          n,
          0,
          t + 2 / 3,
          n + 1,
          0,
          t,
          n,
          0,
          t + 2 / 3,
          n + 1,
          0,
          t,
          n + 1,
          0
        ];
      g.set(r, p * d * e), v.set(h, m * d * e);
      const i = [e, e, e, e, e, e];
      y.set(i, f * d * e);
    }
    const _ = new BufferGeometry();
    _.setAttribute("position", new BufferAttribute(g, p)),
      _.setAttribute("uv", new BufferAttribute(v, m)),
      _.setAttribute("faceIndex", new BufferAttribute(y, f)),
      e.push(_),
      r > LOD_MIN && r--;
  }
  return { _lodPlanes: e, _sizeLods: t, _sigmas: n };
}
function _createRenderTarget(e) {
  const t = new WebGLRenderTarget(3 * SIZE_MAX, 3 * SIZE_MAX, e);
  return (
    (t.texture.mapping = CubeUVReflectionMapping),
    (t.texture.name = "PMREM.cubeUv"),
    (t.scissorTest = !0),
    t
  );
}
function _setViewport(e, t, n, r, i) {
  e.viewport.set(t, n, r, i), e.scissor.set(t, n, r, i);
}
function _getBlurShader(e) {
  return new RawShaderMaterial({
    name: "SphericalGaussianBlur",
    defines: { n: e },
    uniforms: {
      envMap: { value: null },
      samples: { value: 1 },
      weights: { value: new Float32Array(e) },
      latitudinal: { value: !1 },
      dTheta: { value: 0 },
      mipInt: { value: 0 },
      poleAxis: { value: new Vector3(0, 1, 0) },
      inputEncoding: { value: ENCODINGS[LinearEncoding] },
      outputEncoding: { value: ENCODINGS[LinearEncoding] }
    },
    vertexShader: _getCommonVertexShader(),
    fragmentShader: `\n\n\t\t\tprecision mediump float;\n\t\t\tprecision mediump int;\n\n\t\t\tvarying vec3 vOutputDirection;\n\n\t\t\tuniform sampler2D envMap;\n\t\t\tuniform int samples;\n\t\t\tuniform float weights[ n ];\n\t\t\tuniform bool latitudinal;\n\t\t\tuniform float dTheta;\n\t\t\tuniform float mipInt;\n\t\t\tuniform vec3 poleAxis;\n\n\t\t\t${_getEncodings()}\n\n\t\t\t#define ENVMAP_TYPE_CUBE_UV\n\t\t\t#include <cube_uv_reflection_fragment>\n\n\t\t\tvec3 getSample( float theta, vec3 axis ) {\n\n\t\t\t\tfloat cosTheta = cos( theta );\n\t\t\t\t// Rodrigues' axis-angle rotation\n\t\t\t\tvec3 sampleDirection = vOutputDirection * cosTheta\n\t\t\t\t\t+ cross( axis, vOutputDirection ) * sin( theta )\n\t\t\t\t\t+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );\n\n\t\t\t\treturn bilinearCubeUV( envMap, sampleDirection, mipInt );\n\n\t\t\t}\n\n\t\t\tvoid main() {\n\n\t\t\t\tvec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );\n\n\t\t\t\tif ( all( equal( axis, vec3( 0.0 ) ) ) ) {\n\n\t\t\t\t\taxis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );\n\n\t\t\t\t}\n\n\t\t\t\taxis = normalize( axis );\n\n\t\t\t\tgl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n\t\t\t\tgl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );\n\n\t\t\t\tfor ( int i = 1; i < n; i++ ) {\n\n\t\t\t\t\tif ( i >= samples ) {\n\n\t\t\t\t\t\tbreak;\n\n\t\t\t\t\t}\n\n\t\t\t\t\tfloat theta = dTheta * float( i );\n\t\t\t\t\tgl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );\n\t\t\t\t\tgl_FragColor.rgb += weights[ i ] * getSample( theta, axis );\n\n\t\t\t\t}\n\n\t\t\t\tgl_FragColor = linearToOutputTexel( gl_FragColor );\n\n\t\t\t}\n\t\t`,
    blending: NoBlending,
    depthTest: !1,
    depthWrite: !1
  });
}
function _getEquirectShader() {
  return new RawShaderMaterial({
    name: "EquirectangularToCubeUV",
    uniforms: {
      envMap: { value: null },
      texelSize: { value: new Vector2(1, 1) },
      inputEncoding: { value: ENCODINGS[LinearEncoding] },
      outputEncoding: { value: ENCODINGS[LinearEncoding] }
    },
    vertexShader: _getCommonVertexShader(),
    fragmentShader: `\n\n\t\t\tprecision mediump float;\n\t\t\tprecision mediump int;\n\n\t\t\tvarying vec3 vOutputDirection;\n\n\t\t\tuniform sampler2D envMap;\n\t\t\tuniform vec2 texelSize;\n\n\t\t\t${_getEncodings()}\n\n\t\t\t#include <common>\n\n\t\t\tvoid main() {\n\n\t\t\t\tgl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n\n\t\t\t\tvec3 outputDirection = normalize( vOutputDirection );\n\t\t\t\tvec2 uv = equirectUv( outputDirection );\n\n\t\t\t\tvec2 f = fract( uv / texelSize - 0.5 );\n\t\t\t\tuv -= f * texelSize;\n\t\t\t\tvec3 tl = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;\n\t\t\t\tuv.x += texelSize.x;\n\t\t\t\tvec3 tr = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;\n\t\t\t\tuv.y += texelSize.y;\n\t\t\t\tvec3 br = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;\n\t\t\t\tuv.x -= texelSize.x;\n\t\t\t\tvec3 bl = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;\n\n\t\t\t\tvec3 tm = mix( tl, tr, f.x );\n\t\t\t\tvec3 bm = mix( bl, br, f.x );\n\t\t\t\tgl_FragColor.rgb = mix( tm, bm, f.y );\n\n\t\t\t\tgl_FragColor = linearToOutputTexel( gl_FragColor );\n\n\t\t\t}\n\t\t`,
    blending: NoBlending,
    depthTest: !1,
    depthWrite: !1
  });
}
function _getCubemapShader() {
  return new RawShaderMaterial({
    name: "CubemapToCubeUV",
    uniforms: {
      envMap: { value: null },
      inputEncoding: { value: ENCODINGS[LinearEncoding] },
      outputEncoding: { value: ENCODINGS[LinearEncoding] }
    },
    vertexShader: _getCommonVertexShader(),
    fragmentShader: `\n\n\t\t\tprecision mediump float;\n\t\t\tprecision mediump int;\n\n\t\t\tvarying vec3 vOutputDirection;\n\n\t\t\tuniform samplerCube envMap;\n\n\t\t\t${_getEncodings()}\n\n\t\t\tvoid main() {\n\n\t\t\t\tgl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n\t\t\t\tgl_FragColor.rgb = envMapTexelToLinear( textureCube( envMap, vec3( - vOutputDirection.x, vOutputDirection.yz ) ) ).rgb;\n\t\t\t\tgl_FragColor = linearToOutputTexel( gl_FragColor );\n\n\t\t\t}\n\t\t`,
    blending: NoBlending,
    depthTest: !1,
    depthWrite: !1
  });
}
function _getCommonVertexShader() {
  return "\n\n\t\tprecision mediump float;\n\t\tprecision mediump int;\n\n\t\tattribute vec3 position;\n\t\tattribute vec2 uv;\n\t\tattribute float faceIndex;\n\n\t\tvarying vec3 vOutputDirection;\n\n\t\t// RH coordinate system; PMREM face-indexing convention\n\t\tvec3 getDirection( vec2 uv, float face ) {\n\n\t\t\tuv = 2.0 * uv - 1.0;\n\n\t\t\tvec3 direction = vec3( uv, 1.0 );\n\n\t\t\tif ( face == 0.0 ) {\n\n\t\t\t\tdirection = direction.zyx; // ( 1, v, u ) pos x\n\n\t\t\t} else if ( face == 1.0 ) {\n\n\t\t\t\tdirection = direction.xzy;\n\t\t\t\tdirection.xz *= -1.0; // ( -u, 1, -v ) pos y\n\n\t\t\t} else if ( face == 2.0 ) {\n\n\t\t\t\tdirection.x *= -1.0; // ( -u, v, 1 ) pos z\n\n\t\t\t} else if ( face == 3.0 ) {\n\n\t\t\t\tdirection = direction.zyx;\n\t\t\t\tdirection.xz *= -1.0; // ( -1, v, -u ) neg x\n\n\t\t\t} else if ( face == 4.0 ) {\n\n\t\t\t\tdirection = direction.xzy;\n\t\t\t\tdirection.xy *= -1.0; // ( -u, -1, v ) neg y\n\n\t\t\t} else if ( face == 5.0 ) {\n\n\t\t\t\tdirection.z *= -1.0; // ( u, v, -1 ) neg z\n\n\t\t\t}\n\n\t\t\treturn direction;\n\n\t\t}\n\n\t\tvoid main() {\n\n\t\t\tvOutputDirection = getDirection( uv, faceIndex );\n\t\t\tgl_Position = vec4( position, 1.0 );\n\n\t\t}\n\t";
}
function _getEncodings() {
  return "\n\n\t\tuniform int inputEncoding;\n\t\tuniform int outputEncoding;\n\n\t\t#include <encodings_pars_fragment>\n\n\t\tvec4 inputTexelToLinear( vec4 value ) {\n\n\t\t\tif ( inputEncoding == 0 ) {\n\n\t\t\t\treturn value;\n\n\t\t\t} else if ( inputEncoding == 1 ) {\n\n\t\t\t\treturn sRGBToLinear( value );\n\n\t\t\t} else if ( inputEncoding == 2 ) {\n\n\t\t\t\treturn RGBEToLinear( value );\n\n\t\t\t} else if ( inputEncoding == 3 ) {\n\n\t\t\t\treturn RGBMToLinear( value, 7.0 );\n\n\t\t\t} else if ( inputEncoding == 4 ) {\n\n\t\t\t\treturn RGBMToLinear( value, 16.0 );\n\n\t\t\t} else if ( inputEncoding == 5 ) {\n\n\t\t\t\treturn RGBDToLinear( value, 256.0 );\n\n\t\t\t} else {\n\n\t\t\t\treturn GammaToLinear( value, 2.2 );\n\n\t\t\t}\n\n\t\t}\n\n\t\tvec4 linearToOutputTexel( vec4 value ) {\n\n\t\t\tif ( outputEncoding == 0 ) {\n\n\t\t\t\treturn value;\n\n\t\t\t} else if ( outputEncoding == 1 ) {\n\n\t\t\t\treturn LinearTosRGB( value );\n\n\t\t\t} else if ( outputEncoding == 2 ) {\n\n\t\t\t\treturn LinearToRGBE( value );\n\n\t\t\t} else if ( outputEncoding == 3 ) {\n\n\t\t\t\treturn LinearToRGBM( value, 7.0 );\n\n\t\t\t} else if ( outputEncoding == 4 ) {\n\n\t\t\t\treturn LinearToRGBM( value, 16.0 );\n\n\t\t\t} else if ( outputEncoding == 5 ) {\n\n\t\t\t\treturn LinearToRGBD( value, 256.0 );\n\n\t\t\t} else {\n\n\t\t\t\treturn LinearToGamma( value, 2.2 );\n\n\t\t\t}\n\n\t\t}\n\n\t\tvec4 envMapTexelToLinear( vec4 color ) {\n\n\t\t\treturn inputTexelToLinear( color );\n\n\t\t}\n\t";
}
function Face4(e, t, n, r, i, o, a) {
  return (
    console.warn(
      "THREE.Face4 has been removed. A THREE.Face3 will be created instead."
    ),
    new Face3(e, t, n, i, o, a)
  );
}
const LineStrip = 0,
  LinePieces = 1,
  NoColors = 0,
  FaceColors = 1,
  VertexColors = 2;
function MeshFaceMaterial(e) {
  return (
    console.warn(
      "THREE.MeshFaceMaterial has been removed. Use an Array instead."
    ),
    e
  );
}
function MultiMaterial(e) {
  return (
    void 0 === e && (e = []),
    console.warn("THREE.MultiMaterial has been removed. Use an Array instead."),
    (e.isMultiMaterial = !0),
    (e.materials = e),
    (e.clone = function () {
      return e.slice();
    }),
    e
  );
}
function PointCloud(e, t) {
  return (
    console.warn("THREE.PointCloud has been renamed to THREE.Points."),
    new Points(e, t)
  );
}
function Particle(e) {
  return (
    console.warn("THREE.Particle has been renamed to THREE.Sprite."),
    new Sprite(e)
  );
}
function ParticleSystem(e, t) {
  return (
    console.warn("THREE.ParticleSystem has been renamed to THREE.Points."),
    new Points(e, t)
  );
}
function PointCloudMaterial(e) {
  return (
    console.warn(
      "THREE.PointCloudMaterial has been renamed to THREE.PointsMaterial."
    ),
    new PointsMaterial(e)
  );
}
function ParticleBasicMaterial(e) {
  return (
    console.warn(
      "THREE.ParticleBasicMaterial has been renamed to THREE.PointsMaterial."
    ),
    new PointsMaterial(e)
  );
}
function ParticleSystemMaterial(e) {
  return (
    console.warn(
      "THREE.ParticleSystemMaterial has been renamed to THREE.PointsMaterial."
    ),
    new PointsMaterial(e)
  );
}
function Vertex(e, t, n) {
  return (
    console.warn("THREE.Vertex has been removed. Use THREE.Vector3 instead."),
    new Vector3(e, t, n)
  );
}
function DynamicBufferAttribute(e, t) {
  return (
    console.warn(
      "THREE.DynamicBufferAttribute has been removed. Use new THREE.BufferAttribute().setUsage( THREE.DynamicDrawUsage ) instead."
    ),
    new BufferAttribute(e, t).setUsage(DynamicDrawUsage)
  );
}
function Int8Attribute(e, t) {
  return (
    console.warn(
      "THREE.Int8Attribute has been removed. Use new THREE.Int8BufferAttribute() instead."
    ),
    new Int8BufferAttribute(e, t)
  );
}
function Uint8Attribute(e, t) {
  return (
    console.warn(
      "THREE.Uint8Attribute has been removed. Use new THREE.Uint8BufferAttribute() instead."
    ),
    new Uint8BufferAttribute(e, t)
  );
}
function Uint8ClampedAttribute(e, t) {
  return (
    console.warn(
      "THREE.Uint8ClampedAttribute has been removed. Use new THREE.Uint8ClampedBufferAttribute() instead."
    ),
    new Uint8ClampedBufferAttribute(e, t)
  );
}
function Int16Attribute(e, t) {
  return (
    console.warn(
      "THREE.Int16Attribute has been removed. Use new THREE.Int16BufferAttribute() instead."
    ),
    new Int16BufferAttribute(e, t)
  );
}
function Uint16Attribute(e, t) {
  return (
    console.warn(
      "THREE.Uint16Attribute has been removed. Use new THREE.Uint16BufferAttribute() instead."
    ),
    new Uint16BufferAttribute(e, t)
  );
}
function Int32Attribute(e, t) {
  return (
    console.warn(
      "THREE.Int32Attribute has been removed. Use new THREE.Int32BufferAttribute() instead."
    ),
    new Int32BufferAttribute(e, t)
  );
}
function Uint32Attribute(e, t) {
  return (
    console.warn(
      "THREE.Uint32Attribute has been removed. Use new THREE.Uint32BufferAttribute() instead."
    ),
    new Uint32BufferAttribute(e, t)
  );
}
function Float32Attribute(e, t) {
  return (
    console.warn(
      "THREE.Float32Attribute has been removed. Use new THREE.Float32BufferAttribute() instead."
    ),
    new Float32BufferAttribute(e, t)
  );
}
function Float64Attribute(e, t) {
  return (
    console.warn(
      "THREE.Float64Attribute has been removed. Use new THREE.Float64BufferAttribute() instead."
    ),
    new Float64BufferAttribute(e, t)
  );
}
function ClosedSplineCurve3(e) {
  console.warn(
    "THREE.ClosedSplineCurve3 has been deprecated. Use THREE.CatmullRomCurve3 instead."
  ),
    CatmullRomCurve3.call(this, e),
    (this.type = "catmullrom"),
    (this.closed = !0);
}
function SplineCurve3(e) {
  console.warn(
    "THREE.SplineCurve3 has been deprecated. Use THREE.CatmullRomCurve3 instead."
  ),
    CatmullRomCurve3.call(this, e),
    (this.type = "catmullrom");
}
function Spline(e) {
  console.warn(
    "THREE.Spline has been removed. Use THREE.CatmullRomCurve3 instead."
  ),
    CatmullRomCurve3.call(this, e),
    (this.type = "catmullrom");
}
function AxisHelper(e) {
  return (
    console.warn("THREE.AxisHelper has been renamed to THREE.AxesHelper."),
    new AxesHelper(e)
  );
}
function BoundingBoxHelper(e, t) {
  return (
    console.warn(
      "THREE.BoundingBoxHelper has been deprecated. Creating a THREE.BoxHelper instead."
    ),
    new BoxHelper(e, t)
  );
}
function EdgesHelper(e, t) {
  return (
    console.warn(
      "THREE.EdgesHelper has been removed. Use THREE.EdgesGeometry instead."
    ),
    new LineSegments(
      new EdgesGeometry(e.geometry),
      new LineBasicMaterial({ color: void 0 !== t ? t : 16777215 })
    )
  );
}
function WireframeHelper(e, t) {
  return (
    console.warn(
      "THREE.WireframeHelper has been removed. Use THREE.WireframeGeometry instead."
    ),
    new LineSegments(
      new WireframeGeometry(e.geometry),
      new LineBasicMaterial({ color: void 0 !== t ? t : 16777215 })
    )
  );
}
function XHRLoader(e) {
  return (
    console.warn("THREE.XHRLoader has been renamed to THREE.FileLoader."),
    new FileLoader(e)
  );
}
function BinaryTextureLoader(e) {
  return (
    console.warn(
      "THREE.BinaryTextureLoader has been renamed to THREE.DataTextureLoader."
    ),
    new DataTextureLoader(e)
  );
}
function WebGLRenderTargetCube(e, t, n) {
  return (
    console.warn(
      "THREE.WebGLRenderTargetCube( width, height, options ) is now WebGLCubeRenderTarget( size, options )."
    ),
    new WebGLCubeRenderTarget(e, n)
  );
}
(Curve.create = function (e, t) {
  return (
    console.log("THREE.Curve.create() has been deprecated"),
    (e.prototype = Object.create(Curve.prototype)),
    (e.prototype.constructor = e),
    (e.prototype.getPoint = t),
    e
  );
}),
  Object.assign(CurvePath.prototype, {
    createPointsGeometry: function (e) {
      console.warn(
        "THREE.CurvePath: .createPointsGeometry() has been removed. Use new THREE.Geometry().setFromPoints( points ) instead."
      );
      const t = this.getPoints(e);
      return this.createGeometry(t);
    },
    createSpacedPointsGeometry: function (e) {
      console.warn(
        "THREE.CurvePath: .createSpacedPointsGeometry() has been removed. Use new THREE.Geometry().setFromPoints( points ) instead."
      );
      const t = this.getSpacedPoints(e);
      return this.createGeometry(t);
    },
    createGeometry: function (e) {
      console.warn(
        "THREE.CurvePath: .createGeometry() has been removed. Use new THREE.Geometry().setFromPoints( points ) instead."
      );
      const t = new Geometry();
      for (let n = 0, r = e.length; n < r; n++) {
        const r = e[n];
        t.vertices.push(new Vector3(r.x, r.y, r.z || 0));
      }
      return t;
    }
  }),
  Object.assign(Path.prototype, {
    fromPoints: function (e) {
      return (
        console.warn(
          "THREE.Path: .fromPoints() has been renamed to .setFromPoints()."
        ),
        this.setFromPoints(e)
      );
    }
  }),
  (ClosedSplineCurve3.prototype = Object.create(CatmullRomCurve3.prototype)),
  (SplineCurve3.prototype = Object.create(CatmullRomCurve3.prototype)),
  (Spline.prototype = Object.create(CatmullRomCurve3.prototype)),
  Object.assign(Spline.prototype, {
    initFromArray: function () {
      console.error("THREE.Spline: .initFromArray() has been removed.");
    },
    getControlPointsArray: function () {
      console.error("THREE.Spline: .getControlPointsArray() has been removed.");
    },
    reparametrizeByArcLength: function () {
      console.error(
        "THREE.Spline: .reparametrizeByArcLength() has been removed."
      );
    }
  }),
  (GridHelper.prototype.setColors = function () {
    console.error(
      "THREE.GridHelper: setColors() has been deprecated, pass them in the constructor instead."
    );
  }),
  (SkeletonHelper.prototype.update = function () {
    console.error(
      "THREE.SkeletonHelper: update() no longer needs to be called."
    );
  }),
  Object.assign(Loader.prototype, {
    extractUrlBase: function (e) {
      return (
        console.warn(
          "THREE.Loader: .extractUrlBase() has been deprecated. Use THREE.LoaderUtils.extractUrlBase() instead."
        ),
        LoaderUtils.extractUrlBase(e)
      );
    }
  }),
  (Loader.Handlers = {
    add: function () {
      console.error(
        "THREE.Loader: Handlers.add() has been removed. Use LoadingManager.addHandler() instead."
      );
    },
    get: function () {
      console.error(
        "THREE.Loader: Handlers.get() has been removed. Use LoadingManager.getHandler() instead."
      );
    }
  }),
  Object.assign(Box2.prototype, {
    center: function (e) {
      return (
        console.warn("THREE.Box2: .center() has been renamed to .getCenter()."),
        this.getCenter(e)
      );
    },
    empty: function () {
      return (
        console.warn("THREE.Box2: .empty() has been renamed to .isEmpty()."),
        this.isEmpty()
      );
    },
    isIntersectionBox: function (e) {
      return (
        console.warn(
          "THREE.Box2: .isIntersectionBox() has been renamed to .intersectsBox()."
        ),
        this.intersectsBox(e)
      );
    },
    size: function (e) {
      return (
        console.warn("THREE.Box2: .size() has been renamed to .getSize()."),
        this.getSize(e)
      );
    }
  }),
  Object.assign(Box3.prototype, {
    center: function (e) {
      return (
        console.warn("THREE.Box3: .center() has been renamed to .getCenter()."),
        this.getCenter(e)
      );
    },
    empty: function () {
      return (
        console.warn("THREE.Box3: .empty() has been renamed to .isEmpty()."),
        this.isEmpty()
      );
    },
    isIntersectionBox: function (e) {
      return (
        console.warn(
          "THREE.Box3: .isIntersectionBox() has been renamed to .intersectsBox()."
        ),
        this.intersectsBox(e)
      );
    },
    isIntersectionSphere: function (e) {
      return (
        console.warn(
          "THREE.Box3: .isIntersectionSphere() has been renamed to .intersectsSphere()."
        ),
        this.intersectsSphere(e)
      );
    },
    size: function (e) {
      return (
        console.warn("THREE.Box3: .size() has been renamed to .getSize()."),
        this.getSize(e)
      );
    }
  }),
  Object.assign(Sphere.prototype, {
    empty: function () {
      return (
        console.warn("THREE.Sphere: .empty() has been renamed to .isEmpty()."),
        this.isEmpty()
      );
    }
  }),
  (Frustum.prototype.setFromMatrix = function (e) {
    return (
      console.warn(
        "THREE.Frustum: .setFromMatrix() has been renamed to .setFromProjectionMatrix()."
      ),
      this.setFromProjectionMatrix(e)
    );
  }),
  (Line3.prototype.center = function (e) {
    return (
      console.warn("THREE.Line3: .center() has been renamed to .getCenter()."),
      this.getCenter(e)
    );
  }),
  Object.assign(MathUtils, {
    random16: function () {
      return (
        console.warn(
          "THREE.Math: .random16() has been deprecated. Use Math.random() instead."
        ),
        Math.random()
      );
    },
    nearestPowerOfTwo: function (e) {
      return (
        console.warn(
          "THREE.Math: .nearestPowerOfTwo() has been renamed to .floorPowerOfTwo()."
        ),
        MathUtils.floorPowerOfTwo(e)
      );
    },
    nextPowerOfTwo: function (e) {
      return (
        console.warn(
          "THREE.Math: .nextPowerOfTwo() has been renamed to .ceilPowerOfTwo()."
        ),
        MathUtils.ceilPowerOfTwo(e)
      );
    }
  }),
  Object.assign(Matrix3.prototype, {
    flattenToArrayOffset: function (e, t) {
      return (
        console.warn(
          "THREE.Matrix3: .flattenToArrayOffset() has been deprecated. Use .toArray() instead."
        ),
        this.toArray(e, t)
      );
    },
    multiplyVector3: function (e) {
      return (
        console.warn(
          "THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead."
        ),
        e.applyMatrix3(this)
      );
    },
    multiplyVector3Array: function () {
      console.error("THREE.Matrix3: .multiplyVector3Array() has been removed.");
    },
    applyToBufferAttribute: function (e) {
      return (
        console.warn(
          "THREE.Matrix3: .applyToBufferAttribute() has been removed. Use attribute.applyMatrix3( matrix ) instead."
        ),
        e.applyMatrix3(this)
      );
    },
    applyToVector3Array: function () {
      console.error("THREE.Matrix3: .applyToVector3Array() has been removed.");
    }
  }),
  Object.assign(Matrix4.prototype, {
    extractPosition: function (e) {
      return (
        console.warn(
          "THREE.Matrix4: .extractPosition() has been renamed to .copyPosition()."
        ),
        this.copyPosition(e)
      );
    },
    flattenToArrayOffset: function (e, t) {
      return (
        console.warn(
          "THREE.Matrix4: .flattenToArrayOffset() has been deprecated. Use .toArray() instead."
        ),
        this.toArray(e, t)
      );
    },
    getPosition: function () {
      return (
        console.warn(
          "THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead."
        ),
        new Vector3().setFromMatrixColumn(this, 3)
      );
    },
    setRotationFromQuaternion: function (e) {
      return (
        console.warn(
          "THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion()."
        ),
        this.makeRotationFromQuaternion(e)
      );
    },
    multiplyToArray: function () {
      console.warn("THREE.Matrix4: .multiplyToArray() has been removed.");
    },
    multiplyVector3: function (e) {
      return (
        console.warn(
          "THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) instead."
        ),
        e.applyMatrix4(this)
      );
    },
    multiplyVector4: function (e) {
      return (
        console.warn(
          "THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead."
        ),
        e.applyMatrix4(this)
      );
    },
    multiplyVector3Array: function () {
      console.error("THREE.Matrix4: .multiplyVector3Array() has been removed.");
    },
    rotateAxis: function (e) {
      console.warn(
        "THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead."
      ),
        e.transformDirection(this);
    },
    crossVector: function (e) {
      return (
        console.warn(
          "THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead."
        ),
        e.applyMatrix4(this)
      );
    },
    translate: function () {
      console.error("THREE.Matrix4: .translate() has been removed.");
    },
    rotateX: function () {
      console.error("THREE.Matrix4: .rotateX() has been removed.");
    },
    rotateY: function () {
      console.error("THREE.Matrix4: .rotateY() has been removed.");
    },
    rotateZ: function () {
      console.error("THREE.Matrix4: .rotateZ() has been removed.");
    },
    rotateByAxis: function () {
      console.error("THREE.Matrix4: .rotateByAxis() has been removed.");
    },
    applyToBufferAttribute: function (e) {
      return (
        console.warn(
          "THREE.Matrix4: .applyToBufferAttribute() has been removed. Use attribute.applyMatrix4( matrix ) instead."
        ),
        e.applyMatrix4(this)
      );
    },
    applyToVector3Array: function () {
      console.error("THREE.Matrix4: .applyToVector3Array() has been removed.");
    },
    makeFrustum: function (e, t, n, r, i, o) {
      return (
        console.warn(
          "THREE.Matrix4: .makeFrustum() has been removed. Use .makePerspective( left, right, top, bottom, near, far ) instead."
        ),
        this.makePerspective(e, t, r, n, i, o)
      );
    }
  }),
  (Plane.prototype.isIntersectionLine = function (e) {
    return (
      console.warn(
        "THREE.Plane: .isIntersectionLine() has been renamed to .intersectsLine()."
      ),
      this.intersectsLine(e)
    );
  }),
  (Quaternion.prototype.multiplyVector3 = function (e) {
    return (
      console.warn(
        "THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead."
      ),
      e.applyQuaternion(this)
    );
  }),
  Object.assign(Ray.prototype, {
    isIntersectionBox: function (e) {
      return (
        console.warn(
          "THREE.Ray: .isIntersectionBox() has been renamed to .intersectsBox()."
        ),
        this.intersectsBox(e)
      );
    },
    isIntersectionPlane: function (e) {
      return (
        console.warn(
          "THREE.Ray: .isIntersectionPlane() has been renamed to .intersectsPlane()."
        ),
        this.intersectsPlane(e)
      );
    },
    isIntersectionSphere: function (e) {
      return (
        console.warn(
          "THREE.Ray: .isIntersectionSphere() has been renamed to .intersectsSphere()."
        ),
        this.intersectsSphere(e)
      );
    }
  }),
  Object.assign(Triangle.prototype, {
    area: function () {
      return (
        console.warn("THREE.Triangle: .area() has been renamed to .getArea()."),
        this.getArea()
      );
    },
    barycoordFromPoint: function (e, t) {
      return (
        console.warn(
          "THREE.Triangle: .barycoordFromPoint() has been renamed to .getBarycoord()."
        ),
        this.getBarycoord(e, t)
      );
    },
    midpoint: function (e) {
      return (
        console.warn(
          "THREE.Triangle: .midpoint() has been renamed to .getMidpoint()."
        ),
        this.getMidpoint(e)
      );
    },
    normal: function (e) {
      return (
        console.warn(
          "THREE.Triangle: .normal() has been renamed to .getNormal()."
        ),
        this.getNormal(e)
      );
    },
    plane: function (e) {
      return (
        console.warn(
          "THREE.Triangle: .plane() has been renamed to .getPlane()."
        ),
        this.getPlane(e)
      );
    }
  }),
  Object.assign(Triangle, {
    barycoordFromPoint: function (e, t, n, r, i) {
      return (
        console.warn(
          "THREE.Triangle: .barycoordFromPoint() has been renamed to .getBarycoord()."
        ),
        Triangle.getBarycoord(e, t, n, r, i)
      );
    },
    normal: function (e, t, n, r) {
      return (
        console.warn(
          "THREE.Triangle: .normal() has been renamed to .getNormal()."
        ),
        Triangle.getNormal(e, t, n, r)
      );
    }
  }),
  Object.assign(Shape.prototype, {
    extractAllPoints: function (e) {
      return (
        console.warn(
          "THREE.Shape: .extractAllPoints() has been removed. Use .extractPoints() instead."
        ),
        this.extractPoints(e)
      );
    },
    extrude: function (e) {
      return (
        console.warn(
          "THREE.Shape: .extrude() has been removed. Use ExtrudeGeometry() instead."
        ),
        new ExtrudeGeometry(this, e)
      );
    },
    makeGeometry: function (e) {
      return (
        console.warn(
          "THREE.Shape: .makeGeometry() has been removed. Use ShapeGeometry() instead."
        ),
        new ShapeGeometry(this, e)
      );
    }
  }),
  Object.assign(Vector2.prototype, {
    fromAttribute: function (e, t, n) {
      return (
        console.warn(
          "THREE.Vector2: .fromAttribute() has been renamed to .fromBufferAttribute()."
        ),
        this.fromBufferAttribute(e, t, n)
      );
    },
    distanceToManhattan: function (e) {
      return (
        console.warn(
          "THREE.Vector2: .distanceToManhattan() has been renamed to .manhattanDistanceTo()."
        ),
        this.manhattanDistanceTo(e)
      );
    },
    lengthManhattan: function () {
      return (
        console.warn(
          "THREE.Vector2: .lengthManhattan() has been renamed to .manhattanLength()."
        ),
        this.manhattanLength()
      );
    }
  }),
  Object.assign(Vector3.prototype, {
    setEulerFromRotationMatrix: function () {
      console.error(
        "THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead."
      );
    },
    setEulerFromQuaternion: function () {
      console.error(
        "THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead."
      );
    },
    getPositionFromMatrix: function (e) {
      return (
        console.warn(
          "THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition()."
        ),
        this.setFromMatrixPosition(e)
      );
    },
    getScaleFromMatrix: function (e) {
      return (
        console.warn(
          "THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale()."
        ),
        this.setFromMatrixScale(e)
      );
    },
    getColumnFromMatrix: function (e, t) {
      return (
        console.warn(
          "THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn()."
        ),
        this.setFromMatrixColumn(t, e)
      );
    },
    applyProjection: function (e) {
      return (
        console.warn(
          "THREE.Vector3: .applyProjection() has been removed. Use .applyMatrix4( m ) instead."
        ),
        this.applyMatrix4(e)
      );
    },
    fromAttribute: function (e, t, n) {
      return (
        console.warn(
          "THREE.Vector3: .fromAttribute() has been renamed to .fromBufferAttribute()."
        ),
        this.fromBufferAttribute(e, t, n)
      );
    },
    distanceToManhattan: function (e) {
      return (
        console.warn(
          "THREE.Vector3: .distanceToManhattan() has been renamed to .manhattanDistanceTo()."
        ),
        this.manhattanDistanceTo(e)
      );
    },
    lengthManhattan: function () {
      return (
        console.warn(
          "THREE.Vector3: .lengthManhattan() has been renamed to .manhattanLength()."
        ),
        this.manhattanLength()
      );
    }
  }),
  Object.assign(Vector4.prototype, {
    fromAttribute: function (e, t, n) {
      return (
        console.warn(
          "THREE.Vector4: .fromAttribute() has been renamed to .fromBufferAttribute()."
        ),
        this.fromBufferAttribute(e, t, n)
      );
    },
    lengthManhattan: function () {
      return (
        console.warn(
          "THREE.Vector4: .lengthManhattan() has been renamed to .manhattanLength()."
        ),
        this.manhattanLength()
      );
    }
  }),
  Object.assign(Geometry.prototype, {
    computeTangents: function () {
      console.error("THREE.Geometry: .computeTangents() has been removed.");
    },
    computeLineDistances: function () {
      console.error(
        "THREE.Geometry: .computeLineDistances() has been removed. Use THREE.Line.computeLineDistances() instead."
      );
    },
    applyMatrix: function (e) {
      return (
        console.warn(
          "THREE.Geometry: .applyMatrix() has been renamed to .applyMatrix4()."
        ),
        this.applyMatrix4(e)
      );
    }
  }),
  Object.assign(Object3D.prototype, {
    getChildByName: function (e) {
      return (
        console.warn(
          "THREE.Object3D: .getChildByName() has been renamed to .getObjectByName()."
        ),
        this.getObjectByName(e)
      );
    },
    renderDepth: function () {
      console.warn(
        "THREE.Object3D: .renderDepth has been removed. Use .renderOrder, instead."
      );
    },
    translate: function (e, t) {
      return (
        console.warn(
          "THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead."
        ),
        this.translateOnAxis(t, e)
      );
    },
    getWorldRotation: function () {
      console.error(
        "THREE.Object3D: .getWorldRotation() has been removed. Use THREE.Object3D.getWorldQuaternion( target ) instead."
      );
    },
    applyMatrix: function (e) {
      return (
        console.warn(
          "THREE.Object3D: .applyMatrix() has been renamed to .applyMatrix4()."
        ),
        this.applyMatrix4(e)
      );
    }
  }),
  Object.defineProperties(Object3D.prototype, {
    eulerOrder: {
      get: function () {
        return (
          console.warn("THREE.Object3D: .eulerOrder is now .rotation.order."),
          this.rotation.order
        );
      },
      set: function (e) {
        console.warn("THREE.Object3D: .eulerOrder is now .rotation.order."),
          (this.rotation.order = e);
      }
    },
    useQuaternion: {
      get: function () {
        console.warn(
          "THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default."
        );
      },
      set: function () {
        console.warn(
          "THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default."
        );
      }
    }
  }),
  Object.assign(Mesh.prototype, {
    setDrawMode: function () {
      console.error(
        "THREE.Mesh: .setDrawMode() has been removed. The renderer now always assumes THREE.TrianglesDrawMode. Transform your geometry via BufferGeometryUtils.toTrianglesDrawMode() if necessary."
      );
    }
  }),
  Object.defineProperties(Mesh.prototype, {
    drawMode: {
      get: function () {
        return (
          console.error(
            "THREE.Mesh: .drawMode has been removed. The renderer now always assumes THREE.TrianglesDrawMode."
          ),
          0
        );
      },
      set: function () {
        console.error(
          "THREE.Mesh: .drawMode has been removed. The renderer now always assumes THREE.TrianglesDrawMode. Transform your geometry via BufferGeometryUtils.toTrianglesDrawMode() if necessary."
        );
      }
    }
  }),
  Object.defineProperties(LOD.prototype, {
    objects: {
      get: function () {
        return (
          console.warn("THREE.LOD: .objects has been renamed to .levels."),
          this.levels
        );
      }
    }
  }),
  Object.defineProperty(Skeleton.prototype, "useVertexTexture", {
    get: function () {
      console.warn("THREE.Skeleton: useVertexTexture has been removed.");
    },
    set: function () {
      console.warn("THREE.Skeleton: useVertexTexture has been removed.");
    }
  }),
  (SkinnedMesh.prototype.initBones = function () {
    console.error("THREE.SkinnedMesh: initBones() has been removed.");
  }),
  Object.defineProperty(Curve.prototype, "__arcLengthDivisions", {
    get: function () {
      return (
        console.warn(
          "THREE.Curve: .__arcLengthDivisions is now .arcLengthDivisions."
        ),
        this.arcLengthDivisions
      );
    },
    set: function (e) {
      console.warn(
        "THREE.Curve: .__arcLengthDivisions is now .arcLengthDivisions."
      ),
        (this.arcLengthDivisions = e);
    }
  }),
  (PerspectiveCamera.prototype.setLens = function (e, t) {
    console.warn(
      "THREE.PerspectiveCamera.setLens is deprecated. Use .setFocalLength and .filmGauge for a photographic setup."
    ),
      void 0 !== t && (this.filmGauge = t),
      this.setFocalLength(e);
  }),
  Object.defineProperties(Light.prototype, {
    onlyShadow: {
      set: function () {
        console.warn("THREE.Light: .onlyShadow has been removed.");
      }
    },
    shadowCameraFov: {
      set: function (e) {
        console.warn(
          "THREE.Light: .shadowCameraFov is now .shadow.camera.fov."
        ),
          (this.shadow.camera.fov = e);
      }
    },
    shadowCameraLeft: {
      set: function (e) {
        console.warn(
          "THREE.Light: .shadowCameraLeft is now .shadow.camera.left."
        ),
          (this.shadow.camera.left = e);
      }
    },
    shadowCameraRight: {
      set: function (e) {
        console.warn(
          "THREE.Light: .shadowCameraRight is now .shadow.camera.right."
        ),
          (this.shadow.camera.right = e);
      }
    },
    shadowCameraTop: {
      set: function (e) {
        console.warn(
          "THREE.Light: .shadowCameraTop is now .shadow.camera.top."
        ),
          (this.shadow.camera.top = e);
      }
    },
    shadowCameraBottom: {
      set: function (e) {
        console.warn(
          "THREE.Light: .shadowCameraBottom is now .shadow.camera.bottom."
        ),
          (this.shadow.camera.bottom = e);
      }
    },
    shadowCameraNear: {
      set: function (e) {
        console.warn(
          "THREE.Light: .shadowCameraNear is now .shadow.camera.near."
        ),
          (this.shadow.camera.near = e);
      }
    },
    shadowCameraFar: {
      set: function (e) {
        console.warn(
          "THREE.Light: .shadowCameraFar is now .shadow.camera.far."
        ),
          (this.shadow.camera.far = e);
      }
    },
    shadowCameraVisible: {
      set: function () {
        console.warn(
          "THREE.Light: .shadowCameraVisible has been removed. Use new THREE.CameraHelper( light.shadow.camera ) instead."
        );
      }
    },
    shadowBias: {
      set: function (e) {
        console.warn("THREE.Light: .shadowBias is now .shadow.bias."),
          (this.shadow.bias = e);
      }
    },
    shadowDarkness: {
      set: function () {
        console.warn("THREE.Light: .shadowDarkness has been removed.");
      }
    },
    shadowMapWidth: {
      set: function (e) {
        console.warn(
          "THREE.Light: .shadowMapWidth is now .shadow.mapSize.width."
        ),
          (this.shadow.mapSize.width = e);
      }
    },
    shadowMapHeight: {
      set: function (e) {
        console.warn(
          "THREE.Light: .shadowMapHeight is now .shadow.mapSize.height."
        ),
          (this.shadow.mapSize.height = e);
      }
    }
  }),
  Object.defineProperties(BufferAttribute.prototype, {
    length: {
      get: function () {
        return (
          console.warn(
            "THREE.BufferAttribute: .length has been deprecated. Use .count instead."
          ),
          this.array.length
        );
      }
    },
    dynamic: {
      get: function () {
        return (
          console.warn(
            "THREE.BufferAttribute: .dynamic has been deprecated. Use .usage instead."
          ),
          this.usage === DynamicDrawUsage
        );
      },
      set: function () {
        console.warn(
          "THREE.BufferAttribute: .dynamic has been deprecated. Use .usage instead."
        ),
          this.setUsage(DynamicDrawUsage);
      }
    }
  }),
  Object.assign(BufferAttribute.prototype, {
    setDynamic: function (e) {
      return (
        console.warn(
          "THREE.BufferAttribute: .setDynamic() has been deprecated. Use .setUsage() instead."
        ),
        this.setUsage(!0 === e ? DynamicDrawUsage : StaticDrawUsage),
        this
      );
    },
    copyIndicesArray: function () {
      console.error(
        "THREE.BufferAttribute: .copyIndicesArray() has been removed."
      );
    },
    setArray: function () {
      console.error(
        "THREE.BufferAttribute: .setArray has been removed. Use BufferGeometry .setAttribute to replace/resize attribute buffers"
      );
    }
  }),
  Object.assign(BufferGeometry.prototype, {
    addIndex: function (e) {
      console.warn(
        "THREE.BufferGeometry: .addIndex() has been renamed to .setIndex()."
      ),
        this.setIndex(e);
    },
    addAttribute: function (e, t) {
      return (
        console.warn(
          "THREE.BufferGeometry: .addAttribute() has been renamed to .setAttribute()."
        ),
        (t && t.isBufferAttribute) || (t && t.isInterleavedBufferAttribute)
          ? "index" === e
            ? (console.warn(
                "THREE.BufferGeometry.addAttribute: Use .setIndex() for index attribute."
              ),
              this.setIndex(t),
              this)
            : this.setAttribute(e, t)
          : (console.warn(
              "THREE.BufferGeometry: .addAttribute() now expects ( name, attribute )."
            ),
            this.setAttribute(
              e,
              new BufferAttribute(arguments[1], arguments[2])
            ))
      );
    },
    addDrawCall: function (e, t, n) {
      void 0 !== n &&
        console.warn(
          "THREE.BufferGeometry: .addDrawCall() no longer supports indexOffset."
        ),
        console.warn(
          "THREE.BufferGeometry: .addDrawCall() is now .addGroup()."
        ),
        this.addGroup(e, t);
    },
    clearDrawCalls: function () {
      console.warn(
        "THREE.BufferGeometry: .clearDrawCalls() is now .clearGroups()."
      ),
        this.clearGroups();
    },
    computeTangents: function () {
      console.warn(
        "THREE.BufferGeometry: .computeTangents() has been removed."
      );
    },
    computeOffsets: function () {
      console.warn("THREE.BufferGeometry: .computeOffsets() has been removed.");
    },
    removeAttribute: function (e) {
      return (
        console.warn(
          "THREE.BufferGeometry: .removeAttribute() has been renamed to .deleteAttribute()."
        ),
        this.deleteAttribute(e)
      );
    },
    applyMatrix: function (e) {
      return (
        console.warn(
          "THREE.BufferGeometry: .applyMatrix() has been renamed to .applyMatrix4()."
        ),
        this.applyMatrix4(e)
      );
    }
  }),
  Object.defineProperties(BufferGeometry.prototype, {
    drawcalls: {
      get: function () {
        return (
          console.error(
            "THREE.BufferGeometry: .drawcalls has been renamed to .groups."
          ),
          this.groups
        );
      }
    },
    offsets: {
      get: function () {
        return (
          console.warn(
            "THREE.BufferGeometry: .offsets has been renamed to .groups."
          ),
          this.groups
        );
      }
    }
  }),
  Object.defineProperties(InstancedBufferGeometry.prototype, {
    maxInstancedCount: {
      get: function () {
        return (
          console.warn(
            "THREE.InstancedBufferGeometry: .maxInstancedCount has been renamed to .instanceCount."
          ),
          this.instanceCount
        );
      },
      set: function (e) {
        console.warn(
          "THREE.InstancedBufferGeometry: .maxInstancedCount has been renamed to .instanceCount."
        ),
          (this.instanceCount = e);
      }
    }
  }),
  Object.defineProperties(Raycaster.prototype, {
    linePrecision: {
      get: function () {
        return (
          console.warn(
            "THREE.Raycaster: .linePrecision has been deprecated. Use .params.Line.threshold instead."
          ),
          this.params.Line.threshold
        );
      },
      set: function (e) {
        console.warn(
          "THREE.Raycaster: .linePrecision has been deprecated. Use .params.Line.threshold instead."
        ),
          (this.params.Line.threshold = e);
      }
    }
  }),
  Object.defineProperties(InterleavedBuffer.prototype, {
    dynamic: {
      get: function () {
        return (
          console.warn(
            "THREE.InterleavedBuffer: .length has been deprecated. Use .usage instead."
          ),
          this.usage === DynamicDrawUsage
        );
      },
      set: function (e) {
        console.warn(
          "THREE.InterleavedBuffer: .length has been deprecated. Use .usage instead."
        ),
          this.setUsage(e);
      }
    }
  }),
  Object.assign(InterleavedBuffer.prototype, {
    setDynamic: function (e) {
      return (
        console.warn(
          "THREE.InterleavedBuffer: .setDynamic() has been deprecated. Use .setUsage() instead."
        ),
        this.setUsage(!0 === e ? DynamicDrawUsage : StaticDrawUsage),
        this
      );
    },
    setArray: function () {
      console.error(
        "THREE.InterleavedBuffer: .setArray has been removed. Use BufferGeometry .setAttribute to replace/resize attribute buffers"
      );
    }
  }),
  Object.assign(ExtrudeBufferGeometry.prototype, {
    getArrays: function () {
      console.error(
        "THREE.ExtrudeBufferGeometry: .getArrays() has been removed."
      );
    },
    addShapeList: function () {
      console.error(
        "THREE.ExtrudeBufferGeometry: .addShapeList() has been removed."
      );
    },
    addShape: function () {
      console.error(
        "THREE.ExtrudeBufferGeometry: .addShape() has been removed."
      );
    }
  }),
  Object.assign(Scene.prototype, {
    dispose: function () {
      console.error("THREE.Scene: .dispose() has been removed.");
    }
  }),
  Object.defineProperties(Uniform.prototype, {
    dynamic: {
      set: function () {
        console.warn(
          "THREE.Uniform: .dynamic has been removed. Use object.onBeforeRender() instead."
        );
      }
    },
    onUpdate: {
      value: function () {
        return (
          console.warn(
            "THREE.Uniform: .onUpdate() has been removed. Use object.onBeforeRender() instead."
          ),
          this
        );
      }
    }
  }),
  Object.defineProperties(Material.prototype, {
    wrapAround: {
      get: function () {
        console.warn("THREE.Material: .wrapAround has been removed.");
      },
      set: function () {
        console.warn("THREE.Material: .wrapAround has been removed.");
      }
    },
    overdraw: {
      get: function () {
        console.warn("THREE.Material: .overdraw has been removed.");
      },
      set: function () {
        console.warn("THREE.Material: .overdraw has been removed.");
      }
    },
    wrapRGB: {
      get: function () {
        return (
          console.warn("THREE.Material: .wrapRGB has been removed."),
          new Color()
        );
      }
    },
    shading: {
      get: function () {
        console.error(
          "THREE." +
            this.type +
            ": .shading has been removed. Use the boolean .flatShading instead."
        );
      },
      set: function (e) {
        console.warn(
          "THREE." +
            this.type +
            ": .shading has been removed. Use the boolean .flatShading instead."
        ),
          (this.flatShading = 1 === e);
      }
    },
    stencilMask: {
      get: function () {
        return (
          console.warn(
            "THREE." +
              this.type +
              ": .stencilMask has been removed. Use .stencilFuncMask instead."
          ),
          this.stencilFuncMask
        );
      },
      set: function (e) {
        console.warn(
          "THREE." +
            this.type +
            ": .stencilMask has been removed. Use .stencilFuncMask instead."
        ),
          (this.stencilFuncMask = e);
      }
    }
  }),
  Object.defineProperties(MeshPhongMaterial.prototype, {
    metal: {
      get: function () {
        return (
          console.warn(
            "THREE.MeshPhongMaterial: .metal has been removed. Use THREE.MeshStandardMaterial instead."
          ),
          !1
        );
      },
      set: function () {
        console.warn(
          "THREE.MeshPhongMaterial: .metal has been removed. Use THREE.MeshStandardMaterial instead"
        );
      }
    }
  }),
  Object.defineProperties(MeshPhysicalMaterial.prototype, {
    transparency: {
      get: function () {
        return (
          console.warn(
            "THREE.MeshPhysicalMaterial: .transparency has been renamed to .transmission."
          ),
          this.transmission
        );
      },
      set: function (e) {
        console.warn(
          "THREE.MeshPhysicalMaterial: .transparency has been renamed to .transmission."
        ),
          (this.transmission = e);
      }
    }
  }),
  Object.defineProperties(ShaderMaterial.prototype, {
    derivatives: {
      get: function () {
        return (
          console.warn(
            "THREE.ShaderMaterial: .derivatives has been moved to .extensions.derivatives."
          ),
          this.extensions.derivatives
        );
      },
      set: function (e) {
        console.warn(
          "THREE. ShaderMaterial: .derivatives has been moved to .extensions.derivatives."
        ),
          (this.extensions.derivatives = e);
      }
    }
  }),
  Object.assign(WebGLRenderer.prototype, {
    clearTarget: function (e, t, n, r) {
      console.warn(
        "THREE.WebGLRenderer: .clearTarget() has been deprecated. Use .setRenderTarget() and .clear() instead."
      ),
        this.setRenderTarget(e),
        this.clear(t, n, r);
    },
    animate: function (e) {
      console.warn(
        "THREE.WebGLRenderer: .animate() is now .setAnimationLoop()."
      ),
        this.setAnimationLoop(e);
    },
    getCurrentRenderTarget: function () {
      return (
        console.warn(
          "THREE.WebGLRenderer: .getCurrentRenderTarget() is now .getRenderTarget()."
        ),
        this.getRenderTarget()
      );
    },
    getMaxAnisotropy: function () {
      return (
        console.warn(
          "THREE.WebGLRenderer: .getMaxAnisotropy() is now .capabilities.getMaxAnisotropy()."
        ),
        this.capabilities.getMaxAnisotropy()
      );
    },
    getPrecision: function () {
      return (
        console.warn(
          "THREE.WebGLRenderer: .getPrecision() is now .capabilities.precision."
        ),
        this.capabilities.precision
      );
    },
    resetGLState: function () {
      return (
        console.warn(
          "THREE.WebGLRenderer: .resetGLState() is now .state.reset()."
        ),
        this.state.reset()
      );
    },
    supportsFloatTextures: function () {
      return (
        console.warn(
          "THREE.WebGLRenderer: .supportsFloatTextures() is now .extensions.get( 'OES_texture_float' )."
        ),
        this.extensions.get("OES_texture_float")
      );
    },
    supportsHalfFloatTextures: function () {
      return (
        console.warn(
          "THREE.WebGLRenderer: .supportsHalfFloatTextures() is now .extensions.get( 'OES_texture_half_float' )."
        ),
        this.extensions.get("OES_texture_half_float")
      );
    },
    supportsStandardDerivatives: function () {
      return (
        console.warn(
          "THREE.WebGLRenderer: .supportsStandardDerivatives() is now .extensions.get( 'OES_standard_derivatives' )."
        ),
        this.extensions.get("OES_standard_derivatives")
      );
    },
    supportsCompressedTextureS3TC: function () {
      return (
        console.warn(
          "THREE.WebGLRenderer: .supportsCompressedTextureS3TC() is now .extensions.get( 'WEBGL_compressed_texture_s3tc' )."
        ),
        this.extensions.get("WEBGL_compressed_texture_s3tc")
      );
    },
    supportsCompressedTexturePVRTC: function () {
      return (
        console.warn(
          "THREE.WebGLRenderer: .supportsCompressedTexturePVRTC() is now .extensions.get( 'WEBGL_compressed_texture_pvrtc' )."
        ),
        this.extensions.get("WEBGL_compressed_texture_pvrtc")
      );
    },
    supportsBlendMinMax: function () {
      return (
        console.warn(
          "THREE.WebGLRenderer: .supportsBlendMinMax() is now .extensions.get( 'EXT_blend_minmax' )."
        ),
        this.extensions.get("EXT_blend_minmax")
      );
    },
    supportsVertexTextures: function () {
      return (
        console.warn(
          "THREE.WebGLRenderer: .supportsVertexTextures() is now .capabilities.vertexTextures."
        ),
        this.capabilities.vertexTextures
      );
    },
    supportsInstancedArrays: function () {
      return (
        console.warn(
          "THREE.WebGLRenderer: .supportsInstancedArrays() is now .extensions.get( 'ANGLE_instanced_arrays' )."
        ),
        this.extensions.get("ANGLE_instanced_arrays")
      );
    },
    enableScissorTest: function (e) {
      console.warn(
        "THREE.WebGLRenderer: .enableScissorTest() is now .setScissorTest()."
      ),
        this.setScissorTest(e);
    },
    initMaterial: function () {
      console.warn("THREE.WebGLRenderer: .initMaterial() has been removed.");
    },
    addPrePlugin: function () {
      console.warn("THREE.WebGLRenderer: .addPrePlugin() has been removed.");
    },
    addPostPlugin: function () {
      console.warn("THREE.WebGLRenderer: .addPostPlugin() has been removed.");
    },
    updateShadowMap: function () {
      console.warn("THREE.WebGLRenderer: .updateShadowMap() has been removed.");
    },
    setFaceCulling: function () {
      console.warn("THREE.WebGLRenderer: .setFaceCulling() has been removed.");
    },
    allocTextureUnit: function () {
      console.warn(
        "THREE.WebGLRenderer: .allocTextureUnit() has been removed."
      );
    },
    setTexture: function () {
      console.warn("THREE.WebGLRenderer: .setTexture() has been removed.");
    },
    setTexture2D: function () {
      console.warn("THREE.WebGLRenderer: .setTexture2D() has been removed.");
    },
    setTextureCube: function () {
      console.warn("THREE.WebGLRenderer: .setTextureCube() has been removed.");
    },
    getActiveMipMapLevel: function () {
      return (
        console.warn(
          "THREE.WebGLRenderer: .getActiveMipMapLevel() is now .getActiveMipmapLevel()."
        ),
        this.getActiveMipmapLevel()
      );
    }
  }),
  Object.defineProperties(WebGLRenderer.prototype, {
    shadowMapEnabled: {
      get: function () {
        return this.shadowMap.enabled;
      },
      set: function (e) {
        console.warn(
          "THREE.WebGLRenderer: .shadowMapEnabled is now .shadowMap.enabled."
        ),
          (this.shadowMap.enabled = e);
      }
    },
    shadowMapType: {
      get: function () {
        return this.shadowMap.type;
      },
      set: function (e) {
        console.warn(
          "THREE.WebGLRenderer: .shadowMapType is now .shadowMap.type."
        ),
          (this.shadowMap.type = e);
      }
    },
    shadowMapCullFace: {
      get: function () {
        console.warn(
          "THREE.WebGLRenderer: .shadowMapCullFace has been removed. Set Material.shadowSide instead."
        );
      },
      set: function () {
        console.warn(
          "THREE.WebGLRenderer: .shadowMapCullFace has been removed. Set Material.shadowSide instead."
        );
      }
    },
    context: {
      get: function () {
        return (
          console.warn(
            "THREE.WebGLRenderer: .context has been removed. Use .getContext() instead."
          ),
          this.getContext()
        );
      }
    },
    vr: {
      get: function () {
        return (
          console.warn("THREE.WebGLRenderer: .vr has been renamed to .xr"),
          this.xr
        );
      }
    },
    gammaInput: {
      get: function () {
        return (
          console.warn(
            "THREE.WebGLRenderer: .gammaInput has been removed. Set the encoding for textures via Texture.encoding instead."
          ),
          !1
        );
      },
      set: function () {
        console.warn(
          "THREE.WebGLRenderer: .gammaInput has been removed. Set the encoding for textures via Texture.encoding instead."
        );
      }
    },
    gammaOutput: {
      get: function () {
        return (
          console.warn(
            "THREE.WebGLRenderer: .gammaOutput has been removed. Set WebGLRenderer.outputEncoding instead."
          ),
          !1
        );
      },
      set: function (e) {
        console.warn(
          "THREE.WebGLRenderer: .gammaOutput has been removed. Set WebGLRenderer.outputEncoding instead."
        ),
          (this.outputEncoding = !0 === e ? sRGBEncoding : LinearEncoding);
      }
    },
    toneMappingWhitePoint: {
      get: function () {
        return (
          console.warn(
            "THREE.WebGLRenderer: .toneMappingWhitePoint has been removed."
          ),
          1
        );
      },
      set: function () {
        console.warn(
          "THREE.WebGLRenderer: .toneMappingWhitePoint has been removed."
        );
      }
    }
  }),
  Object.defineProperties(WebGLShadowMap.prototype, {
    cullFace: {
      get: function () {
        console.warn(
          "THREE.WebGLRenderer: .shadowMap.cullFace has been removed. Set Material.shadowSide instead."
        );
      },
      set: function () {
        console.warn(
          "THREE.WebGLRenderer: .shadowMap.cullFace has been removed. Set Material.shadowSide instead."
        );
      }
    },
    renderReverseSided: {
      get: function () {
        console.warn(
          "THREE.WebGLRenderer: .shadowMap.renderReverseSided has been removed. Set Material.shadowSide instead."
        );
      },
      set: function () {
        console.warn(
          "THREE.WebGLRenderer: .shadowMap.renderReverseSided has been removed. Set Material.shadowSide instead."
        );
      }
    },
    renderSingleSided: {
      get: function () {
        console.warn(
          "THREE.WebGLRenderer: .shadowMap.renderSingleSided has been removed. Set Material.shadowSide instead."
        );
      },
      set: function () {
        console.warn(
          "THREE.WebGLRenderer: .shadowMap.renderSingleSided has been removed. Set Material.shadowSide instead."
        );
      }
    }
  }),
  Object.defineProperties(WebGLRenderTarget.prototype, {
    wrapS: {
      get: function () {
        return (
          console.warn(
            "THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS."
          ),
          this.texture.wrapS
        );
      },
      set: function (e) {
        console.warn("THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS."),
          (this.texture.wrapS = e);
      }
    },
    wrapT: {
      get: function () {
        return (
          console.warn(
            "THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT."
          ),
          this.texture.wrapT
        );
      },
      set: function (e) {
        console.warn("THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT."),
          (this.texture.wrapT = e);
      }
    },
    magFilter: {
      get: function () {
        return (
          console.warn(
            "THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter."
          ),
          this.texture.magFilter
        );
      },
      set: function (e) {
        console.warn(
          "THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter."
        ),
          (this.texture.magFilter = e);
      }
    },
    minFilter: {
      get: function () {
        return (
          console.warn(
            "THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter."
          ),
          this.texture.minFilter
        );
      },
      set: function (e) {
        console.warn(
          "THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter."
        ),
          (this.texture.minFilter = e);
      }
    },
    anisotropy: {
      get: function () {
        return (
          console.warn(
            "THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy."
          ),
          this.texture.anisotropy
        );
      },
      set: function (e) {
        console.warn(
          "THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy."
        ),
          (this.texture.anisotropy = e);
      }
    },
    offset: {
      get: function () {
        return (
          console.warn(
            "THREE.WebGLRenderTarget: .offset is now .texture.offset."
          ),
          this.texture.offset
        );
      },
      set: function (e) {
        console.warn(
          "THREE.WebGLRenderTarget: .offset is now .texture.offset."
        ),
          (this.texture.offset = e);
      }
    },
    repeat: {
      get: function () {
        return (
          console.warn(
            "THREE.WebGLRenderTarget: .repeat is now .texture.repeat."
          ),
          this.texture.repeat
        );
      },
      set: function (e) {
        console.warn(
          "THREE.WebGLRenderTarget: .repeat is now .texture.repeat."
        ),
          (this.texture.repeat = e);
      }
    },
    format: {
      get: function () {
        return (
          console.warn(
            "THREE.WebGLRenderTarget: .format is now .texture.format."
          ),
          this.texture.format
        );
      },
      set: function (e) {
        console.warn(
          "THREE.WebGLRenderTarget: .format is now .texture.format."
        ),
          (this.texture.format = e);
      }
    },
    type: {
      get: function () {
        return (
          console.warn("THREE.WebGLRenderTarget: .type is now .texture.type."),
          this.texture.type
        );
      },
      set: function (e) {
        console.warn("THREE.WebGLRenderTarget: .type is now .texture.type."),
          (this.texture.type = e);
      }
    },
    generateMipmaps: {
      get: function () {
        return (
          console.warn(
            "THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps."
          ),
          this.texture.generateMipmaps
        );
      },
      set: function (e) {
        console.warn(
          "THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps."
        ),
          (this.texture.generateMipmaps = e);
      }
    }
  }),
  Object.defineProperties(Audio.prototype, {
    load: {
      value: function (e) {
        console.warn(
          "THREE.Audio: .load has been deprecated. Use THREE.AudioLoader instead."
        );
        const t = this;
        return (
          new AudioLoader().load(e, function (e) {
            t.setBuffer(e);
          }),
          this
        );
      }
    },
    startTime: {
      set: function () {
        console.warn("THREE.Audio: .startTime is now .play( delay ).");
      }
    }
  }),
  (AudioAnalyser.prototype.getData = function () {
    return (
      console.warn(
        "THREE.AudioAnalyser: .getData() is now .getFrequencyData()."
      ),
      this.getFrequencyData()
    );
  }),
  (CubeCamera.prototype.updateCubeMap = function (e, t) {
    return (
      console.warn("THREE.CubeCamera: .updateCubeMap() is now .update()."),
      this.update(e, t)
    );
  });
const GeometryUtils = {
  merge: function (e, t, n) {
    let r;
    console.warn(
      "THREE.GeometryUtils: .merge() has been moved to Geometry. Use geometry.merge( geometry2, matrix, materialIndexOffset ) instead."
    ),
      t.isMesh &&
        (t.matrixAutoUpdate && t.updateMatrix(),
        (r = t.matrix),
        (t = t.geometry)),
      e.merge(t, r, n);
  },
  center: function (e) {
    return (
      console.warn(
        "THREE.GeometryUtils: .center() has been moved to Geometry. Use geometry.center() instead."
      ),
      e.center()
    );
  }
};
function CanvasRenderer() {
  console.error("THREE.CanvasRenderer has been removed");
}
function JSONLoader() {
  console.error("THREE.JSONLoader has been removed.");
}
(ImageUtils.crossOrigin = void 0),
  (ImageUtils.loadTexture = function (e, t, n, r) {
    console.warn(
      "THREE.ImageUtils.loadTexture has been deprecated. Use THREE.TextureLoader() instead."
    );
    const i = new TextureLoader();
    i.setCrossOrigin(this.crossOrigin);
    const o = i.load(e, n, void 0, r);
    return t && (o.mapping = t), o;
  }),
  (ImageUtils.loadTextureCube = function (e, t, n, r) {
    console.warn(
      "THREE.ImageUtils.loadTextureCube has been deprecated. Use THREE.CubeTextureLoader() instead."
    );
    const i = new CubeTextureLoader();
    i.setCrossOrigin(this.crossOrigin);
    const o = i.load(e, n, void 0, r);
    return t && (o.mapping = t), o;
  }),
  (ImageUtils.loadCompressedTexture = function () {
    console.error(
      "THREE.ImageUtils.loadCompressedTexture has been removed. Use THREE.DDSLoader instead."
    );
  }),
  (ImageUtils.loadCompressedTextureCube = function () {
    console.error(
      "THREE.ImageUtils.loadCompressedTextureCube has been removed. Use THREE.DDSLoader instead."
    );
  });
const SceneUtils = {
  createMultiMaterialObject: function () {
    console.error(
      "THREE.SceneUtils has been moved to /examples/jsm/utils/SceneUtils.js"
    );
  },
  detach: function () {
    console.error(
      "THREE.SceneUtils has been moved to /examples/jsm/utils/SceneUtils.js"
    );
  },
  attach: function () {
    console.error(
      "THREE.SceneUtils has been moved to /examples/jsm/utils/SceneUtils.js"
    );
  }
};
function LensFlare() {
  console.error(
    "THREE.LensFlare has been moved to /examples/jsm/objects/Lensflare.js"
  );
}
"undefined" != typeof __THREE_DEVTOOLS__ &&
  __THREE_DEVTOOLS__.dispatchEvent(
    new CustomEvent("register", { detail: { revision: "121" } })
  );

const CSS3DObject = function (element) {
  Object3D.call(this);

  this.element = element;
  this.element.style.position = "absolute";
  this.element.style.pointerEvents = "auto";

  this.addEventListener("removed", function () {
    this.traverse(function (object) {
      if (
        object.element instanceof Element &&
        object.element.parentNode !== null
      ) {
        object.element.parentNode.removeChild(object.element);
      }
    });
  });

  function epsilon(value) {
    return Math.abs(value) < 1e-10 ? 0 : value;
  }

  this.update = function () {
    this.updateMatrixWorld();

    var elements = this.matrixWorld.elements;
    this._cssMatrix =
      "matrix3d(" +
      epsilon(elements[0]) +
      "," +
      epsilon(elements[1]) +
      "," +
      epsilon(elements[2]) +
      "," +
      epsilon(elements[3]) +
      "," +
      epsilon(-elements[4]) +
      "," +
      epsilon(-elements[5]) +
      "," +
      epsilon(-elements[6]) +
      "," +
      epsilon(-elements[7]) +
      "," +
      epsilon(elements[8]) +
      "," +
      epsilon(elements[9]) +
      "," +
      epsilon(elements[10]) +
      "," +
      epsilon(elements[11]) +
      "," +
      epsilon(elements[12]) +
      "," +
      epsilon(elements[13]) +
      "," +
      epsilon(elements[14]) +
      "," +
      epsilon(elements[15]) +
      ")";
  };
};

CSS3DObject.prototype = Object.create(Object3D.prototype);
CSS3DObject.prototype.constructor = CSS3DObject;

const CSS3DSprite = function (element) {
  CSS3DObject.call(this, element);
};

CSS3DSprite.prototype = Object.create(CSS3DObject.prototype);
CSS3DSprite.prototype.constructor = CSS3DSprite;

const CSS3DRenderer = function (domElement) {
  var _this = this;

  var _width, _height;
  var _widthHalf, _heightHalf;

  this.domElement = domElement;

  var isIE = /Trident/i.test(navigator.userAgent);

  this.getSize = function () {
    return {
      width: _width,
      height: _height
    };
  };

  this.setSize = function (width, height) {
    _width = width;
    _height = height;
    _widthHalf = _width / 2;
    _heightHalf = _height / 2;
  };

  function epsilon(value) {
    return Math.abs(value) < 1e-10 ? 0 : value;
  }

  function getCameraCSSMatrix(matrix) {
    var elements = matrix.elements;

    return (
      "matrix3d(" +
      epsilon(elements[0]) +
      "," +
      epsilon(-elements[1]) +
      "," +
      epsilon(elements[2]) +
      "," +
      epsilon(elements[3]) +
      "," +
      epsilon(elements[4]) +
      "," +
      epsilon(-elements[5]) +
      "," +
      epsilon(elements[6]) +
      "," +
      epsilon(elements[7]) +
      "," +
      epsilon(elements[8]) +
      "," +
      epsilon(-elements[9]) +
      "," +
      epsilon(elements[10]) +
      "," +
      epsilon(elements[11]) +
      "," +
      epsilon(elements[12]) +
      "," +
      epsilon(-elements[13]) +
      "," +
      epsilon(elements[14]) +
      "," +
      epsilon(elements[15]) +
      ")"
    );
  }

  function getObjectCSSMatrix(cssMatrix, cameraCSSMatrix) {
    return (
      "translate(-50%,-50%)" +
      "translate(" +
      _widthHalf +
      "px," +
      _heightHalf +
      "px)" +
      cameraCSSMatrix +
      cssMatrix
    );
  }

  function renderObject(object, scene, camera, cameraCSSMatrix) {
    var style;

    /*
		Billboarding disabled
		if ( object instanceof CSS3DSprite ) {

			// http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

			matrix.copy( camera.matrixWorldInverse );
			matrix.transpose();
			matrix.copyPosition( object.matrixWorld );
			matrix.scale( object.scale );

			matrix.elements[ 3 ] = 0;
			matrix.elements[ 7 ] = 0;
			matrix.elements[ 11 ] = 0;
			matrix.elements[ 15 ] = 1;
			
			style = getObjectCSSMatrix( matrix, cameraCSSMatrix );

		} else {
		*/

    style = getObjectCSSMatrix(object._cssMatrix, cameraCSSMatrix);

    var element = object.element;

    element.style.WebkitTransform = style;
    element.style.transform = style;
    element.style.WebkitTransformStyle = "preserve-3d";
    element.style.transformStyle = "preserve-3d";

    if (isIE) {
      object._distanceToCameraSquared = getDistanceToSquared(camera, object);
    }
  }

  var getDistanceToSquared = (function () {
    var a = new Vector3();
    var b = new Vector3();

    return function (object1, object2) {
      a.setFromMatrixPosition(object1.matrixWorld);
      b.setFromMatrixPosition(object2.matrixWorld);

      return a.distanceToSquared(b);
    };
  })();

  this.render = function (scene, camera) {
    var css = scene._css;

    if (!css) {
      return;
    }

    var fov = camera.projectionMatrix.elements[5] * _heightHalf;

    if (css.cameraFov !== fov) {
      var fovStr = camera.isPerspectiveCamera ? fov + "px" : "";
      domElement.style.WebkitPerspective = fovStr;
      domElement.style.perspective = fovStr;
      css.cameraFov = fov;
    }

    if (scene.autoUpdate === true) scene.updateMatrixWorld();
    if (camera.parent === null) camera.updateMatrixWorld();

    if (camera.isOrthographicCamera) {
      var tx = -(camera.right + camera.left) / 2;
      var ty = (camera.top + camera.bottom) / 2;
    }

    var cameraCSSMatrix = camera.isOrthographicCamera
      ? "scale(" +
        fov +
        ")" +
        "translate(" +
        epsilon(tx) +
        "px," +
        epsilon(ty) +
        "px)" +
        getCameraCSSMatrix(camera.matrixWorldInverse)
      : "translateZ(" +
        fov +
        "px)" +
        getCameraCSSMatrix(camera.matrixWorldInverse);

    for (var i = 0; i < css.nodes.length; i++) {
      var node = css.nodes[i];
      renderObject(node, scene, camera, cameraCSSMatrix);

      if (isIE) {
        var distance = node._distanceToCameraSquared;
        node.element.style.zIndex = 1000 - distance;
      }
    }
  };
};

/**
 * Allows a stack of renderers to be treated as a single renderer.
 *
 * Usage:
 * ```
 * var renderer = new THREE.MultiRenderer({renderers: [THREE.WebGLRenderer, THREE.CSS3DRenderer]})
 * ```
 *
 * @author Gheric Speiginer
 */

const MultiRenderer = function (parameters) {
  this.domElement = parameters.domElement;
  this.w = 0;
  this.h = 0;

  this.renderers = [];
  this._renderSizeSet = false;

  var rendererClasses = parameters.renderers || [];
  var rendererParameters = parameters.parameters || [];

  // elements are stacked back-to-front
  for (var i = 0; i < rendererClasses.length; i++) {
    var renderer = new rendererClasses[i](rendererParameters[i]);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0px";
    renderer.domElement.style.left = "0px";
    this.domElement.appendChild(renderer.domElement);
    this.renderers.push(renderer);
  }
};

MultiRenderer.prototype.setSize = function (w, h) {
  this.w = w;
  this.h = h;
  this.domElement.style.width = w + "px";
  this.domElement.style.height = h + "px";

  for (var i = 0; i < this.renderers.length; i++) {
    var renderer = this.renderers[i];
    var el = renderer.domElement;

    if (!this._renderSizeSet || (el && el.tagName !== "CANVAS")) {
      renderer.setSize(w, h);
    }

    el.style.width = w + "px";
    el.style.height = h + "px";
  }
};

MultiRenderer.prototype.setRenderSize = function (rw, rh) {
  this._renderSizeSet = true;

  for (var i = 0; i < this.renderers.length; i++) {
    var renderer = this.renderers[i];
    var el = renderer.domElement;

    if (el && el.tagName === "CANVAS") {
      renderer.setSize(rw, rh, false);
    }
  }
};

MultiRenderer.prototype.render = function (scene, camera) {
  for (var i = 0; i < this.renderers.length; i++) {
    this.renderers[i].render(scene, camera);
  }
};

export {
  CSS3DObject,
  CSS3DSprite,
  CSS3DRenderer,
  MultiRenderer,
  ACESFilmicToneMapping,
  AddEquation,
  AddOperation,
  AdditiveAnimationBlendMode,
  AdditiveBlending,
  AlphaFormat,
  AlwaysDepth,
  AlwaysStencilFunc,
  AmbientLight,
  AmbientLightProbe,
  AnimationClip,
  AnimationLoader,
  AnimationMixer,
  AnimationObjectGroup,
  AnimationUtils,
  ArcCurve,
  ArrayCamera,
  ArrowHelper,
  Audio,
  AudioAnalyser,
  AudioContext,
  AudioListener,
  AudioLoader,
  AxesHelper,
  AxisHelper,
  BackSide,
  BasicDepthPacking,
  BasicShadowMap,
  BinaryTextureLoader,
  Bone,
  BooleanKeyframeTrack,
  BoundingBoxHelper,
  Box2,
  Box3,
  Box3Helper,
  BoxBufferGeometry,
  BoxGeometry,
  BoxHelper,
  BufferAttribute,
  BufferGeometry,
  BufferGeometryLoader,
  ByteType,
  Cache,
  Camera,
  CameraHelper,
  CanvasRenderer,
  CanvasTexture,
  CatmullRomCurve3,
  CineonToneMapping,
  CircleBufferGeometry,
  CircleGeometry,
  ClampToEdgeWrapping,
  Clock,
  ClosedSplineCurve3,
  Color,
  ColorKeyframeTrack,
  CompressedTexture,
  CompressedTextureLoader,
  ConeBufferGeometry,
  ConeGeometry,
  CubeCamera,
  BoxGeometry as CubeGeometry,
  CubeReflectionMapping,
  CubeRefractionMapping,
  CubeTexture,
  CubeTextureLoader,
  CubeUVReflectionMapping,
  CubeUVRefractionMapping,
  CubicBezierCurve,
  CubicBezierCurve3,
  CubicInterpolant,
  CullFaceBack,
  CullFaceFront,
  CullFaceFrontBack,
  CullFaceNone,
  Curve,
  CurvePath,
  CustomBlending,
  CustomToneMapping,
  CylinderBufferGeometry,
  CylinderGeometry,
  Cylindrical,
  DataTexture,
  DataTexture2DArray,
  DataTexture3D,
  DataTextureLoader,
  DecrementStencilOp,
  DecrementWrapStencilOp,
  DefaultLoadingManager,
  DepthFormat,
  DepthStencilFormat,
  DepthTexture,
  DirectionalLight,
  DirectionalLightHelper,
  DiscreteInterpolant,
  DodecahedronBufferGeometry,
  DodecahedronGeometry,
  DoubleSide,
  DstAlphaFactor,
  DstColorFactor,
  DynamicBufferAttribute,
  DynamicCopyUsage,
  DynamicDrawUsage,
  DynamicReadUsage,
  EdgesGeometry,
  EdgesHelper,
  EllipseCurve,
  EqualDepth,
  EqualStencilFunc,
  EquirectangularReflectionMapping,
  EquirectangularRefractionMapping,
  Euler,
  EventDispatcher,
  ExtrudeBufferGeometry,
  ExtrudeGeometry,
  Face3,
  Face4,
  FaceColors,
  FileLoader,
  FlatShading,
  Float32Attribute,
  Float32BufferAttribute,
  Float64Attribute,
  Float64BufferAttribute,
  FloatType,
  Fog,
  FogExp2,
  Font,
  FontLoader,
  FrontSide,
  Frustum,
  GLBufferAttribute,
  GLSL1,
  GLSL3,
  GammaEncoding,
  Geometry,
  GeometryUtils,
  GreaterDepth,
  GreaterEqualDepth,
  GreaterEqualStencilFunc,
  GreaterStencilFunc,
  GridHelper,
  Group,
  HalfFloatType,
  HemisphereLight,
  HemisphereLightHelper,
  HemisphereLightProbe,
  IcosahedronBufferGeometry,
  IcosahedronGeometry,
  ImageBitmapLoader,
  ImageLoader,
  ImageUtils,
  ImmediateRenderObject,
  IncrementStencilOp,
  IncrementWrapStencilOp,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  InstancedInterleavedBuffer,
  InstancedMesh,
  Int16Attribute,
  Int16BufferAttribute,
  Int32Attribute,
  Int32BufferAttribute,
  Int8Attribute,
  Int8BufferAttribute,
  IntType,
  InterleavedBuffer,
  InterleavedBufferAttribute,
  Interpolant,
  InterpolateDiscrete,
  InterpolateLinear,
  InterpolateSmooth,
  InvertStencilOp,
  JSONLoader,
  KeepStencilOp,
  KeyframeTrack,
  LOD,
  LatheBufferGeometry,
  LatheGeometry,
  Layers,
  LensFlare,
  LessDepth,
  LessEqualDepth,
  LessEqualStencilFunc,
  LessStencilFunc,
  Light,
  LightProbe,
  Line,
  Line3,
  LineBasicMaterial,
  LineCurve,
  LineCurve3,
  LineDashedMaterial,
  LineLoop,
  LinePieces,
  LineSegments,
  LineStrip,
  LinearEncoding,
  LinearFilter,
  LinearInterpolant,
  LinearMipMapLinearFilter,
  LinearMipMapNearestFilter,
  LinearMipmapLinearFilter,
  LinearMipmapNearestFilter,
  LinearToneMapping,
  Loader,
  LoaderUtils,
  LoadingManager,
  LogLuvEncoding,
  LoopOnce,
  LoopPingPong,
  LoopRepeat,
  LuminanceAlphaFormat,
  LuminanceFormat,
  MOUSE,
  Material,
  MaterialLoader,
  MathUtils as Math,
  MathUtils,
  Matrix3,
  Matrix4,
  MaxEquation,
  Mesh,
  MeshBasicMaterial,
  MeshDepthMaterial,
  MeshDistanceMaterial,
  MeshFaceMaterial,
  MeshLambertMaterial,
  MeshMatcapMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  MinEquation,
  MirroredRepeatWrapping,
  MixOperation,
  MultiMaterial,
  MultiplyBlending,
  MultiplyOperation,
  NearestFilter,
  NearestMipMapLinearFilter,
  NearestMipMapNearestFilter,
  NearestMipmapLinearFilter,
  NearestMipmapNearestFilter,
  NeverDepth,
  NeverStencilFunc,
  NoBlending,
  NoColors,
  NoToneMapping,
  NormalAnimationBlendMode,
  NormalBlending,
  NotEqualDepth,
  NotEqualStencilFunc,
  NumberKeyframeTrack,
  Object3D,
  ObjectLoader,
  ObjectSpaceNormalMap,
  OctahedronBufferGeometry,
  OctahedronGeometry,
  OneFactor,
  OneMinusDstAlphaFactor,
  OneMinusDstColorFactor,
  OneMinusSrcAlphaFactor,
  OneMinusSrcColorFactor,
  OrthographicCamera,
  PCFShadowMap,
  PCFSoftShadowMap,
  PMREMGenerator,
  ParametricBufferGeometry,
  ParametricGeometry,
  Particle,
  ParticleBasicMaterial,
  ParticleSystem,
  ParticleSystemMaterial,
  Path,
  PerspectiveCamera,
  Plane,
  PlaneBufferGeometry,
  PlaneGeometry,
  PlaneHelper,
  PointCloud,
  PointCloudMaterial,
  PointLight,
  PointLightHelper,
  Points,
  PointsMaterial,
  PolarGridHelper,
  PolyhedronBufferGeometry,
  PolyhedronGeometry,
  PositionalAudio,
  PropertyBinding,
  PropertyMixer,
  QuadraticBezierCurve,
  QuadraticBezierCurve3,
  Quaternion,
  QuaternionKeyframeTrack,
  QuaternionLinearInterpolant,
  REVISION,
  RGBADepthPacking,
  RGBAFormat,
  RGBAIntegerFormat,
  RGBA_ASTC_10x10_Format,
  RGBA_ASTC_10x5_Format,
  RGBA_ASTC_10x6_Format,
  RGBA_ASTC_10x8_Format,
  RGBA_ASTC_12x10_Format,
  RGBA_ASTC_12x12_Format,
  RGBA_ASTC_4x4_Format,
  RGBA_ASTC_5x4_Format,
  RGBA_ASTC_5x5_Format,
  RGBA_ASTC_6x5_Format,
  RGBA_ASTC_6x6_Format,
  RGBA_ASTC_8x5_Format,
  RGBA_ASTC_8x6_Format,
  RGBA_ASTC_8x8_Format,
  RGBA_BPTC_Format,
  RGBA_ETC2_EAC_Format,
  RGBA_PVRTC_2BPPV1_Format,
  RGBA_PVRTC_4BPPV1_Format,
  RGBA_S3TC_DXT1_Format,
  RGBA_S3TC_DXT3_Format,
  RGBA_S3TC_DXT5_Format,
  RGBDEncoding,
  RGBEEncoding,
  RGBEFormat,
  RGBFormat,
  RGBIntegerFormat,
  RGBM16Encoding,
  RGBM7Encoding,
  RGB_ETC1_Format,
  RGB_ETC2_Format,
  RGB_PVRTC_2BPPV1_Format,
  RGB_PVRTC_4BPPV1_Format,
  RGB_S3TC_DXT1_Format,
  RGFormat,
  RGIntegerFormat,
  RawShaderMaterial,
  Ray,
  Raycaster,
  RectAreaLight,
  RedFormat,
  RedIntegerFormat,
  ReinhardToneMapping,
  RepeatWrapping,
  ReplaceStencilOp,
  ReverseSubtractEquation,
  RingBufferGeometry,
  RingGeometry,
  SRGB8_ALPHA8_ASTC_10x10_Format,
  SRGB8_ALPHA8_ASTC_10x5_Format,
  SRGB8_ALPHA8_ASTC_10x6_Format,
  SRGB8_ALPHA8_ASTC_10x8_Format,
  SRGB8_ALPHA8_ASTC_12x10_Format,
  SRGB8_ALPHA8_ASTC_12x12_Format,
  SRGB8_ALPHA8_ASTC_4x4_Format,
  SRGB8_ALPHA8_ASTC_5x4_Format,
  SRGB8_ALPHA8_ASTC_5x5_Format,
  SRGB8_ALPHA8_ASTC_6x5_Format,
  SRGB8_ALPHA8_ASTC_6x6_Format,
  SRGB8_ALPHA8_ASTC_8x5_Format,
  SRGB8_ALPHA8_ASTC_8x6_Format,
  SRGB8_ALPHA8_ASTC_8x8_Format,
  Scene,
  SceneUtils,
  ShaderChunk,
  ShaderLib,
  ShaderMaterial,
  ShadowMaterial,
  Shape,
  ShapeBufferGeometry,
  ShapeGeometry,
  ShapePath,
  ShapeUtils,
  ShortType,
  Skeleton,
  SkeletonHelper,
  SkinnedMesh,
  SmoothShading,
  Sphere,
  SphereBufferGeometry,
  SphereGeometry,
  Spherical,
  SphericalHarmonics3,
  Spline,
  SplineCurve,
  SplineCurve3,
  SpotLight,
  SpotLightHelper,
  Sprite,
  SpriteMaterial,
  SrcAlphaFactor,
  SrcAlphaSaturateFactor,
  SrcColorFactor,
  StaticCopyUsage,
  StaticDrawUsage,
  StaticReadUsage,
  StereoCamera,
  StreamCopyUsage,
  StreamDrawUsage,
  StreamReadUsage,
  StringKeyframeTrack,
  SubtractEquation,
  SubtractiveBlending,
  TOUCH,
  TangentSpaceNormalMap,
  TetrahedronBufferGeometry,
  TetrahedronGeometry,
  TextBufferGeometry,
  TextGeometry,
  Texture,
  TextureLoader,
  TorusBufferGeometry,
  TorusGeometry,
  TorusKnotBufferGeometry,
  TorusKnotGeometry,
  Triangle,
  TriangleFanDrawMode,
  TriangleStripDrawMode,
  TrianglesDrawMode,
  TubeBufferGeometry,
  TubeGeometry,
  UVMapping,
  Uint16Attribute,
  Uint16BufferAttribute,
  Uint32Attribute,
  Uint32BufferAttribute,
  Uint8Attribute,
  Uint8BufferAttribute,
  Uint8ClampedAttribute,
  Uint8ClampedBufferAttribute,
  Uniform,
  UniformsLib,
  UniformsUtils,
  UnsignedByteType,
  UnsignedInt248Type,
  UnsignedIntType,
  UnsignedShort4444Type,
  UnsignedShort5551Type,
  UnsignedShort565Type,
  UnsignedShortType,
  VSMShadowMap,
  Vector2,
  Vector3,
  Vector4,
  VectorKeyframeTrack,
  Vertex,
  VertexColors,
  VideoTexture,
  WebGL1Renderer,
  WebGLCubeRenderTarget,
  WebGLMultisampleRenderTarget,
  WebGLRenderTarget,
  WebGLRenderTargetCube,
  WebGLRenderer,
  WebGLUtils,
  WireframeGeometry,
  WireframeHelper,
  WrapAroundEnding,
  XHRLoader,
  ZeroCurvatureEnding,
  ZeroFactor,
  ZeroSlopeEnding,
  ZeroStencilOp,
  sRGBEncoding
};
