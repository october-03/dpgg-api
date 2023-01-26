import { Request } from 'express';
import { User } from './entities/user.entity';

interface RequestUser extends Request {
  user: User;
}

export default RequestUser;
