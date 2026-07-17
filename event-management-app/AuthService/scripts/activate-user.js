import { findUserByEmail, markEmailAsVerified } from '../helpers/user-db.js';

async function activate() {
    const email = 'bibliotecain6bm@gmail.com';

    try {
        console.log(`Buscando usuario: ${email}...`);
        const user = await findUserByEmail(email);

        if (!user) {
            console.error('Error: usuario no encontrado.');
            process.exit(1);
        }

        console.log(`Usuario encontrado: ${user.Username} (ID: ${user.Id})`);
        console.log('Activando cuenta y verificando email...');

        await markEmailAsVerified(user.Id);

        console.log('-----------------------------------------');
        console.log('CUENTA ACTIVADA EXITOSAMENTE');
        console.log('-----------------------------------------');
        console.log('Ya puedes ir al login e iniciar sesion.');
        process.exit(0);
    } catch (error) {
        console.error('Error durante la activacion:', error);
        process.exit(1);
    }
}

activate();
