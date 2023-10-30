import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service'; 

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Utiliza el servicio de Firebase para obtener el estado de autenticación del usuario
    return this.firebaseSvc.getAuthState().pipe(map(auth =>{

      // Si no hay usuario autenticado, permite el acceso a la ruta
      if (!auth){
        return true;
      } else{
        // Si hay un usuario autenticado, redirige a la ruta '/tabs/home'
        this.utilsSvc.routerLink('/tabs/home')
        return false
      } 
    }));
  }
}