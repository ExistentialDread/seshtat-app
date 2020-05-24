export interface Payment {
    id: string;
    time: string;
    status: string;
    amount: {
        currency: string
        value: number
    };
    payer: {
        country_code: string;
        given_name: string;
        surname: string;
        email: string;
        id: string;
    };
    payee: {
        email: string;
        id: string;
    };
}
