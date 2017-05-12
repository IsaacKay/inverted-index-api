const NODE_ENV = process.env.NODE_ENV;
const setPort = (app) => {
  // set port based on the  NODE_ENV  VALUE
  if (NODE_ENV === 'PROD') {
    app.set('PORT', process.env.PORT_PROD);
  } else if (NODE_ENV === 'DEV') {
    app.set('PORT', process.env.PORT_DEV);
  } else {
    app.set('PORT', process.env.PORT_TEST);
  }
};
export default { setPort };
