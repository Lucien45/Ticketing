const AddToken = (nom: string, data: string) => {
    return localStorage.setItem(nom, data);
}

const GetToken = (nom: string) => {
    return localStorage.getItem(nom);
}

const RemoveToken = (nom: string) => {
    return localStorage.removeItem(nom);
}

export const Token = {
    AddToken, GetToken, RemoveToken
}