import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';


interface accessMapObject{
    [route:string]:{
      visibleTo:number[],
      fallbackRoute:string
    },
}

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log(state.url)
  const accessMaps:accessMapObject = {
    "orders":{
      visibleTo : [1,2,3],
      fallbackRoute: "/kds"
    },
    "kds":{
      visibleTo : [0,1,2,3],
      fallbackRoute: "/accounts/login"
    },
    "dashboard":{
      visibleTo : [2,3],
      fallbackRoute: "/orders"
    },
    "team":{
      visibleTo : [3],
      fallbackRoute: "/orders"
    },
    "products":{
      visibleTo : [1,2,3],
      fallbackRoute: "/kds"
    },
    "recipes":{
      visibleTo : [2,3],
      fallbackRoute: "/orders"
    },
    "inventory":{
      visibleTo : [2,3],
      fallbackRoute: "/orders"
    },
    "pos":{
      visibleTo : [1,2,3],
      fallbackRoute: "/kds"
    },
    "onboarding":{
      visibleTo : [3],
      fallbackRoute: "/accounts/login"
    },
    "print":{
      visibleTo : [0,1,2,3],
      fallbackRoute: "/accounts/login"
    },
    "table-manager":{
      visibleTo : [2,3],
      fallbackRoute: "/orders"
    },
  }

  const currentAccess = accessMaps[state.url.split("/")[1]];
  console.log(state.url.split("/"))

  if (authService.isAuthenticated() && currentAccess.visibleTo.includes(authService.accessLevel())) {
    return true;
  }

  // Redirect to the login page
  return router.parseUrl(currentAccess.fallbackRoute);
};
