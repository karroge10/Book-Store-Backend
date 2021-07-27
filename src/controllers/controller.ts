const Model = require('../models/model');
import express, {Application, Request, Response, NextFunction} from 'express';
import mysql from 'mysql';

// Параметры базы данных и подключение MySQL.
// удалить 11 строку если нужно создать бд, после создания вставить обратно чтобы подключиться к бд.
const database = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password: '',
    database: 'librarysql'
});
database.connect((error: any) => {
    if (error){
        throw error;
    } else{
        console.log('Sql подключен')
    }
})

// Функция для создания базы данных
async function createDataBase(req: Request , res: Response) {
    try {
        const sql = await Model.newDatabase()
        database.query(sql, (error: any, result: any) => {
            if (error) {
                console.log(error)
            } else {
                console.log(result)
                res.send('База данных создана...');
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// Функция для создания таблицы пользователей
async function createUsersTable(req: Request , res: Response) {
    try {
        const sql = await Model.newUsersTable()
        database.query(sql, (error: any, result: any) => {
            if (error) {
                console.log(error)
            } else {
                console.log(result)
                res.send('Таблица пользователей создана...');
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// Функция для создания таблицы книг
async function createBooksTable(req: Request , res: Response) {
    try {
        const sql = await Model.newBooksTable()
        database.query(sql, (error: any, result: any) => {
            if (error) {
                console.log(error)
            } else {
                console.log(result)
                res.send('Таблица книг создана...');
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// Функция для создания нового пользователя
// Изначально абонемента и книг нет, поэтому pass и books = 0
async function addNewUser(req: Request , res: Response) {
    try {
        const sql = await Model.newUser()
        let user = {userName: database.escape(req.params.userName), pass: 0, books: 0}
        let query = database.query(sql, user, (error: any, result: any) => {
            if (error) {
                console.log(error)
            } else {
                console.log(result)
                res.send('Пользователь ' + database.escape(req.params.userName) + ' добавлен...');
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// Функция для редактирования пользователя по userId
async function editUserInfo(req: Request , res: Response) {
    try {
        const sql = await Model.editUser(database.escape(req.params.newName), database.escape(req.params.userId))
        let query = database.query(sql, (error: any, result: any) => {
            if (error) {
                console.log(error)
            } else {
                console.log(result)
                res.send('Имя пользователя (id: ' + database.escape(req.params.userId) +') изменено на ' + database.escape(req.params.newName) + ' ...');
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// Функция для удаления пользователя по userId
async function deleteUserInfo(req: Request , res: Response) {
    try {
        // Удаляем пользователя из таблицы
        const sqlUsers = await Model.deleteUser(database.escape(req.params.userId))
        let queryUsers = database.query(sqlUsers, (error: any, result: any) => {
            if (error) {
                console.log(error)
            } else {
                console.log(result)
            }
        })
        // Освобождаем книги, которыми владел пользователь
        const sqlBooks = await Model.deleteUserBooks(database.escape(req.params.userId))
        let queryBooks = database.query(sqlBooks, (error: any, result: any) => {
        if (error) throw error;
            console.log(result)
            res.send('Пользователь (id: ' + database.escape(req.params.userId) + ') удален...');
        })
    } catch (error) {
        console.log(error)
    }
}

// Функция для выдачи абонемента пользователю по userId
async function givePassToUser(req: Request , res: Response) {
    try {
        const sql = await Model.givePass(database.escape(req.params.userId))
        let query = database.query(sql, (error: any, result: any) => {
            if (error) {
                console.log(error)
            } else {
                console.log(result)
                // Проверяем есть ли абонемент
                if (result.affectedRows == 0) {
                    res.send('У пользователя (id: ' + database.escape(req.params.userId) +') уже есть абонемент...');
                } else {
                    res.send('Пользователю (id: ' + database.escape(req.params.userId) +') выдан абонемент...');
                }
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// Функция для получения списка пользователей
async function getAllUsers(req: Request , res: Response) {
    try {
        const sql = await Model.getUsers()
        let query = database.query(sql, (error: any, results: any) => {
            if (error) {
                console.log(error)
            } else {
                results = 'Список всех пользователей: ' + JSON.stringify(results, null, 4);
                console.log(results)
                res.send(results)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// Функция для получения информации о пользователе
async function getUser(req: Request , res: Response) {
    try {
        const sqlUser = await Model.getUserInfo(database.escape(req.params.userId))
        const sqlBooks = await Model.getUserBooks(database.escape(req.params.userId))

        // Из таблицы users получаем строку, где совпадает userId, из books - строки, где совпадают ownerId.
        // Объединяем результат в один массив и выводим информацию.
        let query = database.query(sqlUser, (error: any, result: any) => {
            if (error) {
                console.log(error)
            } else {
                let userRes = result;
                let queryBooks = database.query(sqlBooks, (error: any, result: any) => {
                    if (error) throw error;
                    result.splice(0, 0, userRes[0])
                    result = 'Информация по пользователе: ' + JSON.stringify(result, null, 4)
                    console.log(result)
                    res.send(result);
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// Добавить книгу (Изначально книгу еще не взяли, поэтому ownerId = 0)
async function addBookToBooks(req: Request , res: Response) {
    try {
        let book = {bookTitle: database.escape(req.params.bookTitle), ownerId: 0}
        const sql = await Model.addBook()
        let query = database.query(sql, book, (error: any, result: any) => {
            if (error) {
                console.log(error)
            } else {
                console.log(result)
                res.send('Книга ' + database.escape(req.params.bookTitle) + ' добавлена...');
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// Выдать книгу, если у пользователя есть абонемент, не больше 5 книг, а у книги еще нет владельца.
async function giveBookToUser(req: Request , res: Response) {
    try {
        const sql = await Model.giveBook(database.escape(req.params.userId), database.escape(req.params.bookId))
        let query = database.query(sql, (error: any, result: any) => {
            if (error) {
                console.log(error)
            } else {
                if (result.affectedRows == 0) {
                    res.send('Пользователь (id: ' + database.escape(req.params.userId) +') не может взять книгу (id: ' + database.escape(req.params.bookId) + ')...');
                } else {
                    res.send('Пользователь (id: ' + database.escape(req.params.userId) +') взял книгу (id: ' + database.escape(req.params.bookId) + ')...');
                }
            }
        })
    } catch (error) {
        console.log(error)
    }
}


// Вернуть книгу
async function returnBookToBooks(req: Request , res: Response) {
    try {
        const sql = await Model.returnBook(database.escape(req.params.userId), database.escape(req.params.bookId))
        let query = database.query(sql, (error: any, result: any) => {
            if (error) {
                console.log(error)
            } else {
                if (result.affectedRows == 0) {
                    res.send('Пользователь (id: ' + database.escape(req.params.userId) +') не может вернуть книгу (id: ' + database.escape(req.params.bookId) + ')...');
                } else {
                    res.send('Пользователь (id: ' + database.escape(req.params.userId) +') вернул книгу (id: ' + database.escape(req.params.bookId) + ')...');
                }
            }
        })
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    database,
    createDataBase,
    createUsersTable,
    createBooksTable,
    addNewUser,
    editUserInfo,
    deleteUserInfo,
    givePassToUser,
    getAllUsers,
    getUser,
    addBookToBooks,
    giveBookToUser,
    returnBookToBooks
}
