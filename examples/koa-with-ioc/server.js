const Koa = require('koa');

class Server {
  run() {
    const app = new Koa();
    app.use(async (ctx) => {
      ctx.body = this.userService.getUser();
    });
    app.listen(3000);
    console.log('server listen at 3000.');
  }
}

module.exports = Server;
