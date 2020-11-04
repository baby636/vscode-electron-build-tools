/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface EVMConfig {
  /**
   * Default build target
   */
  defaultTarget?:
    | "breakpad"
    | "chromedriver"
    | "electron"
    | "electron:dist"
    | "mksnapshot"
    | "node:headers";
  /**
   * Goma mode to use
   */
  goma: "cache-only" | "cluster" | "none";
  /**
   * Path of the top directory. Home of the .gclient file
   */
  root: string;
  /**
   * Remotes for Git checkouts
   */
  remotes: {
    /**
     * Remotes for the Electron repo
     */
    electron: {
      /**
       * Fork remote
       */
      fork?: string;
      /**
       * Origin remote
       */
      origin: string;
      [k: string]: unknown;
    };
    /**
     * Remotes for the Node repo
     */
    node: {
      /**
       * Origin remote
       */
      origin?: string;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  /**
   * Configuration for GN
   */
  gen: {
    /**
     * Extra arguments for GN
     */
    args: string[];
    /**
     * Output directory
     */
    out: string;
    [k: string]: unknown;
  };
  /**
   * Environment variables set when building Electron
   */
  env: {
    /**
     * Path to use as git cache for gclient
     */
    GIT_CACHE_PATH?: string;
    /**
     * Path of Chromium buildtools in the checkout
     */
    CHROMIUM_BUILDTOOLS_PATH: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

export interface ElectronPatchesConfig {
  /**
   * Maps patch directory to source tree directory
   *
   * This interface was referenced by `JSONSchemaForElectronPatchesConfigJson`'s JSON-Schema definition
   * via the `patternProperty` "^src/electron/".
   */
  [k: string]: string;
}

export namespace ExtensionConfig {
  /**
   * When building, show a list of build targets to choose from.
   */
  export type ShowTargets = boolean;

  export interface ElectronBuildTools {
    "electronBuildTools.build.showTargets"?: ShowTargets;
    /**
     * Default target to build. Leave blank to use the config default.
     */
    "electronBuildTools.build.defaultTarget"?:
      | "----"
      | "breakpad"
      | "chromedriver"
      | "electron"
      | "electron:dist"
      | "mksnapshot"
      | "node:headers";
    "electronBuildTools.build.ninjaArgs"?: NinjaArgs;
    "electronBuildTools.build.buildOptions"?: BuildOptions;
    [k: string]: unknown;
  }
  /**
   * Args to pass to Ninja when building.
   */
  export interface NinjaArgs {
    [k: string]: string;
  }
  /**
   * Options to use when building.
   */
  export interface BuildOptions {
    /**
     * Build without goma.
     */
    "--no-goma"?: "";
    /**
     * Force a re-run of `gn gen` before building.
     */
    "--gen"?: "";
    /**
     * Forces a specific ninja target.
     */
    "--target"?: string;
    [k: string]: unknown;
  }
}
