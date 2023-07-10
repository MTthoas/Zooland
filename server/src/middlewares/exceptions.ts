import { ApiException } from "./exceptions.handle";

export class HttpException extends Error {
    constructor(public status: number, public error: string) {
        super(error)
    }
}

export class NotFoundException extends HttpException {
    constructor(error: string) {
        super(404, error)
    }
}

export class BadRequestException extends HttpException {
    constructor(error: string) {
        super(400, error)
    }
}

export class UnauthorizedException extends HttpException {
    constructor(error: string) {
        super(401, error)
    }
}

