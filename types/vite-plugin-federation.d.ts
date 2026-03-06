/**
 * Corrected type definitions for @originjs/vite-plugin-federation.
 *
 * The shipped definitions have `singleton` and `strictVersion` commented
 * out in SharedConfig. This file provides the full interface and is
 * referenced via tsconfig `paths` so TypeScript uses it for type-checking
 * while the bundler still resolves the real package at runtime.
 */
import type { Plugin } from "vite";

export interface SharedConfig {
  import?: boolean;
  packagePath?: string;
  requiredVersion?: string | false;
  shareScope?: string;
  version?: string | false;
  generate?: boolean;
  modulePreload?: boolean;
  singleton?: boolean;
  strictVersion?: boolean;
}

export interface ExposesConfig {
  import: string;
  name?: string;
  dontAppendStylesToHead?: boolean;
}

export interface RemotesConfig {
  external: string;
  externalType?: "url" | "promise";
  shareScope?: string;
  format?: "esm" | "systemjs" | "var";
  from?: "vite" | "webpack";
}

export interface VitePluginFederationOptions {
  name?: string;
  filename?: string;
  transformFileTypes?: string[];
  exposes?: Record<string, string | string[] | ExposesConfig>;
  remotes?: Record<string, string | RemotesConfig | string[] | Promise<unknown>>;
  shared?: Record<string, string | SharedConfig> | (string | Record<string, string | SharedConfig>)[];
  shareScope?: string;
  mode?: string;
  remoteType?: string;
}

declare function federation(options: VitePluginFederationOptions): Plugin;
export default federation;
