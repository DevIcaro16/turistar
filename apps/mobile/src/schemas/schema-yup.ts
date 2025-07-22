import * as Yup from 'yup';

export const SignUpSchema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    phone: Yup.string().required('Telefone é obrigatório'),
    password: Yup.string().required('Senha é obrigatória'),
    password_confirmation: Yup.string()
        .oneOf([Yup.ref('password'), ''], 'As senhas devem coincidir')
        .required('Confirmação de senha é obrigatória'),
    TransportType: Yup.string().when('$activeTab', {
        is: (val: string) => val === 'driver',
        then: schema => schema.required('Tipo de transporte é obrigatório'),
        otherwise: schema => schema.notRequired(),
    }),
});

export const SignInSchema = Yup.object().shape({
    email: Yup.string()
        .email('Email Inválido!')
        .required('Email é Obrigatório!'),
    password: Yup.string()
        .required('Senha é Obrigatório!')
        .min(6, 'Senha deve ter no mínimo 8 caracteres'),
});

export type BasicRegister = Yup.InferType<typeof SignUpSchema>;
