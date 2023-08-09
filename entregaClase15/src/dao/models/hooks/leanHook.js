function leanPreHook(next) {
    this.lean();
    next();
}

module.exports = leanPreHook;
