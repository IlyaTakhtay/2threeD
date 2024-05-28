import { defineConfig } from 'vite'

export default defineConfig({
  root: 'MVC', // указываем корневую папку проекта
  build: {
    outDir: '../dist' // указываем, что собранные файлы должны быть в папке на уровень выше
  }
})