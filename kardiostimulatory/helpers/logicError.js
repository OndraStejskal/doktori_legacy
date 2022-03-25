// error spočívající v bus logice
class LogicError extends Error {
    constructor(message) {
      super(message); 
    }
  };

module.exports = {
    LogicError
}