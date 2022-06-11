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

class BookCard {
    card = document.createElement("article");
    book

    constructor(book, bookId) {
        const title = this.#createElement("h3", "title", book.title);
        const author = this.#createElement("p", "author", book.author);
        const pages = this.#createElement("p", "pages", book.pages);
        const remove = this.#createRemoveBtn();
        const isRead = this.#createIsReadBtn(book.isRead);

        this.card.className = "book";
        this.card.id = bookId;
        this.card.append(title, author, remove, pages, isRead)      
    }
    #createElement(tagName, className, textContent) {
        let element = document.createElement(tagName);
        element.className = className;
        element.textContent = textContent;
        return element;
    }

    #createRemoveBtn() {
        const remove = document.createElement("button");
        const trash = document.createElement("i");

        remove.className = "remove";
        remove.type = "button";

        trash.className = "fa-solid fa-trash";
        remove.append(trash);
        remove.onclick = this.#clickBookRemove;
        return remove;
    }
    #createIsReadBtn(isRead) {
        const element = document.createElement("button");
        element.className = "status";
        element.type = "button";
        element.onclick = this.#clickReadStatus;        
        element.textContent = isRead ? "read" : "not read";  
        return element;
    }

    #clickBookRemove(e) {
        e.stopPropagation;
        // finds the first element with an id prop
        const bookElement = e.composedPath().find(element => {
            return element.id;
        });
        myLibrary.removeBookAt(bookElement.id);
        saveLibraryLocally();
        displayLibrary(myLibrary.books);
    }
    
    #clickReadStatus(e) {
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
}

function displayLibrary(library) {
    const divBooks = document.querySelector(".books");

    divBooks.innerHTML = "";

    library.forEach((book, id) => {
        const bc = new BookCard(book, id);
        divBooks.append(bc.card);
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