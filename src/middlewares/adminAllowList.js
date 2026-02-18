function adminAllowlist(options = {}) {
  const {
    // Emails con permisos completos
    allowedEmails = [],
    // Métodos “solo lectura”
    readOnlyMethods = ["GET", "HEAD", "OPTIONS"],
  } = options;

  // Normaliza a lowercase para comparar bien
  const allowed = new Set(allowedEmails.map((e) => String(e).trim().toLowerCase()));

  return (req, res, next) => {
    // Permite siempre métodos read-only
    if (readOnlyMethods.includes(req.method)) return next();

    // Debe venir el user del middleware JWT
    const email = req.user?.email ? String(req.user.email).toLowerCase() : null;

    if (!email) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowed.has(email)) {
      return res.status(403).json({
        message: "Forbidden: read-only user",
        required: "admin",
      });
    }

    return next();
  };
}

module.exports = {
  adminAllowlist,
};
