import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User as AppUser, UserDocument } from 'src/users/user.schema';

export const User = createParamDecorator(
  (data: keyof UserDocument | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserDocument & { _id: string };
    return data ? user?.[data] : user;
  },
);
