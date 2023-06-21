// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path3, { resolve as resolve3 } from "path";

// utils/plugins/make-manifest.ts
import * as fs from "fs";
import * as path from "path";

// utils/log.ts
function colorLog(message, type) {
  let color = type || COLORS.FgBlack;
  switch (type) {
    case "success":
      color = COLORS.FgGreen;
      break;
    case "info":
      color = COLORS.FgBlue;
      break;
    case "error":
      color = COLORS.FgRed;
      break;
    case "warning":
      color = COLORS.FgYellow;
      break;
  }
  console.log(color, message);
}
var COLORS = {
  Reset: "\x1B[0m",
  Bright: "\x1B[1m",
  Dim: "\x1B[2m",
  Underscore: "\x1B[4m",
  Blink: "\x1B[5m",
  Reverse: "\x1B[7m",
  Hidden: "\x1B[8m",
  FgBlack: "\x1B[30m",
  FgRed: "\x1B[31m",
  FgGreen: "\x1B[32m",
  FgYellow: "\x1B[33m",
  FgBlue: "\x1B[34m",
  FgMagenta: "\x1B[35m",
  FgCyan: "\x1B[36m",
  FgWhite: "\x1B[37m",
  BgBlack: "\x1B[40m",
  BgRed: "\x1B[41m",
  BgGreen: "\x1B[42m",
  BgYellow: "\x1B[43m",
  BgBlue: "\x1B[44m",
  BgMagenta: "\x1B[45m",
  BgCyan: "\x1B[46m",
  BgWhite: "\x1B[47m"
};

// utils/manifest-parser/index.ts
var ManifestParser = class {
  constructor() {
  }
  static convertManifestToString(manifest2) {
    return JSON.stringify(manifest2, null, 2);
  }
};
var manifest_parser_default = ManifestParser;

// utils/plugins/make-manifest.ts
var __vite_injected_original_dirname = "C:\\Users\\Luke\\Desktop\\coding\\semantic_search_extension\\utils\\plugins";
var { resolve } = path;
var distDir = resolve(__vite_injected_original_dirname, "..", "..", "dist");
var publicDir = resolve(__vite_injected_original_dirname, "..", "..", "public");
function makeManifest(manifest2, config) {
  function makeManifest2(to) {
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to);
    }
    const manifestPath = resolve(to, "manifest.json");
    if (config.contentScriptCssKey) {
      manifest2.content_scripts.forEach((script) => {
        script.css = script.css.map(
          (css) => css.replace("<KEY>", config.contentScriptCssKey)
        );
      });
    }
    fs.writeFileSync(
      manifestPath,
      manifest_parser_default.convertManifestToString(manifest2)
    );
    colorLog(`Manifest file copy complete: ${manifestPath}`, "success");
  }
  return {
    name: "make-manifest",
    buildStart() {
      if (config.isDev) {
        makeManifest2(distDir);
      }
    },
    buildEnd() {
      if (config.isDev) {
        return;
      }
      makeManifest2(publicDir);
    }
  };
}

// utils/plugins/custom-dynamic-import.ts
function customDynamicImport() {
  return {
    name: "custom-dynamic-import",
    renderDynamicImport() {
      return {
        left: `
        {
          const dynamicImport = (path) => import(path);
          dynamicImport(
          `,
        right: ")}"
      };
    }
  };
}

// utils/plugins/add-hmr.ts
import * as path2 from "path";
import { readFileSync } from "fs";
var __vite_injected_original_dirname2 = "C:\\Users\\Luke\\Desktop\\coding\\semantic_search_extension\\utils\\plugins";
var isDev = process.env.__DEV__ === "true";
var DUMMY_CODE = `export default function(){};`;
function getInjectionCode(fileName) {
  return readFileSync(
    path2.resolve(__vite_injected_original_dirname2, "..", "reload", "injections", fileName),
    { encoding: "utf8" }
  );
}
function addHmr(config) {
  const { background = false, view = true } = config || {};
  const idInBackgroundScript = "virtual:reload-on-update-in-background-script";
  const idInView = "virtual:reload-on-update-in-view";
  const scriptHmrCode = isDev ? getInjectionCode("script.js") : DUMMY_CODE;
  const viewHmrCode = isDev ? getInjectionCode("view.js") : DUMMY_CODE;
  return {
    name: "add-hmr",
    resolveId(id) {
      if (id === idInBackgroundScript || id === idInView) {
        return getResolvedId(id);
      }
    },
    load(id) {
      if (id === getResolvedId(idInBackgroundScript)) {
        return background ? scriptHmrCode : DUMMY_CODE;
      }
      if (id === getResolvedId(idInView)) {
        return view ? viewHmrCode : DUMMY_CODE;
      }
    }
  };
}
function getResolvedId(id) {
  return "\0" + id;
}

// package.json
var package_default = {
  name: "semantic-search",
  version: "1.2.0",
  description: "Search webpages or entered text for the answers you need.",
  license: "MIT",
  repository: {
    type: "git",
    url: "https://github.com/LukeSutor/semantic-search-extension"
  },
  scripts: {
    build: "tsc --noEmit && vite build",
    "build:watch": "cross-env __DEV__=true vite build --watch",
    "build:hmr": "rollup --config utils/reload/rollup.config.ts",
    wss: "node utils/reload/initReloadServer.js",
    dev: "npm run build:hmr && (run-p wss build:watch)",
    test: "jest"
  },
  type: "module",
  dependencies: {
    axios: "^1.4.0",
    react: "18.2.0",
    "react-dom": "18.2.0"
  },
  devDependencies: {
    "@rollup/plugin-typescript": "^8.5.0",
    "@testing-library/react": "13.4.0",
    "@types/chrome": "0.0.224",
    "@types/jest": "29.0.3",
    "@types/node": "18.15.11",
    "@types/react": "18.0.21",
    "@types/react-dom": "18.2.4",
    "@types/ws": "^8.5.4",
    "@typescript-eslint/eslint-plugin": "5.56.0",
    "@typescript-eslint/parser": "5.38.1",
    "@vitejs/plugin-react": "2.2.0",
    chokidar: "^3.5.3",
    "cross-env": "^7.0.3",
    eslint: "8.36.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-prettier": "4.2.1",
    "eslint-plugin-react": "7.32.2",
    "fs-extra": "11.1.0",
    jest: "29.0.3",
    "jest-environment-jsdom": "29.5.0",
    "npm-run-all": "^4.1.5",
    prettier: "2.8.8",
    rollup: "2.79.1",
    sass: "1.62.1",
    "ts-jest": "29.0.2",
    "ts-loader": "9.4.2",
    typescript: "4.8.3",
    vite: "3.1.3",
    ws: "8.13.0"
  }
};

// manifest.ts
var manifest = {
  manifest_version: 3,
  name: "Semantic Search",
  version: package_default.version,
  description: package_default.description,
  options_page: "src/pages/options/index.html",
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module"
  },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "icon-34.png"
  },
  icons: {
    "128": "icon-128.png"
  },
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["src/pages/content/index.js"],
      css: ["assets/css/contentStyle<KEY>.chunk.css"]
    }
  ],
  web_accessible_resources: [
    {
      resources: [
        "assets/js/*.js",
        "assets/css/*.css",
        "icon-128.png",
        "icon-34.png"
      ],
      matches: ["*://*/*"]
    }
  ]
};
var manifest_default = manifest;

// vite.config.ts
var __vite_injected_original_dirname3 = "C:\\Users\\Luke\\Desktop\\coding\\semantic_search_extension";
var root = resolve3(__vite_injected_original_dirname3, "src");
var pagesDir = resolve3(root, "pages");
var assetsDir = resolve3(root, "assets");
var outDir = resolve3(__vite_injected_original_dirname3, "dist");
var publicDir2 = resolve3(__vite_injected_original_dirname3, "public");
var isDev2 = process.env.__DEV__ === "true";
var isProduction = !isDev2;
var enableHmrInBackgroundScript = true;
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@src": root,
      "@assets": assetsDir,
      "@pages": pagesDir
    }
  },
  plugins: [
    react(),
    makeManifest(manifest_default, {
      isDev: isDev2,
      contentScriptCssKey: regenerateCacheInvalidationKey()
    }),
    customDynamicImport(),
    addHmr({ background: enableHmrInBackgroundScript, view: true })
  ],
  publicDir: publicDir2,
  build: {
    outDir,
    minify: isProduction,
    reportCompressedSize: isProduction,
    rollupOptions: {
      input: {
        devtools: resolve3(pagesDir, "devtools", "index.html"),
        panel: resolve3(pagesDir, "panel", "index.html"),
        content: resolve3(pagesDir, "content", "index.ts"),
        background: resolve3(pagesDir, "background", "index.ts"),
        contentStyle: resolve3(pagesDir, "content", "style.scss"),
        popup: resolve3(pagesDir, "popup", "index.html"),
        newtab: resolve3(pagesDir, "newtab", "index.html"),
        options: resolve3(pagesDir, "options", "index.html")
      },
      watch: {
        include: ["src/**", "vite.config.ts"],
        exclude: ["node_modules/**", "src/**/*.spec.ts"]
      },
      output: {
        entryFileNames: "src/pages/[name]/index.js",
        chunkFileNames: isDev2 ? "assets/js/[name].js" : "assets/js/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          const { dir, name: _name } = path3.parse(assetInfo.name);
          const assetFolder = dir.split("/").at(-1);
          const name = assetFolder + firstUpperCase(_name);
          if (name === "contentStyle") {
            return `assets/css/contentStyle${cacheInvalidationKey}.chunk.css`;
          }
          return `assets/[ext]/${name}.chunk.[ext]`;
        }
      }
    }
  }
});
function firstUpperCase(str) {
  const firstAlphabet = new RegExp(/( |^)[a-z]/, "g");
  return str.toLowerCase().replace(firstAlphabet, (L) => L.toUpperCase());
}
var cacheInvalidationKey = generateKey();
function regenerateCacheInvalidationKey() {
  cacheInvalidationKey = generateKey();
  return cacheInvalidationKey;
}
function generateKey() {
  return `${(Date.now() / 100).toFixed()}`;
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidXRpbHMvcGx1Z2lucy9tYWtlLW1hbmlmZXN0LnRzIiwgInV0aWxzL2xvZy50cyIsICJ1dGlscy9tYW5pZmVzdC1wYXJzZXIvaW5kZXgudHMiLCAidXRpbHMvcGx1Z2lucy9jdXN0b20tZHluYW1pYy1pbXBvcnQudHMiLCAidXRpbHMvcGx1Z2lucy9hZGQtaG1yLnRzIiwgIm1hbmlmZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcTHVrZVxcXFxEZXNrdG9wXFxcXGNvZGluZ1xcXFxzZW1hbnRpY19zZWFyY2hfZXh0ZW5zaW9uXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMdWtlXFxcXERlc2t0b3BcXFxcY29kaW5nXFxcXHNlbWFudGljX3NlYXJjaF9leHRlbnNpb25cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0x1a2UvRGVza3RvcC9jb2Rpbmcvc2VtYW50aWNfc2VhcmNoX2V4dGVuc2lvbi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcclxuaW1wb3J0IHBhdGgsIHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCBtYWtlTWFuaWZlc3QgZnJvbSBcIi4vdXRpbHMvcGx1Z2lucy9tYWtlLW1hbmlmZXN0XCI7XHJcbmltcG9ydCBjdXN0b21EeW5hbWljSW1wb3J0IGZyb20gXCIuL3V0aWxzL3BsdWdpbnMvY3VzdG9tLWR5bmFtaWMtaW1wb3J0XCI7XHJcbmltcG9ydCBhZGRIbXIgZnJvbSBcIi4vdXRpbHMvcGx1Z2lucy9hZGQtaG1yXCI7XHJcbmltcG9ydCBtYW5pZmVzdCBmcm9tIFwiLi9tYW5pZmVzdFwiO1xyXG5cclxuY29uc3Qgcm9vdCA9IHJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKTtcclxuY29uc3QgcGFnZXNEaXIgPSByZXNvbHZlKHJvb3QsIFwicGFnZXNcIik7XHJcbmNvbnN0IGFzc2V0c0RpciA9IHJlc29sdmUocm9vdCwgXCJhc3NldHNcIik7XHJcbmNvbnN0IG91dERpciA9IHJlc29sdmUoX19kaXJuYW1lLCBcImRpc3RcIik7XHJcbmNvbnN0IHB1YmxpY0RpciA9IHJlc29sdmUoX19kaXJuYW1lLCBcInB1YmxpY1wiKTtcclxuXHJcbmNvbnN0IGlzRGV2ID0gcHJvY2Vzcy5lbnYuX19ERVZfXyA9PT0gXCJ0cnVlXCI7XHJcbmNvbnN0IGlzUHJvZHVjdGlvbiA9ICFpc0RldjtcclxuXHJcbi8vIEVOQUJMRSBITVIgSU4gQkFDS0dST1VORCBTQ1JJUFRcclxuY29uc3QgZW5hYmxlSG1ySW5CYWNrZ3JvdW5kU2NyaXB0ID0gdHJ1ZTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAc3JjXCI6IHJvb3QsXHJcbiAgICAgIFwiQGFzc2V0c1wiOiBhc3NldHNEaXIsXHJcbiAgICAgIFwiQHBhZ2VzXCI6IHBhZ2VzRGlyLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICBtYWtlTWFuaWZlc3QobWFuaWZlc3QsIHtcclxuICAgICAgaXNEZXYsXHJcbiAgICAgIGNvbnRlbnRTY3JpcHRDc3NLZXk6IHJlZ2VuZXJhdGVDYWNoZUludmFsaWRhdGlvbktleSgpLFxyXG4gICAgfSksXHJcbiAgICBjdXN0b21EeW5hbWljSW1wb3J0KCksXHJcbiAgICBhZGRIbXIoeyBiYWNrZ3JvdW5kOiBlbmFibGVIbXJJbkJhY2tncm91bmRTY3JpcHQsIHZpZXc6IHRydWUgfSksXHJcbiAgXSxcclxuICBwdWJsaWNEaXIsXHJcbiAgYnVpbGQ6IHtcclxuICAgIG91dERpcixcclxuICAgIC8qKiBDYW4gc2xvd0Rvd24gYnVpbGQgc3BlZWQuICovXHJcbiAgICAvLyBzb3VyY2VtYXA6IGlzRGV2LFxyXG4gICAgbWluaWZ5OiBpc1Byb2R1Y3Rpb24sXHJcbiAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogaXNQcm9kdWN0aW9uLFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBpbnB1dDoge1xyXG4gICAgICAgIGRldnRvb2xzOiByZXNvbHZlKHBhZ2VzRGlyLCBcImRldnRvb2xzXCIsIFwiaW5kZXguaHRtbFwiKSxcclxuICAgICAgICBwYW5lbDogcmVzb2x2ZShwYWdlc0RpciwgXCJwYW5lbFwiLCBcImluZGV4Lmh0bWxcIiksXHJcbiAgICAgICAgY29udGVudDogcmVzb2x2ZShwYWdlc0RpciwgXCJjb250ZW50XCIsIFwiaW5kZXgudHNcIiksXHJcbiAgICAgICAgYmFja2dyb3VuZDogcmVzb2x2ZShwYWdlc0RpciwgXCJiYWNrZ3JvdW5kXCIsIFwiaW5kZXgudHNcIiksXHJcbiAgICAgICAgY29udGVudFN0eWxlOiByZXNvbHZlKHBhZ2VzRGlyLCBcImNvbnRlbnRcIiwgXCJzdHlsZS5zY3NzXCIpLFxyXG4gICAgICAgIHBvcHVwOiByZXNvbHZlKHBhZ2VzRGlyLCBcInBvcHVwXCIsIFwiaW5kZXguaHRtbFwiKSxcclxuICAgICAgICBuZXd0YWI6IHJlc29sdmUocGFnZXNEaXIsIFwibmV3dGFiXCIsIFwiaW5kZXguaHRtbFwiKSxcclxuICAgICAgICBvcHRpb25zOiByZXNvbHZlKHBhZ2VzRGlyLCBcIm9wdGlvbnNcIiwgXCJpbmRleC5odG1sXCIpLFxyXG4gICAgICB9LFxyXG4gICAgICB3YXRjaDoge1xyXG4gICAgICAgIGluY2x1ZGU6IFtcInNyYy8qKlwiLCBcInZpdGUuY29uZmlnLnRzXCJdLFxyXG4gICAgICAgIGV4Y2x1ZGU6IFtcIm5vZGVfbW9kdWxlcy8qKlwiLCBcInNyYy8qKi8qLnNwZWMudHNcIl0sXHJcbiAgICAgIH0sXHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiBcInNyYy9wYWdlcy9bbmFtZV0vaW5kZXguanNcIixcclxuICAgICAgICBjaHVua0ZpbGVOYW1lczogaXNEZXZcclxuICAgICAgICAgID8gXCJhc3NldHMvanMvW25hbWVdLmpzXCJcclxuICAgICAgICAgIDogXCJhc3NldHMvanMvW25hbWVdLltoYXNoXS5qc1wiLFxyXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCB7IGRpciwgbmFtZTogX25hbWUgfSA9IHBhdGgucGFyc2UoYXNzZXRJbmZvLm5hbWUpO1xyXG4gICAgICAgICAgY29uc3QgYXNzZXRGb2xkZXIgPSBkaXIuc3BsaXQoXCIvXCIpLmF0KC0xKTtcclxuICAgICAgICAgIGNvbnN0IG5hbWUgPSBhc3NldEZvbGRlciArIGZpcnN0VXBwZXJDYXNlKF9uYW1lKTtcclxuICAgICAgICAgIGlmIChuYW1lID09PSBcImNvbnRlbnRTdHlsZVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgYXNzZXRzL2Nzcy9jb250ZW50U3R5bGUke2NhY2hlSW52YWxpZGF0aW9uS2V5fS5jaHVuay5jc3NgO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvW2V4dF0vJHtuYW1lfS5jaHVuay5bZXh0XWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG5mdW5jdGlvbiBmaXJzdFVwcGVyQ2FzZShzdHI6IHN0cmluZykge1xyXG4gIGNvbnN0IGZpcnN0QWxwaGFiZXQgPSBuZXcgUmVnRXhwKC8oIHxeKVthLXpdLywgXCJnXCIpO1xyXG4gIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKGZpcnN0QWxwaGFiZXQsIChMKSA9PiBMLnRvVXBwZXJDYXNlKCkpO1xyXG59XHJcblxyXG5sZXQgY2FjaGVJbnZhbGlkYXRpb25LZXk6IHN0cmluZyA9IGdlbmVyYXRlS2V5KCk7XHJcbmZ1bmN0aW9uIHJlZ2VuZXJhdGVDYWNoZUludmFsaWRhdGlvbktleSgpIHtcclxuICBjYWNoZUludmFsaWRhdGlvbktleSA9IGdlbmVyYXRlS2V5KCk7XHJcbiAgcmV0dXJuIGNhY2hlSW52YWxpZGF0aW9uS2V5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZUtleSgpOiBzdHJpbmcge1xyXG4gIHJldHVybiBgJHsoRGF0ZS5ub3coKSAvIDEwMCkudG9GaXhlZCgpfWA7XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMdWtlXFxcXERlc2t0b3BcXFxcY29kaW5nXFxcXHNlbWFudGljX3NlYXJjaF9leHRlbnNpb25cXFxcdXRpbHNcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcTHVrZVxcXFxEZXNrdG9wXFxcXGNvZGluZ1xcXFxzZW1hbnRpY19zZWFyY2hfZXh0ZW5zaW9uXFxcXHV0aWxzXFxcXHBsdWdpbnNcXFxcbWFrZS1tYW5pZmVzdC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvTHVrZS9EZXNrdG9wL2NvZGluZy9zZW1hbnRpY19zZWFyY2hfZXh0ZW5zaW9uL3V0aWxzL3BsdWdpbnMvbWFrZS1tYW5pZmVzdC50c1wiO2ltcG9ydCAqIGFzIGZzIGZyb20gXCJmc1wiO1xyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCBjb2xvckxvZyBmcm9tIFwiLi4vbG9nXCI7XHJcbmltcG9ydCBNYW5pZmVzdFBhcnNlciBmcm9tIFwiLi4vbWFuaWZlc3QtcGFyc2VyXCI7XHJcbmltcG9ydCB0eXBlIHsgUGx1Z2luT3B0aW9uIH0gZnJvbSBcInZpdGVcIjtcclxuXHJcbmNvbnN0IHsgcmVzb2x2ZSB9ID0gcGF0aDtcclxuXHJcbmNvbnN0IGRpc3REaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgXCIuLlwiLCBcIi4uXCIsIFwiZGlzdFwiKTtcclxuY29uc3QgcHVibGljRGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi5cIiwgXCIuLlwiLCBcInB1YmxpY1wiKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1ha2VNYW5pZmVzdChcclxuICBtYW5pZmVzdDogY2hyb21lLnJ1bnRpbWUuTWFuaWZlc3RWMyxcclxuICBjb25maWc6IHsgaXNEZXY6IGJvb2xlYW47IGNvbnRlbnRTY3JpcHRDc3NLZXk/OiBzdHJpbmcgfVxyXG4pOiBQbHVnaW5PcHRpb24ge1xyXG4gIGZ1bmN0aW9uIG1ha2VNYW5pZmVzdCh0bzogc3RyaW5nKSB7XHJcbiAgICBpZiAoIWZzLmV4aXN0c1N5bmModG8pKSB7XHJcbiAgICAgIGZzLm1rZGlyU3luYyh0byk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBtYW5pZmVzdFBhdGggPSByZXNvbHZlKHRvLCBcIm1hbmlmZXN0Lmpzb25cIik7XHJcblxyXG4gICAgLy8gTmFtaW5nIGNoYW5nZSBmb3IgY2FjaGUgaW52YWxpZGF0aW9uXHJcbiAgICBpZiAoY29uZmlnLmNvbnRlbnRTY3JpcHRDc3NLZXkpIHtcclxuICAgICAgbWFuaWZlc3QuY29udGVudF9zY3JpcHRzLmZvckVhY2goKHNjcmlwdCkgPT4ge1xyXG4gICAgICAgIHNjcmlwdC5jc3MgPSBzY3JpcHQuY3NzLm1hcCgoY3NzKSA9PlxyXG4gICAgICAgICAgY3NzLnJlcGxhY2UoXCI8S0VZPlwiLCBjb25maWcuY29udGVudFNjcmlwdENzc0tleSlcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmcy53cml0ZUZpbGVTeW5jKFxyXG4gICAgICBtYW5pZmVzdFBhdGgsXHJcbiAgICAgIE1hbmlmZXN0UGFyc2VyLmNvbnZlcnRNYW5pZmVzdFRvU3RyaW5nKG1hbmlmZXN0KVxyXG4gICAgKTtcclxuXHJcbiAgICBjb2xvckxvZyhgTWFuaWZlc3QgZmlsZSBjb3B5IGNvbXBsZXRlOiAke21hbmlmZXN0UGF0aH1gLCBcInN1Y2Nlc3NcIik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbmFtZTogXCJtYWtlLW1hbmlmZXN0XCIsXHJcbiAgICBidWlsZFN0YXJ0KCkge1xyXG4gICAgICBpZiAoY29uZmlnLmlzRGV2KSB7XHJcbiAgICAgICAgbWFrZU1hbmlmZXN0KGRpc3REaXIpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgYnVpbGRFbmQoKSB7XHJcbiAgICAgIGlmIChjb25maWcuaXNEZXYpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgbWFrZU1hbmlmZXN0KHB1YmxpY0Rpcik7XHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMdWtlXFxcXERlc2t0b3BcXFxcY29kaW5nXFxcXHNlbWFudGljX3NlYXJjaF9leHRlbnNpb25cXFxcdXRpbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEx1a2VcXFxcRGVza3RvcFxcXFxjb2RpbmdcXFxcc2VtYW50aWNfc2VhcmNoX2V4dGVuc2lvblxcXFx1dGlsc1xcXFxsb2cudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0x1a2UvRGVza3RvcC9jb2Rpbmcvc2VtYW50aWNfc2VhcmNoX2V4dGVuc2lvbi91dGlscy9sb2cudHNcIjt0eXBlIENvbG9yVHlwZSA9IFwic3VjY2Vzc1wiIHwgXCJpbmZvXCIgfCBcImVycm9yXCIgfCBcIndhcm5pbmdcIiB8IGtleW9mIHR5cGVvZiBDT0xPUlM7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb2xvckxvZyhtZXNzYWdlOiBzdHJpbmcsIHR5cGU/OiBDb2xvclR5cGUpIHtcclxuICBsZXQgY29sb3I6IHN0cmluZyA9IHR5cGUgfHwgQ09MT1JTLkZnQmxhY2s7XHJcblxyXG4gIHN3aXRjaCAodHlwZSkge1xyXG4gICAgY2FzZSBcInN1Y2Nlc3NcIjpcclxuICAgICAgY29sb3IgPSBDT0xPUlMuRmdHcmVlbjtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFwiaW5mb1wiOlxyXG4gICAgICBjb2xvciA9IENPTE9SUy5GZ0JsdWU7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBcImVycm9yXCI6XHJcbiAgICAgIGNvbG9yID0gQ09MT1JTLkZnUmVkO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgXCJ3YXJuaW5nXCI6XHJcbiAgICAgIGNvbG9yID0gQ09MT1JTLkZnWWVsbG93O1xyXG4gICAgICBicmVhaztcclxuICB9XHJcblxyXG4gIGNvbnNvbGUubG9nKGNvbG9yLCBtZXNzYWdlKTtcclxufVxyXG5cclxuY29uc3QgQ09MT1JTID0ge1xyXG4gIFJlc2V0OiBcIlxceDFiWzBtXCIsXHJcbiAgQnJpZ2h0OiBcIlxceDFiWzFtXCIsXHJcbiAgRGltOiBcIlxceDFiWzJtXCIsXHJcbiAgVW5kZXJzY29yZTogXCJcXHgxYls0bVwiLFxyXG4gIEJsaW5rOiBcIlxceDFiWzVtXCIsXHJcbiAgUmV2ZXJzZTogXCJcXHgxYls3bVwiLFxyXG4gIEhpZGRlbjogXCJcXHgxYls4bVwiLFxyXG4gIEZnQmxhY2s6IFwiXFx4MWJbMzBtXCIsXHJcbiAgRmdSZWQ6IFwiXFx4MWJbMzFtXCIsXHJcbiAgRmdHcmVlbjogXCJcXHgxYlszMm1cIixcclxuICBGZ1llbGxvdzogXCJcXHgxYlszM21cIixcclxuICBGZ0JsdWU6IFwiXFx4MWJbMzRtXCIsXHJcbiAgRmdNYWdlbnRhOiBcIlxceDFiWzM1bVwiLFxyXG4gIEZnQ3lhbjogXCJcXHgxYlszNm1cIixcclxuICBGZ1doaXRlOiBcIlxceDFiWzM3bVwiLFxyXG4gIEJnQmxhY2s6IFwiXFx4MWJbNDBtXCIsXHJcbiAgQmdSZWQ6IFwiXFx4MWJbNDFtXCIsXHJcbiAgQmdHcmVlbjogXCJcXHgxYls0Mm1cIixcclxuICBCZ1llbGxvdzogXCJcXHgxYls0M21cIixcclxuICBCZ0JsdWU6IFwiXFx4MWJbNDRtXCIsXHJcbiAgQmdNYWdlbnRhOiBcIlxceDFiWzQ1bVwiLFxyXG4gIEJnQ3lhbjogXCJcXHgxYls0Nm1cIixcclxuICBCZ1doaXRlOiBcIlxceDFiWzQ3bVwiLFxyXG59IGFzIGNvbnN0O1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEx1a2VcXFxcRGVza3RvcFxcXFxjb2RpbmdcXFxcc2VtYW50aWNfc2VhcmNoX2V4dGVuc2lvblxcXFx1dGlsc1xcXFxtYW5pZmVzdC1wYXJzZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEx1a2VcXFxcRGVza3RvcFxcXFxjb2RpbmdcXFxcc2VtYW50aWNfc2VhcmNoX2V4dGVuc2lvblxcXFx1dGlsc1xcXFxtYW5pZmVzdC1wYXJzZXJcXFxcaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0x1a2UvRGVza3RvcC9jb2Rpbmcvc2VtYW50aWNfc2VhcmNoX2V4dGVuc2lvbi91dGlscy9tYW5pZmVzdC1wYXJzZXIvaW5kZXgudHNcIjt0eXBlIE1hbmlmZXN0ID0gY2hyb21lLnJ1bnRpbWUuTWFuaWZlc3RWMztcclxuXHJcbmNsYXNzIE1hbmlmZXN0UGFyc2VyIHtcclxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWZ1bmN0aW9uXHJcbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIHN0YXRpYyBjb252ZXJ0TWFuaWZlc3RUb1N0cmluZyhtYW5pZmVzdDogTWFuaWZlc3QpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG1hbmlmZXN0LCBudWxsLCAyKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1hbmlmZXN0UGFyc2VyO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEx1a2VcXFxcRGVza3RvcFxcXFxjb2RpbmdcXFxcc2VtYW50aWNfc2VhcmNoX2V4dGVuc2lvblxcXFx1dGlsc1xcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMdWtlXFxcXERlc2t0b3BcXFxcY29kaW5nXFxcXHNlbWFudGljX3NlYXJjaF9leHRlbnNpb25cXFxcdXRpbHNcXFxccGx1Z2luc1xcXFxjdXN0b20tZHluYW1pYy1pbXBvcnQudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0x1a2UvRGVza3RvcC9jb2Rpbmcvc2VtYW50aWNfc2VhcmNoX2V4dGVuc2lvbi91dGlscy9wbHVnaW5zL2N1c3RvbS1keW5hbWljLWltcG9ydC50c1wiO2ltcG9ydCB0eXBlIHsgUGx1Z2luT3B0aW9uIH0gZnJvbSBcInZpdGVcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGN1c3RvbUR5bmFtaWNJbXBvcnQoKTogUGx1Z2luT3B0aW9uIHtcclxuICByZXR1cm4ge1xyXG4gICAgbmFtZTogXCJjdXN0b20tZHluYW1pYy1pbXBvcnRcIixcclxuICAgIHJlbmRlckR5bmFtaWNJbXBvcnQoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgbGVmdDogYFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGNvbnN0IGR5bmFtaWNJbXBvcnQgPSAocGF0aCkgPT4gaW1wb3J0KHBhdGgpO1xyXG4gICAgICAgICAgZHluYW1pY0ltcG9ydChcclxuICAgICAgICAgIGAsXHJcbiAgICAgICAgcmlnaHQ6IFwiKX1cIixcclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEx1a2VcXFxcRGVza3RvcFxcXFxjb2RpbmdcXFxcc2VtYW50aWNfc2VhcmNoX2V4dGVuc2lvblxcXFx1dGlsc1xcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMdWtlXFxcXERlc2t0b3BcXFxcY29kaW5nXFxcXHNlbWFudGljX3NlYXJjaF9leHRlbnNpb25cXFxcdXRpbHNcXFxccGx1Z2luc1xcXFxhZGQtaG1yLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9MdWtlL0Rlc2t0b3AvY29kaW5nL3NlbWFudGljX3NlYXJjaF9leHRlbnNpb24vdXRpbHMvcGx1Z2lucy9hZGQtaG1yLnRzXCI7aW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tIFwiZnNcIjtcclxuaW1wb3J0IHR5cGUgeyBQbHVnaW5PcHRpb24gfSBmcm9tIFwidml0ZVwiO1xyXG5cclxuY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5fX0RFVl9fID09PSBcInRydWVcIjtcclxuXHJcbmNvbnN0IERVTU1ZX0NPREUgPSBgZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKXt9O2A7XHJcblxyXG5mdW5jdGlvbiBnZXRJbmplY3Rpb25Db2RlKGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHJldHVybiByZWFkRmlsZVN5bmMoXHJcbiAgICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uXCIsIFwicmVsb2FkXCIsIFwiaW5qZWN0aW9uc1wiLCBmaWxlTmFtZSksXHJcbiAgICB7IGVuY29kaW5nOiBcInV0ZjhcIiB9XHJcbiAgKTtcclxufVxyXG5cclxudHlwZSBDb25maWcgPSB7XHJcbiAgYmFja2dyb3VuZD86IGJvb2xlYW47XHJcbiAgdmlldz86IGJvb2xlYW47XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRIbXIoY29uZmlnPzogQ29uZmlnKTogUGx1Z2luT3B0aW9uIHtcclxuICBjb25zdCB7IGJhY2tncm91bmQgPSBmYWxzZSwgdmlldyA9IHRydWUgfSA9IGNvbmZpZyB8fCB7fTtcclxuICBjb25zdCBpZEluQmFja2dyb3VuZFNjcmlwdCA9IFwidmlydHVhbDpyZWxvYWQtb24tdXBkYXRlLWluLWJhY2tncm91bmQtc2NyaXB0XCI7XHJcbiAgY29uc3QgaWRJblZpZXcgPSBcInZpcnR1YWw6cmVsb2FkLW9uLXVwZGF0ZS1pbi12aWV3XCI7XHJcblxyXG4gIGNvbnN0IHNjcmlwdEhtckNvZGUgPSBpc0RldiA/IGdldEluamVjdGlvbkNvZGUoXCJzY3JpcHQuanNcIikgOiBEVU1NWV9DT0RFO1xyXG4gIGNvbnN0IHZpZXdIbXJDb2RlID0gaXNEZXYgPyBnZXRJbmplY3Rpb25Db2RlKFwidmlldy5qc1wiKSA6IERVTU1ZX0NPREU7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiBcImFkZC1obXJcIixcclxuICAgIHJlc29sdmVJZChpZCkge1xyXG4gICAgICBpZiAoaWQgPT09IGlkSW5CYWNrZ3JvdW5kU2NyaXB0IHx8IGlkID09PSBpZEluVmlldykge1xyXG4gICAgICAgIHJldHVybiBnZXRSZXNvbHZlZElkKGlkKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGxvYWQoaWQpIHtcclxuICAgICAgaWYgKGlkID09PSBnZXRSZXNvbHZlZElkKGlkSW5CYWNrZ3JvdW5kU2NyaXB0KSkge1xyXG4gICAgICAgIHJldHVybiBiYWNrZ3JvdW5kID8gc2NyaXB0SG1yQ29kZSA6IERVTU1ZX0NPREU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpZCA9PT0gZ2V0UmVzb2x2ZWRJZChpZEluVmlldykpIHtcclxuICAgICAgICByZXR1cm4gdmlldyA/IHZpZXdIbXJDb2RlIDogRFVNTVlfQ09ERTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRSZXNvbHZlZElkKGlkOiBzdHJpbmcpIHtcclxuICByZXR1cm4gXCJcXDBcIiArIGlkO1xyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcTHVrZVxcXFxEZXNrdG9wXFxcXGNvZGluZ1xcXFxzZW1hbnRpY19zZWFyY2hfZXh0ZW5zaW9uXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMdWtlXFxcXERlc2t0b3BcXFxcY29kaW5nXFxcXHNlbWFudGljX3NlYXJjaF9leHRlbnNpb25cXFxcbWFuaWZlc3QudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0x1a2UvRGVza3RvcC9jb2Rpbmcvc2VtYW50aWNfc2VhcmNoX2V4dGVuc2lvbi9tYW5pZmVzdC50c1wiO2ltcG9ydCBwYWNrYWdlSnNvbiBmcm9tIFwiLi9wYWNrYWdlLmpzb25cIjtcclxuXHJcbi8qKlxyXG4gKiBBZnRlciBjaGFuZ2luZywgcGxlYXNlIHJlbG9hZCB0aGUgZXh0ZW5zaW9uIGF0IGBjaHJvbWU6Ly9leHRlbnNpb25zYFxyXG4gKi9cclxuY29uc3QgbWFuaWZlc3Q6IGNocm9tZS5ydW50aW1lLk1hbmlmZXN0VjMgPSB7XHJcbiAgbWFuaWZlc3RfdmVyc2lvbjogMyxcclxuICBuYW1lOiBcIlNlbWFudGljIFNlYXJjaFwiLFxyXG4gIHZlcnNpb246IHBhY2thZ2VKc29uLnZlcnNpb24sXHJcbiAgZGVzY3JpcHRpb246IHBhY2thZ2VKc29uLmRlc2NyaXB0aW9uLFxyXG4gIG9wdGlvbnNfcGFnZTogXCJzcmMvcGFnZXMvb3B0aW9ucy9pbmRleC5odG1sXCIsXHJcbiAgYmFja2dyb3VuZDoge1xyXG4gICAgc2VydmljZV93b3JrZXI6IFwic3JjL3BhZ2VzL2JhY2tncm91bmQvaW5kZXguanNcIixcclxuICAgIHR5cGU6IFwibW9kdWxlXCIsXHJcbiAgfSxcclxuICBhY3Rpb246IHtcclxuICAgIGRlZmF1bHRfcG9wdXA6IFwic3JjL3BhZ2VzL3BvcHVwL2luZGV4Lmh0bWxcIixcclxuICAgIGRlZmF1bHRfaWNvbjogXCJpY29uLTM0LnBuZ1wiLFxyXG4gIH0sXHJcbiAgLy8gY2hyb21lX3VybF9vdmVycmlkZXM6IHtcclxuICAvLyAgIG5ld3RhYjogXCJzcmMvcGFnZXMvbmV3dGFiL2luZGV4Lmh0bWxcIixcclxuICAvLyB9LFxyXG4gIGljb25zOiB7XHJcbiAgICBcIjEyOFwiOiBcImljb24tMTI4LnBuZ1wiLFxyXG4gIH0sXHJcbiAgY29udGVudF9zY3JpcHRzOiBbXHJcbiAgICB7XHJcbiAgICAgIG1hdGNoZXM6IFtcImh0dHA6Ly8qLypcIiwgXCJodHRwczovLyovKlwiLCBcIjxhbGxfdXJscz5cIl0sXHJcbiAgICAgIGpzOiBbXCJzcmMvcGFnZXMvY29udGVudC9pbmRleC5qc1wiXSxcclxuICAgICAgLy8gS0VZIGZvciBjYWNoZSBpbnZhbGlkYXRpb25cclxuICAgICAgY3NzOiBbXCJhc3NldHMvY3NzL2NvbnRlbnRTdHlsZTxLRVk+LmNodW5rLmNzc1wiXSxcclxuICAgIH0sXHJcbiAgXSxcclxuICAvLyBkZXZ0b29sc19wYWdlOiBcInNyYy9wYWdlcy9kZXZ0b29scy9pbmRleC5odG1sXCIsXHJcbiAgd2ViX2FjY2Vzc2libGVfcmVzb3VyY2VzOiBbXHJcbiAgICB7XHJcbiAgICAgIHJlc291cmNlczogW1xyXG4gICAgICAgIFwiYXNzZXRzL2pzLyouanNcIixcclxuICAgICAgICBcImFzc2V0cy9jc3MvKi5jc3NcIixcclxuICAgICAgICBcImljb24tMTI4LnBuZ1wiLFxyXG4gICAgICAgIFwiaWNvbi0zNC5wbmdcIixcclxuICAgICAgXSxcclxuICAgICAgbWF0Y2hlczogW1wiKjovLyovKlwiXSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1hbmlmZXN0O1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdXLFNBQVMsb0JBQW9CO0FBQzdYLE9BQU8sV0FBVztBQUNsQixPQUFPQSxTQUFRLFdBQUFDLGdCQUFlOzs7QUNGb1gsWUFBWSxRQUFRO0FBQ3RhLFlBQVksVUFBVTs7O0FDQ1AsU0FBUixTQUEwQixTQUFpQixNQUFrQjtBQUNsRSxNQUFJLFFBQWdCLFFBQVEsT0FBTztBQUVuQyxVQUFRLE1BQU07QUFBQSxJQUNaLEtBQUs7QUFDSCxjQUFRLE9BQU87QUFDZjtBQUFBLElBQ0YsS0FBSztBQUNILGNBQVEsT0FBTztBQUNmO0FBQUEsSUFDRixLQUFLO0FBQ0gsY0FBUSxPQUFPO0FBQ2Y7QUFBQSxJQUNGLEtBQUs7QUFDSCxjQUFRLE9BQU87QUFDZjtBQUFBLEVBQ0o7QUFFQSxVQUFRLElBQUksT0FBTyxPQUFPO0FBQzVCO0FBRUEsSUFBTSxTQUFTO0FBQUEsRUFDYixPQUFPO0FBQUEsRUFDUCxRQUFRO0FBQUEsRUFDUixLQUFLO0FBQUEsRUFDTCxZQUFZO0FBQUEsRUFDWixPQUFPO0FBQUEsRUFDUCxTQUFTO0FBQUEsRUFDVCxRQUFRO0FBQUEsRUFDUixTQUFTO0FBQUEsRUFDVCxPQUFPO0FBQUEsRUFDUCxTQUFTO0FBQUEsRUFDVCxVQUFVO0FBQUEsRUFDVixRQUFRO0FBQUEsRUFDUixXQUFXO0FBQUEsRUFDWCxRQUFRO0FBQUEsRUFDUixTQUFTO0FB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Q2pEO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0JHLFNBQ1osd0JBQ0E7QUFBQSxRQUNKLGdCQUFnQixDQUFDLGNBQWM7QUFDN0IsZ0JBQU0sRUFBRSxLQUFLLE1BQU0sTUFBTSxJQUFJQyxNQUFLLE1BQU0sVUFBVSxJQUFJO0FBQ3RELGdCQUFNLGNBQWMsSUFBSSxNQUFNLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFDeEMsZ0JBQU0sT0FBTyxjQUFjLGVBQWUsS0FBSztBQUMvQyxjQUFJLFNBQVMsZ0JBQWdCO0FBQzNCLG1CQUFPLDBCQUEwQjtBQUFBLFVBQ25DO0FBQ0EsaUJBQU8sZ0JBQWdCO0FBQUEsUUFDekI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDO0FBRUQsU0FBUyxlQUFlLEtBQWE7QUFDbkMsUUFBTSxnQkFBZ0IsSUFBSSxPQUFPLGNBQWMsR0FBRztBQUNsRCxTQUFPLElBQUksWUFBWSxFQUFFLFFBQVEsZUFBZSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUM7QUFDeEU7QUFFQSxJQUFJLHVCQUErQixZQUFZO0FBQy9DLFNBQVMsaUNBQWlDO0FBQ3hDLHlCQUF1QixZQUFZO0FBQ25DLFNBQU87QUFDVDtBQUVBLFNBQVMsY0FBc0I7QUFDN0IsU0FBTyxJQUFJLEtBQUssSUFBSSxJQUFJLEtBQUssUUFBUTtBQUN2QzsiLAogICJuYW1lcyI6IFsicGF0aCIsICJyZXNvbHZlIiwgIm1hbmlmZXN0IiwgIm1hbmlmZXN0IiwgIm1ha2VNYW5pZmVzdCIsICJwYXRoIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgInJlc29sdmUiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAicHVibGljRGlyIiwgImlzRGV2IiwgInBhdGgiXQp9Cg==
