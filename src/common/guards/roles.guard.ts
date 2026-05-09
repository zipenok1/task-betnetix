import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    let requiredRoles = this.reflector.get<string[]>('roles', context.getHandler())

    if(!requiredRoles){
      requiredRoles = this.reflector.get<string[]>('roles', context.getClass())
    }
    
    if(!requiredRoles) return true

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if(!user) throw new ForbiddenException('нет доступа')

    const hasRole = requiredRoles.includes(user.role)
    if(!hasRole) throw new ForbiddenException('недостаточно прав')
    
    return true
  }
}