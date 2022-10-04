export default class errorHandler extends Error {
    public readonly message!: string
    public readonly statusCode!: number

    constructor(message : string, statusCode : number){
        
        super(message)
        this.statusCode = statusCode

        Error.captureStackTrace(this, this.constructor)

    }

}