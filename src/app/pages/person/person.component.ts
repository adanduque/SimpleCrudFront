import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Person } from 'src/app/model/person';
import { MatDialog } from '@angular/material/dialog';
import { PersonService } from '../../services/person.service';
import { PersonRegisterComponent } from './person-register/person-register.component';
import { switchMap } from 'rxjs';
import { DialogConfirmComponent } from '../confirm/dialog-confirm/dialog-confirm.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'actions'];
  dataSource: MatTableDataSource<Person>;
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort;
  constructor(private personService: PersonService,private dialog: MatDialog,public dialogConfirm: MatDialog,  private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.getPersons();
  }
  getPersons(){
  this.personService.findAll().subscribe(data => {
    this.createTable(data);
  });
}

    applyFilter(e: any) {
      this.dataSource.filter = e.target.value.trim().toLowerCase();
    }


  openDialog(person? : Person){

    const dialogRef =  this.dialog.open(PersonRegisterComponent, {
      width: '250px',
      data: person
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result){
        this.getPersons();
      }

    });
  }

  delete(idperson: number){

    this.dialogConfirm.open(DialogConfirmComponent, {
      data: `¿Estimado usuario ,estas seguro que desea eliminar este registro?`
    })
    .afterClosed()
    .subscribe((confirmado: Boolean) => {
      if (confirmado) {
        this.personService.delete(idperson).pipe(switchMap( ()=> {
          return this.personService.findAll();
        }))
        .subscribe(data => {
          this.personService.setPersonChange(data);
          this.personService.setMessageChange('DELETED!');
          this.snackBar.open('Success delete', 'Splash', {duration:2000   });
          this.getPersons();
        });


      } else {

      }
    });
}

createTable(person: any){
  this.dataSource = new MatTableDataSource(person);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}
}


