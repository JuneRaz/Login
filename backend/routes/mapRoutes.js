var express = require('express');
const router= express.Router();

const {GetPosition, GetAllDetails}= require('../controllers/map');


router.get('/list/:level', GetAllDetails);
router.get('/marker/:level', GetPosition);

const MapRoute = router;
module.exports = MapRoute;