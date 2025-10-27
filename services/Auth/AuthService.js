const jwtUtils = require("../../utils/jwtUtils");
class AuthService {
    async loginLocal(userId) {
        return jwtUtils.generateToken(userId)
    }
}

module.exports = new AuthService();
