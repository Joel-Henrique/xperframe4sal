let UserProfile = (function() {
  let name = "";
  let answredICF = false;
  let email = "";
  let userName = email;
  let pesquisador = false;
  let token = "";

  let user = {}

  let getPesquisador = function() {
    return pesquisador;
  };

  let getName = function() {
    return name;
  };

  let setName = function(userName) {
    name = userName;
  };
  let setPesquisador = function(pesquisador) {
    pesquisador = pesquisador;
  };

  let getEmail = function() {
    return email;
  };

  let setEmail = function(userEmail) {
    email = userEmail;
  };

  let getToken = function() {
    return token;
  };

  let setToken = function(userToken) {
    token = userToken;
  };

  let getUserName = function() {
    return userName;
  };

  let setUserName = function(userEmail) {
    userName = userEmail;
  };

  let getAnswredICF = function() {
    return answredICF;
  };

  let setAnswredICF = function(userAnswredICF) {
    answredICF = userAnswredICF;
  };
  

  let setUser = function({name, pesquisador, email, answredICF, token}) {
    setPesquisador(pesquisador);
    setName(name); 
    setEmail(email);
    setAnswredICF(answredICF);
    setToken(token);
    user = {name: name,pesquisador:pesquisador, email: email, answredICF: answredICF, token: token}
  }

  let getUser = function() {
    return user;
  }


  return {
    getPesquisador : getPesquisador,
    setPesquisador: setPesquisador,
    getName: getName,
    setName: setName,
    getAnswredICF: getAnswredICF,
    getEmail: getEmail,
    setEmail: setEmail,
    getUserName: getUserName,
    setUserName: setUserName,
    getToken: getToken,
    setToken: setToken,
    getUser: getUser,
    setUser: setUser
  }

})();

export default UserProfile;