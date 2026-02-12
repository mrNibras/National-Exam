const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ msg: 'Forbidden: User role not found.' });
    }

    const rolesArray = [...allowedRoles];

    if (!rolesArray.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Forbidden: You do not have permission to perform this action.' });
    }

    next();
  };
};

module.exports = authorize;