import * as yup from "yup";

export type typeUser = 'user' | 'driver';

export interface FormValues {
    email: string;
    password: string;
}

export const SignInSchema = yup.object().shape({
    email: yup.string().email('Email inválido').required('Email obrigatório'),
    password: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha obrigatória'),
}); 