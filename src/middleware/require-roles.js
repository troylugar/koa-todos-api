const NOT_AUTHORIZED = { status: 401 };

function requireRoles(requiredRoles) {
  return function hasRoles(ctx, next) {
    if (!ctx.token || !ctx.token.roles) return NOT_AUTHORIZED;
    const hasRequiredRoles = !requiredRoles
      .map(x => ctx.token.roles.includes(x))
      .includes(false);
    if (!hasRequiredRoles) return NOT_AUTHORIZED;
    next(ctx);
  };
}

module.exports = requireRoles;