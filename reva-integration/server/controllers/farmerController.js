import Farmer from '../models/Farmer.js';
import axios from 'axios';

export const getProfile = async (req, res) => {
  try {
    console.log('👤 Profile request for user:', req.user?.id);
    
    let farmer = await Farmer.findById(req.user?.id);
    
    if (!farmer && req.user?.id) {
      // 🌍 DYNAMIC IP LOCATION
      const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress || '8.8.8.8';
      
      const geoResponse = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,country,city,regionName,lat,lon`, { 
        timeout: 3000 
      });
      
      console.log('🌍 GeoIP:', geoResponse.data);
      
      farmer = new Farmer({
        _id: req.user.id,
        phone: req.user.phone || 'Unknown',
        name: `Farmer ${ip.split('.').pop()}`, 
        city: geoResponse.data.city || 'Pune',
        state: geoResponse.data.regionName || 'Maharashtra',
        gpsLocation: {
          lat: geoResponse.data.lat || 18.5204,
          lng: geoResponse.data.lon || 73.8567
        },
        soilType: 'Loamy'
      });
      await farmer.save();
      console.log('✅ New profile created:', farmer._id);
    }
    
    // Ensure GPS exists
    if (!farmer.gpsLocation) {
      farmer.gpsLocation = { lat: 18.5204, lng: 73.8567 };
      await farmer.save();
    }
    
    res.json({ success: true, farmer });
  } catch (error) {
    console.error('Profile error:', error);
    // EMERGENCY FALLBACK
    res.json({
      success: true,
      farmer: {
        _id: req.user?.id || 'fallback',
        name: 'Test Farmer',
        gpsLocation: { lat: 18.5204, lng: 73.8567 },
        soilType: 'Loamy'
      }
    });
  }
};
