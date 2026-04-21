import {emailAdapter} from "../adapters/email.adapter";

export const businessServis = {
    async sendEmail(email: string, subject: string, message: string, code?: string) {
        await emailAdapter.sendEmail(email, subject, message, code)
    }
}