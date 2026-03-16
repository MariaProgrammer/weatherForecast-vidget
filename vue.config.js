// vue.config.js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // ВАЖНО: Укажите здесь имя вашего репозитория.
  // Если ваш репозиторий https://github.com/user/my-project,
  // то здесь должно быть '/my-project/'
  publicPath: '/weatherForecast-vidget/' 
})
