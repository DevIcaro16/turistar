import * as Yup from 'yup';

export const NewPasswordSchema = Yup.object().shape({
    password: Yup.string().required('Senha é obrigatória'),
    password_confirmation: Yup.string()
        .oneOf([Yup.ref('password'), ''], 'As senhas devem coincidir')
        .required('Confirmação de senha é obrigatória'),
});