import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt  from 'jsonwebtoken';
import { userModel } from '../models/userModel'

import { IGetUserAuthInfoRequest } from '../shared/requestModel';

export class UserController {

    async createOrSignUpUser(req: Request, res: Response) {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {

            let temp = errors.array();
            let obj  = {
                'message': temp[0].msg,
                'status': 400
            }
            return res.status(400).send({ error: obj })
        }

        let { first_name, last_name, gender, email, password, role } = req.body

        try {
            let user: any = await userModel.findOne({ email })
            if(user) {
                return res.status(400).send({
                    message: 'User Already Exists',
                    status: 400
                })
            }

            const salt = await bcrypt.genSalt(10)
            password = await bcrypt.hash(password, salt)

            user = new userModel({
                first_name, 
                last_name, 
                gender, 
                email, 
                password, 
                role
            })

            await user.save()

            delete user._doc.password;
            delete user._doc.tokens;

            let  responseData = {
                'message': 'OK',
                'status': 200,
                'data': user
            }

            res.status(200).send(responseData)

        } catch(e) {
            res.status(500).send("Error in Saving"); 
        }
    }

    async loginUser(req: Request, res: Response) {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {

            let temp = errors.array();
            let obj  = {
                'message': temp[0].msg,
                'status': 400
            }
            return res.status(400).send({ error: obj })
        } 
        
        const  { email, password} =  req.body;

        try {
            let user:any = await userModel.findOne({ email })

            if(!user) {
                return res.status(400).send({
                    message: 'User Not Exist',
                    status: 400
                })
            }
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).send({
                    message: "Incorrect Password !",
                    status: 400
                })
            }
           
            const token = jwt.sign( { _id: user.id.toString() }, "randomString") 
            
            user.tokens = user.tokens.concat({ token })
            
            await user.save();
            
            delete user._doc.password;
            delete user._doc.tokens;

            let  responseData = {
                'message': 'OK',
                'status': 200,
                'data': {user, token}
            }

            res.status(200).send(responseData)

        } catch(e) {
            res.status(500).send({
                message: "Server Error",
                status: 500
            });
        }
    }

    async getProfile(req: IGetUserAuthInfoRequest, res: Response) {
        let temp = {...req.user._doc}

        delete temp.password;
        delete temp.tokens;
        
        res.status(200).send({
            'message': 'OK',
            'status': 200,
            'data': temp
        });
    }

    async updateProfile(req: IGetUserAuthInfoRequest, res: Response) {
        const updateKeys = Object.keys(req.body);

        const allowedUpdates = [ 'first_name', 'last_name', 'gender', 'email', 'password', 'role' ]

        const isValidate = updateKeys.every((update) => allowedUpdates.includes(update))

        if(!isValidate) {
            return res.status(400).send({ error: 'Invalid Property Updating!' })
        }

        try {

            updateKeys.forEach((update) => {
                req.user[update] = req.body[update];
            })

            const salt = await bcrypt.genSalt(10)
            req.user.password = await bcrypt.hash(req.user.password, salt)

            await req.user.save();
            
            delete req.user._doc.password;
            delete req.user._doc.tokens;

            let responseObj = {
                'message': 'OK',
                'status': 200,
                'data': req.user
            }

            res.send(responseObj)

        } catch(e) {
            res.status(400).send(e)
        }
    }

    async deleteProfile(req: IGetUserAuthInfoRequest, res: Response) {
        try {
            await req.user.remove();

            delete req.user._doc.password;
            delete req.user._doc.tokens;
            
            let responseObj = {
                'message': 'OK',
                'status': 200,
                'data': req.user
           }
    
            res.send(responseObj)
    
        } catch (e) {
            res.status(500).send()
        }
    }

    async logOut(req: IGetUserAuthInfoRequest, res: Response) {
        try {
            req.user.tokens = req.user.tokens.filter((token:any) => {
                return token.token !== req.token
            })
            await req.user.save()
    
            res.send()
        } catch (e) {
            res.status(500).send()
        }
    }

    async logoutAll(req: IGetUserAuthInfoRequest, res: Response) {
        try {
            req.user.tokens = []
            await req.user.save()
            res.send()
        } catch (e) {
            res.status(500).send()
        }    
    }

    async getAllUsers(req: Response, res: Response) {
        try {
            const users:any = await userModel.find({})

            let temp = [...users]

            temp.forEach(element => {
                delete element._doc.password
                delete element._doc.tokens
            })

            let responseObj = {
                'message': 'OK',
                'status': 200,
                'data': temp
           }
           res.send(responseObj)
           
        } catch(e) {
            res.status(500).send(e)
        }
    }
}   