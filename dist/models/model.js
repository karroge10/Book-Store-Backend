"use strict";
function newDatabase() {
    return new Promise((resolve, reject) => {
        const sql = "CREATE DATABASE librarysql";
        resolve(sql);
    });
}
// userId = номер пользователя, userName = имя пользователя,
// pass = 0: нет абонемента / 1: есть абонемент, books = число взятых книг.
function newUsersTable() {
    return new Promise((resolve, reject) => {
        const sql = "CREATE TABLE users(userId int AUTO_INCREMENT, userName VARCHAR(255), pass int, books int, PRIMARY KEY(userId))";
        resolve(sql);
    });
}
// bookId = номер книги (увеличиваем на 1 при создании новой), bookTitle = название книги, takenBy = userId пользователя, который взял книгу.
function newBooksTable() {
    return new Promise((resolve, reject) => {
        const sql = "CREATE TABLE books(bookId int AUTO_INCREMENT, bookTitle VARCHAR(255), ownerId int, PRIMARY KEY(bookId))";
        resolve(sql);
    });
}
// Вставить нового пользователя в таблицу
function newUser() {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO users SET ?";
        resolve(sql);
    });
}
// Заменить имя на новое
function editUser(name, id) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE users SET userName = ' + name + ' WHERE userId = ' + id;
        resolve(sql);
    });
}
// Удалить пользователя
function deleteUser(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM users WHERE userId = ' + id;
        resolve(sql);
    });
}
// Указать, что книгой никто больше не владеет, при удалении пользователя
function deleteUserBooks(id) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE books SET ownerID = ' + 0 + ' WHERE ownerId = ' + id;
        resolve(sql);
    });
}
// Заменить значение pass у пользователя на 1, если у него оно 0
function givePass(id) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE users SET pass = ' + 1 + ' WHERE userId = ' + id + ' AND pass = 0';
        resolve(sql);
    });
}
// Получить всех пользователей из таблицы
function getUsers() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users";
        resolve(sql);
    });
}
// Получить информацию о пользователе
function getUserInfo(id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE userId = ' + id;
        resolve(sql);
    });
}
// Получить список книг пользователя
function getUserBooks(id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM books WHERE ownerId = ' + id;
        resolve(sql);
    });
}
// Получить список книг пользователя
function addBook() {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO books SET ?";
        resolve(sql);
    });
}
// Увеличить количество книг пользователя на 1, установить ownerId книги на userId пользователя
function giveBook(userId, bookId) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE users, books SET users.books = users.books + ' + 1 + ', books.ownerId = ' + userId +
            ' WHERE users.userId = ' + userId + ' AND users.pass = ' + 1 + ' AND users.books < ' + 5 +
            ' AND books.bookId = ' + bookId + ' AND books.ownerId = ' + 0;
        resolve(sql);
    });
}
// Уменьшить количество книг пользователя на 1, установить ownerId книги на 0.
function returnBook(userId, bookId) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE users, books SET users.books = users.books - ' + 1 + ', books.ownerId = ' + 0 +
            ' WHERE users.userId = ' + userId + ' AND users.books > ' + 0 +
            ' AND books.bookId = ' + bookId + ' AND books.ownerId = ' + userId;
        resolve(sql);
    });
}
module.exports = {
    newDatabase,
    newUsersTable,
    newBooksTable,
    newUser,
    editUser,
    deleteUser,
    deleteUserBooks,
    givePass,
    getUsers,
    getUserInfo,
    getUserBooks,
    addBook,
    giveBook,
    returnBook
};
