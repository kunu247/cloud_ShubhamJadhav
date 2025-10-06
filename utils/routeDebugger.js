// File: E:\cloud_ShubhamJadhav\utils\routeDebugger.js

/**
 * 🧭 Advanced Route Debugger Utility
 *
 * A comprehensive route analysis tool that provides detailed insights into
 * Express application routes, middleware, and application structure.
 *
 * @version 2.1.0
 * @author API Development Team
 * @description Dynamic route analyzer with multiple output formats and advanced filtering
 */

const { StatusCodes } = require("http-status-codes");

class AdvancedRouteDebugger {
  constructor(options = {}) {
    this.defaultOptions = {
      app: null,
      includeMiddleware: false,
      groupByPrefix: true,
      showStats: true,
      colorOutput: true,
      depth: 3,
      outputFormat: "table",
      filter: null,
      sortBy: "path",
      maxDepth: 10
    };

    this.options = { ...this.defaultOptions, ...options };
    this.initializeColors();
    this.validateOptions();
  }

  /**
   * Initialize color schemes
   */
  initializeColors() {
    this.colors = {
      reset: "\x1b[0m",
      bright: "\x1b[1m",
      dim: "\x1b[2m",
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
      white: "\x1b[37m"
    };

    this.methodColors = {
      GET: this.colors.green,
      POST: this.colors.blue,
      PUT: this.colors.yellow,
      PATCH: this.colors.cyan,
      DELETE: this.colors.red,
      OPTIONS: this.colors.magenta,
      HEAD: this.colors.dim
    };
  }

  /**
   * Validate constructor options
   */
  validateOptions() {
    if (!this.options.app) {
      throw new Error("Express app instance is required");
    }

    const validFormats = ["table", "json", "tree", "minimal"];
    if (!validFormats.includes(this.options.outputFormat)) {
      throw new Error(
        `Invalid output format. Must be one of: ${validFormats.join(", ")}`
      );
    }

    const validSortBy = ["path", "methods", "prefix"];
    if (!validSortBy.includes(this.options.sortBy)) {
      throw new Error(
        `Invalid sort option. Must be one of: ${validSortBy.join(", ")}`
      );
    }
  }

  /**
   * Apply color to text if color output is enabled
   */
  colorize(text, color) {
    return this.options.colorOutput
      ? `${color}${text}${this.colors.reset}`
      : text;
  }

  /**
   * Extract all routes from Express application
   */
  extractRoutes() {
    if (!this.options.app._router) {
      throw new Error("Express router not initialized");
    }

    const routes = [];
    const middleware = [];
    const routePrefixes = new Set();

    const processLayer = (layer, prefix = "", depth = 0) => {
      if (!layer || depth > this.options.maxDepth) return;

      // Handle router instances
      if (layer.name === "router" && layer.handle.stack) {
        const routerPrefix = this.buildRouterPrefix(prefix, layer.regexp);
        layer.handle.stack.forEach((sublayer) =>
          processLayer(sublayer, routerPrefix, depth + 1)
        );
        return;
      }

      // Handle route layers
      if (layer.route) {
        this.processRouteLayer(layer, prefix, routes, routePrefixes);
      }
      // Handle middleware
      else if (this.options.includeMiddleware) {
        this.processMiddlewareLayer(layer, prefix, middleware);
      }
    };

    this.options.app._router.stack.forEach((layer) => processLayer(layer));

    return {
      routes: this.sortRoutes(routes),
      middleware,
      prefixes: Array.from(routePrefixes).sort(),
      stats: this.calculateStats(routes),
      metadata: {
        generatedAt: new Date().toISOString(),
        totalRoutes: routes.length,
        totalMiddleware: middleware.length
      }
    };
  }

  /**
   * Build router prefix from regex
   */
  buildRouterPrefix(prefix, regexp) {
    return prefix + (regexp.fast_slash ? "" : this.regexpToString(regexp));
  }

  /**
   * Process a route layer
   */
  processRouteLayer(layer, prefix, routes, routePrefixes) {
    const route = {
      methods: Object.keys(layer.route.methods).map((m) => m.toUpperCase()),
      path: this.cleanPath(prefix + layer.route.path),
      prefix: prefix || "/",
      fullPath: this.cleanPath(prefix + layer.route.path),
      stack: layer.route.stack ? layer.route.stack.length : 0
    };

    if (this.shouldIncludeRoute(route)) {
      routes.push(route);
      routePrefixes.add(prefix || "/");
    }
  }

  /**
   * Process a middleware layer
   */
  processMiddlewareLayer(layer, prefix, middleware) {
    middleware.push({
      type: "middleware",
      name: layer.name || "anonymous",
      path: prefix || "/",
      handle: layer.handle?.name || "anonymous",
      regexp: layer.regexp.toString()
    });
  }

  /**
   * Convert regex to string path
   */
  regexpToString(regexp) {
    try {
      const str = regexp.toString();
      return str
        .replace("/^", "")
        .replace("\\/?", "")
        .replace("(?=\\/|$)/i", "")
        .replace(/\\\//g, "/")
        .replace(/\$\/?/, "")
        .replace(/\[\^\\\/]\?\$/, ""); // Handle optional trailing slash
    } catch (error) {
      return "/regex-error";
    }
  }

  /**
   * Clean and normalize path
   */
  cleanPath(path) {
    return path.replace(/\/+/g, "/").replace(/\/$/, "").replace(/^\/?/, "/");
  }

  /**
   * Filter routes based on options
   */
  shouldIncludeRoute(route) {
    if (!this.options.filter) return true;

    const filter = this.options.filter;

    if (typeof filter === "string") {
      const lowerFilter = filter.toLowerCase();
      return (
        route.path.toLowerCase().includes(lowerFilter) ||
        route.methods.some((m) => m.toLowerCase().includes(lowerFilter)) ||
        route.prefix.toLowerCase().includes(lowerFilter)
      );
    }

    if (filter instanceof RegExp) {
      return (
        filter.test(route.path) ||
        route.methods.some((m) => filter.test(m)) ||
        filter.test(route.prefix)
      );
    }

    return true;
  }

  /**
   * Sort routes based on configuration
   */
  sortRoutes(routes) {
    return routes.sort((a, b) => {
      switch (this.options.sortBy) {
        case "methods":
          return (a.methods[0] || "").localeCompare(b.methods[0] || "");
        case "prefix":
          return a.prefix.localeCompare(b.prefix);
        case "path":
        default:
          return a.path.localeCompare(b.path);
      }
    });
  }

  /**
   * Calculate route statistics
   */
  calculateStats(routes) {
    const methodCount = {};
    const prefixCount = {};
    const statusCodes = {
      withParams: 0,
      staticRoutes: 0
    };

    routes.forEach((route) => {
      route.methods.forEach((method) => {
        methodCount[method] = (methodCount[method] || 0) + 1;
      });

      prefixCount[route.prefix] = (prefixCount[route.prefix] || 0) + 1;

      // Count route types
      if (route.path.includes(":")) {
        statusCodes.withParams++;
      } else {
        statusCodes.staticRoutes++;
      }
    });

    return {
      totalRoutes: routes.length,
      methodCount,
      prefixCount,
      uniquePrefixes: Object.keys(prefixCount).length,
      statusCodes
    };
  }

  /**
   * Display routes in table format
   */
  displayTable(routes, stats) {
    console.log(
      `\n${this.colorize(
        "🚀 EXPRESS ROUTE DEBUGGER",
        this.colors.bright + this.colors.cyan
      )}`
    );
    console.log(`${this.colorize("=".repeat(80), this.colors.dim)}`);

    if (this.options.showStats) {
      this.displayStats(stats);
    }

    if (routes.length === 0) {
      console.log(
        `\n${this.colorize(
          "❌ No routes found matching current filters",
          this.colors.yellow
        )}`
      );
      return;
    }

    console.log(`\n${this.colorize("ACTIVE ROUTES:", this.colors.bright)}`);

    const groupedRoutes = this.options.groupByPrefix
      ? this.groupRoutesByPrefix(routes)
      : { "/": routes };

    Object.keys(groupedRoutes)
      .sort()
      .forEach((prefix) => {
        const prefixRoutes = groupedRoutes[prefix];
        if (prefixRoutes.length > 0) {
          console.log(
            `\n${this.colorize(
              `📁 ${prefix || "ROOT"}`,
              this.colors.bright + this.colors.yellow
            )}`
          );

          prefixRoutes.forEach((route) => {
            const methods = route.methods
              .map((method) =>
                this.colorize(
                  method.padEnd(6),
                  this.methodColors[method] || this.colors.white
                )
              )
              .join(", ");

            const path = this.colorize(route.path, this.colors.white);
            const stackInfo =
              route.stack > 1 ? ` (${route.stack} handlers)` : "";
            console.log(`  ${methods} ${path}${stackInfo}`);
          });
        }
      });

    console.log(`\n${this.colorize("=".repeat(80), this.colors.dim)}`);
  }

  /**
   * Display routes in tree format
   */
  displayTree(routes, stats) {
    console.log(
      `\n${this.colorize(
        "🌳 EXPRESS ROUTE TREE",
        this.colors.bright + this.colors.green
      )}`
    );
    console.log(`${this.colorize("=".repeat(80), this.colors.dim)}`);

    if (this.options.showStats) {
      this.displayStats(stats);
    }

    if (routes.length === 0) {
      console.log(
        `\n${this.colorize(
          "❌ No routes found to display as tree",
          this.colors.yellow
        )}`
      );
      return;
    }

    const tree = this.buildRouteTree(routes);
    this.printTree(tree);

    console.log(`\n${this.colorize("=".repeat(80), this.colors.dim)}`);
  }

  /**
   * Build hierarchical route tree
   */
  buildRouteTree(routes) {
    const tree = {};

    routes.forEach((route) => {
      const pathParts = route.path.split("/").filter((part) => part);
      let currentLevel = tree;

      pathParts.forEach((part, index) => {
        const isLast = index === pathParts.length - 1;
        const fullPath = "/" + pathParts.slice(0, index + 1).join("/");

        if (!currentLevel[part]) {
          currentLevel[part] = {
            _meta: {
              fullPath,
              methods: [],
              isEndpoint: false,
              hasChildren: false
            },
            _children: {}
          };
        }

        if (isLast) {
          currentLevel[part]._meta.methods = route.methods;
          currentLevel[part]._meta.isEndpoint = true;
        } else {
          currentLevel[part]._meta.hasChildren = true;
        }

        currentLevel = currentLevel[part]._children;
      });
    });

    return tree;
  }

  /**
   * Print route tree recursively
   */
  printTree(node, prefix = "", isLast = true) {
    const keys = Object.keys(node).filter((key) => !key.startsWith("_"));

    keys.forEach((key, index) => {
      const isLastChild = index === keys.length - 1;
      const currentNode = node[key];
      const connector = isLast ? "└── " : "├── ";
      const childPrefix = prefix + (isLast ? "    " : "│   ");

      // Print current node
      const methods = currentNode._meta.methods
        .map((m) =>
          this.colorize(`[${m}]`, this.methodColors[m] || this.colors.white)
        )
        .join(" ");

      let nodeDisplay = key;
      if (currentNode._meta.isEndpoint) {
        nodeDisplay = this.colorize(key, this.colors.bright + this.colors.cyan);
        if (methods) {
          nodeDisplay += ` ${methods}`;
        }
      } else {
        nodeDisplay = this.colorize(key, this.colors.dim);
        if (currentNode._meta.hasChildren) {
          nodeDisplay += this.colorize("/", this.colors.dim);
        }
      }

      console.log(`${prefix}${connector}${nodeDisplay}`);
      this.printTree(currentNode._children, childPrefix, isLastChild);
    });
  }

  /**
   * Display statistics
   */
  displayStats(stats) {
    console.log(
      `\n${this.colorize("📊 ROUTE STATISTICS:", this.colors.bright)}`
    );
    console.log(
      `  ${this.colorize("• Total Routes:", this.colors.white)} ${this.colorize(
        stats.totalRoutes,
        this.colors.cyan
      )}`
    );
    console.log(
      `  ${this.colorize(
        "• Unique Prefixes:",
        this.colors.white
      )} ${this.colorize(stats.uniquePrefixes, this.colors.cyan)}`
    );
    console.log(
      `  ${this.colorize(
        "• Static Routes:",
        this.colors.white
      )} ${this.colorize(stats.statusCodes.staticRoutes, this.colors.green)}`
    );
    console.log(
      `  ${this.colorize("• Param Routes:", this.colors.white)} ${this.colorize(
        stats.statusCodes.withParams,
        this.colors.yellow
      )}`
    );

    console.log(`\n  ${this.colorize("• Methods:", this.colors.white)}`);
    Object.entries(stats.methodCount)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([method, count]) => {
        const color = this.methodColors[method] || this.colors.white;
        console.log(
          `    ${this.colorize("├─", this.colors.dim)} ${this.colorize(
            method.padEnd(6),
            color
          )}: ${this.colorize(count, this.colors.cyan)}`
        );
      });
  }

  /**
   * Group routes by their prefix
   */
  groupRoutesByPrefix(routes) {
    const grouped = {};

    routes.forEach((route) => {
      const prefix = route.prefix;
      if (!grouped[prefix]) {
        grouped[prefix] = [];
      }
      grouped[prefix].push(route);
    });

    return grouped;
  }

  /**
   * Display routes in JSON format
   */
  displayJSON(routes, stats) {
    const output = {
      metadata: {
        generatedAt: new Date().toISOString(),
        debugMode: process.env.DEBUG_MODE === "true",
        options: this.options,
        version: "2.1.0"
      },
      statistics: stats,
      routes: routes.map((route) => ({
        methods: route.methods,
        path: route.path,
        prefix: route.prefix,
        fullPath: route.fullPath,
        handlerCount: route.stack
      }))
    };

    console.log(JSON.stringify(output, null, 2));
  }

  /**
   * Display minimal output
   */
  displayMinimal(routes) {
    routes.forEach((route) => {
      const methods = route.methods.join(",").toUpperCase();
      console.log(`${methods.padEnd(10)} ${route.path}`);
    });
  }

  /**
   * Main debug method
   */
  debug() {
    try {
      const routeData = this.extractRoutes();

      switch (this.options.outputFormat) {
        case "json":
          this.displayJSON(routeData.routes, routeData.stats);
          break;
        case "tree":
          this.displayTree(routeData.routes, routeData.stats);
          break;
        case "minimal":
          this.displayMinimal(routeData.routes);
          break;
        case "table":
        default:
          this.displayTable(routeData.routes, routeData.stats);
      }

      return routeData;
    } catch (error) {
      console.error(
        `${this.colorize("❌ Route Debugger Error:", this.colors.red)} ${
          error.message
        }`
      );
      if (process.env.DEBUG_MODE === "true") {
        console.error(error.stack);
      }
      return null;
    }
  }

  /**
   * Generate route documentation
   */
  generateDocumentation(routes) {
    const doc = {
      title: "API Route Documentation",
      version: "1.0.0",
      generated: new Date().toISOString(),
      baseURL: `http://localhost:${process.env.PORT || 3000}`,
      description: "Auto-generated API documentation from route definitions",
      endpoints: []
    };

    routes.forEach((route) => {
      route.methods.forEach((method) => {
        doc.endpoints.push({
          method,
          path: route.path,
          fullPath: `${doc.baseURL}${route.path}`,
          prefix: route.prefix,
          description: this.generateRouteDescription(method, route.path),
          parameters: this.extractParameters(route.path)
        });
      });
    });

    return doc;
  }

  /**
   * Extract parameters from route path
   */
  extractParameters(path) {
    const params = [];
    const paramRegex = /:(\w+)/g;
    let match;

    while ((match = paramRegex.exec(path)) !== null) {
      params.push({
        name: match[1],
        in: "path",
        required: true,
        description: `URL parameter: ${match[1]}`
      });
    }

    return params;
  }

  /**
   * Generate descriptive text for routes
   */
  generateRouteDescription(method, path) {
    const pathParts = path.split("/").filter((part) => part);
    const resource = pathParts[0] || "root";
    const action = pathParts[1] || "";

    const descriptions = {
      GET: `Retrieve ${action || resource} data`,
      POST: `Create new ${action || resource}`,
      PUT: `Update entire ${action || resource}`,
      PATCH: `Partially update ${action || resource}`,
      DELETE: `Remove ${action || resource}`
    };

    return descriptions[method] || `${method} operation on ${path}`;
  }
}

/**
 * Factory function for quick usage
 */
function createRouteDebugger(options = {}) {
  return new AdvancedRouteDebugger(options);
}

/**
 * Quick debug function (backward compatibility)
 */
function routeDebugger(app = null, options = {}) {
  const debuggerInstance = new AdvancedRouteDebugger({
    app: app || require("../app"),
    ...options
  });

  return debuggerInstance.debug();
}

/**
 * Export route data for external use
 */
function getRouteData(app = null, options = {}) {
  const debuggerInstance = new AdvancedRouteDebugger({
    app: app || require("../app"),
    outputFormat: "json",
    colorOutput: false,
    ...options
  });

  return debuggerInstance.extractRoutes();
}

// Export everything
module.exports = {
  AdvancedRouteDebugger,
  createRouteDebugger,
  routeDebugger,
  getRouteData,
  default: routeDebugger
};
