const harvestApp = require('./app/api');

const onListen = () => console.log(`listenAing on port ${process.env.PORT}`);

harvestApp.listen(process.env.PORT, onListen);
