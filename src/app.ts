import express, {Application, Request, Response, NextFunction} from 'express';
const database = require('./controllers/controller');
const {createDataBase, 
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
    returnBookToBooks} = require('./controllers/controller');

const app: Application = express();

// Вызов функции для создания базы данных
app.get('/createdatabase' , (req: Request , res: Response) => {
    createDataBase(req, res)
})

// Вызов функции для создания таблицы пользователей
app.get('/createuserstable' , (req: Request , res: Response) => {
    createUsersTable(req, res)
})

// Вызов функции для создания таблицы книг
app.get('/createbookstable' , (req: Request , res: Response) =>{
    createBooksTable(req, res)
})

// Вызов фукнции для создания нового пользователя
app.get('/adduser/:userName' , (req: Request , res: Response) => {
    addNewUser(req, res)
})

// Вызов функции для редактирования пользователя по userId
app.get('/edituser/:userId/:newName' , (req: Request , res: Response) => {
    editUserInfo(req, res)
})

// Вызов функции для удаления пользователя по userId
app.get('/deleteuser/:userId' , (req: Request , res: Response) => {
    deleteUserInfo(req, res)
})

// Вызов функции для выдачи абонемента
app.get('/givepass/:userId' , (req: Request , res: Response) => {
    givePassToUser(req, res)
})

// Вызов функции для получения списка всех пользователей
app.get('/getusers' , (req: Request , res: Response)=>{
    getAllUsers(req, res)
})

// Вызов функции для получения информации об одном пользователе
app.get('/getuser/:userId' , (req: Request , res: Response) => {
    getUser(req, res)
})

// Вызов функции для добавления книги в таблицу
app.get('/addbook/:bookTitle' , (req: Request , res: Response) => {
    addBookToBooks(req, res)
})

// Вызов функции для выдачи книги пользователю
app.get('/givebook/:userId/:bookId' , (req: Request , res: Response) => {
    giveBookToUser(req, res)
})

// Вызов функции для возвращения книги
app.get('/returnbook/:userId/:bookId' , (req: Request , res: Response) => {
    returnBookToBooks(req, res)
})

app.listen(3000 , ()=> 
    console.log('Server is up and running on port : ' + 3000)
)
