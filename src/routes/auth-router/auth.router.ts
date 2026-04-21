import {Router} from "express";
import {loginController} from "../../auth/controllers/login.controller";
import {meController} from "../../auth/controllers/me.controller";
import {
    authValidator, emailCodeResendingValidator,
    isCreatedUserValidator,
    meValidator,
    registrationValidator
} from "../../auth/middlewares/authValidator";
import {authMiddleware} from "../../global-middleware/auth.middleware";
import {registrationController} from "../../auth/controllers/registration.controller";
import {registrationConfirmationController} from "../../auth/controllers/registration.confirmation.controller";
import {emailValidator} from "../../users/middlewares/users.validator";
import {registrationEmailResendingController} from "../../auth/controllers/registration.email.resending.controller";

export const authRouter = Router({})

authRouter.post('/login', authValidator, loginController)
authRouter.get('/me', meValidator, authMiddleware, meController)
authRouter.post('/registration', registrationValidator, isCreatedUserValidator, registrationController)
authRouter.post('registration-confirmation', emailCodeResendingValidator, registrationConfirmationController)
authRouter.post('/registration-email-resending', emailValidator, registrationEmailResendingController)