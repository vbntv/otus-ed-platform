const config = {};

config.logDir = 'logs';
config.appPort = process.env.APP_PORT || 8000;
config.secretKey = process.env.SECRET_KEY;

const videoConfig = {};

videoConfig.uploadPath = 'uploads/videos';
videoConfig.maxFileSize = 10000000;

export {config, videoConfig};