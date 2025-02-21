# Notes Manager

Современное веб-приложение для управления заметками с аутентификацией пользователей.

## Технологии

- Frontend: React + TypeScript
- Backend: Express + Node.js
- База данных: PostgreSQL
- ORM: Drizzle
- Аутентификация: Passport.js
- Стилизация: Tailwind CSS + shadcn/ui

## Развертывание на Render.com

1. Форкните этот репозиторий на GitHub
2. Создайте аккаунт на Render.com
3. На дашборде Render нажмите "New +" и выберите "Web Service"
4. Подключите ваш форк репозитория
5. Настройте следующие параметры:
   - Name: notes-manager (или любое другое)
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
6. Нажмите "Create Web Service"

Render автоматически:
- Создаст PostgreSQL базу данных
- Настроит все необходимые переменные окружения
- Развернет приложение и предоставит URL для доступа

## Локальный запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/yourusername/notes-manager.git
cd notes-manager
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл .env и настройте переменные окружения:
```
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key
```

4. Запустите приложение в режиме разработки:
```bash
npm run dev
```

## Функциональность

- Регистрация и аутентификация пользователей
- Создание, редактирование и удаление заметок
- Просмотр списка заметок
- Защищенный доступ к заметкам