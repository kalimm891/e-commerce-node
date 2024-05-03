var sessionStore =  new Map();


function setUserId(id, user){
    sessionStore.set(id, user);
}

function getUserId(id){
  return  sessionStore.set(id);


}


module.exports ={
    setUserId,
    getUserId
}