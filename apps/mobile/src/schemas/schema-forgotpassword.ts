import * as yup from 'yup';

export const ForgotPasswordSchema = yup.object().shape({
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
});

