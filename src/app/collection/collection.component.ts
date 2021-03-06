import { Component, OnInit } from '@angular/core';
import { IBook } from '../ibook';
import { MatSnackBar, MatDialog } from '@angular/material';
import { DataService } from '../data.service';
import { BookDetailComponent } from '../book-detail/book-detail.component';
import { Router } from '@angular/router';
import { NewBookComponent } from '../new-book/new-book.component';

@Component({
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  // << ------------------ >>
  // << PROPERTIES - START >>
  // << ------------------ >>
  pageTitle: string = 'Books';
  public books: Array<IBook>;
  startTime: Date;
  endTime: Date;
  showOperatingHours: boolean = false;
  // << ---------------- >>
  // << PROPERTIES - END >>
  // << ---------------- >>

  // << ---------------- >>
  // << METHODS - START >>
  // << ---------------- >>
  constructor(private _snackBar: MatSnackBar, private _dataService: DataService,
              private _dialog: MatDialog, private _router: Router) {
    this.startTime = new Date();
    this.startTime.setHours(10, 0);
    this.endTime = new Date();
    this.endTime.setHours(15, 0);
  }

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks(): void {
    this._dataService.getBooks()
        .subscribe(books => this.books = books,
                   error => this.updateMessage(<any>error, 'ERROR'));
  }

  addBook(): void {
    const config = {width: '650px', height: '650x', position: {top: '50px'}, disableClose: true};
    const dialogRef = this._dialog.open(NewBookComponent, config);
    dialogRef.afterClosed().subscribe(newBook => {
      if (newBook) {
        newBook.id = this.books.length + 1;
        this._dataService.addBook(newBook)
            .subscribe(books => this.books = books,
                       error => this.updateMessage(<any>error, 'ERROR'));
      }
    });
  }

  updateBook(book: IBook): void {
    this._dataService.updateBook(book)
        .subscribe(books => {
          this.books = books;
          this._snackBar.open(`'${book.title}' has been updated!`, 'DISMISS', {
            duration: 3000
          });
        },
        error => this.updateMessage(<any>error, 'ERROR'));
  }

  openDialog(bookId: number): void {
    const config = { width: '650px', height: '400x', position: { top: '50px' } };
    const dialogRef = this._dialog.open(BookDetailComponent, config);
    dialogRef.componentInstance.bookId = bookId;
    dialogRef.afterClosed().subscribe(res => {
        this.getBooks();
    });
  }

  openRoute(bookId: number): void {
    this._router.navigate(['/collection', bookId]);
  }

  updateMessage(message: string, type: string): void {
    if (message) {
      this._snackBar.open(`${type}: ${message}`, 'DISMISS', {
          duration: 3000
      });
    }
  }

  onRatingUpdate(book: IBook): void {
    this.updateBook(book);
    this.updateMessage(book.title, 'Rating has been updated');
  }
  // << ------------- >>
  // << METHODS - END >>
  // << ------------- >>
}
