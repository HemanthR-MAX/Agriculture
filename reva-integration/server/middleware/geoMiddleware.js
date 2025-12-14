// NEW FILE: server/middleware/geoMiddleware.js
import axios from 'axios';

export const autoGeoLocation = async (req, res, next) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] 
             || req.connection.remoteAddress 
             || req.socket.remoteAddress 
             || '8.8.8.8';
    
    console.log('🌍 IP detected:', ip);
    
    // AUTO IP → CITY (FREE!)
    const geoRes = await axios.get(`http://ip-api.com/json/${ip}?fields=status,country,city,regionName,lat,lon`, {
      timeout: 2000
    });
    
    req.geo = geoRes.data;
    console.log('✅ Auto-location:', geoRes.data.city, geoRes.data.lat, geoRes.data.lon);
    
  } catch (error) {
    console.log('❌ GeoIP failed, using fallback');
    req.geo = { city: 'Pune', lat: 18.5204, lng: 73.8567 };
  }
  
  next();
};
