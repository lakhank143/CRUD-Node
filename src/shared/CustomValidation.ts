import { body, check } from 'express-validator';

export const validateInput = () => {
    return [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({ min: 6 })
    ]
}
