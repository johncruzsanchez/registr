import { AbstractControl } from "@angular/forms";

export class CustomValidators{

    // Método estático para validar si dos controles tienen el mismo valor
    static matchValues(toCompare: AbstractControl){
        return (control: AbstractControl)=>{

            if(control.value != toCompare.value) return { noMatch: true}
            
            return null; // Retorna null si los valores coinciden
        }
    }
};