export const asyncFunction = (Func: Function) => (req: any, res: any, next: any) => {
    Promise.resolve(Func(req, res, next)).catch(next)
}