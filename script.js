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