const isEmail = (email) => {
  var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email.match(emailFormat)) {
    return true;
  }
  return false;
};

const isPhone = (phone) => {
  var phoneFormat = /^\d+$/;
  if (phone.match(phoneFormat)) {
    return true;
  }
  return false;
};

const isIdentifier = (type, identifier) => {
    if(type == "ca nhan") {
        if (identifier.length >= 9 && identifier.length <=12) {
          return true
        }
        return false;
    }
    return true
};

module.exports = {
  isEmail,
  isPhone,
  isIdentifier,
};
