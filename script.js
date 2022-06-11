const sectionAddBook = document.querySelector("#add-book")
const sectionAddBookBtnCancel = document.querySelector("#cancel")
const formAddBook = document.querySelector("form");

class Book {
    constructor(title, author, NumOfPages, haveRead) {
        this.title = title;
        this.author = author
        this.pages = NumOfPages;
        this.isRead = haveRead;
    }
    info() {
        return this.title + " by " + this.author + ", " + this.pages + " pages, " + (this.isRead ? "already read" : "not read yet");
    }
}

class Library {
    books = [];

    addBook(book){
        this.books.push(book);
        saveLibraryLocally();
    }

    removeBook(book) {
        let index = this.books.findIndex(book);
        this.books.splice(index, 1);
    }

    removeBookAt(index) {
        this.books.splice(index, 1);
    }

    static fromJson(json) {
        return Object.assign(new Library(), json);
    }
}

function BookCard(bookId, title, author, pages, isRead) {
    const divBook = document.createElement("article");
    const h3Title = document.createElement("h3");
    const pAuthor = document.createElement("p");
    const btnRemove = document.createElement("button");
    const iTrash = document.createElement("i");
    const pPages = document.createElement("p");
    const btnIsRead = document.createElement("button");
    divBook.className = "book";
    divBook.id = bookId;
    h3Title.className = "title";
    pAuthor.className = "author";
    btnRemove.className = "remove";
    iTrash.className = "fa-solid fa-trash";
    pPages.className = "pages";
    btnIsRead.className = "status";
    btnRemove.type = "button";
    btnIsRead.type = "button";
    btnRemove.append(iTrash);
    divBook.append(h3Title, pAuthor, btnRemove, pPages, btnIsRead)
    btnRemove.onclick = clickBookRemove;
    btnIsRead.onclick = clickReadStatus;

    h3Title.textContent = title;
    pAuthor.textContent = author;
    pPages.textContent = pages;
    btnIsRead.textContent = isRead ? "read" : "not read";

    return divBook;
}

function displayLibrary(library) {
    const divBooks = document.querySelector(".books");

    divBooks.innerHTML = "";

    library.forEach((book, id) => {
        const divBook = BookCard(id, book.title, book.author, book.pages, book.read)
        divBooks.append(divBook);
    });
}

function clickShowAddBookBtn(e) {
    e.stopPropagation();
    sectionAddBook.removeEventListener("click", clickShowAddBookBtn);
    sectionAddBook.className = "add-book";
}

function clickAddBookCancel(e) {
    e.stopPropagation();
    sectionAddBook.addEventListener("click", clickShowAddBookBtn);
    sectionAddBook.className = "add-book-hidden";
}

function submitAddBook(e) {
    e.preventDefault();
    sectionAddBook.addEventListener("click", clickShowAddBookBtn);
    sectionAddBook.className = "add-book-hidden";
    
    const inputTitle = document.querySelector("input#title");
    const inputAuthor = document.querySelector("input#author");
    const inputPages = document.querySelector("input#pages");
    const inputRead = document.querySelector("input#read");
    
    let newBook = new Book(inputTitle.value, inputAuthor.value, parseInt(inputPages.value), inputRead.checked)
    myLibrary.addBook(newBook);
    displayLibrary(myLibrary.books);
}

function clickBookRemove(e) {
    e.stopPropagation;
    // finds the first element with an id prop
    const bookElement = e.composedPath().find(element => {
        return element.id;
    });
    myLibrary.removeBookAt(bookElement.id);
    saveLibraryLocally();
    displayLibrary(myLibrary.books);
}

function clickReadStatus(e) {
    e.stopPropagation;
    let status = e.target.textContent === "read";
    status = !status;
    const book = e.composedPath().find(element => {
        return element.id;
    });
    myLibrary.books[book.id].read = status;
    saveLibraryLocally();
    e.target.textContent = status ? "read" : "not read";
}

function saveLibraryLocally() {
    console.log(JSON.stringify(myLibrary));
    localStorage.setItem("library", JSON.stringify(myLibrary));
}

function getLibraryFormLocalStorage() {
    let j = localStorage.getItem("library");
    j = JSON.parse(j)
    return Library.fromJson(j);
}

function app() {
    sectionAddBook.addEventListener("click", clickShowAddBookBtn);
    sectionAddBookBtnCancel.addEventListener("click", clickAddBookCancel);
    formAddBook.onsubmit = submitAddBook;
    
    let storedLib = getLibraryFormLocalStorage();
    if (storedLib != null) {
        myLibrary = storedLib;
    }
    displayLibrary(myLibrary.books);
}

let myLibrary = new Library();
app();