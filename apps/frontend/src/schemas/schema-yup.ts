import * as Yup from 'yup';

export const SignInSchema = Yup.object().shape({
    email: Yup.string()
        .email('Email Inválido!')
        .required('Email é Obrigatório!'),
    password: Yup.string()
        .required('Senha é Obrigatório!')
        .min(6, 'Senha deve ter no mínimo 8 caracteres'),
});

export type BasicRegister = Yup.InferType<typeof SignInSchema>;
