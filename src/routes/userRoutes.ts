import { UserController } from '../controller/userController';
import { check } from 'express-validator';
import { Auth } from '../middleware/auth';
import { validateInput } from '../shared/CustomValidation';

export class Routes {

    userController: UserController = new UserController();
    auth: Auth = new Auth();

    public routes(app: any): void {

        app.route('/signUp').post(validateInput(), this.userController.createOrSignUpUser)

        app.route('/login').post(validateInput(), this.userController.loginUser)

        app.route('/me').get(this.auth.authUser, this.userController.getProfile)

        app.route('/updateUser/me').patch(this.auth.authUser, this.userController.updateProfile)
        
        app.route('/deleteUser/me').delete(this.auth.authUser, this.userController.deleteProfile)
        
        app.route('/logout').post(this.auth.authUser, this.userController.logOut)

        app.route('/logoutAll').post(this.auth.authUser, this.userController.logoutAll)
        
        app.route('/getAllUsers').get(this.auth.authRole, this.userController.getAllUsers)
    }
}
