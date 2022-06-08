let myLibrary = [];

function Book(title, author, NumOfPages, haveRead) {
    this.title = title;
    this.author = author
    this.pages = NumOfPages;
    this.read = haveRead;
    this.info = function() {
        return this.title + " by " + this.author + ", " + this.pages + " pages, " + (this.read ? "already read" : "not read yet");
    }
}

function addBookToLibrary(book) {
    myLibrary.push(book);
}

function BookCard(id, title, author, pages, read) {
    const divBook = document.createElement("article");
    const h3Title = document.createElement("h3");
    const pAuthor = document.createElement("p");
    const btnRemove = document.createElement("button");
    const iTrash = document.createElement("i");
    const pPages = document.createElement("p");
    const btnRead = document.createElement("button");
    divBook.className = "book";
    divBook.id = id;
    h3Title.className = "title";
    pAuthor.className = "author";
    btnRemove.className = "remove";
    iTrash.className = "fa-solid fa-trash";
    pPages.className = "pages";
    btnRead.className = "status";
    btnRemove.type = "button";
    btnRead.type = "button";
    btnRemove.append(iTrash);
    divBook.append(h3Title, pAuthor, btnRemove, pPages, btnRead)
    btnRemove.onclick = clickBookRemove;
    btnRead.onclick = clickReadStatus;

    h3Title.textContent = title;
    pAuthor.textContent = author;
    pPages.textContent = pages;
    btnRead.textContent = read ? "read" : "not read";

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

const formAddBook = document.querySelector("form");
const sectionAddBook = document.querySelector(".add-book-hidden")
const sectionAddBookBtnCancel = document.querySelector("#cancel")

function clickAddBookBtn(e) {
    e.stopPropagation();
    sectionAddBook.removeEventListener("click", clickAddBookBtn);
    sectionAddBook.className = "add-book";
}

function clickAddBookCancel(e) {
    e.stopPropagation();
    sectionAddBook.addEventListener("click", clickAddBookBtn);
    sectionAddBook.className = "add-book-hidden";
}

function handleSubmitBookAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    sectionAddBook.addEventListener("click", clickAddBookBtn);
    sectionAddBook.className = "add-book-hidden";

    const inputTitle = document.querySelector("input#title");
    const inputAuthor = document.querySelector("input#author");
    const inputPages = document.querySelector("input#pages");
    const inputRead = document.querySelector("input#read");

    console.log(inputRead);
    let newBook = new Book(inputTitle.value, inputAuthor.value, parseInt(inputPages.value), inputRead.checked)
    addBookToLibrary(newBook);
    displayLibrary(myLibrary);
}

sectionAddBook.addEventListener("click", clickAddBookBtn);
sectionAddBookBtnCancel.addEventListener("click", clickAddBookCancel);
formAddBook.onsubmit = handleSubmitBookAdd;

const btnBookRemove = document.querySelectorAll("article.book .remove");

function clickBookRemove(e) {
    e.stopPropagation;
    const book = e.path.find(element => {
        return element.id;
    });
    myLibrary.splice(book.id, 1);
    displayLibrary(myLibrary);
}

function clickReadStatus(e) {
    e.stopPropagation;
    let status = e.target.textContent === "read";
    status = !status;
    const book = e.path.find(element => {
        return element.id;
    });
    myLibrary[book.id].read = status;
    console.log(myLibrary[book.id].read);
    e.target.textContent = status ? "read" : "not read";
}

let book1 = new Book("The Lord of the Rings", "J. R. R. Tolkien", 672, false);
let book2 = new Book("book number 2", "my", 42, true);
addBookToLibrary(book1);
addBookToLibrary(book2);
displayLibrary(myLibrary);