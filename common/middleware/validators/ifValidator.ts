import express from 'express';
import { ValidationChain, validationResult } from "express-validator";

export function ifValidator(field: string, validator: ValidationChain) {
    return (value: any, { req }: { req: any }) => {
        if (req.body[field]) {
            return validator.run(req);
        } else {
            return Promise.resolve()
        }
    }
}

