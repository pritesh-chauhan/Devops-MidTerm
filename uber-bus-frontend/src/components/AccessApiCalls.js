import axios from 'axios';
const url = "http://localhost:5000/";

export const signUp = newUser => {
    return axios
    .post(url+"signup", {
        fname: newUser.fname,
        lname: newUser.lname,
        email: newUser.email,
        password: newUser.password
    }).then(res => {
        console.log(res);
        return res;
    }).catch(res => {
        console.log(res);
        let errorMessage = {"message": "error"}
        return errorMessage;
    })
}

export const signIn = user => {
    return axios
    .post(url + "signin", {
        email: user.email,
        password: user.password
    }).then(res => {
        console.log(res);
        return res;
    }).catch(res => {
        console.log(res);
        let errorMessage = {"message": "error"}
        return errorMessage;
    })
}