// types.ts

import { Request } from 'express';
import { DecodedToken } from '../services/auth.service';

interface CustomRequest extends Request {
  user?: DecodedToken;
}

export default CustomRequest;
