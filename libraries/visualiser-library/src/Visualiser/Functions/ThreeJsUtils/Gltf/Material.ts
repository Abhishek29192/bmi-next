import {
  Color,
  Material,
  MeshStandardMaterial,
  MeshStandardMaterialParameters,
  Shader
} from "three";

/**
 * A sub class of StandardMaterial with some of the functionality
 * changed via the `onBeforeCompile` callback
 * @pailhead
 */
export class GLTFMeshStandardSGMaterial extends MeshStandardMaterial {
  isGLTFSpecularGlossinessMaterial: boolean;
  private _extraUniforms: {
    specular: { value: Color };
    glossiness: { value: number };
    specularMap: { value: null };
    glossinessMap: { value: null };
  };

  specular = {
    get: () => {
      return this._extraUniforms.specular.value;
    },
    set: (v: Color) => {
      this._extraUniforms.specular.value = v;
    }
  };

  specularMap = {
    get: () => {
      return this._extraUniforms.specularMap.value;
    },
    set: (v: null) => {
      this._extraUniforms.specularMap.value = v;

      if (v) {
        this.defines.USE_SPECULARMAP = ""; // USE_UV is set by the renderer for specular maps
      } else {
        delete this.defines.USE_SPECULARMAP;
      }
    }
  };

  glossiness = {
    get: () => {
      return this._extraUniforms.glossiness.value;
    },
    set: (v: number) => {
      this._extraUniforms.glossiness.value = v;
    }
  };

  glossinessMap = {
    get: () => {
      return this._extraUniforms.glossinessMap.value;
    },
    set: (v: null) => {
      this._extraUniforms.glossinessMap.value = v;

      if (v) {
        this.defines.USE_GLOSSINESSMAP = "";
        this.defines.USE_UV = "";
      } else {
        delete this.defines.USE_GLOSSINESSMAP;
        delete this.defines.USE_UV;
      }
    }
  };

  readonly metalness = -1;
  readonly roughness = -1;
  readonly metalnessMap = null;
  readonly roughnessMap = null;

  constructor(params?: MeshStandardMaterialParameters) {
    super(params);
    this.isGLTFSpecularGlossinessMaterial = true;

    const uniforms = {
      specular: { value: new Color().setHex(0xffffff) },
      glossiness: { value: 1 },
      specularMap: { value: null },
      glossinessMap: { value: null }
    };

    this._extraUniforms = uniforms;

    params && this.setValues(params);
  }

  onBeforeCompile = (shader: Shader) => {
    Object.entries(this._extraUniforms).forEach(([key, value]) => {
      shader.uniforms[key] = value;
    });

    //constious chunks that need replacing
    const specularMapParsFragmentChunk = [
      "#ifdef USE_SPECULARMAP",
      "	uniform sampler2D specularMap;",
      "#endif"
    ].join("\n");

    const glossinessMapParsFragmentChunk = [
      "#ifdef USE_GLOSSINESSMAP",
      "	uniform sampler2D glossinessMap;",
      "#endif"
    ].join("\n");

    const specularMapFragmentChunk = [
      "vec3 specularFactor = specular;",
      "#ifdef USE_SPECULARMAP",
      "	vec4 texelSpecular = texture2D( specularMap, vUv );",
      "	texelSpecular = sRGBToLinear( texelSpecular );",
      "	// reads channel RGB, compatible with a glTF Specular-Glossiness (RGBA) texture",
      "	specularFactor *= texelSpecular.rgb;",
      "#endif"
    ].join("\n");

    const glossinessMapFragmentChunk = [
      "float glossinessFactor = glossiness;",
      "#ifdef USE_GLOSSINESSMAP",
      "	vec4 texelGlossiness = texture2D( glossinessMap, vUv );",
      "	// reads channel A, compatible with a glTF Specular-Glossiness (RGBA) texture",
      "	glossinessFactor *= texelGlossiness.a;",
      "#endif"
    ].join("\n");

    const lightPhysicalFragmentChunk = [
      "PhysicalMaterial material;",
      "material.diffuseColor = diffuseColor.rgb * ( 1. - max( specularFactor.r, max( specularFactor.g, specularFactor.b ) ) );",
      "vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );",
      "float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );",
      "material.specularRoughness = max( 1.0 - glossinessFactor, 0.0525 ); // 0.0525 corresponds to the base mip of a 256 cubemap.",
      "material.specularRoughness += geometryRoughness;",
      "material.specularRoughness = min( material.specularRoughness, 1.0 );",
      "material.specularColor = specularFactor;"
    ].join("\n");

    shader.fragmentShader = shader.fragmentShader
      .replace("uniform float roughness;", "uniform vec3 specular;")
      .replace("uniform float metalness;", "uniform float glossiness;")
      .replace(
        "#include <roughnessmap_pars_fragment>",
        specularMapParsFragmentChunk
      )
      .replace(
        "#include <metalnessmap_pars_fragment>",
        glossinessMapParsFragmentChunk
      )
      .replace("#include <roughnessmap_fragment>", specularMapFragmentChunk)
      .replace("#include <metalnessmap_fragment>", glossinessMapFragmentChunk)
      .replace(
        "#include <lights_physical_fragment>",
        lightPhysicalFragmentChunk
      );
  };

  copy(source: GLTFMeshStandardSGMaterial): this {
    super.copy.call(this, source);
    this.specularMap = source.specularMap;
    this.specular = source.specular;
    this.glossinessMap = source.glossinessMap;
    this.glossiness = source.glossiness;
    return this;
  }
}
