import nodemailer from 'nodemailer';
import { config } from '../configs/config.js';

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    },
});

const sendMail = async ({ to, subject, html }) => {
    if (!config.email.pass) {
        console.warn('[email-service] SMTP_PASS no configurada. El envío de correos no funcionará.');
        return;
    }

    await transporter.sendMail({
        from: `"${config.email.fromName}" <${config.email.fromEmail}>`,
        to,
        subject,
        html,
    });
};

const supportBlock = `
<div style="margin-top: 20px; padding: 16px; background-color: #f0f7f4; border-left: 4px solid #1e616d; border-radius: 4px;">
    <p style="margin: 0 0 6px; font-weight: bold; color: #1e616d; font-size: 13px;">¿Necesitas ayuda?</p>
    <p style="margin: 0 0 8px; color: #555; font-size: 13px;">Comunícate con nuestro equipo de soporte:</p>
    <p style="margin: 0 0 4px; color: #333; font-size: 13px;">
        @ <a href="mailto:bibliotecain6bm@gmail.com" style="color: #1e616d; text-decoration: none;">bibliotecain6bm@gmail.com</a>
    </p>
</div>`;

const autoReply = `<p style="margin-top: 16px; color: #666; font-size: 13px;">Este es un correo automático, por favor no respondas a este mensaje.</p>`;

export const sendVerificationEmail = async (email, name, verificationToken, userId) => {
    try {
        const frontendUrl = config.app.frontendUrl || 'http://localhost:3000';
        const userIdParam = userId ? `&userId=${encodeURIComponent(userId)}` : '';
        const verificationUrl = `${frontendUrl}/verify-email?token=${encodeURIComponent(verificationToken)}${userIdParam}`;

        await sendMail({
            to: email,
            subject: 'Verifica tu dirección de correo electrónico',
            html: `
                <h2>¡Bienvenido/a ${name}!</h2>
                <p>Por favor, verifica tu dirección de correo electrónico haciendo click en el enlace de abajo:</p>
                <a href='${verificationUrl}' style='background-color: #1e616d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
                    Verificar correo electrónico
                </a>
                <p>Si no puedes hacer click en el enlace, copia y pega esta URL en tu navegador:</p>
                <p>${verificationUrl}</p>
                <p>Este enlace expirará en 24 horas.</p>
                <p>Si no creaste una cuenta, por favor ignora este correo.</p>
            `,
        });
    } catch (error) {
        console.error('Error al enviar el correo de verificación:', error);
        throw error;
    }
};

export const sendPasswordResetEmail = async (email, name, resetToken) => {
    try {
        const frontendUrl = config.app.frontendUrl || 'http://localhost:3000';
        const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

        await sendMail({
            to: email,
            subject: 'Restablece tu contraseña',
            html: `
                <h2>Solicitud de restablecimiento de contraseña</h2>
                <p>Hola ${name},</p>
                <p>Solicitaste restablecer tu contraseña. Haz click en el enlace de abajo para hacerlo:</p>
                <a href='${resetUrl}' style='background-color: #771c25; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
                    Restablecer contraseña
                </a>
                <p>Si no puedes hacer click en el enlace, copia y pega esta URL en tu navegador:</p>
                <p>${resetUrl}</p>
                <p>Este enlace expirará en 1 hora.</p>
                <p>Si no solicitaste esto, ignora este correo y tu contraseña permanecerá sin cambios.</p>
            `,
        });
    } catch (error) {
        console.error('Error al enviar el correo de restablecimiento de contraseña:', error);
        throw error;
    }
};

export const sendWelcomeEmail = async (email, name) => {
    try {
        await sendMail({
            to: email,
            subject: '¡Bienvenido/a a Biblioteca App!',
            html: `
                <h2>¡Bienvenido/a a Biblioteca App, ${name}!</h2>
                <p>Tu cuenta ha sido verificada y activada exitosamente.</p>
                <p>Ya puedes disfrutar de todas las funcionalidades de nuestra plataforma.</p>
                <p>Si tienes alguna pregunta, no dudes en contactar a nuestro equipo de soporte.</p>
                <p>¡Gracias por unirte a nosotros!</p>
            `,
        });
    } catch (error) {
        console.error('Error al enviar el correo de bienvenida:', error);
        throw error;
    }
};

export const sendPasswordChangedEmail = async (email, name) => {
    try {
        await sendMail({
            to: email,
            subject: 'Contraseña cambiada exitosamente',
            html: `
                <h2>Contraseña actualizada</h2>
                <p>Hola ${name},</p>
                <p>Tu contraseña ha sido actualizada exitosamente.</p>
                <p>Si no realizaste este cambio, contáctanos de inmediato.</p>
                ${supportBlock}
                ${autoReply}
            `,
        });
    } catch (error) {
        console.error('Error al enviar el correo de cambio de contraseña:', error);
        throw error;
    }
};

export const sendUsernameChangeEmail = async (email, name, token, newUsername) => {
    try {
        const frontendUrl = config.app.frontendUrl || 'http://localhost:3000';
        const confirmUrl = `${frontendUrl}/confirm-username-change?token=${token}`;

        await sendMail({
            to: email,
            subject: 'Confirma el cambio de nombre de usuario',
            html: `
                <h2>Solicitud de cambio de nombre de usuario</h2>
                <p>Hola ${name},</p>
                <p>Solicitaste cambiar tu nombre de usuario a: <strong>${newUsername}</strong></p>
                <p>Para confirmar el cambio, haz click en el botón de abajo:</p>
                <a href='${confirmUrl}' style='background-color: #1e616d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
                    Confirmar cambio de usuario
                </a>
                <p>Si no puedes hacer click en el enlace, copia y pega esta URL en tu navegador:</p>
                <p>${confirmUrl}</p>
                <p>Este enlace expirará en 1 hora.</p>
                <p>Si no solicitaste este cambio, ignora este correo y tu nombre de usuario permanecerá sin cambios.</p>
                ${autoReply}
            `,
        });
    } catch (error) {
        console.error('Error al enviar el correo de cambio de username:', error);
        throw error;
    }
};

export const sendPhoneChangeEmail = async (email, name, token, newPhone) => {
    try {
        const frontendUrl = config.app.frontendUrl || 'http://localhost:3000';
        const confirmUrl = `${frontendUrl}/confirm-phone-change?token=${token}`;

        await sendMail({
            to: email,
            subject: 'Confirma el cambio de número de teléfono',
            html: `
                <h2>Solicitud de cambio de número de teléfono</h2>
                <p>Hola ${name},</p>
                <p>Solicitaste cambiar tu número de teléfono a: <strong>${newPhone}</strong></p>
                <p>Para confirmar el cambio, haz click en el botón de abajo:</p>
                <a href='${confirmUrl}' style='background-color: #1e616d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
                    Confirmar cambio de teléfono
                </a>
                <p>Si no puedes hacer click en el enlace, copia y pega esta URL en tu navegador:</p>
                <p>${confirmUrl}</p>
                <p>Este enlace expirará en 1 hora.</p>
                <p>Si no solicitaste este cambio, ignora este correo y tu número de teléfono permanecerá sin cambios.</p>
                ${autoReply}
            `,
        });
    } catch (error) {
        console.error('Error al enviar el correo de cambio de teléfono:', error);
        throw error;
    }
};

export const sendDeactivateAccountEmail = async (email, name, token) => {
    try {
        const frontendUrl = config.app.frontendUrl || 'http://localhost:3000';
        const confirmUrl = `${frontendUrl}/confirm-deactivate-account?token=${token}`;

        await sendMail({
            to: email,
            subject: 'Confirma la desactivación de tu cuenta',
            html: `
                <h2>Solicitud de desactivación de cuenta</h2>
                <p>Hola ${name},</p>
                <p>Recibimos una solicitud para desactivar tu cuenta.</p>
                <p>Para confirmar, haz click en el botón de abajo:</p>
                <a href='${confirmUrl}' style='background-color: #771c25; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
                    Confirmar desactivación de cuenta
                </a>
                <p>Si no puedes hacer click en el enlace, copia y pega esta URL en tu navegador:</p>
                <p>${confirmUrl}</p>
                <p>Este enlace expirará en 1 hora.</p>
                <p>Si no solicitaste esto, ignora este correo y tu cuenta permanecerá activa.</p>
                ${autoReply}
            `,
        });
    } catch (error) {
        console.error('Error al enviar el correo de desactivación:', error);
        throw error;
    }
};

export const sendUsernameChangedEmail = async (email, name, newUsername) => {
    try {
        await sendMail({
            to: email,
            subject: 'Nombre de usuario actualizado exitosamente',
            html: `
                <h2>Nombre de usuario actualizado</h2>
                <p>Hola ${name},</p>
                <p>Tu nombre de usuario ha sido actualizado exitosamente a: <strong>${newUsername}</strong></p>
                <p>Si no realizaste este cambio, contáctanos de inmediato.</p>
                ${supportBlock}
                ${autoReply}
            `,
        });
    } catch (error) {
        console.error('Error al enviar el correo de confirmación de username:', error);
        throw error;
    }
};

export const sendPhoneChangedEmail = async (email, name, newPhone) => {
    try {
        await sendMail({
            to: email,
            subject: 'Número de teléfono actualizado exitosamente',
            html: `
                <h2>Número de teléfono actualizado</h2>
                <p>Hola ${name},</p>
                <p>Tu número de teléfono ha sido actualizado exitosamente a: <strong>${newPhone}</strong></p>
                <p>Si no realizaste este cambio, contáctanos de inmediato.</p>
                ${supportBlock}
                ${autoReply}
            `,
        });
    } catch (error) {
        console.error('Error al enviar el correo de confirmación de teléfono:', error);
        throw error;
    }
};

export const sendAccountDeactivatedEmail = async (email, name) => {
    try {
        await sendMail({
            to: email,
            subject: 'Cuenta desactivada exitosamente',
            html: `
                <h2>Cuenta desactivada</h2>
                <p>Hola ${name},</p>
                <p>Tu cuenta ha sido desactivada exitosamente.</p>
                <p>Si no realizaste este cambio o deseas reactivarla, contáctanos.</p>
                ${supportBlock}
                ${autoReply}
            `,
        });
    } catch (error) {
        console.error('Error al enviar el correo de desactivación de cuenta:', error);
        throw error;
    }
};

export const sendActivateAccountEmail = async (email, name, token) => {
    try {
        const frontendUrl = config.app.frontendUrl || 'http://localhost:3000';
        const confirmUrl = `${frontendUrl}/confirm-activate-account?token=${token}`;

        await sendMail({
            to: email,
            subject: 'Confirma la activación de tu cuenta',
            html: `
                <h2>Solicitud de activación de cuenta</h2>
                <p>Hola ${name},</p>
                <p>Recibimos una solicitud para activar tu cuenta.</p>
                <p>Para confirmar, haz click en el botón de abajo:</p>
                <a href='${confirmUrl}' style='background-color: #1e616d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
                    Confirmar activación de cuenta
                </a>
                <p>Si no puedes hacer click en el enlace, copia y pega esta URL en tu navegador:</p>
                <p>${confirmUrl}</p>
                <p>Este enlace expirará en 1 hora.</p>
                <p>Si no solicitaste esto, ignora este correo.</p>
                ${autoReply}
            `,
        });
    } catch (error) {
        console.error('Error al enviar el correo de activación:', error);
        throw error;
    }
};

export const sendAccountActivatedEmail = async (email, name) => {
    try {
        await sendMail({
            to: email,
            subject: 'Cuenta activada exitosamente',
            html: `
                <h2>Cuenta activada</h2>
                <p>Hola ${name},</p>
                <p>Tu cuenta ha sido activada exitosamente.</p>
                <p>Ya puedes iniciar sesión y disfrutar de todas las funcionalidades.</p>
                ${autoReply}
            `,
        });
    } catch (error) {
        console.error('Error al enviar el correo de confirmación de activación:', error);
        throw error;
    }
};

export const sendAccountCreatedByAdminEmail = async (email, name, password) => {
    try {
        await sendMail({
            to: email,
            subject: 'Tu cuenta ha sido creada',
            html: `
                <h2>Bienvenido/a ${name}</h2>
                <p>Un administrador ha creado una cuenta para ti.</p>
                <p>Tus credenciales de acceso son:</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Contraseña temporal:</strong> ${password}</p>
                <p style='background-color: #f4f4f4; padding: 10px;'>Te recomendamos cambiar tu contraseña al iniciar sesión.</p>
                ${supportBlock}
                ${autoReply}
            `,
        });
    } catch (error) {
        console.error('Error al enviar correo de cuenta creada:', error);
        throw error;
    }
};

export const sendAccountDeletedEmail = async (email, name) => {
    try {
        await sendMail({
            to: email,
            subject: 'Tu cuenta ha sido eliminada',
            html: `
                <h2>Cuenta eliminada</h2>
                <p>Hola ${name},</p>
                <p>Tu cuenta ha sido eliminada por un administrador.</p>
                <p>Si crees que esto es un error, contáctanos de inmediato.</p>
                ${supportBlock}
                ${autoReply}
            `,
        });
    } catch (error) {
        console.error('Error al enviar correo de cuenta eliminada:', error);
        throw error;
    }
};

export const sendAccountDeactivatedByAdminEmail = async (email, name) => {
    try {
        await sendMail({
            to: email,
            subject: 'Tu cuenta ha sido desactivada',
            html: `
                <h2>Cuenta desactivada</h2>
                <p>Hola ${name},</p>
                <p>Tu cuenta ha sido desactivada por un administrador.</p>
                <p>Si deseas apelar esta decisión, contáctanos.</p>
                ${supportBlock}
                ${autoReply}
            `,
        });
    } catch (error) {
        console.error('Error al enviar correo de cuenta desactivada:', error);
        throw error;
    }
};

export const sendAccountUpdatedByAdminEmail = async (email, name, updatedData) => {
    try {
        await sendMail({
            to: email,
            subject: 'Tu cuenta ha sido modificada',
            html: `
                <h2>Cuenta modificada</h2>
                <p>Hola ${name},</p>
                <p>Un administrador ha modificado tu cuenta. Estos son tus nuevos datos:</p>
                <ul>
                    ${updatedData.name ? `<li><strong>Nombre:</strong> ${updatedData.name}</li>` : ''}
                    ${updatedData.surname ? `<li><strong>Apellido:</strong> ${updatedData.surname}</li>` : ''}
                    ${updatedData.phone ? `<li><strong>Teléfono:</strong> ${updatedData.phone}</li>` : ''}
                </ul>
                <p>Si no reconoces estos cambios, contáctanos de inmediato.</p>
                ${supportBlock}
                ${autoReply}
            `,
        });
    } catch (error) {
        console.error('Error al enviar correo de cuenta modificada:', error);
        throw error;
    }
};
