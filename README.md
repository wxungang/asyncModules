## async-modules
- 基于requireJs实现的异步模块化。
- 更好的模块化实现推荐使用reactJs、vueJs。配合webpack、ES6等可以实现大型应用的组件化和模块化。

### 使用场景
- 基于jquery或者zepto的传统开发模式，通过requireJs实现统一的API。
- 项目成员使用各模块功能时，不在需要自行管理模块依赖，只需要关注自己的业务逻辑实现。
- 通过项目成员根据业务的发展新增和共享更多的异步模块，而不用担心首次加载过于庞大的性能问题，可以极大的提升团队的开发效率。

## how to use
- 引用 personal.js和util 文件即可参考接口文档使用相应的API。
- 当然部署到生产环境中可以用过grunt或者gulp打包合并这两个文件。
- 至于各个模块中的依赖文件，对于调用者完全不用关心。相应模块都会先处理依赖再执行逻辑代码。

## todo
- 完善文档（当然有同学愿意pull更好...）
- 新增更多常用模块
- 根据反馈及时更新

## suggest
- 欢迎在 issues 中反馈问题和建议
- 也可以邮件联系：wxungang@163.com
- 新的一年里开始整理梳理自己零散的实现和想法，多多包涵。

## others public repositories
- [1104 components](https://github.com/wxungang/1104)
- [personal ui](https://github.com/wxungang/personal-ui)
- [async modules](#)
- [vueJs components](#)
- [reactJs components](#)