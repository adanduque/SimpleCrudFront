import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PersonService } from '../../../services/person.service';
import { Person } from '../../../model/person';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-person-register',
  templateUrl: './person-register.component.html',
  styleUrls: ['./person-register.component.css']
})
export class PersonRegisterComponent implements OnInit {


  id: number;
  isEdit: boolean=false;
  form: FormGroup;
  textForm :string ='REGISTER';
  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    public dialogRef: MatDialogRef<PersonRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      'idPerson' : new FormControl(0),
      'firstname' : new FormControl('', [Validators.required, Validators.minLength(3)]),
      'lastname' : new FormControl('', [Validators.required, Validators.minLength(5)]),
    });

   if(this.data){
      this.textForm='UPDATE';
      this.id = this.data['idPerson'];
      this.isEdit = this.data['idPerson'] != null;
      console.log(this.isEdit)
      this.initForm();

   }




  }

  initForm(){
    if(this.isEdit){

      this.personService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          'idPerson' : new FormControl(data.idPerson),
          'firstname' : new FormControl(data.firstname, [Validators.required, Validators.minLength(3)]),
          'lastname' : new FormControl(data.lastname, [Validators.required, Validators.minLength(5)]),
        });
      });
    }
  }

  get f() {
    return this.form.controls;
  }



  onNoClick(cargar?:boolean): void {
    this.dialogRef.close(cargar);
  }

  operate() {
    if (this.form.invalid) { return; }

    let person = new Person();
    person.idPerson = this.form.value['idPerson'];
    person.firstname = this.form.value['firstname'];
    person.lastname = this.form.value['lastname'];


    if (this.isEdit) {

      this.personService.update(person).subscribe(() => {
        this.personService.findAll().subscribe(data => {
          this.personService.setPersonChange(data);
          this.personService.setMessageChange('UPDATED!');
          this.snackBar.open('Success update', 'Splash', {duration:2000   });

        });
      });
    } else {

      this.personService.save(person).pipe(switchMap(()=>{
        return this.personService.findAll();
      }))
      .subscribe(data => {
        this.personService.setPersonChange(data);
        this.personService.setMessageChange("CREATED!");
        this.snackBar.open('Success create', 'Splash', {duration:2000   });

      });
    }
    this.onNoClick(true);
  }



}
