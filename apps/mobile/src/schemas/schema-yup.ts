import * as yup from "yup";

export const SignUpSchema = yup.object().shape({
    name: yup
        .string()
        .required("Nome é Obrigatório!"),
    email: yup
        .string()
        .email("Email Inválido!")
        .required("Email é Obrigatório!"),
    phone: yup
        .string()
        .required("Telefone é Obrigatório!")
        .min(14, 'Telefone deve ter no mínimo 8 digítos'),
    TransportType: yup
        .string()
        .oneOf(["BUGGY", "LANCHA", "FOUR_BY_FOUR"], "Tipo de Transporte Inválido!")
        .required("tipo de Transporte é Obrigatório!"),
    password: yup
        .string()
        .required("Senha é Obrigatório!")
        .min(8, "Senha deve ter no mínimo 8 caracteres"),
    password_confirmation: yup
        .string()
        .oneOf([yup.ref('password'), undefined], "Senhas não são iguais!")
        .required("Confirmar Senha é Obrigatório!")
});

export const SignInSchema = yup.object().shape({
    email: yup
        .string()
        .email("Email Inválido!")
        .required("Email é Obrigatório!"),
    password: yup
        .string()
        .required("Senha é Obrigatório!")
        .min(6, "Senha deve ter no mínimo 6 caracteres")
});

export type BasicRegister = yup.InferType<typeof SignUpSchema>;