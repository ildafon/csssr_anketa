

### Установи модули

```
npm i
```

или в разы в быстрее c [yarn](https://github.com/yarnpkg/yarn)

```
yarn install
```

### Запусти
npm start
```


## Команды для запуска

### Запуск с отслеживанием изменений
```
npm start
```

### Создание нового блока
Для создания нескольких блоков, названия нужно указывать через пробел.
```
npm run make-block [имя-блока] [имя-блока]
```

### Сборка в папку `dist`
```
npm run build
```

### Production cборка в папку `dist`
```
npm run production
```

### Локальный сервер на другом порте
```
PORT=9000 npm start
```

### Уведомления об ошибках `ESLint`
```
NOTIFY=true npm start
```

### Расшарить локальный сервер
```
TUNNEL=true npm start
```

### Открыть ссылку в браузере по умолчанию
```
OPEN=true npm start
```

### Собрать архив из папки `dist`
```
npm run zip
```

### Очистка папки `dist`
```
npm run clean
```

### Деплой всего содержимого папки `dist` в ветку `dist`
```
npm run deploy
```
