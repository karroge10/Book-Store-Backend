# Book Store Backend
 Backend build with Node.js and MySQL

## Использование

### Подключится к Apache и MySQL в XAMPP.
Для запуска сервера и базы данных.

### `npm start`
Для запуска.
[http://localhost:3000](http://localhost:3000) в браузере.

### `npm run dev`
Для запуска в режиме разработки.
[http://localhost:3000](http://localhost:3000) в браузере.

### `http://localhost:3000/createdatabase`
метод для создания базы данных.

### `http://localhost:3000/createuserstable`
метод для создания таблицы пользователей.

### `http://localhost:3000/createbookstable`
метод для создания таблицы книг.

### `http://localhost:3000/adduser/имя`
метод для добавления пользователя.

### `http://localhost:3000/edituser/id_пользователя/новое_имя`
метод для редактирования пользователя.

### `http://localhost:3000/deleteuser/id_пользователя`
метод для удаления пользователя.

### `http://localhost:3000/givepass/id_пользователя`
метод для установки того что пользователь купил абонемент

### `http://localhost:3000/getusers`
метод для получения списка всех пользователей

### `http://localhost:3000/getuser/id_пользователя`
метод для получения конкретного пользователя (информация по пользователю + список взятых книг)

### `http://localhost:3000/addbook/название_книги`
метод для добавления книги

### `http://localhost:3000/givebook/id_пользователя/id_книги`
метод для добавления книги к пользователю (когда выдаем книгу пользователю)

### `http://localhost:3000/returnbook/id_пользователя/id_книги`
метод для "возвращения книги" (когда пользователь отдает книгу обратно)
