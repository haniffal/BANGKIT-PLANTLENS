const { getHistoryHandler, uploadImageAndPredictHandler } = require('./handler');

const routes = [
{
    method: 'GET',
    path: '/',
    handler: () => {
        return { status: 'success', message: 'Welcome to the API' };
    },
},
{
    method: 'GET',
    path: '/history',
    handler: getHistoryHandler,
},

{
    method: 'POST',
    path: '/predict',
    handler: uploadImageAndPredictHandler,
    options: {
        payload: {
            allow: 'multipart/form-data',
            multipart: true,
            output: 'stream',
            parse: true,
            maxBytes: 5 * 1024 * 1024,
        },
    },
},

];

module.exports = routes;
