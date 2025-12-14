// client/src/pages/company/SupplyCalendar.jsx
import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import api from '../../utils/api';
import TranslatedText from '../../components/TranslatedText';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const SupplyCalendar = () => {
  const [contracts, setContracts] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchContracts();
  }, []);
  
  const fetchContracts = async () => {
    try {
      const response = await api.get('/contracts/company');
      setContracts(response.data.contracts.filter(c => c.status === 'Confirmed'));
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const getDeliveriesForDay = (day) => {
    return contracts.filter(contract => 
      contract.details.harvestDates?.some(date => 
        isSameDay(new Date(date), day)
      )
    );
  };
  
  if (loading) {
    return <div className="text-center py-12">
      <TranslatedText>Loading calendar...</TranslatedText>
    </div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          <TranslatedText>Supply Calendar</TranslatedText>
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="px-3 py-2 border rounded-md hover:bg-gray-50"
          >
            ←
          </button>
          <span className="px-4 py-2 font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="px-3 py-2 border rounded-md hover:bg-gray-50"
          >
            →
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-700 py-2">
              <TranslatedText>{day}</TranslatedText>
            </div>
          ))}
          
          {/* Empty cells for days before month starts */}
          {Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <div key={`empty-${index}`} className="min-h-24 border border-gray-200 bg-gray-50"></div>
          ))}
          
          {/* Calendar days */}
          {daysInMonth.map(day => {
            const deliveries = getDeliveriesForDay(day);
            const totalQuantity = deliveries.reduce((sum, c) => sum + c.details.quantity, 0);
            
            return (
              <div
                key={day.toISOString()}
                className={`min-h-24 border border-gray-200 p-2 ${
                  !isSameMonth(day, currentMonth) ? 'bg-gray-50' : 'bg-white'
                } ${deliveries.length > 0 ? 'border-secondary border-2' : ''}`}
              >
                <div className="text-sm font-medium text-gray-700 mb-1">
                  {format(day, 'd')}
                </div>
                
                {deliveries.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs bg-secondary text-white px-2 py-1 rounded">
                      {deliveries.length} <TranslatedText>deliveries</TranslatedText>
                    </div>
                    <div className="text-xs text-gray-600">
                      {totalQuantity} kg
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Upcoming Deliveries List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          <TranslatedText>Upcoming Deliveries</TranslatedText>
        </h2>
        
        {contracts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            <TranslatedText>No scheduled deliveries</TranslatedText>
          </p>
        ) : (
          <div className="space-y-3">
            {contracts.slice(0, 5).map(contract => (
              <div key={contract._id} className="border-l-4 border-secondary pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{contract.farmerId.personalInfo.name}</p>
                    <p className="text-sm text-gray-600">
                      {contract.details.quantity} kg • {contract.details.cropType}
                    </p>
                  </div>
                  <div className="text-right">
                    {contract.details.harvestDates && contract.details.harvestDates[0] && (
                      <p className="text-sm font-medium">
                        {format(new Date(contract.details.harvestDates[0]), 'MMM dd, yyyy')}
                      </p>
                    )}
                    <p className="text-xs text-gray-600">{contract.details.pickupTime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplyCalendar;
