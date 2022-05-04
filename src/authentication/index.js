import cookie from 'js-cookie';

// Set Cookie
const setCookie= (key, value)=> {
    cookie.set(key, value, {
        expires: 1,
    });
    
    // cookie.set(key, value, {
    //     expires: 1,
    // });
};

// Remove Cookie
const removeCookie= (key)=> {
    cookie.remove(key, {
        expires: 1,
    });
};

// Get cookie
const getCookie= (key)=> {   
    return cookie.get(key);
};

// LocalStorage
const setLocalStorage= (key, value)=> {
    localStorage.setItem(key, JSON.stringify(value));
};

// Remove Local Storage
const removeLocalStorage= (key)=> {
    localStorage.removeItem(key);
};

// Authenticate Users
const authenticateUser= (data)=> {
    // Reseting 
    removeCookie('token');
    removeLocalStorage('user');
    console.log(data);

    setCookie('token', data?.token);
    setLocalStorage('user', data?.user);
    if(userIsAuth()=== false) {
        return false;
    }else {
        console.log("Authenticated");
        return true;
    }    
};

// Validating Authentication of Users
const userIsAuth= ()=> {
    const cookieCheck = getCookie('token');
    if(cookieCheck) {
        if(localStorage?.getItem('user')) {
            return JSON.parse(localStorage?.getItem('user'));
        }else {
            return false;
        }
    }
    return false;
};

// Signout
const signoutUser = ()=> {
    removeCookie("token");
    removeLocalStorage("user");
}

export {
    setCookie,
    removeCookie,
    getCookie,
    setLocalStorage,
    removeLocalStorage,
    authenticateUser,
    userIsAuth,
    signoutUser,
};