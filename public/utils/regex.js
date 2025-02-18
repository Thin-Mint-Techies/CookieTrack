const expressions = {
    name: new RegExp(/^[a-zA-Z]+[a-zA-Z-]*$/),
    email: new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm, "gm"),
    phone: new RegExp(/^\(\d{3}\) \d{3}-\d{4}$/),
    password: new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/gm, "gm")
}

export const regExpCalls = {
    testName: function(name) {
        return expressions.name.test(name);
    },
    testEmail: function(email) {
        return expressions.email.test(email);
    },
    testPhone: function(phone) {
        return expressions.phone.test(phone);
    },
    testPassword: function(password) {
        return expressions.password.test(password);
    }
}