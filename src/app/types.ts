export interface Signup {
    username: string;
    password: string;
    key: string;
}

export interface Login {
    username: string;
    password: string;
}

export interface Authenticate {
    username: string;
    key: string;
    otp: string;
}