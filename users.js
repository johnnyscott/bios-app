var users = [
  {"email": "joe@blow.com", "password": "number"}
];

var getFirstObjectMatchingKvs = function (array, matchObj){
  var result,
      matchKeys = Object.keys(matchObj);

  array.some(function (currentElement, index, originalArray){
    var matchFound = true;

    matchKeys.forEach(function (key, keyIndex, keysArray){
      if(currentElement[key] !== matchObj[key]){
        matchFound = false;
      }
    });

    if(matchFound === true){
      result = currentElement;
    }

    return matchFound;
  });

  return result;
};

exports.getUser = function (email, password){
  return getFirstObjectMatchingKvs(users, {"email": email, "password": password});
};
