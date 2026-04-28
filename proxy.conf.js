const ADMIN_TOKEN = 'token 764ae0b7b89ab0f:944d939f51e9336';

// Paths that should use Admin API key instead of user session cookie
const PUBLIC_RESOURCE_PATTERNS = [
  '/api/resource/Website%20Item',
  '/api/resource/Website Item',
  '/api/resource/Item',
  '/api/resource/Item%20Price',
  '/api/resource/Item Price',
  '/api/resource/Item%20Review',
  '/api/resource/Item Review',
  '/api/resource/Quotation',
  '/all-products'
];

// Paths that must always use user session cookie (never admin token)
const USER_SESSION_PATTERNS = [
  '/api/method/login',
  '/api/method/logout',
  '/api/method/frappe.auth',
  '/api/resource/User',
  '/api/method/erpnext.shopping_cart',
  '/api/method/erpnext.e_commerce.shopping_cart',
  '/api/method/webshop.shopping_cart',
  '/api/method/webshop.webshop.shopping_cart'
];

function isPublicResource(url) {
  // Never treat user session paths as public
  if (USER_SESSION_PATTERNS.some(pattern => url.includes(pattern))) {
    return false;
  }
  return PUBLIC_RESOURCE_PATTERNS.some(pattern => url.includes(pattern));
}

module.exports = {
  "/all-products": {
    target: "https://ketty.hrhovercraft.in",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    onProxyReq: function (proxyReq) {
      proxyReq.removeHeader('cookie');
      proxyReq.setHeader('Authorization', ADMIN_TOKEN);
    },
    onProxyRes: function (proxyRes) {
      delete proxyRes.headers['set-cookie'];
    }
  },
  "/api/*": {
    target: "https://ketty.hrhovercraft.in",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    cookieDomainRewrite: "localhost",
    cookiePathRewrite: "/",
    onProxyReq: function (proxyReq, req) {
      req._isPublicResource = isPublicResource(req.url);

      if (req._isPublicResource) {
        // For public/admin resources: strip user cookie, use admin API key
        proxyReq.removeHeader('cookie');
        proxyReq.setHeader('Authorization', ADMIN_TOKEN);
      }
      proxyReq.setHeader('Host', 'ketty.hrhovercraft.in');
    },
    onProxyRes: function (proxyRes, req, res) {
      if (req._isPublicResource) {
        // CRITICAL: Remove Set-Cookie from admin-token requests
        // to prevent sid=Guest from overwriting the user's session.
        delete proxyRes.headers['set-cookie'];
        return;
      }

      // For user-authenticated requests, fix cookies for localhost
      const setCookie = proxyRes.headers['set-cookie'];
      if (setCookie) {
        proxyRes.headers['set-cookie'] = setCookie.map(cookie => 
          cookie.replace(/;\s*Secure/gi, '')
                .replace(/;\s*SameSite=None/gi, '; SameSite=Lax')
                .replace(/domain=[^;]+/gi, 'domain=localhost')
        );
      }
    }
  },
  "/files/*": {
    target: "https://ketty.hrhovercraft.in",
    secure: false,
    changeOrigin: true,
    logLevel: "debug"
  },
  "/private/*": {
    target: "https://ketty.hrhovercraft.in",
    secure: false,
    changeOrigin: true,
    logLevel: "debug"
  }
};
