import {emailAdapter} from "../adapters/email.adapter";


export const emailManager = {
    async sendEmailConfirmationMessage(email:any,code:string) {
        await emailAdapter.sendEmail(email, 'Email Confirmation', 'Передать код',code)
    }
}