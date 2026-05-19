import {Router} from "express";
import {
    authValidator, emailCodeResendingValidator,
    isCreatedUserValidator,
    meValidator,
    newPasswordValidator,
    registrationValidator
} from "../../auth/middlewares/authValidator";
import {authMiddleware} from "../../global-middleware/auth.middleware";
import {emailValidator} from "../../users/middlewares/users.validator";
import {authRefreshMiddleware} from "../../global-middleware/auth.refresh.middleware";
import {apiRequestMiddleware} from "../../devices/middlewares/device.middleware";
import {AuthController} from "../../auth/controllers/auth.controller";
import {container} from "../../composition-root";
import {inputCheckErrorsMiddleware} from "../../global-middleware/inputCheckErrorMiddleware";


const authController = container.get(AuthController)
export const authRouter = Router()

authRouter.post('/login', authValidator, authController.login.bind(authController))
authRouter.get('/me', meValidator, authMiddleware, authController.me.bind(authController))
authRouter.post('/registration', registrationValidator, apiRequestMiddleware, isCreatedUserValidator, authController.registration.bind(authController))
authRouter.post('registration-confirmation', emailCodeResendingValidator, apiRequestMiddleware, authController.registrationConfirmation.bind(authController))
authRouter.post('/registration-email-resending', emailValidator, apiRequestMiddleware, authController.resendRegistrationCode.bind(authController))
authRouter.post('/logout', authRefreshMiddleware, authController.logout.bind(authController))
authRouter.post('/refresh-token', authRefreshMiddleware, authController.refreshToken.bind(authController))

authRouter.post('/password-recovery', emailValidator, inputCheckErrorsMiddleware, apiRequestMiddleware, authController.passwordRecovery.bind(authController))
authRouter.post('/new-password', newPasswordValidator, inputCheckErrorsMiddleware, apiRequestMiddleware, authController.newPassword.bind(authController))