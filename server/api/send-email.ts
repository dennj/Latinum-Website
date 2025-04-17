import { Resend } from 'resend'

const resend = new Resend("re_PqKBMJpE_JjfQXQrosvu25rqD6bPhDo7W")

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body.email || !body.message) {
        return createError({ statusCode: 400, statusMessage: 'Missing fields' })
    }

    try {
        await resend.emails.send({
            from: 'Latinum Contact <website@latinum.ai>',
            to: 'dennj.osele@gmail.com',
            subject: 'New message from Latinum.ai contact form',
            html: `
        <p><strong>From:</strong> ${body.email}</p>
        <p><strong>Message:</strong></p>
        <p>${body.message.replace(/\n/g, '<br>')}</p>
      `,
        })
        return { success: true }
    } catch (err) {
        console.error('Email sending error:', err)
        return createError({ statusCode: 500, statusMessage: 'Failed to send email' })
    }
})