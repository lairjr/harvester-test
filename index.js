const harvestApp = require('./app/api');
const port = process.env.PORT || 3000;

const onListen = () => console.log(`listening on port ${port}`);

harvestApp.listen(port, onListen);
