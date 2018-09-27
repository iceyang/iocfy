class UserService {
  getUser() {
    return this.userModel.findOne();
  }
}

module.exports = UserService;
